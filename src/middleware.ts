import NextAuth from "next-auth";
import {
    apiAuthPrefix,
    DEFAULT_LOGIN_REDIRECT,
    publicRoutes,
    authRoutes,
} from "@/routes"
import authConfig from "../auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) return null;
    if (isAuthRoute) {
        if (isLoggedIn) return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        return null;
    }
    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/auth/sign-in", nextUrl));
    }
    return null;
})

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (API routes for authentication)
         * - static files (/_next/static/)
         * - favicon (/favicon.ico)
         */
        "/((?!api/auth|_next/static|favicon.ico).*)",
    ],
};