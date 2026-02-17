import './AnimatedIcons.css';

/* ═══════════════════════════════════════
   ANIMATED SVG ICON LIBRARY
   Professional, hand-crafted icon components
   with entrance & hover micro-animations
   ═══════════════════════════════════════ */

// ─── Scales of Justice ───
export function ScalesIcon({ size = 28, className = '' }) {
    return (
        <svg className={`anim-icon anim-icon--scales ${className}`} width={size} height={size} viewBox="0 0 40 40" fill="none">
            <line className="anim-icon__line" x1="20" y1="6" x2="20" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line className="anim-icon__beam" x1="6" y1="12" x2="34" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path className="anim-icon__pan anim-icon__pan--left" d="M6 12 L2 24 Q2 28 6 28 Q10 28 10 24 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path className="anim-icon__pan anim-icon__pan--right" d="M34 12 L30 24 Q30 28 34 28 Q38 28 38 24 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <rect x="16" y="32" width="8" height="2" rx="1" fill="currentColor" opacity="0.5" />
        </svg>
    );
}

// ─── Building / Real Estate ───
export function BuildingIcon({ size = 28, className = '' }) {
    return (
        <svg className={`anim-icon anim-icon--building ${className}`} width={size} height={size} viewBox="0 0 40 40" fill="none">
            <rect className="anim-icon__structure" x="8" y="10" width="16" height="26" rx="1" stroke="currentColor" strokeWidth="1.8" />
            <rect className="anim-icon__structure anim-icon__structure--delay" x="24" y="18" width="10" height="18" rx="1" stroke="currentColor" strokeWidth="1.8" />
            <rect className="anim-icon__window" x="12" y="14" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.4" />
            <rect className="anim-icon__window anim-icon__window--d1" x="17" y="14" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.4" />
            <rect className="anim-icon__window anim-icon__window--d2" x="12" y="20" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.4" />
            <rect className="anim-icon__window anim-icon__window--d3" x="17" y="20" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.4" />
            <rect className="anim-icon__window anim-icon__window--d4" x="12" y="26" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.4" />
            <rect className="anim-icon__window anim-icon__window--d5" x="17" y="26" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.4" />
            <rect className="anim-icon__window anim-icon__window--d2" x="27" y="22" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.4" />
            <rect className="anim-icon__window anim-icon__window--d4" x="27" y="28" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.4" />
            <line x1="5" y1="36" x2="37" y2="36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        </svg>
    );
}

// ─── Globe / Migration ───
export function GlobeIcon({ size = 28, className = '' }) {
    return (
        <svg className={`anim-icon anim-icon--globe ${className}`} width={size} height={size} viewBox="0 0 40 40" fill="none">
            <circle className="anim-icon__orbit" cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="1.8" />
            <ellipse className="anim-icon__meridian" cx="20" cy="20" rx="8" ry="15" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
            <line className="anim-icon__equator" x1="5" y1="20" x2="35" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <line x1="7" y1="13" x2="33" y2="13" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
            <line x1="7" y1="27" x2="33" y2="27" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
            <circle className="anim-icon__pin" cx="26" cy="12" r="2.5" fill="currentColor" opacity="0.8" />
            <line className="anim-icon__pin-line" x1="26" y1="14.5" x2="26" y2="18" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
        </svg>
    );
}

// ─── Shield / Protection ───
export function ShieldIcon({ size = 28, className = '' }) {
    return (
        <svg className={`anim-icon anim-icon--shield ${className}`} width={size} height={size} viewBox="0 0 40 40" fill="none">
            <path className="anim-icon__shield-body" d="M20 4 L34 10 L34 22 Q34 32 20 38 Q6 32 6 22 L6 10 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <polyline className="anim-icon__checkmark" points="14,20 18,25 26,15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
    );
}

// ─── Document ───
export function DocumentIcon({ size = 28, className = '' }) {
    return (
        <svg className={`anim-icon anim-icon--document ${className}`} width={size} height={size} viewBox="0 0 40 40" fill="none">
            <path className="anim-icon__doc-body" d="M10 6 H26 L32 12 V34 H10 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path className="anim-icon__doc-fold" d="M26 6 V12 H32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <line className="anim-icon__doc-line" x1="15" y1="18" x2="27" y2="18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
            <line className="anim-icon__doc-line anim-icon__doc-line--d1" x1="15" y1="23" x2="27" y2="23" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
            <line className="anim-icon__doc-line anim-icon__doc-line--d2" x1="15" y1="28" x2="22" y2="28" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        </svg>
    );
}

// ─── Search / Analyze ───
export function SearchIcon({ size = 28, className = '' }) {
    return (
        <svg className={`anim-icon anim-icon--search ${className}`} width={size} height={size} viewBox="0 0 40 40" fill="none">
            <circle className="anim-icon__lens" cx="18" cy="18" r="10" stroke="currentColor" strokeWidth="2" />
            <line className="anim-icon__handle" x1="25" y1="25" x2="34" y2="34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <circle className="anim-icon__glint" cx="14" cy="14" r="2" fill="currentColor" opacity="0.15" />
        </svg>
    );
}

// ─── Warning / Risk ───
export function WarningIcon({ size = 28, className = '' }) {
    return (
        <svg className={`anim-icon anim-icon--warning ${className}`} width={size} height={size} viewBox="0 0 40 40" fill="none">
            <path className="anim-icon__triangle" d="M20 6 L36 34 H4 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <line className="anim-icon__excl-line" x1="20" y1="16" x2="20" y2="25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <circle className="anim-icon__excl-dot" cx="20" cy="30" r="1.5" fill="currentColor" />
        </svg>
    );
}

// ─── Users / People ───
export function UsersIcon({ size = 28, className = '' }) {
    return (
        <svg className={`anim-icon anim-icon--users ${className}`} width={size} height={size} viewBox="0 0 40 40" fill="none">
            <circle className="anim-icon__head" cx="16" cy="13" r="5" stroke="currentColor" strokeWidth="1.8" />
            <path className="anim-icon__body" d="M6 34 Q6 25 16 25 Q26 25 26 34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <circle className="anim-icon__head anim-icon__head--second" cx="28" cy="14" r="4" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
            <path className="anim-icon__body anim-icon__body--second" d="M22 34 Q22 27 28 27 Q34 27 34 34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
        </svg>
    );
}

// ─── Sparkle / AI ───
export function SparkleIcon({ size = 20, className = '' }) {
    return (
        <svg className={`anim-icon anim-icon--sparkle ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path className="anim-icon__star anim-icon__star--main" d="M12 2 L13.5 8.5 L20 10 L13.5 11.5 L12 18 L10.5 11.5 L4 10 L10.5 8.5 Z" />
            <path className="anim-icon__star anim-icon__star--small" d="M19 16 L19.8 18.2 L22 19 L19.8 19.8 L19 22 L18.2 19.8 L16 19 L18.2 18.2 Z" opacity="0.5" />
        </svg>
    );
}

// ─── Chat Bubble (for assistant avatar) ───
export function ChatBubbleIcon({ size = 20, className = '' }) {
    return (
        <svg className={`anim-icon anim-icon--chat ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path className="anim-icon__bubble" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle className="anim-icon__chat-dot" cx="9" cy="12" r="1" fill="currentColor" opacity="0.5" />
            <circle className="anim-icon__chat-dot anim-icon__chat-dot--d1" cx="12" cy="12" r="1" fill="currentColor" opacity="0.5" />
            <circle className="anim-icon__chat-dot anim-icon__chat-dot--d2" cx="15" cy="12" r="1" fill="currentColor" opacity="0.5" />
        </svg>
    );
}
