import { createContext, useCallback, useState } from "react";
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
    updateGroupLastMessageLocally: () => { },
});

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const api = axios.create({ baseURL: API_BASE });
api.interceptors.request.use((cfg) => {
    const t = localStorage.getItem("auth_token");
    if (t) cfg.headers.Authorization = `Bearer ${t}`;
    return cfg;
});

const GroupsContextProvider = ({ children }) => {
    const [groups, setGroups] = useState([]);
    const [isLoadingGroups, setIsLoadingGroups] = useState(false);
    const [hasLoadedGroups, setHasLoadedGroups] = useState(false);

    const fetchMyGroups = useCallback(
        async ({ force = false } = {}) => {
            if (hasLoadedGroups && !force) {
                return;
            }

            setIsLoadingGroups(true);
            try {
                const { data } = await api.get("/api/group-members/user/me");
                const list = Array.isArray(data?.data) ? data.data : [];

                const sorted = [...list].sort((a, b) => {
                    const tA = a.last_message_time
                        ? new Date(a.last_message_time).getTime()
                        : (a.created_at ? new Date(a.created_at).getTime() : 0);

                    const tB = b.last_message_time
                        ? new Date(b.last_message_time).getTime()
                        : (b.created_at ? new Date(b.created_at).getTime() : 0);

                    return tB - tA;
                });

                setGroups(sorted);
                setHasLoadedGroups(true);
            } catch (err) {
                console.error("fetchMyGroups error:", err);
                setGroups([]);
            } finally {
                setIsLoadingGroups(false);
            }
        },
        [hasLoadedGroups]
    );

    const createGroup = useCallback(
        async ({ name, description = "", avatar = "" }) => {
            const payload = { name, description, avatar };
            const { data } = await api.post("/api/groups", payload);
            const created = data?.data || data;

            setGroups((prev) => {
                const newList = [...prev, created];

                return newList.sort((a, b) => {
                    const tA = a.last_message_time
                        ? new Date(a.last_message_time).getTime()
                        : (a.created_at ? new Date(a.created_at).getTime() : 0);

                    const tB = b.last_message_time
                        ? new Date(b.last_message_time).getTime()
                        : (b.created_at ? new Date(b.created_at).getTime() : 0);

                    return tB - tA;
                });
            });

            return created;
        },
        []
    );

    const inviteToGroup = useCallback(async ({ group_id, user_id, email }) => {
        const payload = { group_id, user_id, email };
        const { data } = await api.post("/api/group-invites", payload);
        return data?.data ?? data;
    }, []);

    const getGroupById = useCallback(async (group_id) => {
        const { data } = await api.get(`/api/groups/${group_id}`);
        return data?.data ?? data ?? null;
    }, []);

    const getMembers = useCallback(async (group_id) => {
        const { data } = await api.get(`/api/group-members/${group_id}`);
        if (Array.isArray(data?.data)) return data.data;
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.members)) return data.members;
        return [];
    }, []);

    const updateGroupLastMessageLocally = (groupId, info) => {
    setGroups((prev) =>
        [...prev]
            .map((g) =>
                String(g._id) === String(groupId)
                    ? {
                        ...g,
                        last_message: info.text,
                        last_message_time: info.sent_at,

                        last_message_sender: info.senderName,
                        last_message_sender_id: info.senderId,
                        last_message_sender_avatar: info.senderAvatar,
                    }
                    : g
            )
            .sort((a, b) => {
                const tA = a.last_message_time
                    ? new Date(a.last_message_time).getTime()
                    : 0;
                const tB = b.last_message_time
                    ? new Date(b.last_message_time).getTime()
                    : 0;
                return tB - tA;
            })
    );
};

    const deleteGroup = useCallback(async (group_id) => {
        try {
            await api.delete(`/api/groups/${group_id}`);

            setGroups(prev => prev.filter(g => g._id !== group_id));

            return true;
        } catch (err) {
            console.error("Error eliminando grupo:", err);
            return false;
        }
    }, []);


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
                updateGroupLastMessageLocally,
                deleteGroup,
            }}
        >
            {children}
        </GroupsContext.Provider>
    );
};

export default GroupsContextProvider;
