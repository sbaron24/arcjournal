import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface ThemeSelectorProps {
  cardData: {
    keywords: string[];
    shadowKeywords: string[];
    element: string;
    planetSign: string;
  };
  selectedKeywords: string[];
  selectedShadowKeywords: string[];
  selectedElement: string | null;
  selectedPlanetSign: string | null;
  onToggleKeyword: (keyword: string) => void;
  onToggleShadowKeyword: (keyword: string) => void;
  onToggleElement: () => void;
  onTogglePlanetSign: () => void;
}

export const ThemeSelector = ({
  cardData,
  selectedKeywords,
  selectedShadowKeywords,
  selectedElement,
  selectedPlanetSign,
  onToggleKeyword,
  onToggleShadowKeyword,
  onToggleElement,
  onTogglePlanetSign,
}: ThemeSelectorProps) => {
  return (
    <div className="space-y-4 p-6 bg-card/50 rounded-lg border border-mystic/20">
      <Label className="text-foreground font-serif text-lg">Select Themes That Resonate</Label>
      <p className="text-sm text-muted-foreground">Choose the keywords and themes from this card that speak to your question</p>
      
      <div className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Keywords</p>
          <div className="flex flex-wrap gap-2">
            {cardData.keywords.map((keyword) => (
              <Badge
                key={keyword}
                variant={selectedKeywords.includes(keyword) ? "default" : "outline"}
                className="cursor-pointer transition-colors"
                onClick={() => onToggleKeyword(keyword)}
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Shadow Keywords</p>
          <div className="flex flex-wrap gap-2">
            {cardData.shadowKeywords.map((keyword) => (
              <Badge
                key={keyword}
                variant={selectedShadowKeywords.includes(keyword) ? "default" : "outline"}
                className="cursor-pointer transition-colors"
                onClick={() => onToggleShadowKeyword(keyword)}
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Element</p>
            <Badge 
              variant={selectedElement ? "default" : "outline"}
              className="w-full justify-center cursor-pointer transition-colors"
              onClick={onToggleElement}
            >
              {cardData.element}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Planet/Sign</p>
            <Badge 
              variant={selectedPlanetSign ? "default" : "outline"}
              className="w-full justify-center cursor-pointer transition-colors"
              onClick={onTogglePlanetSign}
            >
              {cardData.planetSign}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
