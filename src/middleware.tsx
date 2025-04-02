import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("Middleware initialized");

  const url = req.nextUrl;

  // Pokud už je uživatel na stránce s odepřeným přístupem, nepřesměrovávat znovu
  if (url.pathname.startsWith("/Pristup-odepren")) {
    return NextResponse.next();
  }

  // Získání hlavičky referer
  const referer = req.headers.get("referer") || "";

  // Kontrola, zda referer začíná na https://online.flexibooks.cz
  if (!referer.startsWith("https://online.flexibooks.cz")) {
    return NextResponse.redirect(new URL("/Pristup-odepren", req.url));
  }

  return NextResponse.next();
}

// Konfigurace matcheru pro všechny stránky kromě API, _next a favicon.ico
export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
