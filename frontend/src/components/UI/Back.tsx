import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import styles from '../../styles/components/UI/Back.module.css';
import { useTranslation } from "react-i18next";


interface BackProps {
    url: string;
}

const Back: React.FC<BackProps> = ({ url }) => {
    const { t } = useTranslation();
    return (
        <Link to={url} className={styles.backLink}>
            <ArrowLeft />
            <span>{t('back')}</span>
        </Link>
    );
};

export default Back;
