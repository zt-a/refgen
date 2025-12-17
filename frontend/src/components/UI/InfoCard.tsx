import styles from "../../styles/components/UI/InfoCard.module.css";
import type { LucideIcon } from "lucide-react";

/* ================= TYPES ================= */

export interface InfoCardProps {
    label: string;
    value: number | string;
    Icon: LucideIcon;
    color?: string;
    bgColor?: string;
}

/* ================= COMPONENT ================= */

const InfoCard: React.FC<InfoCardProps> = ({ label, value, Icon, color, bgColor }) => {
    return (
        <div
            className={styles.InfoCard}
            style={{ '--bg-color': bgColor } as React.CSSProperties} // передаём переменную в CSS
        >
            <div className={styles.info}>
                <p>{label}</p>
                <span>{value}</span>
            </div>

            <div className={styles.icon}>
                <Icon size={24} color={color} />
            </div>
        </div>
    );
};


export default InfoCard;
