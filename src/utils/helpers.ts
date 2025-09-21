import { POKEMON_TYPE_COLORS } from '@/types/pokemon';

// ポケモンタイプの日本語翻訳
const TYPE_TRANSLATIONS: Record<string, string> = {
  normal: 'ノーマル',
  fire: 'ほのお',
  water: 'みず',
  electric: 'でんき',
  grass: 'くさ',
  ice: 'こおり',
  fighting: 'かくとう',
  poison: 'どく',
  ground: 'じめん',
  flying: 'ひこう',
  psychic: 'エスパー',
  bug: 'むし',
  rock: 'いわ',
  ghost: 'ゴースト',
  dragon: 'ドラゴン',
  dark: 'あく',
  steel: 'はがね',
  fairy: 'フェアリー'
};

// ポケモンタイプを日本語に翻訳
export const translateTypeName = (type: string): string => {
  return TYPE_TRANSLATIONS[type] || type;
};

// ポケモンタイプの色を取得
export const getTypeColor = (type: string): string => {
  return POKEMON_TYPE_COLORS[type] || POKEMON_TYPE_COLORS.normal;
};

// ポケモンIDをフォーマット（例: 1 -> "#001"）
export const formatPokemonId = (id: number): string => {
  return `#${id.toString().padStart(3, '0')}`;
};

// ポケモン名を適切に表示（日本語名がある場合は日本語、なければ英語名を大文字に）
export const formatPokemonName = (pokemon: { name: string; japaneseName?: string }): string => {
  if (pokemon.japaneseName) {
    return pokemon.japaneseName;
  }
  return capitalizePokemonName(pokemon.name);
};

// ポケモン名を大文字に変換（英語名用）
export const capitalizePokemonName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

// ポケモン画像のプレースホルダーURL生成
export const getPokemonImagePlaceholder = (id: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};

// 世代名を取得
export const getGenerationName = (generation: number): string => {
  const generations = {
    1: 'カントー',
    2: 'ジョウト', 
    3: 'ホウエン',
    4: 'シンオウ',
    5: 'イッシュ',
    6: 'カロス',
    7: 'アローラ',
    8: 'ガラル',
    9: 'パルデア',
  };
  return generations[generation as keyof typeof generations] || `第${generation}世代`;
};

// SNS共有用テキスト生成
export const generateShareText = (pokemonNames: string[]): string => {
  if (pokemonNames.length === 0) {
    return '好きなポケモンを選んでシェアしよう！';
  }
  
  const namesText = pokemonNames.join('、');
  return `私の好きなポケモンは${namesText}です！ #好きなポケモン #ポケモン`;
};

// Twitter/X共有URL生成
export const generateTwitterShareUrl = (text: string, url?: string): string => {
  const params = new URLSearchParams({
    text,
    ...(url && { url }),
  });
  return `https://x.com/intent/post?${params.toString()}`;
};

// Facebook共有URL生成
export const generateFacebookShareUrl = (url: string): string => {
  const params = new URLSearchParams({
    u: url,
  });
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
};

// 色の明度を計算（テキストの色を決定するため）
export const getContrastColor = (backgroundColor: string): string => {
  // 16進数カラーコードをRGBに変換
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // 輝度計算
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

// ランダム配列シャッフル
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 配列をチャンクに分割
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// デバウンス関数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// ローカルストレージのヘルパー
export const storage = {
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return defaultValue;
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },
};

// 画像のロード状態チェック
export const checkImageLoaded = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
};