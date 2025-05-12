import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

function Home() {
  const [activeTab, setActiveTab] = useState('recording');
  
  // Icon components
  const VideoIcon = getIcon('Video');
  const ClipboardListIcon = getIcon('ClipboardList');
  const FolderKanbanIcon = getIcon('FolderKanban');
  const CommandIcon = getIcon('Command');
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Show toast on tab change for better UX feedback
    if (tab !== activeTab) {
      toast.info(`Switched to ${tab.charAt(0).toUpperCase() + tab.slice(1)} tab`, {
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary p-4 md:p-6">
        <div className="container mx-auto">
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CommandIcon className="h-8 w-8 text-white" />
              <h1 className="text-2xl md:text-3xl font-bold text-white">TestForge</h1>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-surface-800 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap overflow-x-auto scrollbar-hide">
            <TabButton 
              active={activeTab === 'recording'} 
              onClick={() => handleTabChange('recording')}
              icon={<VideoIcon className="w-5 h-5 mr-2" />}
              text="Recording"
            />
            <TabButton 
              active={activeTab === 'testcases'} 
              onClick={() => handleTabChange('testcases')}
              icon={<ClipboardListIcon className="w-5 h-5 mr-2" />}
              text="Test Cases"
            />
            <TabButton 
              active={activeTab === 'suites'} 
              onClick={() => handleTabChange('suites')}
              icon={<FolderKanbanIcon className="w-5 h-5 mr-2" />}
              text="Test Suites"
            />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div variants={itemVariants}>
          {activeTab === 'recording' && (
            <MainFeature />
          )}
          
          {activeTab === 'testcases' && (
            <div className="neu-card">
              <h2 className="text-2xl font-bold mb-4">Test Cases</h2>
              <p className="text-surface-600 dark:text-surface-300">
                Your generated test cases will appear here. 
                Start by recording a session in the Recording tab.
              </p>
            </div>
          )}
          
          {activeTab === 'suites' && (
            <div className="neu-card">
              <h2 className="text-2xl font-bold mb-4">Test Suites</h2>
              <p className="text-surface-600 dark:text-surface-300">
                Organize your test cases into suites for better management.
                Generate test cases first to create suites.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer 
        variants={itemVariants}
        className="bg-surface-800 dark:bg-surface-900 text-white py-6 mt-auto"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-surface-300">© 2023 TestForge. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-surface-300 hover:text-white transition-colors">
                Documentation
              </a>
              <a href="#" className="text-surface-300 hover:text-white transition-colors">
                Support
              </a>
              <a href="#" className="text-surface-300 hover:text-white transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, icon, text }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center py-4 px-6 border-b-2 transition-colors ${
        active 
          ? 'border-primary text-primary dark:border-primary-light dark:text-primary-light font-medium' 
          : 'border-transparent text-surface-500 hover:text-primary hover:border-primary-light'
      }`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}

export default Home;