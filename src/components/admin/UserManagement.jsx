import { useState, useEffect } from 'react';
import { AdminService } from '../../services/AdminService';
import './UserManagement.css';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approvingIds, setApprovingIds] = useState(new Set());
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'client', isAdmin: false, isApproved: true });

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        if (showModal) {
            if (currentUser) {
                setFormData({
                    name: currentUser.name || '',
                    email: currentUser.email || '',
                    password: '',
                    role: currentUser.role || 'client',
                    isAdmin: currentUser.isAdmin || false,
                    isApproved: currentUser.isApproved || false
                });
            } else {
                setFormData({ name: '', email: '', password: '', role: 'client', isAdmin: false, isApproved: true });
            }
        }
    }, [showModal, currentUser]);

    const loadUsers = async () => {
        try {
            const data = await AdminService.getUsers();
            if (data && data.users) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setShowModal(true);
    };

    const handleCreate = () => {
        setCurrentUser(null);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
        try {
            await AdminService.deleteUser(id);
            loadUsers();
        } catch (err) {
            console.error("Error deleting", err);
        }
    };

    const handleApprove = async (id) => {
        setApprovingIds(prev => new Set(prev).add(id));
        try {
            await AdminService.updateUser(id, { isApproved: true });
            // Simulate a small delay for better UX if needed, or just reload
            await loadUsers();
        } catch (err) {
            console.error(err);
            alert("Error al aprobar usuario");
        } finally {
            setApprovingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentUser) {
                await AdminService.updateUser(currentUser.id, formData);
            } else {
                await AdminService.createUser(formData);
            }
            setShowModal(false);
            loadUsers();
        } catch (err) {
            console.error(err);
            alert("Error al guardar usuario");
        }
    };

    if (loading) return <div className="loading-state">Cargando usuarios...</div>;

    return (
        <div className="user-management-container">
            <div className="user-management-header">
                <h1 className="page-title">Gestión de Usuarios</h1>
                <button onClick={handleCreate} className="btn-primary">
                    <span style={{ fontSize: '1.2rem' }}>+</span> Nuevo Usuario
                </button>
            </div>

            <div className="users-table-card">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Conversaciones</th>
                            <th>Registro</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td data-label="Usuario">
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <span style={{ fontWeight: 500 }}>{user.name || 'Sin Nombre'}</span>
                                    </div>
                                </td>
                                <td data-label="Email">{user.email}</td>
                                <td data-label="Rol">
                                    <span className={`role-badge ${user.isAdmin ? 'role-admin' : 'role-client'}`}>
                                        {user.isAdmin ? 'Admin' : 'Cliente'}
                                    </span>
                                </td>
                                <td data-label="Estado">
                                    <span className={`status-badge ${user.isApproved ? 'status-approved' : 'status-pending'}`}>
                                        <span className="status-dot"></span>
                                        {user.isApproved ? 'Aprobado' : 'Pendiente'}
                                    </span>
                                </td>
                                <td data-label="Conversaciones">{user.conversationCount}</td>
                                <td data-label="Registro">{new Date(user.joinedAt).toLocaleDateString()}</td>
                                <td data-label="Acciones">
                                    <div className="action-buttons">
                                        {!user.isApproved && (
                                            <button
                                                onClick={() => handleApprove(user.id)}
                                                className="btn-approve"
                                                disabled={approvingIds.has(user.id)}
                                            >
                                                {approvingIds.has(user.id) ? (
                                                    <div className="spinner"></div>
                                                ) : (
                                                    '✓ Aprobar'
                                                )}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="btn-icon"
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="btn-icon btn-delete"
                                            title="Eliminar"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal - keeping improved structure */}
            {showModal && (
                <div className="admin-modal-overlay modal-overlay">
                    <div className="admin-modal-content modal-content">
                        <h2 className="admin-modal-title">{currentUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                        <p className="admin-modal-subtitle">Proporciona la siguiente información para {currentUser ? 'actualizar' : 'crear'} el usuario.</p>

                        <form onSubmit={handleSubmit}>
                            <div className="admin-form-group">
                                <label>Nombre Completo</label>
                                <input
                                    className="admin-form-input"
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ej: Juan Pérez"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Correo Electrónico</label>
                                <input
                                    className="admin-form-input"
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    placeholder="usuario@ejemplo.com"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Contraseña {currentUser && <span style={{ fontWeight: 'normal', fontSize: '0.8em', color: '#666' }}>(Opcional)</span>}</label>
                                <input
                                    className="admin-form-input"
                                    type="password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    required={!currentUser}
                                    placeholder={currentUser ? "********" : "Contraseña segura"}
                                    autoComplete="new-password"
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="admin-form-group">
                                    <label className="admin-checkbox-label">
                                        <input
                                            className="admin-checkbox-input"
                                            type="checkbox"
                                            checked={formData.isAdmin}
                                            onChange={e => setFormData({ ...formData, isAdmin: e.target.checked })}
                                        />
                                        Es Administrador
                                    </label>
                                </div>
                                <div className="admin-form-group">
                                    <label className="admin-checkbox-label">
                                        <input
                                            className="admin-checkbox-input"
                                            type="checkbox"
                                            checked={formData.isApproved}
                                            onChange={e => setFormData({ ...formData, isApproved: e.target.checked })}
                                        />
                                        Cuenta Aprobada
                                    </label>
                                </div>
                            </div>

                            <div className="admin-modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn-primary">Guardar Cambios</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
