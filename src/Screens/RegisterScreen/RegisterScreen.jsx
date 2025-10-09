/* import React, { useState } from 'react'
import useForm from '../../hooks/useForm'
import { register } from '../../services/authService'
import useFetch from '../../hooks/useFetch'

const FORM_FIELDS = {
    NAME: 'name',
    EMAIL: 'email',
    PASSWORD: 'password'
}
const initial_form_state = {
    [FORM_FIELDS.NAME]: '',
    [FORM_FIELDS.EMAIL]: '',
    [FORM_FIELDS.PASSWORD]: ''
}

const RegisterScreen = () => {

    const {
        sendRequest,
        loading,
        response,
        error
    } = useFetch()

    const onRegister = (form_state) => {
        sendRequest( () => {
            register(
                form_state[FORM_FIELDS.NAME], 
                form_state[FORM_FIELDS.EMAIL], 
                form_state[FORM_FIELDS.PASSWORD]
            )
        })
    }   

    const {
        form_state: register_form_state,
        handleSubmit,
        handleInputChange
    } = useForm(
        {
            initial_form_state,
            onSubmit: onRegister
        }
    )


    console.log(loading)
    return (
        <div>
            <h1>Registrate</h1>
            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor={FORM_FIELDS.NAME} >Nombre:</label>
                    <input
                        name={FORM_FIELDS.NAME}
                        id={FORM_FIELDS.NAME}
                        type='text'
                        onChange={handleInputChange}
                    />
                </div>
                <div>


                    <label htmlFor={FORM_FIELDS.EMAIL} >Email:</label>
                    <input
                        name={FORM_FIELDS.EMAIL}
                        id={FORM_FIELDS.EMAIL}
                        type='email'
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor={FORM_FIELDS.PASSWORD} >Contraseña:</label>
                    <input
                        name={FORM_FIELDS.PASSWORD}
                        id={FORM_FIELDS.PASSWORD}
                        type='password'
                        onChange={handleInputChange}
                    />
                </div>
                {
                    !response
                    ? <button type='submit' disabled={loading}>Registrarse</button>
                    : <>
                        <button type='submit' disabled={true}>Registrado</button>
                        <span style={{color: 'green'}}>{response.message}</span>
                    </>
                }
                {
                    error && <span style={{color: 'red'}}>{error.message}</span>
                }
               
                
            </form>
        </div>
    )
}

export default RegisterScreen */

import React, { useEffect } from "react";
import useForm from "../../hooks/useForm";
import useFetch from "../../hooks/useFetch";
import { register } from "../../services/authService";
import "./RegisterScreen.css";

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
                                Account Created
                            </button>
                            <p className="success-message">{response.message}</p>
                        </>
                    )}

                    {error && <p className="error-message">{error.message}</p>}
                </form>

                <p className="register-text">
                    ¿Ya tenés una cuenta? <a href="/">Iniciar sesión</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterScreen;
