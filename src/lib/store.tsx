"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createSeedData, STORAGE_KEY } from "./seed";
import type {
  CourtlinkData,
  Player,
  Post,
  Session,
  SkillLevel,
  PlayingStyle,
  Hand,
  Surface,
  Availability,
  Message,
} from "./types";

interface CourtlinkStore {
  ready: boolean;
  data: CourtlinkData;
  currentUser: Player | null;
  login: (email: string, password: string) => string | null;
  register: (input: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) => string | null;
  logout: () => void;
  updateProfile: (
    updates: Partial<
      Pick<
        Player,
        | "name"
        | "bio"
        | "skillLevel"
        | "playingStyle"
        | "hand"
        | "surfaces"
        | "availability"
        | "location"
      >
    >
  ) => void;
  toggleFollow: (playerId: string) => void;
  sendFriendRequest: (playerId: string) => void;
  respondFriendRequest: (friendshipId: string, accept: boolean) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  createPost: (caption: string, hashtags: string[]) => void;
  joinSession: (sessionId: string) => string | null;
  leaveSession: (sessionId: string) => void;
  createSession: (input: {
    title: string;
    courtId: string;
    date: string;
    time: string;
    format: "Singles" | "Doubles";
    skillLevel: SkillLevel;
    capacity: number;
    notes: string;
  }) => void;
  sendMessage: (conversationId: string, content: string) => void;
  startConversation: (otherPlayerId: string) => string;
  resetDemo: () => void;
  getPlayer: (id: string) => Player | undefined;
}

