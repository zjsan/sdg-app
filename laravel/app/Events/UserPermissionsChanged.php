<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class UserPermissionsChanged
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $userId;
    public $message;

    /**
     * Create a new event instance.
     */
    public function __construct(User $user, string $message)
    {
        //
        $this->userId = $user->id;
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    /**
     * Broadcast on a private channel unique to the affected user.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("user.security.{$this->userId}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'permissions.updated';
    }
    
}
