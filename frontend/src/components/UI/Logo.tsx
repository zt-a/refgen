import { FileText } from 'lucide-react';
import styles from '../../styles/components/UI/Logo.module.css';

const Logo = () => {
  return (
    <div className={styles.Logo}>
      <div className={styles.iconWrapper}>
        <FileText color="#fff" width="24px" height="24px" />
      </div>
      <div className={styles.text}>RefGen</div>
    </div>
  );
};
export default Logo;