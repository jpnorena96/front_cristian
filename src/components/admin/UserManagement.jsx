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
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '400px' }}>
                        <h2 style={{ marginTop: 0 }}>{currentUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label>Nombre Completo</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                                />
                            </div>
                            <div>
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                                    required
                                />
                            </div>
                            <div>
                                <label>Contraseña {currentUser && '(Dejar vacío para no cambiar)'}</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                                    required={!currentUser}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.isAdmin}
                                        onChange={e => setFormData({ ...formData, isAdmin: e.target.checked })}
                                    />
                                    Es Administrador
                                </label>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 16px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>Cancelar</button>
                                <button type="submit" style={{ padding: '8px 16px', border: 'none', background: '#1a73e8', color: 'white', cursor: 'pointer' }}>Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
