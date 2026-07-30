import { useState, useMemo } from 'react';
import type { Shop } from '@/types';

export type SortOption = 'featured' | 'most-products' | 'name-asc';
export type ViewMode = 'grid' | 'list';

export function useShopFilters(shops: (Shop & { productCount?: number })[]) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDusun, setSelectedDusun] = useState('all');
    const [sortBy, setSortBy] = useState<SortOption>('featured');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    const uniqueDusuns = useMemo(() => {
        const dusuns = new Set<string>();
        shops.forEach((s) => {
            if (s.dusun) dusuns.add(s.dusun);
        });
        return Array.from(dusuns).sort();
    }, [shops]);

    const filteredShops = useMemo(() => {
        let result = shops.filter((shop) => {
            const query = searchQuery.toLowerCase().trim();
            const matchSearch =
                !query ||
                shop.name.toLowerCase().includes(query) ||
                shop.ownerName.toLowerCase().includes(query) ||
                shop.dusun.toLowerCase().includes(query);

            const matchCategory =
                selectedCategory === 'all' || shop.category === selectedCategory;

            const matchDusun =
                selectedDusun === 'all' || shop.dusun === selectedDusun;

            return matchSearch && matchCategory && matchDusun;
        });

        // Apply sorting
        if (sortBy === 'most-products') {
            result = [...result].sort((a, b) => (b.productCount || 0) - (a.productCount || 0));
        } else if (sortBy === 'name-asc') {
            result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        }

        return result;
    }, [shops, searchQuery, selectedCategory, selectedDusun, sortBy]);

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSelectedDusun('all');
        setSortBy('featured');
    };

    return {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedDusun,
        setSelectedDusun,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        filteredShops,
        uniqueDusuns,
        resetFilters,
    };
}
