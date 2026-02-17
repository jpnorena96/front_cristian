import { useState, useEffect } from 'react';
import './StatusCapsule.css';
import { SearchIcon, DocumentIcon, WarningIcon } from './AnimatedIcons';

const STATUS_CONFIG = {
    analyzing: {
        label: 'Analizando Normativa',
        Icon: SearchIcon,
        className: 'status-analyzing',
    },
    document: {
        label: 'Generando Documento',
        Icon: DocumentIcon,
        className: 'status-document',
    },
    risk: {
        label: 'Validando Riesgos',
        Icon: WarningIcon,
        className: 'status-risk',
    },
};

export default function StatusCapsule({ status, visible }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (visible) {
            setShow(true);
        } else {
            const timer = setTimeout(() => setShow(false), 400);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!show && !visible) return null;

    const config = STATUS_CONFIG[status] || STATUS_CONFIG.analyzing;
    const { Icon } = config;

    return (
        <div className={`status-capsule ${config.className} ${visible ? 'status-capsule--active' : 'status-capsule--exiting'}`}>
            <span className="status-capsule__icon">
                <Icon size={16} />
            </span>
            <span className="status-capsule__label">{config.label}</span>
            <span className="status-capsule__dot" />
        </div>
    );
}
