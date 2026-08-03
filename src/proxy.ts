import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isLoginPage = pathname === "/admin/login";

  if (pathname.startsWith("/admin") && !isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl.origin));
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
