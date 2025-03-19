import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("Middleware initialized");

  const url = req.nextUrl;
  const tokenFromUrl = url.searchParams.get("token");

  // Token uložený v cookies (pokud existuje)
  const tokenFromCookies = req.cookies.get("token")?.value;

  // Platný token
  const validToken = "special123";

  // Pokud uživatel už je na /pristup-odepren, nepřesměrovávat znovu
  if (url.pathname.startsWith("/Pristup-odepren")) {
    return NextResponse.next();
  }

  // Pokud token v cookies nebo URL odpovídá platnému tokenu
  if (tokenFromUrl === validToken || tokenFromCookies === validToken) {
    const response = NextResponse.next();

    // Pokud token pochází z URL a není v cookies, uložíme jej
    if (tokenFromUrl === validToken && tokenFromCookies !== validToken) {
      response.cookies.set("token", tokenFromUrl, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      console.log("Token uložen do cookies");
    }

    return response;
  }

  // Přesměrování na stránku s odepřením přístupu
  return NextResponse.redirect(new URL("/Pristup-odepren", req.url));
}

// Konfigurace matcheru
export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"], // Middleware pro všechny stránky kromě specifikovaných
};
