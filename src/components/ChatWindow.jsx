import { useRef, useEffect, useState } from 'react';
import './ChatWindow.css';
import MessageBubble, { TypingIndicator } from './MessageBubble';
import MessageInput from './MessageInput';
import StatusCapsule from './StatusCapsule';
import WelcomeScreen from './WelcomeScreen';

export default function ChatWindow({ messages, isLoading, aiStatus, onSendMessage, onToggleSidebar, currentUser, onLogin, onLogout, onProfile }) {
    const messagesEndRef = useRef(null);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!showUserMenu) return;
        const handleClick = () => setShowUserMenu(false);
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [showUserMenu]);

    const isEmpty = messages.length === 0;

    return (
        <div className="chat-window">
            {/* Header */}
            <header className="chat-window__header">
                <button className="chat-window__menu" onClick={onToggleSidebar} aria-label="Abrir menú">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>

                <div className="chat-window__header-center">
                    <h1 className="chat-window__header-title">Asistente Legal</h1>
                    <StatusCapsule status={aiStatus} visible={isLoading} />
                </div>

                <div className="chat-window__header-right">
                    <div className="chat-window__status-dot" />
                    <span className="chat-window__status-label">En línea</span>

                    {/* Session Button */}
                    {currentUser ? (
                        <div className="chat-window__user-menu-wrapper">
                            <button
                                className="chat-window__user-btn"
                                onClick={(e) => { e.stopPropagation(); setShowUserMenu(prev => !prev); }}
                                aria-label="Menú de usuario"
                                id="user-menu-button"
                            >
                                <span className="chat-window__user-avatar">
                                    {(currentUser.name || currentUser.email || '?').charAt(0).toUpperCase()}
                                </span>
                                <span className="chat-window__user-name">
                                    {currentUser.name || currentUser.email}
                                </span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>
                            {showUserMenu && (
                                <div className="chat-window__user-dropdown">
                                    <div className="chat-window__dropdown-header">
                                        <span className="chat-window__dropdown-name">{currentUser.name || 'Usuario'}</span>
                                        <span className="chat-window__dropdown-email">{currentUser.email}</span>
                                    </div>
                                    <div className="chat-window__dropdown-divider" />
                                    <button className="chat-window__dropdown-item" onClick={onProfile}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        Mi Perfil
                                    </button>
                                    <button className="chat-window__dropdown-item chat-window__dropdown-item--logout" onClick={onLogout}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                            <polyline points="16 17 21 12 16 7" />
                                            <line x1="21" y1="12" x2="9" y2="12" />
                                        </svg>
                                        Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className="chat-window__login-btn" onClick={onLogin} id="login-button">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                            Iniciar Sesión
                        </button>
                    )}
                </div>
            </header>

            {/* Messages Area */}
            <div className="chat-window__messages">
                {isEmpty ? (
                    <WelcomeScreen onQuickAction={onSendMessage} />
                ) : (
                    <div className="chat-window__messages-list">
                        {messages.map((msg) => (
                            <MessageBubble key={msg.id} message={msg} onAction={onSendMessage} />
                        ))}
                        {isLoading && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input */}
            <MessageInput onSend={onSendMessage} disabled={isLoading} />
        </div>
    );
}
