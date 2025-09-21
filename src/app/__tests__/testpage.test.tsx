import { render, screen, waitFor } from '@testing-library/react';
import TestPage from '@/app/test/page';

describe('テストページ', () => {
  it('エフェクト後にテキストを更新する', async () => {
    render(<TestPage />);
    await waitFor(() => {
      expect(screen.getByText(/useEffect worked!/)).toBeInTheDocument();
    });
  });
});
