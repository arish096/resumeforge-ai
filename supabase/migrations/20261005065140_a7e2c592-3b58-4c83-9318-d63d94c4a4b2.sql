CREATE TABLE public.resumes (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid(),
  doc JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resumes TO authenticated;
GRANT ALL ON public.resumes TO service_role;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own resumes" ON public.resumes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX resumes_user_idx ON public.resumes(user_id);