import './WelcomeScreen.css';
import { SPECIALTY_AREAS } from '../utils/systemPrompt';
import { ScalesIcon, BuildingIcon, GlobeIcon, SparkleIcon } from './AnimatedIcons';
import logoImg from '../assets/logo.png';

const ICON_MAP = {
    scales: ScalesIcon,
    building: BuildingIcon,
    globe: GlobeIcon,
};

export default function WelcomeScreen({ onQuickAction }) {
    return (
        <div className="welcome">
            <div className="welcome__hero">
                <div className="welcome__logo">
                    <img src={logoImg} alt="IuristaTech" className="welcome__logo-img" />
                </div>
                <h1 className="welcome__title">Iurista Tech</h1>
                <p className="welcome__subtitle">Abogados · Asistente Legal IA</p>
                <p className="welcome__desc">
                    Triaje legal preventivo para Pymes colombianas.
                    <br />
                    Seleccione un área de consulta o escriba su pregunta.
                </p>
            </div>

            <div className="welcome__cards">
                {SPECIALTY_AREAS.map((area) => {
                    const IconComponent = ICON_MAP[area.iconType];
                    return (
                        <button
                            key={area.id}
                            className="welcome__card"
                            onClick={() => onQuickAction(area.quickPrompt)}
                            id={`quick-action-${area.id}`}
                            style={{ '--card-accent': area.color }}
                        >
                            <span className="welcome__card-icon">
                                {IconComponent && <IconComponent size={24} />}
                            </span>
                            <div className="welcome__card-body">
                                <h3 className="welcome__card-title">{area.title}</h3>
                                {area.subtitle && (
                                    <span className="welcome__card-subtitle">{area.subtitle}</span>
                                )}
                                <p className="welcome__card-desc">{area.description}</p>
                            </div>
                            <svg className="welcome__card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    );
                })}
            </div>

            <p className="welcome__footer">
                Iurista Tech · Colombia
            </p>
        </div>
    );
}
