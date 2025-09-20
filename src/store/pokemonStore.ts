import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { SimplePokemon, SelectedPokemon, ThemeSettings } from '@/types/pokemon';

interface PokemonStore {
  // 選択されたポケモン（最大6匹）
  selectedPokemon: SelectedPokemon[];
  
  // テーマ設定
  themeSettings: ThemeSettings;
  
  // 検索・フィルタ状態
  searchTerm: string;
  selectedType: string;
  selectedGeneration: number | null;
  
  // アクション
  addPokemon: (pokemon: SimplePokemon) => void;
  removePokemon: (pokemonId: number) => void;
  clearAllPokemon: () => void;
  reorderPokemon: (startIndex: number, endIndex: number) => void;
  
  // 検索・フィルタアクション
  setSearchTerm: (term: string) => void;
  setSelectedType: (type: string) => void;
  setSelectedGeneration: (generation: number | null) => void;
  clearFilters: () => void;
  
  // テーマアクション
  updateThemeSettings: (settings: Partial<ThemeSettings>) => void;
  
  // ランダム選択
  setRandomPokemon: (pokemon: SimplePokemon[]) => void;
}

const defaultThemeSettings: ThemeSettings = {
  backgroundColor: '#f0f9ff',
  textColor: '#1e293b',
  cardStyle: 'modern',
};

export const usePokemonStore = create<PokemonStore>()((set, get) => ({
  selectedPokemon: [],
  themeSettings: defaultThemeSettings,
  searchTerm: '',
  selectedType: '',
  selectedGeneration: null,

  addPokemon: (pokemon: SimplePokemon) => {
    const currentSelected = get().selectedPokemon;
    
    // 既に選択されているかチェック
    if (currentSelected.some((p: SelectedPokemon) => p.id === pokemon.id)) {
      return;
    }
    
    // 最大6匹まで
    if (currentSelected.length >= 6) {
      return;
    }
    
    const selectedPokemon: SelectedPokemon = {
      ...pokemon,
      selectedAt: new Date(),
    };
    
    set({
      selectedPokemon: [...currentSelected, selectedPokemon],
    });
  },

  removePokemon: (pokemonId: number) => {
    set({
      selectedPokemon: get().selectedPokemon.filter((p: SelectedPokemon) => p.id !== pokemonId),
    });
  },

  clearAllPokemon: () => {
    set({ selectedPokemon: [] });
  },

  reorderPokemon: (startIndex: number, endIndex: number) => {
    const selectedPokemon = [...get().selectedPokemon];
    const [reorderedItem] = selectedPokemon.splice(startIndex, 1);
    selectedPokemon.splice(endIndex, 0, reorderedItem);
    
    set({ selectedPokemon });
  },

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },

  setSelectedType: (type: string) => {
    set({ selectedType: type });
  },

  setSelectedGeneration: (generation: number | null) => {
    set({ selectedGeneration: generation });
  },

  clearFilters: () => {
    set({
      searchTerm: '',
      selectedType: '',
      selectedGeneration: null,
    });
  },

  updateThemeSettings: (settings: Partial<ThemeSettings>) => {
    set({
      themeSettings: { ...get().themeSettings, ...settings },
    });
  },

  setRandomPokemon: (pokemon: SimplePokemon[]) => {
    const selectedPokemon: SelectedPokemon[] = pokemon.slice(0, 6).map((p: SimplePokemon) => ({
      ...p,
      selectedAt: new Date(),
    }));
    
    set({ selectedPokemon });
  },
}));

// セレクター
export const useSelectedPokemon = () => usePokemonStore((state: PokemonStore) => state.selectedPokemon);
export const useThemeSettings = () => usePokemonStore((state: PokemonStore) => state.themeSettings);

// 個別のセレクター（無限ループを回避）
export const useSearchTerm = () => usePokemonStore((state: PokemonStore) => state.searchTerm);
export const useSelectedType = () => usePokemonStore((state: PokemonStore) => state.selectedType);
export const useSelectedGeneration = () => usePokemonStore((state: PokemonStore) => state.selectedGeneration);

// 互換性のためのレガシーセレクター
export const useSearchFilters = () => {
  const searchTerm = useSearchTerm();
  const selectedType = useSelectedType();
  const selectedGeneration = useSelectedGeneration();
  return { searchTerm, selectedType, selectedGeneration };
};

// 便利なセレクター
export const useSelectedPokemonCount = () => usePokemonStore((state: PokemonStore) => state.selectedPokemon.length);
export const useCanAddPokemon = () => usePokemonStore((state: PokemonStore) => state.selectedPokemon.length < 6);
export const useIsPokemonSelected = (pokemonId: number) => 
  usePokemonStore((state: PokemonStore) => state.selectedPokemon.some((p: SelectedPokemon) => p.id === pokemonId));