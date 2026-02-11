import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/galleries - Fetch all galleries
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const published = searchParams.get('published');

    const where: any = {};

    if (published === 'true') {
      where.published = true;
    }

    const galleries = await db.gallery.findMany({
      where,
      include: {
        items: {
          include: {
            photo: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json({ galleries });
  } catch (error) {
    console.error('Error fetching galleries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch galleries' },
      { status: 500 }
    );
  }
}

// POST /api/galleries - Create a new gallery
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const gallery = await db.gallery.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        coverImage: body.coverImage,
        order: body.order || 0,
        published: body.published || false,
      },
    });

    // Add photos to gallery if provided
    if (body.photoIds && body.photoIds.length > 0) {
      await Promise.all(
        body.photoIds.map((photoId: string, index: number) =>
          db.galleryItem.create({
            data: {
              galleryId: gallery.id,
              photoId,
              order: index,
            },
          })
        )
      );
    }

    const createdGallery = await db.gallery.findUnique({
      where: { id: gallery.id },
      include: {
        items: {
          include: {
            photo: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json(createdGallery, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery:', error);
    return NextResponse.json(
      { error: 'Failed to create gallery' },
      { status: 500 }
    );
  }
}
