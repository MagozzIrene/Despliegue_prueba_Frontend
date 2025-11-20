import { useContext, useEffect, useMemo } from "react";
import { GroupsContext } from "@/context/GroupsContext";

export default function useGroupsTab(search, activeTab) {
    const { groups, fetchMyGroups, isLoadingGroups } = useContext(GroupsContext);

    useEffect(() => {
        if (activeTab === "groups") {
            fetchMyGroups();
        }
    }, [activeTab, fetchMyGroups]);

    const filtered = useMemo(() => {
        return groups
            .filter((g) =>
                g.name.toLowerCase().includes(search)
            )
            .sort((a, b) => {
                const tA = a.last_message_time
                    ? new Date(a.last_message_time).getTime()
                    : new Date(a.created_at).getTime();

                const tB = b.last_message_time
                    ? new Date(b.last_message_time).getTime()
                    : new Date(b.created_at).getTime();

                return tB - tA;
            });
    }, [groups, search]);

    return { groups: filtered, isLoadingGroups };
}
