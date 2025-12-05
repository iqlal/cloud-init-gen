import { Plus, FileText, Trash2 } from 'lucide-react';
import { Card, Label, Input, TextArea, Button, EmptyState } from '../ui';

export const FilesSection = ({ files, actions }) => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Write Files</h2>
            <Button variant="secondary" size="sm" onClick={actions.addFile} className="gap-1.5">
                <Plus size={14} /> Add File
            </Button>
        </div>

        <div className="space-y-4">
            {files.length === 0 && (
                <EmptyState
                    icon={FileText}
                    text="No files configured"
                    subtext="Create configuration files or scripts to be written."
                />
            )}
            {files.map((file, idx) => (
                <Card key={idx} className="p-5 group hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1 grid grid-cols-4 gap-4">
                            <div className="col-span-3">
                                <Label>File Path</Label>
                                <Input
                                    value={file.path}
                                    onChange={(e) => actions.updateFile(idx, 'path', e.target.value)}
                                    placeholder="/etc/nginx/sites-available/default"
                                />
                            </div>
                            <div className="col-span-1">
                                <Label>Perms</Label>
                                <Input
                                    value={file.permissions}
                                    onChange={(e) => actions.updateFile(idx, 'permissions', e.target.value)}
                                    placeholder="0644"
                                />
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => actions.removeFile(idx)} className="mt-6 text-gray-400">
                            <Trash2 size={16} />
                        </Button>
                    </div>
                    <div>
                        <Label>Content</Label>
                        <TextArea
                            value={file.content}
                            onChange={(e) => actions.updateFile(idx, 'content', e.target.value)}
                            placeholder="# File content here..."
                            className="min-h-[150px] font-mono text-xs leading-relaxed"
                        />
                    </div>
                </Card>
            ))}
        </div>
    </div>
);
