import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ContactsContext } from "@/context/ContactsContext";

export default function usePendingContacts(search, API_BASE, currentUserId) {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("auth_token");

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${API_BASE}/api/contacts/pending`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!alive) return;
                setPending(data?.data || []);
            } catch (e) {
                console.error(e);
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => (alive = false);
    }, [API_BASE]);

    const filtered = pending.filter((c) => {
        const otherUser =
            c.requester_id?._id === currentUserId ? c.receiver_id : c.requester_id;

        return otherUser?.name?.toLowerCase().includes(search);
    });

    return { pending: filtered, loading, setPending };
}
