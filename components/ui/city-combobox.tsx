"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { PlaceResult } from "@/server/types";

interface CityComboboxProps {
  value: string | null;
  stateAbbr: string;
  placeholder: string;
  onValueChange: (city: string, countyCodes: string[]) => void;
  // Called when the user picks "My city isn't listed" (always the last option).
  onNotListed: () => void;
  onClear: () => void;
}

export function CityCombobox({
  value,
  stateAbbr,
  placeholder,
  onValueChange,
  onNotListed,
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

  // "My city isn't listed" is pinned first (index 0); city i is index i + 1.
  // Hidden while loading, so there's nothing to highlight then (-1).
  const NOT_LISTED_INDEX = 0;
  const lastIndex = isLoading ? -1 : results.length;

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

  function handleNotListed() {
    onNotListed();
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
      setHighlightedIndex((i) => Math.min(i + 1, lastIndex));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (isLoading) return;
      if (highlightedIndex === NOT_LISTED_INDEX) {
        handleNotListed();
        inputRef.current?.blur();
      } else if (results[highlightedIndex - 1]) {
        handleSelect(results[highlightedIndex - 1]);
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
          placeholder={open ? t("arrest.city.placeholder") : placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlightedIndex(-1);
          }}
          onFocus={openDropdown}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn(
            "h-12 w-full rounded-[10px] border border-(--ijl-input-border) bg-white px-4 py-3 pe-12",
            "font-proxima text-[16px] leading-[22.4px]",
            open || value ? "text-foreground" : "text-(--ijl-muted)",
            "focus:outline-none focus:ring-2 focus:ring-(--ijl-accent) focus:ring-offset-2 focus:ring-offset-white"
          )}
        />
        <span className="pointer-events-none absolute end-3 flex items-center gap-1">
          {value && !open && (
            <span
              role="button"
              tabIndex={0}
              aria-label={t("common.city.clear")}
              onMouseDown={(e) => {
                e.preventDefault();
                handleClear(e as unknown as React.MouseEvent);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleClear(e as unknown as React.MouseEvent)}
              className="pointer-events-auto cursor-pointer rounded p-0.5 hover:bg-(--ijl-cta-bg)"
            >
              <X className="h-3.5 w-3.5 text-(--ijl-muted)" />
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
          className="absolute inset-x-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-(--ijl-border) bg-white shadow-md"
        >
          {isLoading ? (
            <li className="px-4 py-3 font-proxima text-[14px] text-(--ijl-muted)">
              {t("arrest.city.loading")}
            </li>
          ) : (
            <>
              {/* Pinned: sticks to the top of the box while the cities scroll under it */}
              <li
                id={`${listboxId}-option-${NOT_LISTED_INDEX}`}
                role="option"
                aria-selected={false}
                onMouseEnter={() => setHighlightedIndex(NOT_LISTED_INDEX)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleNotListed();
                }}
                className={cn(
                  "sticky top-0 z-10 cursor-pointer border-b border-(--ijl-border) px-4 py-3 font-proxima text-[16px]",
                  highlightedIndex === NOT_LISTED_INDEX
                    ? "bg-(--ijl-highlight) text-white"
                    : "bg-white text-(--ijl-accent)"
                )}
              >
                {t("arrest.city.notListed")}
              </li>
              {results.length === 0 ? (
                <li className="px-4 py-3 font-proxima text-[14px] text-(--ijl-muted)">
                  {t("arrest.city.noResults")}
                </li>
              ) : (
                results.map((place, i) => (
                  <li
                    key={`${place.county_codes.join(",")}__${place.place_display}`}
                    id={`${listboxId}-option-${i + 1}`}
                    role="option"
                    aria-selected={value === place.place_display}
                    onMouseEnter={() => setHighlightedIndex(i + 1)}
                    onMouseDown={(e) => {
                      // Prevent blur from firing before click
                      e.preventDefault();
                      handleSelect(place);
                    }}
                    className={cn(
                      "cursor-pointer px-4 py-3 font-proxima text-[16px] text-foreground",
                      i + 1 === highlightedIndex && "bg-(--ijl-highlight) text-white",
                      value === place.place_display && i + 1 !== highlightedIndex && "font-semibold"
                    )}
                  >
                    {place.place_display}
                  </li>
                ))
              )}
            </>
          )}
        </ul>
      )}
    </div>
  );
}
