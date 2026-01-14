// Helper para gestionar el cache de actividades pendientes en localStorage

const CACHE_KEYS = {
    AGREEMENTS: 'pending_agreements',
    CONDONATIONS: 'pending_condonations',
    TIMESTAMP: 'pending_activities_timestamp'
};

const CACHE_DURATION = 30000; // 30 segundos

// Obtener agreements del cache
export const getCachedAgreements = () => {
    try {
        const cached = localStorage.getItem(CACHE_KEYS.AGREEMENTS);
        return cached ? JSON.parse(cached) : null;
    } catch (error) {
        console.error('Error reading agreements cache:', error);
        return null;
    }
};

// Obtener condonations del cache
export const getCachedCondonations = () => {
    try {
        const cached = localStorage.getItem(CACHE_KEYS.CONDONATIONS);
        return cached ? JSON.parse(cached) : null;
    } catch (error) {
        console.error('Error reading condonations cache:', error);
        return null;
    }
};

// Verificar si el cache es válido (no expiró)
export const isCacheValid = () => {
    try {
        const timestamp = localStorage.getItem(CACHE_KEYS.TIMESTAMP);
        if (!timestamp) return false;

        const now = Date.now();
        const cacheTime = parseInt(timestamp, 10);
        return (now - cacheTime) < CACHE_DURATION;
    } catch (error) {
        return false;
    }
};

// Guardar agreements en cache
export const setCachedAgreements = (agreements) => {
    try {
        localStorage.setItem(CACHE_KEYS.AGREEMENTS, JSON.stringify(agreements));
        updateTimestamp();
    } catch (error) {
        console.error('Error saving agreements cache:', error);
    }
};

// Guardar condonations en cache
export const setCachedCondonations = (condonations) => {
    try {
        localStorage.setItem(CACHE_KEYS.CONDONATIONS, JSON.stringify(condonations));
        updateTimestamp();
    } catch (error) {
        console.error('Error saving condonations cache:', error);
    }
};

// Actualizar timestamp
const updateTimestamp = () => {
    localStorage.setItem(CACHE_KEYS.TIMESTAMP, Date.now().toString());
};

// Limpiar todo el cache
export const clearCache = () => {
    localStorage.removeItem(CACHE_KEYS.AGREEMENTS);
    localStorage.removeItem(CACHE_KEYS.CONDONATIONS);
    localStorage.removeItem(CACHE_KEYS.TIMESTAMP);
};

export const triggerCacheUpdate = () => {
    updateTimestamp();
};
