export type Lang = 'zh' | 'en' | 'ja';

export const taipeiContent: Record<Lang, {
  hero: { eyebrow: string; subtitle: string; tagline: string };
  nav: { concept: string; chef: string; menu: string; info: string; contact: string };
  concept: {
    label: string; title: string;
    items: { title: string; body: string }[];
  };
  chef: {
    label: string; title: string;
    chefs: { name: string; nameLocal: string; role: string; bio: string }[];
  };
  menu: {
    label: string; title: string; intro: string;
    courses: { name: string; desc: string; note?: string }[];
    pairingTitle: string; pairingDesc: string;
    priceNote: string;
  };
  info: {
    label: string; title: string;
    address: string; hours: string; hoursDetail: string;
    phone: string; access: string;
    note: string;
  };
  contact: { label: string; title: string; desc: string; btn: string };
  footer: { tagline: string; parent: string };
}> = {
  zh: {
    hero: {
      eyebrow: '來自東京的私人料理體驗',
      subtitle: '無代碼',
      tagline: '在台北，品味無界限的美食哲學',
    },
    nav: { concept: '理念', chef: '主廚', menu: '料理', info: '餐廳資訊', contact: '聯繫' },
    concept: {
      label: '理念',
      title: '無代碼的美食哲學',
      items: [
        {
          title: '打破規則的料理',
          body: 'Code 在英文中意味著規則與限制。我們選擇打破這些框架，創造全新的美食價值。No Code 源自東京西麻布，由米澤文雄主廚創立，如今這份對自由與創新的追求，來到了台北。',
        },
        {
          title: '東京與台北的交匯',
          body: '日本的精湛技法與台灣豐饒的食材在此相遇。我們尊重每一份食材的本質，以最純粹的方式呈現季節的味道。這不僅是一頓晚餐，更是一場跨越文化的味覺對話。',
        },
        {
          title: '一期一會的體驗',
          body: '每一次的 Omakase 都是獨一無二的。我們不設固定菜單，每日根據最優質的食材即興創作。在吧台座席的親密空間中，感受主廚的溫度與料理的生命力。',
        },
      ],
    },
    chef: {
      label: '主廚',
      title: '我們的主廚',
      chefs: [
        {
          name: 'FUMIO YONEZAWA',
          nameLocal: '米澤 文雄',
          role: '創辦人 / 主廚',
          bio: '1980年生於東京淺草。22歲隻身赴美，在紐約米其林三星餐廳「Jean-Georges」成為首位日本人副主廚。回國後歷任多間名店主廚，2018年創立「The Burn」，現主理東京「No Code」及台北分店。以 Chef+（超越廚師）的理念，將美食的力量延伸至社會各個層面。',
        },
        {
          name: 'AKINORI HISAMATSU',
          nameLocal: '久松 晃紀',
          role: '行政主廚',
          bio: 'No Code 的核心主廚。承襲米澤主廚的料理哲學，同時以獨特的感性詮釋季節食材。精湛的技術與細膩的味覺，在吧台前為每位賓客打造最貼近心意的料理體驗。',
        },
      ],
    },
    menu: {
      label: '料理',
      title: 'OMAKASE',
      intro: '我們的料理完全採用 Omakase（主廚發辦）形式。不設固定菜單，每日根據當季最優質的食材，為您呈現獨一無二的味覺旅程。',
      courses: [
        { name: '先付 / 前菜', desc: '以台灣在地食材為靈感的開場，喚醒味蕾的序章。' },
        { name: '椀物 / 湯品', desc: '融合日式高湯技法與台灣風土的溫潤之味。' },
        { name: '造里 / 生魚片', desc: '嚴選台灣近海與日本直送的當季鮮魚。' },
        { name: '燒物 / 炭烤', desc: '以備長炭精準炙烤，引出食材最純粹的風味。' },
        { name: '食事 / 主食', desc: '使用台灣優質米，搭配時令配菜的滿足之味。' },
        { name: '甘味 / 甜點', desc: '融合法式技法與台灣水果的完美句點。' },
      ],
      pairingTitle: '酒水搭配',
      pairingDesc: '我們提供精心搭配的葡萄酒、日本酒與台灣茶的 Pairing 方案，為每道料理找到最完美的伴侶。',
      priceNote: '※ Omakase 晚間套餐 NT$8,800 起（不含酒水）\n※ 價格依食材而異，詳情請於預約時確認',
    },
    info: {
      label: '餐廳資訊',
      title: '基本資訊',
      address: '台北市大安區安和路一段（詳細地址確認中）',
      hours: '營業時間',
      hoursDetail: 'Omakase 晚餐　18:00 — 21:00\nÀ la carte　21:15 — 23:00\n定休日：每週一',
      phone: '電話：+886-2-XXXX-XXXX',
      access: '交通方式：捷運信義安和站 步行約5分鐘',
      note: '※ 本店為完全推薦制。預約請透過介紹人聯繫。',
    },
    contact: {
      label: '聯繫',
      title: '聯繫我們',
      desc: '如有任何疑問或合作提案，歡迎透過以下方式與我們聯繫。',
      btn: '發送訊息',
    },
    footer: { tagline: '來自東京的私人料理體驗', parent: '前往 No Code 東京 →' },
  },
  en: {
    hero: {
      eyebrow: 'A Private Dining Experience from Tokyo',
      subtitle: 'No Code',
      tagline: 'Boundless gastronomy, now in Taipei',
    },
    nav: { concept: 'Concept', chef: 'Chef', menu: 'Menu', info: 'Info', contact: 'Contact' },
    concept: {
      label: 'Concept',
      title: 'Philosophy of No Code',
      items: [
        {
          title: 'Cuisine Without Boundaries',
          body: '"Code" means rules and restrictions. We chose to break free from conventions and create entirely new culinary value. Founded by Chef Fumio Yonezawa in Nishiazabu, Tokyo, this pursuit of freedom and innovation has now arrived in Taipei.',
        },
        {
          title: 'Where Tokyo Meets Taipei',
          body: 'Japanese culinary mastery meets Taiwan\'s abundant ingredients. We honor the essence of every ingredient, presenting the taste of each season in its purest form. This is not merely dinner — it is a cross-cultural dialogue of flavors.',
        },
        {
          title: 'A Once-in-a-Lifetime Experience',
          body: 'Every Omakase is unique. We have no fixed menu — each day, we create spontaneously from the finest available ingredients. In the intimate setting of our counter seats, feel the warmth of the chef and the vitality of each dish.',
        },
      ],
    },
    chef: {
      label: 'Chef',
      title: 'Our Chefs',
      chefs: [
        {
          name: 'FUMIO YONEZAWA',
          nameLocal: '米澤 文雄',
          role: 'Founder / Chef',
          bio: 'Born in Asakusa, Tokyo in 1980. At 22, he moved to New York and became the first Japanese sous chef at the Michelin three-star restaurant Jean-Georges. After returning to Japan, he opened The Burn in 2018 and now leads No Code in Tokyo and Taipei.',
        },
        {
          name: 'AKINORI HISAMATSU',
          nameLocal: '久松 晃紀',
          role: 'Head Chef',
          bio: 'The culinary heart of No Code. Sharing Chef Yonezawa\'s philosophy while expressing seasonal ingredients through his own unique sensibility. His precise technique and delicate palate create deeply personal dining experiences.',
        },
      ],
    },
    menu: {
      label: 'Menu',
      title: 'OMAKASE',
      intro: 'Our cuisine is entirely Omakase — chef\'s selection. With no fixed menu, each day brings a unique culinary journey crafted from the finest seasonal ingredients.',
      courses: [
        { name: 'Sakizuke / Appetizer', desc: 'An opening inspired by local Taiwanese ingredients.' },
        { name: 'Wanmono / Soup', desc: 'Japanese dashi techniques fused with Taiwanese terroir.' },
        { name: 'Tsukuri / Sashimi', desc: 'Select seasonal fish from Taiwan waters and Japan.' },
        { name: 'Yakimono / Grilled', desc: 'Precision charcoal grilling to reveal purest flavors.' },
        { name: 'Shokuji / Rice Course', desc: 'Premium Taiwanese rice with seasonal accompaniments.' },
        { name: 'Kanmi / Dessert', desc: 'French technique meets Taiwanese fruits.' },
      ],
      pairingTitle: 'Beverage Pairing',
      pairingDesc: 'We offer curated pairings of wine, sake, and Taiwanese tea, finding the perfect companion for each course.',
      priceNote: '※ Omakase dinner from NT$8,800 (beverages excluded)\n※ Pricing varies by ingredients. Please confirm when reserving.',
    },
    info: {
      label: 'Info',
      title: 'Restaurant Information',
      address: 'Da\'an District, Taipei (Exact address TBC)',
      hours: 'Hours',
      hoursDetail: 'Omakase Dinner  18:00 — 21:00\nÀ la carte  21:15 — 23:00\nClosed: Mondays',
      phone: 'Tel: +886-2-XXXX-XXXX',
      access: 'Access: 5 min walk from MRT Xinyi Anhe Station',
      note: '※ Reservation by referral only.',
    },
    contact: {
      label: 'Contact',
      title: 'Get In Touch',
      desc: 'For inquiries or collaboration proposals, please reach out.',
      btn: 'SEND MESSAGE',
    },
    footer: { tagline: 'A Private Dining Experience from Tokyo', parent: 'Visit No Code Tokyo →' },
  },
  ja: {
    hero: {
      eyebrow: '東京発のプライベートダイニング',
      subtitle: 'ノーコード',
      tagline: '台北で、境界のない美食哲学を',
    },
    nav: { concept: 'コンセプト', chef: 'シェフ', menu: '料理', info: '店舗情報', contact: 'お問合せ' },
    concept: {
      label: 'コンセプト',
      title: 'No Codeの美食哲学',
      items: [
        {
          title: '規定に捕らわれない料理',
          body: 'Codeとは規定・規制・暗号を意味する言葉。私たちはそれら全てに捕らわれず、新しい価値を創造します。東京・西麻布で米澤文雄が創り上げた哲学が、いま台北に。',
        },
        {
          title: '東京と台北の交差点',
          body: '日本の技法と台湾の豊かな食材が出会う場所。食材の本質を尊び、季節の味を最も純粋な形でお届けします。これは文化を越えた味覚の対話です。',
        },
        {
          title: '一期一会の体験',
          body: 'おまかせコースは毎回が唯一無二。固定メニューはなく、その日最高の食材から即興で創作します。カウンター席の親密な空間で、シェフの温もりと料理の生命力を。',
        },
      ],
    },
    chef: {
      label: 'シェフ',
      title: '私たちのシェフ',
      chefs: [
        {
          name: 'FUMIO YONEZAWA',
          nameLocal: '米澤 文雄',
          role: '創業者 / シェフ',
          bio: '1980年東京浅草生まれ。22歳で渡米、NYミシュラン三ツ星「Jean-Georges」で日本人初のスーシェフに。帰国後「The Burn」を開業、現在は東京「No Code」と台北店を主宰。',
        },
        {
          name: 'AKINORI HISAMATSU',
          nameLocal: '久松 晃紀',
          role: 'ヘッドシェフ',
          bio: 'No Codeの料理の核。米澤シェフの哲学を共有しながら、独自の感性で季節の食材を表現。緻密な技術と繊細な味覚でゲストに寄り添う料理を。',
        },
      ],
    },
    menu: {
      label: '料理',
      title: 'OMAKASE',
      intro: '当店の料理はすべておまかせです。固定メニューはなく、毎日最高の旬の食材から唯一無二のコースをお仕立てします。',
      courses: [
        { name: '先付', desc: '台湾の食材からインスピレーションを得た始まりの一品。' },
        { name: '椀物', desc: '日本の出汁技法と台湾の風土が溶け合う温かな味わい。' },
        { name: '造里', desc: '台湾近海と日本直送の旬魚を厳選。' },
        { name: '焼物', desc: '備長炭で精緻に焼き上げ、素材の純粋な風味を引き出します。' },
        { name: '食事', desc: '台湾の良質な米と季節の付け合わせ。' },
        { name: '甘味', desc: 'フランス菓子の技法と台湾フルーツの出会い。' },
      ],
      pairingTitle: 'ドリンクペアリング',
      pairingDesc: 'ワイン、日本酒、台湾茶のペアリングをご用意。各料理に最適なパートナーをお選びします。',
      priceNote: '※ おまかせコース NT$8,800〜（お飲み物別）\n※ 食材により価格変動あり。ご予約時にご確認ください。',
    },
    info: {
      label: '店舗情報',
      title: '基本情報',
      address: '台北市大安區安和路一段（詳細住所確認中）',
      hours: '営業時間',
      hoursDetail: 'おまかせディナー　18:00 — 21:00\nアラカルト　21:15 — 23:00\n定休日：月曜日',
      phone: 'TEL：+886-2-XXXX-XXXX',
      access: 'アクセス：MRT信義安和駅 徒歩約5分',
      note: '※ 当店は完全紹介制です。ご予約は紹介者を通じてご連絡ください。',
    },
    contact: {
      label: 'お問合せ',
      title: 'お問い合わせ',
      desc: 'ご質問やご相談がございましたら、お気軽にご連絡ください。',
      btn: '送信する',
    },
    footer: { tagline: '東京発のプライベートダイニング', parent: 'No Code 東京 →' },
  },
};
