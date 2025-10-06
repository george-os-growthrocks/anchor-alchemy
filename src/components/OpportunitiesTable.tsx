import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const OpportunitiesTable = () => {
  const { toast } = useToast();

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['opportunities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('status', 'open')
        .order('priority', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
  });

  const copyAnchorSnippet = (opp: any) => {
    const snippet = `<a href="${opp.target_url}">${opp.anchor}</a>`;
    navigator.clipboard.writeText(snippet);
    toast({
      title: "Copied to clipboard",
      description: "Anchor link snippet copied successfully",
    });
  };

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
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold text-foreground">Internal Link Opportunities</h3>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Priority</TableHead>
              <TableHead>Source Page</TableHead>
              <TableHead>Keyword</TableHead>
              <TableHead>KW Score</TableHead>
              <TableHead>Target Page</TableHead>
              <TableHead>Page Score</TableHead>
              <TableHead>Suggested Anchor</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities?.map((opp) => (
              <TableRow key={opp.id}>
                <TableCell>
                  <Badge 
                    variant={
                      opp.priority > 100 ? "default" : 
                      opp.priority > 50 ? "secondary" : 
                      "outline"
                    }
                  >
                    {Math.round(opp.priority)}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate font-medium">
                  {opp.source_url}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{opp.keyword}</Badge>
                </TableCell>
                <TableCell>{Math.round(opp.kw_score)}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {opp.target_url}
                </TableCell>
                <TableCell>{opp.page_score.toFixed(2)}</TableCell>
                <TableCell className="font-mono text-sm">{opp.anchor}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyAnchorSnippet(opp)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {!opportunities || opportunities.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No opportunities found. Run an analysis to discover internal linking opportunities.
        </div>
      )}
    </Card>
  );
};
