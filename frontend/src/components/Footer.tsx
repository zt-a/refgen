import styles from '../styles/components/Footer.module.css';

interface FooterProps {
  spanText?: string; // текст для span, необязательный
}

const Footer: React.FC<FooterProps> = ({ spanText }) => {
    return (
        <footer className={styles.Footer}>
            © 2025 RefGen. {spanText && <span>{spanText}</span>}
        </footer>
    );
};

export default Footer;
