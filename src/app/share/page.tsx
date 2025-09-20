'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useSelectedPokemon } from '@/store/pokemonStore';
import { PokemonTeamDisplay, ThemeSelector, LayoutSelector } from '@/components/pokemon/PokemonTeamDisplay';
import {
  generatePokemonTeamImage,
  downloadImage,
  copyImageToClipboard,
  shareImage,
  generateTwitterShareUrl,
  generateFacebookShareUrl,
  generateLineShareUrl,
  generateShareText,
  generateColorPalette,
} from '@/utils/shareUtils';
import {
  ArrowLeft,
  Download,
  Copy,
  Share2,
  Twitter,
  Facebook,
  MessageCircle,
  Smartphone,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function SharePage() {
  const selectedPokemon = useSelectedPokemon();
  const [selectedTheme, setSelectedTheme] = useState(generateColorPalette()[0]);
  const [layout, setLayout] = useState<'grid' | 'horizontal'>('grid');
  const [showTypes, setShowTypes] = useState(true);
  const [showIds, setShowIds] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedImage, setLastGeneratedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  // ポケモンが選択されていない場合のリダイレクト
  useEffect(() => {
    if (selectedPokemon.length === 0) {
      // リダイレクトの代わりに警告を表示
    }
  }, [selectedPokemon]);

  const showStatus = (type: 'success' | 'error', message: string) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: null, message: '' }), 3000);
  };

  const handleGenerateImage = async (): Promise<string | null> => {
    setIsGenerating(true);
    try {
      const dataUrl = await generatePokemonTeamImage('pokemon-team-display');
      setLastGeneratedImage(dataUrl);
      showStatus('success', '画像を生成しました！');
      return dataUrl;
    } catch (error) {
      console.error('Failed to generate image:', error);
      showStatus('error', '画像の生成に失敗しました');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const dataUrl = lastGeneratedImage || await handleGenerateImage();
    if (dataUrl) {
      downloadImage(dataUrl, 'my-pokemon-team.png');
    }
  };

  const handleCopyToClipboard = async () => {
    const dataUrl = lastGeneratedImage || await handleGenerateImage();
    if (dataUrl) {
      try {
        await copyImageToClipboard(dataUrl);
        showStatus('success', '画像をクリップボードにコピーしました！');
      } catch (error) {
        showStatus('error', 'クリップボードへのコピーに失敗しました');
      }
    }
  };

  const handleNativeShare = async () => {
    const dataUrl = lastGeneratedImage || await handleGenerateImage();
    if (dataUrl) {
      const shareText = generateShareText(selectedPokemon.map(p => p.name));
      try {
        await shareImage(dataUrl, 'マイポケモンチーム', shareText);
        showStatus('success', '共有しました！');
      } catch (error) {
        showStatus('error', 'ネイティブ共有に失敗しました');
      }
    }
  };

  const handleSocialShare = (platform: 'twitter' | 'facebook' | 'line') => {
    const shareText = generateShareText(selectedPokemon.map(p => p.name));
    const hashtags = ['ポケモン', '好きなポケモン', 'Pokemon'];
    
    let url: string;
    switch (platform) {
      case 'twitter':
        url = generateTwitterShareUrl(shareText, hashtags);
        break;
      case 'facebook':
        url = generateFacebookShareUrl();
        break;
      case 'line':
        url = generateLineShareUrl(shareText);
        break;
    }
    
    window.open(url, '_blank', 'width=600,height=400');
  };

  if (selectedPokemon.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">ポケモンが選択されていません</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              まずポケモンを選択してからシェアページにお越しください。
            </p>
            <Link href="/select">
              <Button>ポケモンを選ぶ</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/select">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  戻る
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">シェアする</h1>
                <p className="text-sm text-gray-600">
                  選択した{selectedPokemon.length}匹のポケモンを共有
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {status.type && (
        <div className="container mx-auto px-4 py-2">
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            status.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {status.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {status.message}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Preview Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>プレビュー</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <PokemonTeamDisplay
                    elementId="pokemon-team-display"
                    customTheme={selectedTheme}
                    showTypes={showTypes}
                    showIds={showIds}
                    layout={layout}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customization Panel */}
          <div className="space-y-6">
            {/* Display Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">表示オプション</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">タイプを表示</label>
                  <Switch checked={showTypes} onCheckedChange={setShowTypes} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">図鑑番号を表示</label>
                  <Switch checked={showIds} onCheckedChange={setShowIds} />
                </div>
              </CardContent>
            </Card>

            {/* Theme Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">カスタマイズ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ThemeSelector
                  selectedTheme={selectedTheme}
                  onThemeChange={setSelectedTheme}
                />
                <LayoutSelector
                  layout={layout}
                  onLayoutChange={setLayout}
                />
              </CardContent>
            </Card>

            {/* Share Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">共有・保存</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Generate Image */}
                <Button
                  onClick={handleGenerateImage}
                  disabled={isGenerating}
                  className="w-full"
                  variant="outline"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    '画像を生成'
                  )}
                </Button>

                {/* Download */}
                <Button onClick={handleDownload} className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  ダウンロード
                </Button>

                {/* Copy to Clipboard */}
                <Button onClick={handleCopyToClipboard} className="w-full" variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  クリップボードにコピー
                </Button>

                {/* Native Share */}
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <Button onClick={handleNativeShare} className="w-full" variant="outline">
                    <Smartphone className="h-4 w-4 mr-2" />
                    デバイスで共有
                  </Button>
                )}

                <div className="border-t pt-3 mt-3">
                  <p className="text-sm text-gray-600 mb-3">SNSで共有</p>
                  
                  {/* Social Share Buttons */}
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      onClick={() => handleSocialShare('twitter')}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Twitter className="h-4 w-4 mr-2 text-blue-500" />
                      Twitterで共有
                    </Button>
                    
                    <Button
                      onClick={() => handleSocialShare('facebook')}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                      Facebookで共有
                    </Button>
                    
                    <Button
                      onClick={() => handleSocialShare('line')}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <MessageCircle className="h-4 w-4 mr-2 text-green-500" />
                      LINEで共有
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}