import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookOpenCheck, Compass, Wand2, Rocket, Fingerprint, Heart, ScrollText, PartyPopper, Drama, Swords, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"

const levels = [
  { value: 'all', label: 'Tüm Seviyeler' },
  { value: 'a1', label: 'A1 - Başlangıç' },
  { value: 'a2', label: 'A2 - Temel' },
  { value: 'b1', label: 'B1 - Orta' },
  { value: 'b2', label: 'B2 - Orta Üstü' },
  { value: 'c1', label: 'C1 - İleri' },
];

const categories = [
  { value: 'all', label: 'Tüm Türler', icon: BookOpenCheck },
  { value: 'adventure', label: 'Macera', icon: Compass },
  { value: 'fantasy', label: 'Fantastik', icon: Wand2 },
  { value: 'sci-fi', label: 'Bilim Kurgu', icon: Rocket },
  { value: 'mystery', label: 'Gizem', icon: Fingerprint },
  { value: 'romance', label: 'Romantizm', icon: Heart },
  { value: 'history', label: 'Tarihi', icon: ScrollText },
  { value: 'comedy', label: 'Komedi', icon: PartyPopper },
  { value: 'drama', label: 'Dram', icon: Drama },
  { value: 'thriller', label: 'Gerilim', icon: Swords },
];

const SearchAndFilters = ({ onSearchChange, onFilterChange, filters }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  const handleApplyFilters = () => {
    onFilterChange(tempFilters);
    setIsSheetOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters = { level: 'all', category: 'all' };
    setTempFilters(resetFilters);
    onFilterChange(resetFilters);
    setIsSheetOpen(false);
  }

  const activeFilterCount = Object.values(filters).filter(v => v !== 'all').length;
  
  if (isMobile) {
    return (
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Hikaye ara..."
            className="pl-10 w-full h-12 rounded-lg"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative h-12 w-12 rounded-lg">
              <SlidersHorizontal className="h-5 w-5" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtrele ve Sırala</SheetTitle>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <div className="space-y-2">
                <label className="font-semibold">Seviye</label>
                <Select value={tempFilters.level} onValueChange={(value) => setTempFilters(prev => ({...prev, level: value}))}>
                  <SelectTrigger><SelectValue placeholder="Seviye seçin" /></SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="font-semibold">Kategori</label>
                <Select value={tempFilters.category} onValueChange={(value) => setTempFilters(prev => ({...prev, category: value}))}>
                  <SelectTrigger><SelectValue placeholder="Kategori seçin" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className="flex items-center gap-2"><cat.icon className="h-4 w-4" />{cat.label}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <SheetFooter className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleResetFilters}>Sıfırla</Button>
              <Button onClick={handleApplyFilters}>Uygula</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      <div className="relative md:col-span-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Hikaye ara..."
          className="pl-12 w-full h-12 rounded-lg text-base"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          value={filters.level}
          onValueChange={(value) => onFilterChange({ ...filters, level: value })}
        >
          <SelectTrigger className="h-12 rounded-lg text-base">
            <SelectValue placeholder="Seviye seçin" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.category}
          onValueChange={(value) => onFilterChange({ ...filters, category: value })}
        >
          <SelectTrigger className="h-12 rounded-lg text-base">
            <SelectValue placeholder="Kategori seçin" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <div className="flex items-center">
                  <category.icon className="w-4 h-4 mr-2" />
                  {category.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default React.memo(SearchAndFilters);