export const aboutItems = [
  {
    num: '01',
    title: '「No Code」に生きていく',
    body: 'Codeを直訳すると、規定、規制、暗号などの意味、また国番号を表す言葉。私たちは、"それら全てに捕らわれず、新しい価値を創造したい。" それが「NoCode」という言葉に込めた想いです。',
    image: 'bg-gradient-to-br from-[#2a1f14] via-[#4a3525] to-[#1a1410]',
    label: 'PHILOSOPHY',
    photo: '/test/images/about1.jpg',
  },
  {
    num: '02',
    title: 'Chef+（シェフ プラス）という在り方',
    body: '常々自分が料理人として出来ることにチャレンジしていく中で想っていた事。それは料理人が料理をするだけでは無い、という事。「食」に関わる全てのコトをアップデートする為に「シェフ」以上の活動を通じ未来を創造したい。自分と社会の繋がりを体現する「+」に決意と覚悟を込めました。',
    image: 'bg-gradient-to-br from-[#1a2018] via-[#3a4a35] to-[#101a10]',
    label: 'CHEF+',
    photo: '/test/images/about2.jpg',
  },
  {
    num: '03',
    title: '食で未来を創る',
    body: '食が持っている力は大きい、人間誰しもが「食べる」ことを止めません。食べることからは誰も逃れられない、だからこそ「食」は未来を創るための最幸のツール。家族、友人を幸せにすることや、社会問題を解決することも出来ます。出来る事から始め、未来を創ることを止めない。',
    image: 'bg-gradient-to-br from-[#2a1a1a] via-[#4a2a25] to-[#1a1010]',
    label: 'FUTURE',
    photo: '/test/images/about3.jpg',
  },
];

export interface Chef {
  name: string;
  nameJp: string;
  role: string;
  bio: string;
  image: string;
  photo?: string;
  hugeName: string;
  gallery: { src: string; alt: string }[];
  career: { year: string; text: string }[];
  longBio: string;
  philosophy?: string;
}

