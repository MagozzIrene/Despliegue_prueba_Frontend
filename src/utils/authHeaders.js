import LOCALSTORAGE_KEYS from "@/constants/localstorage";

export function authHeaders() {
    const tk = localStorage.getItem(LOCALSTORAGE_KEYS.AUTH_TOKEN);
    return tk ? { Authorization: `Bearer ${tk}` } : {};
}
