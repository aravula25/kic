import { create } from 'zustand';

interface User {
  _id: string;
  name: string;
  email: string;
  token?: string;
  avatar?: string;
}

interface UserStore {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void; // add logout method
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
  logout: () => {
    localStorage.removeItem('user'); // remove saved user
    set({ user: null }); // reset store
  },
}));
