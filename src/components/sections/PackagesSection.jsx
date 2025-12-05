import { Box, X } from 'lucide-react';
import { Card, Input, Button, EmptyState } from '../ui';

export const PackagesSection = ({ packages, actions }) => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Install Packages</h2>
        </div>

        <Card className="p-6">
            <div className="flex gap-2 mb-6">
                <Input
                    placeholder="e.g. nginx, docker.io, git"
                    value={actions.tempPackage}
                    onChange={(e) => actions.setTempPackage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && actions.addPackage()}
                />
                <Button variant="secondary" onClick={actions.addPackage} disabled={!actions.tempPackage.trim()}>
                    Add
                </Button>
            </div>

            {packages.length === 0 ? (
                <EmptyState
                    icon={Box}
                    text="No packages added"
                    subtext="Add system packages to install on boot."
                />
            ) : (
                <div className="flex flex-wrap gap-2">
                    {packages.map((pkg, i) => (
                        <div key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-md border border-gray-200 group hover:border-gray-300 transition-colors">
                            <span>{pkg}</span>
                            <button onClick={() => actions.removePackage(pkg)} className="text-gray-400 hover:text-red-500 p-0.5 rounded-full">
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    </div>
);
