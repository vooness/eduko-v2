import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("Middleware initialized");

  const url = req.nextUrl;

  // Pokud už je uživatel na stránce s odepřeným přístupem, nepřesměrovávat znovu
  if (url.pathname.startsWith("/Pristup-odepren")) {
    return NextResponse.next();
  }

  // Zjistíme aktuální doménu z URL (např. i-eduko.cz nebo online.flexibooks.cz)
  const currentHost = url.hostname;

  // Pokud požadavek přichází přes i-eduko.cz, ověříme referer
  if (currentHost === "i-eduko.cz") {
    const refererHeader = req.headers.get("referer") || "";
    let validReferer = false;
    try {
      const refererUrl = new URL(refererHeader);
      // Ověříme, zda hostname refereru je online.flexibooks.cz
      validReferer = refererUrl.hostname === "online.flexibooks.cz";
    } catch (error) {
      validReferer = false;
    }
    if (!validReferer) {
      return NextResponse.redirect(new URL("/Pristup-odepren", req.url));
    }
  }

  return NextResponse.next();
}

// Konfigurace matcheru pro všechny stránky kromě API, _next a favicon.ico
export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
