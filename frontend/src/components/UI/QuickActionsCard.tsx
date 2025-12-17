import { FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import styles from "../../styles/components/UI/QuickActionsCard.module.css";

/* ================= TYPES ================= */

interface QuickActionsCardProps {
    title: string;                 // основной текст
    subtitle?: string;             // дополнительный текст
    Icon?: LucideIcon;             // иконка, по умолчанию FileText
    color?: string;                // цвет бордера и иконки
    colorTransparent?: string;     // цвет фона при hover
}

/* ================= COMPONENT ================= */

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
    title,
    subtitle,
    Icon = FileText,
    color = "#b700ff",
    colorTransparent = "rgba(183, 0, 255, 0.15)",
}) => {
    return (
        <div
            className={styles.QuickActionsCard}
            style={
                {
                    "--hover-color": color,
                    "--hover-bg": colorTransparent,
                } as React.CSSProperties
            }
        >
            <div className={styles.icon}>
                <Icon color={color} size={24} />
            </div>

            <div className={styles.info}>
                <p>{title}</p>
                {subtitle && <span>{subtitle}</span>}
            </div>
        </div>
    );
};

export default QuickActionsCard;
