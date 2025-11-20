import { useNavigate } from "react-router";
import useForm from "@/hooks/useForm";
import useFetch from "@/hooks/useFetch";
import { register } from "@/services/authService";
import "../styles/RegisterScreen.css";

const FORM_FIELDS = {
    NAME: "name",
    EMAIL: "email",
    PASSWORD: "password",
};

const initial_form_state = {
    [FORM_FIELDS.NAME]: "",
    [FORM_FIELDS.EMAIL]: "",
    [FORM_FIELDS.PASSWORD]: "",
};

const RegisterScreen = () => {
    const { sendRequest, loading, response, error } = useFetch();
    const navigate = useNavigate();

    const onRegister = (form_state) => {
        sendRequest(() =>
            register(
                form_state[FORM_FIELDS.NAME],
                form_state[FORM_FIELDS.EMAIL],
                form_state[FORM_FIELDS.PASSWORD]
            )
        );
    };

    const { handleSubmit, handleInputChange } = useForm({
        initial_form_state,
        onSubmit: onRegister,
    });

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-logo">
                    <span>💬</span>
                </div>
                <h1 className="login-title">Crear Cuenta</h1>
                <p className="login-subtitle">Regístrate para continuar</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label htmlFor={FORM_FIELDS.NAME}>Nombre</label>
                        <input
                            name={FORM_FIELDS.NAME}
                            id={FORM_FIELDS.NAME}
                            type="text"
                            placeholder="Tu nombre"
                            required
                            onChange={handleInputChange}
                            maxLength={20}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor={FORM_FIELDS.EMAIL}>Email</label>
                        <input
                            name={FORM_FIELDS.EMAIL}
                            id={FORM_FIELDS.EMAIL}
                            type="email"
                            placeholder="tunombre@ejemplo.com"
                            required
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor={FORM_FIELDS.PASSWORD}>Contraseña</label>
                        <input
                            name={FORM_FIELDS.PASSWORD}
                            id={FORM_FIELDS.PASSWORD}
                            type="password"
                            placeholder="••••••••"
                            required
                            onChange={handleInputChange}
                        />
                    </div>

                    {!response ? (
                        <button type="submit" disabled={loading}>
                            {loading ? "Creando cuenta..." : "Registrarse"}
                        </button>
                    ) : (
                        <>
                            <button type="submit" disabled={true}>
                                Cuenta creada
                            </button>
                            <p className="success-message">
                                {response.message ||
                                    "Cuenta creada correctamente. Revisa tu email para verificar tu cuenta antes de iniciar sesión."}
                            </p>
                        </>
                    )}

                    {error && <p className="error-message">{error.message}</p>}
                </form>

                <p className="register-text">
                    ¿Ya tenés una cuenta? <a
                        href="/"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/");
                        }}
                    >
                        Iniciar sesión
                    </a>
                </p>
            </div>
        </div>
    );
};

export default RegisterScreen;
