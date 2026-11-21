export interface AnimeSpecialDish {
  id: string;
  name: string;
  japaneseName?: string;
  characterInspiration: string;
  theme: string;
  badge: string;
  tagline: string;
  description: string;
  price: number;
  image: string;
  videoUrl?: string;
  prepTime: number;
  calories: number;
  isVeg: boolean;
  spiceLevel: number;
  specialPerk: string;
}

export const ANIME_HERO_BANNER = {
  title: "THE GRAND LINE CAFÉ EXPERIENCE",
  japaneseSubtitle: "偉大なる航路カフェ",
  subtitle: "Set Sail on a Culinary Voyage Across the Seas of Flavor",
  quote: "Food is meant to fuel dreams and ignite the spirit of adventure.",
  author: "Sanji's Philosophy",
};

export const ANIME_SPECIALS: AnimeSpecialDish[] = [
  {
    id: "luffy-meat-platter",
    name: "Luffy's Gigant Bone-in Roast Platter",
    japaneseName: "ルフィの肉！",
    characterInspiration: "Captain Monkey D. Luffy",
    theme: "Gear 5 Flavor Explosion",
    badge: "Captain's Favorite 🍖",
    tagline: "Slow-roasted tender prime protein on a signature giant bone with smoky barbecue glaze",
    description: "Inspired by Luffy's insatiable appetite. Herb-marinated succulent tender meat slow-braised for 8 hours with smoked paprika, raw honey, and charred corn ribs. Serves 2-3 hearty appetites.",
    price: 890,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-chef-carving-a-piece-of-roasted-meat-41484-large.mp4",
    prepTime: 25,
    calories: 950,
    isVeg: false,
    spiceLevel: 2,
    specialPerk: "+150 Pirate Berries loyalty points",
  },
  {
    id: "sanji-all-blue-risotto",
    name: "Sanji's All-Blue Seafood Truffle Risotto",
    japaneseName: "サンジのオールブルーリゾット",
    characterInspiration: "Black Leg Sanji",
    theme: "Legendary Ocean Delicacy",
    badge: "Baratie Masterpiece 🌊",
    tagline: "Creamy carnaroli risotto infused with saffron, seared king prawns, calamari, and white truffle",
    description: "A culinary tribute to the legendary chef of the Baratie. Infused with rich bisque broth, saffron threads, wild caught jumbo prawns, charred calamari rings, finished with aged Parmigiano Reggiano.",
    price: 740,
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1000&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-frying-seafood-in-a-pan-41505-large.mp4",
    prepTime: 20,
    calories: 620,
    isVeg: false,
    spiceLevel: 1,
    specialPerk: "Free Baratie Signature Bread Basket",
  },
  {
    id: "zoro-onigiri-power-bowl",
    name: "Zoro's Santoryu High-Protein Onigiri Bowl",
    japaneseName: "ゾロの三刀流パワーボウル",
    characterInspiration: "Roronoa Zoro",
    theme: "Wano Swordsman Discipline",
    badge: "100% High Protein ⚔️",
    tagline: "Crisp nori triangular onigiri trio with edamame, teriyaki glazed tofu, avocado, and spicy gochujang dip",
    description: "Built for peak stamina and warrior focus. Three toasted sesame onigiri stuffed with pickled plum and spiced mushroom, paired with grilled tofu stakes, avocado slices, and wakame seaweed salad.",
    price: 480,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-chef-arranging-ingredients-in-a-bowl-43407-large.mp4",
    prepTime: 15,
    calories: 510,
    isVeg: true,
    spiceLevel: 2,
    specialPerk: "Zero refined oils, 28g plant protein",
  },
  {
    id: "chopper-sakura-frappe",
    name: "Dr. Chopper's Sakura Berry Recovery Frappe",
    japaneseName: "チョッパーの桜フラッペ",
    characterInspiration: "Tony Tony Chopper",
    theme: "Drum Island Blossom Remedy",
    badge: "Sweet Antioxidant Boost 🌸",
    tagline: "Velvety blend of fresh strawberries, wild raspberries, almond milk, and spun pink cotton candy",
    description: "The sweetest medicine on the Grand Line! Cold-blended farm berries, organic chia seeds, oat cream, topped with a delicate spun sakura cotton candy cloud that melts into the drink.",
    price: 320,
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=1000&auto=format&fit=crop",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-pouring-smoothie-into-a-glass-41489-large.mp4",
    prepTime: 8,
    calories: 280,
    isVeg: true,
    spiceLevel: 0,
    specialPerk: "High Vitamin C & Immune Boosters",
  },
  {
    id: "nami-mikan-tangerine-spritz",
    name: "Nami's Belle-mère Tangerine Sparkling Elixir",
    japaneseName: "ナミのみかんスパークリング",
    characterInspiration: "Cat Burglar Nami",
    theme: "Cocoyasi Tangerine Grove",
    badge: "Citrus Refreshment 🍊",
    tagline: "Freshly squeezed Valencia oranges, crushed mint, yuzu fizz, and edible golden flakes",
    description: "Crisp, effervescent, and delightfully refreshing. Crafted with cold-pressed tangerines, hint of lemongrass, botanical tonic water, and a shimmer of organic edible gold dust.",
    price: 290,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1000&auto=format&fit=crop",
    prepTime: 6,
    calories: 140,
    isVeg: true,
    spiceLevel: 0,
    specialPerk: "Served in a pirate crystal chalice",
  },
];

export const PIRATE_QUOTES = [
  {
    quote: "When you're hungry, eat! When you're tired, sleep! Food is life's greatest adventure.",
    character: "Monkey D. Luffy",
    role: "Captain, Straw Hat Pirates",
  },
  {
    quote: "A true chef never leaves an ingredient to waste, and never denies a meal to a hungry soul.",
    character: "Sanji",
    role: "Sous Chef of Baratie & Straw Hat Cook",
  },
  {
    quote: "Scars on the back are a swordsman's shame. Fuel your body, sharpen your mind, and press forward.",
    character: "Roronoa Zoro",
    role: "First Mate & Swordsman",
  },
];
