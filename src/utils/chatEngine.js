/**
 * Chat Engine — Simulated AI responses & status detection
 * For the law firm of Juan Pablo Noreña Aguirre
 */

// Keywords that trigger each status capsule
const RISK_KEYWORDS = [
    'demanda', 'sanción', 'sancion', 'multa', 'embargo', 'tutela',
    'incumplimiento', 'penalidad', 'litigio', 'ilegal', 'infracción',
    'fraude', 'prescripción', 'caducidad', 'ugpp', 'dian',
];

const DOCUMENT_KEYWORDS = [
    'contrato', 'documento', 'borrador', 'certificado', 'poder',
    'escritura', 'acta', 'reglamento', 'formulario', 'solicitud',
    'formato', 'plantilla', 'modelo', 'cláusula', 'clausula',
];

/**
 * Detect the AI processing status based on message content
 * @param {string} message - The user's message
 * @returns {'analyzing' | 'document' | 'risk'} status
 */
export function detectStatus(message) {
    const lower = message.toLowerCase();

    const hasRisk = RISK_KEYWORDS.some(kw => lower.includes(kw));
    if (hasRisk) return 'risk';

    const hasDocument = DOCUMENT_KEYWORDS.some(kw => lower.includes(kw));
    if (hasDocument) return 'document';

    return 'analyzing';
}

/**
 * Simulated AI responses per specialty area
 */
const RESPONSES = {
    laboral: [
        `Entiendo su consulta sobre contratación laboral. Permítame orientarle.

En Colombia, la formalización de contratos de trabajo se rige por el **Código Sustantivo del Trabajo (CST)**. Para su Pyme, es fundamental distinguir entre:

| Tipo de Contrato | Duración | Características |
|---|---|---|
| Término Fijo | Hasta 3 años | Renovable, requiere preaviso de 30 días |
| Término Indefinido | Sin límite | Mayor estabilidad, indemnización por despido sin justa causa |
| Obra o Labor | Según la obra | Finaliza al completar la labor contratada |
| Prestación de Servicios | Variable | No genera relación laboral directa |

**Recomendación para Pymes:** El contrato a término fijo inferior a un año es ideal para evaluar personal, pero recuerde que según el **Art. 46 del CST**, si se renueva más de 3 veces, la cuarta debe ser por 1 año mínimo.

¿Desea que genere un borrador de contrato laboral adaptado a las necesidades de su empresa?`,
    ],

    inmobiliario: [
        `Gracias por su consulta sobre arrendamiento comercial. Es un tema crucial para la operación de cualquier Pyme.

El arrendamiento de locales comerciales en Colombia se rige por la **Ley 820 de 2003** y los artículos pertinentes del **Código de Comercio**.

Puntos críticos que debe verificar en su contrato:

**1. Derecho de renovación automática (Art. 518 C. Comercio):** Si ha ocupado el local por más de 2 años, tiene derecho preferente a la renovación.

**2. Incremento del canon:** No puede exceder el IPC certificado por el DANE para el año inmediatamente anterior.

**3. Debida diligencia del inmueble:** Antes de firmar, solicite:
- Certificado de Tradición y Libertad (no mayor a 30 días)
- Paz y Salvo de administración
- Certificado de uso del suelo compatible con su actividad

**Alerta preventiva:** Firmar sin debida diligencia puede exponerlo a embargos ocultos o limitaciones de uso que afecten su operación.

¿Desea que revise las cláusulas específicas de su contrato de arrendamiento?`,
    ],

    migratorio: [
        `Excelente consulta. La gestión migratoria para empresas en Colombia ha tenido cambios significativos.

Según la **Resolución 5477 de 2022** del Ministerio de Relaciones Exteriores, los tipos de visa relevantes para su empresa son:

| Visa | Uso | Vigencia |
|---|---|---|
| **Visa V** (Visitante) | Nómadas digitales, turismo de negocios | Hasta 2 años |
| **Visa M** (Migrante) | Trabajadores contratados por empresa colombiana | Hasta 3 años |
| **Visa R** (Residente) | Extranjeros con 5+ años de visa M | Indefinida |

**Para nómadas digitales:** Desde 2022, Colombia ofrece la **Visa V - Nómada Digital**, que requiere:
- Ingresos mensuales mínimos de 3 salarios mínimos colombianos
- Seguro médico vigente en Colombia
- Carta de la empresa o prueba de actividad remota

**Obligación del empleador:** Si contrata directamente a un extranjero, debe reportar el vínculo ante **Migración Colombia** dentro de los 15 días siguientes.

¿Necesita que prepare los documentos de radicación para un caso específico?`,
    ],

    general: [
        `Gracias por su consulta. He analizado su situación dentro del marco normativo colombiano aplicable.

Para brindarle una orientación precisa, necesito entender mejor su caso:

**1.** ¿Se trata de una persona natural o jurídica (empresa)?
**2.** ¿En qué ciudad o departamento se encuentra?
**3.** ¿Existe algún plazo o urgencia que debamos considerar?

Estas preguntas me permiten personalizar mi análisis según las normas territoriales y los plazos legales aplicables.

Recuerde que mi asesoría cubre tres áreas especializadas:
- ⚖️ **Derecho Laboral y Seguridad Social**
- 🏛️ **Régimen Inmobiliario**
- 🌎 **Derecho Migratorio**

Si su consulta se encuentra fuera de estas áreas, le recomiendo agendar una **Consulta de Fondo** directamente con el Christian  para recibir orientación personalizada.

¿En cuál de estas áreas se enmarca su necesidad?`,
    ],

    outOfScope: [
        `Agradezco su confianza al consultarme. Sin embargo, debo ser transparente con usted.

Su consulta se enmarca en un área que **excede el alcance de este despacho**. Nuestro enfoque se centra exclusivamente en:

- ⚖️ Derecho Laboral y Seguridad Social
- 🏛️ Régimen Inmobiliario
- 🌎 Derecho Migratorio

Para temas de derecho penal, civil general, familia o constitucional, le recomendamos acudir a un profesional especializado en esa materia.

Si tiene alguna consulta dentro de nuestras áreas de especialidad, estoy a su disposición. ¿Puedo ayudarle con algo más?`,
    ],

    riskDetected: [
        `⚠️ **Alerta de Riesgo Detectada**

He identificado elementos en su consulta que podrían implicar riesgos económicos o sanciones para su empresa.

Antes de proceder, es importante que considere lo siguiente:

**Acciones preventivas inmediatas:**
1. No tome decisiones laborales unilaterales sin documentación adecuada
2. Conserve toda la evidencia documental relacionada
3. Revise los plazos de prescripción aplicables a su caso

Dado el nivel de riesgo identificado, le recomiendo encarecidamente agendar una **Consulta de Fondo** con el Dr. Christian para un análisis personalizado de su situación.

Para formalizar este requerimiento en el sistema de Juan Pablo, necesito validar su perfil. ¿Podría indicarme su nombre completo y correo electrónico?`,
    ],
};

