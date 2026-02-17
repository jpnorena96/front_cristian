import { useState, useEffect } from 'react';
import './SplashScreen.css';
import logoImg from '../assets/logo.png';

export default function SplashScreen({ onComplete }) {
    const [phase, setPhase] = useState('enter'); // enter → reveal → exit

    useEffect(() => {
        // Phase 1: Logo draws in (0 → 1.2s)
        // Phase 2: Text reveals (1.2s → 2.2s)
        const revealTimer = setTimeout(() => setPhase('reveal'), 1200);
        // Phase 3: Exit transition (2.8s → 3.6s)
        const exitTimer = setTimeout(() => setPhase('exit'), 2800);
        // Phase 4: Remove from DOM
        const completeTimer = setTimeout(() => onComplete(), 3600);

        return () => {
            clearTimeout(revealTimer);
            clearTimeout(exitTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <div className={`splash splash--${phase}`}>
            {/* Background effects */}
            <div className="splash__grid" />
            <div className="splash__glow splash__glow--1" />
            <div className="splash__glow splash__glow--2" />

            {/* Animated particles */}
            <div className="splash__particles">
                {Array.from({ length: 12 }).map((_, i) => (
                    <span
                        key={i}
                        className="splash__particle"
                        style={{
                            '--p-x': `${10 + Math.random() * 80}%`,
                            '--p-delay': `${i * 0.15}s`,
                            '--p-duration': `${2 + Math.random() * 2}s`,
                            '--p-size': `${2 + Math.random() * 3}px`,
                        }}
                    />
                ))}
            </div>

            {/* Center content */}
            <div className="splash__content">
                {/* Animated ring behind logo */}
                <div className="splash__ring" />
                <div className="splash__ring splash__ring--outer" />

                {/* Logo */}
                <div className="splash__logo-wrapper">
                    <img src={logoImg} alt="IuristaTech" className="splash__logo" />
                </div>

                {/* Animated line separator */}
                <div className="splash__line" />

                {/* Text */}
                <div className="splash__text">
                    <h1 className="splash__title">IuristaTech</h1>
                    <p className="splash__subtitle">Asistente Legal con Inteligencia Artificial</p>
                </div>

                {/* Loading bar */}
                <div className="splash__loader">
                    <div className="splash__loader-track">
                        <div className="splash__loader-fill" />
                    </div>
                </div>
            </div>

            {/* Exit curtains */}
            <div className="splash__curtain splash__curtain--left" />
            <div className="splash__curtain splash__curtain--right" />
        </div>
    );
}
