// middleware.ts (raíz)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // protege /Panel y todo lo bajo él
    if (!path.startsWith("/Panel")) return NextResponse.next();

    const role = req.cookies.get("role")?.value?.trim().toLowerCase();
    if (role !== "superadmin") {
        return NextResponse.redirect(new URL("/403", req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/Panel/:path*"],
};
