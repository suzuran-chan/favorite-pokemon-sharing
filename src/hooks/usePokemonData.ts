'use client';

import { useState, useEffect, useMemo } from 'react';
import { SimplePokemon } from '@/types/pokemon';
import { getAllPokemon, pokeAPI } from '@/services/pokeapi';
import { useSearchFilters } from '@/store/pokemonStore';

export function usePokemonData() {
  console.log('usePokemonData hook called');
  const [allPokemon, setAllPokemon] = useState<SimplePokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const { searchTerm, selectedType, selectedGeneration } = useSearchFilters();

  console.log('usePokemonData state:', { 
    allPokemonCount: allPokemon.length, 
    loading, 
    error,
    isDataLoaded,
    searchTerm,
    selectedType,
    selectedGeneration
  });

  // データをまだ読み込んでいない場合のみ実行
  if (!isDataLoaded && loading && allPokemon.length === 0) {
    console.log('Starting Pokemon data loading...');
    setIsDataLoaded(true);
    
    getAllPokemon().then(pokemon => {
      console.log(`Successfully loaded ${pokemon.length} Pokemon for the app`);
      setAllPokemon(pokemon);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load Pokemon:', err);
      setError('ポケモンデータの取得に失敗しました');
      setLoading(false);
      setIsDataLoaded(false); // エラー時は再試行可能にする
    });
  }

  // フィルタリングされたポケモンリスト
  const filteredPokemon = useMemo(() => {
    console.log('filteredPokemon useMemo called', { allPokemonLength: allPokemon.length });
    
    let filtered = allPokemon;

    // デバッグ用：全ポケモンの世代分布をログ出力
    if (allPokemon.length > 0) {
      const generationCounts = allPokemon.reduce((acc, pokemon) => {
        acc[pokemon.generation] = (acc[pokemon.generation] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
      console.log('Pokemon by generation:', generationCounts);
      console.log('Active filters:', { searchTerm, selectedType, selectedGeneration });
    } else {
      console.log('No Pokemon data available for filtering');
    }

    // 名前で検索
    if (searchTerm) {
      filtered = pokeAPI.searchByName(filtered, searchTerm);
      console.log(`After search filter ("${searchTerm}"): ${filtered.length} Pokemon`);
    }

    // タイプでフィルタ
    if (selectedType) {
      filtered = pokeAPI.filterByType(filtered, selectedType);
      console.log(`After type filter ("${selectedType}"): ${filtered.length} Pokemon`);
    }

    // 世代でフィルタ
    if (selectedGeneration) {
      console.log(`Filtering by generation ${selectedGeneration}, before filter: ${filtered.length}`);
      filtered = pokeAPI.filterByGeneration(filtered, selectedGeneration);
      console.log(`After generation filter: ${filtered.length}`);
      
      // 詳細デバッグ: フィルタ後の最初の数匹を表示
      if (filtered.length > 0) {
        console.log('First few filtered Pokemon:', filtered.slice(0, 5).map(p => ({
          name: p.name,
          id: p.id,
          generation: p.generation
        })));
      }
    }

    console.log(`Final filtered result: ${filtered.length} Pokemon`);
    return filtered;
  }, [allPokemon, searchTerm, selectedType, selectedGeneration]);

  return {
    allPokemon,
    filteredPokemon,
    loading,
    error,
    totalCount: allPokemon.length,
    filteredCount: filteredPokemon.length,
  };
}

// ページネーション用のhook
export function usePagination<T>(items: T[], itemsPerPage: number = 50) {
  const [currentPage, setCurrentPage] = useState(1);

  // アイテムが変更されたときにページをリセット
  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return {
    currentItems,
    currentPage,
    totalPages,
    totalItems: items.length,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}

// 無限スクロール用のhook
export function useInfiniteScroll<T>(items: T[], itemsPerBatch: number = 50) {
  const [displayedCount, setDisplayedCount] = useState(itemsPerBatch);

  // アイテムが変更されたときにカウントをリセット
  useEffect(() => {
    setDisplayedCount(itemsPerBatch);
  }, [items, itemsPerBatch]);

  const displayedItems = items.slice(0, displayedCount);
  const hasMore = displayedCount < items.length;

  const loadMore = () => {
    if (hasMore) {
      setDisplayedCount(prev => Math.min(prev + itemsPerBatch, items.length));
    }
  };

  return {
    displayedItems,
    hasMore,
    loadMore,
    displayedCount,
    totalCount: items.length,
  };
}