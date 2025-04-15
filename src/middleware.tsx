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

  // Pokud je token platný, povolíme přístup.
  // Pokud je token předán v URL, odstraníme jej z URL a uložíme do cookies.
  if (tokenFromUrl === validToken || tokenFromCookies === validToken) {
    if (tokenFromUrl === validToken) {
      // Vytvoříme čistou URL bez query parametru "token"
      const cleanUrl = new URL(req.url);
      cleanUrl.searchParams.delete("token");
      
      // Nastavíme token do cookies, pokud ještě není uložený
      const response = NextResponse.redirect(cleanUrl);
      if (tokenFromCookies !== validToken) {
        response.cookies.set("token", validToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });
        console.log("Token uložen do cookies a odstraněn z URL.");
      }
      return response;
    }
    console.log("Přístup povolen z validního tokenu.");
    return NextResponse.next();
  }

  // Ve všech ostatních případech bude přístup odepřen
  console.log("Token neplatný, přístup odepřen.");
  return NextResponse.redirect(new URL("/Pristup-odepren", req.url));
}

// Matcher pro všechny stránky kromě API, _next a favicon.ico.
export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
