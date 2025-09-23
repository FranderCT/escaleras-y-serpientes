import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';

const HUB_URL = import.meta.env.VITE_HUB_URL ?? 'http://26.9.80.46:5089/gameHub';

let authToken: string | null = null;
let connection: HubConnection | null = null;

// roomId -> playerName
const joinedRooms = new Map<string, string>();

export function setAuthToken(token: string) {
  authToken = token;
}

export function getConnection(): HubConnection {
  if (!connection) {
    connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => authToken ?? '',
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    // Re-únete a las salas tras reconectar (con su respectivo playerName)
    connection.onreconnected(async () => {
      for (const [roomId, playerName] of joinedRooms.entries()) {
        try {
          await connection!.invoke('JoinRoom', roomId, playerName);
        } catch {
          // noop
        }
      }
    });
  }
  return connection;
}

export async function ensureStarted(): Promise<HubConnection> {
  const conn = getConnection();
  if (conn.state === HubConnectionState.Disconnected) {
    await conn.start();
  }
  return conn;
}

/** Únete a una sala y recuerda el (roomId -> playerName) para rejoin */
export async function joinSignalRRoom(roomId: string, playerName: string): Promise<void> {
  const conn = await ensureStarted();
  await conn.invoke('JoinRoom', roomId, playerName);
  joinedRooms.set(roomId, playerName);
}

// signalRConnection.ts
export type ActionDetailsDtoTS = {
  type: string;
  payload?: any;
};

export async function performGameActionSignalR(
  roomId: string,
  actionDetails: ActionDetailsDtoTS
): Promise<void> {
  const conn = await ensureStarted();
  await conn.invoke('PerformGameAction', roomId, actionDetails);
}

export async function leaveSignalRRoom(roomId: string): Promise<void> {
  const conn = await ensureStarted();
  await conn.invoke('LeaveRoom', roomId);
  joinedRooms.delete(roomId);
}

/** Helpers para registrar / desregistrar handlers de eventos */
export function on<T extends any[]>(event: string, cb: (...args: T) => void) {
  getConnection().on(event, cb as any);
}
export function off(event: string) {
  getConnection().off(event);
}
