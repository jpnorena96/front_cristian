import { useState } from 'react';
import './Sidebar.css';
import { SPECIALTY_AREAS } from '../utils/systemPrompt';
import logoImg from '../assets/logo.png';
import { ScalesIcon, BuildingIcon, GlobeIcon } from './AnimatedIcons';

const ICON_MAP = {
    scales: ScalesIcon,
    building: BuildingIcon,
    globe: GlobeIcon,
};

export default function Sidebar({ conversations, activeId, onNewChat, onSelectChat, isOpen, onToggle, onBackToLanding, currentUser, onNavigateToLanding }) {
    return (
        <>
            {/* Mobile overlay */}
            {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}

            <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
                {/* Header */}
                <div className="sidebar__header">
                    <div className="sidebar__brand">
                        <img src={logoImg} alt="IuristaTech" className="sidebar__brand-logo" />
                        <div>
                            <h2 className="sidebar__brand-name">Iurista Tech</h2>
                            <span className="sidebar__brand-tag">Asistente Legal IA</span>
                        </div>
                    </div>
                    <button className="sidebar__close" onClick={onToggle} aria-label="Cerrar menú">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* New Chat Button */}
                <button className="sidebar__new-chat" onClick={onNewChat} id="new-chat-button">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Nueva Consulta
                </button>

                {/* Specialties */}
                <div className="sidebar__section">
                    <span className="sidebar__section-title">Áreas de Práctica</span>
                    <div className="sidebar__specialties">
                        {SPECIALTY_AREAS.map((area) => {
                            const IconComp = ICON_MAP[area.iconType];
                            return (
                                <div key={area.id} className="sidebar__specialty">
                                    <span className="sidebar__specialty-icon">
                                        {IconComp && <IconComp size={16} />}
                                    </span>
                                    <span className="sidebar__specialty-label">{area.title}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Chat History */}
                <div className="sidebar__section sidebar__section--grow">
                    <span className="sidebar__section-title">Historial</span>
                    <div className="sidebar__chats">
                        {conversations.length === 0 ? (
                            <p className="sidebar__empty">Sin consultas previas</p>
                        ) : (
                            conversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    className={`sidebar__chat-item ${conv.id === activeId ? 'sidebar__chat-item--active' : ''}`}
                                    onClick={() => onSelectChat(conv.id)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                    <span className="sidebar__chat-label">{conv.title}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="sidebar__footer">
                    {currentUser ? (
                        <button className="sidebar__back-btn sidebar__back-btn--logout" onClick={onBackToLanding}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Cerrar Sesión
                        </button>
                    ) : (
                        <button className="sidebar__back-btn sidebar__back-btn--home" onClick={onNavigateToLanding}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                            Volver al Inicio
                        </button>
                    )}
                    <div className="sidebar__footer-info">
                        <span className="sidebar__footer-name">Dr.  Noreña A.</span>
                        <span className="sidebar__footer-role">Abogado Senior · Colombia</span>
                    </div>
                </div>
            </aside>
        </>
    );
}
