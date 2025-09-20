import domtoimage from 'dom-to-image';

// 画像生成関連のユーティリティ
export const generatePokemonTeamImage = async (elementId: string): Promise<string> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // 高品質な画像を生成
    const dataUrl = await domtoimage.toPng(element, {
      quality: 1.0,
      bgcolor: '#ffffff',
      width: 800,
      height: 600,
      style: {
        transform: 'scale(2)',
        transformOrigin: 'top left',
        width: '400px',
        height: '300px',
      },
    });

    return dataUrl;
  } catch (error) {
    console.error('Failed to generate image:', error);
    throw error;
  }
};

// 画像をダウンロード
export const downloadImage = (dataUrl: string, filename: string = 'my-pokemon-team.png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 画像をクリップボードにコピー
export const copyImageToClipboard = async (dataUrl: string): Promise<void> => {
  try {
    // データURLをBlobに変換
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    
    // ClipboardAPIが利用可能かチェック
    if (navigator.clipboard && 'write' in navigator.clipboard) {
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
    } else {
      throw new Error('Clipboard API not supported');
    }
  } catch (error) {
    console.error('Failed to copy image to clipboard:', error);
    throw error;
  }
};

// Web Share APIを使用した共有
export const shareImage = async (dataUrl: string, title: string, text: string): Promise<void> => {
  try {
    if (navigator.share && navigator.canShare) {
      // データURLをFileに変換
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'pokemon-team.png', { type: 'image/png' });
      
      const shareData = {
        title,
        text,
        files: [file],
      };
      
      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return;
      }
    }
    
    // フォールバック: 従来の方法
    throw new Error('Web Share API not supported');
  } catch (error) {
    console.error('Failed to share image:', error);
    throw error;
  }
};

// Twitter用の共有URL生成
export const generateTwitterShareUrl = (text: string, hashtags: string[] = []): string => {
  const params = new URLSearchParams({
    text,
    hashtags: hashtags.join(','),
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
};

// Facebook用の共有URL生成（画像は手動でアップロード）
export const generateFacebookShareUrl = (url: string = window.location.href): string => {
  const params = new URLSearchParams({
    u: url,
  });
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
};

// LINE用の共有URL生成
export const generateLineShareUrl = (text: string, url: string = window.location.href): string => {
  const params = new URLSearchParams({
    text: `${text} ${url}`,
  });
  return `https://social-plugins.line.me/lineit/share?${params.toString()}`;
};

// 共有用テキスト生成
export const generateShareText = (pokemonNames: string[]): string => {
  if (pokemonNames.length === 0) {
    return '好きなポケモンチームを作成しました！';
  }
  
  const names = pokemonNames.slice(0, 3).join('、');
  const suffix = pokemonNames.length > 3 ? 'など' : '';
  
  return `私の好きなポケモンチーム: ${names}${suffix}！`;
};

// カラーパレット生成
export const generateColorPalette = () => {
  const palettes = [
    {
      name: 'デフォルト',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      primary: '#667eea',
      secondary: '#764ba2',
    },
    {
      name: 'オーシャン',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      primary: '#1e3c72',
      secondary: '#2a5298',
    },
    {
      name: 'サンセット',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      primary: '#f093fb',
      secondary: '#f5576c',
    },
    {
      name: 'フォレスト',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      primary: '#4facfe',
      secondary: '#00f2fe',
    },
    {
      name: 'オータム',
      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      primary: '#fa709a',
      secondary: '#fee140',
    },
    {
      name: 'ミッドナイト',
      background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
      primary: '#2c3e50',
      secondary: '#3498db',
    },
  ];
  
  return palettes;
};