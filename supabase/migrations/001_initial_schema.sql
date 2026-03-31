-- =============================================
-- KAUSHAL-ID PLATFORM — SUPABASE DATABASE SCHEMA
-- =============================================
-- Run this in your Supabase SQL Editor to set up all tables.
-- https://supabase.com/dashboard → SQL Editor

-- =============================================
-- 1. PROFILES (extends Supabase auth.users)
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('customer', 'agent', 'worker')),
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Public profiles are viewable by everyone (for marketplace)
CREATE POLICY "Public profiles are viewable"
  ON public.profiles FOR SELECT
  USING (role = 'worker');

-- =============================================
-- 2. WORKERS
-- =============================================
CREATE TABLE public.workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kaushal_id TEXT UNIQUE NOT NULL, -- e.g. KID-2026-0001
  skill TEXT NOT NULL,
  experience_years INTEGER DEFAULT 0,
  location TEXT,
  safety_score INTEGER DEFAULT 0 CHECK (safety_score >= 0 AND safety_score <= 100),
  rating NUMERIC(2,1) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  repeat_hire_rate INTEGER DEFAULT 0,
  amortization_paid INTEGER DEFAULT 0, -- in INR
  is_active BOOLEAN DEFAULT FALSE,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workers are viewable by everyone"
  ON public.workers FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Workers can update their own record"
  ON public.workers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Workers can insert their own record"
  ON public.workers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 3. AGENTS (Hardware Stores)
-- =============================================
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  location TEXT,
  phone TEXT,
  workers_vouched INTEGER DEFAULT 0,
  total_commission INTEGER DEFAULT 0, -- in INR
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents are viewable by everyone"
  ON public.agents FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Agents can update their own record"
  ON public.agents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Agents can insert their own record"
  ON public.agents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 4. VERIFICATIONS
-- =============================================
CREATE TABLE public.verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id),

  -- Verification statuses
  aadhaar_verified BOOLEAN DEFAULT FALSE,
  aadhaar_verified_at TIMESTAMPTZ,

  police_verified BOOLEAN DEFAULT FALSE,
  police_verified_at TIMESTAMPTZ,
  police_clearance_number TEXT,

  store_vouched BOOLEAN DEFAULT FALSE,
  store_vouched_at TIMESTAMPTZ,
  store_name TEXT,

  -- Skill verification
  skill_verified BOOLEAN DEFAULT FALSE,
  skill_verified_at TIMESTAMPTZ,
  skill_verified_by TEXT, -- 'agent' or 'test'

  -- Digital signature
  digital_signature TEXT,
  verified_by_name TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Verifications are viewable by everyone"
  ON public.verifications FOR SELECT
  USING (TRUE);

CREATE POLICY "Agents can update verifications"
  ON public.verifications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.agents
      WHERE public.agents.id = public.verifications.agent_id
      AND public.agents.user_id = auth.uid()
    )
  );

CREATE POLICY "Agents can insert verifications"
  ON public.verifications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.agents
      WHERE public.agents.user_id = auth.uid()
    )
  );

-- =============================================
-- 5. REVIEWS
-- =============================================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  service_type TEXT, -- e.g. 'electrician', 'plumber'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (TRUE);

CREATE POLICY "Customers can create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = customer_id);

-- =============================================
-- 6. BOOKINGS
-- =============================================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  service_type TEXT,
  discovery_fee_paid BOOLEAN DEFAULT FALSE,
  service_commission NUMERIC(5,2) DEFAULT 0,
  notes TEXT,
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = customer_id OR auth.uid() IN (
    SELECT user_id FROM public.workers WHERE id = worker_id
  ));

CREATE POLICY "Customers can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Booking participants can update"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = customer_id OR auth.uid() IN (
    SELECT user_id FROM public.workers WHERE id = worker_id
  ));

-- =============================================
-- 7. WORKER BADGES
-- =============================================
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  badge_name TEXT NOT NULL,
  badge_icon TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges are viewable by everyone"
  ON public.badges FOR SELECT
  USING (TRUE);

-- =============================================
-- 8. COMMISSION TRANSACTIONS
-- =============================================
CREATE TABLE public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES public.workers(id),
  booking_id UUID REFERENCES public.bookings(id),
  amount INTEGER NOT NULL, -- in INR
  type TEXT NOT NULL CHECK (type IN ('onboarding', 'discovery', 'service')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can view their own commissions"
  ON public.commissions FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM public.agents WHERE id = agent_id
  ));

-- =============================================
-- 9. FUNCTIONS: Auto-update trust score
-- =============================================

-- Function to recalculate worker safety score based on verifications + reviews
CREATE OR REPLACE FUNCTION public.calculate_safety_score(worker_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  v RECORD;
  avg_rating NUMERIC;
BEGIN
  -- Get verification status (max 60 points)
  SELECT * INTO v FROM public.verifications WHERE worker_id = worker_uuid LIMIT 1;
  IF FOUND THEN
    IF v.aadhaar_verified THEN score := score + 20; END IF;
    IF v.police_verified THEN score := score + 25; END IF;
    IF v.store_vouched THEN score := score + 10; END IF;
    IF v.skill_verified THEN score := score + 5; END IF;
  END IF;

  -- Get average review rating (max 40 points)
  SELECT AVG(rating) INTO avg_rating FROM public.reviews WHERE worker_id = worker_uuid;
  IF avg_rating IS NOT NULL THEN
    score := score + ROUND(avg_rating * 8)::INTEGER; -- 5 stars = 40 points
  END IF;

  -- Update the worker record
  UPDATE public.workers SET safety_score = LEAST(score, 100), updated_at = NOW() WHERE id = worker_uuid;

  RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 10. TRIGGERS: Auto-recalculate on review/verification changes
-- =============================================

-- Trigger after review insert
CREATE OR REPLACE FUNCTION public.on_review_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.calculate_safety_score(NEW.worker_id);

  -- Update review count and average rating
  UPDATE public.workers SET
    total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE worker_id = NEW.worker_id),
    rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM public.reviews WHERE worker_id = NEW.worker_id),
    updated_at = NOW()
  WHERE id = NEW.worker_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_review_change
  AFTER INSERT OR UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.on_review_change();

-- Trigger after verification update
CREATE OR REPLACE FUNCTION public.on_verification_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.calculate_safety_score(NEW.worker_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_verification_change
  AFTER INSERT OR UPDATE ON public.verifications
  FOR EACH ROW EXECUTE FUNCTION public.on_verification_change();

-- =============================================
-- 11. AUTO-CREATE PROFILE ON SIGNUP
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- INDEXES for performance
-- =============================================
CREATE INDEX idx_workers_skill ON public.workers(skill);
CREATE INDEX idx_workers_safety_score ON public.workers(safety_score DESC);
CREATE INDEX idx_workers_rating ON public.workers(rating DESC);
CREATE INDEX idx_workers_kaushal_id ON public.workers(kaushal_id);
CREATE INDEX idx_reviews_worker ON public.reviews(worker_id);
CREATE INDEX idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX idx_bookings_worker ON public.bookings(worker_id);
CREATE INDEX idx_verifications_worker ON public.verifications(worker_id);
CREATE INDEX idx_commissions_agent ON public.commissions(agent_id);
