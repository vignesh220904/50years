/* =====================================================================
   data/memories.js
   Complete data store for 50 Years of Love • Digital Memory Journey
   ===================================================================== */

window.MEMORIES = {
  // Celebrant details
  celebrant: {
    name: "Priya Lakshmi",
    nickname: "Amma / Priya",
    birthdayDate: "September 30, 2026",
    milestone: "50 Golden Years"
  },

  // Audio configuration (falls back automatically to soothing built-in Web Audio API melody if mp3 isn't available)
  music: "assets/music/song.mp3",

  // AI-generated life journey video
  journeyVideo: {
    src: "assets/videos/video.mp4",
    poster: "assets/photos/5.png",
    title: "50 Years of Her — In Motion",
    note: "A cinematic tribute celebrating every chapter of her extraordinary life."
  },

  // Her Life Journey Timeline Chapters
  chapters: [
    {
      id: "childhood",
      title: "Childhood",
      years: "1976 – 1988",
      mood: "rose",
      image: "assets/photos/1.jpeg",
      images: ["assets/photos/1.jpeg", "assets/photos/2.jpeg", "assets/photos/3.jpeg"],
      lines: [
        "Where the beautiful story began.",
        "A little girl with bright sparkling eyes, effortless charm, and a heart overflowing with warmth.",
        "Every sweet memory from those early days became the foundation of the extraordinary woman she is today."
      ]
    },
    {
      id: "growing-up",
      title: "Growing Up",
      years: "1988 – 1998",
      mood: "plum",
      image: "assets/photos/2.jpeg",
      images: ["assets/photos/2.jpeg", "assets/photos/3.jpeg", "assets/photos/4.png"],
      lines: [
        "School days, college friendships, and boundless dreams taking shape.",
        "The innocent laughter, youthful courage, and small victories that forged her unbreakable spirit.",
        "Graceful, curious, and always bringing light to every room she entered."
      ]
    },
    {
      id: "marriage",
      title: "Marriage",
      years: "1998",
      mood: "gold",
      image: "assets/photos/3.jpeg",
      video: "assets/videos/video.mp4",
      images: ["assets/photos/3.jpeg", "assets/photos/4.png", "assets/photos/5.png"],
      lines: [
        "The sacred day two souls united to write a timeless love story.",
        "A new home, a new family, and a sacred promise cherished across every passing season.",
        "A bond woven with unwavering trust, patience, mutual respect, and pure devotion."
      ]
    },
    {
      id: "motherhood",
      title: "Motherhood",
      years: "1999 onwards",
      mood: "rose",
      image: "assets/photos/4.png",
      images: ["assets/photos/4.png", "assets/photos/5.png", "assets/photos/6.png"],
      lines: [
        "Sleepless nights, gentle lullabies, and unconditional love without measure.",
        "She gave us her time, her energy, her wisdom, and her entire heart without ever asking for anything in return.",
        "The gentlest anchor and the fiercest protector our family could ever wish for."
      ]
    },
    {
      id: "family-life",
      title: "Family Life",
      years: "2000 – 2025",
      mood: "plum",
      image: "assets/photos/5.png",
      images: ["assets/photos/5.png", "assets/photos/6.png", "assets/photos/1.jpeg"],
      lines: [
        "Festivals bathed in warmth, joyful vacations, and the comfort of her delicious home-cooked meals.",
        "The laughter around the dining table, quiet evening talks, and traditions she nurtured with devotion.",
        "She didn't just build a house — she crafted a sanctuary of peace and love."
      ]
    },
    {
      id: "today",
      title: "Today & Forever",
      years: "2026",
      mood: "gold",
      image: "assets/photos/6.png",
      images: ["assets/photos/6.png", "assets/photos/5.png", "assets/photos/4.png"],
      lines: [
        "Fifty magnificent years of living with grace, elegance, and pure kindness.",
        "Today, we honor the queen of our hearts — admired, cherished, and loved beyond words.",
        "The best is yet to come, and our hearts celebrate you today and forever."
      ]
    }
  ],

  closingLine: "50 years. Thousands of moments. One beautiful life.",

  // What She Means to the Family (Heartfelt Letters)
  letters: [
    {
      id: "husband",
      sender: "Husband",
      relation: "Her Life Partner",
      badge: "To My Soulmate",
      tagline: "28 Years of Shared Dreams & Timeless Love",
      seal: "❤",
      content: [
        "From the first day I met you, my life found its true meaning and purpose. Over these decades, you have been my greatest strength, my quiet confidante, and the most patient companion.",
        "Through every triumph and every challenge, your smile gave me the courage to move mountains. You created a paradise for our children and filled our home with dignity and warmth.",
        "Happy 50th Birthday, my love. Looking back at our journey fills my eyes with gratitude, and looking forward with you makes my heart completely full."
      ],
      signature: "Forever Yours, With All My Love"
    },
    {
      id: "children",
      sender: "Children",
      relation: "Son & Daughter",
      badge: "To Our Dearest Amma",
      tagline: "Our Guiding Light & First Teacher",
      seal: "✦",
      content: [
        "Dear Amma, if love had a face, it would be yours. Every sacrifice you made quietly, every late night you waited up for us, and every prayer you whispered has guided our steps.",
        "You taught us kindness, humility, resilience, and compassion — not by words alone, but by how you live every single day. There is no comfort greater than your hug.",
        "On your 50th birthday, we want you to pause and feel how deeply you are celebrated. Thank you for giving us roots to stand tall and wings to soar. We love you unconditionally!"
      ],
      signature: "With Endless Love, Your Children"
    },
    {
      id: "parents-siblings",
      sender: "Parents & Siblings",
      relation: "Family Roots",
      badge: "To Our Darling Sister & Daughter",
      tagline: "The Pride of Our Family",
      seal: "❦",
      content: [
        "Watching you grow from a little girl with cheerful giggles into such a majestic, caring pillar of strength has been one of life’s sweetest joys.",
        "No matter where life took you, you kept our family connected and honored every relationship with unmatched sincerity and care.",
        "May your 50th birthday bring you the same radiant joy and boundless blessings that you have brought to all our lives."
      ],
      signature: "Always With You, Your Loving Family"
    },
    {
      id: "grandchildren",
      sender: "Grandchildren",
      relation: "The Little Ones",
      badge: "To Our Sweetest Paati",
      tagline: "The Best Storyteller & Warmest Hugs",
      seal: "★",
      content: [
        "Happy 50th Birthday, Paati! Your lap is our favorite reading nook, your sweets are the tastiest in the entire universe, and your smiles make all our days bright!",
        "Thank you for spoiling us with hugs, telling us bedtime stories, and loving us so much. We promise to always make you proud and give you millions of cuddles!"
      ],
      signature: "Lots of Kisses & Hugs!"
    },
    {
      id: "friends",
      sender: "Dearest Friends",
      relation: "Lifelong Companions",
      badge: "To Our Cherished Friend",
      tagline: "30+ Years of Unbreakable Bond",
      seal: "✿",
      content: [
        "Through decades of milestones, college memories, endless phone calls, and shared tea cups, your friendship has been a true anchor.",
        "You bring so much joy, wisdom, and genuine laughter wherever you go. Welcome to the fabulous fifty club — you wear it with such effortless elegance!"
      ],
      signature: "Cheers to 50 & Decades More!"
    }
  ],

  // Curated Memory Gallery Wall
  gallery: [
    {
      id: 1,
      category: "childhood",
      title: "Innocence & Sunshine",
      year: "1978",
      image: "assets/photos/1.jpeg",
      caption: "A bright smile that brought pure sunshine to everyone around her.",
      aspect: "portrait"
    },
    {
      id: 2,
      category: "childhood",
      title: "Sweet School Days",
      year: "1984",
      image: "assets/photos/2.jpeg",
      caption: "Treasured memories of friendships, dreams, and joyful beginnings.",
      aspect: "square"
    },
    {
      id: 3,
      category: "marriage",
      title: "The Golden Wedding Vow",
      year: "1998",
      image: "assets/photos/3.jpeg",
      caption: "The beginning of a timeless love story and a lifelong journey of togetherness.",
      aspect: "portrait"
    },
    {
      id: 4,
      category: "motherhood",
      title: "The Miracle of Motherhood",
      year: "2001",
      image: "assets/photos/4.png",
      caption: "Holding her greatest treasures in her arms with unmatched tenderness.",
      aspect: "landscape"
    },
    {
      id: 5,
      category: "family",
      title: "Sanctuary of Love",
      year: "2010",
      image: "assets/photos/5.png",
      caption: "Every celebration is richer and every holiday brighter because of her presence.",
      aspect: "portrait"
    },
    {
      id: 6,
      category: "recent",
      title: "Grace at 50",
      year: "2026",
      image: "assets/photos/6.png",
      caption: "Radiant, poised, and more magnificent than ever on her 50th milestone.",
      aspect: "portrait"
    },
    {
      id: 7,
      category: "celebrations",
      title: "Festival of Lights",
      year: "2018",
      image: "assets/photos/3.jpeg",
      caption: "Lighting up our home with traditional grace, sweets, and laughter.",
      aspect: "square"
    },
    {
      id: 8,
      category: "travel",
      title: "Journeys & Sunsets",
      year: "2022",
      image: "assets/photos/5.png",
      caption: "Exploring new horizons with the people she loves most.",
      aspect: "landscape"
    }
  ],

  // 50 Reasons Why We Love You (Exactly 50 Heartfelt Reasons!)
  reasons: [
    "Because you always put the family's happiness above your own.",
    "Because your smile instantly makes any house feel like a warm home.",
    "Because your cooking has the magical touch of pure love.",
    "Because you give the warmest and most comforting hugs in the world.",
    "Because your patience during tough times gives us all strength.",
    "Because you listen without judging and always understand what we feel.",
    "Because you remember every small detail and every family milestone.",
    "Because your laughter is infectious and lights up every gathering.",
    "Because you taught us the true meaning of kindness and empathy.",
    "Because you stood by our dreams even when we doubted ourselves.",
    "Because you forgive easily and hold no grudges in your pure heart.",
    "Because of the unconditional sacrifices you made for our education and future.",
    "Because you celebrate everyone else's success as if it were your own.",
    "Because your morning prayers and positive energy protect our home.",
    "Because you have an incredible sense of humor that catches us by surprise.",
    "Because you carry yourself with unmatched dignity, elegance, and grace.",
    "Because you make traditional festivals feel magical year after year.",
    "Because you always know the exact comforting words when we are worried.",
    "Because you never let anyone leave our home on an empty stomach.",
    "Because you are the glue that keeps our entire extended family connected.",
    "Because you find joy in the simple, quiet moments of life.",
    "Because you are our biggest cheerleader in every single endeavor.",
    "Because your advice is always full of practical wisdom and foresight.",
    "Because you taught us to respect everyone and stay humble.",
    "Because you never complain, even when you are exhausted.",
    "Because your gentle touch can soothe away any headache or fever.",
    "Because you created countless sweet childhood memories we cherish forever.",
    "Because you love animals and nature with such tender compassion.",
    "Because your handwriting and thoughtful notes bring tears of joy to our eyes.",
    "Because you handle responsibilities with effortless grace and composure.",
    "Because you are our confidante, best friend, and protector.",
    "Because you make ordinary days feel special with your thoughtful gestures.",
    "Because your eyes still sparkle with the curiosity and wonder of youth.",
    "Because you never hesitate to stand up for truth and fairness.",
    "Because of the pride and love in your eyes whenever you look at us.",
    "Because you made our childhood feel like a beautiful fairytale.",
    "Because you teach us that love is shown through daily actions, not just words.",
    "Because you welcome our friends as your own children.",
    "Because your presence brings an undeniable sense of safety and calm.",
    "Because you inspire us to be better human beings every single day.",
    "Because you keep our family traditions alive with devotion.",
    "Because your resilience through life's storms is our greatest courage.",
    "Because you always save the best piece for someone else.",
    "Because you celebrate our birthdays with so much excitement and care.",
    "Because you see the good in people even when others cannot.",
    "Because your phone calls are the highlight of our busy days.",
    "Because you have given 50 glorious years of light to this world.",
    "Because your love has no boundaries, conditions, or limits.",
    "Because our lives are extraordinarily blessed because of you.",
    "Because you are simply and uniquely YOU — our irreplaceable Amma! ❤️"
  ],

  // Family Video Wishes
  videoWishes: [
    {
      id: "wish-husband",
      name: "Your Husband",
      relation: "Life Partner",
      duration: "02:15",
      thumb: "assets/photos/3.jpeg",
      videoSrc: "assets/videos/video.mp4",
      quote: "Fifty years of walking beside you has been the greatest privilege of my lifetime."
    },
    {
      id: "wish-children",
      name: "Your Son & Daughter",
      relation: "Children",
      duration: "03:40",
      thumb: "assets/photos/4.png",
      videoSrc: "assets/videos/video.mp4",
      quote: "Amma, everything we are today is because of your endless love and sacrifices."
    },
    {
      id: "wish-grandkids",
      name: "The Grandchildren",
      relation: "Grandkids",
      duration: "01:30",
      thumb: "assets/photos/6.png",
      videoSrc: "assets/videos/video.mp4",
      quote: "Happy Birthday Paati! We love you to the moon and beyond all the stars!"
    },
    {
      id: "wish-siblings",
      name: "Brothers & Sisters",
      relation: "Siblings",
      duration: "02:50",
      thumb: "assets/photos/2.jpeg",
      videoSrc: "assets/videos/video.mp4",
      quote: "To the sweet sister who always looked after all of us — happy 50th golden milestone!"
    },
    {
      id: "wish-friends",
      name: "Dearest Friends",
      relation: "Lifelong Friends",
      duration: "02:10",
      thumb: "assets/photos/5.png",
      videoSrc: "assets/videos/video.mp4",
      quote: "Cheers to 50 years of sparkling laughter and memories that will never fade!"
    }
  ],

  // Grand Finale: Age 1 to 50 Milestones
  ageMilestones: [
    { age: 1, year: "1976", photo: "assets/photos/1.jpeg", label: "The First Smile", desc: "A precious gift to this world, born with bright eyes and a soul made of pure light." },
    { age: 5, year: "1981", photo: "assets/photos/1.jpeg", label: "Carefree Childhood", desc: "Little pigtails, cheerful giggles, and innocent footsteps filling the courtyard." },
    { age: 10, year: "1986", photo: "assets/photos/2.jpeg", label: "Bright & Curious", desc: "Always reading, learning, and sharing kindness with everyone in school." },
    { age: 15, year: "1991", photo: "assets/photos/2.jpeg", label: "Youthful Grace", desc: "Blooming into a poised young lady with courage and radiant hope for the future." },
    { age: 20, year: "1996", photo: "assets/photos/3.jpeg", label: "Dreams Taking Flight", desc: "College triumphs, cherished memories with friends, and stepping into womanhood." },
    { age: 25, year: "2001", photo: "assets/photos/3.jpeg", label: "Sacred Beginnings", desc: "Two lives intertwined in marriage; the start of a family built on timeless devotion." },
    { age: 30, year: "2006", photo: "assets/photos/4.png", label: "The Gift of Motherhood", desc: "Holding her babies tight, singing sweet lullabies, and nurturing their every step." },
    { age: 35, year: "2011", photo: "assets/photos/4.png", label: "Heart of the Home", desc: "Creating a sanctuary of delicious food, celebratory festivals, and boundless love." },
    { age: 40, year: "2016", photo: "assets/photos/5.png", label: "Elegance & Wisdom", desc: "A steadfast pillar of strength, guiding the next generation with grace." },
    { age: 45, year: "2021", photo: "assets/photos/5.png", label: "Cherished Moments", desc: "Watching children blossom while remaining the beloved queen of our home." },
    { age: 49, year: "2025", photo: "assets/photos/6.png", label: "The Golden Horizon", desc: "A serene moment to reflect on five decades of love, courage, and countless smiles." },
    { age: 50, year: "2026", photo: "assets/photos/6.png", label: "50 Golden Years!", desc: "Celebrating 50 extraordinary years of life, strength, and boundless love!" }
  ],

  // Gift Reveal Data
  gift: {
    teaserTitle: "A Little Surprise For You…",
    teaserSubtitle: "Because someone who gives so much love deserves the world in return.",
    boxLabel: "Open Your Gift ❤️",
    revealedTitle: "A Dream Golden Getaway & Family Celebration!",
    revealedSubtitle: "An all-inclusive luxury family retreat to create unforgettable new memories together.",
    giftCode: "LOVE-50-FOREVER",
    letter: "Amma, this gift is just a tiny token compared to the millions of sacrifices you made for all of us. You have given us 50 years of unmeasurable love. Now, it's our turn to pamper you!",
    familyQuote: "This website is only a small collection of memories… but the love we have for you is endless. Happy 50th Birthday!"
  }
};
