import { Github } from 'lucide-react';

export const Footer = () => (
    <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <span><strong>© 2025 Cloud Init Gen</strong></span>
                    <span className="text-gray-300">•</span>
                    <span><strong>MIT License</strong></span>
                    <span className="text-gray-300">•</span>
                    <span><strong>A cloud-init configuration generator</strong></span>
                </div>

                <div className="flex items-center gap-4">
                    <a
                        href="https://github.com/iqlal"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-gray-600 hover:text-black transition-colors"
                    >
                        <Github size={14} />
                    </a>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 text-xs text-gray-500 space-y-2">
                <p>
                    {/* <strong>Cloud-init License:</strong> Cloud-init is licensed under the GNU General Public License (GPL), either version 3 or any later version. For more information, visit{' '} */}
                    Cloud-init is licensed under both the GPLv3 open source license and the Apache License version 2.0 For more information, visit{' '}

                    <a
                        href="https://cloud-init.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-black underline"
                    >
                        cloud-init
                    </a>.
                </p>
                <p>
                    {/* <strong>Trademarks:</strong> Canonical and Ubuntu are registered trademarks of Canonical Ltd. */}
                    Canonical and Ubuntu are registered trademarks of Canonical Ltd.

                </p>
            </div>
        </div>
    </footer>
);
