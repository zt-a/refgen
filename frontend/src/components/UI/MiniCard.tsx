import { FileText, EllipsisVertical, Eye, Download, Pencil, Trash, WandSparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import styles from "../../styles/components/UI/MiniCard.module.css";
import { STATUS_LABELS } from "../../utils/statusLabels";


export type Status =
    | "PENDING"
    | "PLAN_GENERATED"
    | "STARTED"
    | "IN_PROGRESS"
    | "GENERATING"
    | "GENERATED"
    | "COMPLETED"
    | "FAILURE"
    | "ERROR"
    | "CANCELED"
    | "EXPIRED"
    | "FAILED";

/* ================= TYPES ================= */

interface MiniCardProps {
    id: string;
    title: string;
    subtitle?: string;
    desc: string;
    status?: string;

    onRead?: (id: string) => void;
    onDownload?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onGenerate?: (id: string) => void;

    className?: string;
}

/* ================= COMPONENT ================= */

const MiniCard: React.FC<MiniCardProps> = ({
    id,
    title,
    subtitle,
    desc,
    status,
    onRead,
    onDownload,
    onEdit,
    onDelete,
    onGenerate,
    className,
}) => {
    const [open, setOpen] = useState(false);
    const cardRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`${styles.miniCard} ${className}`} ref={cardRef}>
            <div className={styles.icon}>
                <FileText size={20} color="blue"/>
            </div>

            <div className={styles.info}>
                <p>{id}: {title}</p>
                <span>
                    {subtitle}
                    {status && ` • ${STATUS_LABELS[status] ?? status}`}
                    • {desc}
                </span>


            </div>

            {/* Нижняя кнопка ellipsis */}
            <div className={styles.bottomWrapper}>
                <div
                    className={styles.ellipsisWrapper}
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpen((prev) => !prev);
                    }}
                >
                    <EllipsisVertical size={18} />
                </div>

                {open && (
                    <div className={styles.dropdownBottom}>
                        {onRead && (
                            <div
                                className={styles.dropdownItem}
                                onClick={() => {
                                    onRead(id);
                                    setOpen(false);
                                }}
                            >
                                <Eye size={16} />
                                <span>Открыть</span>
                            </div>
                        )}

                        {onDownload && (
                            <div
                                className={styles.dropdownItem}
                                onClick={() => {
                                    onDownload(id);
                                    setOpen(false);
                                }}
                            >
                                <Download size={16} />
                                <span>Скачать</span>
                            </div>
                        )}

                        {onEdit && (
                            <div
                                className={styles.dropdownItem}
                                onClick={() => {
                                    onEdit(id);
                                    setOpen(false);
                                }}
                            >
                                <Pencil size={16} />
                                <span>Редактировать</span>
                            </div>
                        )}

                        {onDelete && (
                            <div
                                className={styles.dropdownItemDelete}
                                onClick={() => {
                                    onDelete(id);
                                    setOpen(false);
                                }}
                            >
                                <Trash size={16} />
                                <span>Удалить</span>
                            </div>
                        )}

                        {status === "PLAN_GENERATED" && onGenerate && (
                            <div
                                className={styles.dropdownItem}
                                onClick={() => {
                                    onGenerate(id);
                                    setOpen(false);
                                }}
                            >
                                <WandSparkles size={16}/> 
                                <span>Сгенерировать</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MiniCard;
