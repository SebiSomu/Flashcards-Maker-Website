interface ButtonProps {
    text: string;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

const Button = ({
                    text,
                    onClick,
                    className = "",
                    type = "button",
                    disabled = false
                }: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`btn btn-primary px-8 shadow-lg transition-all hover:scale-105 active:scale-95 ${className} ${disabled ? "opacity-50 cursor-not-allowed hover:scale-100" : ""}`}
        >
            {text}
        </button>
    );
};

export default Button;
