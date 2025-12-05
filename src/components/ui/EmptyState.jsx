export const EmptyState = ({ icon: Icon, text, subtext }) => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
        <div className="p-3 bg-white rounded-full shadow-sm mb-3">
            <Icon className="text-gray-400" size={20} />
        </div>
        <h3 className="text-sm font-medium text-gray-900">{text}</h3>
        {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
);
