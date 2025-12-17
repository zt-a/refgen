import styles from '../../styles/components/UI/Button.module.css'

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, className, onClick , ...props}) => {
  return (
    <button className={`${styles.button} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

export default Button;
