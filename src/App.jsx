import React, { useState } from 'react';
import { useCloudConfig } from './hooks/useCloudConfig';
import { Header, Sidebar, PreviewPanel, Footer } from './components/layout';
import {
  GeneralSection,
  UsersSection,
  PackagesSection,
  FilesSection,
  ScriptsSection
} from './components/sections';

export default function CloudInitGenerator() {
  const [activeTab, setActiveTab] = useState('general');
  const [copied, setCopied] = useState(false);

  // Using Custom Hook
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

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-black selection:text-white flex flex-col">
      {/* Header */}
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

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
        <PreviewPanel
          yaml={generateYAML()}
          copied={copied}
          onCopy={copyToClipboard}
        />

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}