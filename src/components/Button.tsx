interface ButtonProps {
    text: string;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
}


const Button = ({
                    text,
                    onClick,
                    className = "",
                    type = "button"
                }: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`btn btn-primary px-8 shadow-lg transition-all hover:scale-105 active:scale-95 ${className}`}
        >
            {text}
        </button>
    );
};

export default Button;