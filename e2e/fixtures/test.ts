import { test as base, expect } from '@playwright/test';
import { registerMinimalPokeApiStubs } from './pokeapi';

type Fixtures = {
  stubPokeApi: boolean;
};

export const test = base.extend<Fixtures>({
  stubPokeApi: [true, { option: true }],
  page: async ({ page, stubPokeApi }, use) => {
    // Optional: disable animations for visual stability
    await page.addStyleTag({ content: `
      *, *::before, *::after { transition: none !important; animation: none !important; }
    `});

    if (stubPokeApi) {
      await registerMinimalPokeApiStubs(page);
    }
    await use(page);
  },
});

export { expect };
