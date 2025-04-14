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

  // Získáme token z query parametrů a cookies
  const tokenFromUrl = url.searchParams.get("token");
  const tokenFromCookies = req.cookies.get("token")?.value;
  console.log("Token z URL:", tokenFromUrl);
  console.log("Token z Cookies:", tokenFromCookies);

  // Definujeme platný token
  const validToken = "k8!@s0#9l5$q3^r7&p1*m6%v4";

  // Pokud je token platný, povolíme přístup a pokud je token jenom v URL, uložíme ho do cookies
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

  // Dále kontrolujeme, jestli je host "i-eduko.cz" a referer je přesně ten, který chceme
  const host = req.headers.get("host") || "";
  console.log("Host header:", host);

  if (host.includes("i-eduko.cz")) {
    const referer = req.headers.get("referer") || "";
    console.log("Referer header:", referer);

    // Regulární výraz, který povolí JEN přesně tento odkaz (včetně parametrů):
    // https://fraus.cz/redirect.php?ean=97880884733748&id_odkazu=CH1_15W2
    // Povoluje i http / https, s www i bez www, a za id_odkazu může být optional cokoliv (např. #fragment).
    const validFrausRefererPattern = /^https?:\/\/(www\.)?fraus\.cz\/redirect\.php\?ean=97880884733748&id_odkazu=CH1_15W2(?:[&#].*)?$/i;
    
    if (validFrausRefererPattern.test(referer)) {
      console.log("Referer je z konkrétního fraus.cz odkazu, přístup povolen.");
      return NextResponse.next();
    } else {
      console.log("Referer neodpovídá požadovanému odkazu, přístup odepřen.");
      return NextResponse.redirect(new URL("/Pristup-odepren", req.url));
    }
  }

  // Ve všech ostatních případech bude přístup odepřen
  console.log("Host nespadající pod podmínky, přístup odepřen.");
  return NextResponse.redirect(new URL("/Pristup-odepren", req.url));
}

// Matcher pro všechny stránky kromě API, _next a favicon.ico.
export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
