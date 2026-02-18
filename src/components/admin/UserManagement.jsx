import { useState, useEffect } from 'react';
import { AdminService } from '../../services/AdminService';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

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

    return (
        <div className="user-management">
            <h1 className="admin-title">Gestión de Usuarios</h1>

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
                                <td style={{ padding: '12px' }}>
                                    <button style={{
                                        border: 'none', background: 'none', color: '#1a73e8', cursor: 'pointer'
                                    }}>Editar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
