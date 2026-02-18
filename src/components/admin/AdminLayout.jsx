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
