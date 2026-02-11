import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@sanket.com' },
    update: {},
    create: {
      email: 'admin@sanket.com',
      password: '$2b$10$placeholder', // Should be hashed in production
      name: 'Sanket Dhital',
    },
  });
  console.log('✅ Admin user created');

  // Create sample posts
  const posts = [
    {
      title: '5 Tips for Effective Business Administration',
      slug: '5-tips-for-effective-business-administration',
      excerpt: 'Discover key strategies to streamline your business operations and boost productivity.',
      content: `# 5 Tips for Effective Business Administration

As an administrative professional with over five years of experience, I've learned that efficient administration is the backbone of any successful organization. Here are my top tips:

## 1. Embrace Digital Tools

Leveraging CRM systems, automation tools, and digital platforms can significantly reduce manual workload and improve accuracy.

## 2. Prioritize Clear Communication

Establish clear communication channels and ensure all team members are aligned with organizational goals.

## 3. Data-Driven Decision Making

Use data analytics to inform administrative decisions and track key performance indicators.

## 4. Continuous Learning

Stay updated with industry trends and emerging technologies in business administration.

## 5. Build Strong Relationships

Cultivate positive relationships with colleagues, stakeholders, and clients to ensure smooth operations.`,
      coverImage: 'https://z-cdn-media.chatglm.cn/files/5a239b85-e472-49b1-92e0-e785754469a5.png?auth_key=1870624669-d3f0fad3e7714df58168f74c224c20c3-0-f249527d716ea55df4ec324c82e271ee',
      altText: 'Business administration workspace with digital tools',
      metaTitle: '5 Tips for Effective Business Administration | Sanket Dhital',
      metaDescription: 'Discover key strategies to streamline your business operations and boost productivity. Learn from 5+ years of experience in business administration.',
      published: true,
      featured: true,
      authorId: admin.id,
    },
    {
      title: 'The Power of Custom CRM Systems',
      slug: 'the-power-of-custom-crm-systems',
      excerpt: 'How building a custom CRM transformed our recruitment workflows and improved efficiency.',
      content: `# The Power of Custom CRM Systems

Every business has unique needs, and off-the-shelf solutions don't always fit. Here's how we built a custom CRM for our recruitment workflows.

## Understanding the Need

We struggled with generic CRMs that didn't align with our specific recruitment processes. Data was scattered, and follow-ups were often missed.

## The Solution

We developed a custom CRM system that:
- Centralized all candidate data
- Automated follow-up reminders
- Integrated with our email marketing tools
- Provided real-time analytics

## Results

- 40% reduction in data entry time
- 60% improvement in follow-up rates
- Better candidate experience

## Key Takeaway

Don't be afraid to customize tools to fit your business needs.`,
      coverImage: 'https://z-cdn-media.chatglm.cn/files/15a7194c-0f6d-47d9-b7b7-dbc18449c76c.jpeg?auth_key=1870624669-42aaa17df2b84c55935c6555020c954e-0-e779b0a3e4b7d06121d5d92517864405',
      altText: 'Custom CRM dashboard showing recruitment analytics',
      metaTitle: 'The Power of Custom CRM Systems | Sanket Dhital',
      metaDescription: 'Learn how building a custom CRM transformed recruitment workflows and improved efficiency. Real results from a 5+ year veteran in business operations.',
      published: true,
      featured: false,
      authorId: admin.id,
    },
  ];

  for (const postData of posts) {
    await prisma.post.upsert({
      where: { slug: postData.slug },
      update: postData,
      create: postData,
    });
  }
  console.log('✅ Sample posts created');

  // Create sample photos
  const photos = [
    {
      title: 'Professional Portrait',
      description: 'Professional headshot taken for business profiles',
      imageUrl: 'https://z-cdn-media.chatglm.cn/files/15a7194c-0f6d-47d9-b7b7-dbc18449c76c.jpeg?auth_key=1870624669-42aaa17df2b84c55935c6555020c954e-0-e779b0a3e4b7d06121d5d92517864405',
      altText: 'Professional headshot of Sanket Dhital',
      category: 'portfolio',
      tags: 'professional,portrait,business',
      featured: true,
      uploadedById: admin.id,
    },
    {
      title: 'Creative Workspace',
      description: 'Creative design workspace showcasing design tools',
      imageUrl: 'https://z-cdn-media.chatglm.cn/files/af809a7b-a99e-47f0-ad84-408bc512a5f0.png?auth_key=1870624669-912c44b19d5745bdb7f34b16c1800645-0-64ca70fadf77cc57846652bcc4c24380',
      altText: 'Creative design workspace with computer and design tools',
      category: 'design',
      tags: 'design,creative,workspace',
      featured: true,
      uploadedById: admin.id,
    },
    {
      title: 'Business Operations',
      description: 'Modern office setup for business operations',
      imageUrl: 'https://z-cdn-media.chatglm.cn/files/5a239b85-e472-49b1-92e0-e785754469a5.png?auth_key=1870624669-d3f0fad3e7714df58168f74c224c20c3-0-f249527d716ea55df4ec324c82e271ee',
      altText: 'Modern office workspace for business operations and administration',
      category: 'portfolio',
      tags: 'business,operations,office',
      featured: false,
      uploadedById: admin.id,
    },
  ];

  for (const photoData of photos) {
    await prisma.photo.upsert({
      where: { 
        id: photoData.title.toLowerCase().replace(/\s+/g, '-') 
      },
      update: photoData,
      create: {
        ...photoData,
        id: photoData.title.toLowerCase().replace(/\s+/g, '-'),
      },
    });
  }
  console.log('✅ Sample photos created');

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
