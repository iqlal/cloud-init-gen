import { Plus, Trash2 } from 'lucide-react';
import { Card, Label, Input, TextArea, Button } from '../ui';

export const UsersSection = ({ users, actions }) => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Users & Access</h2>
            <Button variant="secondary" size="sm" onClick={actions.addUser} className="gap-1.5">
                <Plus size={14} /> Add User
            </Button>
        </div>

        <div className="space-y-4">
            {users.map((user, idx) => (
                <Card key={idx} className="p-5 relative group transition-all hover:shadow-md">
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => actions.removeUser(idx)} title="Remove user">
                            <Trash2 size={16} />
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 pr-8">
                            <div>
                                <Label>Username</Label>
                                <Input
                                    value={user.name}
                                    onChange={(e) => actions.updateUser(idx, 'name', e.target.value)}
                                    placeholder="ubuntu"
                                />
                            </div>
                            <div>
                                <Label>Groups</Label>
                                <Input
                                    value={user.groups}
                                    onChange={(e) => actions.updateUser(idx, 'groups', e.target.value)}
                                    placeholder="sudo, docker"
                                />
                            </div>
                        </div>
                        <div>
                            <Label>SSH Authorized Key (Public)</Label>
                            <TextArea
                                className="font-mono text-xs min-h-[80px] leading-relaxed"
                                placeholder={`ssh-rsa AAAAB3Nza...\n(One key per line)`}
                                value={user.ssh_authorized_keys ? user.ssh_authorized_keys.join('\n') : ''}
                                onChange={(e) => actions.updateUser(idx, 'ssh_key', e.target.value)}
                            />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    </div>
);
