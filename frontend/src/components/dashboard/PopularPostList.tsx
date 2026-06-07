import { PopularPostResponse } from '@/types/api/dashboard';
import Link from 'next/link';
import React from 'react';

interface PopularPostListProps {
  posts: PopularPostResponse[];
}

/** 인기 게시글 순위 목록 — 제목만 간결하게, 순위는 일반 번호 표기. */
export default function PopularPostList({ posts }: PopularPostListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg bg-gray-50">
        <p className="text-sm text-gray-500">아직 인기 게시글이 없습니다.</p>
      </div>
    );
  }

  return (
    <ol className="space-y-0.5">
      {posts.map((post, index) => (
        <li key={post.id}>
          <Link
            href={`/blog/${post.id}`}
            className="flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-gray-50"
          >
            <span className="w-5 shrink-0 text-right text-sm font-semibold tabular-nums text-gray-400">
              {index + 1}.
            </span>
            <span className="truncate text-sm text-gray-800">{post.title}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
