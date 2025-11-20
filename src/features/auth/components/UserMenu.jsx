import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import "../styles/UserMenu.css"

export default function UserMenu() {
    const { activeUser, logout } = useContext(AuthContext);
    const [open, setOpen] = useState(false);

    if (!activeUser) return null;

    return (
        <div className="user-menu">
            <button
                className="user-menu__trigger"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                title={activeUser.name}
            >
                <img src={activeUser.avatar} alt={activeUser.name} className="user-menu__avatar" />
            </button>

            {open && (
                <div className="user-menu__dropdown" role="menu">
                    <div className="user-menu__header">
                        <img src={activeUser.avatar} alt="" />
                        <div>
                            <strong>{activeUser.name}</strong>
                            <small>{activeUser.email}</small>
                        </div>
                    </div>

                    <button
                        role="menuitem"
                        className="user-menu__logout"
                        onClick={async () => {
                            try { await logout(); } finally { window.location.href = "/login"; }
                        }}
                    >
                        Cerrar sesión
                    </button>
                </div>
            )}
        </div>
    );
}
