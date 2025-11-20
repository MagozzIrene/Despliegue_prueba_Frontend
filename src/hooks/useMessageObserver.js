import { useEffect } from "react";
import { useContext } from "react";
import { MessagesContext } from "@/context/MessagesContext";

export default function useMessageObserver(isGroup, observerRef) {
    const { markGroupMessageAsRead } = useContext(MessagesContext);

    useEffect(() => {
        if (!isGroup) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const messageId = entry.target.dataset.messageId;
                        if (messageId) markGroupMessageAsRead(messageId);
                    }
                });
            },
            { threshold: 0.6 }
        );

        observerRef.current = observer;

        return () => observer.disconnect();
    }, [isGroup, markGroupMessageAsRead]);
}
