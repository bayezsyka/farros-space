<?php

namespace App\Actions;

use App\Contracts\ContentRepositoryInterface;


class GetLandingPageData
{
    public function __construct(
        protected ContentRepositoryInterface $repository
    ) {}

    public function execute(): array
    {
        $profile = $this->repository->getSiteProfile();
        $education = $this->repository->getEducation();


        $experiences = $this->repository->getExperiences();
        $marketplaceItems = $this->repository->getMarketplaceItems();

        return [
            'profile' => $profile,
            'education' => $education,

            'experiences' => $experiences,
            'marketplaceItems' => $marketplaceItems,
        ];
    }
}
