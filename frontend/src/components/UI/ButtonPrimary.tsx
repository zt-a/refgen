import styles from '../../styles/components/UI/ButtonPrimary.module.css'

type ButtonPrimaryProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({ children, onClick, className, type, disabled, ...props }) => {
  return (
    <button 
      className={`${styles.button} ${className}`} 
      onClick={onClick} 
      type={type} 
      disabled={disabled} 
      {...props}
    >
      {children}
    </button>
  )
}

export default ButtonPrimary;
