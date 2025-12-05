import React, { useState } from 'react';
import { Copy, Check, Plus, Trash2, FileText, User, Box, Terminal, Server, Settings, Code, X, ExternalLink, BookOpen } from 'lucide-react';

/**
 * ----------------------------------------------------------------------------
 * 1. UI COMPONENTS (Reusable)
 * Di project lokal, pindahkan ini ke folder: src/components/ui/
 * ----------------------------------------------------------------------------
 */

const Card = ({ children, className = '' }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const Label = ({ children }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1.5">
    {children}
  </label>
);

const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none transition-all focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400 disabled:bg-gray-50 ${className}`}
    {...props}
  />
);

const TextArea = ({ className = '', ...props }) => (
  <textarea
    className={`w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none transition-all focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400 min-h-[100px] font-mono break-all ${className}`}
    {...props}
  />
);

const Button = ({ children, variant = 'primary', size = 'default', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed";

  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    icon: "p-2"
  };

  const variants = {
    primary: "bg-black text-white hover:bg-gray-800 border border-transparent",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-black hover:border-gray-300",
    danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50",
    ghost: "bg-transparent text-gray-400 hover:text-red-600 hover:bg-red-50"
  };

  return (
    <button className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const EmptyState = ({ icon: Icon, text, subtext }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
    <div className="p-3 bg-white rounded-full shadow-sm mb-3">
      <Icon className="text-gray-400" size={20} />
    </div>
    <h3 className="text-sm font-medium text-gray-900">{text}</h3>
    {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
  </div>
);

/**
 * ----------------------------------------------------------------------------
 * 2. CUSTOM HOOK (Business Logic)
 * Di project lokal, pindahkan ini ke folder: src/hooks/useCloudConfig.js
 * ----------------------------------------------------------------------------
 */
const useCloudConfig = () => {
  const [config, setConfig] = useState({
    hostname: '',
    package_update: true,
    package_upgrade: true,
    packages: [],
    users: [{ name: 'user', groups: 'sudo', shell: '/bin/bash', ssh_authorized_keys: [] }],
    write_files: [],
    runcmd: []
  });

  // State local untuk input sementara
  const [tempPackage, setTempPackage] = useState('');
  const [tempCommand, setTempCommand] = useState('');

  // --- Actions ---

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // User Actions
  const addUser = () => {
    setConfig(prev => ({
      ...prev,
      users: [...prev.users, { name: '', groups: 'sudo', shell: '/bin/bash', ssh_authorized_keys: [] }]
    }));
  };

  const removeUser = (index) => {
    setConfig(prev => ({ ...prev, users: prev.users.filter((_, i) => i !== index) }));
  };

  const updateUser = (index, field, value) => {
    const newUsers = [...config.users];
    if (field === 'ssh_key') {
      newUsers[index].ssh_authorized_keys = value.split('\n');
    } else {
      newUsers[index][field] = value;
    }
    setConfig(prev => ({ ...prev, users: newUsers }));
  };

  // Package Actions
  const addPackage = () => {
    if (!tempPackage.trim()) return;
    if (config.packages.includes(tempPackage.trim())) {
      setTempPackage(''); return;
    }
    setConfig(prev => ({ ...prev, packages: [...prev.packages, tempPackage.trim()] }));
    setTempPackage('');
  };

  const removePackage = (pkgName) => {
    setConfig(prev => ({ ...prev, packages: prev.packages.filter(p => p !== pkgName) }));
  };

  // File Actions
  const addFile = () => {
    setConfig(prev => ({
      ...prev,
      write_files: [...prev.write_files, { path: '/etc/example.conf', content: '# Configuration content', permissions: '0644' }]
    }));
  };

  const removeFile = (index) => {
    setConfig(prev => ({ ...prev, write_files: prev.write_files.filter((_, i) => i !== index) }));
  };

  const updateFile = (index, field, value) => {
    const newFiles = [...config.write_files];
    newFiles[index][field] = value;
    setConfig(prev => ({ ...prev, write_files: newFiles }));
  };

  // Command Actions
  const addCommand = () => {
    if (!tempCommand.trim()) return;
    setConfig(prev => ({ ...prev, runcmd: [...prev.runcmd, tempCommand] }));
    setTempCommand('');
  };

  const removeCommand = (index) => {
    setConfig(prev => ({ ...prev, runcmd: prev.runcmd.filter((_, i) => i !== index) }));
  };

  // Generator Logic
  const generateYAML = () => {
    let yaml = `#cloud-config\n`;

    // 1. General
    if (config.hostname) yaml += `hostname: ${config.hostname}\n`;
    yaml += `package_update: ${config.package_update}\n`;
    yaml += `package_upgrade: ${config.package_upgrade}\n`;

    // 2. Users
    if (config.users.length > 0) {
      yaml += `users:\n`;
      config.users.forEach(u => {
        if (!u.name) return;
        yaml += `  - name: ${u.name}\n`;
        if (u.groups) yaml += `    groups: ${u.groups}\n`;
        if (u.shell) yaml += `    shell: ${u.shell}\n`;
        yaml += `    sudo: ['ALL=(ALL) NOPASSWD:ALL']\n`;

        const validKeys = u.ssh_authorized_keys.filter(k => k && k.trim() !== '');
        if (validKeys.length > 0) {
          yaml += `    ssh_authorized_keys:\n`;
          validKeys.forEach(k => {
            yaml += `      - ${k.trim()}\n`;
          });
        }
      });
    }

    // 3. Packages
    if (config.packages.length > 0) {
      yaml += `packages:\n`;
      config.packages.forEach(p => { yaml += `  - ${p}\n`; });
    }

    // 4. Files
    if (config.write_files.length > 0) {
      yaml += `write_files:\n`;
      config.write_files.forEach(f => {
        yaml += `  - path: ${f.path}\n`;
        if (f.permissions) yaml += `    permissions: '${f.permissions}'\n`;
        const contentLines = f.content.split('\n');
        if (contentLines.length > 1) {
          yaml += `    content: |\n`;
          contentLines.forEach(line => { yaml += `      ${line}\n`; });
        } else {
          yaml += `    content: ${f.content}\n`;
        }
      });
    }

    // 5. RunCMD
    if (config.runcmd.length > 0) {
      yaml += `runcmd:\n`;
      config.runcmd.forEach(cmd => { yaml += `  - ${cmd}\n`; });
    }

    return yaml;
  };

  return {
    config,
    updateConfig,
    userActions: { addUser, removeUser, updateUser },
    pkgActions: { addPackage, removePackage, tempPackage, setTempPackage },
    fileActions: { addFile, removeFile, updateFile },
    cmdActions: { addCommand, removeCommand, tempCommand, setTempCommand },
    generateYAML
  };
};

