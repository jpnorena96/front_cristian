import { useState, useEffect } from 'react';
import { AdminService } from '../../services/AdminService';
import { FileText, UploadCloud, Trash2, Calendar } from 'lucide-react';

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
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 className="admin-title">Base de Conocimiento</h1>
                <p style={{ color: '#666', marginBottom: '2rem', maxWidth: '800px' }}>
                    Sube contratos modelo, leyes o jurisprudencia en formato PDF. La Inteligencia Artificial analizará estos documentos y los utilizará como contexto legal para generar respuestas más precisas y alineadas a tu criterio.
                </p>

                {/* Upload Zone */}
                <label className="kb-upload-zone">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        style={{ display: 'none' }}
                    />
                    <div className="kb-upload-icon">
                        {uploading ? (
                            <div className="spinner" style={{ width: 48, height: 48, border: '4px solid #f3f3f3', borderTop: '4px solid #1a73e8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        ) : (
                            <UploadCloud size={48} />
                        )}
                    </div>
                    <div>
                        <div className="kb-upload-text">{uploading ? 'Procesando documento...' : 'Haz clic o arrastra un archivo PDF aquí'}</div>
                        {!uploading && <div className="kb-upload-subtext">Máximo 10MB. Solo formato PDF</div>}
                    </div>
                </label>
                {error && <div style={{ color: '#d32f2f', marginBottom: '1.5rem', padding: '10px', background: '#ffebee', borderRadius: '8px' }}>⚠️ {error}</div>}

                {/* Document Grid */}
                <h3 style={{ marginBottom: '1.5rem', color: '#1a1f36' }}>Biblioteca de Documentos ({documents.length})</h3>

                {documents.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#8898aa', background: 'white', borderRadius: '12px', border: '1px solid #e1e4e8' }}>
                        <FileText size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                        <p>No hay documentos en la base de conocimiento aún.</p>
                    </div>
                ) : (
                    <div className="kb-grid">
                        {documents.map(doc => (
                            <div className="kb-card" key={doc.id}>
                                <div className="kb-card-header">
                                    <div className="kb-icon">
                                        <FileText size={20} />
                                    </div>
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleDelete(doc.id)}
                                        title="Eliminar documento"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="kb-title">{doc.title}</div>
                                <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '3.6em' }}>
                                    {doc.contentPreview}
                                </div>
                                <div className="kb-meta">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Calendar size={14} />
                                        {new Date(doc.createdAt).toLocaleDateString()}
                                    </div>
                                    <span style={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 'bold', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>PDF</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
