import { createRootRoute, createRoute } from "@tanstack/react-router";
import StartGame from "./pages/StartGame";
import Lobby from "./pages/Lobby";
import AuthPlayer from "./pages/AuthPlayer";

export const rootRoute = createRootRoute();

export const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: StartGame,
});

export const lobbyRoute = createRoute({
    getParentRoute: () => rootRoute,
    path : 'lobby',
    component: Lobby
})

export const authPlayerRoute = createRoute({
    getParentRoute : () =>rootRoute,
    path: 'auth',
    component: AuthPlayer
})

export const routeTree = rootRoute.addChildren([
    indexRoute,
    lobbyRoute,
    authPlayerRoute
])