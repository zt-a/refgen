import React from "react";
import styles from "../../styles/components/UI/SelectInput.module.css";

interface SelectInputProps {
    name?: string,
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: { label: string; value: string }[];
}

const SelectInput: React.FC<SelectInputProps> = ({
    name,
    label,
    value,
    onChange,
    options,
    ...props
}) => {
    return (
        <div className={styles.inputWrapper}>
            {label && <label className={styles.label}>{label}</label>}
            <select
                name={name}
                className={styles.select}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectInput;
