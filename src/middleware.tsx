import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("Middleware initialized");

  const url = req.nextUrl;

  // Pokud už se nacházíte na stránce s odepřeným přístupem, nepřesměrovávat znovu.
  if (url.pathname.startsWith("/Pristup-odepren")) {
    return NextResponse.next();
  }

  // Získáme token z URL a cookies.
  const tokenFromUrl = url.searchParams.get("token");
  const tokenFromCookies = req.cookies.get("token")?.value;

  // Definice platného tokenu.
  const validToken = "k8!@s0#9l5$q3^r7&p1*m6%v4";

  // Pokud je token platný, povolíme přístup a při potřeby token uložíme do cookies.
  if (tokenFromUrl === validToken || tokenFromCookies === validToken) {
    const response = NextResponse.next();
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

  // Pokud token není platný, ověříme, zda je požadavek na i-eduko.cz a zda referer pochází z fraus.cz.
  const host = req.headers.get("host") || "";
  if (host.includes("i-eduko.cz")) {
    const referer = req.headers.get("referer") || "";

    // Regulární výraz, který ověří, že referer začíná na "http(s)://(www.)?fraus.cz" 
    // a následně může obsahovat jakýkoli text (cesty či parametry jsou ignorovány).
    const validFrausRefererPattern = /^https?:\/\/(www\.)?fraus\.cz(\/.*)?/;

    if (validFrausRefererPattern.test(referer)) {
      return NextResponse.next();
    } else {
      console.log("Přístup odepřen - referer není z fraus.cz");
      return NextResponse.redirect(new URL("/Pristup-odepren", req.url));
    }
  }

  // Ve všech ostatních případech je přístup odepřen.
  return NextResponse.redirect(new URL("/Pristup-odepren", req.url));
}

// Matcher pro všechny stránky kromě API, _next a favicon.ico.
export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
