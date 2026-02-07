
-- Create events table
CREATE TABLE public.trip_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('flight', 'hotel', 'activity', 'food', 'transport')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed')),
  title TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  attachment_url TEXT,
  datetime_start TIMESTAMPTZ NOT NULL,
  datetime_end TIMESTAMPTZ,
  notes TEXT DEFAULT '',
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('user_chat', 'file_parsed', 'manual')),
  cost_estimated NUMERIC,
  cost_actual NUMERIC,
  currency TEXT DEFAULT 'USD',
  country TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.trip_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own events" ON public.trip_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own events" ON public.trip_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own events" ON public.trip_events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own events" ON public.trip_events FOR DELETE USING (auth.uid() = user_id);

-- Allow public read for now (no auth yet, demo mode)
CREATE POLICY "Allow public read for demo" ON public.trip_events FOR SELECT USING (true);
CREATE POLICY "Allow public insert for demo" ON public.trip_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for demo" ON public.trip_events FOR UPDATE USING (true);

-- Create documents table
CREATE TABLE public.trip_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.trip_events(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  verified BOOLEAN DEFAULT false,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.trip_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read documents" ON public.trip_documents FOR SELECT USING (true);
CREATE POLICY "Public insert documents" ON public.trip_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update documents" ON public.trip_documents FOR UPDATE USING (true);

-- Storage bucket for receipts
INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', true);

CREATE POLICY "Anyone can upload receipts" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'receipts');
CREATE POLICY "Anyone can view receipts" ON storage.objects FOR SELECT USING (bucket_id = 'receipts');

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_trip_events_updated_at
BEFORE UPDATE ON public.trip_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
