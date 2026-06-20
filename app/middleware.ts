import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isLoggedIn = !!session;
  const isAdmin = session?.user?.role === "admin";

  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if ((pathname.startsWith("/dashboard") || pathname.startsWith("/submit") || pathname.startsWith("/appeals")) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/submit/:path*", "/appeals/:path*", "/admin/:path*"],
};