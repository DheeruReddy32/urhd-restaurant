import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const vegOnly = searchParams.get('veg') === 'true';
    const nonVegOnly = searchParams.get('nonveg') === 'true';
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : null;
    const spiceLevel = searchParams.get('spice') ? parseInt(searchParams.get('spice')!) : null;
    const animeOnly = searchParams.get('anime') === 'true';
    const chefSpecial = searchParams.get('chef') === 'true';
    const sortBy = searchParams.get('sortBy') || 'featured';

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    const where: any = { isAvailable: true };

    if (category && category !== 'all') {
      where.categoryId = category;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
        { cuisine: { contains: q } },
        { ingredients: { contains: q } },
      ];
    }

    if (vegOnly) {
      where.isVeg = true;
    } else if (nonVegOnly) {
      where.isVeg = false;
    }

    if (maxPrice !== null && !isNaN(maxPrice)) {
      where.price = { lte: maxPrice };
    }

    if (spiceLevel !== null && !isNaN(spiceLevel)) {
      where.spiceLevel = spiceLevel;
    }

    if (animeOnly) {
      where.isAnimeSpecial = true;
    }

    if (chefSpecial) {
      where.isChefSpecial = true;
    }

    let orderBy: any = [{ isChefSpecial: 'desc' }, { rating: 'desc' }];
    if (sortBy === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sortBy === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sortBy === 'rating') {
      orderBy = { rating: 'desc' };
    } else if (sortBy === 'prep_time') {
      orderBy = { prepTime: 'asc' };
    }

    const items = await prisma.menuItem.findMany({
      where,
      orderBy,
      include: {
        category: true,
        customizations: {
          include: {
            options: true,
          },
        },
      },
    });

    return NextResponse.json({
      categories,
      items,
      count: items.length,
    });
  } catch (error: any) {
    console.error('Menu fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      description,
      price,
      categoryId,
      imageUrl,
      videoUrl,
      isVeg,
      spiceLevel,
      prepTime,
      calories,
      cuisine,
      flavorProfile,
      ingredients,
      allergens,
      isChefSpecial,
      isAnimeSpecial,
      animeTheme,
      customizations,
    } = body;

    if (!name || !price || !categoryId || !imageUrl) {
      return NextResponse.json(
        { error: 'Name, price, category, and image URL are required' },
        { status: 400 }
      );
    }

    const uniqueSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
        '-' +
        Date.now();

    const createdItem = await prisma.menuItem.create({
      data: {
        name,
        slug: uniqueSlug,
        description: description || '',
        price: parseFloat(price),
        categoryId,
        imageUrl,
        videoUrl: videoUrl || null,
        isVeg: Boolean(isVeg),
        spiceLevel: parseInt(spiceLevel || 1),
        prepTime: parseInt(prepTime || 15),
        calories: calories ? parseInt(calories) : null,
        cuisine: cuisine || 'Rustic Fusion',
        flavorProfile: flavorProfile || null,
        ingredients: ingredients || '',
        allergens: allergens || null,
        isChefSpecial: Boolean(isChefSpecial),
        isAnimeSpecial: Boolean(isAnimeSpecial),
        animeTheme: animeTheme || null,
      },
    });

    // Create customizations if provided
    if (customizations && Array.isArray(customizations)) {
      for (const group of customizations) {
        const createdGroup = await prisma.customizationGroup.create({
          data: {
            menuItemId: createdItem.id,
            name: group.name,
            minSelect: group.minSelect || 0,
            maxSelect: group.maxSelect || 1,
            isRequired: Boolean(group.isRequired),
          },
        });

        if (group.options && Array.isArray(group.options)) {
          for (const opt of group.options) {
            await prisma.customizationOption.create({
              data: {
                groupId: createdGroup.id,
                name: opt.name,
                price: parseFloat(opt.price || 0),
                isDefault: Boolean(opt.isDefault),
              },
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true, item: createdItem });
  } catch (err: any) {
    console.error('Create dish error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
