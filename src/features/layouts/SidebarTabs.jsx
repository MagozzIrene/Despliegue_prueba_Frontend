import { FiMessageSquare, FiClock, FiUsers, FiLogOut } from "react-icons/fi";
import { useContext, useMemo } from "react";
import { AuthContext } from "@/context/AuthContext";
import "./SidebarTabs.css";

function getAvatarFromToken() {
    try {
        const raw = localStorage.getItem("auth_token");
        if (!raw) return null;
        const base64 = raw.split(".")[1];
        const json = JSON.parse(atob(base64));
        return json?.avatar || null;
    } catch {
        return null;
    }
}

function dicebearFromName(name) {
    if (!name) return null;
    const seed = encodeURIComponent(name.trim());
    return `https://api.dicebear.com/8.x/avataaars/svg?seed=${seed}&radius=50&size=70`;
}

const SidebarTabs = ({ activeTab, setActiveTab }) => {
    const { activeUser, logout } = useContext(AuthContext);

    const tabs = useMemo(
        () => [
            { id: "accepted", icon: <FiMessageSquare size={22} />, label: "Chats" },
            { id: "pending", icon: <FiClock size={22} />, label: "Pendientes" },
            { id: "groups", icon: <FiUsers size={22} />, label: "Grupos" },
        ],
        []
    );

    const initials = useMemo(() => {
        const n = activeUser?.name || "";
        const parts = n.split(" ").filter(Boolean);
        return (parts[0]?.[0] + (parts[1]?.[0] || "")).toUpperCase() || "U";
    }, [activeUser?.name]);

    const avatarUrl = useMemo(() => {
        return (
            activeUser?.avatar ||
            getAvatarFromToken() ||
            dicebearFromName(activeUser?.name)
        );
    }, [activeUser?.avatar, activeUser?.name]);

    return (
        <aside className="sidebar-tabs">
            <div className="sidebar-tabs__top">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        className={`sidebar-tab ${activeTab === t.id ? "active" : ""}`}
                        onClick={() => setActiveTab(t.id)}
                        title={t.label}
                    >
                        {t.icon}
                    </button>
                ))}
            </div>

            <div className="sidebar-tabs__bottom">
                <div className="sidebar-avatar" title={activeUser?.name || "Usuario"}>
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={activeUser?.name || "avatar"} />
                    ) : (
                        <span className="sidebar-avatar__fallback">{initials}</span>
                    )}
                </div>

                <button
                    className="sidebar-tab danger"
                    onClick={async () => {
                        try {
                            await logout();
                        } finally {
                            window.location.href = "/login";
                        }
                    }}
                    title="Cerrar sesión"
                    aria-label="Cerrar sesión"
                >
                    <FiLogOut size={22} />
                </button>
            </div>
        </aside>
    );
};

export default SidebarTabs;

