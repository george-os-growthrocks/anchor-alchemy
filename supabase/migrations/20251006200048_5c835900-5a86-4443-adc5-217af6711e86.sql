-- Core pages & links tracking
CREATE TABLE public.pages (
  id BIGSERIAL PRIMARY KEY,
  url TEXT UNIQUE NOT NULL,
  title TEXT,
  content_hash TEXT,
  last_crawled_at TIMESTAMPTZ DEFAULT now(),
  outgoing_count INT DEFAULT 0,
  incoming_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pages_url ON public.pages(url);

CREATE TABLE public.links (
  source_url TEXT NOT NULL,
  target_url TEXT NOT NULL,
  PRIMARY KEY (source_url, target_url),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_links_source ON public.links(source_url);
CREATE INDEX idx_links_target ON public.links(target_url);

-- Token store for NLP analysis
CREATE TABLE public.tokens (
  id BIGSERIAL PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  stem TEXT,
  is_ngram BOOLEAN DEFAULT FALSE,
  df INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tokens_token ON public.tokens(token);

CREATE TABLE public.page_tokens (
  page_id BIGINT REFERENCES public.pages(id) ON DELETE CASCADE,
  token_id BIGINT REFERENCES public.tokens(id) ON DELETE CASCADE,
  tf REAL DEFAULT 0,
  tfidf REAL DEFAULT 0,
  bm25 REAL DEFAULT 0,
  positions INT[] DEFAULT '{}',
  PRIMARY KEY (page_id, token_id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_page_tokens_page ON public.page_tokens(page_id);
CREATE INDEX idx_page_tokens_token ON public.page_tokens(token_id);
CREATE INDEX idx_page_tokens_bm25 ON public.page_tokens(bm25 DESC);

-- Keyword metrics from DataForSEO
CREATE TABLE public.keywords (
  keyword TEXT PRIMARY KEY,
  location TEXT DEFAULT 'United States',
  language TEXT DEFAULT 'English',
  volume INT DEFAULT 0,
  kd REAL DEFAULT 0,
  cpc REAL DEFAULT 0,
  source TEXT DEFAULT 'dataforseo',
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_keywords_volume ON public.keywords(volume DESC);
CREATE INDEX idx_keywords_kd ON public.keywords(kd);

-- Google Search Console metrics
CREATE TABLE public.gsc_pages (
  page_url TEXT NOT NULL,
  date DATE NOT NULL,
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  ctr REAL DEFAULT 0,
  position REAL DEFAULT 0,
  PRIMARY KEY (page_url, date)
);

CREATE INDEX idx_gsc_pages_url ON public.gsc_pages(page_url);
CREATE INDEX idx_gsc_pages_date ON public.gsc_pages(date DESC);

CREATE TABLE public.gsc_queries (
  query TEXT NOT NULL,
  page_url TEXT NOT NULL,
  date DATE NOT NULL,
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  ctr REAL DEFAULT 0,
  position REAL DEFAULT 0,
  PRIMARY KEY (query, page_url, date)
);

CREATE INDEX idx_gsc_queries_query ON public.gsc_queries(query);
CREATE INDEX idx_gsc_queries_page ON public.gsc_queries(page_url);
CREATE INDEX idx_gsc_queries_date ON public.gsc_queries(date DESC);

-- Internal link opportunities
CREATE TABLE public.opportunities (
  id BIGSERIAL PRIMARY KEY,
  source_url TEXT NOT NULL,
  target_url TEXT NOT NULL,
  keyword TEXT NOT NULL,
  kw_score REAL NOT NULL DEFAULT 0,
  page_score REAL NOT NULL DEFAULT 0,
  priority REAL NOT NULL DEFAULT 0,
  anchor TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_opportunities_priority ON public.opportunities(priority DESC);
CREATE INDEX idx_opportunities_status ON public.opportunities(status);
CREATE INDEX idx_opportunities_source ON public.opportunities(source_url);
CREATE INDEX idx_opportunities_target ON public.opportunities(target_url);

-- OAuth tokens for Google Search Console
CREATE TABLE public.oauth_tokens (
  id BIGSERIAL PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'google',
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for all tables (public access for this SEO tool)
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gsc_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gsc_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_tokens ENABLE ROW LEVEL SECURITY;

-- RLS policies (allowing public read for SEO data display)
CREATE POLICY "Allow public read pages" ON public.pages FOR SELECT USING (true);
CREATE POLICY "Allow public read links" ON public.links FOR SELECT USING (true);
CREATE POLICY "Allow public read tokens" ON public.tokens FOR SELECT USING (true);
CREATE POLICY "Allow public read page_tokens" ON public.page_tokens FOR SELECT USING (true);
CREATE POLICY "Allow public read keywords" ON public.keywords FOR SELECT USING (true);
CREATE POLICY "Allow public read gsc_pages" ON public.gsc_pages FOR SELECT USING (true);
CREATE POLICY "Allow public read gsc_queries" ON public.gsc_queries FOR SELECT USING (true);
CREATE POLICY "Allow public read opportunities" ON public.opportunities FOR SELECT USING (true);

-- Service role can write everything
CREATE POLICY "Service role full access pages" ON public.pages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access links" ON public.links FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access tokens" ON public.tokens FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access page_tokens" ON public.page_tokens FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access keywords" ON public.keywords FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access gsc_pages" ON public.gsc_pages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access gsc_queries" ON public.gsc_queries FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access opportunities" ON public.opportunities FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access oauth" ON public.oauth_tokens FOR ALL USING (auth.role() = 'service_role');