import { createContext, useCallback, useMemo, useState } from "react";
import axios from "axios";

export const GroupsContext = createContext({
    groups: [],
    isLoadingGroups: false,
    fetchMyGroups: () => { },
    createGroup: async () => { },
    inviteToGroup: async () => { },
    getGroupById: async () => { },
    getMembers: async () => { },
    setGroups: () => { },
});

const GroupsContextProvider = ({ children }) => {
    const [groups, setGroups] = useState([]);
    const [isLoadingGroups, setIsLoadingGroups] = useState(false);

    const unwrap = (resp) => (resp?.data?.data ?? resp?.data ?? resp);

    const API_BASE =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

    console.log("[Groups] API_BASE =", API_BASE);

    const authHeaders = useMemo(() => {
        const token = localStorage.getItem("auth_token");
        return { Authorization: `Bearer ${token}` };
    }, []);

    const fetchMyGroups = useCallback(async () => {
        setIsLoadingGroups(true);
        try {

            const resp1 = await axios.get(
                `${API_BASE}/api/group-members/user/me`,
                { headers: authHeaders }
            );
            const meGroups = resp1?.data?.data ?? resp1?.data ?? [];

            if (Array.isArray(meGroups) && meGroups.length > 0) {
                setGroups(meGroups);
            } else {

                const resp2 = await axios.get(
                    `${API_BASE}/api/groups`,
                    { headers: authHeaders }
                );
                const allGroups = resp2?.data?.data ?? resp2?.data ?? [];
                setGroups(Array.isArray(allGroups) ? allGroups : []);
            }
        } catch (err) {
            console.error("fetchMyGroups error:", err);
            setGroups([]);
        } finally {
            setIsLoadingGroups(false);
        }
    }, [API_BASE, authHeaders]);

    const createGroup = useCallback(
        async ({ name, description = "", avatar = "" }) => {
            const payload = { name, description, avatar };
            const { data } = await axios.post(
                `${API_BASE}/api/groups`,
                payload,
                { headers: authHeaders }
            );
            const created = data?.data || data;
            setGroups((prev) => [created, ...prev]);
            return created;
        },
        [API_BASE, authHeaders]
    );

    const inviteToGroup = useCallback(
        async ({ group_id, user_id, email }) => {
            const payload = { group_id, user_id, email };
            const resp = await axios.post(
                `${API_BASE}/api/group-invites`,
                payload,
                { headers: authHeaders }
            );
            return unwrap(resp);
        },
        [API_BASE, authHeaders]
    );

    const getGroupById = useCallback(
        async (group_id) => {
            const { data } = await axios.get(
                `${API_BASE}/api/groups/${group_id}`,
                { headers: authHeaders }
            );
            return data?.data ?? data ?? null;
        },
        [API_BASE, authHeaders]
    );

    const getMembers = useCallback(
        async (group_id) => {
            const { data } = await axios.get(
                `${API_BASE}/api/group-members/${group_id}`,
                { headers: authHeaders }
            );

            if (Array.isArray(data?.data)) return data.data;
            if (Array.isArray(data)) return data;
            if (Array.isArray(data?.members)) return data.members;
            return [];
        },
        [API_BASE, authHeaders]
    );

    return (
        <GroupsContext.Provider
            value={{
                groups,
                isLoadingGroups,
                setGroups,
                fetchMyGroups,
                createGroup,
                inviteToGroup,
                getGroupById,
                getMembers,
            }}
        >
            {children}
        </GroupsContext.Provider>
    );
};

export default GroupsContextProvider;
