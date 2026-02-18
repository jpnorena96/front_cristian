import { useState } from 'react';
import { LayoutDashboard, Users, MessageSquare, LogOut, Home } from 'lucide-react';
import './AdminLayout.css';

export default function AdminLayout({ children, onLogout, onNavigate, activeTab }) {
    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar__header">
                    <h2>Admin Panel</h2>
                    <span className="admin-badge">PRO</span>
                </div>

                <nav className="admin-nav">
                    <button
                        className={`admin-nav__item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => onNavigate('overview')}
                    >
                        <LayoutDashboard size={20} />
                        <span>Resumen</span>
                    </button>

                    <button
                        className={`admin-nav__item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => onNavigate('users')}
                    >
                        <Users size={20} />
                        <span>Usuarios</span>
                    </button>

                    <button
                        className={`admin-nav__item ${activeTab === 'conversations' ? 'active' : ''}`}
                        onClick={() => onNavigate('conversations')}
                    >
                        <MessageSquare size={20} />
                        <span>Conversaciones</span>
                    </button>

                    <button
                        className={`admin-nav__item ${activeTab === 'knowledge' ? 'active' : ''}`}
                        onClick={() => onNavigate('knowledge')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        <span>Base Conocimiento</span>
                    </button>
                </nav>

                <div className="admin-sidebar__footer">
                    <button className="admin-nav__item" onClick={() => onNavigate('landing')}>
                        <Home size={20} />
                        <span>Volver a Inicio</span>
                    </button>
                    <button className="admin-nav__item logout" onClick={onLogout}>
                        <LogOut size={20} />
                        <span>Salir</span>
                    </button>
                </div>
            </aside>

            <main className="admin-content">
                {children}
            </main>
        </div>
    );
}
