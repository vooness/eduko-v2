import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("=== DEBUG MIDDLEWARE START ===");
  const url = req.nextUrl;
  console.log("Aktuální URL:", url.href);
  console.log("Pathname:", url.pathname);

  // Pokud jsme již na stránce s odepřeným přístupem, pokračujeme bez dalších kontrol.
  if (url.pathname.startsWith("/Pristup-odepren")) {
    console.log("Na stránce odepřeného přístupu, pokračujeme.");
    return NextResponse.next();
  }

  console.log("Kontrola učitelského tokenu (platný token umožňuje volný přístup na celém webu).");

  const tokenFromUrl = url.searchParams.get("token");
  const tokenFromCookies = req.cookies.get("token")?.value;
  console.log("Teacher token z URL:", tokenFromUrl);
  console.log("Teacher token z Cookies:", tokenFromCookies);

  // Definice platného učitelského tokenu.
  const validTeacherToken = "k8!@s0#9l5$q3^r7&p1*m6%v4";

  if (tokenFromUrl === validTeacherToken || tokenFromCookies === validTeacherToken) {
    // Pokud byl token předán v URL a ještě není uložen v cookies, uložíme jej a odstraníme z URL.
    if (tokenFromUrl === validTeacherToken && tokenFromCookies !== validTeacherToken) {
      const response = NextResponse.next();
      response.cookies.set("token", tokenFromUrl, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      console.log("Teacher token uložen do cookies.");
      const cleanUrl = req.nextUrl.clone();
      cleanUrl.searchParams.delete("token");
      return NextResponse.redirect(cleanUrl);
    }
    console.log("Teacher token je platný. Přístup povolen.");
    return NextResponse.next();
  } else {
    console.log("Teacher token není platný. Přístup odepřen.");
    return NextResponse.redirect(new URL("/Pristup-odepren", req.url));
  }
}

// Matcher pro všechny stránky kromě API, _next a favicon.ico.
export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
