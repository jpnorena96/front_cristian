import { useRef, useEffect } from 'react';
import './ChatWindow.css';
import MessageBubble, { TypingIndicator } from './MessageBubble';
import MessageInput from './MessageInput';
import StatusCapsule from './StatusCapsule';
import WelcomeScreen from './WelcomeScreen';

export default function ChatWindow({ messages, isLoading, aiStatus, onSendMessage, onToggleSidebar }) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const isEmpty = messages.length === 0;

    return (
        <div className="chat-window">
            {/* Header */}
            <header className="chat-window__header">
                <button className="chat-window__menu" onClick={onToggleSidebar} aria-label="Abrir menú">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>

                <div className="chat-window__header-center">
                    <h1 className="chat-window__header-title">Asistente Legal</h1>
                    <StatusCapsule status={aiStatus} visible={isLoading} />
                </div>

                <div className="chat-window__header-right">
                    <div className="chat-window__status-dot" />
                    <span className="chat-window__status-label">En línea</span>
                </div>
            </header>

            {/* Messages Area */}
            <div className="chat-window__messages">
                {isEmpty ? (
                    <WelcomeScreen onQuickAction={onSendMessage} />
                ) : (
                    <div className="chat-window__messages-list">
                        {messages.map((msg) => (
                            <MessageBubble key={msg.id} message={msg} onAction={onSendMessage} />
                        ))}
                        {isLoading && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input */}
            <MessageInput onSend={onSendMessage} disabled={isLoading} />
        </div>
    );
}
