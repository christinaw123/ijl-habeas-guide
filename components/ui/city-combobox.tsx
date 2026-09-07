"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { PlaceResult } from "@/app/api/places/route";

interface CityComboboxProps {
  value: string | null;
  stateAbbr: string;
  placeholder: string;
  onValueChange: (city: string, countyCodes: string[]) => void;
  onClear: () => void;
}

export function CityCombobox({
  value,
  stateAbbr,
  placeholder,
  onValueChange,
  onClear,
}: CityComboboxProps) {
  const { t } = useLanguage();
  const listboxId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [prevStateAbbr, setPrevStateAbbr] = useState(stateAbbr);

  // Reset when the parent switches to a different state (React render-time adjustment pattern)
  if (prevStateAbbr !== stateAbbr) {
    setPrevStateAbbr(stateAbbr);
    setQuery("");
    setResults([]);
    setIsLoading(false);
  }

  // When open, show what the user is typing; when closed, show selected city or empty
  const displayValue = open ? query : (value ?? "");

  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Mark loading immediately so the dropdown never shows a misleading
    // "no cities found" while a fetch is only pending/in-flight.
    setIsLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/places?state=${encodeURIComponent(stateAbbr)}&q=${encodeURIComponent(query)}`
        );
        if (!res.ok) {
          console.error("[CityCombobox]", await res.text());
          setResults([]);
          return;
        }
        const data: PlaceResult[] = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [open, query, stateAbbr]);

  function openDropdown() {
    setQuery("");
    setHighlightedIndex(-1);
    setOpen(true);
  }

  function closeDropdown() {
    setQuery("");
    setResults([]);
    setHighlightedIndex(-1);
    setIsLoading(false);
    setOpen(false);
  }

  function handleSelect(place: PlaceResult) {
    onValueChange(place.place_display, place.county_codes);
    closeDropdown();
  }

  function handleBlur() {
    // Small delay so onMouseDown on list items fires first
    setTimeout(closeDropdown, 100);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") openDropdown();
      return;
    }
    if (e.key === "Escape") {
      closeDropdown();
      inputRef.current?.blur();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && results[highlightedIndex]) {
        handleSelect(results[highlightedIndex]);
        inputRef.current?.blur();
      }
    }
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onClear();
    closeDropdown();
  }

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined
          }
          value={displayValue}
          placeholder={open ? t("step1.city.placeholder") : placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlightedIndex(-1);
          }}
          onFocus={openDropdown}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn(
            "h-12 w-full rounded-[10px] border border-[var(--ijl-border)] bg-white px-4 py-3 pr-12",
            "font-[var(--font-proxima)] text-[16px] leading-[22.4px]",
            open || value ? "text-[var(--foreground)]" : "text-[var(--ijl-muted)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--ijl-accent)] focus:ring-offset-2 focus:ring-offset-white"
          )}
        />
        <span className="pointer-events-none absolute right-3 flex items-center gap-1">
          {value && !open && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Clear city"
              onMouseDown={(e) => {
                e.preventDefault();
                handleClear(e as unknown as React.MouseEvent);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleClear(e as unknown as React.MouseEvent)}
              className="pointer-events-auto cursor-pointer rounded p-0.5 hover:bg-[var(--ijl-cta-bg)]"
            >
              <X className="h-3.5 w-3.5 text-[var(--ijl-muted)]" />
            </span>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-[#2F2E2E] transition-transform duration-150",
              open && "rotate-180"
            )}
          />
        </span>
      </div>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-[var(--ijl-border)] bg-white shadow-md"
        >
          {isLoading ? (
            <li className="px-4 py-3 font-[var(--font-proxima)] text-[14px] text-[var(--ijl-muted)]">
              {t("step1.city.loading")}
            </li>
          ) : results.length === 0 ? (
            <li className="px-4 py-3 font-[var(--font-proxima)] text-[14px] text-[var(--ijl-muted)]">
              {t("step1.city.noResults")}
            </li>
          ) : (
            results.map((place, i) => (
              <li
                key={`${place.county_codes.join(",")}__${place.place_display}`}
                id={`${listboxId}-option-${i}`}
                role="option"
                aria-selected={value === place.place_display}
                onMouseDown={(e) => {
                  // Prevent blur from firing before click
                  e.preventDefault();
                  handleSelect(place);
                }}
                className={cn(
                  "cursor-pointer px-4 py-3 font-[var(--font-proxima)] text-[16px] text-[var(--foreground)]",
                  i === highlightedIndex && "bg-[var(--ijl-cta-bg)]",
                  value === place.place_display && i !== highlightedIndex && "font-semibold"
                )}
              >
                {place.place_display}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
