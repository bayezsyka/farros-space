<?php

namespace App\Contracts;

interface ContentRepositoryInterface
{
    public function getSiteProfile(): array;
    public function getEducation(): array;
    public function getThreadPosts(): array;
}
