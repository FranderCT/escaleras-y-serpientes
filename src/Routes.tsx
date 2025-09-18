import { createRootRoute, createRoute } from "@tanstack/react-router";
import StartGame from "./pages/StartGame";

export const rootRoute = createRootRoute();

export const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: StartGame
});


export const routeTree = rootRoute.addChildren([
    indexRoute
])