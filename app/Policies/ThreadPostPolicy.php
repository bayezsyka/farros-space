<?php

namespace App\Policies;

use App\Models\ThreadPost;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ThreadPostPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, ThreadPost $threadPost): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ThreadPost $threadPost): bool
    {
        return $user->id === $threadPost->user_id || $user->is_admin === true;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ThreadPost $threadPost): bool
    {
        return $user->id === $threadPost->user_id || $user->is_admin === true;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ThreadPost $threadPost): bool
    {
        return $user->is_admin === true;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ThreadPost $threadPost): bool
    {
        return $user->is_admin === true;
    }
}
