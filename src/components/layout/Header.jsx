import { BookOpen, ExternalLink } from 'lucide-react';

export const Header = () => (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <img src="/cloudy.svg" alt="Cloud Init Gen" className="w-8 h-8" />
                <h1 className="font-bold text-lg tracking-tight">Cloud Init Gen</h1>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-[10px] text-gray-500 font-bold uppercase tracking-wider">Beta</span>
            </div>
            <div className="flex items-center gap-4">
                <a
                    href="https://cloudinit.readthedocs.io/en/latest/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
                >
                    <BookOpen size={16} />
                    cloud-init docs
                    <ExternalLink size={12} className="opacity-40" />
                </a>
            </div>
        </div>
    </header>
);
