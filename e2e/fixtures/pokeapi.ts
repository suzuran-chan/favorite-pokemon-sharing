import type { Page, Route } from '@playwright/test';

type Fulfill = Parameters<Route['fulfill']>[0];

export async function registerMinimalPokeApiStubs(page: Page) {
  // Catch-all first: Playwright matches routes in LIFO order, so later specific routes will win
  await page.route('https://pokeapi.co/**', route => route.abort());

  // List: pretend only 3 pokemon exist
  await page.route('https://pokeapi.co/api/v2/pokemon?limit=1010', route => {
    const body = {
      count: 3,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2' },
        { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3' },
      ],
    };
    return route.fulfill(json(body));
  });

  // Pokemon details 1..3
  await page.route('https://pokeapi.co/api/v2/pokemon/1', route => route.fulfill(json(pokemonDetail(1, 'bulbasaur', ['grass']))));
  await page.route('https://pokeapi.co/api/v2/pokemon/2', route => route.fulfill(json(pokemonDetail(2, 'ivysaur', ['grass']))));
  await page.route('https://pokeapi.co/api/v2/pokemon/3', route => route.fulfill(json(pokemonDetail(3, 'venusaur', ['grass']))));

  // Species (Japanese names)
  await page.route('https://pokeapi.co/api/v2/pokemon-species/1', route => route.fulfill(json(species(1, 'フシギダネ'))));
  await page.route('https://pokeapi.co/api/v2/pokemon-species/2', route => route.fulfill(json(species(2, 'フシギソウ'))));
  await page.route('https://pokeapi.co/api/v2/pokemon-species/3', route => route.fulfill(json(species(3, 'フシギバナ'))));

  // (catch-all already registered above)
}

function json(body: any): Fulfill {
  return { status: 200, contentType: 'application/json', body: JSON.stringify(body) };
}

function pokemonDetail(id: number, name: string, types: string[]) {
  return {
    id,
    name,
    sprites: {
      front_default: null,
      other: {
        home: { front_default: null },
        'official-artwork': { front_default: 'https://img.example/pokemon.png' },
      },
    },
    types: types.map((t, i) => ({ slot: i + 1, type: { name: t, url: `https://pokeapi.co/api/v2/type/${t}` } })),
    species: { name, url: `https://pokeapi.co/api/v2/pokemon-species/${id}` },
  };
}

function species(id: number, jaName: string) {
  return {
    id,
    names: [
      { language: { name: 'en' }, name: 'dummy' },
      { language: { name: 'ja' }, name: jaName },
    ],
  };
}
