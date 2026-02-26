<?php

namespace App\Actions;

use App\Contracts\ContentRepositoryInterface;
use App\Data\ThreadPostData;
use App\Models\ThreadPost;

class GetLandingPageData
{
    public function __construct(
        protected ContentRepositoryInterface $repository
    ) {}

    public function execute(): array
    {
        $profile = $this->repository->getSiteProfile();
        $education = $this->repository->getEducation();

        // Use DTO for threads, filter by public visibility
        $threads = collect($this->repository->getThreadPosts())
            ->map(fn($post) => ThreadPostData::fromModel($post)->toArray())
            ->values()
            ->toArray();

        $publicThreads = collect($this->repository->getPublicThreads())
            ->map(fn($post) => ThreadPostData::fromModel($post)->toArray())
            ->values()
            ->toArray();

        return [
            'profile' => $profile,
            'education' => $education,
            'latestThreads' => array_slice($threads, 0, 10),
            'publicThreads' => array_slice($publicThreads, 0, 10),
        ];
    }
}
