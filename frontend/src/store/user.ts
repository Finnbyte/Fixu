import { User } from "../../../backend/db/schemas/users";
import { create } from "zustand";

async function fetchUserById(userId: string): Promise<User | null> {
  const res = await fetch(`/api/users/${userId}`, {
    credentials: "include",
  })

  if (!res.ok) {
    return null
  }

  const data = await res.json() as User;
  return data
}

interface UserState {
  data: User | null
  fetch: (userId: string) => void
}

export const useUserStore = create<UserState>()((set) => ({
  data: null,
  fetch: async (userId: string) => {
    const data = await fetchUserById(userId)
    return set({ data });
  } 
}));