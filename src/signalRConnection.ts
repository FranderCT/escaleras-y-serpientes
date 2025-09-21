import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';

const HUB_URL = import.meta.env.VITE_HUB_URL ?? 'http://26.9.80.46:5089/gameHub';

let authToken: string | null = null;
let connection: HubConnection | null = null;
const joinedGroups = new Set<string>();

export function setAuthToken(token: string) {
  authToken = token;
}

export function getConnection(): HubConnection {
  if (!connection) {
    connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        // Si el Hub requiere auth, el token viajará aquí:
        accessTokenFactory: () => authToken ?? '',
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    // Re-únete a los grupos después de reconectar
    connection.onreconnected(async () => {
      for (const g of joinedGroups) {
        try {
          await connection!.invoke('JoinRoom', g);
        } catch {
          /* noop */
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

export async function joinSignalRGroup(group: string): Promise<void> {
  const conn = await ensureStarted();
  await conn.invoke('JoinRoom', group);
  joinedGroups.add(group);
}

export async function leaveSignalRGroup(group: string): Promise<void> {
  const conn = await ensureStarted();
  await conn.invoke('LeaveRoom', group);
  joinedGroups.delete(group);
}
