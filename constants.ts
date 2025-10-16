import { User, Quest, CommunityEvent, QuestStatus, ChatMessage, ProjectTask, WisdomEntry } from './types';

export const JAPAN_PREFECTURES = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

export const ANONYMOUS_USER: User = {
    id: 0,
    name: '匿名さん',
    avatarUrl: 'https://picsum.photos/seed/anonymous/200',
    bio: 'ギルドを訪れたゲスト。',
    skills: [],
    activityLog: [],
    wisdomLog: [],
    prefecture: '',
};

export const WISDOM_ENTRIES: WisdomEntry[] = [
    {
        id: 1,
        authorId: 3,
        problem: 'プランターの野菜がうまく育たない',
        solution: 'まずは土作りから見直してみましょう。市販の培養土に腐葉土や堆肥を少し混ぜるだけで、水はけと栄養がぐっと改善されます。',
        tags: ['#家庭菜園', '#ガーデニング'],
        timestamp: '2024-07-10'
    },
    {
        id: 2,
        authorId: 1,
        problem: 'Webサイトの配色でいつも迷ってしまう',
        solution: 'Adobe Colorのような配色ツールを使うのがおすすめです。ベースカラーを1色決めれば、それに合う色の組み合わせを自動で提案してくれます。',
        tags: ['#Webデザイン', '#配色'],
        timestamp: '2024-06-22'
    },
    {
        id: 3,
        authorId: 2,
        problem: 'DIYで木材をまっすぐ切れない',
        solution: 'ソーガイド（鋸ガイド）を使うと驚くほどまっすぐ切れますよ！ホームセンターで手頃な価格で手に入ります。一度使うと手放せません。',
        tags: ['#DIY', '#工具'],
        timestamp: '2024-05-15'
    },
];

export const USERS: User[] = [
  ANONYMOUS_USER,
  {
    id: 1,
    name: 'Yuki',
    avatarUrl: 'https://picsum.photos/seed/yuki/200',
    bio: 'Webデザイナーとして活動しています。地域のカフェやお店をデザインで応援するのが好きです。週末はカメラを持って散歩しています。',
    skills: ['#Webデザイン', '#写真撮影', '#UIUX'],
    activityLog: [
      { questId: 1, questTitle: 'カフェの新メニューチラシ作成', feedback: '素敵なデザインをありがとうございました！', timestamp: '2023-10-15' },
    ],
    wisdomLog: WISDOM_ENTRIES.filter(w => w.authorId === 1),
    prefecture: '東京都',
  },
  {
    id: 2,
    name: 'Taro',
    avatarUrl: 'https://picsum.photos/seed/taro/200',
    bio: '大学で建築を学んでいます。力仕事やDIYが得意です！地域のイベント設営なども手伝います。',
    skills: ['#力仕事OK', '#DIY', '#イベント設営'],
    activityLog: [
        { questId: 3, questTitle: 'コミュニティガーデンの整備', feedback: 'とても助かりました。またお願いします！', timestamp: '2023-11-01' },
    ],
    wisdomLog: WISDOM_ENTRIES.filter(w => w.authorId === 2),
    prefecture: '神奈川県',
  },
  {
    id: 3,
    name: 'Sato-san',
    avatarUrl: 'https://picsum.photos/seed/sato/200',
    bio: '定年退職し、現在は家庭菜園を楽しんでいます。野菜作りや料理について教えられます。お悩み相談もどうぞ。',
    skills: ['#家庭菜園', '#料理', '#お悩み相談'],
    activityLog: [],
    wisdomLog: WISDOM_ENTRIES.filter(w => w.authorId === 3),
    prefecture: '千葉県',
  },
  {
    id: 4,
    name: 'Cafe Hanamori',
    avatarUrl: 'https://picsum.photos/seed/cafe/200',
    bio: '街角の小さなカフェです。季節の食材を使ったメニューを提供しています。お店のちょっとしたことで、皆さんのお力を貸していただけると嬉しいです。',
    skills: ['#カフェ運営', '#接客'],
    activityLog: [],
    wisdomLog: [],
    prefecture: '東京都',
  },
];

export const QUESTS: Quest[] = [
  {
    id: 1,
    title: 'カフェの新メニューのチラシを作ってほしい！',
    description: '春の新メニュー「桜ラテ」のプロモーション用チラシ（A5サイズ）のデザインをお願いしたいです。温かみのある、春らしいデザインが得意な方を探しています。',
    clientId: 4,
    reward: '当店のお食事券3000円分',
    requiredTags: ['#Webデザイン', '#グラフィックデザイン'],
    participants: [1],
    status: QuestStatus.Completed,
    prefecture: '東京都',
  },
  {
    id: 2,
    title: '商店街の夏祭りの写真撮影',
    description: '7月末に開催される夏祭りの様子を撮影してくれるカメラマンを募集します。子どもたちの笑顔や、賑わうお店の様子など、生き生きとした写真を期待しています。',
    clientId: 2,
    reward: '謝礼金 10,000円',
    requiredTags: ['#写真撮影', '#イベント撮影'],
    participants: [],
    status: QuestStatus.Open,
    prefecture: '神奈川県',
  },
  {
    id: 3,
    title: 'コミュニティガーデンの整備',
    description: 'ギルドハウス裏の小さな庭の手入れを手伝ってください。雑草取りや土の耕しなど、簡単な作業です。一緒に気持ちのいい汗を流しませんか？',
    clientId: 3,
    reward: '採れたて野菜の詰め合わせ',
    requiredTags: ['#力仕事OK', '#家庭菜園'],
    participants: [2],
    status: QuestStatus.InProgress,
    prefecture: '千葉県',
  },
  {
    id: 4,
    title: 'Webサイトの文章作成・校正',
    description: '新しく立ち上げる地域の情報サイトの記事を書いてくれる方、または校正を手伝ってくれる方を募集します。地域の魅力が伝わるような文章をお願いします。',
    clientId: 1,
    reward: '応相談',
    requiredTags: ['#文章作成', '#ライティング', '#編集'],
    participants: [],
    status: QuestStatus.Open,
    prefecture: '東京都',
  },
];

export const EVENTS: CommunityEvent[] = [
    {
        id: 1,
        title: 'もくもく会＠ギルドハウス',
        description: '各自で好きな作業や勉強をする会です。集中したい方、誰かと一緒に作業したい方、お気軽にどうぞ。',
        date: '毎週水曜日 19:00 - 21:00',
        location: 'ギルドハウス談話室',
    },
    {
        id: 2,
        title: 'スキルアップ勉強会：初めてのWebデザイン',
        description: 'WebデザイナーのYukiさんを講師に、デザインの基本を学びます。初心者歓迎！',
        date: '2024-08-15 14:00 - 16:00',
        location: 'ギルドハウス・セミナールーム',
    },
    {
        id: 3,
        title: '地域交流会',
        description: '新しい仲間を見つけませんか？地域の美味しいものを持ち寄って、みんなで楽しくおしゃべりする会です。',
        date: '2024-08-25 18:00 - 20:00',
        location: 'ギルドハウス・ホール',
    }
];


export const PROJECT_CHAT: ChatMessage[] = [
    { id: 1, userId: 4, message: 'Yukiさん、この度はよろしくお願いします！', timestamp: '2023-10-10 10:00' },
    { id: 2, userId: 1, message: 'こちらこそ！素敵なチラシになるよう頑張りますね。いくつかデザイン案を考えてみます。', timestamp: '2023-10-10 10:05' },
    { id: 3, userId: 4, message: '楽しみにしています！', timestamp: '2023-10-10 10:06' },
];
