import { useState, useEffect } from 'react';
import { AdminService } from '../../services/AdminService';

export default function ConversationInspector() {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadConvs();
    }, []);

    const loadConvs = async () => {
        try {
            const data = await AdminService.getRecentConversations();
            if (data && data.conversations) {
                setConversations(data.conversations);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Cargando conversaciones...</div>;

    return (
        <div className="conversation-inspector">
            <h1 className="admin-title">Auditoría de Conversaciones</h1>
            <div className="admin-card">
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>ID</th>
                            <th style={{ padding: '12px' }}>Título</th>
                            <th style={{ padding: '12px' }}>Usuario</th>
                            <th style={{ padding: '12px' }}>Estado</th>
                            <th style={{ padding: '12px' }}>Última Actividad</th>
                            <th style={{ padding: '12px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {conversations.map(c => (
                            <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>{c.id}</td>
                                <td style={{ padding: '12px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</td>
                                <td style={{ padding: '12px' }}>{c.userEmail}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{
                                        background: c.status === 'risk_detected' ? '#ffebee' : '#e8f5e9',
                                        color: c.status === 'risk_detected' ? '#c62828' : '#2e7d32',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.85rem'
                                    }}>
                                        {c.status || 'Active'}
                                    </span>
                                </td>
                                <td style={{ padding: '12px' }}>{new Date(c.updatedAt).toLocaleString()}</td>
                                <td style={{ padding: '12px' }}>
                                    <button style={{ border: '1px solid #ddd', background: 'white', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                                        Ver Chat
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
