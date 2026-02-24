import { useState, useRef, useEffect } from 'react';
import './MessageInput.css';

const FILE_ICONS = {
    pdf: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
    ),
    docx: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
    ),
    txt: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
        </svg>
    ),
};

function getFileExt(name) {
    return name.split('.').pop().toLowerCase();
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function MessageInput({ onSend, disabled }) {
    const [value, setValue] = useState('');
    const [attachedFile, setAttachedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!disabled && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [disabled]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = value.trim();
        if ((!trimmed && !attachedFile) || disabled) return;
        onSend(trimmed || 'Analiza este documento', attachedFile);
        setValue('');
        setAttachedFile(null);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleInput = (e) => {
        setValue(e.target.value);
        const el = e.target;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 150) + 'px';
    };

    const handleFileSelect = (file) => {
        if (!file) return;
        const ext = getFileExt(file.name);
        const allowed = ['pdf', 'docx', 'txt'];
        if (!allowed.includes(ext)) {
            alert('Tipo de archivo no soportado. Use PDF, DOCX o TXT.');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            alert('El archivo es demasiado grande. Máximo 10MB.');
            return;
        }
        setAttachedFile(file);
    };

    const handleFileChange = (e) => {
        handleFileSelect(e.target.files[0]);
        e.target.value = ''; // Reset so same file can be re-selected
    };

    // Drag and drop
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const ext = attachedFile ? getFileExt(attachedFile.name) : '';
    const fileIcon = FILE_ICONS[ext] || FILE_ICONS.txt;

    return (
        <form
            className={`message-input ${isDragging ? 'message-input--dragging' : ''}`}
            onSubmit={handleSubmit}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* File Preview */}
            {attachedFile && (
                <div className="message-input__file-preview">
                    <div className={`message-input__file-chip message-input__file-chip--${ext}`}>
                        <span className="message-input__file-icon">{fileIcon}</span>
                        <div className="message-input__file-info">
                            <span className="message-input__file-name">{attachedFile.name}</span>
                            <span className="message-input__file-size">{formatFileSize(attachedFile.size)}</span>
                        </div>
                        <button
                            type="button"
                            className="message-input__file-remove"
                            onClick={() => setAttachedFile(null)}
                            aria-label="Remover archivo"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Drag overlay */}
            {isDragging && (
                <div className="message-input__drag-overlay">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span>Soltar archivo aquí</span>
                </div>
            )}

            <div className="message-input__container">
                {/* Attach Button */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="file-upload-input"
                />
                <button
                    type="button"
                    className={`message-input__attach ${attachedFile ? 'message-input__attach--active' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                    aria-label="Adjuntar documento"
                    title="Adjuntar PDF, DOCX o TXT"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                </button>

                <textarea
                    ref={textareaRef}
                    className="message-input__textarea"
                    placeholder={disabled ? 'Procesando respuesta...' : attachedFile ? 'Escribe tu consulta sobre el documento...' : 'Escriba su consulta legal...'}
                    value={value}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    rows={1}
                    id="chat-input"
                />
                <button
                    type="submit"
                    className={`message-input__send ${(value.trim() || attachedFile) && !disabled ? 'message-input__send--active' : ''}`}
                    disabled={(!value.trim() && !attachedFile) || disabled}
                    id="send-button"
                    aria-label="Enviar mensaje"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                </button>
            </div>
            <p className="message-input__disclaimer">
                Asistente de Iurista Tech · Las respuestas no constituyen asesoría legal vinculante.
            </p>
        </form>
    );
}

