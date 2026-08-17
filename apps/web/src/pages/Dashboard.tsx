import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSearchStore } from '@/store/useSearchStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Filter, Download } from 'lucide-react';

const API_BASE = 'http://localhost:3001/api';

export default function Dashboard() {
  const { selectedTypeId, selectedCategoryId, keywords, setType, setCategory, setKeywords } = useSearchStore();
  const [isRunning, setIsRunning] = useState(false);

  const { data: types, isLoading: isLoadingTypes } = useQuery({
    queryKey: ['types'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/types`);
      return res.json();
    }
  });

  const { data: categories, isLoading: isLoadingCats } = useQuery({
    queryKey: ['categories', selectedTypeId],
    queryFn: async () => {
      if (!selectedTypeId) return [];
      const res = await fetch(`${API_BASE}/types/${selectedTypeId}/categories`);
      return res.json();
    },
    enabled: !!selectedTypeId
  });

  const runSearch = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE}/searches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type_id: selectedTypeId, category_id: selectedCategoryId, keywords })
      });
      return res.json();
    },
    onMutate: () => setIsRunning(true),
    onSuccess: () => {
      // In a real app, we'd poll or use websockets for job status
      setTimeout(() => setIsRunning(false), 3000); // Mock processing time
    }
  });

  return (
    <div className="min-h-screen bg-secondary/30 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">InvestorScope</h1>
            <p className="text-muted-foreground mt-1">Discover investors tailored to your niche.</p>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-4">
          <Card className="md:col-span-1 border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="w-4 h-4" />
                Search Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Deep Search Type</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={selectedTypeId || ''}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="" disabled>Select market...</option>
                  {types?.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={selectedCategoryId || ''}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={!selectedTypeId}
                >
                  <option value="" disabled>Select niche...</option>
                  {categories?.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Keywords (Optional)</Label>
                <Input 
                  placeholder='e.g. "seed stage", "B2C"' 
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>

              <Button 
                className="w-full mt-4" 
                disabled={!selectedCategoryId || isRunning}
                onClick={() => runSearch.mutate()}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching SEC...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Run Search
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-3 border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base">Results</CardTitle>
              <Button variant="outline" size="sm" disabled>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {isRunning ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="animate-pulse">Extracting SEC Form D filings...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Mock UI for results after running once. In a real app this would pull from /api/investors */}
                  {runSearch.isSuccess && (
                    <>
                      <div 
                        className="rounded-lg border bg-card p-4 flex items-start justify-between hover:border-primary/50 transition-colors cursor-pointer"
                        onClick={() => window.open('https://www.linkedin.com/search/results/people/?keywords=Jane%20Doe%20Pregnancy%20Tech%20Fund', '_blank')}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-lg text-foreground">Pregnancy Tech Fund I, L.P.</h4>
                            <Badge variant="secondary" className="text-xs">SEC Form D</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">Jane Doe • General Partner</p>
                          <p className="text-sm mt-3 font-medium text-foreground">Extract: High relevance based on recent SEC filing. Checks $500k - $2M.</p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-500/20">95% Match</Badge>
                        </div>
                      </div>
                      <div 
                        className="rounded-lg border bg-card p-4 flex items-start justify-between hover:border-primary/50 transition-colors cursor-pointer"
                        onClick={() => window.open('https://www.linkedin.com/search/results/people/?keywords=John%20Smith%20Health%20Wellness%20Ventures', '_blank')}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-lg text-foreground">Health & Wellness Ventures LLC</h4>
                            <Badge variant="secondary" className="text-xs">SEC Form D</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">John Smith • Managing Director</p>
                          <p className="text-sm mt-3 font-medium text-foreground">Extract: Active in health tech. Checks $100k - $500k.</p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-500/20">88% Match</Badge>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {!runSearch.isSuccess && (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                      <Search className="w-8 h-8 mb-4 opacity-20" />
                      <p>Select a type and category to discover investors.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