export const chefs: Chef[] = [
  {
    name: 'FUMIO YONEZAWA',
    nameJp: '米澤 文雄',
    role: 'Owner Chef / Chef+',
    bio: '1980年東京浅草生まれ。22歳で単身渡米し、NYミシュラン三ツ星「Jean-Georges」にて日本人初のスーシェフに就任。帰国後「Jean-Georges Tokyo」シェフ・ド・キュイジーヌ。2018年「The Burn」オープン。現在は「No Code」を主宰し、Chef+として国内外で活動。',
    longBio: '1980年東京浅草に生まれる。幼少期から食に強い関心を持ち、16歳で料理の道を志す。都内のフランス料理店で修業を積んだ後、22歳で単身渡米。ニューヨークのミシュラン三ツ星レストラン「Jean-Georges」にて、日本人として初めてスーシェフに抜擢される。\n\n帰国後は「Jean-Georges Tokyo」のシェフ・ド・キュイジーヌを務め、2018年に自身のレストラン「The Burn」をオープン。フランス料理をベースにしながらも、ジャンルの枠に捕らわれない自由な発想で料理を創造する。\n\n現在は「No Code」を主宰し、「Chef+」（シェフプラス）として料理人の枠を超えた活動を展開。サステナビリティ、フードロス問題、次世代の育成など、食を通じた社会貢献に力を注ぐ。ソムリエの視点も持ち合わせ、独自のペアリングも監修。2026年には台北にも進出予定。',
    philosophy: '「食」は未来を創るための最幸のツール。規定に捕らわれず、新しい価値を創造し続ける。',
    image: 'bg-gradient-to-b from-[#16161e] via-[#2a2a38] to-[#0c0c14]',
    photo: '/test/images/yonezawa.jpg',
    hugeName: 'YONEZAWA',
    gallery: [
      { src: '/test/images/yonezawa.jpg', alt: '米澤文雄 ポートレート' },
      { src: '/test/images/nocode1.jpg', alt: '調理風景' },
      { src: '/test/images/nocode2.jpg', alt: 'No Code' },
    ],
    career: [
      { year: '1980', text: '東京都浅草に生まれる' },
      { year: '1996', text: '料理の道を志し、都内フランス料理店で修業開始' },
      { year: '2002', text: '単身渡米。NY「Jean-Georges」入店' },
      { year: '2006', text: '「Jean-Georges」にて日本人初のスーシェフに就任' },
      { year: '2010', text: '帰国。「Jean-Georges Tokyo」シェフ・ド・キュイジーヌ' },
      { year: '2015', text: 'RED U-35 Gold受賞' },
      { year: '2018', text: '「The Burn」オープン（青山）' },
      { year: '2020', text: '「No Code」を設立。Chef+としての活動を本格化' },
      { year: '2022', text: '西麻布に「No Code」ダイニングオープン' },
      { year: '2024', text: '「NY BISTRO BY NO CODE」「HITSUJI PUBLIC」展開' },
      { year: '2026', text: '「No Code Taipei」オープン予定' },
    ],
  },
  {
    name: 'AKINORI HISAMATSU',
    nameJp: '久松 晃紀',
    role: 'Head Chef',
    bio: 'Jean-Georgesにて米澤に師事。NY一つ星メキシカン「OXOMOCO」にてシェフに就任。フレンチ、メキシカン、アジアン、ヴィーガンなど多彩なジャンルに精通し、2025年6月よりNo Codeシェフに就任。',
    longBio: 'Jean-Georgesにて米澤に師事し、その後「The Burn」の立ち上げに参画。NYのミシュラン一つ星メキシカン「OXOMOCO」にてシェフに就任するなど、フレンチやメキシカン、アジアン、ヴィーガン、アメリカンと多彩なジャンルに精通。\n\nNo Code立ち上げと共にスーシェフに就任し、2025年6月よりシェフに抜擢。骨太なフレンチのキャリアをベースに、メキシカンとの融合を図る新ジャンル「メキシカンフレンチ」を米澤と共に創造。カウンター越しにゲスト一人ひとりとの距離を縮め、唯一無二のダイニング体験を提供する。',
    philosophy: '料理は対話。食材の声を聞き、ゲストの想いに応える。',
    image: 'bg-gradient-to-b from-[#1e1616] via-[#382a2a] to-[#140c0c]',
    photo: '/test/images/hisamatsu.jpg',
    hugeName: 'HISAMATSU',
    gallery: [
      { src: '/test/images/hisamatsu.jpg', alt: '久松晃紀 ポートレート' },
      { src: '/test/images/nocode3.jpg', alt: 'カウンターでの調理' },
    ],
    career: [
      { year: '—', text: 'Jean-Georgesにて米澤に師事' },
      { year: '—', text: 'The Burn 立ち上げに参画' },
      { year: '—', text: 'NY一つ星メキシカン「OXOMOCO」シェフ就任' },
      { year: '2022', text: 'No Code スーシェフに就任' },
      { year: '2025', text: 'No Code シェフに就任。「メキシカンフレンチ」を展開' },
    ],
  },
];

export interface Restaurant {
  name: string;
  sub: string;
  tag: string;
  desc: string;
  image: string;
  slug: string;
  address?: string;
  hours?: string;
  phone?: string;
  access?: string;
  seats?: string;
  style?: string;
  note?: string;
  longDesc?: string;
  gallery: { src: string; alt: string }[];
  link?: string;
}