const Ctx = createContext<CourtlinkStore | null>(null);

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function CourtlinkProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CourtlinkData>(createSeedData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setData(JSON.parse(raw) as CourtlinkData);
      } else {
        const seed = createSeedData();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        setData(seed);
      }
    } catch {
      setData(createSeedData());
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, ready]);

  const persist = useCallback((updater: (prev: CourtlinkData) => CourtlinkData) => {
    setData((prev) => updater(prev));
  }, []);

  const currentUser = useMemo(
    () => data.players.find((p) => p.id === data.currentUserId) ?? null,
    [data]
  );

  const getPlayer = useCallback(
    (id: string) => data.players.find((p) => p.id === id),
    [data.players]
  );

  const login = useCallback((email: string, password: string) => {
    let error: string | null = null;
    persist((prev) => {
      const player = prev.players.find(
        (p) => p.email.toLowerCase() === email.toLowerCase()
      );
      if (!player || player.password !== password) {
        error = "Invalid email or password.";
        return prev;
      }
      return { ...prev, currentUserId: player.id };
    });
    return error;
  }, [persist]);

  const register = useCallback(
    (input: {
      name: string;
      username: string;
      email: string;
      password: string;
    }) => {
      let error: string | null = null;
      persist((prev) => {
        if (prev.players.some((p) => p.email.toLowerCase() === input.email.toLowerCase())) {
          error = "An account with that email already exists.";
          return prev;
        }
        if (prev.players.some((p) => p.username.toLowerCase() === input.username.toLowerCase())) {
          error = "That username is taken.";
          return prev;
        }
        const player: Player = {
          id: uid("p"),
          username: input.username.replace(/^@/, ""),
          email: input.email,
          password: input.password,
          name: input.name,
          bio: "New to Courtlink. Looking for partners nearby.",
          avatar: input.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
          skillLevel: "Beginner",
          playingStyle: "Both",
          hand: "Right",
          surfaces: ["Hard"],
          availability: "Flexible",
          location: "Singapore",
          followers: [],
          following: [],
        };
        return {
          ...prev,
          players: [...prev.players, player],
          currentUserId: player.id,
        };
      });
      return error;
    },
    [persist]
  );

  const logout = useCallback(() => {
    persist((prev) => ({ ...prev, currentUserId: null }));
  }, [persist]);

  const updateProfile = useCallback(
    (
      updates: Partial<
        Pick<
          Player,
          | "name"
          | "bio"
          | "skillLevel"
          | "playingStyle"
          | "hand"
          | "surfaces"
          | "availability"
          | "location"
        >
      >
    ) => {
      persist((prev) => {
        if (!prev.currentUserId) return prev;
        return {
          ...prev,
          players: prev.players.map((p) =>
            p.id === prev.currentUserId ? { ...p, ...updates } : p
          ),
        };
      });
    },
    [persist]
  );

  const toggleFollow = useCallback(
    (playerId: string) => {
      persist((prev) => {
        if (!prev.currentUserId || prev.currentUserId === playerId) return prev;
        const me = prev.players.find((p) => p.id === prev.currentUserId);
        if (!me) return prev;
        const following = me.following.includes(playerId)
          ? me.following.filter((id) => id !== playerId)
          : [...me.following, playerId];
        return {
          ...prev,
          players: prev.players.map((p) => {
            if (p.id === me.id) return { ...p, following };
            if (p.id === playerId) {
              const followers = following.includes(playerId)
                ? p.followers.includes(me.id)
                  ? p.followers
                  : [...p.followers, me.id]
                : p.followers.filter((id) => id !== me.id);
              return { ...p, followers };
            }
            return p;
          }),
        };
      });
    },
    [persist]
  );

  const sendFriendRequest = useCallback(
    (playerId: string) => {
      persist((prev) => {
        if (!prev.currentUserId || prev.currentUserId === playerId) return prev;
        const exists = prev.friendships.some(
          (f) =>
            (f.senderId === prev.currentUserId && f.receiverId === playerId) ||
            (f.senderId === playerId && f.receiverId === prev.currentUserId)
        );
        if (exists) return prev;
        return {
          ...prev,
          friendships: [
            ...prev.friendships,
            {
              id: uid("f"),
              senderId: prev.currentUserId,
              receiverId: playerId,
              status: "pending",
            },
          ],
        };
      });
    },
    [persist]
  );

  const respondFriendRequest = useCallback(
    (friendshipId: string, accept: boolean) => {
      persist((prev) => ({
        ...prev,
        friendships: prev.friendships.map((f) =>
          f.id === friendshipId
            ? { ...f, status: accept ? "accepted" : "rejected" }
            : f
        ),
      }));
    },
    [persist]
  );

  const toggleLike = useCallback(
    (postId: string) => {
      persist((prev) => {
        if (!prev.currentUserId) return prev;
        return {
          ...prev,
          posts: prev.posts.map((post) => {
            if (post.id !== postId) return post;
            const liked = post.likes.includes(prev.currentUserId!);
            return {
              ...post,
              likes: liked
                ? post.likes.filter((id) => id !== prev.currentUserId)
                : [...post.likes, prev.currentUserId!],
            };
          }),
        };
      });
    },
    [persist]
  );

  const addComment = useCallback(
    (postId: string, content: string) => {
      persist((prev) => {
        if (!prev.currentUserId || !content.trim()) return prev;
        return {
          ...prev,
          posts: prev.posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: [
                    ...post.comments,
                    {
                      id: uid("c"),
                      authorId: prev.currentUserId!,
                      content: content.trim(),
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }
              : post
          ),
        };
      });
    },
    [persist]
  );

  const createPost = useCallback(
    (caption: string, hashtags: string[]) => {
      persist((prev) => {
        if (!prev.currentUserId || !caption.trim()) return prev;
        const post: Post = {
          id: uid("post"),
          authorId: prev.currentUserId,
          caption: caption.trim(),
          image: "fresh",
          hashtags,
          likes: [],
          comments: [],
          createdAt: new Date().toISOString(),
          savedBy: [],
        };
        return { ...prev, posts: [post, ...prev.posts] };
      });
    },
    [persist]
  );

  const joinSession = useCallback(
    (sessionId: string) => {
      let error: string | null = null;
      persist((prev) => {
        if (!prev.currentUserId) {
          error = "Sign in to join a session.";
          return prev;
        }
        return {
          ...prev,
          sessions: prev.sessions.map((s) => {
            if (s.id !== sessionId) return s;
            if (s.participantIds.includes(prev.currentUserId!)) return s;
            if (s.participantIds.length >= s.capacity) {
              error = "This session is full.";
              return s;
            }
            return {
              ...s,
              participantIds: [...s.participantIds, prev.currentUserId!],
            };
          }),
        };
      });
      return error;
    },
    [persist]
  );

  const leaveSession = useCallback(
    (sessionId: string) => {
      persist((prev) => {
        if (!prev.currentUserId) return prev;
        return {
          ...prev,
          sessions: prev.sessions.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  participantIds: s.participantIds.filter(
                    (id) => id !== prev.currentUserId
                  ),
                }
              : s
          ),
        };
      });
    },
    [persist]
  );

  const createSession = useCallback(
    (input: {
      title: string;
      courtId: string;
      date: string;
      time: string;
      format: "Singles" | "Doubles";
      skillLevel: SkillLevel;
      capacity: number;
      notes: string;
    }) => {
      persist((prev) => {
        if (!prev.currentUserId) return prev;
        const session: Session = {
          id: uid("s"),
          creatorId: prev.currentUserId,
          title: input.title,
          courtId: input.courtId,
          date: input.date,
          time: input.time,
          format: input.format,
          skillLevel: input.skillLevel,
          capacity: input.capacity,
          participantIds: [prev.currentUserId],
          notes: input.notes,
        };
        return { ...prev, sessions: [session, ...prev.sessions] };
      });
    },
    [persist]
  );

  const sendMessage = useCallback(
    (conversationId: string, content: string) => {
      persist((prev) => {
        if (!prev.currentUserId || !content.trim()) return prev;
        const message: Message = {
          id: uid("m"),
          senderId: prev.currentUserId,
          content: content.trim(),
          createdAt: new Date().toISOString(),
        };
        return {
          ...prev,
          conversations: prev.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, messages: [...c.messages, message] }
              : c
          ),
        };
      });
    },
    [persist]
  );

  const startConversation = useCallback(
    (otherPlayerId: string) => {
      let conversationId = "";
      persist((prev) => {
        if (!prev.currentUserId) return prev;
        const existing = prev.conversations.find(
          (c) =>
            c.participantIds.includes(prev.currentUserId!) &&
            c.participantIds.includes(otherPlayerId) &&
            c.participantIds.length === 2
        );
        if (existing) {
          conversationId = existing.id;
          return prev;
        }
        conversationId = uid("conv");
        return {
          ...prev,
          conversations: [
            {
              id: conversationId,
              participantIds: [prev.currentUserId, otherPlayerId],
              messages: [],
            },
            ...prev.conversations,
          ],
        };
      });
      return conversationId;
    },
    [persist]
  );

  const resetDemo = useCallback(() => {
    const seed = createSeedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    setData(seed);
  }, []);

  const value: CourtlinkStore = {
    ready,
    data,
    currentUser,
    login,
    register,
    logout,
    updateProfile,
    toggleFollow,
    sendFriendRequest,
    respondFriendRequest,
    toggleLike,
    addComment,
    createPost,
    joinSession,
    leaveSession,
    createSession,
    sendMessage,
    startConversation,
    resetDemo,
    getPlayer,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCourtlink() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCourtlink must be used within CourtlinkProvider");
  return ctx;
}

export type ProfileFormFields = {
  skillLevel: SkillLevel;
  playingStyle: PlayingStyle;
  hand: Hand;
  surfaces: Surface[];
  availability: Availability;
};
