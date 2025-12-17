import type { LucideIcon } from "lucide-react"; 
import styles from '../../styles/components/UI/LandingCard.module.css';

interface LandingCardType {
    Icon: LucideIcon;
    title: string;
    description: string;
}

const LandingCard: React.FC<LandingCardType> = ({ Icon, title, description }) => {
    return (
        <div className={styles.Card}>
            <div  className={styles.CardIcon} >
                <Icon size={32} color="#0066ffff"/>
            </div>

            <h3 className={styles.CardTitle}>{title}</h3>
            <p className={styles.CardDescription}>{description}</p>
        </div>
    );
};

export default LandingCard;
