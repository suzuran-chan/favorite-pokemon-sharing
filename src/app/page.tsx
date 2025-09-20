'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelectedPokemon } from "@/store/pokemonStore";
import { Zap, Heart, Share2, Smartphone } from "lucide-react";

export default function Home() {
  const selectedPokemon = useSelectedPokemon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            好きな<span className="text-blue-600">ポケモン</span>を<br />
            選んで<span className="text-purple-600">シェア</span>しよう
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            すべての世代から最大6匹のポケモンを選んで、
            あなただけのチームを作成し、SNSで友達と共有しよう！
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/select">
              <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
                <Zap className="mr-2 h-5 w-5" />
                ポケモンを選ぶ
              </Button>
            </Link>
            
            {selectedPokemon.length > 0 && (
              <Link href="/share">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  <Share2 className="mr-2 h-5 w-5" />
                  シェアする ({selectedPokemon.length}/6)
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">簡単選択</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                全世代のポケモンから好きなポケモンを最大6匹まで選択できます。
                検索やフィルタ機能で簡単に見つけられます。
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">カスタマイズ</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                背景やテーマを変更して、あなただけのポケモンチームを
                美しくカスタマイズできます。
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">SNS共有</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                作成したポケモンチームを画像として生成し、
                TwitterやFacebookで簡単にシェアできます。
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Selected Pokemon Preview */}
        {selectedPokemon.length > 0 && (
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">選択中のポケモン</h2>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {selectedPokemon.map((pokemon) => (
                <div key={pokemon.id} className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mb-2">
                    <img
                      src={pokemon.imageUrl}
                      alt={pokemon.name}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-600 capitalize">{pokemon.name}</p>
                </div>
              ))}
              
              {/* Empty slots */}
              {Array.from({ length: 6 - selectedPokemon.length }).map((_, index) => (
                <div key={`empty-${index}`} className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-2">
                    <span className="text-gray-400 text-xs">空き</span>
                  </div>
                  <p className="text-sm text-gray-400">未選択</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center gap-4">
              <Link href="/select">
                <Button variant="outline">
                  追加・変更する
                </Button>
              </Link>
              <Link href="/share">
                <Button>
                  シェアする
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            今すぐ始めよう！
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            あなたの好きなポケモンチームを作って、友達と共有しませんか？
          </p>
          <Link href="/select">
            <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Zap className="mr-2 h-5 w-5" />
              今すぐ始める
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
