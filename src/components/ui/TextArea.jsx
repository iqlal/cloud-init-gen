export const TextArea = ({ className = '', ...props }) => (
    <textarea
        className={`w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none transition-all focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400 min-h-[100px] font-mono break-all ${className}`}
        {...props}
    />
);
