import './MessageBubble.css';
import { ScalesIcon } from './AnimatedIcons';
import { jsPDF } from 'jspdf';

function formatTimestamp(date) {
    return new Intl.DateTimeFormat('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).format(date);
}

/**
 * Simple markdown-like renderer:
 * - **bold** for laws
 * - Tables (| col | col |)
 * - Line breaks
 */
function renderMarkdown(text) {
    const lines = text.split('\n');
    const elements = [];
    let tableRows = [];
    let inTable = false;
    let tableIndex = 0;

    const processInline = (line) => {
        // Bold
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    const flushTable = () => {
        if (tableRows.length === 0) return;

        const headerCells = tableRows[0];
        const bodyRows = tableRows.slice(2); // Skip separator row

        elements.push(
            <div className="message-table-wrapper" key={`table-${tableIndex++}`}>
                <table className="message-table">
                    <thead>
                        <tr>
                            {headerCells.map((cell, i) => (
                                <th key={i}>{processInline(cell.trim())}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {bodyRows.map((row, ri) => (
                            <tr key={ri}>
                                {row.map((cell, ci) => (
                                    <td key={ci}>{processInline(cell.trim())}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );

        tableRows = [];
        inTable = false;
    };

    lines.forEach((line, idx) => {
        const trimmed = line.trim();

        // Table row detection
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            const cells = trimmed.slice(1, -1).split('|');

            // Check if separator row (|---|---|)
            const isSeparator = cells.every(c => /^[\s-:]+$/.test(c));

            if (!inTable && !isSeparator) {
                inTable = true;
            }

            tableRows.push(cells);
            return;
        }

        // If we were in a table, flush it
        if (inTable) {
            flushTable();
        }

        // Empty line
        if (trimmed === '') {
            elements.push(<br key={`br-${idx}`} />);
            return;
        }

        // Regular paragraph
        elements.push(
            <p key={`p-${idx}`} className="message-paragraph">
                {processInline(trimmed)}
            </p>
        );
    });

    // Flush remaining table
    if (inTable) {
        flushTable();
    }

    return elements;
}

export default function MessageBubble({ message, onAction }) {
    const { role, content, timestamp } = message;
    const isUser = role === 'user';

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Basic configuration for document drafting
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);

        // Split text to fit page width
        const splitText = doc.splitTextToSize(content, 180); // 180mm width (A4 is ~210mm)

        let y = 20; // Start Y position

        // Title if it looks like a document
        if (content.includes('CONTRATO') || content.includes('DERECHO DE PETICIÓN')) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text("Documento Legal Generado - IuristaTech", 105, y, { align: "center" });
            y += 15;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
        }

        // Add content pages
        for (let i = 0; i < splitText.length; i++) {
            if (y > 280) { // Page break
                doc.addPage();
                y = 20;
            }
            doc.text(splitText[i], 15, y);
            y += 7; // Line height
        }

        // Footer branding
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text("Generado por IuristaTech AI", 105, 290, { align: "center" });
        }

        doc.save("documento-legal.pdf");
    };

    return (
        <div
            className={`message-bubble ${isUser ? 'message-bubble--user' : 'message-bubble--assistant'}`}
            style={{ animationDelay: '0ms' }}
        >
            {!isUser && (
                <div className="message-bubble__avatar">
                    <ScalesIcon size={18} />
                </div>
            )}
            <div className="message-bubble__content">
                {!isUser && (
                    <span className="message-bubble__sender">Asistente Legal</span>
                )}
                <div className="message-bubble__text">
                    {isUser ? content : renderMarkdown(content)}
                </div>

                {!isUser && (
                    <div className="message-actions">
                        <button
                            className="message-copy-btn"
                            onClick={() => {
                                navigator.clipboard.writeText(content);
                                // Optional: Tooltip or temporary state logic could go here
                            }}
                            title="Copiar texto"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            Copiar
                        </button>

                        <button
                            className="message-copy-btn"
                            onClick={handleDownloadPDF}
                            title="Descargar PDF"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            PDF
                        </button>
                    </div>
                )}

                {/* Suggested Actions */}
                {!isUser && message.suggestedActions && message.suggestedActions.length > 0 && (
                    <div className="message-suggestions">
                        <p className="message-suggestions__label">Sugerencias:</p>
                        <div className="message-suggestions__list">
                            {message.suggestedActions.map((action, idx) => (
                                <button
                                    key={idx}
                                    className="suggestion-btn"
                                    onClick={() => onAction && onAction(action)}
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    </div>
                )}



                <span className="message-bubble__time">
                    {formatTimestamp(timestamp)}
                </span>
            </div>
        </div >
    );
}

export function TypingIndicator() {
    return (
        <div className="message-bubble message-bubble--assistant message-bubble--typing">
            <div className="message-bubble__avatar">
                <ScalesIcon size={18} />
            </div>
            <div className="message-bubble__content">
                <div className="typing-dots">
                    <span className="typing-dot" style={{ animationDelay: '0ms' }} />
                    <span className="typing-dot" style={{ animationDelay: '150ms' }} />
                    <span className="typing-dot" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    );
}
