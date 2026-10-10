<?php

namespace App\Services\YAuctions;

use App\Models\Order;

interface YAuctionsGateway
{
    /** @return array{reference: string, status: string} */
    public function placePurchase(Order $order): array;

    public function getItemStatus(string $reference): string;
}
