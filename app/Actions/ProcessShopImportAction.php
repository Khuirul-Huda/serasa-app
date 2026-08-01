<?php

/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

namespace App\Actions;

use App\Models\Shop;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProcessShopImportAction
{
    /**
     * Sanitize and process a list of shop import records.
     *
     * @param  array<int, array<string, mixed>>  $shops
     */
    public function execute(array $shops): int
    {
        $importedCount = 0;

        DB::transaction(function () use ($shops, &$importedCount) {
            foreach ($shops as $item) {
                $name = trim((string) ($item['name'] ?? ''));
                $ownerName = trim((string) ($item['owner_name'] ?? $item['ownerName'] ?? ''));

                if (empty($name) || empty($ownerName)) {
                    continue;
                }

                $dusun = $this->sanitizeDusun((string) ($item['dusun'] ?? ''));
                $phone = $this->sanitizePhone((string) ($item['phone'] ?? ''));
                $category = $this->sanitizeCategory((string) ($item['category'] ?? ''));
                $address = trim((string) ($item['address'] ?? "Dusun {$dusun}"));

                $id = ! empty($item['id']) ? (string) $item['id'] : ('shop-'.Str::slug($name));

                Shop::updateOrCreate(
                    ['id' => $id],
                    [
                        'name' => $name,
                        'owner_name' => $ownerName,
                        'description' => $item['description'] ?? ("UMKM {$name} Desa Samirono"),
                        'category' => $category,
                        'phone' => $phone,
                        'address' => $address,
                        'dusun' => $dusun,
                        'image' => $item['image'] ?? 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=800',
                        'logo' => $item['logo'] ?? 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=150',
                        'is_verified' => isset($item['is_verified']) ? (bool) $item['is_verified'] : true,
                        'lat' => isset($item['lat']) ? (float) $item['lat'] : -7.38,
                        'lng' => isset($item['lng']) ? (float) $item['lng'] : 110.42,
                        'nib' => isset($item['nib']) ? (bool) $item['nib'] : false,
                        'halal' => isset($item['halal']) ? (bool) $item['halal'] : false,
                        'pirt' => isset($item['pirt']) ? (bool) $item['pirt'] : false,
                    ]
                );

                $importedCount++;
            }
        });

        Cache::forget('app:settings');
        Cache::forget('app:categories');

        return $importedCount;
    }

    private function sanitizeDusun(string $dusunRaw): string
    {
        $lower = strtolower($dusunRaw);

        if (str_contains($lower, 'bentar')) {
            return 'Dusun Bentar';
        }
        if (str_contains($lower, 'surowono')) {
            return 'Dusun Surowono';
        }
        if (str_contains($lower, 'tawang')) {
            return 'Dusun Tawang';
        }

        return 'Dusun Samirono';
    }

    private function sanitizePhone(string $phoneRaw): string
    {
        $phone = preg_replace('/[^0-9]/', '', $phoneRaw) ?: '';

        if (str_starts_with($phone, '0')) {
            $phone = '62'.substr($phone, 1);
        }

        if (empty($phone)) {
            $phone = '6285725900000';
        }

        return $phone;
    }

    private function sanitizeCategory(string $categoryRaw): string
    {
        $lower = strtolower($categoryRaw);

        if (str_contains($lower, 'susu') || str_contains($lower, 'kuliner')) {
            return 'Kuliner & Olahan';
        }
        if (str_contains($lower, 'kerajinan') || str_contains($lower, 'kriya') || str_contains($lower, 'bambu')) {
            return 'Kerajinan & Kriya';
        }
        if (str_contains($lower, 'tani') || str_contains($lower, 'segar') || str_contains($lower, 'pertanian')) {
            return 'Hasil Tani Segar';
        }

        return ! empty($categoryRaw) ? trim($categoryRaw) : 'Kuliner & Olahan';
    }
}
