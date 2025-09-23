import { create } from "zustand";

// src/stores/messagesStore.ts
export type MessageChannel = "lobby" | "ranking" | "game" | "chat";

    export type GameMessage = {
    id: string;
    roomId: string;
    channel: MessageChannel;
    text: string;
    at: number;
    };

//type RoomBuckets = Record<MessageChannel, GameMessage[]>;

type State = { messages: string[] };
    type Actions = {
    push: (m: string) => void;
    clear: () => void;
    };

    export const useMessagesStore = create<State & Actions>((set) => ({
    messages: [],
    push: (m) => set((s) => ({ messages: [...s.messages, m] })),
    clear: () => set({ messages: [] }),
    }));
// type Actions = {
//   setActiveRoom: (roomId?: string) => void;
//   push: (msg: Omit<GameMessage, "id" | "at">) => void;
//   clearRoom: (roomId: string, channel?: MessageChannel) => void;
// };

// const EMPTY: Readonly<GameMessage[]> = [];

// export const useMessagesStore = create<State & Actions>((set) => ({
//   byRoom: {},
//   activeRoomId: undefined,

//   setActiveRoom: (roomId) => set({ activeRoomId: roomId }),

//   push: (msg) => {
//     const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
//     const at = Date.now();
//     set((s) => {
//       const room = s.byRoom[msg.roomId] ?? {
//         lobby: [], ranking: [], game: [], chat: []
//       };
//       const nextRoom: RoomBuckets = {
//         ...room,
//         [msg.channel]: [...room[msg.channel], { ...msg, id, at }],
//       };
//       return { byRoom: { ...s.byRoom, [msg.roomId]: nextRoom } };
//     });
//   },

//   clearRoom: (roomId, channel) =>
//     set((s) => {
//       const room = s.byRoom[roomId];
//       if (!room) return s;
//       if (!channel) {
//         const next = { ...s.byRoom };
//         delete next[roomId];
//         return { byRoom: next };
//       }
//       const nextRoom = { ...room, [channel]: [] };
//       return { byRoom: { ...s.byRoom, [roomId]: nextRoom } };
//     }),
// }));

// Selectores que devuelven SIEMPRE la misma referencia si no hubo cambios
// export const selectRoomChannel = (roomId: string, channel: MessageChannel) =>
//   (s: State) => s.byRoom[roomId]?.[channel] ?? EMPTY;

// export const selectRoomAll = (roomId: string) =>
//   (s: State) => s.byRoom[roomId] ?? { lobby: EMPTY, ranking: EMPTY, game: EMPTY, chat: EMPTY };
