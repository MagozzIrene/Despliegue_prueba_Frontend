import { FiMessageSquare, FiClock, FiUsers } from "react-icons/fi";
import "./SidebarTabs.css";

const SidebarTabs = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: "accepted", icon: <FiMessageSquare size={22} />, label: "Chats" },
        { id: "pending", icon: <FiClock size={22} />, label: "Pendientes" },
        { id: "groups", icon: <FiUsers size={22} />, label: "Grupos" },
    ];

    return (
        <div className="sidebar-tabs">
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
    );
};

export default SidebarTabs;