export const restaurants: Restaurant[] = [
  {
    name: 'NO CODE',
    sub: '西麻布',
    tag: 'Mexican French — Tokyo',
    slug: 'nocode',
    desc: 'ミシュランシェフが創るメキシカンフレンチ。シェフとの距離0mのカウンターで味わう唯一無二のダイニング。',
    longDesc: '2025年6月、紹介制完全非公開を改め一般予約を開放。ミシュランNY三ツ星・東京一つ星のキャリアを持つ米澤文雄と、その右腕・久松晃紀による新ジャンル「メキシカンフレンチ」。世界中のフーディから寵愛を受けるメキシカンとフレンチの融合に、日本の文化・食材を織りなす唯一無二の料理。シェフとの距離0mのカウンターテーブルで味わう、新しいダイニングエクスペリエンスをお愉しみください。',
    address: '東京都港区西麻布2-25-31 クオーレ西麻布 2F',
    hours: '二部制（各回一斉スタート）\n第1部 17:00–19:30\n第2部 19:45–22:15\n定休日：月曜日・日曜日（不定休あり）',
    phone: '050-5456-6777（予約）\n03-4400-7524（店舗直通）',
    access: '東京メトロ千代田線 乃木坂駅 徒歩12分\n東京メトロ日比谷線 六本木駅 徒歩15分\n東京メトロ日比谷線 広尾駅 徒歩12分\n東京メトロ 表参道駅 徒歩18分',
    seats: 'カウンター8席',
    style: 'おまかせコース ¥13,500 / シグネチャーコース ¥8,800 / 週末ランチコース ¥4,500\nペアリング ¥12,000 / サービス料10%',
    note: '※ お子様は大人と同じ料理内容をお召し上がりいただける方のみ。ドレスコード：スマートカジュアル。',
    image: 'bg-gradient-to-br from-[#1a1510] via-[#3a3020] to-[#0a0808]',
    gallery: [
      { src: '/test/images/nocode1.jpg', alt: 'カウンター席' },
      { src: '/test/images/nocode2.jpg', alt: 'メキシカンフレンチ' },
      { src: '/test/images/nocode3.jpg', alt: 'ペアリング' },
      { src: '/test/images/nocode4.jpg', alt: '空間イメージ' },
      { src: '/test/images/nocode5.jpg', alt: '料理' },
    ],
  },
  {
    name: 'NY BISTRO BY NO CODE',
    sub: '丸の内 新丸ビル',
    tag: 'Bistro — Marunouchi',
    slug: 'ny-bistro',
    desc: 'NYで学んだスパイスとオリジナリティ溢れる料理をナチュラルワインと共に。気軽でありながら気の利いたNYスタイルのビストロ。',
    longDesc: 'NYミシュラン12年連続三ツ星「Jean-Georges」で日本人初の副料理長を務めた米澤文雄シェフの新店舗。NYで学んだ様々なスパイスやオリジナリティ溢れる料理をナチュラルワインと共に気軽にお楽しみいただけます。気軽だけれど、気の利いている料理とカジュアルな雰囲気がNYを彷彿させる、ビストロスタイルのお店です。',
    address: '東京都千代田区丸の内1-5-1 新丸ビル 7F',
    hours: '平日 11:00–15:00 / 17:00–23:00（LO 22:00）\n土曜 11:00–23:00（LO 22:00）\n日祝 11:00–22:00（LO 21:00）\n定休日：無休（1/1及び法定点検日を除く）',
    phone: '03-4400-0198',
    access: 'JR東京駅 丸の内北口 徒歩1分\n東京メトロ丸ノ内線 東京駅 直結\n東京メトロ千代田線 二重橋前駅 徒歩2分',
    seats: '18席（テラス席あり）',
    style: 'ビストロ / アラカルト\nランチ ～¥2,000 / ディナー ¥4,000～¥6,000',
    note: '※ 個室あり・貸切可・テイクアウト対応・ベビーカー入店可・ベジタリアンメニューあり。',
    image: 'bg-gradient-to-br from-[#16161e] via-[#2a2a38] to-[#08080e]',
    gallery: [
      { src: '/test/images/nybistro1.jpg', alt: '店内の雰囲気' },
      { src: '/test/images/nybistro2.jpg', alt: 'ビストロ料理' },
      { src: '/test/images/nybistro3.jpg', alt: 'ナチュラルワイン' },
      { src: '/test/images/nybistro4.jpg', alt: '料理' },
      { src: '/test/images/nybistro5.jpg', alt: 'テラス' },
      { src: '/test/images/nybistro6.jpg', alt: '前菜' },
      { src: '/test/images/nybistro7.jpg', alt: 'メイン' },
      { src: '/test/images/nybistro8.jpg', alt: 'デザート' },
      { src: '/test/images/nybistro9.jpg', alt: 'ランチ' },
      { src: '/test/images/nybistro10.jpg', alt: 'ディナー' },
    ],
  },
  {
    name: 'HITSUJI PUBLIC',
    sub: '虎ノ門ヒルズ',
    tag: 'Lamb Bistro — Toranomon',
    slug: 'hitsuji-public',
    desc: 'ミシュランシェフ達が創る大衆ラムビストロ。昼はバーガー、夜はラムビストロ。通称「ヒツパブ」。',
    longDesc: '「羊肉の大衆化」を掲げ、米澤文雄率いるミシュランシェフ達と羊肉の達人がコラボレーション。ランチタイムはラムバーガー、ディナーはラムチョップやグリルなどビストロスタイルで多彩な羊料理を提供。リーズナブルな価格で本格的な羊肉料理が楽しめる、通称「ヒツパブ」。虎ノ門ヒルズ ステーションタワー B2F T-MARKET内に展開。',
    address: '東京都港区虎ノ門2-6-1\n虎ノ門ヒルズ ステーションタワー B2F T-MARKET',
    hours: '平日・土 11:00–15:00（LO 14:00）/ 17:00–23:00（LO 料理22:00）\n日祝 11:00–15:00（LO 14:00）/ 17:00–22:00（LO 21:00）\n※ 休前日は土曜と同じ営業時間\n定休日：月曜日（祝日・休前日の場合は営業、翌平日に振替休業）',
    phone: '03-4400-5377',
    access: '東京メトロ日比谷線 虎ノ門ヒルズ駅 直結\n東京メトロ銀座線 虎ノ門駅 徒歩5分',
    seats: '24席',
    style: 'ラムビストロ / バーガー\nランチ ～¥1,800 / ディナー ～¥5,000',
    image: 'bg-gradient-to-br from-[#1e1510] via-[#3e2a18] to-[#0e0a06]',
    gallery: [
      { src: '/test/images/hitsupub1.jpg', alt: 'ラムチョップ' },
      { src: '/test/images/hitsupub2.jpg', alt: 'ラムバーガー' },
      { src: '/test/images/hitsupub3.jpg', alt: '店内' },
      { src: '/test/images/hitsupub4.jpg', alt: 'グリル' },
      { src: '/test/images/hitsupub5.jpg', alt: 'ラム料理' },
      { src: '/test/images/hitsupub6.jpg', alt: 'ドリンク' },
      { src: '/test/images/hitsupub7.jpg', alt: 'T-MARKET' },
      { src: '/test/images/hitsupub8.jpg', alt: '外観' },
    ],
  },
  {
    name: 'NO CODE TAIPEI',
    sub: '台北',
    tag: 'Private Dining — Taipei',
    slug: 'taipei',
    desc: 'No Codeの哲学を台北へ。2026年4月オープン。',
    longDesc: '東京・西麻布で生まれたNo Codeの哲学が、台北に上陸。日本の精緻な技法と台湾の豊かな食材を融合させ、唯一無二の味覚体験を創造します。カウンター席のおまかせスタイルで、季節ごとに変わる台湾食材の新たな可能性をお届けします。',
    address: '台北市大安區安和路一段（詳細確認中）',
    hours: 'Omakase 18:00–21:00\nÀ la carte 21:15–23:00\n定休日：月曜日',
    phone: '+886-2-XXXX-XXXX',
    access: '捷運信義安和站 徒歩約5分',
    seats: 'カウンター10席',
    style: 'おまかせ / アラカルト',
    note: '※ 2026年4月オープン予定。',
    image: 'bg-gradient-to-br from-[#0a1520] via-[#1a2a3a] to-[#050a12]',
    gallery: [
      { src: '/test/images/taipei-hero.jpg', alt: '台北イメージ' },
      { src: '', alt: '店内イメージ' },
    ],
    link: '/test/taipei',
  },
];

export const projects = [
  { title: 'HOTEL THE MITSUI「FORNI」', desc: '5ツ星ラグジュアリーホテルのイタリアンダイニングにて薪窯グリルのレシピ開発・チームマネジメント', year: '2023', client: '三井不動産リゾートマネジメント' },
  { title: 'ヱスジ苑（SGN）', desc: '「禁牛法」コンセプトのサステナブルヤキニクのメニュー開発', year: '2023', client: 'SG Management' },
  { title: '白井屋ホテル「the LOUNGE」', desc: 'アートディスティネーション・ホテルのオールデイダイニング監修・スタッフ研修', year: '2023', client: '白井屋ホテル' },
  { title: 'Purple Carrot', desc: 'Oisixヴィーガンブランドのフードプロデュース。「時々ヴィーガン」なライフスタイルを提案', year: '2022', client: 'オイシックス・ラ・大地' },
  { title: 'swrl. wine cocktail & kitchen', desc: '世界No.1バーテンダー後閑信吾氏とのコラボレーション。ラテンアメリカ料理ベースのフードプロデュース', year: '2022', client: 'SG Management' },
];
