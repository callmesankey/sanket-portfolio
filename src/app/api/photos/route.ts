import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/photos - Fetch all photos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const skip = page ? (parseInt(page) - 1) * (parseInt(limit) || 20) : 0;
    const take = limit ? parseInt(limit) : undefined;

    const photos = await db.photo.findMany({
      where,
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        displayOrder: 'asc',
      },
      skip,
      take,
    });

    const total = await db.photo.count({ where });

    return NextResponse.json({
      photos,
      pagination: {
        total,
        pages: Math.ceil(total / (parseInt(limit) || 20)),
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : photos.length,
      },
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}

// POST /api/photos - Create a new photo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const photo = await db.photo.create({
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        altText: body.altText,
        thumbnailUrl: body.thumbnailUrl,
        category: body.category || 'general',
        tags: body.tags,
        displayOrder: body.displayOrder || 0,
        featured: body.featured || false,
        uploadedById: body.uploadedById,
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json(
      { error: 'Failed to create photo' },
      { status: 500 }
    );
  }
}
