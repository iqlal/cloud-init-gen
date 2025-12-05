import { Terminal, Trash2 } from 'lucide-react';
import { Card, Input, Button, EmptyState } from '../ui';

export const ScriptsSection = ({ commands, actions }) => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Run Commands</h2>
        </div>

        <Card className="p-6">
            <div className="flex gap-2 mb-6">
                <div className="relative flex-1 group">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-mono text-sm pointer-events-none select-none group-focus-within:text-black transition-colors">$</span>
                    <Input
                        className="pl-7 font-mono text-sm"
                        placeholder="systemctl restart nginx"
                        value={actions.tempCommand}
                        onChange={(e) => actions.setTempCommand(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && actions.addCommand()}
                    />
                </div>
                <Button variant="secondary" onClick={actions.addCommand} disabled={!actions.tempCommand.trim()}>
                    Add
                </Button>
            </div>

            {commands.length === 0 ? (
                <EmptyState
                    icon={Terminal}
                    text="No commands"
                    subtext="Add shell commands to run on first boot."
                />
            ) : (
                <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white">
                    {commands.map((cmd, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors group">
                            <span className="text-xs font-mono text-gray-400 w-6 text-center select-none">{(i + 1)}</span>
                            <span className="flex-1 font-mono text-sm text-gray-700 break-all">{cmd}</span>
                            <button onClick={() => actions.removeCommand(i)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-1">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    </div>
);
