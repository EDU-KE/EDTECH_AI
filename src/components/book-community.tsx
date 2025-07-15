"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
    MessageCircle, 
    ThumbsUp, 
    Star, 
    Users, 
    BookOpen,
    Send,
    Reply,
    Heart,
    Share2,
    Flag
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Review {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    rating: number;
    content: string;
    timestamp: Date;
    likes: number;
    replies: Reply[];
    isLiked?: boolean;
}

interface Reply {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    timestamp: Date;
    likes: number;
    isLiked?: boolean;
}

interface Discussion {
    id: string;
    title: string;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    timestamp: Date;
    replies: number;
    likes: number;
    tags: string[];
    isLiked?: boolean;
}

interface BookCommunityProps {
    bookId: string;
    bookTitle: string;
}

export function BookCommunity({ bookId, bookTitle }: BookCommunityProps) {
    const [newReview, setNewReview] = useState('');
    const [newRating, setNewRating] = useState(0);
    const [newDiscussion, setNewDiscussion] = useState('');
    const [discussionTitle, setDiscussionTitle] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');

    // Mock data
    const [reviews, setReviews] = useState<Review[]>([
        {
            id: '1',
            userId: 'user1',
            userName: 'Sarah Chen',
            userAvatar: 'https://placehold.co/40x40.png',
            rating: 5,
            content: 'This book completely changed my understanding of algebra. The explanations are clear and the examples are practical. Highly recommend for anyone struggling with the subject!',
            timestamp: new Date('2024-07-10'),
            likes: 12,
            replies: [
                {
                    id: 'r1',
                    userId: 'user2',
                    userName: 'Mike Johnson',
                    userAvatar: 'https://placehold.co/40x40.png',
                    content: 'I totally agree! The step-by-step approach really helped me.',
                    timestamp: new Date('2024-07-11'),
                    likes: 3
                }
            ],
            isLiked: false
        },
        {
            id: '2',
            userId: 'user3',
            userName: 'Elena Rodriguez',
            userAvatar: 'https://placehold.co/40x40.png',
            rating: 4,
            content: 'Great content overall, but I wish there were more practice problems. The theory is solid though.',
            timestamp: new Date('2024-07-08'),
            likes: 8,
            replies: [],
            isLiked: true
        }
    ]);

    const [discussions, setDiscussions] = useState<Discussion[]>([
        {
            id: '1',
            title: 'Chapter 5 - Quadratic Functions Help',
            userId: 'user4',
            userName: 'Alex Kim',
            userAvatar: 'https://placehold.co/40x40.png',
            content: 'I\'m having trouble with the vertex form of quadratic functions. Can anyone explain the concept better?',
            timestamp: new Date('2024-07-12'),
            replies: 7,
            likes: 5,
            tags: ['homework', 'quadratic', 'help'],
            isLiked: false
        },
        {
            id: '2',
            title: 'Real-world applications discussion',
            userId: 'user5',
            userName: 'Jordan Taylor',
            userAvatar: 'https://placehold.co/40x40.png',
            content: 'Let\'s discuss how we can apply the concepts from this book in real life. I\'ll start with architecture...',
            timestamp: new Date('2024-07-11'),
            replies: 15,
            likes: 23,
            tags: ['applications', 'discussion', 'real-world'],
            isLiked: true
        }
    ]);

    const studyGroups = [
        {
            id: '1',
            name: 'Algebra Study Circle',
            members: 12,
            description: 'Weekly study sessions for algebra problems',
            nextMeeting: 'Tomorrow 7 PM',
            isJoined: false
        },
        {
            id: '2',
            name: 'Math Exam Prep',
            members: 8,
            description: 'Preparing for upcoming mathematics exams',
            nextMeeting: 'Friday 6 PM',
            isJoined: true
        }
    ];

    const submitReview = () => {
        if (!newReview.trim() || newRating === 0) return;

        const review: Review = {
            id: Date.now().toString(),
            userId: 'current-user',
            userName: 'You',
            userAvatar: 'https://placehold.co/40x40.png',
            rating: newRating,
            content: newReview,
            timestamp: new Date(),
            likes: 0,
            replies: []
        };

        setReviews(prev => [review, ...prev]);
        setNewReview('');
        setNewRating(0);
    };

    const submitDiscussion = () => {
        if (!discussionTitle.trim() || !newDiscussion.trim()) return;

        const discussion: Discussion = {
            id: Date.now().toString(),
            title: discussionTitle,
            userId: 'current-user',
            userName: 'You',
            userAvatar: 'https://placehold.co/40x40.png',
            content: newDiscussion,
            timestamp: new Date(),
            replies: 0,
            likes: 0,
            tags: []
        };

        setDiscussions(prev => [discussion, ...prev]);
        setDiscussionTitle('');
        setNewDiscussion('');
    };

    const StarRating = ({ rating, interactive = false, onRatingChange }: { rating: number; interactive?: boolean; onRatingChange?: (rating: number) => void }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`h-4 w-4 ${
                        star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
                    onClick={() => interactive && onRatingChange && onRatingChange(star)}
                />
            ))}
        </div>
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Community for "{bookTitle}"
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="reviews" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="reviews">Reviews</TabsTrigger>
                            <TabsTrigger value="discussions">Discussions</TabsTrigger>
                            <TabsTrigger value="study-groups">Study Groups</TabsTrigger>
                        </TabsList>

                        {/* Reviews Tab */}
                        <TabsContent value="reviews" className="space-y-6">
                            {/* Write Review */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Write a Review</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium">Your Rating</label>
                                        <div className="mt-1">
                                            <StarRating 
                                                rating={newRating} 
                                                interactive 
                                                onRatingChange={setNewRating} 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Your Review</label>
                                        <Textarea
                                            value={newReview}
                                            onChange={(e) => setNewReview(e.target.value)}
                                            placeholder="Share your thoughts about this book..."
                                            className="mt-1"
                                        />
                                    </div>
                                    <Button onClick={submitReview} disabled={!newReview.trim() || newRating === 0}>
                                        <Send className="h-4 w-4 mr-2" />
                                        Submit Review
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Reviews List */}
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <Card key={review.id}>
                                        <CardContent className="pt-6">
                                            <div className="flex items-start gap-4">
                                                <Avatar>
                                                    <AvatarImage src={review.userAvatar} />
                                                    <AvatarFallback>{review.userName[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h4 className="font-semibold">{review.userName}</h4>
                                                        <StarRating rating={review.rating} />
                                                        <span className="text-sm text-muted-foreground">
                                                            {review.timestamp.toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm mb-3">{review.content}</p>
                                                    <div className="flex items-center gap-4">
                                                        <Button variant="ghost" size="sm">
                                                            <ThumbsUp className={`h-4 w-4 mr-1 ${review.isLiked ? 'fill-current' : ''}`} />
                                                            {review.likes}
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm"
                                                            onClick={() => setReplyingTo(review.id)}
                                                        >
                                                            <Reply className="h-4 w-4 mr-1" />
                                                            Reply
                                                        </Button>
                                                        <Button variant="ghost" size="sm">
                                                            <Share2 className="h-4 w-4 mr-1" />
                                                            Share
                                                        </Button>
                                                    </div>

                                                    {/* Replies */}
                                                    {review.replies.map((reply) => (
                                                        <div key={reply.id} className="mt-4 ml-8 p-3 bg-muted/50 rounded-lg">
                                                            <div className="flex items-start gap-3">
                                                                <Avatar className="h-6 w-6">
                                                                    <AvatarImage src={reply.userAvatar} />
                                                                    <AvatarFallback>{reply.userName[0]}</AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <h5 className="text-sm font-medium">{reply.userName}</h5>
                                                                        <span className="text-xs text-muted-foreground">
                                                                            {reply.timestamp.toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm">{reply.content}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {/* Reply Form */}
                                                    {replyingTo === review.id && (
                                                        <div className="mt-4 ml-8">
                                                            <Textarea
                                                                value={replyContent}
                                                                onChange={(e) => setReplyContent(e.target.value)}
                                                                placeholder="Write a reply..."
                                                                className="mb-2"
                                                            />
                                                            <div className="flex gap-2">
                                                                <Button size="sm">Post Reply</Button>
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="outline"
                                                                    onClick={() => setReplyingTo(null)}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Discussions Tab */}
                        <TabsContent value="discussions" className="space-y-6">
                            {/* Start Discussion */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Start a Discussion</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium">Discussion Title</label>
                                        <input
                                            type="text"
                                            value={discussionTitle}
                                            onChange={(e) => setDiscussionTitle(e.target.value)}
                                            placeholder="What would you like to discuss?"
                                            className="w-full mt-1 px-3 py-2 border rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Content</label>
                                        <Textarea
                                            value={newDiscussion}
                                            onChange={(e) => setNewDiscussion(e.target.value)}
                                            placeholder="Start the conversation..."
                                            className="mt-1"
                                        />
                                    </div>
                                    <Button onClick={submitDiscussion} disabled={!discussionTitle.trim() || !newDiscussion.trim()}>
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Start Discussion
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Discussions List */}
                            <div className="space-y-4">
                                {discussions.map((discussion) => (
                                    <Card key={discussion.id} className="hover:shadow-md transition-shadow cursor-pointer">
                                        <CardContent className="pt-6">
                                            <div className="flex items-start gap-4">
                                                <Avatar>
                                                    <AvatarImage src={discussion.userAvatar} />
                                                    <AvatarFallback>{discussion.userName[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold mb-1">{discussion.title}</h3>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-sm text-muted-foreground">by {discussion.userName}</span>
                                                        <span className="text-sm text-muted-foreground">•</span>
                                                        <span className="text-sm text-muted-foreground">
                                                            {discussion.timestamp.toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm mb-3">{discussion.content}</p>
                                                    <div className="flex items-center gap-4 mb-3">
                                                        {discussion.tags.map((tag) => (
                                                            <Badge key={tag} variant="secondary" className="text-xs">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                            <MessageCircle className="h-4 w-4" />
                                                            {discussion.replies} replies
                                                        </span>
                                                        <Button variant="ghost" size="sm">
                                                            <ThumbsUp className={`h-4 w-4 mr-1 ${discussion.isLiked ? 'fill-current' : ''}`} />
                                                            {discussion.likes}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Study Groups Tab */}
                        <TabsContent value="study-groups" className="space-y-4">
                            {studyGroups.map((group) => (
                                <Card key={group.id}>
                                    <CardContent className="pt-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-semibold mb-1">{group.name}</h3>
                                                <p className="text-sm text-muted-foreground mb-2">{group.description}</p>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="h-4 w-4" />
                                                        {group.members} members
                                                    </span>
                                                    <span>Next: {group.nextMeeting}</span>
                                                </div>
                                            </div>
                                            <Button variant={group.isJoined ? "outline" : "default"}>
                                                {group.isJoined ? "Leave Group" : "Join Group"}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
