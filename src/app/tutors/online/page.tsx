'use client';

import { useEffect, useState, useTransition, useMemo } from 'react';
import { Bot, Loader2, Star, Search, Filter, Users, Clock, BookOpen, Grid3X3, List, ChevronDown } from 'lucide-react';

import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { onlineTutors, subjects } from '@/lib/mock-data';
import { TutorCard } from '@/components/tutor-card';
import { getTutorRecommendation } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import type { RecommendTutorOutput } from '@/ai/flows/recommend-tutor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCurriculumTheme, getThemeOrDefault } from '@/hooks/use-curriculum-theme';
import { cn } from '@/lib/utils';

export default function OnlineTutorsPage() {
  const { theme } = useCurriculumTheme();
  const currentTheme = getThemeOrDefault(theme);
  
  const [recommendation, setRecommendation] = useState<RecommendTutorOutput | null>(null);
  const [subject, setSubject] = useState(subjects[0].title);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  // Filtering and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique subjects from tutors
  const uniqueSubjects = useMemo(() => {
    const subjects = new Set<string>();
    onlineTutors.forEach(tutor => {
      tutor.subjects.forEach(subject => subjects.add(subject));
    });
    return Array.from(subjects).sort();
  }, []);

  // Filter tutors based on search and filters
  const filteredTutors = useMemo(() => {
    return onlineTutors.filter(tutor => {
      const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tutor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tutor.subjects.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSubject = selectedSubject === 'all' || 
                           tutor.subjects.includes(selectedSubject) ||
                           tutor.specialty === selectedSubject;
      
      const matchesRating = selectedRating === 'all' || 
                           (selectedRating === '4.5+' && tutor.rating >= 4.5) ||
                           (selectedRating === '4.0+' && tutor.rating >= 4.0) ||
                           (selectedRating === '3.5+' && tutor.rating >= 3.5);
      
      const matchesAvailability = selectedAvailability === 'all' ||
                                 (selectedAvailability === 'available' && tutor.isAvailable) ||
                                 (selectedAvailability === 'busy' && !tutor.isAvailable);
      
      const matchesPrice = priceRange === 'all' ||
                          (priceRange === 'budget' && tutor.hourlyRate <= 35) ||
                          (priceRange === 'mid' && tutor.hourlyRate > 35 && tutor.hourlyRate <= 45) ||
                          (priceRange === 'premium' && tutor.hourlyRate > 45);
      
      return matchesSearch && matchesSubject && matchesRating && matchesAvailability && matchesPrice;
    });
  }, [searchTerm, selectedSubject, selectedRating, selectedAvailability, priceRange]);

  useEffect(() => {
    startTransition(async () => {
        setRecommendation(null);
        const formData = new FormData();
        formData.append("subject", subject);
        const result = await getTutorRecommendation(formData);

        if (result.error) {
            toast({ variant: 'destructive', title: 'AI Recommendation Error', description: result.error });
        } else {
            setRecommendation(result.data ?? null);
        }
    });
  }, [subject, toast]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSubject('all');
    setSelectedRating('all');
    setSelectedAvailability('all');
    setPriceRange('all');
  };

  return (
    <AppShell title="Online Tutors">
      <div className="space-y-6">
        {/* AI Recommendation Section */}
        <Card className={`${currentTheme.primary.replace('bg-', 'bg-').replace('500', '50')} border-2 ${currentTheme.border}`}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${currentTheme.primary} text-white`}>
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  AI Tutor Recommendation
                </CardTitle>
                <CardDescription>
                  Select a subject and let our AI find the perfect tutor for you.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-start gap-4">
              <div className="w-full lg:w-[200px] shrink-0">
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-h-[100px] flex items-center w-full">
                {isPending && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="animate-spin h-5 w-5" />
                    Searching for the best tutor...
                  </div>
                )}
                {!isPending && recommendation && (
                  <div className="flex flex-col lg:flex-row items-start gap-4 w-full">
                    <div className="w-full lg:w-auto">
                      {(() => {
                        const fullTutor = onlineTutors.find(t => t.id === recommendation.tutor.id) || onlineTutors[0];
                        return <TutorCard tutor={fullTutor} compact />;
                      })()}
                    </div>
                    <div className="flex-1 prose prose-sm max-w-none dark:prose-invert font-body">
                      {recommendation.recommendation}
                    </div>
                  </div>
                )}
                {!isPending && !recommendation && (
                  <p className="text-sm text-muted-foreground">Could not find a recommendation for this subject.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Find Your Perfect Tutor
                </CardTitle>
                <CardDescription>
                  Search and filter from our {onlineTutors.length} expert tutors
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tutors by name, subject, or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="subject-filter" className="text-sm font-medium">Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {uniqueSubjects.map((sub) => (
                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="rating-filter" className="text-sm font-medium">Rating</Label>
                  <Select value={selectedRating} onValueChange={setSelectedRating}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Ratings" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="4.5+">4.5+ Stars</SelectItem>
                      <SelectItem value="4.0+">4.0+ Stars</SelectItem>
                      <SelectItem value="3.5+">3.5+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="availability-filter" className="text-sm font-medium">Availability</Label>
                  <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tutors</SelectItem>
                      <SelectItem value="available">Available Now</SelectItem>
                      <SelectItem value="busy">Currently Busy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price-filter" className="text-sm font-medium">Price Range</Label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="budget">Budget ($30-35/hr)</SelectItem>
                      <SelectItem value="mid">Mid-range ($35-45/hr)</SelectItem>
                      <SelectItem value="premium">Premium ($45+/hr)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {(searchTerm || selectedSubject !== 'all' || selectedRating !== 'all' || selectedAvailability !== 'all' || priceRange !== 'all') && (
                  <>
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    {searchTerm && <Badge variant="secondary">Search: {searchTerm}</Badge>}
                    {selectedSubject !== 'all' && <Badge variant="secondary">Subject: {selectedSubject}</Badge>}
                    {selectedRating !== 'all' && <Badge variant="secondary">Rating: {selectedRating}</Badge>}
                    {selectedAvailability !== 'all' && <Badge variant="secondary">Availability: {selectedAvailability}</Badge>}
                    {priceRange !== 'all' && <Badge variant="secondary">Price: {priceRange}</Badge>}
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear all
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {filteredTutors.length} Tutor{filteredTutors.length !== 1 ? 's' : ''} Found
              </CardTitle>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Sort by <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Rating (High to Low)</DropdownMenuItem>
                    <DropdownMenuItem>Price (Low to High)</DropdownMenuItem>
                    <DropdownMenuItem>Price (High to Low)</DropdownMenuItem>
                    <DropdownMenuItem>Experience</DropdownMenuItem>
                    <DropdownMenuItem>Availability</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTutors.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tutors found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button onClick={clearFilters}>Clear all filters</Button>
              </div>
            ) : (
              <div className={cn(
                viewMode === 'grid' 
                  ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "space-y-4"
              )}>
                {filteredTutors.map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor} compact={viewMode === 'list'} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
