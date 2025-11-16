import ENVIROMENT from "../config/enviroment.js"
import { CONTENT_TYPE_VALUES, HEADERS, HTTP_METHODS } from "../constants/http"

export async function register(name, email, password) {
    const user = {
        email,
        name,
        password
    }

    const response_http = await fetch(
    `${ENVIROMENT.URL_API}/api/auth/register`,
        {
            method: HTTP_METHODS.POST,
            headers: {
                [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON
            },
            body: JSON.stringify(user)
        }
    )

    const response_data = await response_http.json()
    if (!response_data.ok) {
        throw new Error(response_data.message)
    }
    return response_data
}

export async function login(email, password) {
    const response = await fetch(
        `${ENVIROMENT.URL_API}/api/auth/login`,
        {
            method: HTTP_METHODS.POST,
            headers: {
                [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
            },
            body: JSON.stringify({ email, password })
        })
    const response_data = await response.json()

    if (!response.ok) {
        throw new Error(response_data.message)
    }
    return response_data
}

export function formatMessageTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();

    const isSameDay =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

    if (isSameDay) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    if (isYesterday) {
        return "Ayer";
    }

    return date.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}
