import { useState } from "react";
import "../LoginScreen/LoginScreen.css";

export const RecoverPasswordScreen = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRecover = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/recover-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("Si el correo existe, se enviará un enlace para restablecer la contraseña.");
            } else {
                setMessage(data.message || "Error al enviar el correo.");
            }
        } catch (err) {
            setMessage("Error al conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-logo">
                    <span>💬</span>
                </div>
                <h1 className="login-title">Recuperar contraseña</h1>
                <p className="login-subtitle">
                    Ingresá tu correo electrónico para recibir el enlace de recuperación:
                </p>

                <form onSubmit={handleRecover} className="login-form">
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            placeholder="tunombre@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Enviando..." : "Enviar enlace"}
                    </button>
                </form>

                {message && <p className="success-message">{message}</p>}

                <p className="register-text">
                    ¿Recordaste tu contraseña? <a href="/">Iniciar sesión</a>
                </p>
            </div>
        </div>
    );
};
