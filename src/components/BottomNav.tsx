import { MessageCircle, Map, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

type TabId = 'chat' | 'itinerary' | 'documents' | 'presentation';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; icon: typeof Map; label: string }[] = [
  { id: 'presentation', icon: Sparkles, label: 'Love ✨' },
  { id: 'chat', icon: MessageCircle, label: 'Chat' },
  { id: 'itinerary', icon: Map, label: 'Itinerario' },
  { id: 'documents', icon: FileText, label: 'Docs' },
];

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border safe-bottom">
      <div className="max-w-2xl mx-auto flex items-center justify-around px-2 py-2">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`touch-target relative flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-rose-subtle rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className={`text-[10px] relative z-10 font-medium ${isActive ? 'font-semibold' : ''}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
