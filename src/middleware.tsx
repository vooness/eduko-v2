import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("Middleware initialized");

  const url = req.nextUrl;

  // Pokud už se nacházíte na stránce s odepřeným přístupem, nepřesměrovávat znovu.
  if (url.pathname.startsWith("/Pristup-odepren")) {
    return NextResponse.next();
  }

  // Získáme host (doménu) z hlavičky.
  const host = req.headers.get("host") || "";

  // Pokud host obsahuje "i-eduko.cz", kontrolujeme referer.
  if (host.includes("i-eduko.cz")) {
    const referer = req.headers.get("referer") || "";
    // Pokud referer neobsahuje "online.flexibooks.cz", přístup bude odepřen.
    if (!referer || !referer.includes("online.flexibooks.cz")) {
      console.log("Direct access na i-eduko.cz - přístup odepřen");
      return NextResponse.redirect(new URL("/Pristup-odepren", req.url));
    }
  }

  return NextResponse.next();
}

// Matcher pro všechny stránky kromě API, _next a favicon.ico.
export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
