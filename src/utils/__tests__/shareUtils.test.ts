import { generateShareText, generateColorPalette, generateTwitterShareUrl } from '@/utils/shareUtils';

describe('shareUtils', () => {
  describe('generateShareText', () => {
    it('ポケモンが空のときにデフォルト文言を返す', () => {
      expect(generateShareText([])).toBe('好きなポケモンチームを作成しました！');
    });

  it('全ポケモン名を番号付きで列挙する', () => {
      const text = generateShareText(['ピカチュウ', 'フシギダネ', 'リザードン']);
      expect(text).toContain('私の好きなポケモンチーム✨');
      expect(text).toContain('1. ピカチュウ');
      expect(text).toContain('2. フシギダネ');
      expect(text).toContain('3. リザードン');
      expect(text).toContain('みんなの好きなポケモンも教えて！');
    });
  });

  describe('generateColorPalette', () => {
    it('テーマ内にフォレストとオーシャンを含む', () => {
      const palettes = generateColorPalette();
      const names = palettes.map(p => p.name);
      expect(names).toEqual(expect.arrayContaining(['フォレスト', 'オーシャン', 'サンセット']));
    });

  it('フォレストの配色は緑系である', () => {
      const palettes = generateColorPalette();
      const forest = palettes.find(p => p.name === 'フォレスト');
      expect(forest).toBeDefined();
      expect(forest!.primary).toMatch(/#56ab2f/i);
      expect(forest!.secondary).toMatch(/#a8e063/i);
    });

  it('オーシャンの配色は水色系である', () => {
      const palettes = generateColorPalette();
      const ocean = palettes.find(p => p.name === 'オーシャン');
      expect(ocean).toBeDefined();
      expect(ocean!.primary).toMatch(/#a1c4fd/i);
      expect(ocean!.secondary).toMatch(/#c2e9fb/i);
    });
  });

  describe('generateTwitterShareUrl', () => {
    it('テキストとハッシュタグ付きのTwitter/X intent URLを生成する', () => {
      const url = generateTwitterShareUrl('テスト', ['FavoritePokemonSharing']);
      // X.comの新しいURLを使用
      expect(url).toContain('https://x.com/intent/post?');
      expect(url).toContain('text=%E3%83%86%E3%82%B9%E3%83%88');
      expect(url).toContain('hashtags=FavoritePokemonSharing');
    });

    it('複数ハッシュタグをカンマ区切りで付与する', () => {
      const url = generateTwitterShareUrl('テスト', ['A', 'B']);
      expect(url).toContain('hashtags=A%2CB');
    });
  });

  describe('generateShareText', () => {
    it('1件のみでも番号付きで生成する', () => {
      const text = generateShareText(['ピカチュウ']);
      expect(text).toContain('1. ピカチュウ');
    });

    it('6件まで列挙して末尾文言を含む', () => {
      const names = ['a','b','c','d','e','f'];
      const text = generateShareText(names);
      expect(text).toContain('6. f');
      expect(text).toMatch(/みんなの好きなポケモンも教えて！$/);
    });
  });
});
