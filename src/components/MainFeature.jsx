import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

function MainFeature() {
  // Icon Components
  const PlayIcon = getIcon('Play');
  const StopIcon = getIcon('Square');
  const PauseIcon = getIcon('Pause');
  const SaveIcon = getIcon('Save');
  const EditIcon = getIcon('Edit2');
  const TrashIcon = getIcon('Trash2');
  const MonitorIcon = getIcon('Monitor');
  const MousePointerIcon = getIcon('MousePointer');
  const KeyboardIcon = getIcon('Keyboard');
  const FileIcon = getIcon('File');
  const GlobeIcon = getIcon('Globe');

  // State management
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingName, setRecordingName] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingSettings, setRecordingSettings] = useState({
    captureScreen: true,
    captureMouse: true,
    captureKeyboard: true
  });
  const [generatedTests, setGeneratedTests] = useState([]);
  const [isGeneratingTests, setIsGeneratingTests] = useState(false);
  const [nameError, setNameError] = useState('');
  const timerRef = useRef(null);
  const [expandedTest, setExpandedTest] = useState(null);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [recordingSteps, setRecordingSteps] = useState([]);
  const [capturedEvents, setCapturedEvents] = useState([]);

  // Handle recording timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording, isPaused]);

  // Simulate event capture during recording
  useEffect(() => {
    let eventCaptureInterval = null;
    
    if (isRecording && !isPaused) {
      // Clear any existing events when starting a new recording
      if (recordingTime === 0) {
        setCapturedEvents([]); setRecordingSteps([]);
      }
      
      // Start capturing events
      eventCaptureInterval = setInterval(() => {
        captureEvent();
      }, 2000); // Capture a new event every 2 seconds for simulation
    }
    
    return () => {
      if (eventCaptureInterval) clearInterval(eventCaptureInterval);
    };
  }, [isRecording, isPaused, recordingTime]);
  
  // Function to simulate capturing an event
  const captureEvent = () => {
    const eventTypes = ['click', 'type', 'navigation', 'hover', 'focus', 'change', 'submit'];
    const elements = ['button', 'input', 'link', 'dropdown', 'checkbox', 'form', 'image', 'text'];
    
    const newEvent = {
      id: `event-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      element: elements[Math.floor(Math.random() * elements.length)],
      details: `${elements[Math.floor(Math.random() * elements.length)]}-${Math.floor(Math.random() * 100)}`
    };
    
    // Add to captured events and recording steps
    setCapturedEvents(prev => [newEvent, ...prev]);
    
    // Also add more detailed step information for the dashboard
    setRecordingSteps(prev => [...prev, {
      id: newEvent.id,
      ...newEvent,
      stepNumber: prev.length + 1
    }]);
  };

  // Format the timer display
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Show URL modal when starting recording
  const toggleRecording = () => {
    if (!isRecording) {
      // Show URL modal first
      if (!recordingName.trim()) {
        setNameError('Please enter a name for your recording');
        return;
      }
      setNameError('');
      setShowUrlModal(true);
    } else {
      // Stop recording
      handleStopRecording();
      setShowDashboard(true);
    }
  };

  // Validate URL format
  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  // Start recording after URL is provided
  const startRecording = () => {
    // Validate recording name again
    if (!recordingName.trim()) {
      setNameError('Please enter a name for your recording');
      return;
    }
    
    // Validate URL
    if (!url.trim() || !isValidUrl(url)) {
      setUrlError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }
    
    // Start recording with validated inputs
    setShowUrlModal(false);
    setIsRecording(true);
    setIsPaused(false);
    toast.success(`Recording started on ${url}`, { icon: '🎥' });
    
    // Open the URL in a new tab
    setCapturedEvents([]); // Clear previous events
    window.open(url, '_blank');
    
    setShowDashboard(false);
  };

  // Toggle pause status
  const togglePause = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? 'Recording resumed' : 'Recording paused', { 
      autoClose: 2000
    });
  };

  // Handle stop recording and test generation
  const handleStopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    
    // Generate test cases from recording
    setIsGeneratingTests(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate mock tests using the recorded steps
      const newTests = generateMockTests(recordingSteps);
      
      setGeneratedTests(prev => [...newTests, ...prev]);
      setCapturedEvents([]); // Clear events after test generation
      setIsGeneratingTests(false);
      setRecordingTime(0);
      
      toast.success('Test cases generated successfully!', {
        icon: '✅'
      });
    }, 2000);
  };

  // Generate mock test data
  const generateMockTests = (steps = []) => {
    // If we have real steps, use them, otherwise generate random ones
    if (steps.length > 0) {
    const actionTypes = ['click', 'type', 'navigate', 'submit', 'select', 'verify'];
    const selectors = ['button', 'input', 'form', 'dropdown', 'checkbox', 'link', 'element'];
    
    const steps = Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, i) => {
      const action = actionTypes[Math.floor(Math.random() * actionTypes.length)];
      const selector = selectors[Math.floor(Math.random() * selectors.length)];
      
      return {
        id: `step-${Date.now()}-${i}`,
        sequence: i + 1,
        action,
        element: {
          type: selector,
          selector: `#${selector}-${Math.floor(Math.random() * 100)}`,
        },
        description: `${action.charAt(0).toUpperCase() + action.slice(1)} on ${selector}`
      };
    });

    return [{
      id: `test-${Date.now()}`,
      name: recordingName,
      dateCreated: new Date().toISOString(),
      duration: recordingTime,
      steps,
      status: 'new'
    }];
    } else {
      // Convert captured steps to test steps
      const testSteps = recordingSteps.map((step, index) => ({
        id: step.id,
        sequence: index + 1,
        action: step.type,
        element: {
          type: step.element,
          selector: `#${step.element}-${step.details.split('-')[1] || '0'}`,
        },
        details: step.details,
        timestamp: step.timestamp,
        description: `${step.type.charAt(0).toUpperCase() + step.type.slice(1)} on ${step.element}`
      }));
      
      // Create the test case
    return [{
      id: `test-${Date.now()}`,
      name: recordingName,
      dateCreated: new Date().toISOString(),
      duration: recordingTime,
      steps,
      status: 'new'
    }];
    }
  };

  // Toggle a test case expansion
  const toggleTestExpansion = (testId) => {
    setExpandedTest(expandedTest === testId ? null : testId);
  };

  // Toggle recording settings
  const toggleSetting = (setting) => {
    setRecordingSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // Delete a test case
  const deleteTest = (testId, e) => {
    e.stopPropagation();
    setGeneratedTests(prev => prev.filter(test => test.id !== testId));
    toast.info('Test case deleted', { 
      icon: '🗑️',
      autoClose: 2000
    });
  };

  return (
    <div className={`grid grid-cols-1 ${showDashboard ? "lg:grid-cols-1" : "lg:grid-cols-2"} gap-6`}>
      {/* Recording Panel */}
      <motion.div 
        className="neu-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <MonitorIcon className="mr-2 h-6 w-6 text-primary" />
          Screen Recorder
        </h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Recording Name
          </label>
          <input
            type="text"
            value={recordingName}
            onChange={(e) => {
              setRecordingName(e.target.value);
              if (e.target.value.trim()) setNameError('');
            }}
            placeholder="Enter a name for your recording"
            className={`input-field ${nameError ? 'border-red-500 dark:border-red-400' : ''}`}
            disabled={isRecording}
          />
          {nameError && <p className="mt-1 text-sm text-red-500">{nameError}</p>}
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Capture Settings</h3>
          <div className="space-y-3">
            <SettingToggle
              label="Screen Capture"
              icon={<MonitorIcon className="h-5 w-5" />}
              enabled={recordingSettings.captureScreen}
              onChange={() => toggleSetting('captureScreen')}
              disabled={isRecording}
            />
            <SettingToggle
              label="Mouse Actions"
              icon={<MousePointerIcon className="h-5 w-5" />}
              enabled={recordingSettings.captureMouse}
              onChange={() => toggleSetting('captureMouse')}
              disabled={isRecording}
            />
            <SettingToggle
              label="Keyboard Events"
              icon={<KeyboardIcon className="h-5 w-5" />}
              enabled={recordingSettings.captureKeyboard}
              onChange={() => toggleSetting('captureKeyboard')}
              disabled={isRecording}
            />
          </div>
        </div>
        
        <div className="flex flex-col items-center mb-4">
          <div className="text-4xl font-mono font-bold mb-4 bg-surface-100 dark:bg-surface-700 px-6 py-3 rounded-xl">
            {formatTime(recordingTime)}
          </div>

          {/* Event Capture Display */}
          {isRecording && !isPaused && capturedEvents.length > 0 && (
            <div className="w-full mb-4 border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden">
              <div className="bg-surface-100 dark:bg-surface-700 py-2 px-4 border-b border-surface-200 dark:border-surface-700">
                <h3 className="font-medium">Captured Events</h3>
              </div>
              <div className="max-h-48 overflow-y-auto p-2 bg-white dark:bg-surface-800">
                <EventDisplay events={capturedEvents} />
              </div>
            </div>
          )}
          
          {isRecording && !isPaused && capturedEvents.length === 0 && (
            <div className="w-full mb-4 p-4 border border-dashed border-surface-300 dark:border-surface-700 rounded-xl text-center">
              <p className="text-surface-600 dark:text-surface-400">
                Waiting for events...
              </p>
            </div>
          )}
          
          <div className="w-full text-sm text-surface-500 dark:text-surface-400 mb-4">
            {isRecording && !isPaused && (
              <div className="flex items-center justify-center space-x-2">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span>Recording user interactions on {url}</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleRecording}
              className={`btn ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'btn-primary'} flex items-center`}
              disabled={isGeneratingTests}
            >
              {isRecording ? (
                <>
                  <StopIcon className="w-5 h-5 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <PlayIcon className="w-5 h-5 mr-2" />
                  Start Recording
                </>
              )}
            </motion.button>
            
            {isRecording && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePause}
                className="btn bg-yellow-500 hover:bg-yellow-600 text-white flex items-center"
              >
                {isPaused ? (
                  <>
                    <PlayIcon className="w-5 h-5 mr-2" />
                    Resume
                  </>
                ) : (
                  <>
                    <PauseIcon className="w-5 h-5 mr-2" />
                    Pause
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
        
        <div className="mt-4 border-t border-surface-200 dark:border-surface-700 pt-4">
          <p className="text-sm text-surface-500 dark:text-surface-400">
            {isRecording 
              ? isPaused 
                ? "Recording paused. Resume when ready." 
                : "Recording in progress... Click Stop when finished."
              : "Click 'Start Recording' to capture your screen and generate test cases."}
          </p>
        </div>
      </motion.div>
      
      {/* Recording Dashboard - Shows after recording is complete */}
      {showDashboard && recordingSteps.length > 0 && (
        <motion.div
          className="neu-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <FileIcon className="mr-2 h-6 w-6 text-primary" />
              Recording Dashboard
            </h2>
            <button
              onClick={() => setShowDashboard(false)}
              className="btn btn-outline text-sm"
            >
              Back to Recording
            </button>
          </div>
          
          <div className="mb-4 p-4 bg-surface-100 dark:bg-surface-700 rounded-xl">
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="font-medium">Recording:</span> {recordingName}
              </div>
              <div>
                <span className="font-medium">Target:</span> {url}
              </div>
              <div>
                <span className="font-medium">Duration:</span> {formatTime(recordingTime)}
              </div>
              <div>
                <span className="font-medium">Steps:</span> {recordingSteps.length}
              </div>
            </div>
          </div>
          
          <div className="recording-steps-timeline mb-6">
            <h3 className="text-lg font-medium mb-4">Recording Steps</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {recordingSteps.map((step, index) => (
                <div key={step.id} className="step-item flex p-3 bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 step-item-animation">
                  <div className="step-number flex-shrink-0 w-10 h-10 bg-primary bg-opacity-10 dark:bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary dark:text-primary-light font-medium">{index + 1}</span>
                  </div>
                  <div className="step-content flex-grow">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{step.type.charAt(0).toUpperCase() + step.type.slice(1)} Action</h4>
                      <span className="text-xs text-surface-500 dark:text-surface-400">{new Date(step.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="mt-1">Element: <span className="font-medium">{step.element}</span></div>
                    <div className="text-sm text-surface-500 dark:text-surface-400 mt-1">Details: {step.details}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </motion.div>
      )}
      
      {/* Generated Test Cases Panel */}
      <motion.div 
        className="neu-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FileIcon className="mr-2 h-6 w-6 text-primary" />
          Generated Test Cases
        </h2>
        
        {isGeneratingTests && (
          <div className="p-8 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-surface-600 dark:text-surface-300">Generating test cases from your recording...</p>
          </div>
        )}
        
        {!isGeneratingTests && generatedTests.length === 0 && (
          <div className="p-8 text-center border-2 border-dashed border-surface-300 dark:border-surface-700 rounded-xl">
            <p className="text-surface-600 dark:text-surface-300 mb-2">No test cases generated yet</p>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              Record your first session to generate test cases automatically
            </p>
          </div>
        )}
        
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
          <AnimatePresence>
            {generatedTests.map((test) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden"
              >
                <div 
                  className={`p-4 cursor-pointer ${
                    expandedTest === test.id 
                      ? 'bg-primary bg-opacity-10 dark:bg-primary-dark dark:bg-opacity-20' 
                      : 'bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700'
                  }`}
                  onClick={() => toggleTestExpansion(test.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs rounded-full mr-3 ${
                        test.status === 'new' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {test.status === 'new' ? 'New' : 'Verified'}
                      </span>
                      <h3 className="font-medium">{test.name}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info('Edit functionality coming soon!');
                        }}
                        className="p-2 text-surface-500 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light"
                      >
                        <EditIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => deleteTest(test.id, e)}
                        className="p-2 text-surface-500 hover:text-red-500 dark:text-surface-400 dark:hover:text-red-400"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-surface-500 dark:text-surface-400 flex flex-wrap gap-x-4">
                    <span>{new Date(test.dateCreated).toLocaleString()}</span>
                    <span>{formatTime(test.duration)} duration</span>
                    <span>{test.steps.length} steps</span>
                  </div>
                </div>
                
                {expandedTest === test.id && (
                  <div className="border-t border-surface-200 dark:border-surface-700 p-4 bg-surface-50 dark:bg-surface-800">
                    <h4 className="font-medium mb-3">Test Steps:</h4>
                    <div className="space-y-2">
                      {test.steps.map((step) => (
                        <div 
                          key={step.id} 
                          className="p-3 bg-white dark:bg-surface-700 rounded-lg border border-surface-200 dark:border-surface-600 flex items-center"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-primary bg-opacity-10 dark:bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                            <span className="text-primary dark:text-primary-light font-medium">
                              {step.sequence}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{step.description}</div>
                            <div className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                              {step.element.selector}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button 
                        className="btn btn-outline flex items-center text-sm"
                        onClick={() => {
                          toast.success('Test case saved!');
                        }}
                      >
                        <SaveIcon className="w-4 h-4 mr-2" />
                        Save Test Case
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* URL Input Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white dark:bg-surface-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center">
                <GlobeIcon className="mr-2 h-5 w-5 text-primary" />
                Enter URL to Record
              </h3>
              <button 
                onClick={() => setShowUrlModal(false)}
                className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (e.target.value.trim()) setUrlError('');
                }}
                placeholder="https://example.com"
                className={`input-field ${urlError ? 'border-red-500 dark:border-red-400' : ''}`}
                autoFocus
              />
              {urlError && <p className="mt-1 text-sm text-red-500">{urlError}</p>}
              <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
                Enter the URL of the website you want to test
              </p>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowUrlModal(false)}
                className="btn bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-100 hover:bg-surface-300 dark:hover:bg-surface-600"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startRecording}
                className="btn btn-primary"
              >
                Start Recording
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Setting Toggle Component
function SettingToggle({ label, icon, enabled, onChange, disabled }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${
      enabled 
        ? 'border-primary bg-primary bg-opacity-5 dark:border-primary-light dark:bg-primary-dark dark:bg-opacity-10' 
        : 'border-surface-200 dark:border-surface-700'
    } ${disabled ? 'opacity-60' : 'cursor-pointer'}`}
    onClick={disabled ? null : onChange}
    >
      <div className="flex items-center">
        <div className={`mr-3 ${enabled ? 'text-primary dark:text-primary-light' : 'text-surface-500 dark:text-surface-400'}`}>
          {icon}
        </div>
        <span className="font-medium">{label}</span>
      </div>
      <div className={`relative w-10 h-5 rounded-full transition-colors ${
        enabled ? 'bg-primary dark:bg-primary-light' : 'bg-surface-300 dark:bg-surface-600'
      }`}>
        <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
          enabled ? 'translate-x-5' : ''
        }`}></div>
      </div>
    </div>
  );
}

// Event Display Component
function EventDisplay({ events }) {
  // Group events by type
  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.type]) {
      acc[event.type] = [];
    }
    acc[event.type].push(event);
    return acc;
  }, {});

  // Get event icon based on event type
  const getEventIcon = (type) => {
    const icons = {
      click: "MousePointer",
      type: "Keyboard",
      navigation: "Navigation",
      hover: "Move",
      focus: "Target",
      change: "RefreshCw",
      submit: "Send"
    };
    return getIcon(icons[type] || "Activity");
  };

  return (
    <div className="space-y-2">
      {Object.entries(groupedEvents).map(([type, typeEvents]) => (
        <div key={type} className="mb-3">
          <div className="flex items-center mb-1 text-xs font-medium text-surface-500 dark:text-surface-400">
            {React.createElement(getEventIcon(type), { className: "h-3 w-3 mr-1" })}
            <span className="uppercase">{type} Events</span>
          </div>
          
          {typeEvents.map(event => (
            <div 
              key={event.id} 
              className="px-3 py-2 bg-surface-50 dark:bg-surface-700 rounded border border-surface-200 dark:border-surface-600 text-sm mb-1 animate-fadeIn"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{event.element}</span>
                <span className="text-xs text-surface-500 dark:text-surface-400">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                {event.details}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default MainFeature;