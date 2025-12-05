import { Copy, Check, Code } from 'lucide-react';

export const PreviewPanel = ({ yaml, copied, onCopy }) => (
    <aside className="lg:col-span-5 relative hidden lg:block">
        <div className="sticky top-24">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Code size={14} /> Preview
                </h2>
                {copied && (
                    <span className="text-[10px] text-green-600 font-bold bg-green-50 border border-green-100 px-2 py-0.5 rounded-full animate-in fade-in">
                        COPIED
                    </span>
                )}
            </div>

            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-gray-200 to-gray-100 rounded-xl blur-sm opacity-50"></div>
                <div className="relative bg-[#0d0d0d] rounded-xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-140px)] max-h-[600px]">
                    <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-gray-800 select-none">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                        </div>
                        <span className="text-xs text-gray-500 font-mono">user-data</span>
                        <button
                            onClick={onCopy}
                            className="text-gray-400 hover:text-white transition-colors"
                            title="Copy Code"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                        <pre className="font-mono text-sm leading-relaxed">
                            <code className="language-yaml text-[#E1E4E8]">
                                {yaml}
                            </code>
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    </aside>
);
