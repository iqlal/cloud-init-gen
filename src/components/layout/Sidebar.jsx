import { Settings, User, Box, FileText, Terminal } from 'lucide-react';

export const Sidebar = ({ activeTab, onTabChange }) => {
    const NavItem = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => onTabChange(id)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all ${activeTab === id
                ? 'bg-gray-100 text-black'
                : 'text-gray-500 hover:text-black hover:bg-gray-50'
                }`}
        >
            <Icon size={16} />
            {label}
        </button>
    );

    return (
        <aside className="lg:col-span-2">
            <nav className="flex flex-col gap-1 sticky top-24">
                <NavItem id="general" label="General" icon={Settings} />
                <NavItem id="users" label="Users & SSH" icon={User} />
                <NavItem id="packages" label="Packages" icon={Box} />
                <NavItem id="files" label="Write Files" icon={FileText} />
                <NavItem id="scripts" label="Run Commands" icon={Terminal} />
            </nav>
        </aside>
    );
};
