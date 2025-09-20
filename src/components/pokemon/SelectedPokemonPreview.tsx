'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSelectedPokemon, usePokemonStore } from '@/store/pokemonStore';
import { getTypeColor, capitalizePokemonName, formatPokemonId } from '@/utils/helpers';
import { getRandomPokemon } from '@/services/pokeapi';
import { X, Shuffle, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function SelectedPokemonPreview() {
  const selectedPokemon = useSelectedPokemon();
  const { removePokemon, clearAllPokemon, setRandomPokemon } = usePokemonStore();
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);

  const handleRandomSelection = async () => {
    setIsLoadingRandom(true);
    try {
      const randomPokemon = await getRandomPokemon(6);
      setRandomPokemon(randomPokemon);
    } catch (error) {
      console.error('Failed to get random pokemon:', error);
    } finally {
      setIsLoadingRandom(false);
    }
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            選択中のポケモン ({selectedPokemon.length}/6)
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRandomSelection}
              disabled={isLoadingRandom}
            >
              <Shuffle className="h-4 w-4 mr-1" />
              {isLoadingRandom ? '生成中...' : 'ランダム'}
            </Button>
            {selectedPokemon.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllPokemon}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                全削除
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Selected Pokemon Grid */}
        <div className="grid grid-cols-2 gap-3">
          {selectedPokemon.map((pokemon) => (
            <div key={pokemon.id} className="relative group">
              <div className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={pokemon.imageUrl}
                    alt={pokemon.name}
                    className="w-full h-16 object-contain mb-2"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePokemon(pokemon.id)}
                    className="absolute -top-1 -right-1 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 font-mono">
                    {formatPokemonId(pokemon.id)}
                  </div>
                  <div className="font-medium text-sm capitalize truncate">
                    {capitalizePokemonName(pokemon.name)}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {pokemon.types.slice(0, 2).map((type) => (
                      <Badge
                        key={type}
                        variant="secondary"
                        className="text-xs px-1 py-0"
                        style={{
                          backgroundColor: getTypeColor(type),
                          color: 'white',
                          fontSize: '10px',
                        }}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Empty Slots */}
          {Array.from({ length: 6 - selectedPokemon.length }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="border-2 border-dashed border-gray-200 rounded-lg p-3 h-32 flex items-center justify-center"
            >
              <div className="text-center text-gray-400">
                <div className="text-xs">空きスロット</div>
                <div className="text-lg">+</div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {selectedPokemon.length > 0 && (
          <div className="space-y-2 pt-4 border-t">
            <Link href="/share" className="block">
              <Button className="w-full" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                シェアページへ
              </Button>
            </Link>
            
            <div className="text-xs text-gray-500 text-center">
              選択したポケモンをSNSでシェアできます
            </div>
          </div>
        )}

        {selectedPokemon.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <div className="text-sm mb-2">ポケモンが選択されていません</div>
            <div className="text-xs">
              左側からお気に入りのポケモンを選んでください
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}