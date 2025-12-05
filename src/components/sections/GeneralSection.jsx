import { Card, Label, Input } from '../ui';

export const GeneralSection = ({ config, updateConfig }) => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
        <h2 className="text-xl font-semibold">Basic Settings</h2>
        <Card className="p-6 space-y-6">
            <div>
                <Label>Hostname</Label>
                <Input
                    placeholder="my-server-instance"
                    value={config.hostname}
                    onChange={(e) => updateConfig('hostname', e.target.value)}
                />
                <p className="mt-1.5 text-xs text-gray-500">The hostname that will be assigned to the instance.</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
                <Label>Package Management</Label>
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="pkg_update"
                        checked={config.package_update}
                        onChange={(e) => updateConfig('package_update', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <label htmlFor="pkg_update" className="text-sm text-gray-700 cursor-pointer select-none">Update packages on first boot</label>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="pkg_upgrade"
                        checked={config.package_upgrade}
                        onChange={(e) => updateConfig('package_upgrade', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <label htmlFor="pkg_upgrade" className="text-sm text-gray-700 cursor-pointer select-none">Upgrade installed packages</label>
                </div>
            </div>
        </Card>
    </div>
);
