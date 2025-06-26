import React from 'react';
import { Button } from '@/components/ui/button';

interface BlogPostCardProps {
  post: {
    title: string;
    excerpt: string;
    date: string;
    author: string;
    image: string;
  };
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105">
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-56 object-cover rounded-t-lg"
      />
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{post.date}</span>
          <span>By {post.author}</span>
        </div>
        <Button variant="link" className="text-primary-600 hover:text-primary-700 mt-4">
          Leer más
        </Button>
      </div>
    </div>
  );
};
