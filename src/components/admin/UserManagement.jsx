import { useState, useEffect } from 'react';
import { AdminService } from '../../services/AdminService';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); // If null, creating new
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'client', isAdmin: false });

    useEffect(() => {
        loadUsers();
    }, []);

    // Reset form when modal opens
    useEffect(() => {
        if (showModal) {
            if (currentUser) {
                setFormData({
                    name: currentUser.name || '',
                    email: currentUser.email || '',
                    password: '', // Leave blank to keep unchanged
                    role: currentUser.role || 'client',
                    isAdmin: currentUser.isAdmin || false
                });
            } else {
                setFormData({ name: '', email: '', password: '', role: 'client', isAdmin: false });
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

    if (loading) return <div>Cargando usuarios...</div>;

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

    return (
        <div className="user-management">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 className="admin-title" style={{ margin: 0 }}>Gestión de Usuarios</h1>
                <button
                    onClick={handleCreate}
                    style={{ background: '#1a73e8', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    + Nuevo Usuario
                </button>
            </div>

            <div className="admin-card">
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>ID</th>
                            <th style={{ padding: '12px' }}>Nombre</th>
                            <th style={{ padding: '12px' }}>Email</th>
                            <th style={{ padding: '12px' }}>Rol</th>
                            <th style={{ padding: '12px' }}>Conversaciones</th>
                            <th style={{ padding: '12px' }}>Fecha Registro</th>
                            <th style={{ padding: '12px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>#{user.id}</td>
                                <td style={{ padding: '12px', fontWeight: '500' }}>{user.name || '-'}</td>
                                <td style={{ padding: '12px', color: '#666' }}>{user.email}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{
                                        background: user.isAdmin ? '#e3f2fd' : '#f5f5f5',
                                        color: user.isAdmin ? '#1565c0' : '#616161',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.85rem'
                                    }}>
                                        {user.isAdmin ? 'Administrador' : 'Usuario'}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>{user.conversationCount}</td>
                                <td style={{ padding: '12px', fontSize: '0.9rem' }}>
                                    {new Date(user.joinedAt).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '12px', display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => handleEdit(user)}
                                        style={{ border: 'none', background: 'none', color: '#1a73e8', cursor: 'pointer', fontWeight: 'bold' }}>
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        style={{ border: 'none', background: 'none', color: '#d32f2f', cursor: 'pointer', fontWeight: 'bold' }}>
                                        Borrar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-content">
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
                                    placeholder={currentUser ? "********" : "Ingresa una contraseña segura"}
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-checkbox-label">
                                    <input
                                        className="admin-checkbox-input"
                                        type="checkbox"
                                        checked={formData.isAdmin}
                                        onChange={e => setFormData({ ...formData, isAdmin: e.target.checked })}
                                    />
                                    Otorgar permisos de Administrador
                                </label>
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
