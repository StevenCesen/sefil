import { useNavigate } from "react-router-dom";
import "./Me.css";
import { useEffect, useRef, useState } from "react";
import Eye from "../../components/Eye/Eye";
import sendpush from "../../helpers/sendpush";
import BackButton from "../../components/BackButton/BackButton";

export default function Me(){
    const navigate = useNavigate();
    const isForced = localStorage.getItem('change_ps') === 'true';
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [code, setCode] = useState('');
    const [isLoadingCode, setIsLoadingCode] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [codeSent, setCodeSent] = useState(false);

    const pass = useRef();
    const passConfirm = useRef();

    const [validations, setValidations] = useState({
        hasMinLength: false,
        hasUpperCase: false,
        hasNumber: false,
        hasSpecialChar: false
    });

    const isPasswordValid = Object.values(validations).every(v => v === true);

    const validatePassword = (value) => {
        setValidations({
            hasMinLength: value.length >= 8,
            hasUpperCase: /[A-Z]/.test(value),
            hasNumber: /[0-9]/.test(value),
            hasSpecialChar: /[@^$#&Ññ]/.test(value)
        });
    }

    const handleSendCode = async () => {
        setIsLoadingCode(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_URL_BASE}/password/send-code`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ id: parseInt(localStorage.getItem('temp_uS')) })
                }
            );

            const data = await response.json();

            if (data.code === 1) {
                setCodeSent(true);
                const username = localStorage.getItem('name')?.toLowerCase() === 'maria_bravo';

                sendpush({
                    title: 'Código enviado',
                    message: username
                        ? 'Revisa tu correo electrónico para obtener el código de seguridad.'
                        : 'Pide el código en sistemas.',
                    type: 'Push--sucessful',
                    timeout: 5000
                });

            } else {
                throw new Error(data.message || 'Error al enviar el código');
            }
        } catch (error) {
            sendpush({
                title: 'Error',
                message: error.message || 'No se pudo enviar el código. Intenta nuevamente.',
                type: 'Push--danger',
                timeout: 5000
            });
        } finally {
            setIsLoadingCode(false);
        }
    }

    const handleUpdatePassword = async () => {
        if (!isPasswordValid) {
            sendpush({
                title: 'Contraseña inválida',
                message: 'Por favor, cumple con todos los requisitos de seguridad.',
                type: 'Push--danger',
                timeout: 5000
            });
            return;
        }

        if (password !== passwordConfirmation) {
            sendpush({
                title: 'Error',
                message: 'Las contraseñas no coinciden.',
                type: 'Push--danger',
                timeout: 5000
            });
            return;
        }

        if (!code.trim()) {
            sendpush({
                title: 'Código requerido',
                message: 'Ingresa el código de seguridad enviado a tu correo.',
                type: 'Push--danger',
                timeout: 5000
            });
            return;
        }

        setIsUpdating(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_URL_BASE}/password/reset`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        id: parseInt(localStorage.getItem('temp_uS')),
                        code: parseInt(code),
                        password: password,
                        password_confirmation: passwordConfirmation
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('change_ps', 'false');
                sendpush({
                    title: '¡Éxito!',
                    message: 'Tu contraseña ha sido actualizada correctamente.',
                    type: 'Push--sucessful',
                    timeout: 5000
                });

                setTimeout(() => {
                    if (isForced) {
                        location.href = '/';
                    } else {
                        navigate(-1);
                    }
                }, 2000);
            } else {
                sendpush({
                    title: 'Error al actualizar',
                    message: data.message || 'El código es incorrecto o ha expirado.',
                    type: 'Push--danger',
                    timeout: 5000
                });
            }
        } catch (error) {
            sendpush({
                title: 'Error',
                message: 'No se pudo actualizar la contraseña. Intenta nuevamente.',
                type: 'Push--danger',
                timeout: 5000
            });
        } finally {
            setIsUpdating(false);
        }
    }

    useEffect(() => {
        sendpush({
            title: 'Actualización de contraseña',
            message: 'Por tu seguridad, deberás actualizar la contraseña cada mes.',
            type: 'Push--info',
            timeout: 5000
        });
    }, []);

    return (
        <div className="Me">
            <BackButton />

            <div className="Me__content">
                <h1 className="Me__avatar">
                    {localStorage.getItem('name')?.substring(0, 1) +
                    (localStorage.getItem('name')?.split(' ')[1]?.substring(0, 1) || '')}
                </h1>
                <div className="Me__form-container">
                    <p className="Me__name">{localStorage.getItem('name')}</p>
                    <div className="Me__form">
                        {isForced && (
                            <p className="Me__forced-warning">🔒 Por tu seguridad, es necesario que cambies tu contraseña.</p>
                        )}
                        <h2>Actualizar Contraseña</h2>

                        <label className="Me__field">
                            <span className="Me__label">Código de seguridad</span>
                            <small className="Me__help">Recibirás el código en tu correo electrónico o en administración</small>
                            <div className="Me__code-group">
                                <input
                                    type="text"
                                    value={code}
                                    autoComplete="off"
                                    placeholder="Ingresa el código aquí"
                                    onChange={(e) => setCode(e.target.value)}
                                    disabled={isLoadingCode}
                                    className="Me__input"
                                />
                                <button
                                    onClick={handleSendCode}
                                    disabled={isLoadingCode || codeSent}
                                    type="button"
                                    className="Me__send-btn"
                                >
                                    {isLoadingCode ? 'Enviando...' : codeSent ? 'Enviado ✓' : 'Enviar'}
                                </button>
                            </div>
                        </label>

                        <label className="Me__field Me__field--password">
                            <span className="Me__label">Nueva contraseña</span>
                            <small className="Me__help">Debe cumplir con los requisitos de seguridad</small>
                            <input
                                ref={pass}
                                type="password"
                                placeholder="Ingresa tu nueva contraseña"
                                value={password}
                                autoComplete="new-password"
                                className="Me__input Me__input--password"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setPassword(value);
                                    validatePassword(value);
                                }}
                            />
                            <Eye input={pass} />
                        </label>

                        <label className="Me__field Me__field--password">
                            <span className="Me__label">Confirmar contraseña</span>
                            <small className="Me__help">Repite tu nueva contraseña</small>
                            <input
                                ref={passConfirm}
                                type="password"
                                placeholder="Confirma tu nueva contraseña"
                                value={passwordConfirmation}
                                autoComplete="new-password"
                                className="Me__input Me__input--password"
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                            />
                            <Eye input={passConfirm} />
                        </label>
                        {password && passwordConfirmation && password !== passwordConfirmation && (
                            <p className="Me__requirement">Las contraseñas no coinciden</p>
                        )}

                        <div className="Me__requirements">
                            <p className="Me__requirements-title">Requisitos de seguridad:</p>
                            <p className={validations.hasMinLength ? 'Me__requirement--valid' : 'Me__requirement'}>
                                {validations.hasMinLength ? '✓' : '○'} Mínimo 8 caracteres
                            </p>
                            <p className={validations.hasUpperCase ? 'Me__requirement--valid' : 'Me__requirement'}>
                                {validations.hasUpperCase ? '✓' : '○'} Al menos una mayúscula
                            </p>
                            <p className={validations.hasNumber ? 'Me__requirement--valid' : 'Me__requirement'}>
                                {validations.hasNumber ? '✓' : '○'} Al menos un número
                            </p>
                            <p className={validations.hasSpecialChar ? 'Me__requirement--valid' : 'Me__requirement'}>
                                {validations.hasSpecialChar ? '✓' : '○'} Al menos un carácter especial (@, ^, $, #, &, Ñ, ñ)
                            </p>
                        </div>
                        
                        <button
                            onClick={handleUpdatePassword}
                            disabled={!isPasswordValid || !code.trim() || isUpdating || password !== passwordConfirmation}
                            type="button"
                            className="Me__update-btn"
                        >
                            {isUpdating ? 'Actualizando...' : 'Actualizar contraseña'}
                        </button>
                        
                        {!codeSent && (
                            <p className="Me__info">
                                Primero obtén el código de seguridad haciendo clic en "Enviar"
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
