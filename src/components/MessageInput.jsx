import { useState, useRef, useEffect } from 'react';
import './MessageInput.css';

export default function MessageInput({ onSend, disabled }) {
    const [value, setValue] = useState('');
    const textareaRef = useRef(null);

    useEffect(() => {
        if (!disabled && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [disabled]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = value.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setValue('');
        // Reset textarea height
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
        // Auto-resize
        const el = e.target;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 150) + 'px';
    };

    return (
        <form className="message-input" onSubmit={handleSubmit}>
            <div className="message-input__container">
                <textarea
                    ref={textareaRef}
                    className="message-input__textarea"
                    placeholder={disabled ? 'Procesando respuesta...' : 'Escriba su consulta legal...'}
                    value={value}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    rows={1}
                    id="chat-input"
                />
                <button
                    type="submit"
                    className={`message-input__send ${value.trim() && !disabled ? 'message-input__send--active' : ''}`}
                    disabled={!value.trim() || disabled}
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
