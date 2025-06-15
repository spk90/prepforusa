import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Community = () => {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "John Doe",
      avatar: "https://github.com/shadcn.png",
      content:
        "Just had my visa interview! The officer was very friendly and asked about my study plans.",
      timestamp: "2 hours ago",
      likes: 12,
      comments: 5,
    },
    {
      id: 2,
      author: "Jane Smith",
      avatar: "https://github.com/shadcn.png",
      content:
        "Preparing for my interview next week. Any tips for handling technical questions?",
      timestamp: "5 hours ago",
      likes: 8,
      comments: 3,
    },
  ]);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const newPostObj = {
      id: posts.length + 1,
      author: "Current User",
      avatar: "https://github.com/shadcn.png",
      content: newPost,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
    };

    setPosts([newPostObj, ...posts]);
    setNewPost("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Community</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Share Your Experience</CardTitle>
            <CardDescription>
              Connect with other applicants and share your journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePostSubmit} className="space-y-4">
              <Textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px]"
              />
              <Button type="submit">Post</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{post.author}</h3>
                        <p className="text-sm text-muted-foreground">
                          {post.timestamp}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2">{post.content}</p>
                    <div className="flex items-center space-x-4 mt-4">
                      <Button variant="ghost" size="sm">
                        Like ({post.likes})
                      </Button>
                      <Button variant="ghost" size="sm">
                        Comment ({post.comments})
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
