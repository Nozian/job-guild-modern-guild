import React from 'react';
import { Card } from './common/Card';
import { QuestIcon, WisdomIcon, UserIcon } from './icons/Icons';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <Card>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">現代リアルギルドへようこそ！</h1>
          <p className="text-lg text-stone-700 max-w-3xl mx-auto">
            ここは、あなたの「得意」と誰かの「助けて」が出会う場所。
            <br />
            地域の人々がスキルや知識を持ち寄り、助け合い、新しい繋がりを育むためのコミュニティです。
          </p>
        </div>
      </Card>
      
       <Card>
        <h2 className="text-2xl font-bold text-amber-900 mb-4">ギルドマスターよりご挨拶</h2>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img src="https://picsum.photos/seed/guildmaster/200" alt="Guild Master" className="w-24 h-24 rounded-full border-4 border-amber-200 shadow-md"/>
          <p className="text-stone-700 italic">
            「ようこそ、冒険者よ。わしがこのギルドのマスターじゃ。ここでは、誰もが主役。君の持つユニークなスキルが、この街の誰かを笑顔にする力となる。大それたことじゃなくていい。庭の草むしりから、Webサイトの構築まで、あらゆる助け合いが、我々の世界を豊かにするのじゃ。さあ、勇気を出して最初の一歩を踏み出してみよう。素晴らしい出会いが君を待っておるぞ！」
          </p>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-6 text-center">
        <Card>
          <div className="flex justify-center mb-4">
            <QuestIcon className="w-12 h-12 text-amber-700"/>
          </div>
          <h2 className="text-xl font-bold text-amber-900 mb-2">クエストに参加しよう</h2>
          <p className="text-stone-600">
            「チラシを作ってほしい」「庭の手入れを手伝って」といった様々なお願い（クエスト）が日々投稿されます。あなたのスキルを活かして、誰かの役に立ってみませんか？
          </p>
        </Card>
        <Card>
          <div className="flex justify-center mb-4">
            <WisdomIcon className="w-12 h-12 text-amber-700"/>
          </div>
          <h2 className="text-xl font-bold text-amber-900 mb-2">知恵を共有しよう</h2>
          <p className="text-stone-600">
            「野菜を美味しく育てるコツ」「便利なWebツール」など、あなたの持つ知識や経験は誰かにとっての宝物。知恵袋でライフハックを共有し、みんなの毎日を豊かにしましょう。
          </p>
        </Card>
        <Card>
          <div className="flex justify-center mb-4">
            <UserIcon className="w-12 h-12 text-amber-700"/>
          </div>
          <h2 className="text-xl font-bold text-amber-900 mb-2">仲間と繋がろう</h2>
          <p className="text-stone-600">
            ギルドは、地域に住む多彩な人々が集う場所。クエストやイベントを通じて、新しい友人や協力者が見つかるかもしれません。まずは気軽にアカウントを作って、仲間入りしましょう！
          </p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
            <h2 className="text-2xl font-bold text-amber-900 mb-4">ギルドランクシステム</h2>
            <p className="text-stone-700 mb-4">
                ギルドでの活動はすべて経験値になります。クエストを完了したり、知恵を共有したりすることでランクが上がり、より信頼される冒険者の証となります。
            </p>
            <ul className="space-y-3">
                <li className="flex items-center">
                    <span className="font-bold text-lg w-28 text-stone-500">ブロンズ</span>
                    <p className="text-sm text-stone-600">ギルドに登録したばかりの新人冒険者。</p>
                </li>
                <li className="flex items-center">
                    <span className="font-bold text-lg w-28 text-amber-600">シルバー</span>
                    <p className="text-sm text-stone-600">いくつかのクエストをこなし、信頼を得始めた一人前の冒険者。</p>
                </li>
                <li className="flex items-center">
                    <span className="font-bold text-lg w-28 text-yellow-500">ゴールド</span>
                    <p className="text-sm text-stone-600">豊富な経験と実績を持つ、ギルドの中核を担うベテラン冒険者。</p>
                </li>
                 <li className="flex items-center">
                    <span className="font-bold text-lg w-28 text-cyan-500">？？？</span>
                    <p className="text-sm text-stone-600">伝説の領域。その名はギルドの歴史に刻まれる。</p>
                </li>
            </ul>
        </Card>
        <Card>
            <h2 className="text-2xl font-bold text-amber-900 mb-4">ギルドの掟（ルールとマナー）</h2>
            <div className="space-y-3 text-stone-700">
              <p><strong className="text-amber-800">一、互いに敬意を払うこと。</strong><br/>年齢、職業、スキルに関わらず、すべてのメンバーは対等な仲間です。感謝の気持ちを忘れずに。</p>
              <p><strong className="text-amber-800">一、約束は守ること。</strong><br/>引き受けたクエストは責任を持って遂行しましょう。難しい場合は、早めに相談を。</p>
              <p><strong className="text-amber-800">一、困ったときはお互い様。</strong><br/>誰もが誰かの助けを必要としています。臆することなく声を上げ、手を差し伸べましょう。</p>
              <p><strong className="text-amber-800">一、楽しむ心を忘れないこと。</strong><br/>最も大切な掟です。ギルドでの活動を通じて、あなた自身の毎日も豊かにしてください。</p>
            </div>
        </Card>
      </div>

       <Card>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">さあ、冒険を始めよう！</h2>
          <p className="text-stone-700 mb-6">
            準備はいいですか？ギルドの扉はいつでもあなたのために開かれています。<br/>
            まずはクエストボードを覗いてみるか、あなたのプロフィールを登録して、仲間たちに自分をアピールしましょう。
          </p>
           <button className="bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-transform hover:scale-105 text-lg">
            ギルドメンバーに登録する
          </button>
        </div>
      </Card>
    </div>
  );
};