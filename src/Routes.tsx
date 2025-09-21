import { createRootRoute, createRoute } from "@tanstack/react-router";
import AuthPlayer from "./pages/AuthPlayer";
import StartGame from "./pages/StartGame";
import Room from "./pages/Room";

export const rootRoute = createRootRoute();

export const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: StartGame,
});

export const roomRoute = createRoute({
    getParentRoute: () => rootRoute,
    path : 'room',
})

export const roomByCodeRoute = createRoute({
    getParentRoute: () => roomRoute,
    path : '/$code',
    component: Room
})


export const authPlayerRoute = createRoute({
    getParentRoute : () =>rootRoute,
    path: 'auth',
    component: AuthPlayer
})

export const routeTree = rootRoute.addChildren([
    indexRoute,
    roomRoute,
    authPlayerRoute
])