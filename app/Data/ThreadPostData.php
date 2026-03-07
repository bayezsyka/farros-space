<?php

namespace App\Data;

class ThreadPostData
{
    public function __construct(
        public readonly ?int $id,
        public readonly ?int $user_id,
        public readonly ?string $title,
        public readonly ?string $slug,
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
        public readonly ?array $user = null,
        public readonly ?array $comments = null,
    ) {}

    public static function fromModel(\App\Models\ThreadPost $model): self
    {
        return new self(
            id: $model->id,
            user_id: $model->user_id,
            title: $model->title,
            slug: $model->slug,
            content: $model->content,
            image_url: $model->image_url,
            likes_count: (int) ($model->likes_count ?? 0),
            shares_count: (int) ($model->shares_count ?? 0),
            visibility: $model->visibility ?? 'public',
            allow_comments: (bool) ($model->allow_comments ?? true),
            comments_count: (int) ($model->comments_count ?? 0),
            tags: $model->tags,
            published_at: $model->published_at?->toIso8601String(),
            created_at: $model->created_at?->toIso8601String(),
            user: $model->user ? [
                'id' => $model->user->id,
                'name' => $model->user->name,
                'avatar' => $model->user->avatar,
            ] : null,
            comments: $model->relationLoaded('comments') ? $model->comments->map(function ($c) {
                return [
                    'id' => $c->id,
                    'content' => $c->content,
                    'created_at' => $c->created_at?->toIso8601String(),
                    'user' => $c->user ? [
                        'id' => $c->user->id,
                        'name' => $c->user->name,
                        'avatar' => $c->user->avatar,
                    ] : null,
                ];
            })->toArray() : null,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
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
            'user' => $this->user,
            'comments' => $this->comments,
        ];
    }
}
