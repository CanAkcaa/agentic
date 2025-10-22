//@ts-ignore
import Cookies from 'js-cookie';

export class CookieUtils {
  static setSecureCookie(key: string, value: string): void {
    // HttpOnly cookie'ler sadece backend tarafından ayarlanabilir
    // Frontend'de Secure flag ile cookie ayarlıyoruz
    Cookies.set(key, value, {
      secure: true, // HTTPS üzerinden iletişim için
      sameSite: 'strict', // CSRF koruması için
      expires: 7 // 7 günlük süre (isteğe bağlı olarak değiştirilebilir)
    });
  }

  static getCookie(key: string): string | undefined {
    return Cookies.get(key);
  }

  static removeCookie(key: string): void {
    Cookies.remove(key);
  }

  static clearAllCookies(): void {
    Object.keys(Cookies.get()).forEach(cookieName => {
      Cookies.remove(cookieName);
    });
  }
}
