export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";
export type PlayingStyle = "Singles" | "Doubles" | "Both";
export type Hand = "Right" | "Left";
export type Surface = "Hard" | "Clay" | "Grass";
export type Availability = "Weekdays" | "Weekends" | "Flexible";
export type FriendshipStatus = "pending" | "accepted" | "rejected";

export interface Player {
  id: string;
  username: string;
  email: string;
  password: string;
  name: string;
  bio: string;
  avatar: string;
  skillLevel: SkillLevel;
  playingStyle: PlayingStyle;
  hand: Hand;
  surfaces: Surface[];
  availability: Availability;
  location: string;
  followers: string[];
  following: string[];
}

export interface Post {
  id: string;
  authorId: string;
  caption: string;
  image: string;
  hashtags: string[];
  likes: string[];
  comments: Comment[];
  createdAt: string;
  savedBy: string[];
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Friendship {
  id: string;
  senderId: string;
  receiverId: string;
  status: FriendshipStatus;
}

export interface Court {
  id: string;
  name: string;
  address: string;
  surface: Surface;
  facilities: string[];
  priceHint: string;
  rating: number;
  image: string;
  lat: number;
  lng: number;
}

export interface Session {
  id: string;
  creatorId: string;
  title: string;
  courtId: string;
  date: string;
  time: string;
  format: "Singles" | "Doubles";
  skillLevel: SkillLevel;
  capacity: number;
  participantIds: string[];
  notes: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  messages: Message[];
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface CourtlinkData {
  players: Player[];
  posts: Post[];
  friendships: Friendship[];
  courts: Court[];
  sessions: Session[];
  conversations: Conversation[];
  currentUserId: string | null;
}
