<?php

namespace App\Contracts;

interface ContentRepositoryInterface
{
    public function getSiteProfile(): array;
    public function getEducation(): array;
    public function getThreadPosts(): array;
    public function getPublicThreads(): array;
    public function getExperiences(): array;
    public function getMarketplaceItems(): array;
}
