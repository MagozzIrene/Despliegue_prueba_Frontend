import { useEffect } from "react";

export default function useAutoScroll(messages, bottomRef) {
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
}
