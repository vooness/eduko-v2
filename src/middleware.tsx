import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("Middleware initialized");

  const url = req.nextUrl;

  // Pokud už je uživatel na stránce s odepřeným přístupem, nepřesměrovávat znovu
  if (url.pathname.startsWith("/Pristup-odepren")) {
    return NextResponse.next();
  }

  // Zjistíme aktuální doménu. Použijeme hlavičku host, protože req.nextUrl.hostname nemusí odpovídat při proxy
  const currentHost = req.headers.get("host") || "";

  // Pokud požadavek míří na i-eduko.cz, ověříme, zda referer pochází z online.flexibooks.cz
  if (currentHost.startsWith("i-eduko.cz")) {
    const refererHeader = req.headers.get("referer");

    // Pokud není referer přítomen, blokujeme přístup
    if (!refererHeader) {
      return NextResponse.redirect(new URL("/Pristup-odepren", req.url));
    }

    try {
      const refererUrl = new URL(refererHeader);
      // Pokud hostname refereru není online.flexibooks.cz, blokujeme přístup
      if (refererUrl.hostname !== "online.flexibooks.cz") {
        return NextResponse.redirect(new URL("/Pristup-odepren", req.url));
      }
    } catch (error) {
      // Pokud se nepodaří vytvořit URL z refereru, blokujeme přístup
      return NextResponse.redirect(new URL("/Pristup-odepren", req.url));
    }
  }

  return NextResponse.next();
}

// Konfigurace matcheru pro všechny stránky kromě API, _next a favicon.ico
export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
