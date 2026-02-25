<?php

namespace App\Data;

class ThreadPostData
{
    public function __construct(
        public readonly ?int $id,
        public readonly ?string $title,
        public readonly string $slug,
        public readonly string $content,
        public readonly ?string $image_url = null,
        public readonly int $likes_count = 0,
        public readonly int $shares_count = 0,
        public readonly string $visibility = 'public',
        public readonly bool $allow_comments = true,
        public readonly int $comments_count = 0,
        public readonly ?string $tags = null,
        public readonly ?string $published_at = null,
        public readonly ?string $created_at = null,
    ) {}

    public static function fromModel(\App\Models\ThreadPost $model): self
    {
        return new self(
            id: $model->id,
            title: $model->title,
            slug: $model->slug,
            content: $model->content,
            image_url: $model->image_url,
            likes_count: $model->likes_count,
            shares_count: $model->shares_count,
            visibility: $model->visibility,
            allow_comments: $model->allow_comments,
            comments_count: (int) ($model->comments_count ?? 0),
            tags: $model->tags,
            published_at: $model->published_at?->toIso8601String(),
            created_at: $model->created_at?->toIso8601String(),
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'content' => $this->content,
            'image_url' => $this->image_url,
            'likes_count' => $this->likes_count,
            'shares_count' => $this->shares_count,
            'visibility' => $this->visibility,
            'allow_comments' => $this->allow_comments,
            'comments_count' => $this->comments_count,
            'tags' => $this->tags,
            'published_at' => $this->published_at,
            'created_at' => $this->created_at,
        ];
    }
}
