'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash, FileText } from 'lucide-react';
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import { User } from '@supabase/supabase-js';

interface Post {
  id: number;
  title: string;
  content: string | null;
}

interface PostsProps {
  user: User;
}

export default function Posts({ user }: PostsProps) {
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const { toast } = useToast();

  const utils = api.useUtils();

  const { data: posts, isLoading, error: fetchError } = api.posts.getAll.useQuery();

  useEffect(() => {
    if (fetchError) {
      console.error("Error fetching posts:", fetchError);
      toast({
        title: "Error",
        description: fetchError.message,
        variant: "destructive",
      });
    }
  }, [fetchError, toast]);

  const createPost = api.posts.create.useMutation({
    onSuccess: async () => {
      await utils.posts.getAll.invalidate();
      setNewPost({ title: '', content: '' });
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePost = api.posts.update.useMutation({
    onSuccess: async () => {
      await utils.posts.getAll.invalidate();
      setEditingPost(null);
      toast({
        title: "Success",
        description: "Post updated successfully!",
      });
    },
    onError: (error) => {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletePost = api.posts.delete.useMutation({
    onSuccess: async () => {
      await utils.posts.getAll.invalidate();
      toast({
        title: "Success",
        description: "Post deleted successfully!",
      });
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreatePost = () => {
    if (newPost.title && newPost.content) {
      createPost.mutate({ title: newPost.title, content: newPost.content });
    }
  };

  const handleUpdatePost = () => {
    if (editingPost) {
      updatePost.mutate({ id: editingPost.id, title: editingPost.title, content: editingPost.content });
    }
  };

  const handleDeletePost = (id: number) => {
    deletePost.mutate({ id });
  };

  if (isLoading) {
    return (
      <div className="main-content">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="header">
        <h1>Blog Management</h1>
        <div className="status-indicator status-active">
          <i className="fas fa-circle"></i> Sistema Activo
        </div>
      </div>

      <div className="container mx-auto p-4">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Post Title"
              value={editingPost ? editingPost.title : newPost.title}
              onChange={(e) => editingPost 
                ? setEditingPost({...editingPost, title: e.target.value})
                : setNewPost({...newPost, title: e.target.value})
              }
              className="mb-4"
            />
            <Textarea
              placeholder="Post Content"
              value={editingPost ? editingPost.content || '' : newPost.content}
              onChange={(e) => editingPost
                ? setEditingPost({...editingPost, content: e.target.value})
                : setNewPost({...newPost, content: e.target.value})
              }
              className="mb-4"
            />
          </CardContent>
          <CardFooter>
            {editingPost ? (
              <Button onClick={handleUpdatePost}>Update Post</Button>
            ) : (
              <Button onClick={handleCreatePost}>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Post
              </Button>
            )}
          </CardFooter>
        </Card>

        {!posts || posts.length === 0 ? (
          <Card className="text-center p-6">
            <CardContent>
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No Posts Yet</h2>
              <p className="text-muted-foreground mb-4">
                Create your first post to get started!
              </p>
              <Button onClick={() => document.querySelector('input')?.focus()}>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map(post => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{post.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setEditingPost(post)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDeletePost(post.id)}>
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}