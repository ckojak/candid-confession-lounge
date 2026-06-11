import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { MoodId } from "../lib/mood";

export interface Comment {
  id: string;
  postId: string;
  authorId: string | null; // null if anonymous (we still track to allow "my comments" later if needed)
  authorName: string; // snapshot, "Anônimo" if anonymous
  anonymous: boolean;
  authorVerified: boolean;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string; // snapshot
  authorVerified: boolean; // snapshot
  anonymous: boolean;
  mood: MoodId;
  text: string;
  likes: number;
  likedByMe: boolean;
  reportedByMe: boolean;
  comments: Comment[];
  createdAt: string;
}

interface PostsState {
  posts: Post[];
  addPost: (input: Omit<Post, "id" | "likes" | "likedByMe" | "reportedByMe" | "comments" | "createdAt">) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, input: Omit<Comment, "id" | "postId" | "createdAt">) => void;
  reportPost: (postId: string) => void;
}

const PostsContext = createContext<PostsState | null>(null);
const KEY = "kojak.posts";

function seed(): Post[] {
  const now = Date.now();
  const iso = (mAgo: number) => new Date(now - mAgo * 60 * 1000).toISOString();
  return [
    {
      id: "seed-1",
      authorId: "seed-user-1",
      authorName: "Marina Alves",
      authorVerified: true,
      anonymous: false,
      mood: "thoughtful",
      text: "Comecei terapia essa semana. Tava resistindo há anos. Primeira sessão me deixou exausta, mas tipo um alívio bom. Quem já passou por isso?",
      likes: 23,
      likedByMe: false,
      reportedByMe: false,
      comments: [
        {
          id: "c1",
          postId: "seed-1",
          authorId: null,
          authorName: "Anônimo",
          anonymous: true,
          authorVerified: false,
          text: "Passei pela mesma coisa ano passado. As primeiras semanas são as mais pesadas, mas vale demais. Força.",
          createdAt: iso(35),
        },
      ],
      createdAt: iso(48),
    },
    {
      id: "seed-2",
      authorId: "seed-user-2",
      authorName: "Anônimo",
      authorVerified: false,
      anonymous: true,
      mood: "anxious",
      text: "Não consigo dormir há três dias pensando numa apresentação no trabalho. Sei que não é o fim do mundo, mas meu cérebro não desliga.",
      likes: 41,
      likedByMe: false,
      reportedByMe: false,
      comments: [],
      createdAt: iso(120),
    },
    {
      id: "seed-3",
      authorId: "seed-user-3",
      authorName: "Pedro Henrique",
      authorVerified: false,
      anonymous: false,
      mood: "happy",
      text: "Hoje consegui sair pra correr depois de meses parado. Pequena vitória, mas tô orgulhoso. 🏃‍♂️",
      likes: 17,
      likedByMe: true,
      reportedByMe: false,
      comments: [],
      createdAt: iso(240),
    },
  ];
}

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      setPosts(raw ? (JSON.parse(raw) as Post[]) : seed());
    } catch {
      setPosts(seed());
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(KEY, JSON.stringify(posts));
  }, [posts, hydrated]);

  const addPost: PostsState["addPost"] = useCallback((input) => {
    setPosts((prev) => [
      {
        ...input,
        id: crypto.randomUUID(),
        likes: 0,
        likedByMe: false,
        reportedByMe: false,
        comments: [],
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  const toggleLike: PostsState["toggleLike"] = useCallback((postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likedByMe: !p.likedByMe, likes: p.likes + (p.likedByMe ? -1 : 1) }
          : p,
      ),
    );
  }, []);

  const addComment: PostsState["addComment"] = useCallback((postId, input) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                { ...input, id: crypto.randomUUID(), postId, createdAt: new Date().toISOString() },
              ],
            }
          : p,
      ),
    );
  }, []);

  const reportPost: PostsState["reportPost"] = useCallback((postId) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, reportedByMe: true } : p)));
  }, []);

  return (
    <PostsContext.Provider value={{ posts, addPost, toggleLike, addComment, reportPost }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePosts must be used inside PostsProvider");
  return ctx;
}