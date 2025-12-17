import { Link, useLocation } from "react-router-dom";
import styles from "../styles/components/Sidebar.module.css";
import Logo from "./UI/Logo";
import { LayoutDashboard, Library, WandSparkles, CreditCard } from 'lucide-react';
import Footer from "./Footer";
import { useTranslation } from "react-i18next";


interface SidebarProps {
  onLinkClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick }) => {
  const location = useLocation();
  const current = location.pathname;
  const { t } = useTranslation();

  const handleClick = () => {
    if (onLinkClick) onLinkClick();
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Logo/>
      </div>

      <nav className={styles.nav}>
        <Link
          to="/dashboard"
          className={`${styles.navItem} ${current === "/dashboard" ? styles.active : ""}`}
          onClick={handleClick}
        >
          <LayoutDashboard size={20} /> {t('dashboard')}
        </Link>

        <Link
          to="/library"
          className={`${styles.navItem} ${current === "/library" ? styles.active : ""}`}
          onClick={handleClick}
        >
          <Library size={20} /> {t('library')}
        </Link>

        <Link
          to="/generate"
          className={`${styles.navItem} ${current === "/generate" ? styles.active : ""}`}
          onClick={handleClick}
        >
          <WandSparkles size={20} /> {t('generate')}
        </Link>

        <Link
          to="/payments"
          className={`${styles.navItem} ${current === "/payments" ? styles.active : ""}`}
          onClick={handleClick}
        >
          <CreditCard size={20} /> {t('payment')}
        </Link>
      </nav>

      <Footer />
    </aside>
  );
};


export default Sidebar;