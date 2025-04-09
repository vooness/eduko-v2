import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("Middleware initialized");

  const url = req.nextUrl;

  // Pokud již jste na stránce s odepřeným přístupem, nepřesměrovávat.
  if (url.pathname.startsWith("/Pristup-odepren")) {
    return NextResponse.next();
  }

  // Získáme token z URL a cookies.
  const tokenFromUrl = url.searchParams.get("token");
  const tokenFromCookies = req.cookies.get("token")?.value;

  // Definice platného tokenu.
  const validToken = "k8!@s0#9l5$q3^r7&p1*m6%v4";

  // Pokud je token platný, umožníme přístup a v případě potřeby token uložíme do cookies.
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

  // Pokud token není platný, ověříme, zda je požadavek na i-eduko.cz a má správný referer.
  const host = req.headers.get("host") || "";
  if (host.includes("i-eduko.cz")) {
    const referer = req.headers.get("referer") || "";

    // Regulární výraz ověřující, že URL začíná na "https://online.flexibooks.cz/9788088473374"
    // a volitelně následuje lomítko a číslice (např. /1, /15, atd.).
    const validOnlineRefererPattern = /^https:\/\/online\.flexibooks\.cz\/9788088473374(\/\d+)?/;

    // Regulární výraz, který povolí jakoukoli URL začínající na fraus.cz (s http nebo https) a libovolným dalším obsahem.
    const validFrausRefererPattern = /^https?:\/\/fraus\.cz(\/.*)?/;

    if (validOnlineRefererPattern.test(referer) || validFrausRefererPattern.test(referer)) {
      return NextResponse.next();
    } else {
      console.log("Direct access na i-eduko.cz s neplatným referer - přístup odepřen");
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
