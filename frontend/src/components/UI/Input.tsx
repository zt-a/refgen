import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "../../styles/components/UI/Input.module.css";

type InputProps = {
  name?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
};

const Input: React.FC<InputProps> = ({ name, value, onChange, placeholder, type = "text", required, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [borderColor, setBorderColor] = useState("#ccc"); // начальный цвет
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  const handleFocus = () => {
    const colors = ["#b700ff", "#0ea5e9"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setBorderColor(randomColor);
  };

  const handleBlur = () => {
    setBorderColor("#ccc"); // возвращаем обычный цвет
  };

  return (
    <div className={styles.wrapper} style={{ borderColor }}>
      <input
        className={styles.input}
        name={name}
        type={inputType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {isPassword && (
        <div
          className={styles.eyeContainer}
          onClick={() => setShowPassword(!showPassword)}
          onMouseDown={(e) => e.preventDefault()}
        >
          {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
        </div>
      )}
    </div>
  );
};

export default Input;
