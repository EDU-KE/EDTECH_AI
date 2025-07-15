"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { 
    BookOpen, 
    Bookmark, 
    HighlighterIcon, 
    MessageCircle, 
    Settings, 
    Volume2, 
    ZoomIn, 
    ZoomOut,
    Sun,
    Moon,
    Type,
    Save,
    Share2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface BookNote {
    id: string;
    content: string;
    page: number;
    timestamp: Date;
    highlight?: string;
}

interface ReadingSettings {
    fontSize: number;
    fontFamily: string;
    theme: 'light' | 'dark' | 'sepia';
    lineHeight: number;
    speechRate: number;
}

interface EnhancedBookReaderProps {
    book: {
        id: string;
        title: string;
        author: string;
        content: string;
    };
    onProgressUpdate: (progress: number) => void;
}

export function EnhancedBookReader({ book, onProgressUpdate }: EnhancedBookReaderProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [notes, setNotes] = useState<BookNote[]>([]);
    const [newNote, setNewNote] = useState('');
    const [settings, setSettings] = useState<ReadingSettings>({
        fontSize: 16,
        fontFamily: 'serif',
        theme: 'light',
        lineHeight: 1.5,
        speechRate: 1
    });
    const [isReading, setIsReading] = useState(false);
    const [bookmarks, setBookmarks] = useState<number[]>([]);
    const [selectedText, setSelectedText] = useState('');
    const contentRef = useRef<HTMLDivElement>(null);

    const totalPages = 10; // Mock total pages

    useEffect(() => {
        const progress = (currentPage / totalPages) * 100;
        onProgressUpdate(progress);
    }, [currentPage, totalPages, onProgressUpdate]);

    const addNote = () => {
        if (!newNote.trim()) return;
        
        const note: BookNote = {
            id: Date.now().toString(),
            content: newNote,
            page: currentPage,
            timestamp: new Date(),
            highlight: selectedText
        };
        
        setNotes(prev => [...prev, note]);
        setNewNote('');
        setSelectedText('');
    };

    const toggleBookmark = () => {
        setBookmarks(prev => 
            prev.includes(currentPage) 
                ? prev.filter(p => p !== currentPage)
                : [...prev, currentPage]
        );
    };

    const startTextToSpeech = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(book.content);
            utterance.rate = settings.speechRate;
            speechSynthesis.speak(utterance);
            setIsReading(true);
            
            utterance.onend = () => setIsReading(false);
        }
    };

    const stopTextToSpeech = () => {
        speechSynthesis.cancel();
        setIsReading(false);
    };

    const handleTextSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.toString()) {
            setSelectedText(selection.toString());
        }
    };

    const getThemeClasses = () => {
        switch (settings.theme) {
            case 'dark':
                return 'bg-gray-900 text-white';
            case 'sepia':
                return 'bg-amber-50 text-amber-900';
            default:
                return 'bg-white text-black';
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Reading Settings Panel */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Reading Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Font Size</label>
                            <div className="flex items-center gap-2 mt-2">
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setSettings(prev => ({ ...prev, fontSize: Math.max(12, prev.fontSize - 2) }))}
                                >
                                    <ZoomOut className="h-4 w-4" />
                                </Button>
                                <span className="text-sm">{settings.fontSize}px</span>
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setSettings(prev => ({ ...prev, fontSize: Math.min(24, prev.fontSize + 2) }))}
                                >
                                    <ZoomIn className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Font Family</label>
                            <Select 
                                value={settings.fontFamily} 
                                onValueChange={(value) => setSettings(prev => ({ ...prev, fontFamily: value }))}
                            >
                                <SelectTrigger className="mt-2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="serif">Serif</SelectItem>
                                    <SelectItem value="sans-serif">Sans Serif</SelectItem>
                                    <SelectItem value="monospace">Monospace</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Theme</label>
                            <div className="flex gap-2 mt-2">
                                <Button 
                                    size="sm" 
                                    variant={settings.theme === 'light' ? 'default' : 'outline'}
                                    onClick={() => setSettings(prev => ({ ...prev, theme: 'light' }))}
                                >
                                    <Sun className="h-4 w-4" />
                                </Button>
                                <Button 
                                    size="sm" 
                                    variant={settings.theme === 'dark' ? 'default' : 'outline'}
                                    onClick={() => setSettings(prev => ({ ...prev, theme: 'dark' }))}
                                >
                                    <Moon className="h-4 w-4" />
                                </Button>
                                <Button 
                                    size="sm" 
                                    variant={settings.theme === 'sepia' ? 'default' : 'outline'}
                                    onClick={() => setSettings(prev => ({ ...prev, theme: 'sepia' }))}
                                >
                                    <Type className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Speech Rate</label>
                            <Slider
                                value={[settings.speechRate]}
                                onValueChange={([value]) => setSettings(prev => ({ ...prev, speechRate: value }))}
                                max={2}
                                min={0.5}
                                step={0.1}
                                className="mt-2"
                            />
                            <span className="text-xs text-muted-foreground">{settings.speechRate}x</span>
                        </div>

                        <div className="flex gap-2">
                            <Button 
                                size="sm" 
                                onClick={isReading ? stopTextToSpeech : startTextToSpeech}
                                variant={isReading ? 'destructive' : 'default'}
                            >
                                <Volume2 className="h-4 w-4 mr-2" />
                                {isReading ? 'Stop' : 'Read Aloud'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Reading Area */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                {book.title}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={toggleBookmark}
                                >
                                    <Bookmark className={`h-4 w-4 ${bookmarks.includes(currentPage) ? 'fill-current' : ''}`} />
                                </Button>
                                <Button size="sm" variant="outline">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>by {book.author}</span>
                            <span>Page {currentPage} of {totalPages}</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div 
                            ref={contentRef}
                            className={`prose max-w-none p-6 rounded-lg transition-colors ${getThemeClasses()}`}
                            style={{
                                fontSize: `${settings.fontSize}px`,
                                fontFamily: settings.fontFamily,
                                lineHeight: settings.lineHeight
                            }}
                            onMouseUp={handleTextSelection}
                        >
                            {book.content}
                        </div>
                        
                        {/* Page Navigation */}
                        <div className="flex justify-between items-center mt-6">
                            <Button 
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <div className="flex items-center gap-2">
                                {bookmarks.includes(currentPage) && (
                                    <Badge variant="secondary">
                                        <Bookmark className="h-3 w-3 mr-1" />
                                        Bookmarked
                                    </Badge>
                                )}
                                <span className="text-sm text-muted-foreground">
                                    {Math.round((currentPage / totalPages) * 100)}% Complete
                                </span>
                            </div>
                            <Button 
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Notes and Annotations Panel */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            Notes & Annotations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="notes" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="notes">Notes</TabsTrigger>
                                <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="notes" className="space-y-4">
                                {selectedText && (
                                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                                        <p className="text-sm font-medium">Selected Text:</p>
                                        <p className="text-sm italic">"{selectedText}"</p>
                                    </div>
                                )}
                                
                                <div>
                                    <Textarea
                                        placeholder="Add a note about this page..."
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        className="mb-2"
                                    />
                                    <Button onClick={addNote} size="sm" className="w-full">
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Note
                                    </Button>
                                </div>
                                
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {notes.map(note => (
                                        <div key={note.id} className="p-3 border rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge variant="outline">Page {note.page}</Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {note.timestamp.toLocaleDateString()}
                                                </span>
                                            </div>
                                            {note.highlight && (
                                                <p className="text-sm italic text-muted-foreground mb-1">
                                                    "{note.highlight}"
                                                </p>
                                            )}
                                            <p className="text-sm">{note.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                            
                            <TabsContent value="bookmarks">
                                <div className="space-y-2">
                                    {bookmarks.map(page => (
                                        <div 
                                            key={page} 
                                            className="flex justify-between items-center p-2 border rounded cursor-pointer hover:bg-muted/50"
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            <span className="text-sm">Page {page}</span>
                                            <Bookmark className="h-4 w-4 fill-current" />
                                        </div>
                                    ))}
                                    {bookmarks.length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center">
                                            No bookmarks yet
                                        </p>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
