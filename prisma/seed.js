const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Towels", slug: "towels", description: "Soft, absorbent essentials designed for everyday comfort.", sortOrder: 1 },
  { name: "T-Shirts", slug: "t-shirts", description: "Natural comfort for everyday wear.", sortOrder: 2 },
  { name: "Hankies", slug: "hankies", description: "Simple, soft and practical everyday essentials.", sortOrder: 3 },
];

const TESTIMONIALS = [
  {
    name: "Ananya Sharma",
    content: "The bamboo towels are unbelievably soft and dry so much faster than the ones I used before. Ordering through WhatsApp was quick and easy.",
    rating: 5,
  },
  {
    name: "Rahul Mehta",
    content: "Really impressed with the quality of the t-shirts — the fabric feels premium and holds up well after multiple washes.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    content: "Loved how easy it was to place an order. Sent a WhatsApp message and had a confirmation within minutes.",
    rating: 5,
  },
  {
    name: "Arjun Menon",
    content: "Great everyday essentials. The hankies are a nice touch — soft, practical, and well made.",
    rating: 4,
  },
  {
    name: "Sneha Iyer",
    content: "Consistent quality across everything I've ordered. George McKye has become my go-to for natural, comfortable basics.",
    rating: 5,
  },
];

// Note: products are intentionally NOT seeded here. Products should be created
// through the real /admin/products/new form so images go through the actual
// upload flow (public/uploads) and the admin can enter real pricing.

async function main() {
  // 1. Categories
  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      create: category,
      update: { name: category.name, description: category.description, sortOrder: category.sortOrder },
    });
  }
  console.log(`Seeded ${CATEGORIES.length} categories.`);

  // 2. Admin user
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.upsert({
      where: { email: adminEmail.toLowerCase() },
      create: {
        email: adminEmail.toLowerCase(),
        name: "George McKye Admin",
        password: hashedPassword,
        role: "ADMIN",
      },
      update: {
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log(`Seeded admin user: ${adminEmail}`);
  } else {
    console.warn("ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user seed.");
  }

  // 3. Testimonials (only seed if none exist, so re-running doesn't duplicate)
  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({ data: TESTIMONIALS });
    console.log(`Seeded ${TESTIMONIALS.length} testimonials.`);
  } else {
    console.log("Testimonials already exist — skipping.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
