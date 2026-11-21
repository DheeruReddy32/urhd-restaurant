export interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'grand-line-specials',
    name: 'The Grand Line Specials 🏴‍☠️',
    description: 'Anime-inspired feasts crafted for fearless pirates and flavor seekers',
    icon: 'Compass',
    order: 1,
  },
  {
    id: 'rustic-starters',
    name: 'Rustic Starters & Small Plates',
    description: 'Crisp artisanal appetizers, tandoori skewers, and tapas',
    icon: 'Utensils',
    order: 2,
  },
  {
    id: 'healthy-bowls',
    name: 'Nutri-Rich Healthy Bowls & Salads',
    description: 'Organic grains, vibrant greens, avocado, and protein boosters',
    icon: 'Salad',
    order: 3,
  },
  {
    id: 'gourmet-burgers',
    name: 'Gourmet Burgers & Sandwiches',
    description: 'Hand-crafted brioche buns, artisanal patties, and truffle sauces',
    icon: 'Sandwich',
    order: 4,
  },
  {
    id: 'woodfired-pizzas',
    name: 'Woodfired Pizzas & Fresh Pastas',
    description: 'Slow-fermented sourdough bases, San Marzano tomatoes, and creamy pastas',
    icon: 'Pizza',
    order: 5,
  },
  {
    id: 'rustic-mains',
    name: 'Signature Mains (Indian & Continental)',
    description: 'Slow-simmered rich curries, fragrant biryanis, and herb-seared delicacies',
    icon: 'Flame',
    order: 6,
  },
  {
    id: 'artisanal-coffee',
    name: 'Specialty Coffee & Brews',
    description: 'Single-origin estate beans, pour-overs, cold brews, and creamy lattes',
    icon: 'Coffee',
    order: 7,
  },
  {
    id: 'shakes-mocktails',
    name: 'Superfood Smoothies & Mocktails',
    description: 'Cold-pressed elixir tonics, protein shakes, and zero-proof mixology',
    icon: 'GlassWater',
    order: 8,
  },
  {
    id: 'decadent-desserts',
    name: 'Artisan Desserts & Gelatos',
    description: 'Rustic cheesecakes, warm skillet cookies, and artisanal gelatos',
    icon: 'IceCream',
    order: 9,
  },
];
