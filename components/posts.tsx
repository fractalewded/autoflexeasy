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
          <span className="status-dot"></span> Sistema Activo
        </div>
      </div>

      <div className="dashboard-content">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="form-group">
              <Input
                placeholder="Post Title"
                value={editingPost ? editingPost.title : newPost.title}
                onChange={(e) => editingPost 
                  ? setEditingPost({...editingPost, title: e.target.value})
                  : setNewPost({...newPost, title: e.target.value})
                }
                className="mb-4"
              />
            </div>
            <div className="form-group">
              <Textarea
                placeholder="Post Content"
                value={editingPost ? editingPost.content || '' : newPost.content}
                onChange={(e) => editingPost
                  ? setEditingPost({...editingPost, content: e.target.value})
                  : setNewPost({...newPost, content: e.target.value})
                }
                className="mb-4"
              />
            </div>
          </CardContent>
          <CardFooter>
            {editingPost ? (
              <Button onClick={handleUpdatePost} className="btn btn-primary">
                Update Post
              </Button>
            ) : (
              <Button onClick={handleCreatePost} className="btn btn-primary">
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
              <Button 
                onClick={() => document.querySelector('input')?.focus()}
                className="btn btn-primary"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="blog-grid">
            {posts.map(post => (
              <Card key={post.id} className="blog-card">
                <CardHeader>
                  <CardTitle className="blog-title">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="blog-content">{post.content}</p>
                </CardContent>
                <CardFooter className="blog-actions">
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingPost(post)}
                    className="btn btn-secondary"
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDeletePost(post.id)}
                    className="btn btn-error"
                  >
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .main-content {
          flex: 1;
          margin-left: 250px;
          padding: 30px;
          background-color: #f8fafc;
          min-height: 100vh;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #2563eb;
        }
        
        .status-indicator {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .status-active {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #10b981;
          margin-right: 8px;
        }
        
        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .blog-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .blog-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .blog-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
        }
        
        .blog-content {
          color: #64748b;
          line-height: 1.5;
        }
        
        .blog-actions {
          display: flex;
          justify-content: space-between;
          padding-top: 15px;
          border-top: 1px solid #e2e8f0;
        }
        
        .btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
        }
        
        .btn-primary {
          background-color: #2563eb;
          color: white;
          border: none;
        }
        
        .btn-primary:hover {
          background-color: #1e40af;
        }
        
        .btn-secondary {
          background-color: transparent;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }
        
        .btn-secondary:hover {
          background-color: #f1f5f9;
        }
        
        .btn-error {
          background-color: #ef4444;
          color: white;
          border: none;
        }
        
        .btn-error:hover {
          background-color: #dc2626;
        }
        
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            padding: 20px;
          }
          
          .header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          
          .blog-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}