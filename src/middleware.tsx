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

  // Definujeme platné tokeny
  const validToken = "k8!@s0#9l5$q3^r7&p1*m6%v4";   // Token pro kompletní přístup
  const validAnimToken = "anim123";                   // Zkrácený token určený pouze pro Animace a 3D modely

  // 1. Kontrola hlavního tokenu: Umožní přístup na jakoukoli stránku.
  if (tokenFromUrl === validToken || tokenFromCookies === validToken) {
    if (tokenFromUrl === validToken) {
      // Vytvoření čisté URL bez query parametru "token"
      const cleanUrl = new URL(req.url);
      cleanUrl.searchParams.delete("token");

      // Přesměrujeme na čistou URL a uložíme token do cookies, pokud již není uložen
      const response = NextResponse.redirect(cleanUrl);
      if (tokenFromCookies !== validToken) {
        response.cookies.set("token", validToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });
        console.log("Hlavní token uložen do cookies a odstraněn z URL.");
      }
      return response;
    }
    console.log("Přístup povolen z hlavního tokenu.");
    return NextResponse.next();
  }

  // 2. Kontrola tokenu pro Animace/3D modely:
  if (tokenFromUrl === validAnimToken || tokenFromCookies === validAnimToken) {
    // Zkontrolujeme, zda se nacházíme na stránkách určených pro animace či 3D modely.
    if (
      url.pathname.startsWith("/chemie/chemie1/animace/") ||
      url.pathname.startsWith("/chemie/chemie1/3dmodely/")
    ) {
      if (tokenFromUrl === validAnimToken) {
        // Vytvoříme čistou URL, odstraníme token z query parametrů
        const cleanUrl = new URL(req.url);
        cleanUrl.searchParams.delete("token");
        const response = NextResponse.redirect(cleanUrl);
        if (tokenFromCookies !== validAnimToken) {
          response.cookies.set("token", validAnimToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
          });
          console.log("Anim token uložen do cookies a odstraněn z URL.");
        }
        return response;
      }
      console.log("Přístup povolen pro Animace/3D modely z validního anim tokenu.");
      return NextResponse.next();
    } else {
      console.log("Anim token použit mimo povolené adresáře (Animace/3D modely), přístup odepřen.");
      return NextResponse.redirect(new URL("/Pristup-odepren", req.url));
    }
  }

  // V ostatních případech je token neplatný a přístup bude odepřen.
  console.log("Token neplatný, přístup odepřen.");
  return NextResponse.redirect(new URL("/Pristup-odepren", req.url));
}

// Matcher pro všechny stránky kromě API, _next a favicon.ico.
export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
