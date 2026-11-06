import { NextResponse } from "next/server";
import { adminOk } from "@/lib/admin-auth";

// Password-protects every /admin page (source review, later the money dashboard).
export function proxy(request) {
  if (adminOk(request.headers.get("authorization"))) return NextResponse.next();
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Potatopedia admin", charset="UTF-8"', "X-Robots-Tag": "noindex" },
  });
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
