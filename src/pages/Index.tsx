import { useState, useMemo } from 'react';
import HeaderStats from '@/components/HeaderStats';
import TimelineView from '@/components/TimelineView';
import BottomNav from '@/components/BottomNav';
import ChatView from '@/components/ChatView';
import DocumentsView from '@/components/DocumentsView';
import EventEditModal from '@/components/EventEditModal';
import PresentationView from '@/components/presentation/PresentationView';
import TripSetupModal from '@/components/TripSetupModal';
import { TripEvent, TripStats } from '@/types/trip';
import { useItinerary } from '@/hooks/useItinerary';
import { useTripConfig } from '@/hooks/useTripConfig';
import { motion, AnimatePresence } from 'framer-motion';

type TabId = 'chat' | 'itinerary' | 'documents' | 'presentation';

const tabVariants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>('itinerary');
  const [editingEvent, setEditingEvent] = useState<TripEvent | null>(null);
  const { itinerary, uploadReceipt, addEvent } = useItinerary();
  const { config, setConfig, isConfigured, totalDays, daysRemaining } = useTripConfig();

  const stats = useMemo<TripStats>(() => {
    const allEvents = itinerary.flatMap(c => c.days.flatMap(d => d.events));
    const confirmed = allEvents.filter(e => e.status === 'confirmed');
    const budgetEst = allEvents.reduce((s, e) => s + (e.cost_estimated || 0), 0);
    const budgetSpent = allEvents.reduce((s, e) => s + (e.cost_actual || e.cost_estimated || 0), 0);
    return {
      totalDays,
      daysRemaining,
      budgetEstimated: budgetEst,
      budgetSpent,
      percentConfirmed: allEvents.length > 0 ? Math.round((confirmed.length / allEvents.length) * 100) : 0,
      countriesCount: itinerary.length,
      eventsCount: allEvents.length,
    };
  }, [itinerary, totalDays, daysRemaining]);

  // Show setup if not configured
  if (!isConfigured) {
    return <TripSetupModal open config={config} onSave={setConfig} />;
  }

  // Presentation mode is fullscreen
  if (activeTab === 'presentation') {
    return (
      <PresentationView
        itinerary={itinerary}
        stats={stats}
        coupleNames={config.coupleNames}
        onBack={() => setActiveTab('itinerary')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <HeaderStats stats={stats} coupleNames={config.coupleNames} onEditConfig={() => setConfig({ startDate: null })} />

      <div className="mt-4 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {activeTab === 'itinerary' && (
              <TimelineView itinerary={itinerary} onEditEvent={setEditingEvent} />
            )}
            {activeTab === 'chat' && <ChatView itinerary={itinerary} onAddEvent={addEvent} />}
            {activeTab === 'documents' && <DocumentsView />}
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <EventEditModal
        event={editingEvent}
        open={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        onUploadReceipt={uploadReceipt}
      />
    </div>
  );
};

export default Index;
