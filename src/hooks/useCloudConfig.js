import { useState } from 'react';

export const useCloudConfig = () => {
    const [config, setConfig] = useState({
        hostname: '',
        package_update: true,
        package_upgrade: true,
        packages: [],
        users: [{ name: 'user', groups: 'sudo', shell: '/bin/bash', ssh_authorized_keys: [], plain_passwd: '' }],
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
            users: [...prev.users, { name: '', groups: 'sudo', shell: '/bin/bash', ssh_authorized_keys: [], plain_passwd: '' }]
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
                if (u.plain_passwd) yaml += `    plain_passwd: '${u.plain_passwd}'\n`;
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
