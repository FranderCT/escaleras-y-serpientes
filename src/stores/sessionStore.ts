// src/stores/sessionStore.ts
import { create } from "zustand";

type SessionState = {
    currentRoomId?: string;
    setCurrentRoom: (roomId?: string) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
    currentRoomId: undefined,
    setCurrentRoom: (roomId) => set({ currentRoomId: roomId }),
}));
