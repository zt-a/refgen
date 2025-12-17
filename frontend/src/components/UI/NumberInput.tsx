import React from "react";
import styles from "../../styles/components/UI/NumberInput.module.css";

interface NumberInputProps {
    label?: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
}

const NumberInput: React.FC<NumberInputProps> = ({
    label,
    value,
    onChange,
    min,
    max,
    step = 1,
    ...props
}) => {
    return (
        <div className={styles.inputWrapper}>
            {label && <label className={styles.label}>{label}</label>}
            <input
                type="number"
                className={styles.numberInput}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                min={min}
                max={max}
                step={step}
                {...props}
            />
        </div>
    );
};

export default NumberInput;
