import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { MapPin } from "lucide-react";

export type AutocompleteDestination = {
  id: string;
  name: string;
  city: string;
  country: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  displayName: string;
  imageUrl?: string;
  source: "geoapify" | "local";
};

interface AutocompleteProps {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onSelect: (d: AutocompleteDestination) => void;
  className?: string;
  dropdownClassName?: string;
}

export function Autocomplete({ 
  placeholder, 
  value, 
  onChange, 
  onSelect, 
  className,
  dropdownClassName
}: AutocompleteProps) {
  const [show, setShow] = useState(false);
  const [results, setResults] = useState<AutocompleteDestination[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (value.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/destinations/search?q=${encodeURIComponent(value)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Autocomplete fetch failed", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="relative flex-1">
      <input 
        type="text" 
        placeholder={placeholder} 
        value={value}
        onChange={(e) => { onChange(e.target.value); setShow(true); }}
        onFocus={() => setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 200)}
        className={cn(
          "w-full outline-none transition-all",
          className
        )} 
      />
      {show && value.length >= 2 && (
        <div className={cn(
          "absolute top-full left-0 w-full mt-1 bg-white border border-border rounded-xl shadow-lg z-[100] max-h-60 overflow-y-auto",
          dropdownClassName
        )}>
          {loading && results.length === 0 ? (
            <div className="px-4 py-3 text-[14px] text-muted-foreground text-center">Searching...</div>
          ) : results.length > 0 ? (
            results.map(d => (
              <div 
                key={d.id} 
                className="px-4 py-3 hover:bg-orange-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-border/40 last:border-0"
                onClick={() => { 
                  onChange(d.displayName); 
                  onSelect(d); 
                  setShow(false); 
                }}
              >
                <div className="bg-orange-100 p-1.5 rounded-full text-primary shrink-0">
                  <MapPin size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-slate-800">{d.name}</span>
                  <span className="text-[12px] text-muted-foreground">{d.country}</span>
                </div>
              </div>
            ))
          ) : !loading && value.length >= 2 ? (
            <div className="px-4 py-3 text-[14px] text-muted-foreground text-center">No destinations found</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
