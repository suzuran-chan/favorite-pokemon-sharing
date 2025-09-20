'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { usePokemonStore, useSearchFilters } from '@/store/pokemonStore';
import { POKEMON_TYPE_COLORS } from '@/types/pokemon';
import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

const POKEMON_TYPES = Object.keys(POKEMON_TYPE_COLORS).filter(type => 
  !['unknown', 'shadow'].includes(type)
);

const GENERATIONS = [
  { value: 1, label: '第1世代 (カントー)' },
  { value: 2, label: '第2世代 (ジョウト)' },
  { value: 3, label: '第3世代 (ホウエン)' },
  { value: 4, label: '第4世代 (シンオウ)' },
  { value: 5, label: '第5世代 (イッシュ)' },
  { value: 6, label: '第6世代 (カロス)' },
  { value: 7, label: '第7世代 (アローラ)' },
  { value: 8, label: '第8世代 (ガラル)' },
  { value: 9, label: '第9世代 (パルデア)' },
];

export function PokemonFilters() {
  const {
    searchTerm,
    selectedType,
    selectedGeneration,
    setSearchTerm,
    setSelectedType,
    setSelectedGeneration,
    clearFilters,
  } = usePokemonStore();

  const { searchTerm: currentSearchTerm, selectedType: currentType, selectedGeneration: currentGen } = useSearchFilters();
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = currentSearchTerm || currentType || currentGen;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="ポケモン名で検索..."
          value={currentSearchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          フィルタ
          {hasActiveFilters && (
            <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
              !
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            クリア
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* Type Filter */}
            <div>
              <h3 className="font-medium text-sm text-gray-700 mb-2">タイプ</h3>
              <div className="flex flex-wrap gap-2">
                {POKEMON_TYPES.map((type) => (
                  <Button
                    key={type}
                    variant={currentType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(currentType === type ? '' : type)}
                    style={{
                      backgroundColor: currentType === type ? POKEMON_TYPE_COLORS[type] : undefined,
                      borderColor: POKEMON_TYPE_COLORS[type],
                      color: currentType === type ? 'white' : POKEMON_TYPE_COLORS[type],
                    }}
                    className="text-xs capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {/* Generation Filter */}
            <div>
              <h3 className="font-medium text-sm text-gray-700 mb-2">世代</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {GENERATIONS.map((generation) => (
                  <Button
                    key={generation.value}
                    variant={currentGen === generation.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedGeneration(
                      currentGen === generation.value ? null : generation.value
                    )}
                    className="text-xs justify-start"
                  >
                    {generation.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {currentSearchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              検索: {currentSearchTerm}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSearchTerm('')}
              />
            </Badge>
          )}
          {currentType && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1"
              style={{
                backgroundColor: POKEMON_TYPE_COLORS[currentType],
                color: 'white',
              }}
            >
              {currentType}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSelectedType('')}
              />
            </Badge>
          )}
          {currentGen && (
            <Badge variant="secondary" className="flex items-center gap-1">
              第{currentGen}世代
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSelectedGeneration(null)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}