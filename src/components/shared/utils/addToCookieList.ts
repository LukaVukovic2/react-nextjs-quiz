import { getCookie, setCookie } from "cookies-next";

export const addToCookieList = (cookieName: string, value: unknown) => {
  const existingItems = JSON.parse(
    getCookie(cookieName) || "[]"
  );
  const newList = [...existingItems, value];
  setCookie(cookieName, JSON.stringify(newList), 
    { maxAge: 60 * 60 * 24 }
  );
}