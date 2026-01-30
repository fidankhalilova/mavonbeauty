// middleware.ts (in root of your project)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    try {
      // Check for access token
      const accessToken =
        request.cookies.get("accessToken")?.value ||
        localStorage.getItem("accessToken");

      if (!accessToken) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Verify user is admin
      const response = await fetch("http://localhost:3001/api/v1/auth/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const data = await response.json();

      if (data.user?.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("Admin middleware error:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
