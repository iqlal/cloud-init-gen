export const Button = ({ children, variant = 'primary', size = 'default', className = '', ...props }) => {
    const baseStyle = "inline-flex items-center justify-center font-medium transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed";

    const sizes = {
        default: "px-4 py-2 text-sm",
        sm: "px-3 py-1.5 text-xs",
        icon: "p-2"
    };

    const variants = {
        primary: "bg-black text-white hover:bg-gray-800 border border-transparent",
        secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-black hover:border-gray-300",
        danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50",
        ghost: "bg-transparent text-gray-400 hover:text-red-600 hover:bg-red-50"
    };

    return (
        <button className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};
