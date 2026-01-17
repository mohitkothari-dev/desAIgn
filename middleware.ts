
import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import type { Session } from "better-auth/types";

export default async function authMiddleware(request: NextRequest) {
    //This automatically tells TypeScript that the returned data will match the Session shape.
    const { data: session } = await betterFetch<Session>(
        "/api/auth/get-session",   // sending req to the backend to see if user has active session or not.
        {
            baseURL: request.nextUrl.origin,
            headers: {
                //get the cookie from the request
                cookie: request.headers.get("cookie") || "",
            },
        },
    );

    if (!session) { // if no session is found, redirect to sign-in page
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next(); // if session is found, allow the request to proceed
}


//these are the routes that will be protected by the auth middleware
export const config = {
    matcher: ["/dashboard"],
};
