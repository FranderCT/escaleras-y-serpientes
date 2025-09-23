import { createRootRoute, createRoute, redirect } from "@tanstack/react-router";
import AuthPlayer from "./pages/AuthPlayer";
import StartGame from "./pages/StartGame";

import RoomGame from "./pages/RoomGame";
import GameBoard from "./pages/GameBoard";

export const rootRoute = createRootRoute();

export const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: StartGame,
    beforeLoad: () => {
    const token = localStorage.getItem('token');
    if (!token) throw redirect({ to: '/auth' });
  },
});

export const roomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'room',
  beforeLoad: () => {
    const token = localStorage.getItem('token');
    if (!token) throw redirect({ to: '/auth' });
  },
});

export const roomByCodeRoute = createRoute({
  getParentRoute: () => roomRoute,
  path: '$code', 
  component: RoomGame,
  beforeLoad: () => {
    const token = localStorage.getItem('token');
    if (!token) throw redirect({ to: '/auth' });
  },
});


export const authPlayerRoute = createRoute({
    getParentRoute : () =>rootRoute,
    path: 'auth',
    component: AuthPlayer
})

// export const resumeRoute = createRoute({
//   getParentRoute: () => roomRoute,
//   path: 'resume',
//   component: GameBoard,
//   beforeLoad: () => {
//     const token = localStorage.getItem('token');
//     if (!token) throw redirect({ to: '/auth' });
//   },
// })

export const roomGameRoute = createRoute({
  getParentRoute: () => roomRoute,
  path: "$code/game",
  component: GameBoard, // ← tablero
});

export const routeTree = rootRoute.addChildren([
    indexRoute,
    roomRoute,
    authPlayerRoute,
    // roomRoute.addChildren([roomByCodeRoute, roomGameRoute]),
    roomByCodeRoute,
    roomGameRoute
])