/**
 * ----------------------------------------------------------------------------
 * 3. SECTION COMPONENTS (Feature Logic)
 * Di project lokal, pindahkan ini ke folder: src/components/sections/
 * ----------------------------------------------------------------------------
 */

const GeneralSection = ({ config, updateConfig }) => (
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

const UsersSection = ({ users, actions }) => (
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

const PackagesSection = ({ packages, actions }) => (
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

const FilesSection = ({ files, actions }) => (
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

const ScriptsSection = ({ commands, actions }) => (
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


/**
 * ----------------------------------------------------------------------------
 * 4. MAIN APP COMPONENT (Orchestrator)
 * ----------------------------------------------------------------------------
 */
export default function CloudInitGenerator() {
  const [activeTab, setActiveTab] = useState('general');
  const [copied, setCopied] = useState(false);

  // Menggunakan Custom Hook
  const {
    config,
    updateConfig,
    userActions,
    pkgActions,
    fileActions,
    cmdActions,
    generateYAML
  } = useCloudConfig();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateYAML());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const NavItem = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
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
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-black selection:text-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white shadow-sm">
              <Server size={18} />
            </div>
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
              Documentation
              <ExternalLink size={12} className="opacity-40" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Sidebar */}
        <aside className="lg:col-span-2">
          <nav className="flex flex-col gap-1 sticky top-24">
            <NavItem id="general" label="General" icon={Settings} />
            <NavItem id="users" label="Users & SSH" icon={User} />
            <NavItem id="packages" label="Packages" icon={Box} />
            <NavItem id="files" label="Write Files" icon={FileText} />
            <NavItem id="scripts" label="Run Commands" icon={Terminal} />
          </nav>
        </aside>

        {/* Content Area */}
        <section className="lg:col-span-5 space-y-6 pb-20">
          {activeTab === 'general' && (
            <GeneralSection config={config} updateConfig={updateConfig} />
          )}

          {activeTab === 'users' && (
            <UsersSection users={config.users} actions={userActions} />
          )}

          {activeTab === 'packages' && (
            <PackagesSection packages={config.packages} actions={pkgActions} />
          )}

          {activeTab === 'files' && (
            <FilesSection files={config.write_files} actions={fileActions} />
          )}

          {activeTab === 'scripts' && (
            <ScriptsSection commands={config.runcmd} actions={cmdActions} />
          )}
        </section>

        {/* Live Preview Panel */}
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
                    onClick={copyToClipboard}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Copy Code"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>

                <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                  <pre className="font-mono text-sm leading-relaxed">
                    <code className="language-yaml text-[#E1E4E8]">
                      {generateYAML()}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}