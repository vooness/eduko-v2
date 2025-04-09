import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("=== DEBUG MIDDLEWARE START ===");
  
  // Získáme aktuální URL a logujeme ji
  const url = req.nextUrl;
  console.log("Aktuální URL:", url.href);
  console.log("Pathname:", url.pathname);

  // Pokud už se nacházíme na stránce s odepřeným přístupem, nepřesměrovávat znovu.
  if (url.pathname.startsWith("/Pristup-odepren")) {
    console.log("Už jsme na stránce odepřeného přístupu.");
    return NextResponse.next();
  }

  // Získáme token z query parametrů a cookies.
  const tokenFromUrl = url.searchParams.get("token");
  const tokenFromCookies = req.cookies.get("token")?.value;
  console.log("Token z URL:", tokenFromUrl);
  console.log("Token z Cookies:", tokenFromCookies);

  // Definujeme platný token.
  const validToken = "k8!@s0#9l5$q3^r7&p1*m6%v4";

  // Pokud je token platný, povolíme přístup a pokud je token jenom v URL, uložíme ho do cookies.
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
    console.log("Přístup povolen z validního tokenu.");
    return response;
  }

  // Pokud token není platný, ověříme, zda je požadavek na i-eduko.cz a zda referer pochází z fraus.cz.
  const host = req.headers.get("host") || "";
  console.log("Host header:", host);

  if (host.includes("i-eduko.cz")) {
    const referer = req.headers.get("referer") || "";
    console.log("Referer header:", referer);
    
    // Regulární výraz ověřující, že referer začíná na http://fraus.cz, https://fraus.cz nebo s www.
    const validFrausRefererPattern = /^https?:\/\/(www\.)?fraus\.cz(\/.*)?/;
    
    if (validFrausRefererPattern.test(referer)) {
      console.log("Referer pochází z fraus.cz, přístup povolen.");
      return NextResponse.next();
    } else {
      console.log("Referer nepochází z fraus.cz, přístup odepřen.");
      return NextResponse.redirect(new URL("/Pristup-odepren", req.url));
    }
  }

  // Ve všech ostatních případech bude přístup odepřen.
  console.log("Host nespadající pod podmínky, přístup odepřen.");
  return NextResponse.redirect(new URL("/Pristup-odepren", req.url));
}

// Matcher pro všechny stránky kromě API, _next a favicon.ico.
export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
