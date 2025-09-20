'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Grid, List, Loader2 } from 'lucide-react';
import { usePokemonData, useInfiniteScroll } from '@/hooks/usePokemonData';
import { PokemonFilters } from '@/components/pokemon/PokemonFilters';
import { PokemonCard } from '@/components/pokemon/PokemonCard';
import { SelectedPokemonPreview } from '@/components/pokemon/SelectedPokemonPreview';
import { useSelectedPokemonCount } from '@/store/pokemonStore';

export default function SelectPokemonPage() {
  console.log('SelectPokemonPage component loaded');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { filteredPokemon, loading, error, filteredCount, totalCount } = usePokemonData();
  const { displayedItems, hasMore, loadMore } = useInfiniteScroll(filteredPokemon, 50);
  const selectedCount = useSelectedPokemonCount();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">ポケモンデータを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            再試行
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  戻る
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  ポケモンを選ぶ
                </h1>
                <p className="text-sm text-gray-600">
                  {filteredCount.toLocaleString()}匹中{displayedItems.length.toLocaleString()}匹表示
                  {selectedCount > 0 && ` • ${selectedCount}/6匹選択中`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters and Pokemon List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filters */}
            <PokemonFilters />
            
            {/* Pokemon Grid */}
            {displayedItems.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg mb-2">
                  条件に一致するポケモンが見つかりません
                </p>
                <p className="text-gray-400 text-sm">
                  検索条件やフィルタを変更してお試しください
                </p>
              </div>
            ) : (
              <>
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4'
                    : 'grid grid-cols-1 sm:grid-cols-2 gap-4'
                }>
                  {displayedItems.map((pokemon) => (
                    <PokemonCard key={pokemon.id} pokemon={pokemon} />
                  ))}
                </div>
                
                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center py-8">
                    <Button onClick={loadMore} variant="outline">
                      さらに読み込む
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Sidebar - Selected Pokemon Preview */}
          <div className="lg:col-span-1">
            <SelectedPokemonPreview />
          </div>
        </div>
      </div>
    </div>
  );
}