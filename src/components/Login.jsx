
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import './Login.css';

export default function Login({ onLogin, onBack }) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Por favor, complete todos los campos.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Dispatch to Redux store
                dispatch(setUser({ user: data.user, token: data.token }));
                // Call parent handler (for navigation)
                onLogin(data.user);
            } else {
                setError(data.message || 'Error al iniciar sesión');
            }
        } catch (err) {
            setError('Error de conexión con el servidor. Asegúrese de que el backend esté corriendo.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <button onClick={onBack} className="back-button" aria-label="Volver">
                    ← Volver
                </button>

                <div className="login-header">
                    <h2>Iniciar Sesión</h2>
                    <p>Acceda a su cuenta de LegalTech</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nombre@empresa.com"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            disabled={isLoading}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>

                <div className="login-footer">
                    <a href="#" className="forgot-password">¿Olvidó su contraseña?</a>
                </div>
            </div>
        </div>
    );
}
