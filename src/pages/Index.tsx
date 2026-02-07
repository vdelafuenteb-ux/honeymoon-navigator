import { useState } from 'react';
import HeaderStats from '@/components/HeaderStats';
import TimelineView from '@/components/TimelineView';
import BottomNav from '@/components/BottomNav';
import ChatView from '@/components/ChatView';
import DocumentsView from '@/components/DocumentsView';
import EventEditModal from '@/components/EventEditModal';
import { tripStats } from '@/data/mockItinerary';
import { TripEvent } from '@/types/trip';
import { useItinerary } from '@/hooks/useItinerary';
import { motion, AnimatePresence } from 'framer-motion';

type TabId = 'chat' | 'itinerary' | 'documents';

const tabVariants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>('itinerary');
  const [editingEvent, setEditingEvent] = useState<TripEvent | null>(null);
  const { itinerary, uploadReceipt } = useItinerary();

  return (
    <div className="min-h-screen bg-background pb-20">
      <HeaderStats stats={tripStats} />

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
            {activeTab === 'chat' && <ChatView />}
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
