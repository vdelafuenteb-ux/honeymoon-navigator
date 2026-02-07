import { TripCountry } from '@/types/trip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EventCard from './EventCard';
import { TripEvent } from '@/types/trip';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface TimelineViewProps {
  itinerary: TripCountry[];
  onEditEvent?: (event: TripEvent) => void;
}

const TimelineView = ({ itinerary, onEditEvent }: TimelineViewProps) => {
  return (
    <div className="px-4 pb-24 max-w-2xl mx-auto">
      <Accordion type="single" collapsible className="space-y-3">
        {itinerary.map((country) => {
          const totalEvents = country.days.reduce((sum, d) => sum + d.events.length, 0);
          const confirmedEvents = country.days.reduce(
            (sum, d) => sum + d.events.filter(e => e.status === 'confirmed').length, 0
          );

          return (
            <AccordionItem
              key={country.country}
              value={country.country}
              className="glass-card rounded-2xl overflow-hidden border-0"
            >
              <AccordionTrigger className="px-4 py-4 hover:no-underline [&[data-state=open]>div>.chevron]:rotate-90">
                <div className="flex items-center gap-3 w-full">
                  <span className="text-2xl">{country.flag}</span>
                  <div className="flex-1 text-left">
                    <h3 className="font-display text-lg font-semibold text-foreground">{country.country}</h3>
                    <p className="text-xs text-muted-foreground">{country.dateRange} · {totalEvents} eventos</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-status-confirmed rounded-full transition-all"
                        style={{ width: `${totalEvents > 0 ? (confirmedEvents / totalEvents) * 100 : 0}%` }}
                      />
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground chevron transition-transform duration-200" />
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4">
                <DayAccordion country={country} onEditEvent={onEditEvent} />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

const DayAccordion = ({ country, onEditEvent }: { country: TripCountry; onEditEvent?: (event: TripEvent) => void }) => {
  const [openDay, setOpenDay] = useState<string | undefined>(undefined);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <Accordion type="single" collapsible value={openDay} onValueChange={setOpenDay} className="space-y-2">
      {country.days.map((day) => (
        <AccordionItem key={day.date} value={day.date} className="border border-border rounded-xl overflow-hidden bg-background/50">
          <AccordionTrigger className="px-3 py-2.5 hover:no-underline text-sm">
            <div className="flex items-center gap-2 w-full">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <span className="text-xs font-bold text-secondary-foreground">
                  {new Date(day.date + 'T12:00:00').getDate()}
                </span>
              </div>
              <span className="font-medium text-foreground capitalize">{formatDate(day.date)}</span>
              <span className="ml-auto text-xs text-muted-foreground">{day.events.length} eventos</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
            <div className="space-y-2">
              {day.events.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} onEdit={onEditEvent} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default TimelineView;
