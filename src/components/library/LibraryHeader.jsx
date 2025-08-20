import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal, Sparkles, RotateCcw, BookOpen, Feather, BrainCircuit, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { useAuth } from '@/contexts/AuthContext';

const levels = [
  { value: 'all', label: 'Tüm Seviyeler' },
  { value: 'a1', label: 'A1 - Başlangıç' },
  { value: 'a2', label: 'A2 - Temel' },
  { value: 'b1', label: 'B1 - Orta' },
  { value: 'b2', label: 'B2 - Orta Üstü' },
  { value: 'c1', label: 'C1 - İleri' },
];

const readTimes = [
    { value: 'all', label: 'Tüm Süreler' },
    { value: '1-3 dk', label: 'Kısa (1-3 dk)' },
    { value: '4-7 dk', label: 'Orta (4-7 dk)' },
    { value: '8+ dk', label: 'Uzun (8+ dk)' },
];

const categories = [
  { value: 'all', label: 'Tüm Türler' },
  { value: 'adventure', label: 'Macera' },
  { value: 'fantasy', label: 'Fantastik' },
  { value: 'sci-fi', label: 'Bilim Kurgu' },
  { value: 'mystery', label: 'Gizem' },
  { value: 'romance', label: 'Romantizm' },
  { value: 'history', label: 'Tarihi' },
  { value: 'comedy', label: 'Komedi' },
  { value: 'drama', label: 'Dram' },
  { value: 'thriller', label: 'Gerilim' },
];

const ratings = [
    { value: 'all', label: 'Tüm Oylar' },
    { value: '4+', label: '4 Yıldız ve Üzeri' },
    { value: '3+', label: '3 Yıldız ve Üzeri' },
    { value: '2+', label: '2 Yıldız ve Üzeri' },
    { value: '1+', label: '1 Yıldız ve Üzeri' },
];


const AnimatedShape = ({ icon: Icon, className, duration, delay }) => (
    <motion.div
        className={`absolute text-white/10 ${className}`}
        initial={{ scale: 0, rotate: -90, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ 
            type: 'spring', 
            stiffness: 100, 
            damping: 10, 
            delay: delay 
        }}
    >
        <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: duration, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        >
            <Icon className="h-full w-full" />
        </motion.div>
    </motion.div>
);

const LibraryHeader = ({ onSearchChange, onFilterChange, filters, onResetFilters, currentSearchTerm }) => {
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);
    const { profile } = useAuth();
    const displayName = profile?.name?.split(' ')[0] || 'Gezgin';
  
    const handleReset = () => {
      onResetFilters();
    }
  
    const activeFilterCount = Object.values(filters).filter(v => v !== 'all').length;

    const FilterContent = ({ isSheet = false }) => {
        const currentFilters = isSheet ? filters : filters;
        const setFilter = (key, value) => {
            onFilterChange({ [key]: value });
        };

        return (
        <>
            <div className="space-y-2">
                <label className="font-semibold text-sm">Seviye</label>
                <Select value={currentFilters.level} onValueChange={(value) => setFilter('level', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    {levels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <label className="font-semibold text-sm">Okuma Süresi</label>
                <Select value={currentFilters.readTime} onValueChange={(value) => setFilter('readTime', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    {readTimes.map((time) => (
                    <SelectItem key={time.value} value={time.value}>{time.label}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <label className="font-semibold text-sm">Kategori</label>
                <Select value={currentFilters.category} onValueChange={(value) => setFilter('category', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <label className="font-semibold text-sm">Okuyucu Puanı</label>
                <Select value={currentFilters.rating} onValueChange={(value) => setFilter('rating', value)}>
                <SelectTrigger>
                    <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <SelectValue />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    {ratings.map((rate) => (
                    <SelectItem key={rate.value} value={rate.value}>{rate.label}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
        </>
    )};

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} 
            className="relative overflow-hidden rounded-2xl bg-primary/90 p-6 text-primary-foreground shadow-lg mb-8"
        >
            <div className="absolute inset-0 z-0">
                <AnimatedShape icon={BookOpen} className="-left-4 -top-4 h-24 w-24" duration={12} delay={0.1} />
                <AnimatedShape icon={Feather} className="-right-8 -bottom-8 h-32 w-32" duration={15} delay={0.3} />
                <AnimatedShape icon={BrainCircuit} className="right-1/3 top-0 h-16 w-16" duration={10} delay={0.5} />
                <AnimatedShape icon={Sparkles} className="left-1/4 bottom-0 h-20 w-20" duration={18} delay={0.7} />
            </div>
            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex-1">
                    <h2 className="text-3xl font-bold">Yeteneklerini Geliştir, {displayName}!</h2>
                    <p className="mt-1 max-w-2xl text-lg text-primary-foreground/80">Yeni hikayeler keşfet ve öğrenmeye başla.</p>
                </div>
                <div className="flex w-full flex-col md:flex-row items-center gap-2">
                    <div className="relative flex-grow w-full group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/80 transition-colors duration-300 group-focus-within:text-primary" />
                        <Input
                            type="text"
                            placeholder="Hikaye ara..."
                            className="pl-10 w-full h-12 text-foreground bg-background/80 focus:bg-background transition-all duration-300 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                            onChange={(e) => onSearchChange(e.target.value)}
                            value={currentSearchTerm}
                        />
                         <div className="absolute inset-0 rounded-lg border-2 border-transparent group-focus-within:border-primary pointer-events-none transition-all duration-300 -z-10 group-focus-within:animate-pulse-once"></div>
                    </div>
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="secondary" className="relative h-12 w-full md:w-auto shrink-0">
                            <SlidersHorizontal className="h-5 w-5 mr-2" /> Filtrele
                            {activeFilterCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                                {activeFilterCount}
                                </span>
                            )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Filtrele</SheetTitle>
                            </SheetHeader>
                            <div className="py-6 space-y-6">
                                <FilterContent isSheet={true} />
                            </div>
                            <SheetFooter className="grid grid-cols-2 gap-2">
                                <Button variant="outline" onClick={handleReset}>
                                    <RotateCcw className="mr-2 h-4 w-4" /> Sıfırla
                                </Button>
                                <SheetClose asChild>
                                    <Button>Kapat</Button>
                                </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </motion.header>
    );
};

export default LibraryHeader;