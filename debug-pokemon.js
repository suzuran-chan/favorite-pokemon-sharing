// デバッグ用スクリプト - PokeAPI データ確認
async function testPokemonData() {
  const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
  
  // テスト用ポケモンID
  const testIds = [1, 152, 252, 387, 494, 650, 722, 810, 906]; // 各世代の最初のポケモン
  
  console.log('Testing Pokemon data...');
  
  for (const id of testIds) {
    try {
      const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`);
      const pokemon = await response.json();
      
      // IDから世代を計算
      let generation;
      if (id <= 151) generation = 1;
      else if (id <= 251) generation = 2;
      else if (id <= 386) generation = 3;
      else if (id <= 493) generation = 4;
      else if (id <= 649) generation = 5;
      else if (id <= 721) generation = 6;
      else if (id <= 809) generation = 7;
      else if (id <= 905) generation = 8;
      else generation = 9;
      
      console.log(`Pokemon ${id}: ${pokemon.name} - Generation ${generation}`);
      console.log(`  Types: ${pokemon.types.map(t => t.type.name).join(', ')}`);
      console.log(`  Sprite: ${pokemon.sprites.front_default}`);
      
    } catch (error) {
      console.error(`Failed to fetch Pokemon ${id}:`, error);
    }
    
    // API制限を避けるため少し待機
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

testPokemonData();