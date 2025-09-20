import { Pokemon, PokemonListResponse, PokemonSpecies, SimplePokemon } from '@/types/pokemon';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const POKEMON_LIMIT = 1010; // 全世代対応（第9世代まで）

// PokeAPIクライアント
class PokeAPIClient {
  private cache = new Map<string, any>();

  // キャッシュ機能付きのfetch
  private async fetchWithCache<T>(url: string): Promise<T> {
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.cache.set(url, data);
      return data;
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error);
      throw error;
    }
  }

  // 全ポケモンリストを取得（段階的読み込み）
  async getAllPokemon(): Promise<SimplePokemon[]> {
    console.log('getAllPokemon called');
    const cacheKey = 'all-pokemon';
    
    if (this.cache.has(cacheKey)) {
      console.log('Returning cached Pokemon data');
      return this.cache.get(cacheKey);
    }

    try {
      console.log('Loading all Pokemon from PokeAPI...');
      const listResponse = await this.fetchWithCache<PokemonListResponse>(
        `${POKEAPI_BASE_URL}/pokemon?limit=${POKEMON_LIMIT}`
      );

      const pokemonList: SimplePokemon[] = [];
      const batchSize = 50; // バッチサイズを調整してAPI制限を回避
      
      // 全ポケモンをバッチで処理
      for (let i = 0; i < listResponse.results.length; i += batchSize) {
        const batch = listResponse.results.slice(i, i + batchSize);
        const batchPromises = batch.map((_, index) => 
          this.getSimplePokemonById(i + index + 1)
        );

        console.log(`Loading batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(listResponse.results.length / batchSize)}...`);
        
        const batchResults = await Promise.all(batchPromises);
        const validResults = batchResults.filter(p => p !== null) as SimplePokemon[];
        pokemonList.push(...validResults);
        
        console.log(`Progress: ${pokemonList.length}/${listResponse.results.length} Pokemon loaded`);
        
        // API制限を考慮した遅延（短めに設定）
        if (i + batchSize < listResponse.results.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // IDでソート
      pokemonList.sort((a, b) => a.id - b.id);
      
      console.log(`Successfully loaded ${pokemonList.length} Pokemon total`);
      
      // 世代別の分布を表示
      const generationCounts = pokemonList.reduce((acc, pokemon) => {
        acc[pokemon.generation] = (acc[pokemon.generation] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
      console.log('Pokemon distribution by generation:', generationCounts);
      
      this.cache.set(cacheKey, pokemonList);
      return pokemonList;
    } catch (error) {
      console.error('Failed to get all pokemon:', error);
      return [];
    }
  }

  // IDでポケモンの詳細情報を取得
  async getPokemonById(id: number): Promise<Pokemon | null> {
    try {
      return await this.fetchWithCache<Pokemon>(`${POKEAPI_BASE_URL}/pokemon/${id}`);
    } catch (error) {
      console.error(`Failed to get pokemon ${id}:`, error);
      return null;
    }
  }

  // IDで簡略化されたポケモンデータを取得
  async getSimplePokemonById(id: number): Promise<SimplePokemon | null> {
    try {
      const pokemon = await this.getPokemonById(id);
      if (!pokemon) return null;

      // シンプルにIDから世代を判定（パフォーマンス向上のため）
      const generation = this.getGenerationFromId(id);

      // 最適な画像URLを選択
      const imageUrl = this.getBestImageUrl(pokemon.sprites);

      return {
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types.map(t => t.type.name),
        imageUrl,
        generation,
      };
    } catch (error) {
      console.error(`Failed to get simple pokemon ${id}:`, error);
      return null;
    }
  }

  // 名前でポケモンを検索
  async searchPokemonByName(name: string): Promise<SimplePokemon | null> {
    try {
      const pokemon = await this.fetchWithCache<Pokemon>(`${POKEAPI_BASE_URL}/pokemon/${name.toLowerCase()}`);
      if (!pokemon) return null;

      return this.getSimplePokemonById(pokemon.id);
    } catch (error) {
      console.error(`Failed to search pokemon ${name}:`, error);
      return null;
    }
  }

  // ランダムポケモンを取得
  async getRandomPokemon(count: number = 6): Promise<SimplePokemon[]> {
    const randomIds = Array.from({ length: count }, () => 
      Math.floor(Math.random() * POKEMON_LIMIT) + 1
    );

    const promises = randomIds.map(id => this.getSimplePokemonById(id));
    const results = await Promise.all(promises);
    return results.filter(p => p !== null) as SimplePokemon[];
  }

  // 世代番号を抽出
  private extractGenerationNumber(generationName: string): number {
    const match = generationName.match(/generation-(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  }

  // IDから世代を推定（フォールバック用）
  private getGenerationFromId(id: number): number {
    if (id <= 151) return 1;      // 第1世代: 1-151
    if (id <= 251) return 2;      // 第2世代: 152-251
    if (id <= 386) return 3;      // 第3世代: 252-386
    if (id <= 493) return 4;      // 第4世代: 387-493
    if (id <= 649) return 5;      // 第5世代: 494-649
    if (id <= 721) return 6;      // 第6世代: 650-721
    if (id <= 809) return 7;      // 第7世代: 722-809
    if (id <= 905) return 8;      // 第8世代: 810-905
    return 9;                     // 第9世代: 906-
  }

  // 最適な画像URLを選択
  private getBestImageUrl(sprites: Pokemon['sprites']): string {
    // 優先順位: official-artwork > home > default
    return (
      sprites.other['official-artwork']?.front_default ||
      sprites.other.home?.front_default ||
      sprites.front_default ||
      '/placeholder-pokemon.png'
    );
  }

  // タイプでフィルタリング
  filterByType(pokemon: SimplePokemon[], type: string): SimplePokemon[] {
    if (!type) return pokemon;
    return pokemon.filter(p => p.types.includes(type));
  }

  // 世代でフィルタリング
  filterByGeneration(pokemon: SimplePokemon[], generation: number): SimplePokemon[] {
    if (!generation) return pokemon;
    return pokemon.filter(p => p.generation === generation);
  }

  // 名前で検索（部分一致）
  searchByName(pokemon: SimplePokemon[], searchTerm: string): SimplePokemon[] {
    if (!searchTerm) return pokemon;
    const term = searchTerm.toLowerCase();
    return pokemon.filter(p => 
      p.name.toLowerCase().includes(term) ||
      (p.japaneseName && p.japaneseName.includes(searchTerm))
    );
  }
}

// シングルトンインスタンスをエクスポート
export const pokeAPI = new PokeAPIClient();

// 便利な関数もエクスポート
export const getAllPokemon = () => pokeAPI.getAllPokemon();
export const getPokemonById = (id: number) => pokeAPI.getPokemonById(id);
export const getSimplePokemonById = (id: number) => pokeAPI.getSimplePokemonById(id);
export const searchPokemonByName = (name: string) => pokeAPI.searchPokemonByName(name);
export const getRandomPokemon = (count?: number) => pokeAPI.getRandomPokemon(count);