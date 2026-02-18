
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import './Login.css';

export default function Login({ onLogin, onBack, initialMode = 'login' }) {
    const dispatch = useDispatch();
    const [isLogin, setIsLogin] = useState(initialMode === 'login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); // Only for register
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            if (!email || !password) {
                setError('Por favor, complete todos los campos.');
                return;
            }
        } else {
            if (!email || !password || !name) {
                setError('Por favor, complete todos los campos.');
                return;
            }
        }

        setIsLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const endpoint = isLogin ? '/api/login' : '/api/register';

            const payload = isLogin
                ? { email, password }
                : { email, password, name, role: 'client' };

            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                if (isLogin) {
                    dispatch(setUser({ user: data.user, token: data.token }));
                    onLogin(data.user);
                } else {
                    // Auto-login after register? Or just switch to login?
                    // Let's trying auto-login if the API returns a token (which register usually does in modern APIs, 
                    // but if your backend doesn't return token on register, check that).
                    // Assuming register returns user created.
                    alert("Registro exitoso. Por favor inicie sesión.");
                    setIsLogin(true);
                }
            } else {
                setError(data.message || (isLogin ? 'Error al iniciar sesión' : 'Error al registrarse'));
            }
        } catch (err) {
            setError('Error de conexión con el servidor.');
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
                    <h2>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
                    <p>{isLogin ? 'Acceda a su cuenta de LegalTech' : 'Únete para consultar a nuestra IA'}</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="name">Nombre Completo</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Tu nombre"
                                disabled={isLoading}
                            />
                        </div>
                    )}

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
                        {isLoading ? 'Procesando...' : (isLogin ? 'Ingresar' : 'Registrarse')}
                    </button>
                </form>

                <div className="login-footer">
                    {isLogin ? (
                        <>
                            <a href="#" className="forgot-password">¿Olvidó su contraseña?</a>
                            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                                ¿No tienes cuenta? <button onClick={() => setIsLogin(false)} style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', fontWeight: 'bold' }}>Regístrate aquí</button>
                            </p>
                        </>
                    ) : (
                        <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                            ¿Ya tienes cuenta? <button onClick={() => setIsLogin(true)} style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', fontWeight: 'bold' }}>Inicia sesión aquí</button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
