'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSelectedPokemon, useThemeSettings } from '@/store/pokemonStore';
import { getTypeColor, capitalizePokemonName, formatPokemonId, translateTypeName } from '@/utils/helpers';
import { generateColorPalette } from '@/utils/shareUtils';

interface PokemonTeamDisplayProps {
  elementId: string;
  customTheme?: {
    background: string;
    primary: string;
    secondary: string;
  };
  showTypes?: boolean;
  showIds?: boolean;
  layout?: 'grid' | 'horizontal';
}

export function PokemonTeamDisplay({ 
  elementId, 
  customTheme,
  showTypes = true,
  showIds = true,
  layout = 'grid'
}: PokemonTeamDisplayProps) {
  const selectedPokemon = useSelectedPokemon();
  const themeSettings = useThemeSettings();
  
  if (selectedPokemon.length === 0) {
    return (
      <div 
        id={elementId}
        className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg"
      >
        <p className="text-gray-500">ポケモンが選択されていません</p>
      </div>
    );
  }

  const theme = customTheme || {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primary: '#667eea',
    secondary: '#764ba2',
  };

  return (
    <div
      id={elementId}
      className="w-full min-h-96 p-8 rounded-lg"
      style={{
        background: theme.background,
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          私の好きなポケモンチーム
        </h2>
        <p className="text-white/80 text-lg">
          {selectedPokemon.length}匹のお気に入り
        </p>
      </div>

      {/* Pokemon Grid */}
      <div className={
        layout === 'grid' 
          ? 'grid grid-cols-2 md:grid-cols-3 gap-6'
          : 'flex flex-wrap justify-center gap-4'
      }>
        {selectedPokemon.map((pokemon) => (
          <Card 
            key={pokemon.id} 
            className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
          >
            <CardContent className="p-4 text-center">
              {/* Pokemon Image */}
              <div className="w-full h-24 flex items-center justify-center mb-3">
                <img
                  src={pokemon.imageUrl}
                  alt={pokemon.name}
                  className="max-w-full max-h-full object-contain"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                />
              </div>
              
              {/* Pokemon Info */}
              <div className="space-y-2">
                {showIds && (
                  <div className="text-xs text-gray-500 font-mono">
                    {formatPokemonId(pokemon.id)}
                  </div>
                )}
                
                <h3 className="font-bold text-lg text-gray-900 capitalize">
                  {capitalizePokemonName(pokemon.name)}
                </h3>
                
                {showTypes && (
                  <div className="flex flex-wrap justify-center gap-1">
                    {pokemon.types.map((type) => (
                      <Badge
                        key={type}
                        variant="secondary"
                        className="text-xs px-2 py-1"
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
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-white/60 text-sm">
          好きなポケモン共有アプリで作成
        </p>
      </div>
    </div>
  );
}

// テーマ選択コンポーネント
interface ThemeSelectorProps {
  selectedTheme: any;
  onThemeChange: (theme: any) => void;
}

export function ThemeSelector({ selectedTheme, onThemeChange }: ThemeSelectorProps) {
  const palettes = generateColorPalette();

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-700">背景テーマ</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {palettes.map((palette) => (
          <button
            key={palette.name}
            onClick={() => onThemeChange(palette)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedTheme?.name === palette.name
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div
              className="w-full h-16 rounded-md mb-2"
              style={{ background: palette.background }}
            />
            <p className="text-xs font-medium text-gray-700">{palette.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// レイアウト選択コンポーネント
interface LayoutSelectorProps {
  layout: 'grid' | 'horizontal';
  onLayoutChange: (layout: 'grid' | 'horizontal') => void;
}

export function LayoutSelector({ layout, onLayoutChange }: LayoutSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-700">レイアウト</h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onLayoutChange('grid')}
          className={`p-3 rounded-lg border-2 text-center transition-all ${
            layout === 'grid'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="grid grid-cols-2 gap-1 w-8 h-8 mx-auto mb-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-current opacity-30 rounded-sm" />
            ))}
          </div>
          <span className="text-sm font-medium">グリッド</span>
        </button>
        
        <button
          onClick={() => onLayoutChange('horizontal')}
          className={`p-3 rounded-lg border-2 text-center transition-all ${
            layout === 'horizontal'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex gap-1 w-8 h-8 mx-auto mb-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-current opacity-30 rounded-sm flex-1" />
            ))}
          </div>
          <span className="text-sm font-medium">横並び</span>
        </button>
      </div>
    </div>
  );
}