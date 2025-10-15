/* import React, { useEffect } from 'react'
import useFetch from '../../hooks/useFetch.jsx'
import useForm from '../../hooks/useForm.jsx'
import { login } from '../../services/authService.js'
import { useNavigate } from 'react-router'
import LOCALSTORAGE_KEYS from '../../constants/localstorage.js'

const FORM_FIELDS = {
    EMAIL: 'email',
    PASSWORD: 'password'
}

const initial_form_state = {
    [FORM_FIELDS.EMAIL]: '',
    [FORM_FIELDS.PASSWORD]: ''
}

export const LoginScreen = () => {

    const navigate = useNavigate()

    const {
        sendRequest,
        loading,
        response,
        error
    } = useFetch()

    const onLogin = (form_state) => {
        sendRequest(() => login(
            form_state[FORM_FIELDS.EMAIL],
            form_state[FORM_FIELDS.PASSWORD]
        ))
    }

    useEffect(
        () => {
            console.log(response)
            if (response && response.ok) {
                //Guardamos el token emitido por el backend, para despues usarlo como credencial
                localStorage.setItem(LOCALSTORAGE_KEYS.AUTH_TOKEN, response.data.authorization_token)
                navigate('/home')
            }
        },
        [response]
    )

    const {
        form_state: login_form_state,
        handleSubmit,
        handleInputChange
    } = useForm(
        {
            initial_form_state,
            onSubmit: onLogin
        }
    )

    return (
        <div>
            <h1>Iniciar Sesión</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor={FORM_FIELDS.EMAIL}>Email:</label>
                    <input
                        name={FORM_FIELDS.EMAIL}
                        id={FORM_FIELDS.EMAIL}
                        type='email'
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor={FORM_FIELDS.PASSWORD}>Contraseña:</label>
                    <input
                        name={FORM_FIELDS.PASSWORD}
                        id={FORM_FIELDS.PASSWORD}
                        type='password'
                        onChange={handleInputChange}
                    />
                </div>
                {
                    !response
                        ?
                        <button type='submit' disabled={loading}>
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                        :
                        <>
                            <button type='submit' disabled={true}>Sesión Iniciada</button>
                            <span style={{ color: 'green' }}>{response.message}</span>
                        </>
                }
                {
                    error && <span style={{ color: 'red' }}>{error.message}</span>
                }
            </form>
        </div>
    )
} */

import React, { useEffect } from "react";
import useFetch from "../../hooks/useFetch.jsx";
import useForm from "../../hooks/useForm.jsx";
import { login } from "../../services/authService.js";
import { useNavigate } from "react-router";
import LOCALSTORAGE_KEYS from "../../constants/localstorage.js";
import "./LoginScreen.css"

const FORM_FIELDS = {
    EMAIL: "email",
    PASSWORD: "password",
};

const initial_form_state = {
    [FORM_FIELDS.EMAIL]: "",
    [FORM_FIELDS.PASSWORD]: "",
};

export const LoginScreen = () => {
    const navigate = useNavigate();

    const { sendRequest, loading, response, error } = useFetch();

    const onLogin = (form_state) => {
        sendRequest(() =>
            login(form_state[FORM_FIELDS.EMAIL], form_state[FORM_FIELDS.PASSWORD])
        );
    };

    useEffect(() => {
        if (response && response.ok) {
            localStorage.setItem(
                LOCALSTORAGE_KEYS.AUTH_TOKEN,
                response.data.authorization_token
            );

            if (response.data?.user) {
                localStorage.setItem(
                    LOCALSTORAGE_KEYS.USER,
                    JSON.stringify(response.data.user)
                );
            }

            navigate("/contacts");
        }
    }, [response]);

    const { handleSubmit, handleInputChange } = useForm({
        initial_form_state,
        onSubmit: onLogin,
    });

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-logo">
                    <span>💬</span>
                </div>
                <h1 className="login-title">WhatsApp Clone</h1>
                <p className="login-subtitle">Inicia sesión para continuar</p>

                <form onSubmit={handleSubmit} className="login-form">
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

                    <button type="submit" disabled={loading}>
                        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                    </button>

                    {error && <p className="error-message">{error.message}</p>}
                    {response && response.ok && (
                        <p className="success-message">Inicio de sesión exitosa!</p>
                    )}
                </form>

                <p className="register-text">

                    ¿No tenés una cuenta? <a href="/register">Registrate</a>
                </p>
            </div>
        </div>
    );
};
