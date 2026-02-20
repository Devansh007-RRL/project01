import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Camera, 
  Navigation, 
  Settings, 
  Battery, 
  AlertCircle, 
  Mic, 
  ArrowLeft,
  Loader2,
  Volume2,
  Shield
} from "lucide-react";

type Screen = "loading" | "home" | "detection" | "navigation" | "settings";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("loading");
  const [greeting, setGreeting] = useState("Good Evening");
  const [hazardDetected, setHazardDetected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState(50);

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Auto-transition from loading screen
    const timer = setTimeout(() => {
      setCurrentScreen("home");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case "loading":
        return <LoadingScreen />;
      case "home":
        return (
          <HomeScreen
            greeting={greeting}
            onNavigate={setCurrentScreen}
          />
        );
      case "detection":
        return (
          <DetectionScreen
            onBack={() => setCurrentScreen("home")}
            hazardDetected={hazardDetected}
            onToggleHazard={() => setHazardDetected(!hazardDetected)}
            isListening={isListening}
            onToggleListening={() => setIsListening(!isListening)}
          />
        );
      case "navigation":
        return (
          <NavigationScreen
            onBack={() => setCurrentScreen("home")}
            isListening={isListening}
            onToggleListening={() => setIsListening(!isListening)}
          />
        );
      case "settings":
        return (
          <SettingsScreen
            onClose={() => setCurrentScreen("home")}
            voiceSpeed={voiceSpeed}
            onVoiceSpeedChange={setVoiceSpeed}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="size-full overflow-hidden relative">
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E1B18] via-[#2B2622] to-[#3A342F]" />
      
      {/* Subtle ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D6A75C] opacity-[0.03] rounded-full blur-[120px]" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative z-10 size-full"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Loading Screen Component
function LoadingScreen() {
  return (
    <div className="size-full flex flex-col items-center justify-center gap-8 px-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <div className="w-20 h-20 rounded-full border-4 border-[#D6A75C]/20 border-t-[#D6A75C]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D6A75C] to-[#C46A4A] opacity-20" />
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h2 className="text-2xl font-semibold text-[#F4EDE5] mb-2">
          Smart Specs
        </h2>
        <p className="text-[#D9CFC3] opacity-70">
          Initializing System
        </p>
      </motion.div>
    </div>
  );
}

// Home Screen Component
function HomeScreen({ 
  greeting, 
  onNavigate 
}: { 
  greeting: string; 
  onNavigate: (screen: Screen) => void;
}) {
  return (
    <div className="size-full flex flex-col p-6 max-w-2xl mx-auto overflow-y-auto scrollbar-custom">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2"
        >
          <Battery className="w-6 h-6 text-[#7B9E87]" />
          <span className="text-sm text-[#D9CFC3]">92%</span>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => onNavigate("settings")}
          className="w-12 h-12 rounded-[20px] backdrop-blur-xl bg-[rgba(255,245,230,0.06)] border border-[rgba(255,230,200,0.12)] flex items-center justify-center hover:bg-[rgba(255,245,230,0.1)] transition-all shadow-[0_8px_32px_rgba(214,167,92,0.1)]"
        >
          <Settings className="w-5 h-5 text-[#D6A75C]" />
        </motion.button>
      </div>

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-semibold text-[#F4EDE5] mb-2">
          {greeting}
        </h1>
        <p className="text-[#D9CFC3] opacity-70">
          How can I assist you today?
        </p>
      </motion.div>

      {/* Action Cards */}
      <div className="flex-1 flex flex-col gap-6 justify-center">
        <GlassCard
          delay={0.5}
          onClick={() => onNavigate("detection")}
          icon={<Camera className="w-8 h-8" />}
          title="Camera Detection"
          description="Real-time object & hazard identification"
          gradient="from-[#D6A75C] to-[#E7C79F]"
        />

        <GlassCard
          delay={0.6}
          onClick={() => onNavigate("navigation")}
          icon={<Navigation className="w-8 h-8" />}
          title="Voice Navigation"
          description="AI-guided directional assistance"
          gradient="from-[#5C8A8A] to-[#7B9E87]"
        />
      </div>

      {/* SOS Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 w-full h-16 rounded-[24px] backdrop-blur-xl bg-gradient-to-r from-[#C46A4A]/20 to-[#A6523C]/20 border border-[#C46A4A]/30 flex items-center justify-center gap-3 hover:from-[#C46A4A]/30 hover:to-[#A6523C]/30 transition-all shadow-[0_8px_32px_rgba(196,106,74,0.15)]"
      >
        <Shield className="w-5 h-5 text-[#C46A4A]" />
        <span className="text-[#C46A4A] font-medium">Emergency SOS</span>
      </motion.button>
    </div>
  );
}

// Glass Card Component
function GlassCard({ 
  delay, 
  onClick, 
  icon, 
  title, 
  description, 
  gradient 
}: { 
  delay: number;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className="w-full p-8 rounded-[32px] backdrop-blur-xl bg-[rgba(255,245,230,0.06)] border border-[rgba(255,230,200,0.12)] hover:bg-[rgba(255,245,230,0.1)] transition-all text-left shadow-[0_8px_32px_rgba(214,167,92,0.12)] hover:shadow-[0_12px_48px_rgba(214,167,92,0.18)] hover:scale-[1.02]"
    >
      <div className={`w-16 h-16 rounded-[20px] bg-gradient-to-br ${gradient} flex items-center justify-center text-[#1E1B18] mb-4 shadow-[0_4px_24px_rgba(214,167,92,0.25)]`}>
        {icon}
      </div>
      <h3 className="text-2xl font-semibold text-[#F4EDE5] mb-2">
        {title}
      </h3>
      <p className="text-[#D9CFC3] opacity-70">
        {description}
      </p>
    </motion.button>
  );
}

// Detection Screen Component
function DetectionScreen({ 
  onBack, 
  hazardDetected, 
  onToggleHazard,
  isListening,
  onToggleListening
}: { 
  onBack: () => void;
  hazardDetected: boolean;
  onToggleHazard: () => void;
  isListening: boolean;
  onToggleListening: () => void;
}) {
  return (
    <div className="size-full flex flex-col p-6 max-w-2xl mx-auto overflow-y-auto scrollbar-custom">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="w-12 h-12 rounded-[20px] backdrop-blur-xl bg-[rgba(255,245,230,0.06)] border border-[rgba(255,230,200,0.12)] flex items-center justify-center mb-8 hover:bg-[rgba(255,245,230,0.1)] transition-all shadow-[0_8px_32px_rgba(214,167,92,0.1)]"
      >
        <ArrowLeft className="w-5 h-5 text-[#D6A75C]" />
      </motion.button>

      {/* Status Alert Panel */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-[28px] backdrop-blur-xl border mb-8 transition-all ${
          hazardDetected
            ? "bg-[rgba(196,106,74,0.1)] border-[#C46A4A]/30 shadow-[0_8px_32px_rgba(196,106,74,0.2)]"
            : "bg-[rgba(255,245,230,0.06)] border-[rgba(255,230,200,0.12)] shadow-[0_8px_32px_rgba(214,167,92,0.1)]"
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            hazardDetected ? "bg-[#C46A4A]/20" : "bg-[#7B9E87]/20"
          }`}>
            {hazardDetected ? (
              <AlertCircle className="w-6 h-6 text-[#C46A4A]" />
            ) : (
              <Camera className="w-6 h-6 text-[#7B9E87]" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-[#F4EDE5] mb-1">
              {hazardDetected ? "Hazard Detected" : "Scanning Environment"}
            </h3>
            <p className="text-[#D9CFC3] opacity-70 leading-relaxed">
              {hazardDetected 
                ? "Low hanging branch ahead at 2 meters. Proceed with caution."
                : "Camera is actively monitoring your surroundings for obstacles and hazards."}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Camera View Placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex-1 rounded-[32px] backdrop-blur-xl bg-[rgba(255,245,230,0.03)] border border-[rgba(255,230,200,0.08)] flex items-center justify-center mb-8 overflow-hidden relative shadow-[inset_0_4px_24px_rgba(0,0,0,0.3)]"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1E1B18]/40" />
        <div className="relative z-10 text-center">
          <Camera className="w-16 h-16 text-[#D6A75C] opacity-30 mx-auto mb-4" />
          <p className="text-[#D9CFC3] opacity-50">Live Camera Feed</p>
        </div>
      </motion.div>

      {/* Microphone Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        onClick={onToggleListening}
        className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all shadow-[0_12px_48px_rgba(214,167,92,0.3)] ${
          isListening
            ? "bg-gradient-to-br from-[#D6A75C] to-[#C46A4A] scale-110"
            : "bg-gradient-to-br from-[#D6A75C] to-[#E7C79F]"
        }`}
      >
        {isListening ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Mic className="w-10 h-10 text-[#1E1B18]" />
          </motion.div>
        ) : (
          <Mic className="w-10 h-10 text-[#1E1B18]" />
        )}
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-[#D9CFC3] opacity-70 mt-4"
      >
        {isListening ? "Listening..." : "Tap to describe scene"}
      </motion.p>

      {/* Demo Toggle (for testing) */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={onToggleHazard}
        className="mt-6 text-sm text-[#D6A75C] opacity-50 hover:opacity-100 transition-opacity"
      >
        {hazardDetected ? "Clear hazard" : "Simulate hazard"}
      </motion.button>
    </div>
  );
}

// Navigation Screen Component
function NavigationScreen({ 
  onBack,
  isListening,
  onToggleListening
}: { 
  onBack: () => void;
  isListening: boolean;
  onToggleListening: () => void;
}) {
  return (
    <div className="size-full flex flex-col p-6 max-w-2xl mx-auto overflow-y-auto scrollbar-custom">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="w-12 h-12 rounded-[20px] backdrop-blur-xl bg-[rgba(255,245,230,0.06)] border border-[rgba(255,230,200,0.12)] flex items-center justify-center mb-8 hover:bg-[rgba(255,245,230,0.1)] transition-all shadow-[0_8px_32px_rgba(214,167,92,0.1)]"
      >
        <ArrowLeft className="w-5 h-5 text-[#D6A75C]" />
      </motion.button>

      {/* Destination */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <p className="text-sm text-[#D9CFC3] opacity-60 mb-2">Destination</p>
        <h2 className="text-3xl font-semibold text-[#F4EDE5]">
          Central Park West
        </h2>
      </motion.div>

      {/* Current Step Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-8 rounded-[32px] backdrop-blur-xl bg-[rgba(255,245,230,0.06)] border border-[rgba(255,230,200,0.12)] mb-8 shadow-[0_8px_32px_rgba(214,167,92,0.12)]"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5C8A8A] to-[#7B9E87] flex items-center justify-center shadow-[0_4px_24px_rgba(92,138,138,0.25)]">
            <Navigation className="w-8 h-8 text-[#1E1B18]" />
          </div>
          <div>
            <p className="text-sm text-[#D9CFC3] opacity-60">Step 2 of 5</p>
            <p className="text-[#7B9E87]">0.3 miles remaining</p>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-[#F4EDE5] mb-4">
          Turn right onto Broadway
        </h3>
        <p className="text-[#D9CFC3] opacity-70 leading-relaxed">
          Continue for 150 feet, then turn right. There's a crosswalk ahead. 
          Traffic light currently red.
        </p>
      </motion.div>

      {/* Progress Indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex gap-2 mb-8"
      >
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`flex-1 h-2 rounded-full ${
              step <= 2
                ? "bg-gradient-to-r from-[#5C8A8A] to-[#7B9E87]"
                : "bg-[rgba(255,245,230,0.1)]"
            }`}
          />
        ))}
      </motion.div>

      <div className="flex-1" />

      {/* Voice Command Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onToggleListening}
        className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all shadow-[0_12px_48px_rgba(92,138,138,0.3)] ${
          isListening
            ? "bg-gradient-to-br from-[#5C8A8A] to-[#7B9E87] scale-110"
            : "bg-gradient-to-br from-[#5C8A8A] to-[#7B9E87]"
        }`}
      >
        {isListening ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Mic className="w-10 h-10 text-[#1E1B18]" />
          </motion.div>
        ) : (
          <Mic className="w-10 h-10 text-[#1E1B18]" />
        )}
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-[#D9CFC3] opacity-70 mt-4"
      >
        {isListening ? "Listening for command..." : "Tap for voice command"}
      </motion.p>
    </div>
  );
}

// Settings Screen Component
function SettingsScreen({ 
  onClose, 
  voiceSpeed, 
  onVoiceSpeedChange 
}: { 
  onClose: () => void;
  voiceSpeed: number;
  onVoiceSpeedChange: (value: number) => void;
}) {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-50"
    >
      <div className="size-full flex flex-col p-6 max-w-2xl mx-auto overflow-y-auto scrollbar-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold text-[#F4EDE5]">Settings</h2>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-[20px] backdrop-blur-xl bg-[rgba(255,245,230,0.06)] border border-[rgba(255,230,200,0.12)] flex items-center justify-center hover:bg-[rgba(255,245,230,0.1)] transition-all shadow-[0_8px_32px_rgba(214,167,92,0.1)]"
          >
            <ArrowLeft className="w-5 h-5 text-[#D6A75C]" />
          </button>
        </div>

        {/* Settings Cards */}
        <div className="space-y-6">
          {/* Voice Speed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-[28px] backdrop-blur-xl bg-[rgba(255,245,230,0.06)] border border-[rgba(255,230,200,0.12)] shadow-[0_8px_32px_rgba(214,167,92,0.1)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <Volume2 className="w-6 h-6 text-[#D6A75C]" />
              <h3 className="text-xl font-semibold text-[#F4EDE5]">
                Voice Speed
              </h3>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={voiceSpeed}
              onChange={(e) => onVoiceSpeedChange(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer voice-slider"
              style={{
                background: `linear-gradient(to right, #D6A75C ${voiceSpeed}%, rgba(255,245,230,0.1) ${voiceSpeed}%)`
              }}
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm text-[#D9CFC3] opacity-60">Slow</span>
              <span className="text-sm text-[#D9CFC3] opacity-60">Fast</span>
            </div>
          </motion.div>

          {/* Accessibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-[28px] backdrop-blur-xl bg-[rgba(255,245,230,0.06)] border border-[rgba(255,230,200,0.12)] shadow-[0_8px_32px_rgba(214,167,92,0.1)]"
          >
            <h3 className="text-xl font-semibold text-[#F4EDE5] mb-4">
              Accessibility
            </h3>
            <div className="space-y-3">
              <SettingToggle label="High Contrast Mode" enabled={false} />
              <SettingToggle label="Haptic Feedback" enabled={true} />
              <SettingToggle label="Audio Descriptions" enabled={true} />
            </div>
          </motion.div>

          {/* System Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-[28px] backdrop-blur-xl bg-[rgba(255,245,230,0.06)] border border-[rgba(255,230,200,0.12)] shadow-[0_8px_32px_rgba(214,167,92,0.1)]"
          >
            <h3 className="text-xl font-semibold text-[#F4EDE5] mb-4">
              System
            </h3>
            <div className="space-y-2 text-[#D9CFC3]">
              <div className="flex justify-between">
                <span className="opacity-70">Version</span>
                <span>2.4.1</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Battery</span>
                <span className="text-[#7B9E87]">92%</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Storage</span>
                <span>1.2 GB free</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .voice-slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #D6A75C;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(214, 167, 92, 0.4);
        }
        
        .voice-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #D6A75C;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(214, 167, 92, 0.4);
        }
      `}</style>
    </motion.div>
  );
}

// Setting Toggle Component
function SettingToggle({ label, enabled }: { label: string; enabled: boolean }) {
  const [isEnabled, setIsEnabled] = useState(enabled);

  return (
    <button
      onClick={() => setIsEnabled(!isEnabled)}
      className="w-full flex items-center justify-between p-3 rounded-[16px] hover:bg-[rgba(255,245,230,0.05)] transition-all"
    >
      <span className="text-[#F4EDE5]">{label}</span>
      <div
        className={`w-12 h-7 rounded-full transition-all ${
          isEnabled
            ? "bg-gradient-to-r from-[#D6A75C] to-[#E7C79F]"
            : "bg-[rgba(255,245,230,0.1)]"
        }`}
      >
        <motion.div
          animate={{ x: isEnabled ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-5 h-5 rounded-full bg-[#1E1B18] mt-1 shadow-md"
        />
      </div>
    </button>
  );
}