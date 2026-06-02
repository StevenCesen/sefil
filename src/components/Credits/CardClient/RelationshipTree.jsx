import "./RelationshipTree.css";

// Generación relativa al titular (positivo = ascendente, negativo = descendente)
const GEN_MAP = {
    'BISABUELO': 3, 'BISABUELA': 3,
    'ABUELO': 2, 'ABUELA': 2,
    'ABUELO MATERNO': 2, 'ABUELA MATERNA': 2,
    'ABUELO PATERNO': 2, 'ABUELA PATERNA': 2,
    'PADRE': 1, 'MADRE': 1, 'PADRE ADOPTIVO': 1, 'MADRE ADOPTIVA': 1,
    'TIO': 1, 'TIA': 1,
    'TIO MATERNO': 1, 'TIA MATERNA': 1,
    'TIO PATERNO': 1, 'TIA PATERNA': 1,
    'HERMANO': 0, 'HERMANA': 0, 'HERMANASTRO': 0, 'HERMANASTRA': 0,
    'CÓNYUGE': 0, 'ESPOSO': 0, 'ESPOSA': 0, 'CONVIVIENTE': 0, 'PAREJA': 0,
    'PRIMO': 0, 'PRIMA': 0,
    'HIJO': -1, 'HIJA': -1, 'HIJO ADOPTIVO': -1, 'HIJA ADOPTIVA': -1,
    'SOBRINO': -1, 'SOBRINA': -1,
    'NIETO': -2, 'NIETA': -2,
};

// Relaciones directas (línea de sangre / pareja principal)
const DIRECT = new Set(['BISABUELO', 'BISABUELA', 'ABUELO', 'ABUELA', 'ABUELO MATERNO', 'ABUELA MATERNA',
    'ABUELO PATERNO', 'ABUELA PATERNA', 'PADRE', 'MADRE', 'PADRE ADOPTIVO', 'MADRE ADOPTIVA',
    'CÓNYUGE', 'ESPOSO', 'ESPOSA', 'CONVIVIENTE', 'PAREJA',
    'HIJO', 'HIJA', 'HIJO ADOPTIVO', 'HIJA ADOPTIVA',
    'NIETO', 'NIETA']);

const GEN_LABEL = {
    3: 'Bisabuelos',
    2: 'Abuelos',
    1: 'Padres · Tíos',
    0: 'Hermanos · Cónyuge',
    '-1': 'Hijos · Sobrinos',
    '-2': 'Nietos',
};

function getGen(type = '') {
    const key = type.toUpperCase().trim();
    if (GEN_MAP[key] !== undefined) return GEN_MAP[key];
    // fallback parcial
    if (key.includes('ABUELO') || key.includes('ABUELA')) return 2;
    if (key.includes('TIO') || key.includes('TIA')) return 1;
    if (key.includes('PADRE') || key.includes('MADRE')) return 1;
    if (key.includes('HERMANO') || key.includes('HERMANA')) return 0;
    if (key.includes('HIJO') || key.includes('HIJA')) return -1;
    if (key.includes('NIETO') || key.includes('NIETA')) return -2;
    return null; // sin clasificar
}

export default function RelationshipTree({ clientName, relationships }) {
    if (!relationships || relationships.length === 0) return null;

    const byGen = {};
    const unclassified = [];

    relationships.forEach(r => {
        const gen = getGen(r.relationship_type);
        if (gen === null) { unclassified.push(r); return; }
        if (!byGen[gen]) byGen[gen] = [];
        byGen[gen].push(r);
    });

    const ascending  = Object.keys(byGen).map(Number).filter(g => g > 0).sort((a, b) => b - a);
    const sameLevel  = byGen[0] ? [0] : [];
    const descending = Object.keys(byGen).map(Number).filter(g => g < 0).sort((a, b) => b - a);

    const renderRow = (gen) => {
        const label   = GEN_LABEL[gen] || `Gen ${gen}`;
        const members = byGen[gen];
        return (
            <div key={gen} className="RelTree__gen-row">
                <span className="RelTree__gen-label">{label}</span>
                <div className="RelTree__gen-nodes">
                    {members.map(rel => {
                        const isDirect = DIRECT.has(rel.relationship_type?.toUpperCase().trim());
                        return (
                            <div key={rel.id} className={`RelTree__node ${isDirect ? 'RelTree__node--direct' : 'RelTree__node--collateral'}`}>
                                <span className="RelTree__node-type">{rel.relationship_type}</span>
                                <p className="RelTree__node-name">{rel.related_name}</p>
                                <span className="RelTree__node-ci">{rel.related_identification}</span>
                                {rel.related_death_date && (
                                    <span className="RelTree__node-deceased">✝ {rel.related_death_date}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="RelTree">
            <p className="RelTree__title">Árbol genealógico</p>
            <div className="RelTree__timeline">

                {/* Ascendentes: bisabuelos → abuelos → padres/tíos */}
                {ascending.map(renderRow)}

                {/* Titular — nodo central */}
                <div className="RelTree__gen-row RelTree__gen-row--client">
                    <span className="RelTree__gen-label">Titular</span>
                    <div className="RelTree__gen-nodes">
                        <div className="RelTree__node RelTree__node--client">
                            <p className="RelTree__node-name">{clientName}</p>
                        </div>
                    </div>
                </div>

                {/* Misma generación: hermanos, cónyuge, primos */}
                {sameLevel.map(renderRow)}

                {/* Descendentes: hijos/sobrinos → nietos */}
                {descending.map(renderRow)}

                {/* Sin clasificar */}
                {unclassified.length > 0 && (
                    <div className="RelTree__gen-row">
                        <span className="RelTree__gen-label">Otros</span>
                        <div className="RelTree__gen-nodes">
                            {unclassified.map(rel => (
                                <div key={rel.id} className="RelTree__node RelTree__node--collateral">
                                    <span className="RelTree__node-type">{rel.relationship_type}</span>
                                    <p className="RelTree__node-name">{rel.related_name}</p>
                                    <span className="RelTree__node-ci">{rel.related_identification}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
