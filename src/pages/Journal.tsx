import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowLeft, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Reflection {
  id: string;
  reflection: string;
  created_at: string;
  selected_keywords: string[] | null;
  selected_shadow_keywords: string[] | null;
  highlights: string[] | null;
  tarot_cards: {
    name: string;
    element: string | null;
    planet_or_sign: string | null;
  };
}

const Journal = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchReflections();
    }
  }, [user]);

  const fetchReflections = async () => {
    try {
      const { data, error } = await supabase
        .from('reflections')
        .select(`
          id,
          reflection,
          created_at,
          selected_keywords,
          selected_shadow_keywords,
          highlights,
          tarot_cards (
            name,
            element,
            planet_or_sign
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReflections(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reflections",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading your journal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-card/50" />
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-64 h-64 bg-mystic/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-celestial/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Draw
          </Button>

          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-gold to-gold" />
              <BookOpen className="w-8 h-8 text-gold" />
              <div className="w-12 h-[2px] bg-gradient-to-l from-transparent via-gold to-gold" />
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-2">
              Your Tarot Journal
            </h1>
            
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              A collection of your spiritual insights and reflections
            </p>
          </div>
        </div>

        {reflections.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 text-mystic/50 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-4">
              Your journal is empty
            </p>
            <p className="text-muted-foreground text-sm mb-6">
              Draw a card and record your first reflection to begin your journey
            </p>
            <Button onClick={() => navigate('/')}>
              Draw Your First Card
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto">
            {reflections.map((item) => (
              <Card key={item.id} className="border-mystic/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="font-serif text-2xl">
                        {item.tarot_cards.name}
                      </CardTitle>
                      <CardDescription>
                        {new Date(item.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {item.tarot_cards.element && (
                        <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-accent/30">
                          {item.tarot_cards.element}
                        </Badge>
                      )}
                      {item.tarot_cards.planet_or_sign && (
                        <Badge variant="secondary" className="bg-mystic/20 text-mystic border-mystic/30">
                          {item.tarot_cards.planet_or_sign}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Resonance Section */}
                    {(item.selected_keywords && item.selected_keywords.length > 0) ||
                     (item.selected_shadow_keywords && item.selected_shadow_keywords.length > 0) ||
                     (item.highlights && item.highlights.length > 0) ? (
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Resonance</h4>
                        <div className="flex flex-wrap gap-2">
                          {/* Layout A: Show selected keywords and shadow keywords */}
                          {item.selected_keywords && item.selected_keywords.length > 0 && (
                            <>
                              {item.selected_keywords.map((keyword, index) => (
                                <Badge
                                  key={`keyword-${index}`}
                                  variant="outline"
                                  className="bg-gold/20 text-foreground border-gold/30"
                                >
                                  {keyword}
                                </Badge>
                              ))}
                            </>
                          )}
                          {item.selected_shadow_keywords && item.selected_shadow_keywords.length > 0 && (
                            <>
                              {item.selected_shadow_keywords.map((keyword, index) => (
                                <Badge
                                  key={`shadow-${index}`}
                                  variant="outline"
                                  className="bg-gold/20 text-foreground border-gold/30"
                                >
                                  {keyword}
                                </Badge>
                              ))}
                            </>
                          )}
                          {/* Layout B: Show highlights */}
                          {item.highlights && item.highlights.length > 0 && (
                            <>
                              {item.highlights.map((highlight, index) => (
                                <Badge
                                  key={`highlight-${index}`}
                                  variant="outline"
                                  className="bg-gold/20 text-foreground border-gold/30"
                                >
                                  {highlight}
                                </Badge>
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                    ) : null}
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Your Reflection</h4>
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                        {item.reflection}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
