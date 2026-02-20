import { useState, useEffect } from 'react';
import './LandingPage.css';
import logoImg from '../assets/logo.png';
import yoImg from '../assets/yo.png';
import {
    ScalesIcon,
    BuildingIcon,
    GlobeIcon,
    ShieldIcon,
    SearchIcon,
    DocumentIcon,
    WarningIcon,
    SparkleIcon,
    ChatBubbleIcon,
    UsersIcon,
} from './AnimatedIcons';

export default function LandingPage({ onNavigateToChat, onNavigateToLogin }) {
    const [scrolled, setScrolled] = useState(false);
    const [visibleSections, setVisibleSections] = useState(new Set());

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleSections((prev) => new Set([...prev, entry.target.id]));
                    }
                });
            },
            { threshold: 0.15 }
        );

        document.querySelectorAll('.landing-section').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const isVisible = (id) => visibleSections.has(id);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="landing">
            {/* ═══════════════ NAVBAR ═══════════════ */}
            <nav className={`landing-nav ${scrolled ? 'landing-nav--scrolled' : ''}`}>
                <div className="landing-nav__inner">
                    <div className="landing-nav__brand">
                        <img src={logoImg} alt="IuristaTech Logo" className="landing-nav__logo" />
                    </div>
                    <div className="landing-nav__links">
                        <button onClick={() => scrollTo('inicio')} className="landing-nav__link">Inicio</button>
                        <button onClick={() => scrollTo('sobre-mi')} className="landing-nav__link">Sobre Mí</button>
                        <button onClick={() => scrollTo('servicios')} className="landing-nav__link">Servicios</button>
                        <button onClick={() => scrollTo('contacto')} className="landing-nav__link">Contacto</button>
                    </div>
                    <div className="landing-nav__cta-container">
                        <button onClick={onNavigateToLogin} className="landing-nav__link landing-nav__link--login">Login</button>
                        <button className="landing-nav__cta" onClick={onNavigateToChat}>
                            <SparkleIcon size={16} />
                            Consulta IA
                        </button>
                    </div>
                </div>
            </nav>

            {/* ═══════════════ HERO ═══════════════ */}
            <section id="inicio" className="landing-section landing-hero">
                <div className="landing-hero__bg-grid" />
                <div className="landing-hero__bg-glow landing-hero__bg-glow--1" />
                <div className="landing-hero__bg-glow landing-hero__bg-glow--2" />
                <div className="landing-hero__particles">
                    <span className="particle particle--1" />
                    <span className="particle particle--2" />
                    <span className="particle particle--3" />
                    <span className="particle particle--4" />
                    <span className="particle particle--5" />
                </div>

                <div className="landing-hero__content">
                    {/* Left column — Brand + Solution messaging */}
                    <div className="landing-hero__text">
                        {/* Brand name large */}
                        <div className="landing-hero__brand-block">

                            <span className="landing-hero__brand-name">IuristaTech</span>
                        </div>

                        <h1 className="landing-hero__title">
                            La solución legal
                            <span className="landing-hero__title-accent"> inteligente</span>
                            <br />para su empresa
                        </h1>

                        <p className="landing-hero__subtitle">
                            Combinamos más de 15 años de experiencia en derecho corporativo colombiano
                            con inteligencia artificial para proteger su Pyme de riesgos legales
                            — antes de que se conviertan en problemas.
                        </p>

                        {/* Value proposition pills */}
                        <div className="landing-hero__pills">
                            <div className="landing-hero__pill">
                                <SparkleIcon size={14} />
                                <span>IA Preventiva 24/7</span>
                            </div>
                            <div className="landing-hero__pill">
                                <ShieldIcon size={14} />
                                <span>Especializado en Pymes</span>
                            </div>
                            <div className="landing-hero__pill">
                                <ScalesIcon size={14} />
                                <span>Resultados del 98%</span>
                            </div>
                        </div>

                        <div className="landing-hero__actions">
                            <button className="landing-btn landing-btn--primary" onClick={onNavigateToChat}>
                                Iniciar Consulta Gratuita
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </button>
                            <button className="landing-btn landing-btn--ghost" onClick={() => scrollTo('servicios')}>
                                Ver Servicios
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="landing-hero__stats">
                            <div className="landing-hero__stat">
                                <span className="landing-hero__stat-num">15+</span>
                                <span className="landing-hero__stat-label">Años de experiencia</span>
                            </div>
                            <div className="landing-hero__stat-divider" />
                            <div className="landing-hero__stat">
                                <span className="landing-hero__stat-num">500+</span>
                                <span className="landing-hero__stat-label">Pymes protegidas</span>
                            </div>
                            <div className="landing-hero__stat-divider" />
                            <div className="landing-hero__stat">
                                <span className="landing-hero__stat-num">24/7</span>
                                <span className="landing-hero__stat-label">Asistente IA activo</span>
                            </div>
                        </div>
                    </div>

                    {/* Right column — AI Chat Preview Mockup */}
                    <div className="landing-hero__visual">
                        <div className="landing-hero__mockup">
                            {/* Mockup header bar */}
                            <div className="landing-hero__mockup-bar">
                                <div className="landing-hero__mockup-dots">
                                    <span /><span /><span />
                                </div>
                                <span className="landing-hero__mockup-title">
                                    <SparkleIcon size={12} />
                                    IuristaTech · Asistente IA
                                </span>
                                <div className="landing-hero__mockup-status">
                                    <span className="landing-hero__mockup-status-dot" />
                                    En línea
                                </div>
                            </div>

                            {/* Chat messages */}
                            <div className="landing-hero__mockup-chat">
                                {/* User message */}
                                <div className="landing-hero__mockup-msg landing-hero__mockup-msg--user">
                                    <p>¿Mi contrato laboral cumple con la normativa colombiana actual?</p>
                                </div>

                                {/* AI response */}
                                <div className="landing-hero__mockup-msg landing-hero__mockup-msg--ai">
                                    <div className="landing-hero__mockup-msg-header">
                                        <ScalesIcon size={14} />
                                        <span>Análisis Legal IA</span>
                                    </div>
                                    <p>He identificado <strong>3 puntos de riesgo</strong> en su contrato:</p>
                                    <div className="landing-hero__mockup-risk">
                                        <span className="landing-hero__mockup-risk-tag landing-hero__mockup-risk-tag--high">⚠ Cláusula de terminación</span>
                                        <span className="landing-hero__mockup-risk-tag landing-hero__mockup-risk-tag--med">○ Prestaciones sociales</span>
                                        <span className="landing-hero__mockup-risk-tag landing-hero__mockup-risk-tag--low">✓ Jornada laboral</span>
                                    </div>
                                </div>

                                {/* Typing indicator */}
                                <div className="landing-hero__mockup-typing">
                                    <span /><span /><span />
                                </div>
                            </div>
                        </div>

                        {/* Trust quote */}
                        <div className="landing-hero__trust">
                            <p className="landing-hero__trust-quote">
                                "IuristaTech nos ayudó a prevenir sanciones por valor de $120M COP antes de que ocurrieran."
                            </p>
                            <span className="landing-hero__trust-author">— CEO, Pyme del sector tecnológico</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════ SOBRE MÍ ═══════════════ */}
            <section id="sobre-mi" className={`landing-section landing-about ${isVisible('sobre-mi') ? 'landing-section--visible' : ''}`}>
                <div className="landing-about__inner">
                    <div className="landing-about__photo-col">
                        <div className="landing-about__photo-frame">
                            <img src={yoImg} alt="Iurista Tech Avatar" className="landing-about__photo" />
                        </div>
                        <div className="landing-about__credentials">
                            <div className="landing-about__credential">
                                <ShieldIcon size={16} />
                                <span>Tarjeta Profesional Vigente</span>
                            </div>
                            <div className="landing-about__credential">
                                <ScalesIcon size={16} />
                                <span>Especialista en Derecho Empresarial</span>
                            </div>
                            <div className="landing-about__credential">
                                <UsersIcon size={16} />
                                <span>Miembro del Colegio de Abogados</span>
                            </div>
                        </div>
                    </div>

                    <div className="landing-about__text-col">
                        <span className="landing-section__label">Sobre Mí</span>
                        <h2 className="landing-section__title">Un abogado que entiende<br />su negocio</h2>
                        <p className="landing-about__bio">
                            Soy el asistente legal de Iurista Tech, diseñado con más de 15 años de experiencia jurídica
                            en el ordenamiento jurídico colombiano. Mi enfoque combina la rigurosidad
                            del derecho tradicional con herramientas tecnológicas de última generación.
                        </p>
                        <p className="landing-about__bio">
                            Fundé <strong>IuristaTech</strong> con una visión clara: democratizar el acceso
                            a asesoría legal de calidad para Pymes colombianas. Mediante inteligencia artificial,
                            ofrezco un triaje legal preventivo que identifica riesgos antes de que se conviertan
                            en problemas costosos.
                        </p>
                        <p className="landing-about__bio">
                            Mi práctica se centra en tres pilares fundamentales: derecho laboral y seguridad social,
                            régimen inmobiliario, y derecho migratorio — las áreas donde las Pymes enfrentan
                            los mayores desafíos regulatorios.
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══════════════ SERVICIOS ═══════════════ */}
            <section id="servicios" className={`landing-section landing-services ${isVisible('servicios') ? 'landing-section--visible' : ''}`}>
                {/* Background decorations */}
                <div className="landing-services__bg-orb landing-services__bg-orb--1" />
                <div className="landing-services__bg-orb landing-services__bg-orb--2" />

                <div className="landing-services__inner">
                    <div className="landing-services__header">
                        <span className="landing-section__label">Áreas de Práctica</span>
                        <h2 className="landing-section__title">Especialidades del despacho</h2>
                        <p className="landing-section__subtitle">
                            Asesoría legal especializada en las tres áreas más críticas para la operación de su Pyme en Colombia.
                            Cada área cuenta con protocolos diseñados para prevenir riesgos antes de que se materialicen.
                        </p>
                    </div>

                    <div className="landing-services__grid">
                        {/* Service 1 — Labor */}
                        <div className="landing-service-card landing-service-card--labor" style={{ '--card-delay': '0ms', '--card-accent': 'var(--status-analyzing)', '--card-accent-bg': 'rgba(91, 141, 239, 0.08)' }}>
                            <div className="landing-service-card__accent" />
                            <div className="landing-service-card__glow" />
                            <div className="landing-service-card__header">
                                <div className="landing-service-card__icon">
                                    <ScalesIcon size={26} />
                                    <span className="landing-service-card__icon-ring" />
                                </div>
                                <span className="landing-service-card__number">01</span>
                            </div>
                            <h3 className="landing-service-card__title">Derecho Laboral<br /><span>y Seguridad Social</span></h3>
                            <p className="landing-service-card__desc">
                                Protección integral del recurso humano de su empresa. Desde la contratación hasta la liquidación, cubrimos cada aspecto normativo.
                            </p>
                            <ul className="landing-service-card__list">
                                <li><span className="landing-service-card__check" />Contratos de trabajo a medida</li>
                                <li><span className="landing-service-card__check" />Defensa ante UGPP y DIAN</li>
                                <li><span className="landing-service-card__check" />Liquidación de prestaciones</li>
                                <li><span className="landing-service-card__check" />Reglamentos internos de trabajo</li>
                            </ul>
                            <div className="landing-service-card__stat">
                                <span className="landing-service-card__stat-num">500+</span>
                                <span className="landing-service-card__stat-label">Pymes protegidas laboralmente</span>
                            </div>
                        </div>

                        {/* Service 2 — Real Estate */}
                        <div className="landing-service-card landing-service-card--realestate" style={{ '--card-delay': '150ms', '--card-accent': 'var(--status-document)', '--card-accent-bg': 'rgba(109, 212, 144, 0.08)' }}>
                            <div className="landing-service-card__accent" />
                            <div className="landing-service-card__glow" />
                            <div className="landing-service-card__header">
                                <div className="landing-service-card__icon">
                                    <BuildingIcon size={26} />
                                    <span className="landing-service-card__icon-ring" />
                                </div>
                                <span className="landing-service-card__number">02</span>
                            </div>
                            <h3 className="landing-service-card__title">Régimen<br /><span>Inmobiliario</span></h3>
                            <p className="landing-service-card__desc">
                                Seguridad jurídica en cada transacción inmobiliaria. Debida diligencia exhaustiva y contratos blindados para su patrimonio.
                            </p>
                            <ul className="landing-service-card__list">
                                <li><span className="landing-service-card__check" />Contratos de arrendamiento comercial</li>
                                <li><span className="landing-service-card__check" />Debida diligencia de títulos</li>
                                <li><span className="landing-service-card__check" />Asesoría en propiedad horizontal</li>
                                <li><span className="landing-service-card__check" />Resolución de conflictos inmobiliarios</li>
                            </ul>
                            <div className="landing-service-card__stat">
                                <span className="landing-service-card__stat-num">$2B+</span>
                                <span className="landing-service-card__stat-label">en activos protegidos</span>
                            </div>
                        </div>

                        {/* Service 3 — Migration */}
                        <div className="landing-service-card landing-service-card--migration" style={{ '--card-delay': '300ms', '--card-accent': 'var(--status-risk)', '--card-accent-bg': 'rgba(239, 107, 91, 0.08)' }}>
                            <div className="landing-service-card__accent" />
                            <div className="landing-service-card__glow" />
                            <div className="landing-service-card__header">
                                <div className="landing-service-card__icon">
                                    <GlobeIcon size={26} />
                                    <span className="landing-service-card__icon-ring" />
                                </div>
                                <span className="landing-service-card__number">03</span>
                            </div>
                            <h3 className="landing-service-card__title">Derecho<br /><span>Migratorio</span></h3>
                            <p className="landing-service-card__desc">
                                Gestión completa de visas y permisos. Facilitamos la movilidad internacional de talento para su empresa.
                            </p>
                            <ul className="landing-service-card__list">
                                <li><span className="landing-service-card__check" />Visas para nómadas digitales</li>
                                <li><span className="landing-service-card__check" />Permisos de trabajo para extranjeros</li>
                                <li><span className="landing-service-card__check" />Radicación ante Cancillería</li>
                                <li><span className="landing-service-card__check" />Cumplimiento migratorio empresarial</li>
                            </ul>
                            <div className="landing-service-card__stat">
                                <span className="landing-service-card__stat-num">98%</span>
                                <span className="landing-service-card__stat-label">tasa de aprobación de visas</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="landing-services__cta">
                        <p className="landing-services__cta-text">¿No está seguro qué área necesita? Nuestro asistente IA lo clasifica automáticamente.</p>
                        <button className="landing-btn landing-btn--primary" onClick={onNavigateToChat}>
                            <SparkleIcon size={16} />
                            Consultar Asistente IA
                        </button>
                    </div>
                </div>
            </section>

            {/* ═══════════════ AI FEATURE ═══════════════ */}
            <section className={`landing-section landing-ai ${isVisible('servicios') ? 'landing-section--visible' : ''}`}>
                <div className="landing-ai__inner">
                    <div className="landing-ai__text">
                        <span className="landing-section__label">Tecnología</span>
                        <h2 className="landing-section__title">Asistente Legal<br />con Inteligencia Artificial</h2>
                        <p className="landing-about__bio">
                            Nuestro asistente IA realiza un triaje legal preventivo en tiempo real.
                            Analiza su consulta, identifica riesgos y le conecta con el área
                            adecuada del despacho — todo en segundos.
                        </p>
                        <div className="landing-ai__features">
                            <div className="landing-ai__feature">
                                <div className="landing-ai__feature-icon landing-ai__feature-icon--blue">
                                    <SearchIcon size={22} />
                                </div>
                                <div>
                                    <strong>Analizando Normativa</strong>
                                    <p>Identifica las leyes y regulaciones aplicables a su caso.</p>
                                </div>
                            </div>
                            <div className="landing-ai__feature">
                                <div className="landing-ai__feature-icon landing-ai__feature-icon--green">
                                    <DocumentIcon size={22} />
                                </div>
                                <div>
                                    <strong>Generando Documento</strong>
                                    <p>Prepara borradores de contratos y documentos legales.</p>
                                </div>
                            </div>
                            <div className="landing-ai__feature">
                                <div className="landing-ai__feature-icon landing-ai__feature-icon--red">
                                    <WarningIcon size={22} />
                                </div>
                                <div>
                                    <strong>Validando Riesgos</strong>
                                    <p>Detecta posibles sanciones o vulnerabilidades legales.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="landing-ai__mockup">
                        <div className="landing-ai__chat-preview">
                            <div className="landing-ai__chat-header">
                                <div className="landing-ai__chat-dots">
                                    <span /><span /><span />
                                </div>
                                <span className="landing-ai__chat-title">Asistente Legal IA</span>
                            </div>
                            <div className="landing-ai__chat-body">
                                <div className="landing-ai__chat-msg landing-ai__chat-msg--user">
                                    ¿Qué tipo de contrato necesito para mi empleado temporal?
                                </div>
                                <div className="landing-ai__chat-msg landing-ai__chat-msg--bot">
                                    Según el <strong>Art. 46 del CST</strong>, para empleados temporales le recomiendo un contrato a término fijo inferior a un año...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════ CTA / CONTACTO ═══════════════ */}
            <section id="contacto" className={`landing-section landing-cta ${isVisible('contacto') ? 'landing-section--visible' : ''}`}>
                <div className="landing-cta__inner">
                    <img src={logoImg} alt="IuristaTech" className="landing-cta__logo" />
                    <h2 className="landing-cta__title">¿Listo para proteger su empresa?</h2>
                    <p className="landing-cta__desc">
                        Inicie una consulta gratuita con nuestro asistente IA o agende una cita directa
                        con el Dr. Christian.
                    </p>
                    <div className="landing-cta__buttons">
                        <button className="landing-btn landing-btn--primary landing-btn--lg" onClick={onNavigateToChat}>
                            <ChatBubbleIcon size={20} />
                            Consultar Asistente IA
                        </button>
                    </div>
                    <div className="landing-cta__contact-info">
                        <a href="mailto:contacto@iuristatech.com" className="landing-cta__contact-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                            contacto@iuristatech.com
                        </a>
                        <span className="landing-cta__contact-divider">·</span>
                        <span className="landing-cta__contact-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                            Colombia
                        </span>
                    </div>
                </div>
            </section>

            {/* ═══════════════ FOOTER ═══════════════ */}
            <footer className="landing-footer">
                <div className="landing-footer__inner">
                    <div className="landing-footer__brand">
                        <img src={logoImg} alt="IuristaTech" className="landing-footer__logo" />
                        <span className="landing-footer__copy">© 2026 IuristaTech. Todos los derechos reservados.</span>
                    </div>
                    <div className="landing-footer__links">
                        <button onClick={() => scrollTo('inicio')}>Inicio</button>
                        <button onClick={() => scrollTo('sobre-mi')}>Sobre Mí</button>
                        <button onClick={() => scrollTo('servicios')}>Servicios</button>
                        <button onClick={() => scrollTo('contacto')}>Contacto</button>
                    </div>
                </div>
            </footer>
        </div>
    );
}

