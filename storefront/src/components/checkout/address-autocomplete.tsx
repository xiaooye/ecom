"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AddressSuggestion {
  id: string;
  /** Full formatted address line */
  address: string;
  /** Street address */
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface AddressAutocompleteProps {
  /** Called when a suggestion is selected */
  onSelect: (suggestion: AddressSuggestion) => void;
  /** Placeholder text */
  placeholder?: string;
  /** External value to control the input */
  value?: string;
  /** Called on input change (raw text) */
  onChange?: (value: string) => void;
  className?: string;
  /** Custom suggestion fetcher - defaults to built-in mock data */
  fetchSuggestions?: (query: string) => Promise<AddressSuggestion[]>;
}

/**
 * Mock address suggestions for demonstration.
 * In production, replace with a real geocoding API (Google Places, Mapbox, etc.)
 */
const MOCK_ADDRESSES: AddressSuggestion[] = [
  {
    id: "1",
    address: "123 Main Street, New York, NY 10001",
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "US",
  },
  {
    id: "2",
    address: "456 Oak Avenue, Los Angeles, CA 90001",
    street: "456 Oak Avenue",
    city: "Los Angeles",
    state: "CA",
    postalCode: "90001",
    country: "US",
  },
  {
    id: "3",
    address: "789 Pine Road, Chicago, IL 60601",
    street: "789 Pine Road",
    city: "Chicago",
    state: "IL",
    postalCode: "60601",
    country: "US",
  },
  {
    id: "4",
    address: "321 Elm Street, Houston, TX 77001",
    street: "321 Elm Street",
    city: "Houston",
    state: "TX",
    postalCode: "77001",
    country: "US",
  },
  {
    id: "5",
    address: "654 Maple Drive, Phoenix, AZ 85001",
    street: "654 Maple Drive",
    city: "Phoenix",
    state: "AZ",
    postalCode: "85001",
    country: "US",
  },
  {
    id: "6",
    address: "987 Cedar Lane, Philadelphia, PA 19101",
    street: "987 Cedar Lane",
    city: "Philadelphia",
    state: "PA",
    postalCode: "19101",
    country: "US",
  },
  {
    id: "7",
    address: "147 Birch Court, San Antonio, TX 78201",
    street: "147 Birch Court",
    city: "San Antonio",
    state: "TX",
    postalCode: "78201",
    country: "US",
  },
  {
    id: "8",
    address: "258 Walnut Boulevard, San Diego, CA 92101",
    street: "258 Walnut Boulevard",
    city: "San Diego",
    state: "CA",
    postalCode: "92101",
    country: "US",
  },
];

function defaultFetchSuggestions(query: string): Promise<AddressSuggestion[]> {
  const lower = query.toLowerCase();
  const results = MOCK_ADDRESSES.filter(
    (a) =>
      a.address.toLowerCase().includes(lower) ||
      a.city.toLowerCase().includes(lower) ||
      a.street.toLowerCase().includes(lower) ||
      a.postalCode.includes(query)
  );
  // Simulate network delay
  return new Promise((resolve) => setTimeout(() => resolve(results), 150));
}

/**
 * Address input with dropdown suggestions.
 * Shows suggested addresses as user types, with selection filling the fields.
 * Debounced input, keyboard navigation (up/down/enter).
 */
export function AddressAutocomplete({
  onSelect,
  placeholder = "Start typing your address...",
  value: externalValue,
  onChange: externalOnChange,
  className,
  fetchSuggestions = defaultFetchSuggestions,
}: AddressAutocompleteProps) {
  const [internalValue, setInternalValue] = useState("");
  const inputValue = externalValue ?? internalValue;

  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateValue = useCallback(
    (val: string) => {
      if (externalOnChange) {
        externalOnChange(val);
      } else {
        setInternalValue(val);
      }
    },
    [externalOnChange]
  );

  // Debounced fetch
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (inputValue.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);

    debounceRef.current = setTimeout(async () => {
      const results = await fetchSuggestions(inputValue);
      setSuggestions(results);
      setIsOpen(results.length > 0);
      setActiveIndex(-1);
      setIsLoading(false);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, fetchSuggestions]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        inputRef.current &&
        !inputRef.current.contains(target) &&
        listRef.current &&
        !listRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectSuggestion = (suggestion: AddressSuggestion) => {
    updateValue(suggestion.address);
    setIsOpen(false);
    setActiveIndex(-1);
    onSelect(suggestion);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          selectSuggestion(suggestions[activeIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll("[data-suggestion]");
      items[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => updateValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="pl-9"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined
          }
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-background shadow-lg"
        >
          {suggestions.map((suggestion, i) => (
            <li
              key={suggestion.id}
              id={`suggestion-${i}`}
              data-suggestion
              role="option"
              aria-selected={i === activeIndex}
              onClick={() => selectSuggestion(suggestion)}
              className={cn(
                "flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm transition-colors",
                i === activeIndex
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              )}
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="truncate font-medium">{suggestion.street}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {suggestion.city}, {suggestion.state} {suggestion.postalCode}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
