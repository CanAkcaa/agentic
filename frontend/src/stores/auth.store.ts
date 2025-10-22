
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CookieUtils } from "../utils/cookie";
import { EKEYS } from "../config";
import { STORE_NAME } from "./constants";


interface IProps {
    token: string;
    isAuth: boolean;
    lang: string;
    claims: string[];
    rememberMe: boolean;
    rememberUserName: string;
    getToken: () => string;
    setToken: (token: string) => void;
    setRememberMe: (rememberMe: boolean) => void;
    setRememberUserName: (rememberUserName: string) => void;
    setClaims: (claims: string[]) => void;
    setLang: (lang: string) => void;
    setIsAuth: (isAuth: boolean) => void;
    signOut: () => void;
}

export const useAuthStore = create(
    persist<IProps>(
        (set) => ({
            token: "",
            lang: "en-EN",
            isAuth: false,
            claims: [],
            rememberMe: false,
            rememberUserName: "",
            getToken: () => CookieUtils.getCookie(EKEYS.tokenKey) || "",
            setRememberMe: (rememberMe) => set({ rememberMe }),
            setRememberUserName: (rememberUserName) => set({ rememberUserName }),
            setToken: (token) => {
                CookieUtils.setSecureCookie(EKEYS.tokenKey, token)
                set({ token: "" }) // token'ı state'te boş string olarak tutuyoruz
            },
            setIsAuth: (isAuth) => set({ isAuth }),
            setLang: (lang) => set({ lang }),
            setClaims: (claims) => set({ claims }),
            signOut: () => {
                CookieUtils.removeCookie(EKEYS.tokenKey);
                set({ token: "", isAuth: false });
            },
        }),
        {
            name: STORE_NAME.AUTH,
            storage: createJSONStorage(() => localStorage),
        }
    )
)