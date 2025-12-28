import CardCreateCartera from '../CardCreateCartera/CardCreateCartera';
import './CardCreateBusiness.css';

// Wrapper component para mantener compatibilidad
export default function CardCreateBusiness({ onBusinessCreated }) {
    return <CardCreateCartera onBusinessCreated={onBusinessCreated} />;
}