/**
 * Classify the intent of a user message
 */
function classifyMessage(message) {
    const lower = message.toLowerCase();

    // Out of scope detection
    const outOfScopeKeywords = [
        'penal', 'criminal', 'divorcio', 'custodia', 'herencia',
        'sucesión', 'alimentos', 'violencia', 'homicidio', 'robo',
        'estafa',
    ];
    if (outOfScopeKeywords.some(kw => lower.includes(kw))) return 'outOfScope';

    // Risk detection
    if (RISK_KEYWORDS.some(kw => lower.includes(kw))) return 'riskDetected';

    // Specialty detection
    const laboralKeywords = [
        'contrat', 'trabajo', 'laboral', 'nómina', 'nomina', 'despido',
        'empleado', 'trabajador', 'salario', 'prestacion', 'pila',
        'ugpp', 'seguridad social', 'liquidación', 'liquidacion',
        'vacaciones', 'prima', 'cesantías', 'cesantias', 'eps', 'arl',
    ];
    if (laboralKeywords.some(kw => lower.includes(kw))) return 'laboral';

    const inmobiliarioKeywords = [
        'arrendamiento', 'arriendo', 'local', 'inmueble', 'propiedad',
        'escritura', 'título', 'titulo', 'horizontal', 'predio',
        'canon', 'inquilino', 'arrendatario', 'arrendador',
    ];
    if (inmobiliarioKeywords.some(kw => lower.includes(kw))) return 'inmobiliario';

    const migratorioKeywords = [
        'visa', 'migra', 'extranjero', 'nómada', 'nomada', 'digital',
        'cancillería', 'cancilleria', 'pasaporte', 'permiso',
        'residencia', 'nacionalidad',
    ];
    if (migratorioKeywords.some(kw => lower.includes(kw))) return 'migratorio';

    return 'general';
}

/**
 * Simulate typing delay (ms per character)
 */
function getTypingDelay(text) {
    const baseDelay = 800;
    const perCharDelay = 8;
    return Math.min(baseDelay + text.length * perCharDelay, 3000);
}

/**
 * Generate a simulated AI response
 * @param {string} userMessage
 * @returns {Promise<{text: string, status: string}>}
 */
export async function generateResponse(userMessage) {
    const category = classifyMessage(userMessage);
    const status = detectStatus(userMessage);
    const responses = RESPONSES[category] || RESPONSES.general;
    const text = responses[Math.floor(Math.random() * responses.length)];

    const delay = getTypingDelay(text);
    await new Promise(resolve => setTimeout(resolve, delay));

    return { text, status };
}
