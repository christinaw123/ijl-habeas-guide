"use client";

import { useEffect, useRef, useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "cmdk";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!inputValue.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/places?state=${encodeURIComponent(stateAbbr)}&q=${encodeURIComponent(inputValue)}`
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
      }
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, stateAbbr]);

  // Reset input when stateAbbr changes (parent already clears value)
  useEffect(() => {
    setInputValue("");
    setResults([]);
  }, [stateAbbr]);

  function handleSelect(place: PlaceResult) {
    onValueChange(place.place_display, place.county_codes);
    setInputValue(place.place_display);
    setOpen(false);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    setInputValue("");
    setResults([]);
    onClear();
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-[var(--ijl-border)] bg-white px-3 py-2",
            "font-[var(--font-proxima)] text-[14px] text-[var(--foreground)]",
            "hover:border-[var(--ijl-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--ijl-accent)] focus:ring-offset-1"
          )}
        >
          <span className={value ? "text-[var(--foreground)]" : "text-[var(--ijl-muted)]"}>
            {value ?? placeholder}
          </span>
          <span className="flex items-center gap-1 ml-2 shrink-0">
            {value && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Clear city"
                onClick={handleClear}
                onKeyDown={(e) => e.key === "Enter" && handleClear(e as unknown as React.MouseEvent)}
                className="rounded p-0.5 hover:bg-[var(--ijl-cta-bg)] cursor-pointer"
              >
                <X className="h-3.5 w-3.5 text-[var(--ijl-muted)]" />
              </span>
            )}
            <ChevronsUpDown className="h-4 w-4 text-[var(--ijl-muted)]" />
          </span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          className="z-50 w-[var(--radix-popover-trigger-width)] rounded-md border border-[var(--ijl-border)] bg-white shadow-md"
        >
          <Command shouldFilter={false}>
            <CommandInput
              value={inputValue}
              onValueChange={setInputValue}
              placeholder="Type a city name..."
              className={cn(
                "w-full border-b border-[var(--ijl-border)] px-3 py-2",
                "font-[var(--font-proxima)] text-[14px] outline-none placeholder:text-[var(--ijl-muted)]"
              )}
              autoFocus
            />
            <CommandList className="max-h-60 overflow-y-auto py-1">
              {inputValue.trim() && results.length === 0 && (
                <CommandEmpty className="px-3 py-2 font-[var(--font-proxima)] text-[13px] text-[var(--ijl-muted)]">
                  No cities found.
                </CommandEmpty>
              )}
              {results.length > 0 && (
                <CommandGroup>
                  {results.map((place) => (
                    <CommandItem
                      key={`${place.county_codes.join(",")}__${place.place_display}`}
                      value={place.place_display}
                      onSelect={() => handleSelect(place)}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 px-3 py-2",
                        "font-[var(--font-proxima)] text-[14px] text-[var(--foreground)]",
                        "hover:bg-[var(--ijl-cta-bg)] aria-selected:bg-[var(--ijl-cta-bg)]"
                      )}
                    >
                      <Check
                        className={cn(
                          "h-4 w-4 shrink-0 text-[var(--ijl-accent)]",
                          value === place.place_display ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {place.place_display}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
