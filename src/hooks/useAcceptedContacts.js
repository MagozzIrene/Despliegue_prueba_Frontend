import { useContext, useMemo } from "react";
import { ContactsContext } from "@/context/ContactsContext";

export default function useAcceptedContacts(search) {
    const { contacts, isLoadingContacts } = useContext(ContactsContext);

    const filtered = useMemo(() => {
        return contacts
            .filter((c) =>
                c.name.toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => {
                const tA = a.last_message_time ? new Date(a.last_message_time).getTime() : 0;
                const tB = b.last_message_time ? new Date(b.last_message_time).getTime() : 0;
                return tB - tA;
            });
    }, [contacts, search]);

    return { filtered, isLoadingContacts };
}
