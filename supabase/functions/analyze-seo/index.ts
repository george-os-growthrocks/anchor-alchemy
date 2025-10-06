import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { siteUrl, gscAccessToken } = await req.json();
    
    if (!siteUrl) {
      throw new Error('siteUrl is required');
    }

    console.log('Starting SEO analysis for:', siteUrl);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Crawl site with Firecrawl
    console.log('Step 1: Crawling site with Firecrawl...');
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    const crawlRes = await fetch('https://api.firecrawl.dev/v1/crawl', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: siteUrl,
        limit: 100,
        scrapeOptions: {
          formats: ['markdown', 'html'],
        },
      }),
    });

    if (!crawlRes.ok) {
      const errorText = await crawlRes.text();
      console.error('Firecrawl error:', errorText);
      throw new Error(`Firecrawl failed: ${errorText}`);
    }

    const crawlData = await crawlRes.json();
    const pages = crawlData.data || [];
    console.log(`Crawled ${pages.length} pages`);

    // Build link map
    const linkMap: Record<string, { incoming: Set<string>; outgoing: Set<string> }> = {};
    for (const page of pages) {
      const pageUrl = page.url || page.metadata?.url || '';
      if (!pageUrl) continue;

      if (!linkMap[pageUrl]) {
        linkMap[pageUrl] = { incoming: new Set(), outgoing: new Set() };
      }

      const links = page.links || [];
      for (const link of links) {
        if (!linkMap[link]) {
          linkMap[link] = { incoming: new Set(), outgoing: new Set() };
        }
        linkMap[pageUrl].outgoing.add(link);
        linkMap[link].incoming.add(pageUrl);
      }
    }

    // Store pages in database
    for (const page of pages) {
      const pageUrl = page.url || page.metadata?.url || '';
      if (!pageUrl) continue;

      await supabase.from('pages').upsert({
        url: pageUrl,
        title: page.metadata?.title || '',
        outgoing_count: linkMap[pageUrl]?.outgoing.size || 0,
        incoming_count: linkMap[pageUrl]?.incoming.size || 0,
        last_crawled_at: new Date().toISOString(),
      });
    }

    // 2. Tokenization with n-grams
    console.log('Step 2: Tokenizing content...');
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her', 'its', 'our', 'their']);

    const keywordsByPage: Record<string, Array<{ keyword: string; score: number; frequency: number }>> = {};

    for (const page of pages) {
      const pageUrl = page.url || page.metadata?.url || '';
      if (!pageUrl) continue;

      const content = page.markdown || page.content || '';
      const tokens = content
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter((w: string) => w.length > 2 && !stopWords.has(w));

      // Generate n-grams
      const grams: string[] = [];
      const freqMap: Record<string, number> = {};

      for (let i = 0; i < tokens.length; i++) {
        const uni = tokens[i];
        grams.push(uni);
        freqMap[uni] = (freqMap[uni] || 0) + 1;

        if (i + 1 < tokens.length) {
          const bi = `${tokens[i]} ${tokens[i + 1]}`;
          if (bi.replace(/\s+/g, '').length >= 6) {
            grams.push(bi);
            freqMap[bi] = (freqMap[bi] || 0) + 1;
          }
        }

        if (i + 2 < tokens.length) {
          const tri = `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`;
          if (tri.replace(/\s+/g, '').length >= 8) {
            grams.push(tri);
            freqMap[tri] = (freqMap[tri] || 0) + 1;
          }
        }
      }

      // Calculate TF-IDF scores (simplified)
      const scored = Object.entries(freqMap)
        .map(([keyword, freq]) => ({
          keyword,
          frequency: freq,
          score: freq * Math.log(pages.length / (1 + freq)),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 50);

      keywordsByPage[pageUrl] = scored;
    }

    // 3. Get keyword metrics from DataForSEO
    console.log('Step 3: Fetching keyword metrics from DataForSEO...');
    const allKeywords = Array.from(
      new Set(
        Object.values(keywordsByPage)
          .flat()
          .map(k => k.keyword)
      )
    ).slice(0, 300);

    const dfseoUser = Deno.env.get('DATAFORSEO_USERNAME');
    const dfseoPass = Deno.env.get('DATAFORSEO_PASSWORD');
    const dfseoAuth = btoa(`${dfseoUser}:${dfseoPass}`);

    const dfseoRes = await fetch(
      'https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live',
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${dfseoAuth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{
          keywords: allKeywords,
          location_name: 'United States',
          language_name: 'English',
        }]),
      }
    );

    const kwData: Record<string, { volume: number; kd: number; cpc: number }> = {};
    if (dfseoRes.ok) {
      const dfseoData = await dfseoRes.json();
      const results = dfseoData.tasks?.[0]?.result || [];
      for (const r of results) {
        kwData[r.keyword.toLowerCase()] = {
          volume: r.search_volume ?? 0,
          kd: r.competition_index ?? 50,
          cpc: r.cpc ?? 0,
        };
      }

      // Store keywords
      for (const [keyword, data] of Object.entries(kwData)) {
        await supabase.from('keywords').upsert({
          keyword,
          volume: data.volume,
          kd: data.kd,
          cpc: data.cpc,
        });
      }
    } else {
      console.error('DataForSEO error:', await dfseoRes.text());
    }

    // 4. Fetch GSC data
    console.log('Step 4: Fetching Google Search Console data...');
    const gscPages: Record<string, { imp: number; clicks: number; pos: number }> = {};
    const gscQueries: Record<string, number> = {};

    if (gscAccessToken) {
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 30);

      const gscBody = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        dimensions: ['query', 'page'],
        rowLimit: 250,
      };

      const gscRes = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${gscAccessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(gscBody),
        }
      );

      if (gscRes.ok) {
        const gscData = await gscRes.json();
        const rows = gscData.rows || [];

        for (const row of rows) {
          const [query, pageUrl] = row.keys;
          
          if (!gscPages[pageUrl]) {
            gscPages[pageUrl] = { imp: 0, clicks: 0, pos: 100 };
          }
          gscPages[pageUrl].imp += row.impressions;
          gscPages[pageUrl].clicks += row.clicks;
          gscPages[pageUrl].pos = Math.min(gscPages[pageUrl].pos, row.position);

          gscQueries[query.toLowerCase()] = (gscQueries[query.toLowerCase()] || 0) + row.impressions;
        }
      } else {
        console.error('GSC error:', await gscRes.text());
      }
    }

    // 5. Calculate opportunities
    console.log('Step 5: Calculating internal link opportunities...');
    const ctrCurve = (pos: number) => {
      const table: [number, number][] = [[1, 0.28], [2, 0.15], [3, 0.10], [4, 0.07], [5, 0.05], [6, 0.04], [7, 0.03], [8, 0.025], [9, 0.02], [10, 0.018]];
      const p = Math.round(Math.min(10, Math.max(1, pos)));
      return table.find(([rank]) => rank === p)?.[1] ?? 0.01;
    };

    const opportunities: any[] = [];

    for (const [sourceUrl, keywords] of Object.entries(keywordsByPage)) {
      for (const { keyword, score: tfidfScore, frequency } of keywords.slice(0, 20)) {
        const k = keyword.toLowerCase();
        const vol = kwData[k]?.volume ?? 0;
        const kd = kwData[k]?.kd ?? 50;
        const imp = gscQueries[k] ?? 0;
        const relevance = imp > 0 ? 1 : 0.6;

        const kwScoreRaw = ((vol * (imp + 1)) / (kd + 1)) * relevance;
        if (kwScoreRaw <= 0) continue;

        let best: any = null;
        let bestScore = 0;

        for (const page of pages) {
          const targetUrl = page.url || page.metadata?.url || '';
          if (!targetUrl || targetUrl === sourceUrl) continue;

          const pageStats = gscPages[targetUrl] || { imp: 0, clicks: 0, pos: 100 };
          const incoming = linkMap[targetUrl]?.incoming.size || 0;
          const pageScore = pageStats.imp * ctrCurve(pageStats.pos) * (1 / Math.sqrt(incoming + 1));

          const targetContent = (page.markdown || page.content || '').toLowerCase();
          const relevant = targetContent.includes(k);

          if (relevant && pageScore > bestScore) {
            bestScore = pageScore;
            best = { url: targetUrl, score: pageScore, anchor: keyword };
          }
        }

        if (best) {
          const anchorFit = Math.min(1, tfidfScore / 1.5);
          const priority = kwScoreRaw * best.score * anchorFit;

          opportunities.push({
            source_url: sourceUrl,
            target_url: best.url,
            keyword: k,
            kw_score: kwScoreRaw,
            page_score: best.score,
            priority,
            anchor: best.anchor,
          });
        }
      }
    }

    opportunities.sort((a, b) => b.priority - a.priority);

    // Store opportunities
    for (const opp of opportunities.slice(0, 200)) {
      await supabase.from('opportunities').insert(opp);
    }

    console.log(`Created ${opportunities.slice(0, 200).length} opportunities`);

    return new Response(
      JSON.stringify({
        success: true,
        pagesAnalyzed: pages.length,
        opportunitiesFound: opportunities.slice(0, 200).length,
        keywordsByPage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in analyze-seo:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
