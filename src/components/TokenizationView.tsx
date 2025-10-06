import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Hash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const TokenizationView = () => {
  const { data: pages, isLoading } = useQuery({
    queryKey: ['page-tokens'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_tokens')
        .select(`
          *,
          pages!inner(url, title),
          tokens!inner(token)
        `)
        .order('bm25', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card className="p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Hash className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold text-foreground">Tokenization & Frequency Analysis</h3>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Page</TableHead>
            <TableHead>Keyword</TableHead>
            <TableHead>TF-IDF</TableHead>
            <TableHead>BM25</TableHead>
            <TableHead>Frequency</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages?.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-medium max-w-xs truncate">
                {row.pages?.title || row.pages?.url}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{row.tokens?.token}</Badge>
              </TableCell>
              <TableCell>{row.tfidf?.toFixed(3)}</TableCell>
              <TableCell>{row.bm25?.toFixed(3)}</TableCell>
              <TableCell>{row.tf?.toFixed(0)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {!pages || pages.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No tokenization data available. Run an analysis first.
        </div>
      )}
    </Card>
  );
};
