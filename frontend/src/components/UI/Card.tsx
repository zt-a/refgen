import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../../styles/components/UI/Card.module.css";
import {
    FileText,
    EllipsisVertical,
    Eye,
    Download,
    Pencil,
    Trash,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { STATUS_LABELS } from "../../utils/statusLabels";
import ButtonPrimary from "./ButtonPrimary";

/* ================= TYPES ================= */

export interface CardProps {
    id: string;
    title: string;
    pages: number;
    date: string;
    status?: string; // статус эссе

    onRead?: (id: string) => void;
    onDownload?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onGenerate?: (id: string) => void; // новая кнопка генерации
}

/* ================= COMPONENT ================= */

const Card: React.FC<CardProps> = ({
    id,
    title,
    pages,
    date,
    status,
    onRead,
    onDownload,
    onEdit,
    onDelete,
    onGenerate,
}) => {
    const [open, setOpen] = useState(false);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const { t } = useTranslation();

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
        <div className={styles.card} ref={cardRef}>
            <div className={styles.cardIconContainer}>
                <div className={styles.cardIcon}>
                    <FileText size={24} />
                </div>

                <div
                    className={styles.Ellipsis}
                    onClick={() => setOpen((prev) => !prev)}
                >
                    <EllipsisVertical size={20} />
                </div>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            className={styles.dropdown}
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.16, ease: "easeOut" }}
                        >
                            {onRead && (
                                <div
                                    className={styles.dropdownItem}
                                    onClick={() => onRead?.(id)}
                                >
                                    <Eye size={18} />
                                    <span>{t("read")}</span>
                                </div>
                            )}
                            {onDownload && (
                                <div
                                    className={styles.dropdownItem}
                                    onClick={() => onDownload?.(id)}
                                >
                                    <Download size={18} />
                                    <span>{t("download")}</span>
                                </div>
                            )}

                            {onEdit && (
                                <div
                                    className={styles.dropdownItem}
                                    onClick={() => onEdit?.(id)}
                                >
                                    <Pencil size={18} />
                                    <span>{t("edit")}</span>
                                </div>
                            )}

                            {onDelete && (
                                <div
                                    className={styles.dropdownItemDelete}
                                    onClick={() => onDelete?.(id)}
                                >
                                    <Trash size={18} />
                                    <span>{t("delete")}</span>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className={styles.cardTitle}>{title}</div>

            <div className={styles.cardSubtitle}>
                {pages} {t("pages")} {status && `- ${STATUS_LABELS[status] ?? status}`}
            </div>

            <div className={styles.cardDesc}>{date}</div>

            {/* Кнопка генерации только если статус PLAN_GENERATED */}
            <div className={styles.cardFooter}>
                {/* Кнопка генерации */}
                {status === "PLAN_GENERATED" && (
                    <ButtonPrimary className={styles.generateBtn} onClick={() => onGenerate?.(id)}>
                        Сгенерировать
                    </ButtonPrimary>
                )}

                {/* Мобильные кнопки */}
                <div className={styles.mobileBtns}>
                    {onRead && (
                        <button className={styles.BtnRead} onClick={() => onRead?.(id)}>
                            <Eye size={18} />
                            <span>{t("read")}</span>
                        </button>
                    )}
                    {onDownload && (
                        <button onClick={() => onDownload?.(id)}>
                            <Download size={18} />
                            <span>{t("download")}</span>
                        </button>
                    )}
                    
                </div>
            </div>

            {/* <div className={styles.mobileBtns}>
                <button
                    className={styles.BtnRead}
                    onClick={() => onRead?.(id)}
                >
                    <Eye size={18} />
                    <span>{t("read")}</span>
                </button>

                <button onClick={() => onDownload?.(id)}>
                    <Download size={18} />
                    <span>{t("download")}</span>
                </button>

                {status === "PLAN_GENERATED" && (
                    <button
                        style={{
                            background: "#3b82f6",
                            color: "white",
                            borderRadius: 8,
                            padding: "6px 12px",
                            fontSize: 14,
                        }}
                        onClick={() => onGenerate?.(id)}
                    >
                        Сгенерировать
                    </button>
                )}
            </div> */}
        </div>
    );
};

export default Card;
