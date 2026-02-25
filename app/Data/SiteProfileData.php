<?php

namespace App\Data;

class SiteProfileData
{
    public function __construct(
        public readonly string $key,
        public readonly mixed $value,
        public readonly string $type = 'text',
    ) {}

    public static function fromModel(\App\Models\SiteProfile $model): self
    {
        return new self(
            key: $model->key,
            value: $model->value,
            type: $model->type,
        );
    }

    public function toArray(): array
    {
        return [
            'key' => $this->key,
            'value' => $this->value,
            'type' => $this->type,
        ];
    }
}
