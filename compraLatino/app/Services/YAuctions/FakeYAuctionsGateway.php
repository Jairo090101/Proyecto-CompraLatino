<?php

namespace App\Services\YAuctions;

use App\Models\Order;

class FakeYAuctionsGateway implements YAuctionsGateway
{
    public function placePurchase(Order $order): array
    {
        return [
            'reference' => 'YA-'.$order->id,
            'status' => 'submitted',
        ];
    }

    public function getItemStatus(string $reference): string
    {
        return str_starts_with($reference, 'YA-') ? 'submitted' : 'unknown';
    }
}
