import { useState } from 'react';
import HeaderStats from '@/components/HeaderStats';
import TimelineView from '@/components/TimelineView';
import BottomNav from '@/components/BottomNav';
import ChatView from '@/components/ChatView';
import DocumentsView from '@/components/DocumentsView';
import EventEditModal from '@/components/EventEditModal';
import { tripStats, tripItinerary } from '@/data/mockItinerary';
import { TripEvent } from '@/types/trip';

type TabId = 'chat' | 'itinerary' | 'documents';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>('itinerary');
  const [editingEvent, setEditingEvent] = useState<TripEvent | null>(null);

  return (
    <div className="min-h-screen bg-background pb-20">
      <HeaderStats stats={tripStats} />

      <div className="mt-4">
        {activeTab === 'itinerary' && (
          <TimelineView itinerary={tripItinerary} onEditEvent={setEditingEvent} />
        )}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'documents' && <DocumentsView />}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <EventEditModal
        event={editingEvent}
        open={!!editingEvent}
        onClose={() => setEditingEvent(null)}
      />
    </div>
  );
};

export default Index;
