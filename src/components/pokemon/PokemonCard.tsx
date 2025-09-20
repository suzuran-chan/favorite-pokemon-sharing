'use client';

import { SimplePokemon } from '@/types/pokemon';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePokemonStore, useIsPokemonSelected, useCanAddPokemon } from '@/store/pokemonStore';
import { getTypeColor, capitalizePokemonName, formatPokemonId, translateTypeName, formatPokemonName } from '@/utils/helpers';
import { Plus, Check } from 'lucide-react';

interface PokemonCardProps {
  pokemon: SimplePokemon;
  onClick?: () => void;
}

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const addPokemon = usePokemonStore(state => state.addPokemon);
  const removePokemon = usePokemonStore(state => state.removePokemon);
  const isSelected = useIsPokemonSelected(pokemon.id);
  const canAdd = useCanAddPokemon();

  const handleSelect = () => {
    if (isSelected) {
      removePokemon(pokemon.id);
    } else if (canAdd) {
      addPokemon(pokemon);
    }
    onClick?.();
  };

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer ${
        isSelected 
          ? 'ring-2 ring-blue-500 bg-blue-50' 
          : 'hover:shadow-md'
      }`}
      onClick={handleSelect}
    >
      <CardContent className="p-4">
        {/* Pokemon Image */}
        <div className="relative mb-3">
          <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
            <img
              src={pokemon.imageUrl}
              alt={pokemon.name}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
          
          {/* Selection indicator */}
          <div className="absolute top-2 right-2">
            {isSelected ? (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            ) : canAdd ? (
              <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-blue-500 transition-colors">
                <Plus className="w-4 h-4 text-gray-400 hover:text-blue-500" />
              </div>
            ) : (
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <Plus className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Pokemon Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-mono">
              {formatPokemonId(pokemon.id)}
            </span>
            <span className="text-xs text-gray-500">
              第{pokemon.generation}世代
            </span>
          </div>
          
          <h3 className="font-semibold text-sm text-gray-900 capitalize truncate">
            {formatPokemonName(pokemon)}
          </h3>
          
          {/* Pokemon Types */}
          <div className="flex flex-wrap gap-1">
            {pokemon.types.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="text-xs px-2 py-0.5"
                style={{
                  backgroundColor: getTypeColor(type),
                  color: 'white',
                  border: 'none',
                }}
              >
                {translateTypeName(type)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant={isSelected ? "default" : "outline"}
          size="sm"
          className="w-full mt-3"
          onClick={(e) => {
            e.stopPropagation();
            handleSelect();
          }}
          disabled={!isSelected && !canAdd}
        >
          {isSelected ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              選択中
            </>
          ) : canAdd ? (
            <>
              <Plus className="w-4 h-4 mr-1" />
              選択
            </>
          ) : (
            '6匹選択済み'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default PokemonCard;