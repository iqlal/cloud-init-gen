export const Input = ({ className = '', ...props }) => (
    <input
        className={`w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none transition-all focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400 disabled:bg-gray-50 ${className}`}
        {...props}
    />
);
