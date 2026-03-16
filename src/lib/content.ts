export const aboutItems = [
  {
    num: '01',
    title: '「No Code」に生きていく',
    body: 'Codeを直訳すると、規定、規制、暗号などの意味、また国番号を表す言葉。私たちは、"それら全てに捕らわれず、新しい価値を創造したい。" それが「NoCode」という言葉に込めた想いです。',
    image: 'bg-gradient-to-br from-[#2a1f14] via-[#4a3525] to-[#1a1410]',
    label: 'PHILOSOPHY',
  },
  {
    num: '02',
    title: 'Chef+（シェフ プラス）という在り方',
    body: '常々自分が料理人として出来ることにチャレンジしていく中で想っていた事。それは料理人が料理をするだけでは無い、という事。「食」に関わる全てのコトをアップデートする為に「シェフ」以上の活動を通じ未来を創造したい。自分と社会の繋がりを体現する「+」に決意と覚悟を込めました。',
    image: 'bg-gradient-to-br from-[#1a2018] via-[#3a4a35] to-[#101a10]',
    label: 'CHEF+',
  },
  {
    num: '03',
    title: '食で未来を創る',
    body: '食が持っている力は大きい、人間誰しもが「食べる」ことを止めません。食べることからは誰も逃れられない、だからこそ「食」は未来を創るための最幸のツール。家族、友人を幸せにすることや、社会問題を解決することも出来ます。出来る事から始め、未来を創ることを止めない。',
    image: 'bg-gradient-to-br from-[#2a1a1a] via-[#4a2a25] to-[#1a1010]',
    label: 'FUTURE',
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
    longBio: '1980年東京浅草に生まれる。幼少期から食に強い関心を持ち、16歳で料理の道を志す。都内のフランス料理店で修業を積んだ後、22歳で単身渡米。ニューヨークのミシュラン三ツ星レストラン「Jean-Georges」にて、日本人として初めてスーシェフに抜擢される。\n\n帰国後は「Jean-Georges Tokyo」のシェフ・ド・キュイジーヌを務め、2018年に自身のレストラン「The Burn」をオープン。フランス料理をベースにしながらも、ジャンルの枠に捕らわれない自由な発想で料理を創造する。\n\n現在は「No Code」を主宰し、「Chef+」（シェフプラス）として料理人の枠を超えた活動を展開。サステナビリティ、フードロス問題、次世代の育成など、食を通じた社会貢献に力を注ぐ。2026年には台北にも進出予定。',
    philosophy: '「食」は未来を創るための最幸のツール。規定に捕らわれず、新しい価値を創造し続ける。',
    image: 'bg-gradient-to-b from-[#16161e] via-[#2a2a38] to-[#0c0c14]',
    photo: '/images/yonezawa.jpg',
    hugeName: 'YONEZAWA',
    gallery: [
      { src: '/images/yonezawa.jpg', alt: '米澤文雄 ポートレート' },
      { src: '', alt: '調理風景' },
      { src: '', alt: 'Jean-Georges 時代' },
      { src: '', alt: 'イベント登壇' },
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
    bio: 'No Codeのヘッドシェフ。米澤シェフの哲学を共有しながら、独自の感性で季節の食材を表現。緻密な技術と繊細な味覚で、カウンター越しにゲストとの距離を縮める料理を生み出す。',
    longBio: 'No Codeの料理の核を担うヘッドシェフ。米澤シェフの右腕として、その哲学と技術を深く理解しながらも、独自の感性で季節の食材を大胆に表現する。\n\n特にその繊細な味覚には定評があり、食材の持つポテンシャルを最大限に引き出す火入れと味の構成力は、多くのゲストを魅了している。カウンター越しにゲスト一人ひとりとの距離を縮め、その日の気分や好みに合わせた臨機応変なおまかせコースを提供する。\n\n「料理は対話」をモットーに、食材との対話、ゲストとの対話を大切にしながら、No Codeの哲学を体現する料理を日々追求している。',
    philosophy: '料理は対話。食材の声を聞き、ゲストの想いに応える。',
    image: 'bg-gradient-to-b from-[#1e1616] via-[#382a2a] to-[#140c0c]',
    photo: '/images/hisamatsu.jpg',
    hugeName: 'HISAMATSU',
    gallery: [
      { src: '/images/hisamatsu.jpg', alt: '久松晃紀 ポートレート' },
      { src: '', alt: 'カウンターでの調理' },
      { src: '', alt: '食材の仕込み' },
    ],
    career: [
      { year: '—', text: '都内有名フランス料理店にて修業' },
      { year: '—', text: '米澤シェフとの出会い、The Burnに参画' },
      { year: '2022', text: 'No Code ヘッドシェフに就任' },
      { year: '2024', text: '西麻布 No Code のおまかせコースを統括' },
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
    tag: 'Private Dining — Tokyo',
    slug: 'nocode',
    desc: 'カウンター8席だけの紹介制ダイニング。おまかせコースで「今、美味しいと思うモノ」を。',
    longDesc: '西麻布の隠れ家に佇むカウンター8席の完全紹介制ダイニング。米澤文雄シェフが「今、美味しいと思うモノ」を追求し、ジャンルの枠を超えた独自のおまかせコースを提供。フランス料理をベースに、日本の食材と世界の技法を融合させた唯一無二の料理体験をお届けします。カウンター越しにシェフとの距離が近い、親密な空間が特徴です。',
    address: '東京都港区西麻布2-25-31 クオーレ西麻布 2F',
    hours: 'おまかせコース 18:00–21:00\nアラカルト 21:15–23:00\n定休日：不定休',
    phone: '03-XXXX-XXXX（完全紹介制）',
    access: '東京メトロ日比谷線 六本木駅 徒歩8分\n東京メトロ千代田線 乃木坂駅 徒歩10分',
    seats: 'カウンター8席',
    style: 'おまかせコース / アラカルト',
    note: '※ 完全紹介制。初めてのご予約はご紹介者を通じてお問い合わせください。',
    image: 'bg-gradient-to-br from-[#1a1510] via-[#3a3020] to-[#0a0808]',
    gallery: [
      { src: '', alt: 'カウンター席' },
      { src: '', alt: '料理イメージ 1' },
      { src: '', alt: '料理イメージ 2' },
      { src: '', alt: '空間イメージ' },
    ],
  },
  {
    name: 'NY BISTRO BY NO CODE',
    sub: 'ニューヨークビストロ',
    tag: 'Bistro — Tokyo',
    slug: 'ny-bistro',
    desc: 'NYのエッセンスを東京で。カジュアルでありながら本格的なビストロ料理を。',
    longDesc: 'ニューヨークで培った米澤シェフのエッセンスを、東京の日常に落とし込んだビストロ。肩肘張らないカジュアルな雰囲気の中で、本格的なアメリカン・フレンチをベースにしたビストロ料理を楽しめます。ランチからディナーまで、幅広いシーンに対応するオープンな空間が魅力です。',
    address: '東京都（詳細確認中）',
    hours: 'ランチ 11:30–14:30\nディナー 18:00–22:00\n定休日：月曜日',
    style: 'ビストロ / アラカルト',
    image: 'bg-gradient-to-br from-[#16161e] via-[#2a2a38] to-[#08080e]',
    gallery: [
      { src: '', alt: '店内の雰囲気' },
      { src: '', alt: 'ビストロ料理' },
      { src: '', alt: 'ドリンク' },
    ],
  },
  {
    name: 'HITSUJI PUBLIC',
    sub: 'ヒツジパブリック',
    tag: 'Lamb Specialty — Tokyo',
    slug: 'hitsuji-public',
    desc: '羊肉の新しい楽しみ方を提案。厳選ラム・マトンを多彩な調理法で。',
    longDesc: '「羊肉をもっと日常に」をコンセプトに、ラム・マトンの新しい楽しみ方を提案するスペシャリティレストラン。世界各国の羊肉料理を研究し、日本人の味覚に合わせたオリジナルレシピで提供。グリル、煮込み、ローストなど多彩な調理法で、羊肉の奥深い魅力を引き出します。',
    address: '東京都渋谷区（詳細確認中）',
    hours: 'ディナー 17:00–23:00\n定休日：火曜日',
    style: 'ラム・マトン専門 / コース・アラカルト',
    image: 'bg-gradient-to-br from-[#1e1510] via-[#3e2a18] to-[#0e0a06]',
    gallery: [
      { src: '', alt: 'ラムグリル' },
      { src: '', alt: '店内' },
      { src: '', alt: 'ラムチョップ' },
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
    note: '※ 2026年4月オープン予定。完全紹介制。',
    image: 'bg-gradient-to-br from-[#0a1520] via-[#1a2a3a] to-[#050a12]',
    gallery: [
      { src: '/images/taipei-hero.jpg', alt: '台北イメージ' },
      { src: '', alt: '店内イメージ' },
    ],
    link: '/taipei',
  },
];

export const projects = [
  { title: 'HOTEL THE MITSUI「FORNI」', desc: '5ツ星ラグジュアリーホテルのイタリアンダイニングにて薪窯グリルのレシピ開発・チームマネジメント', year: '2023', client: '三井不動産リゾートマネジメント' },
  { title: 'ヱスジ苑（SGN）', desc: '「禁牛法」コンセプトのサステナブルヤキニクのメニュー開発', year: '2023', client: 'SG Management' },
  { title: '白井屋ホテル「the LOUNGE」', desc: 'アートディスティネーション・ホテルのオールデイダイニング監修・スタッフ研修', year: '2023', client: '白井屋ホテル' },
  { title: 'Purple Carrot', desc: 'Oisixヴィーガンブランドのフードプロデュース。「時々ヴィーガン」なライフスタイルを提案', year: '2022', client: 'オイシックス・ラ・大地' },
  { title: 'swrl. wine cocktail & kitchen', desc: '世界No.1バーテンダー後閑信吾氏とのコラボレーション。ラテンアメリカ料理ベースのフードプロデュース', year: '2022', client: 'SG Management' },
];
