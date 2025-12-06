import React from 'react';
import { Monitor } from 'lucide-react';

export const MobileOverlay = () => {
    const [isMobile, setIsMobile] = React.useState(() => window.innerWidth < 1024);

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isMobile) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-8 text-center space-y-4">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gray-100 rounded-full">
                        <Monitor size={32} className="text-gray-700" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Desktop Only</h2>
                <p className="text-gray-600">
                    This application is optimized for desktop use. Please open it on a larger screen (1024px or wider) for the best experience.
                </p>
                <p className="text-sm text-gray-500">
                    Screen width: {window.innerWidth}px
                </p>
            </div>
        </div>
    );
};
