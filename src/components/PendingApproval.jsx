import React from 'react';
import './PendingApproval.css';

export default function PendingApproval({ onBack }) {
    return (
        <div className="pending-container">
            <div className="pending-card">
                <div className="pending-icon-wrapper">
                    <span className="pending-icon">⏳</span>
                </div>
                <h1 className="pending-title">Cuenta en Revisión</h1>
                <p className="pending-message">
                    Tu registro ha sido completado exitosamente. <br />
                    Un administrador debe aprobar tu cuenta antes de que puedas acceder a la plataforma.
                </p>
                <div className="pending-actions">
                    <button onClick={onBack} className="btn-back-home">
                        Volver al Inicio
                    </button>
                    {/* Optional: Add a contact link if relevant */}
                    <a href="#" className="support-link" onClick={(e) => e.preventDefault()}>
                        ¿Necesitas ayuda? Contacta a soporte
                    </a>
                </div>
            </div>
        </div>
    );
}
