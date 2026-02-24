import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../store/userSlice';
import './UserProfile.css';

export default function UserProfile({ onBack }) {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const [activeTab, setActiveTab] = useState('info');
    const [conversations, setConversations] = useState([]);
    const [stats, setStats] = useState({ totalConversations: 0, totalMessages: 0 });
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(currentUser?.name || '');
    const [saveStatus, setSaveStatus] = useState(null); // 'saving' | 'saved' | 'error'

    const API_URL = import.meta.env.VITE_API_URL || 'https://n8n-bot-back-cristian.gnuu1e.easypanel.host';

    // Fetch user profile data
    useEffect(() => {
        if (!currentUser?.id) return;

        fetch(`${API_URL}/api/user/${currentUser.id}/profile`)
            .then(res => res.json())
            .then(data => {
                if (data.stats) setStats(data.stats);
                if (data.conversations) setConversations(data.conversations);
            })
            .catch(err => console.error('Error fetching profile:', err));
    }, [currentUser, API_URL]);

    const handleSaveName = async () => {
        if (!editName.trim() || editName === currentUser.name) {
            setIsEditing(false);
            return;
        }

        setSaveStatus('saving');
        try {
            const res = await fetch(`${API_URL}/api/user/${currentUser.id}/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName.trim() })
            });
            const data = await res.json();
            if (data.status === 'success') {
                dispatch(updateUser({ name: editName.trim() }));
                setSaveStatus('saved');
                setTimeout(() => setSaveStatus(null), 2000);
                setIsEditing(false);
            } else {
                setSaveStatus('error');
                setTimeout(() => setSaveStatus(null), 3000);
            }
        } catch (err) {
            console.error('Error saving profile:', err);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 3000);
        }
    };

    const userInitial = (currentUser?.name || currentUser?.email || '?').charAt(0).toUpperCase();
    const memberSince = currentUser?.created_at
        ? new Date(currentUser.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'N/A';

    return (
        <div className="user-profile">
            {/* Header */}
            <header className="user-profile__header">
                <button className="user-profile__back" onClick={onBack}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Volver al Chat
                </button>
                <h1 className="user-profile__header-title">Mi Perfil</h1>
                <div style={{ width: 140 }} />
            </header>

            {/* Profile Card */}
            <div className="user-profile__content">
                <div className="user-profile__card">
                    <div className="user-profile__avatar-section">
                        <div className="user-profile__avatar">
                            {userInitial}
                        </div>
                        <div className="user-profile__identity">
                            {isEditing ? (
                                <div className="user-profile__edit-name">
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="user-profile__name-input"
                                        autoFocus
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                                    />
                                    <div className="user-profile__edit-actions">
                                        <button className="user-profile__save-btn" onClick={handleSaveName}>
                                            Guardar
                                        </button>
                                        <button className="user-profile__cancel-btn" onClick={() => { setIsEditing(false); setEditName(currentUser?.name || ''); }}>
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="user-profile__name-row">
                                    <h2 className="user-profile__name">{currentUser?.name || 'Sin nombre'}</h2>
                                    <button className="user-profile__edit-btn" onClick={() => setIsEditing(true)} title="Editar nombre">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                            <span className="user-profile__email">{currentUser?.email}</span>
                            {saveStatus === 'saved' && <span className="user-profile__toast user-profile__toast--success">✓ Guardado</span>}
                            {saveStatus === 'error' && <span className="user-profile__toast user-profile__toast--error">✗ Error al guardar</span>}
                        </div>
                    </div>

                    <div className="user-profile__badge-row">
                        <span className="user-profile__badge user-profile__badge--role">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            {currentUser?.role === 'admin' ? 'Administrador' : 'Cliente'}
                        </span>
                        <span className="user-profile__badge user-profile__badge--status">
                            <span className="user-profile__status-dot" />
                            Cuenta Activa
                        </span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="user-profile__tabs">
                    <button
                        className={`user-profile__tab ${activeTab === 'info' ? 'user-profile__tab--active' : ''}`}
                        onClick={() => setActiveTab('info')}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        Información
                    </button>
                    <button
                        className={`user-profile__tab ${activeTab === 'activity' ? 'user-profile__tab--active' : ''}`}
                        onClick={() => setActiveTab('activity')}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                        Actividad
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'info' && (
                    <div className="user-profile__info-grid">
                        <div className="user-profile__info-item">
                            <span className="user-profile__info-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </span>
                            <div>
                                <span className="user-profile__info-label">Miembro desde</span>
                                <span className="user-profile__info-value">{memberSince}</span>
                            </div>
                        </div>
                        <div className="user-profile__info-item">
                            <span className="user-profile__info-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </span>
                            <div>
                                <span className="user-profile__info-label">Correo electrónico</span>
                                <span className="user-profile__info-value">{currentUser?.email}</span>
                            </div>
                        </div>
                        <div className="user-profile__info-item">
                            <span className="user-profile__info-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                            </span>
                            <div>
                                <span className="user-profile__info-label">Consultas realizadas</span>
                                <span className="user-profile__info-value">{stats.totalConversations}</span>
                            </div>
                        </div>
                        <div className="user-profile__info-item">
                            <span className="user-profile__info-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="17" y1="10" x2="3" y2="10" />
                                    <line x1="21" y1="6" x2="3" y2="6" />
                                    <line x1="21" y1="14" x2="3" y2="14" />
                                    <line x1="17" y1="18" x2="3" y2="18" />
                                </svg>
                            </span>
                            <div>
                                <span className="user-profile__info-label">Mensajes totales</span>
                                <span className="user-profile__info-value">{stats.totalMessages}</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="user-profile__activity">
                        <h3 className="user-profile__activity-title">Consultas Recientes</h3>
                        {conversations.length === 0 ? (
                            <div className="user-profile__empty">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                                <p>No tienes consultas recientes</p>
                            </div>
                        ) : (
                            <div className="user-profile__conversation-list">
                                {conversations.map((conv) => (
                                    <div key={conv.id} className="user-profile__conversation-item">
                                        <div className="user-profile__conversation-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                            </svg>
                                        </div>
                                        <div className="user-profile__conversation-info">
                                            <span className="user-profile__conversation-title">{conv.title}</span>
                                            <span className="user-profile__conversation-date">
                                                {new Date(conv.updated_at).toLocaleDateString('es-CO', {
                                                    year: 'numeric', month: 'short', day: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <span className={`user-profile__conversation-status user-profile__conversation-status--${conv.status || 'active'}`}>
                                            {conv.status === 'risk_detected' ? 'Riesgo' : conv.status === 'archived' ? 'Archivada' : 'Activa'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
