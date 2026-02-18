import { useState, useEffect } from 'react';
import { AdminService } from '../../services/AdminService';

export default function KnowledgeBaseManager() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDocs();
    }, []);

    const loadDocs = async () => {
        try {
            const data = await AdminService.getKnowledgeBase();
            if (data && data.documents) {
                setDocuments(data.documents);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setError("Solo se permiten archivos PDF por ahora.");
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const res = await AdminService.uploadKnowledge(file);
            if (res.error) {
                setError(res.error);
            } else {
                // Refresh list
                loadDocs();
            }
        } catch (err) {
            setError("Error al subir el archivo.");
        } finally {
            setUploading(false);
            e.target.value = null; // Reset input
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este documento?")) return;

        try {
            await AdminService.deleteKnowledge(id);
            setDocuments(prev => prev.filter(d => d.id !== id));
        } catch (err) {
            console.error("Error deleting", err);
        }
    };

    if (loading) return <div>Cargando documentos...</div>;

    return (
        <div className="knowledge-base-manager">
            <h1 className="admin-title">Base de Conocimiento (Contratos Legales)</h1>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                Sube contratos modelo o leyes (PDF) para que la IA los use como referencia al generar respuestas y documentos.
            </p>

            <div className="admin-card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Subir Nuevo Documento</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    {uploading && <span style={{ color: '#1a73e8' }}>Subiendo y procesando...</span>}
                </div>
                {error && <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>}
            </div>

            <div className="admin-card">
                <h3 style={{ marginBottom: '1rem' }}>Documentos Activos</h3>
                {documents.length === 0 ? (
                    <p style={{ fontStyle: 'italic', color: '#888' }}>No hay documentos subidos.</p>
                ) : (
                    <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                                <th style={{ padding: '12px' }}>Título</th>
                                <th style={{ padding: '12px' }}>Tipo</th>
                                <th style={{ padding: '12px' }}>Fecha Subida</th>
                                <th style={{ padding: '12px' }}>Vista Previa</th>
                                <th style={{ padding: '12px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map(doc => (
                                <tr key={doc.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px', fontWeight: '500' }}>{doc.title}</td>
                                    <td style={{ padding: '12px' }}>{doc.fileType}</td>
                                    <td style={{ padding: '12px' }}>{new Date(doc.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '12px', fontSize: '0.85rem', color: '#666', maxWidth: '200px' }}>
                                        {doc.contentPreview}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <button
                                            onClick={() => handleDelete(doc.id)}
                                            style={{
                                                border: 'none', background: 'none', color: '#d32f2f', cursor: 'pointer', fontWeight: 'bold'
                                            }}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
