import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("=== DEBUG MIDDLEWARE START ===");
  const url = req.nextUrl;
  console.log("Aktuální URL:", url.href);
  console.log("Pathname:", url.pathname);

  // Pokud se již nacházíme na stránce s odepřeným přístupem, pokračujeme bez dalších kontrol.
  if (url.pathname.startsWith("/Pristup-odepren")) {
    console.log("Na stránce odepřeného přístupu, pokračujeme.");
    return NextResponse.next();
  }

  // Rozlišíme, zda se jedná o speciální stránku animací/3D modelů
  const isSpecialPage =
    url.pathname.startsWith("/chemie/chemie1/animace/") ||
    url.pathname.startsWith("/chemie/chemie1/3dmodely/");

  if (isSpecialPage) {
    console.log("Detekována speciální stránka (animace/3D modely).");
    // Platný speciální token – 10 znaků, obsahující symboly
    const validAnimToken = "testToken123";
    const animTokenFromUrl = url.searchParams.get("animToken");
    const animTokenFromCookies = req.cookies.get("animToken")?.value;
    console.log("animToken z URL:", animTokenFromUrl);
    console.log("animToken z Cookies:", animTokenFromCookies);

    // Ověření platnosti speciálního tokenu – povolíme přístup, pokud je token správný
    if (animTokenFromUrl === validAnimToken || animTokenFromCookies === validAnimToken) {
      // Pokud byl animToken předán v URL a ještě není uložen v cookies, uložíme jej a odstraníme z URL (aby nebyl viditelný).
      if (animTokenFromUrl === validAnimToken && animTokenFromCookies !== validAnimToken) {
        const response = NextResponse.next();
        response.cookies.set("animToken", animTokenFromUrl, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });
        console.log("animToken uložen do cookies.");
        const cleanUrl = req.nextUrl.clone();
        cleanUrl.searchParams.delete("animToken");
        return NextResponse.redirect(cleanUrl);
      }
      console.log("animToken je platný. Přístup povolen.");
      return NextResponse.next();
    } else {
      console.log("animToken není platný. Přístup odepřen.");
      return NextResponse.redirect(new URL("/Pristup-odepren", req.url));
    }
  } else {
    // Pro všechny ostatní stránky – kontrola učitelského (obecného) tokenu.
    console.log("Běžná stránka – kontrola učitelského tokenu.");
    const tokenFromUrl = url.searchParams.get("token");
    const tokenFromCookies = req.cookies.get("token")?.value;
    console.log("Teacher token z URL:", tokenFromUrl);
    console.log("Teacher token z Cookies:", tokenFromCookies);

    // Platný učitelský token
    const validTeacherToken = "k8!@s0#9l5$q3^r7&p1*m6%v4";
    if (tokenFromUrl === validTeacherToken || tokenFromCookies === validTeacherToken) {
      // Uložíme token do cookies, pokud ještě tam není, a povolíme přístup
      if (tokenFromUrl === validTeacherToken && tokenFromCookies !== validTeacherToken) {
        const response = NextResponse.next();
        response.cookies.set("token", tokenFromUrl, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });
        console.log("Teacher token uložen do cookies.");
        return response;
      }
      console.log("Teacher token je platný. Přístup povolen.");
      return NextResponse.next();
    } else {
      console.log("Teacher token není platný. Přístup odepřen.");
      return NextResponse.redirect(new URL("/Pristup-odepren", req.url));
    }
  }
}

// Matcher pro všechny stránky kromě API, _next a favicon.ico.
export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
