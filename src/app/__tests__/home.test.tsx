import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

jest.mock('@/store/pokemonStore', () => ({
  useSelectedPokemon: jest.fn(),
}));

const mockedStore = require('@/store/pokemonStore');

describe('ホームページ', () => {
  it('ポケモン未選択時にヒーローと開始ボタンを表示する', () => {
    mockedStore.useSelectedPokemon.mockReturnValue([]);
    render(<Home />);
    // Hero heading text is split by spans; match flexibly by role and partials
    expect(
      screen.getByRole('heading', {
        name: (name) => name.includes('選んで') && name.includes('シェア') && name.endsWith('しよう'),
      })
    ).toBeInTheDocument();
    // Only one "ポケモンを選ぶ" button in the hero when none selected
    expect(screen.getByRole('button', { name: /ポケモンを選ぶ/ })).toBeInTheDocument();
    expect(screen.queryByText(/シェアする \(\d\/6\)/)).not.toBeInTheDocument();
  });

  it('ポケモン選択時にシェアボタンを表示する', () => {
    mockedStore.useSelectedPokemon.mockReturnValue([
      { id: 25, name: 'pikachu', imageUrl: 'https://example/pika.png' },
    ]);
    render(<Home />);
    expect(screen.getByRole('button', { name: /シェアする \(1\/6\)/ })).toBeInTheDocument();
  });

  it('選択済みプレビューと空きスロット数を表示する', () => {
    mockedStore.useSelectedPokemon.mockReturnValue([
      { id: 25, name: 'pikachu', imageUrl: 'https://example/pika.png' },
      { id: 1, name: 'bulbasaur', imageUrl: 'https://example/bulba.png' },
    ]);
    render(<Home />);
    // 選択済みの名前が表示される（小文字をそのまま表示しているコンポーネント仕様）
    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    // 空きスロットの表示「未選択」が 6-2=4 件
    const empties = screen.getAllByText('未選択');
    expect(empties.length).toBe(4);
  });

  it('リンクの遷移先が正しい（/select と /share）', () => {
    mockedStore.useSelectedPokemon.mockReturnValue([
      { id: 25, name: 'pikachu', imageUrl: 'https://example/pika.png' },
    ]);
    render(<Home />);
    // 「ポケモンを選ぶ」リンク
    const chooseLinks = screen.getAllByRole('link', { name: /ポケモンを選ぶ/ });
    expect(chooseLinks[0]).toHaveAttribute('href', '/select');
    // 「シェアする」リンク
    const shareLinks = screen.getAllByRole('link', { name: /シェアする/ });
    expect(shareLinks[0]).toHaveAttribute('href', '/share');
  });
});
