const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding URHD Restaurant database...');

  // Clean up existing data in reverse order of relationships
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customizationOption.deleteMany();
  await prisma.customizationGroup.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.workspaceBooking.deleteMany();
  await prisma.workspacePackage.deleteMany();
  await prisma.diningTable.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users
  const passwordAdmin = await bcrypt.hash('admin123', 10);
  const passwordKitchen = await bcrypt.hash('chef123', 10);
  const passwordCustomer = await bcrypt.hash('pirate123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Chef Vikramaditya Rao (Owner)',
      email: 'owner@urhd.com',
      phone: '+91 98765 43210',
      password: passwordAdmin,
      role: 'ADMIN',
      loyaltyPoints: 1000,
    },
  });

  const kitchen = await prisma.user.create({
    data: {
      name: 'Head Chef Sanji V.',
      email: 'kitchen@urhd.com',
      phone: '+91 98765 11111',
      password: passwordKitchen,
      role: 'KITCHEN',
      loyaltyPoints: 0,
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: 'Monkey D. Luffy',
      email: 'luffy@grandline.com',
      phone: '+91 98111 22233',
      password: passwordCustomer,
      role: 'CUSTOMER',
      loyaltyPoints: 340,
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Ananya Sharma',
      email: 'ananya@techventures.io',
      phone: '+91 98222 33344',
      password: passwordCustomer,
      role: 'CUSTOMER',
      loyaltyPoints: 180,
    },
  });

  // Saved Addresses
  const address1 = await prisma.address.create({
    data: {
      userId: customer1.id,
      label: 'Sunny Headquarters',
      street: 'Flat 402, Thousand Sunny Heights, Indiranagar 100ft Rd',
      landmark: 'Near Grand Line Boulevard',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038',
      isDefault: true,
    },
  });

  const address2 = await prisma.address.create({
    data: {
      userId: customer2.id,
      label: 'Workplace Suite',
      street: 'Level 4, WeWork Galaxy, Residency Road',
      landmark: 'Opposite Central Mall',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560025',
      isDefault: true,
    },
  });

  // 2. Dining Tables
  const tables = [
    { number: 1, capacity: 2, section: 'Indoor Rustic Lounge', qrCode: 'URHD-TBL-01' },
    { number: 2, capacity: 4, section: 'Indoor Rustic Lounge', qrCode: 'URHD-TBL-02' },
    { number: 3, capacity: 4, section: 'Indoor Rustic Lounge', qrCode: 'URHD-TBL-03' },
    { number: 4, capacity: 6, section: 'The Grand Line Anime Deck', qrCode: 'URHD-TBL-04' },
    { number: 5, capacity: 4, section: 'The Grand Line Anime Deck', qrCode: 'URHD-TBL-05' },
    { number: 6, capacity: 8, section: 'The Grand Line Anime Deck', qrCode: 'URHD-TBL-06' },
    { number: 7, capacity: 2, section: 'Garden Courtyard', qrCode: 'URHD-TBL-07' },
    { number: 8, capacity: 4, section: 'Garden Courtyard', qrCode: 'URHD-TBL-08' },
    { number: 9, capacity: 1, section: 'Workspace Quiet Pods', qrCode: 'URHD-TBL-09' },
    { number: 10, capacity: 1, section: 'Workspace Quiet Pods', qrCode: 'URHD-TBL-10' },
    { number: 11, capacity: 4, section: 'Workspace Discussion Booth', qrCode: 'URHD-TBL-11' },
    { number: 12, capacity: 10, section: 'VIP Boardroom', qrCode: 'URHD-TBL-12' },
  ];

  for (const t of tables) {
    await prisma.diningTable.create({ data: t });
  }

  // 3. Categories
  const categories = [
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
      name: 'Woodfired Pizzas & Pastas',
      description: 'Slow-fermented sourdough bases and creamy handmade pastas',
      icon: 'Pizza',
      order: 5,
    },
    {
      id: 'rustic-mains',
      name: 'Signature Mains (Indian & Continental)',
      description: 'Slow-simmered rich curries, fragrant biryanis, and herb-seared grills',
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

  for (const c of categories) {
    await prisma.category.create({ data: c });
  }

  // 4. Menu Items with Customization Groups & Options
  const menuItems = [
    // Grand Line Specials
    {
      name: "Luffy's Gigant Bone-in Roast Platter",
      slug: 'luffys-gigant-roast-platter',
      description: 'Tender prime roasted cut on a signature giant bone with smoky barbecue glaze, charred corn, and buttered herb wedges. Luffy\'s all-time champion feast!',
      price: 890,
      categoryId: 'grand-line-specials',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-carving-a-piece-of-roasted-meat-41484-large.mp4',
      isVeg: false,
      spiceLevel: 2,
      prepTime: 25,
      calories: 980,
      cuisine: 'Anime Pirate Feast',
      flavorProfile: 'Smoky, Savory, Sweet Glaze',
      ingredients: 'Braised prime protein, Smoked paprika BBQ glaze, Sweet corn, Herb potato wedges, Rosemary sprigs',
      allergens: 'Soy, Celery',
      isChefSpecial: true,
      isAnimeSpecial: true,
      animeTheme: 'Monkey D. Luffy',
      rating: 4.9,
      ratingCount: 88,
      customizations: [
        {
          name: 'Glaze & Spice Level',
          minSelect: 1,
          maxSelect: 1,
          isRequired: true,
          options: [
            { name: 'Smoky Barbecue Glaze', price: 0, isDefault: true },
            { name: 'Gear 5 Fiery Reaper Glaze', price: 30, isDefault: false },
            { name: 'Honey Mustard Glaze', price: 0, isDefault: false },
          ],
        },
        {
          name: 'Choose Your Side',
          minSelect: 1,
          maxSelect: 1,
          isRequired: true,
          options: [
            { name: 'Rustic Herb Potato Wedges', price: 0, isDefault: true },
            { name: 'Charred Truffle Sweet Corn', price: 40, isDefault: false },
            { name: 'Garden Quinoa Tabbouleh', price: 60, isDefault: false },
          ],
        },
      ],
    },
    {
      name: "Sanji's All-Blue Seafood Truffle Risotto",
      slug: 'sanjis-all-blue-risotto',
      description: 'Creamy saffron carnaroli risotto loaded with wild king prawns, tender calamari rings, sea scallops, and shaved black winter truffle.',
      price: 740,
      categoryId: 'grand-line-specials',
      imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1000&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-frying-seafood-in-a-pan-41505-large.mp4',
      isVeg: false,
      spiceLevel: 1,
      prepTime: 20,
      calories: 640,
      cuisine: 'Baratie Italian Fusion',
      flavorProfile: 'Rich, Truffle, Umami, Buttery',
      ingredients: 'Carnaroli rice, Saffron broth, King prawns, Calamari, Truffle oil, 24-month Parmigiano Reggiano',
      allergens: 'Crustacean, Mollusc, Dairy',
      isChefSpecial: true,
      isAnimeSpecial: true,
      animeTheme: 'Black Leg Sanji',
      rating: 4.95,
      ratingCount: 64,
      customizations: [
        {
          name: 'Seafood Portion',
          minSelect: 1,
          maxSelect: 1,
          isRequired: true,
          options: [
            { name: 'Standard Ocean Catch', price: 0, isDefault: true },
            { name: 'Extra Jumbo King Prawns (2 pcs)', price: 180, isDefault: false },
          ],
        },
        {
          name: 'Cheese Finish',
          minSelect: 1,
          maxSelect: 1,
          isRequired: true,
          options: [
            { name: 'Classic Aged Parmigiano', price: 0, isDefault: true },
            { name: 'Double Truffle Infused Pecorino', price: 50, isDefault: false },
          ],
        },
      ],
    },
    {
      name: "Zoro's Santoryu High-Protein Onigiri Trio",
      slug: 'zoros-santoryu-onigiri-trio',
      description: 'Three crisp nori-wrapped seasoned onigiri stuffed with edamame mash, teriyaki glazed organic tofu, and avocado. High stamina booster.',
      price: 480,
      categoryId: 'grand-line-specials',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-arranging-ingredients-in-a-bowl-43407-large.mp4',
      isVeg: true,
      spiceLevel: 1,
      prepTime: 15,
      calories: 490,
      cuisine: 'Japanese Rustic',
      flavorProfile: 'Sesame, Savory, Crisp Nori',
      ingredients: 'Japanese short-grain rice, Roasted nori, Organic tofu, Edamame, Avocado, Toasted sesame oil',
      allergens: 'Soy, Sesame',
      isChefSpecial: false,
      isAnimeSpecial: true,
      animeTheme: 'Roronoa Zoro',
      rating: 4.85,
      ratingCount: 52,
      customizations: [
        {
          name: 'Dip Selection',
          minSelect: 1,
          maxSelect: 2,
          isRequired: true,
          options: [
            { name: 'Spicy Gochujang Aioli', price: 0, isDefault: true },
            { name: 'Wasabi Sesame Soy', price: 0, isDefault: false },
            { name: 'Creamy Truffle Mayo', price: 30, isDefault: false },
          ],
        },
      ],
    },
    {
      name: "Dr. Chopper's Sakura Cotton Candy Frappe",
      slug: 'chopper-sakura-frappe',
      description: 'Velvety blend of fresh organic strawberries, wild raspberries, almond milk, topped with a cloud of spun cherry blossom cotton candy.',
      price: 320,
      categoryId: 'grand-line-specials',
      imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=1000&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-smoothie-into-a-glass-41489-large.mp4',
      isVeg: true,
      spiceLevel: 0,
      prepTime: 8,
      calories: 270,
      cuisine: 'Beverage & Dessert',
      flavorProfile: 'Fruity, Creamy, Sweet Berry',
      ingredients: 'Organic strawberries, Blueberries, Almond milk, Chia seeds, Spun sakura sugar',
      allergens: 'Nuts (Almond)',
      isChefSpecial: false,
      isAnimeSpecial: true,
      animeTheme: 'Tony Tony Chopper',
      rating: 4.9,
      ratingCount: 110,
      customizations: [
        {
          name: 'Size Selection',
          minSelect: 1,
          maxSelect: 1,
          isRequired: true,
          options: [
            { name: 'Regular 350ml', price: 0, isDefault: true },
            { name: 'Grand Line Grande 500ml', price: 60, isDefault: false },
          ],
        },
        {
          name: 'Milk Choice',
          minSelect: 1,
          maxSelect: 1,
          isRequired: true,
          options: [
            { name: 'Almond Milk (Plant-based)', price: 0, isDefault: true },
            { name: 'Creamy Oat Milk', price: 20, isDefault: false },
            { name: 'Organic Dairy Milk', price: 0, isDefault: false },
          ],
        },
      ],
    },

    // Starters
    {
      name: 'Rustic Truffle Parmesan Fries',
      slug: 'rustic-truffle-fries',
      description: 'Hand-cut double cooked Idaho potatoes tossed with white truffle oil, rosemary sea salt, and snow of 24-month Parmigiano.',
      price: 320,
      categoryId: 'rustic-starters',
      imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1000&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-french-fries-being-served-41506-large.mp4',
      isVeg: true,
      spiceLevel: 0,
      prepTime: 12,
      calories: 420,
      cuisine: 'Continental',
      flavorProfile: 'Crisp, Truffle, Savory',
      ingredients: 'Hand-cut potatoes, White truffle oil, Rosemary, Flaky sea salt, Parmigiano Reggiano',
      allergens: 'Dairy',
      isChefSpecial: true,
      isAnimeSpecial: false,
      rating: 4.8,
      ratingCount: 95,
      customizations: [
        {
          name: 'Choose Dip',
          minSelect: 1,
          maxSelect: 2,
          isRequired: true,
          options: [
            { name: 'House Garlic Aioli', price: 0, isDefault: true },
            { name: 'Smoked Jalapeno Mayo', price: 20, isDefault: false },
            { name: 'Truffle Crema', price: 40, isDefault: false },
          ],
        },
      ],
    },
    {
      name: 'Smoked Malai Paneer Tikka',
      slug: 'smoked-malai-paneer-tikka',
      description: 'Silken cubes of cottage cheese steeped in cardamom-scented cream, hung curd, and yellow chillies, charred in a clay tandoor.',
      price: 420,
      categoryId: 'rustic-starters',
      imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=1000&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-skewer-of-meat-over-a-barbecue-43485-large.mp4',
      isVeg: true,
      spiceLevel: 1,
      prepTime: 16,
      calories: 480,
      cuisine: 'Indian Rustic',
      flavorProfile: 'Smoky, Creamy, Cardamom Warmth',
      ingredients: 'Organic paneer, Hung curd, Cashew cream, Cardamom, Bell peppers, Mint chutney',
      allergens: 'Dairy, Tree Nuts',
      isChefSpecial: true,
      isAnimeSpecial: false,
      rating: 4.9,
      ratingCount: 78,
      customizations: [
        {
          name: 'Portion Size',
          minSelect: 1,
          maxSelect: 1,
          isRequired: true,
          options: [
            { name: 'Standard (6 skewers)', price: 0, isDefault: true },
            { name: 'Platter Size (10 skewers)', price: 180, isDefault: false },
          ],
        },
      ],
    },
    {
      name: 'Tandoori Smoked Chicken Wings',
      slug: 'tandoori-smoked-chicken-wings',
      description: 'Crispy clay-oven roasted chicken wings basted in Kashmiri chilli marinade, served with mint coriander relish and lemon wedges.',
      price: 460,
      categoryId: 'rustic-starters',
      imageUrl: 'https://images.unsplash.com/photo-1527477378408-1bc09c23197b?q=80&w=1000&auto=format&fit=crop',
      isVeg: false,
      spiceLevel: 3,
      prepTime: 18,
      calories: 520,
      cuisine: 'Indian Fusion',
      flavorProfile: 'Tangy, Fiery, Smoky',
      ingredients: 'Free-range chicken wings, Mustard oil, Kashmiri mirch, Garam masala, Mint chutney',
      allergens: 'Mustard',
      isChefSpecial: false,
      isAnimeSpecial: false,
      rating: 4.8,
      ratingCount: 45,
      customizations: [
        {
          name: 'Heat Level',
          minSelect: 1,
          maxSelect: 1,
          isRequired: true,
          options: [
            { name: 'Mild Tandoor Char', price: 0, isDefault: false },
            { name: 'Spicy Classic Tikka', price: 0, isDefault: true },
            { name: 'Bhut Jolokia Ghost Pepper Kick', price: 25, isDefault: false },
          ],
        },
      ],
    },

    // Healthy Bowls & Salads
    {
      name: 'URHD Signature Green Goddess Nourish Bowl',
      slug: 'green-goddess-nourish-bowl',
      description: 'Hass avocado, roasted chickpeas, organic baby spinach, tri-color quinoa, charred broccoli, and hemp seeds drizzled with tahini goddess dressing.',
      price: 490,
      categoryId: 'healthy-bowls',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1000&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-arranging-ingredients-in-a-bowl-43407-large.mp4',
      isVeg: true,
      spiceLevel: 0,
      prepTime: 12,
      calories: 420,
      cuisine: 'Modern Health',
      flavorProfile: 'Herbaceous, Nutty, Crisp, Creamy',
      ingredients: 'Hass avocado, Organic quinoa, Baby spinach, Charred broccoli, Tahini, Lime juice, Hemp seeds',
      allergens: 'Sesame',
      isChefSpecial: true,
      isAnimeSpecial: false,
      rating: 4.9,
      ratingCount: 112,
      customizations: [
        {
          name: 'Protein Add-on',
          minSelect: 0,
          maxSelect: 2,
          isRequired: false,
          options: [
            { name: 'Grilled Herb Tofu (+14g protein)', price: 70, isDefault: false },
            { name: 'Seared Lemon Thyme Chicken (+24g protein)', price: 110, isDefault: false },
            { name: 'Pan-Seared Scottish Salmon (+26g protein)', price: 240, isDefault: false },
          ],
        },
        {
          name: 'Dressing Choice',
          minSelect: 1,
          maxSelect: 1,
          isRequired: true,
          options: [
            { name: 'Tahini Green Goddess (House)', price: 0, isDefault: true },
            { name: 'Lemon Mustard Vinaigrette', price: 0, isDefault: false },
            { name: 'Spicy Peanut Dressing', price: 0, isDefault: false },
          ],
        },
      ],
    },
    {
      name: 'Wild Burrata & Heirloom Tomato Caprese',
      slug: 'wild-burrata-caprese',
      description: 'Creamy artisanal Puglia burrata on a bed of multi-hued heirloom tomatoes, wild arugula, 12-year Modena balsamic reduction, and basil pearls.',
      price: 540,
      categoryId: 'healthy-bowls',
      imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?q=80&w=1000&auto=format&fit=crop',
      isVeg: true,
      spiceLevel: 0,
      prepTime: 10,
      calories: 380,
      cuisine: 'Italian Rustic',
      flavorProfile: 'Creamy, Tangy, Fresh Basil',
      ingredients: 'Puglia burrata cheese, Heirloom tomatoes, Cold pressed olive oil, Balsamic glaze, Basil',
      allergens: 'Dairy',
      isChefSpecial: true,
      isAnimeSpecial: false,
      rating: 4.92,
      ratingCount: 67,
      customizations: [
        {
          name: 'Bread Accompaniment',
          minSelect: 1,
          maxSelect: 1,
          isRequired: true,
          options: [
            { name: 'Warm Garlic Sourdough Focaccia', price: 0, isDefault: true },
            { name: 'Gluten-Free Seed Crackers', price: 40, isDefault: false },
          ],
        },
      ],
    },

    // Gourmet Burgers
    {
      name: 'The Rustic Truffle Brioche Burger',
      slug: 'rustic-truffle-brioche-burger',
      description: 'Artisanal patty layered with aged cheddar, caramelized shallots, wild forest mushrooms, and black truffle aioli in a toasted golden brioche bun.',
      price: 520,
      categoryId: 'gourmet-burgers',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-putting-a-burger-together-41511-large.mp4',
      isVeg: false,
      spiceLevel: 1,
      prepTime: 18,
      calories: 780,
      cuisine: 'Gourmet American',
      flavorProfile: 'Savory, Umami, Truffle, Buttery',
      ingredients: 'Handcrafted prime patty, Butter brioche, Aged cheddar, Shiitake mushrooms, Caramelized onions, Truffle aioli',
      allergens: 'Gluten, Dairy, Eggs',
      isChefSpecial: true,
      isAnimeSpecial: false,
      rating: 4.9,
      ratingCount: 140,
      customizations: [
        {
          name: 'Patty Selection',
          minSelect: 1,
          maxSelect: 1,
          isRequired: true,
          options: [
            { name: 'Juicy Ground Tenderloin Patty', price: 0, isDefault: true },
            { name: 'Herb Grilled Chicken Patty', price: -40, isDefault: false },
            { name: 'Crispy Black Bean & Quinoa Patty (Veg)', price: -60, isDefault: false },
          ],
        },
        {
          name: 'Bun Option',
          minSelect: 1,
          maxSelect: 1,
          isRequired: true,
          options: [
            { name: 'Artisan Golden Brioche Bun', price: 0, isDefault: true },
            { name: 'Wholewheat Sourdough Bun', price: 20, isDefault: false },
            { name: 'Lettuce Wrap (Low-Carb)', price: 0, isDefault: false },
          ],
        },
        {
          name: 'Cheese Level',
          minSelect: 1,
          maxSelect: 1,
          isRequired: true,
          options: [
            { name: 'Single Slice Aged English Cheddar', price: 0, isDefault: true },
            { name: 'Double Melted Cheddar', price: 50, isDefault: false },
            { name: 'Smoked Scamorza Cheese', price: 60, isDefault: false },
          ],
        },
      ],
    },
    {
      name: 'Avocado & Halloumi Brioche Stack',
      slug: 'avocado-halloumi-brioche-stack',
      description: 'Golden grilled Cypriot halloumi, smashed ripe avocado, sun-dried tomato tapenade, rocket leaves, and pesto crema on toasted brioche.',
      price: 490,
      categoryId: 'gourmet-burgers',
      imageUrl: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?q=80&w=1000&auto=format&fit=crop',
      isVeg: true,
      spiceLevel: 1,
      prepTime: 15,
      calories: 610,
      cuisine: 'Mediterranean',
      flavorProfile: 'Creamy, Salty Halloumi, Fresh Pesto',
      ingredients: 'Grilled Halloumi, Fresh Hass avocado, Wild rocket, Basil pesto, Brioche',
      allergens: 'Dairy, Gluten, Pine Nuts',
      isChefSpecial: false,
      isAnimeSpecial: false,
      rating: 4.8,
      ratingCount: 56,
      customizations: [
        {
          name: 'Add Extras',
          minSelect: 0,
          maxSelect: 2,
          isRequired: false,
          options: [
            { name: 'Extra Grilled Halloumi Slab', price: 90, isDefault: false },
            { name: 'Caramelized Onion Jam', price: 30, isDefault: false },
            { name: 'Pickled Jalapeno Peppers', price: 20, isDefault: false },
          ],
        },
      ],
    },

    // Woodfired Pizzas
    {
      name: 'Rustic Tartufo & Wild Funghi Pizza',
      slug: 'rustic-tartufo-funghi-pizza',
      description: '48-hour slow fermented sourdough crust, fior di latte mozzarella, roasted porcini and cremini mushrooms, white truffle cream, and thyme.',
      price: 660,
      categoryId: 'woodfired-pizzas',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-putting-a-pizza-in-an-oven-41517-large.mp4',
      isVeg: true,
      spiceLevel: 0,
      prepTime: 18,
      calories: 790,
      cuisine: 'Italian Woodfired',
      flavorProfile: 'Earthy, Truffle, Melted Cheese, Crispy Crust',
      ingredients: 'Fermented sourdough, Fior di latte, Porcini mushrooms, Truffle crema, Fresh thyme',
      allergens: 'Gluten, Dairy',
      isChefSpecial: true,
      isAnimeSpecial: false,
      rating: 4.95,
      ratingCount: 160,
      customizations: [
        {
          name: 'Crust Preference',
          minSelect: 1,
          maxSelect: 1,
          isRequired: true,
          options: [
            { name: 'Classic Neapolitan (Leopard Charred)', price: 0, isDefault: true },
            { name: 'Thin & Ultra Crisp Crust', price: 0, isDefault: false },
            { name: 'Cheese Stuffed Crust', price: 90, isDefault: false },
          ],
        },
        {
          name: 'Add Extra Toppings',
          minSelect: 0,
          maxSelect: 2,
          isRequired: false,
          options: [
            { name: 'Fresh Buffalo Mozzarella Pearls', price: 80, isDefault: false },
            { name: 'Smoked Smoked Pepperoni', price: 120, isDefault: false },
            { name: 'Truffle Honey Drizzle', price: 50, isDefault: false },
          ],
        },
      ],
    },
    {
      name: 'Smoked Burrata Margherita Speciale',
      slug: 'smoked-burrata-margherita',
      description: 'San Marzano D.O.P tomato sauce, fresh buffalo mozzarella, topped after bake with a whole creamy burrata ball and sweet organic basil.',
      price: 620,
      categoryId: 'woodfired-pizzas',
      imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1000&auto=format&fit=crop',
      isVeg: true,
      spiceLevel: 0,
      prepTime: 16,
      calories: 740,
      cuisine: 'Italian Woodfired',
      flavorProfile: 'Sweet San Marzano, Creamy Burrata, Fresh Basil',
      ingredients: 'Sourdough, San Marzano tomatoes, Whole burrata, Extra virgin olive oil, Basil leaves',
      allergens: 'Gluten, Dairy',
      isChefSpecial: false,
      isAnimeSpecial: false,
      rating: 4.88,
      ratingCount: 88,
      customizations: [
        {
          name: 'Chilli Flakes & Herbs',
          minSelect: 0,
          maxSelect: 1,
          isRequired: false,
          options: [
            { name: 'Calabrian Hot Chilli Oil on the side', price: 20, isDefault: false },
            { name: 'House Herb Blend', price: 0, isDefault: true },
          ],
        },
      ],
    },

    // Rustic Mains
    {
      name: 'Grand Royal Awadhi Murgh Biryani',
      slug: 'grand-royal-awadhi-biryani',
      description: 'Slow dum-cooked long-grain aged basmati rice layered with free-range chicken, saffron-infused milk, rose water, and caramelised onions. Served with burani raita and mirchi ka salan.',
      price: 580,
      categoryId: 'rustic-mains',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1000&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-serving-rice-with-a-spoon-41514-large.mp4',
      isVeg: false,
      spiceLevel: 2,
      prepTime: 22,
      calories: 820,
      cuisine: 'Awadhi Indian Heritage',
      flavorProfile: 'Aromatic, Saffron, Rich Dum Flavors',
      ingredients: 'Aged basmati rice, Tender farm chicken, Pure ghee, Saffron threads, Kewra, Fried onions',
      allergens: 'Dairy',
      isChefSpecial: true,
      isAnimeSpecial: false,
      rating: 4.96,
      ratingCount: 210,
      customizations: [
        {
          name: 'Spice Tuning',
          minSelect: 1,
          maxSelect: 1,
          isRequired: true,
          options: [
            { name: 'Authentic Royal Mild Dum', price: 0, isDefault: false },
            { name: 'Traditional Medium Spice', price: 0, isDefault: true },
            { name: 'Andhra Spice Fire Level', price: 0, isDefault: false },
          ],
        },
        {
          name: 'Add-on Side',
          minSelect: 0,
          maxSelect: 1,
          isRequired: false,
          options: [
            { name: 'Double Boiled Organic Egg', price: 30, isDefault: false },
            { name: 'Extra Fragrant Dum Rice', price: 80, isDefault: false },
          ],
        },
      ],
    },
    {
      name: 'Paneer Butter Masala Pot with Chur Chur Naan',
      slug: 'paneer-butter-masala-pot',
      description: 'Charcoal-smoked artisanal paneer cubes in a velvety slow-simmered tomato makhani sauce enriched with cultured white butter and kasuri methi. Served with flaky butter chur-chur naan.',
      price: 510,
      categoryId: 'rustic-mains',
      imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1000&auto=format&fit=crop',
      isVeg: true,
      spiceLevel: 1,
      prepTime: 18,
      calories: 680,
      cuisine: 'North Indian Rustic',
      flavorProfile: 'Rich Makhani, Creamy, Fenugreek Aroma',
      ingredients: 'Cottage cheese, Ripe tomatoes, Cultured butter, Fresh cream, Fenugreek leaves, Cardamom',
      allergens: 'Dairy, Cashew',
      isChefSpecial: false,
      isAnimeSpecial: false,
      rating: 4.88,
      ratingCount: 94,
      customizations: [
        {
          name: 'Bread Choice',
          minSelect: 1,
          maxSelect: 1,
          isRequired: true,
          options: [
            { name: 'Flaky Butter Chur Chur Naan (2 pcs)', price: 0, isDefault: true },
            { name: 'Garlic Herb Sourdough Roti (3 pcs)', price: 20, isDefault: false },
            { name: 'Gluten-Free Jowar Roti (2 pcs)', price: 40, isDefault: false },
          ],
        },
      ],
    },

    // Specialty Coffee & Brews
    {
      name: 'Signature URHD Spanish Saffron Cortado',
      slug: 'urhd-spanish-saffron-cortado',
      description: 'Double ristretto of Chikmagalur single-origin arabica, warm textured condensed milk, Kashmiri saffron infusion, and gold leaf dust.',
      price: 260,
      categoryId: 'artisanal-coffee',
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-barista-pouring-milk-into-a-cup-of-coffee-41513-large.mp4',
      isVeg: true,
      spiceLevel: 0,
      prepTime: 6,
      calories: 140,
      cuisine: 'Specialty Coffee',
      flavorProfile: 'Rich Espresso, Saffron Warmth, Sweet Milk',
      ingredients: '100% Arabica beans, Saffron milk, Pure cane syrup',
      allergens: 'Dairy',
      isChefSpecial: true,
      isAnimeSpecial: false,
      rating: 4.9,
      ratingCount: 130,
      customizations: [
        {
          name: 'Milk Type',
          minSelect: 1,
          maxSelect: 1,
          isRequired: true,
          options: [
            { name: 'Full Cream Organic Dairy', price: 0, isDefault: true },
            { name: 'Oat Milk (Barista Edition)', price: 30, isDefault: false },
            { name: 'Almond Milk', price: 30, isDefault: false },
          ],
        },
        {
          name: 'Sweetness',
          minSelect: 1,
          maxSelect: 1,
          isRequired: true,
          options: [
            { name: 'Standard Saffron Touch', price: 0, isDefault: true },
            { name: 'Less Sweet', price: 0, isDefault: false },
            { name: 'Zero Added Sugar', price: 0, isDefault: false },
          ],
        },
      ],
    },
    {
      name: 'Cold Drip Kyoto Style Single-Origin Brew',
      slug: 'kyoto-cold-drip-brew',
      description: '16-hour slow ice-drip extracted Ethiopian Yirgacheffe coffee. High clarity with floral jasmine and bergamot citrus notes. Served over crystal ice sphere.',
      price: 290,
      categoryId: 'artisanal-coffee',
      imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=1000&auto=format&fit=crop',
      isVeg: true,
      spiceLevel: 0,
      prepTime: 4,
      calories: 10,
      cuisine: 'Cold Brew Specialty',
      flavorProfile: 'Floral, Jasmine, Citrus, Clean Finish',
      ingredients: 'Filtered glacial water, Ethiopian single-origin specialty roast',
      allergens: 'None',
      isChefSpecial: true,
      isAnimeSpecial: false,
      rating: 4.94,
      ratingCount: 72,
      customizations: [
        {
          name: 'Flavor Twist',
          minSelect: 0,
          maxSelect: 1,
          isRequired: false,
          options: [
            { name: 'Pure Black (Purist)', price: 0, isDefault: true },
            { name: 'Orange Zest & Botanical Tonic', price: 40, isDefault: false },
            { name: 'Vanilla Bean Cold Foam', price: 40, isDefault: false },
          ],
        },
      ],
    },

    // Smoothies & Mocktails
    {
      name: 'Blue Spirulina Immunity Cloud Smoothie',
      slug: 'blue-spirulina-cloud-smoothie',
      description: 'Vibrant blue majik spirulina layered with organic coconut yogurt, frozen bananas, pineapple, and Madagascar vanilla.',
      price: 340,
      categoryId: 'shakes-mocktails',
      imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=1000&auto=format&fit=crop',
      isVeg: true,
      spiceLevel: 0,
      prepTime: 7,
      calories: 220,
      cuisine: 'Superfood Drinks',
      flavorProfile: 'Tropical, Coconut, Vanilla, Velvety',
      ingredients: 'Blue spirulina, Coconut cream, Banana, Pineapple, Chia seeds',
      allergens: 'None',
      isChefSpecial: true,
      isAnimeSpecial: false,
      rating: 4.86,
      ratingCount: 48,
      customizations: [
        {
          name: 'Superfood Boost',
          minSelect: 0,
          maxSelect: 2,
          isRequired: false,
          options: [
            { name: 'Organic Pea Protein (+15g)', price: 50, isDefault: false },
            { name: 'Maca Root & Ashwagandha', price: 40, isDefault: false },
          ],
        },
      ],
    },

    // Desserts
    {
      name: 'Basque Burnt Cheesecake with Wild Berry Compote',
      slug: 'basque-burnt-cheesecake',
      description: 'Caramelized rustic crust with an ultra-creamy, molten cheese interior, accompanied by tart simmered blackberry and raspberry compote.',
      price: 360,
      categoryId: 'decadent-desserts',
      imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1000&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cutting-a-slice-of-chocolate-cake-41487-large.mp4',
      isVeg: true,
      spiceLevel: 0,
      prepTime: 8,
      calories: 450,
      cuisine: 'Spanish Bakery',
      flavorProfile: 'Caramelized, Creamy, Molten Center, Tart Berries',
      ingredients: 'Philadelphia cream cheese, Heavy cream, Organic vanilla, Farm eggs, Berry compote',
      allergens: 'Dairy, Eggs',
      isChefSpecial: true,
      isAnimeSpecial: false,
      rating: 4.96,
      ratingCount: 180,
      customizations: [
        {
          name: 'Accompaniment',
          minSelect: 0,
          maxSelect: 1,
          isRequired: false,
          options: [
            { name: 'Scoop of Madagascar Vanilla Gelato', price: 70, isDefault: false },
            { name: 'Warm Dark Salted Caramel Drizzle', price: 30, isDefault: false },
          ],
        },
      ],
    },
  ];

  for (const item of menuItems) {
    const { customizations, ...itemData } = item;
    const createdItem = await prisma.menuItem.create({
      data: itemData,
    });

    if (customizations && customizations.length > 0) {
      for (const group of customizations) {
        const { options, ...groupData } = group;
        const createdGroup = await prisma.customizationGroup.create({
          data: {
            ...groupData,
            menuItemId: createdItem.id,
          },
        });

        for (const opt of options) {
          await prisma.customizationOption.create({
            data: {
              ...opt,
              groupId: createdGroup.id,
            },
          });
        }
      }
    }
  }

  // 5. Workspace Packages
  const workspacePackages = [
    {
      id: 'hourly-flex-pass',
      name: 'Hourly Flex Pass',
      duration: '1 Hour',
      price: 150,
      description: 'Quick sprint desk with high-speed 500Mbps optical WiFi, ergonomic chair, power outlets, and 1 complimentary hot beverage.',
      features: JSON.stringify([
        'High-Speed 500 Mbps Fiber Wi-Fi',
        'Universal power & USB-C fast charging at seat',
        '1 Complimentary Speciality Coffee or Tea',
        'Silent Zone Ergonomic Seating',
        'Full café menu direct-to-desk delivery',
      ]),
      popular: false,
    },
    {
      id: 'half-day-sprint',
      name: 'Half-Day Sprint Pass',
      duration: '4 Hours',
      price: 499,
      description: 'Ideal for productive deep-work mornings or afternoon client sprints. Includes food voucher and unlimited coffee refills.',
      features: JSON.stringify([
        '4 Hours guaranteed dedicated desk access',
        'Unlimited House Artisanal Filter / Espresso Coffee',
        '₹200 Café food voucher included',
        'Access to phone booth for private Zoom calls',
        'Printing & scanning services (up to 15 pages)',
        'Complimentary high-speed charging cables on request',
      ]),
      popular: true,
    },
    {
      id: 'full-day-executive',
      name: 'Full-Day Executive Pass',
      duration: '8 Hours',
      price: 899,
      description: 'Work, eat, and unwind seamlessly for the whole day. Dedicated quiet workstation, lunch credit, and anime lounge access.',
      features: JSON.stringify([
        'All-day 8 hours access (8:00 AM – 10:00 PM)',
        '₹400 Café dining & beverage credit included',
        'Unlimited cold brew, hot teas & infused waters',
        '1 Hour private meeting room credit',
        'Ergonomic Herman Miller style lumbar seating',
        'Free high-speed dual monitor loan (subject to availability)',
      ]),
      popular: false,
    },
    {
      id: 'monthly-resident',
      name: 'Monthly Resident Desk Membership',
      duration: '30 Days',
      price: 12999,
      description: 'Your permanent productive home. Reserved personalized desk, mail handling, priority room bookings, and 20% flat discount on all food.',
      features: JSON.stringify([
        'Personal reserved desk with lockable storage drawer',
        '20% Flat Discount on all food & beverage orders',
        '10 Hours monthly boardroom booking credits',
        'Company business address registration & courier handling',
        'Access to exclusive founder & tech networking events',
        'Complimentary invitation to One Piece Anime Movie Nights',
      ]),
      popular: false,
    },
    {
      id: 'pirate-boardroom',
      name: 'The Pirate King Meeting Room',
      duration: 'Per Hour (Up to 8 Persons)',
      price: 1200,
      description: 'Acoustically treated conference room equipped with 65-inch 4K conferencing screen, Polycom mic, whiteboard, and high-speed HDMI presentation.',
      features: JSON.stringify([
        'Seats up to 8 people comfortably',
        '65-inch 4K Ultra-HD screen with wireless AirPlay & HDMI',
        '360° Studio-grade audio & video conference bar',
        'Dedicated server button for continuous coffee/refreshments',
        'Magnetic glass whiteboard & stationery kit',
      ]),
      popular: false,
    },
  ];

  for (const wp of workspacePackages) {
    await prisma.workspacePackage.create({ data: wp });
  }

  // 6. Coupons
  const coupons = [
    {
      code: 'WELCOME50',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      minOrderAmount: 399,
      maxDiscount: 150,
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      usageLimit: 500,
      usedCount: 32,
      isActive: true,
    },
    {
      code: 'GRANDLINE20',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      minOrderAmount: 699,
      maxDiscount: 200,
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      usageLimit: 300,
      usedCount: 45,
      isActive: true,
    },
    {
      code: 'RUSTIC100',
      discountType: 'FIXED',
      discountValue: 100,
      minOrderAmount: 500,
      maxDiscount: 100,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      usageLimit: 200,
      usedCount: 18,
      isActive: true,
    },
    {
      code: 'GENZFLAVOR',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      minOrderAmount: 299,
      maxDiscount: 100,
      validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      usageLimit: 400,
      usedCount: 77,
      isActive: true,
    },
  ];

  for (const cp of coupons) {
    await prisma.coupon.create({ data: cp });
  }

  // 7. Inventory Items
  const inventoryItems = [
    {
      name: 'Organic Hass Avocados',
      category: 'Produce',
      quantity: 45,
      unit: 'kg',
      reorderLevel: 15,
      isLowStock: false,
      supplierName: 'Nilgiri Organic Orchards',
      supplierPhone: '+91 94432 10987',
      lastRestocked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      name: 'Single Origin Arabica Beans',
      category: 'Beverages',
      quantity: 28,
      unit: 'kg',
      reorderLevel: 10,
      isLowStock: false,
      supplierName: 'Chikmagalur Heritage Roasters',
      supplierPhone: '+91 98860 12345',
      lastRestocked: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      name: 'Puglia Burrata Cheese',
      category: 'Dairy',
      quantity: 8,
      unit: 'kg',
      reorderLevel: 10,
      isLowStock: true,
      supplierName: 'Artisan Fromagerie Imports',
      supplierPhone: '+91 97711 54321',
      lastRestocked: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      name: 'San Marzano D.O.P Tomatoes',
      category: 'Produce',
      quantity: 60,
      unit: 'cans',
      reorderLevel: 20,
      isLowStock: false,
      supplierName: 'Mediterranean Provisions Ltd',
      supplierPhone: '+91 99000 88776',
      lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      name: 'Saffron Threads (A Grade)',
      category: 'Spices',
      quantity: 0.8,
      unit: 'kg',
      reorderLevel: 0.5,
      isLowStock: false,
      supplierName: 'Pampore Kashmiri Saffron Guild',
      supplierPhone: '+91 91999 44332',
      lastRestocked: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      name: 'Eco Kraft Delivery Boxes & Bags',
      category: 'Packaging',
      quantity: 350,
      unit: 'units',
      reorderLevel: 100,
      isLowStock: false,
      supplierName: 'GreenEarth Packaging Co',
      supplierPhone: '+91 96655 44112',
      lastRestocked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const inv of inventoryItems) {
    await prisma.inventoryItem.create({ data: inv });
  }

  // 8. Sample Initial Orders (For real-time kitchen & owner dashboard verification)
  const luffyDish = await prisma.menuItem.findFirst({
    where: { slug: 'luffys-gigant-roast-platter' },
  });
  const sanjiDish = await prisma.menuItem.findFirst({
    where: { slug: 'sanjis-all-blue-risotto' },
  });
  const chopperDish = await prisma.menuItem.findFirst({
    where: { slug: 'chopper-sakura-frappe' },
  });
  const cortado = await prisma.menuItem.findFirst({
    where: { slug: 'urhd-spanish-saffron-cortado' },
  });

  const sampleTable = await prisma.diningTable.findFirst({
    where: { number: 4 },
  });

  // Dine-in order for Table 4
  const orderDineIn = await prisma.order.create({
    data: {
      orderNumber: 'URHD-DIN-101',
      userId: customer1.id,
      customerName: 'Monkey D. Luffy',
      customerPhone: '+91 98111 22233',
      customerEmail: 'luffy@grandline.com',
      orderType: 'DINE_IN',
      tableId: sampleTable.id,
      status: 'PREPARING',
      subtotal: 1210,
      tax: 60.5,
      deliveryFee: 0,
      discount: 100,
      totalAmount: 1170.5,
      specialInstructions: 'Make the meat extra roasted! Pirate King appetite!',
      estimatedTime: '15 mins',
      items: {
        create: [
          {
            menuItemId: luffyDish.id,
            quantity: 1,
            unitPrice: 890,
            totalPrice: 890,
            customizationsJson: JSON.stringify([
              { groupName: 'Glaze & Spice Level', optionName: 'Gear 5 Fiery Reaper Glaze', price: 30 },
              { groupName: 'Choose Your Side', optionName: 'Rustic Herb Potato Wedges', price: 0 },
            ]),
            specialNotes: 'Extra crispy exterior',
          },
          {
            menuItemId: chopperDish.id,
            quantity: 1,
            unitPrice: 320,
            totalPrice: 320,
            customizationsJson: JSON.stringify([
              { groupName: 'Size Selection', optionName: 'Grand Line Grande 500ml', price: 60 },
              { groupName: 'Milk Choice', optionName: 'Creamy Oat Milk', price: 20 },
            ]),
          },
        ],
      },
      payment: {
        create: {
          amount: 1170.5,
          currency: 'INR',
          paymentMethod: 'UPI_QR',
          paymentStatus: 'COMPLETED',
          transactionId: 'UPI-TXN-8891230',
          paidAt: new Date(),
        },
      },
    },
  });

  // Delivery order
  const orderDelivery = await prisma.order.create({
    data: {
      orderNumber: 'URHD-DEL-102',
      userId: customer2.id,
      customerName: 'Ananya Sharma',
      customerPhone: '+91 98222 33344',
      customerEmail: 'ananya@techventures.io',
      orderType: 'DELIVERY',
      deliveryAddressId: address2.id,
      status: 'CONFIRMED',
      subtotal: 1000,
      tax: 50,
      deliveryFee: 40,
      discount: 150,
      totalAmount: 940,
      specialInstructions: 'Leave with reception on Level 4 if in a meeting.',
      estimatedTime: '35 mins',
      items: {
        create: [
          {
            menuItemId: sanjiDish.id,
            quantity: 1,
            unitPrice: 740,
            totalPrice: 740,
            customizationsJson: JSON.stringify([
              { groupName: 'Seafood Portion', optionName: 'Standard Ocean Catch', price: 0 },
              { groupName: 'Cheese Finish', optionName: 'Classic Aged Parmigiano', price: 0 },
            ]),
          },
          {
            menuItemId: cortado.id,
            quantity: 1,
            unitPrice: 260,
            totalPrice: 260,
            customizationsJson: JSON.stringify([
              { groupName: 'Milk Type', optionName: 'Full Cream Organic Dairy', price: 0 },
              { groupName: 'Sweetness', optionName: 'Less Sweet', price: 0 },
            ]),
          },
        ],
      },
      payment: {
        create: {
          amount: 940,
          currency: 'INR',
          paymentMethod: 'RAZORPAY',
          paymentStatus: 'COMPLETED',
          razorpayOrderId: 'order_NxTest102',
          razorpayPaymentId: 'pay_NxTest102Paid',
          transactionId: 'RZP-PAY-441239',
          paidAt: new Date(),
        },
      },
    },
  });

  // 9. Customer Reviews
  await prisma.review.create({
    data: {
      userId: customer1.id,
      menuItemId: luffyDish.id,
      customerName: 'Monkey D. Luffy',
      rating: 5,
      comment: "BEST ROAST MEAT IN THE ENTIRE OCEAN! Gear 5 glaze is out of this world! I ate the bone too!",
      isVerified: true,
    },
  });

  await prisma.review.create({
    data: {
      userId: customer2.id,
      menuItemId: sanjiDish.id,
      customerName: 'Ananya Sharma (Senior PM)',
      rating: 5,
      comment: "Incredible attention to flavor. The black truffle and saffron risotto tasted like Michelin-level cooking in Indiranagar. The workspace Wi-Fi is also lightning fast!",
      isVerified: true,
    },
  });

  console.log('Seeding completed successfully!');
  console.log('Admin account: owner@urhd.com / admin123');
  console.log('Kitchen account: kitchen@urhd.com / chef123');
  console.log('Customer account: luffy@grandline.com / pirate123');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
