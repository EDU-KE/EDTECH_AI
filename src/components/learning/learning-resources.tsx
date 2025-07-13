"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search,
  BookOpen,
  Download,
  Eye,
  Clock,
  Star,
  Filter,
  FileText,
  Video,
  Headphones,
  Link,
  Tag
} from "lucide-react"

interface LearningResource {
  id: string
  title: string
  description: string
  type: 'article' | 'video' | 'podcast' | 'document' | 'link' | 'book'
  subject: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string // e.g., "15 min", "2 hours"
  rating: number
  tags: string[]
  url?: string
  thumbnailUrl?: string
  author: string
  publishedAt: Date
  downloadable: boolean
  free: boolean
}

interface LearningResourcesProps {
  resources: LearningResource[]
  subjects: string[]
  onResourceClick: (resource: LearningResource) => void
  onDownload?: (resource: LearningResource) => void
}

export function LearningResources({ 
  resources, 
  subjects, 
  onResourceClick, 
  onDownload 
}: LearningResourcesProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'duration' | 'date'>('relevance')

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article': return FileText
      case 'video': return Video
      case 'podcast': return Headphones
      case 'document': return FileText
      case 'link': return Link
      case 'book': return BookOpen
      default: return FileText
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredResources = resources
    .filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject
      const matchesType = selectedType === 'all' || resource.type === selectedType
      const matchesDifficulty = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty
      
      return matchesSearch && matchesSubject && matchesType && matchesDifficulty
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'duration':
          // Simple duration comparison (this could be more sophisticated)
          return a.duration.localeCompare(b.duration)
        case 'date':
          return b.publishedAt.getTime() - a.publishedAt.getTime()
        default:
          return 0 // relevance - could implement a relevance score
      }
    })

  const resourceTypes = ['all', 'article', 'video', 'podcast', 'document', 'link', 'book']
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced']

  const featuredResources = resources.filter(r => r.rating >= 4.5).slice(0, 3)
  const recentResources = resources
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, 6)

  const ResourceCard = ({ resource }: { resource: LearningResource }) => {
    const Icon = getResourceIcon(resource.type)
    
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onResourceClick(resource)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <Badge variant="outline" className="text-xs">
                {resource.type}
              </Badge>
              {!resource.free && (
                <Badge variant="secondary" className="text-xs">
                  Premium
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {resource.rating}
            </div>
          </div>
          <CardTitle className="text-base leading-tight line-clamp-2">
            {resource.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <CardDescription className="line-clamp-2">
            {resource.description}
          </CardDescription>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(resource.difficulty)} variant="outline">
                {resource.difficulty}
              </Badge>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                {resource.duration}
              </div>
            </div>
            <div className="text-muted-foreground">
              {resource.author}
            </div>
          </div>
          
          {resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {resource.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {resource.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{resource.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button size="sm" className="flex-1" onClick={(e) => {
              e.stopPropagation()
              onResourceClick(resource)
            }}>
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
            {resource.downloadable && onDownload && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  onDownload(resource)
                }}
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Learning Resources
          </CardTitle>
          <CardDescription>
            Discover curated learning materials and resources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources, topics, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                {resourceTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Rating</option>
                <option value="duration">Duration</option>
                <option value="date">Latest</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {filteredResources.length} resources found
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
          
          {filteredResources.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-medium mb-2">No resources found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or filters
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm('')
                  setSelectedSubject('all')
                  setSelectedType('all')
                  setSelectedDifficulty('all')
                }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="featured" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Hand-picked high-quality resources
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Latest additions to our resource library
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
