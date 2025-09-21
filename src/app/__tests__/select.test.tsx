import { render, screen, fireEvent } from '@testing-library/react';
import SelectPokemonPage from '@/app/select/page';
import * as navigation from '@/utils/navigation';

jest.mock('@/utils/navigation', () => ({
  reloadPage: jest.fn(),
}));

const loadMoreMock = jest.fn();
let mockUsePokemonData: any = {
  filteredPokemon: [],
  loading: false,
  error: null,
  filteredCount: 0,
  totalCount: 0,
};
let mockUseInfiniteScroll: any = {
  displayedItems: [],
  hasMore: false,
  loadMore: loadMoreMock,
};

jest.mock('@/hooks/usePokemonData', () => ({
  usePokemonData: () => mockUsePokemonData,
  useInfiniteScroll: () => mockUseInfiniteScroll,
}));

let mockSelectedCount = 0;
jest.mock('@/store/pokemonStore', () => ({
  useSelectedPokemonCount: () => mockSelectedCount,
}));

jest.mock('@/components/pokemon/PokemonFilters', () => ({
  PokemonFilters: () => <div data-testid="filters">filters</div>,
}));

jest.mock('@/components/pokemon/PokemonCard', () => ({
  PokemonCard: ({ pokemon }: any) => <div>{pokemon.name}</div>,
}));

jest.mock('@/components/pokemon/SelectedPokemonPreview', () => ({
  SelectedPokemonPreview: () => <div data-testid="preview">preview</div>,
}));

describe('ポケモン選択ページ', () => {
  it('アイテムがない場合にタイトルと空状態を表示する', () => {
    render(<SelectPokemonPage />);
    expect(screen.getByText('ポケモンを選ぶ')).toBeInTheDocument();
    expect(screen.getByText('条件に一致するポケモンが見つかりません')).toBeInTheDocument();
  });

  it('ローディング状態を表示する', () => {
    mockUsePokemonData = { ...mockUsePokemonData, loading: true };
    render(<SelectPokemonPage />);
    expect(screen.getByText('ポケモンデータを読み込み中...')).toBeInTheDocument();
    // リセット
    mockUsePokemonData = { ...mockUsePokemonData, loading: false };
  });

  it('エラー状態を表示し再試行がリロードを呼ぶ', () => {
    const reloadMock = navigation.reloadPage as jest.Mock;
    reloadMock.mockClear();
    mockUsePokemonData = { ...mockUsePokemonData, error: '取得に失敗しました' };
    render(<SelectPokemonPage />);
    expect(screen.getByText('取得に失敗しました')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '再試行' }));
    expect(reloadMock).toHaveBeenCalled();
    mockUsePokemonData = { ...mockUsePokemonData, error: null };
  });

  it('ビュー切り替えボタンでクラスが切り替わる（スモーク）', () => {
    mockUseInfiniteScroll = {
      displayedItems: [{ id: 1, name: 'bulbasaur' }],
      hasMore: false,
      loadMore: loadMoreMock,
    };
  render(<SelectPokemonPage />);
  const buttons = screen.getAllByRole('button');
  // [0] 戻る, [1] グリッド, [2] リスト を想定して軽くクリック（名前なしアイコンボタンのため index で）
  buttons[1] && fireEvent.click(buttons[1]);
  buttons[2] && fireEvent.click(buttons[2]);
  });

  it('「さらに読み込む」でloadMoreが呼ばれる', () => {
    loadMoreMock.mockClear();
    mockUseInfiniteScroll = {
      displayedItems: Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: `p${i + 1}` })),
      hasMore: true,
      loadMore: loadMoreMock,
    };
    render(<SelectPokemonPage />);
    fireEvent.click(screen.getByRole('button', { name: 'さらに読み込む' }));
    expect(loadMoreMock).toHaveBeenCalled();
  });

  it('選択数のラベルが表示される（0のときは非表示）', () => {
    // 0件
    render(<SelectPokemonPage />);
    expect(screen.queryByText(/匹選択中/)).not.toBeInTheDocument();
  });

  it('選択数のラベルが表示される（>0のときは表示）', () => {
    mockSelectedCount = 2;
    render(<SelectPokemonPage />);
    expect(screen.getByText(/2\/6匹選択中/)).toBeInTheDocument();
    mockSelectedCount = 0; // reset
  });
});
