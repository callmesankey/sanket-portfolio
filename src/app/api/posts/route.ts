import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/posts - Fetch all posts (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const published = searchParams.get('published');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');

    const where: any = {};

    if (published === 'true') {
      where.published = true;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const skip = page ? (parseInt(page) - 1) * (parseInt(limit) || 10) : 0;
    const take = limit ? parseInt(limit) : undefined;

    const posts = await db.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
    });

    const total = await db.post.count({ where });

    return NextResponse.json({
      posts,
      pagination: {
        total,
        pages: Math.ceil(total / (parseInt(limit) || 10)),
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : posts.length,
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const post = await db.post.create({
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        coverImage: body.coverImage,
        altText: body.altText,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        metaKeywords: body.metaKeywords,
        published: body.published || false,
        featured: body.featured || false,
        authorId: body.authorId,
        publishedAt: body.published ? new Date() : null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
