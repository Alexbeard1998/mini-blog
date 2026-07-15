import React from 'react'

const PostListSkeleton = () => {
  return (
    <div className='space-y-4 mt-6 animate-pulse'>
      {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="hp-4 bg-surface rounded-lg">
            <div className='h-6 bg-border rounded w-3/4 mb-2'></div>
            <div className='h-6 bg-border rounded w-1/3 mb-3'></div>
            <div className='h-6 bg-border rounded w-full mb-1'></div>
            <div className='h-6 bg-border rounded w-full mb-1'></div>
            <div className='h-6 bg-border rounded w-2/3'></div>
          </div>
        ))}
    </div>
  )
}

export default PostListSkeleton 
