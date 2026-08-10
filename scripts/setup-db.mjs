/**
 * Rescue Mission Orphanage — database setup & seed script.
 *
 * Creates the `rescue_mission` database (if missing), creates all tables,
 * and seeds them with the initial demo content.
 *
 * NOTE: Re-running this script resets all tables to the seed data
 * (TRUNCATE ... RESTART IDENTITY).
 *
 * Usage:  node scripts/setup-db.mjs
 * Connection can be overridden with PGUSER/PGPASSWORD/PGHOST/PGPORT/PGDATABASE.
 */
import pg from 'pg'

const { Client } = pg

const config = {
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '1234567890',
}

const DB_NAME = process.env.PGDATABASE || 'rescue_mission'

const SCHEMA = `
CREATE TABLE IF NOT EXISTS stories (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Announcements',
  author TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  read_time TEXT NOT NULL DEFAULT '',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  image TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  donor_name TEXT NOT NULL,
  email TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending'
);

CREATE TABLE IF NOT EXISTS programs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  beneficiaries TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'image',
  category TEXT NOT NULL DEFAULT 'Events',
  title TEXT NOT NULL,
  image TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  org_name TEXT NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  founded_year TEXT NOT NULL DEFAULT '',
  phone1 TEXT NOT NULL DEFAULT '',
  phone2 TEXT NOT NULL DEFAULT '',
  email1 TEXT NOT NULL DEFAULT '',
  email2 TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  office_hours TEXT NOT NULL DEFAULT '',
  facebook TEXT NOT NULL DEFAULT '',
  twitter TEXT NOT NULL DEFAULT '',
  instagram TEXT NOT NULL DEFAULT '',
  youtube TEXT NOT NULL DEFAULT '',
  children_served TEXT NOT NULL DEFAULT '',
  countries_active TEXT NOT NULL DEFAULT '',
  volunteers_active TEXT NOT NULL DEFAULT '',
  funds_raised TEXT NOT NULL DEFAULT '',
  donation_presets JSONB NOT NULL DEFAULT '[25,50,100,250,500,1000]'::jsonb
);
`

const stories = [
  {
    title: "How Education Changed Mary's Life",
    excerpt:
      "Meet Mary, a bright young girl who overcame adversity through our education program to become the first in her family to attend university.",
    category: 'Success Stories',
    author: 'Grace Mwangi',
    date: 'March 15, 2024',
    readTime: '5 min read',
    featured: true,
    image:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    content: `When Mary arrived at Rescue Mission Orphanage in 2015, she had never set foot in a classroom. At eight years old, she couldn't read or write, and her future seemed uncertain.

Through our education program, Mary was paired with a dedicated tutor who worked with her three times a week. Slowly but surely, she began to catch up. Her curiosity was insatiable — she devoured every book she could get her hands on.

By 2019, Mary had not only caught up with her peers but was leading her class. She developed a particular passion for science, often staying after school to help younger children with their experiments.

In 2023, Mary became the first person in her family to attend university, earning a full scholarship to study medicine. Her dream is to return to the community that raised her and open a clinic for children in need.

"Rescue Mission didn't just give me an education," Mary says. "They gave me a future. They showed me that my past doesn't define my story."

Today, Mary is in her second year of medical school, maintaining a 3.8 GPA while volunteering at a local health clinic on weekends. She regularly writes letters to the children at Rescue Mission, encouraging them to dream big.`,
  },
  {
    title: 'Annual Fundraising Gala 2024',
    excerpt:
      'Join us for our biggest fundraising event of the year, featuring inspiring stories, live entertainment, and opportunities to make a difference.',
    category: 'Events',
    author: 'David Okonkwo',
    date: 'March 10, 2024',
    readTime: '3 min read',
    featured: false,
    image:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80',
    content: `Mark your calendars! Our Annual Fundraising Gala returns on April 20th, 2024, at the Grand City Convention Center.

This year's theme, "Seeds of Hope," celebrates the incredible journeys of the children we serve. The evening will feature live music, a silent auction, and personal testimonies from program graduates who have gone on to achieve remarkable things.

Last year's gala raised over $500,000, directly funding education programs for 200 children. This year, we're aiming even higher — our goal is to raise $750,000 to expand our healthcare initiatives.

The evening begins at 6:00 PM with a cocktail reception, followed by dinner and the main program at 7:30 PM. Tickets are $150 per person, with table packages available for corporate sponsors.

Special guests include celebrity ambassador Sarah Johnson and renowned philanthropist Michael Chen, who has been a supporter of Rescue Mission since 2010.

Purchase your tickets at our donate page or contact us directly for corporate sponsorship opportunities.`,
  },
  {
    title: "Meet Our Volunteers: John's Story",
    excerpt:
      'John has been volunteering with us for 5 years. Discover what motivates him to give his time and how volunteering changed his perspective.',
    category: 'Volunteer Spotlights',
    author: 'Sarah Williams',
    date: 'March 5, 2024',
    readTime: '4 min read',
    featured: false,
    image:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
    content: `John first walked through the doors of Rescue Mission Orphanage in 2019, unsure of what to expect. A retired teacher, he was looking for a way to stay active and give back to his community.

"I thought I'd be helping kids with homework," John recalls with a laugh. "Instead, they changed my life."

What started as a two-hour weekly commitment quickly grew into a full-time passion. John now spends four days a week at the orphanage, mentoring children and leading reading programs.

His most memorable moment came in 2021, when a shy twelve-year-old named Samuel finally opened up during their reading session. "He looked at me and said, 'John, you're like the grandpa I never had.' That's when I knew I'd found my calling."

John has since recruited over 30 volunteers from his local church and community group. His dedication earned him the Volunteer of the Year award at our 2023 ceremony.

"If you're thinking about volunteering, just show up," John advises. "The kids will take care of the rest. They have a way of showing you what really matters in life."`,
  },
  {
    title: 'New Healthcare Center Opening',
    excerpt:
      "We're excited to announce the opening of our new healthcare center, which will serve over 1,000 children annually.",
    category: 'Announcements',
    author: 'James Chen',
    date: 'February 28, 2024',
    readTime: '2 min read',
    featured: false,
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80',
    content: `We are thrilled to announce the opening of our new state-of-the-art healthcare center, made possible by a generous $2 million donation from the Global Health Foundation.

The 15,000 square foot facility includes examination rooms, a dental clinic, a mental health counseling center, and a pharmacy. It will serve not only the children at Rescue Mission but also families in the surrounding communities.

"We believe every child deserves access to quality healthcare," said Dr. Patricia Okonkwo, our new Medical Director. "This center will be a beacon of hope for thousands of families."

The center is equipped with the latest medical technology and staffed by a team of dedicated healthcare professionals, many of whom have volunteered their time to serve our community.

Services will include routine check-ups, vaccinations, dental care, mental health counseling, and health education programs. We expect to serve over 1,000 children in the first year alone.

The grand opening ceremony will be held on March 15th, with tours of the facility and opportunities to meet our healthcare team.`,
  },
  {
    title: "From Orphan to Doctor: Peter's Journey",
    excerpt:
      "Peter came to us as a orphaned child. Today, he's a doctor giving back to the community that raised him.",
    category: 'Success Stories',
    author: 'Grace Mwangi',
    date: 'February 20, 2024',
    readTime: '6 min read',
    featured: false,
    image:
      'https://images.unsplash.com/photo-1508963493744-76fce69379c0?auto=format&fit=crop&w=900&q=80',
    content: `Peter's story is one of the most remarkable transformations in Rescue Mission's history. Arriving at the orphanage at just three years old, he had already experienced more hardship than most people face in a lifetime.

Growing up, Peter struggled with health issues that threatened to derail his education. It was during one of our regular health check-ups that a visiting doctor noticed something unusual and recommended further testing.

That early detection led to a diagnosis that, with proper treatment, was completely manageable. The experience ignited Peter's passion for medicine.

Through our education and mentorship programs, Peter excelled academically. He earned a scholarship to study medicine at the University of Lagos, graduating top of his class in 2022.

Today, Dr. Peter Okafor runs a free clinic that serves orphanages and underserved communities across three states. He credits Rescue Mission for giving him not just a chance at life, but the tools to help others live theirs.

"Every child I treat, every life I touch — it all goes back to Rescue Mission," Peter says. "They didn't just save my life. They showed me how to save others."

Peter visits Rescue Mission every year, conducting free health screenings and inspiring the children with his story.`,
  },
  {
    title: 'Community Outreach Program Results',
    excerpt:
      'Our latest community outreach program reached 500 families with vital health education and resources.',
    category: 'Events',
    author: 'David Okonkwo',
    date: 'February 15, 2024',
    readTime: '3 min read',
    featured: false,
    image:
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80',
    content: `Our Community Outreach Program has completed its most successful quarter yet, reaching 500 families across five communities with vital health education, nutritional support, and family counseling services.

The program, which launched in 2022, focuses on preventative care and education to strengthen families and reduce the number of children entering orphanages due to preventable circumstances.

Key achievements this quarter include:
- 500 families received comprehensive health screenings
- 1,200 children received vaccinations
- 200 parents completed parenting workshops
- 150 families received nutritional counseling
- 50 families were connected with job training programs

"The results speak for themselves," said program coordinator Amina Hassan. "When we invest in families, we create stronger communities and brighter futures for children."

The program operates through partnerships with local clinics, schools, and community centers, leveraging volunteer expertise to maximize reach and impact.

We're expanding the program to three additional communities in the coming months, with a goal of reaching 1,000 families by the end of 2024.`,
  },
]

const contacts = [
  { name: 'Sarah Mitchell', email: 'sarah.mitchell@email.com', subject: 'General Inquiry', message: 'I would like to learn more about your orphanage programs and how I can support them.', date: '2026-08-08', read: false },
  { name: 'James Rodriguez', email: 'james.r@email.com', subject: 'Donation Question', message: 'Can I make a recurring monthly donation? What payment methods do you accept?', date: '2026-08-07', read: false },
  { name: 'Emily Chen', email: 'emily.chen@email.com', subject: 'Volunteer Opportunity', message: 'I am interested in volunteering this summer. What positions are available?', date: '2026-08-06', read: true },
  { name: 'Michael Okafor', email: 'm.okafor@email.com', subject: 'Partnership', message: 'Our organization would like to discuss a potential partnership with your orphanage.', date: '2026-08-05', read: true },
  { name: 'Lisa Patel', email: 'lisa.patel@email.com', subject: 'Media Inquiry', message: 'I am a journalist covering children welfare. May I schedule an interview?', date: '2026-08-04', read: false },
  { name: 'David Kim', email: 'david.kim@email.com', subject: 'General Inquiry', message: 'What are the visiting hours and requirements to visit the orphanage?', date: '2026-08-03', read: true },
  { name: 'Amanda Foster', email: 'amanda.f@email.com', subject: 'Donation Question', message: 'I would like to donate clothes and toys. Do you have specific needs?', date: '2026-08-02', read: false },
  { name: 'Robert Singh', email: 'r.singh@email.com', subject: 'Volunteer Opportunity', message: 'I have experience in teaching. Can I help with educational programs?', date: '2026-08-01', read: true },
  { name: 'Jennifer Adams', email: 'jennifer.a@email.com', subject: 'Partnership', message: 'Our school wants to organize a fundraiser for your orphanage.', date: '2026-07-30', read: true },
  { name: 'Thomas Wright', email: 't.wright@email.com', subject: 'Media Inquiry', message: 'I am creating a documentary. Would you be interested in participating?', date: '2026-07-28', read: false },
]

const donations = [
  { donorName: 'Kwame Mensah', email: 'kwame.mensah@gmail.com', amount: 2500, type: 'One-time', date: '2026-08-01', status: 'Completed' },
  { donorName: 'Ama Osei', email: 'ama.osei@yahoo.com', amount: 1500, type: 'Monthly', date: '2026-08-02', status: 'Completed' },
  { donorName: 'Kofi Asante', email: 'kofi.asante@outlook.com', amount: 5000, type: 'Sponsorship', date: '2026-08-03', status: 'Pending' },
  { donorName: 'Abena Boateng', email: 'abena.boateng@gmail.com', amount: 500, type: 'One-time', date: '2026-08-04', status: 'Completed' },
  { donorName: 'Kwadwo Appiah', email: 'kwadwo.appiah@gmail.com', amount: 750, type: 'Monthly', date: '2026-08-05', status: 'Failed' },
  { donorName: 'Akosua Frimpong', email: 'akosua.frimpong@yahoo.com', amount: 3000, type: 'Sponsorship', date: '2026-08-06', status: 'Completed' },
  { donorName: 'Yaw Boateng', email: 'yaw.boateng@gmail.com', amount: 200, type: 'One-time', date: '2026-08-07', status: 'Pending' },
  { donorName: 'Efua Mensah', email: 'efua.mensah@outlook.com', amount: 1800, type: 'Monthly', date: '2026-08-07', status: 'Completed' },
  { donorName: 'Kojo Adjei', email: 'kojo.adjei@gmail.com', amount: 1200, type: 'One-time', date: '2026-08-08', status: 'Failed' },
  { donorName: 'Ama Serwaa', email: 'ama.serwaa@yahoo.com', amount: 4500, type: 'Sponsorship', date: '2026-08-08', status: 'Completed' },
  { donorName: 'Nana Osei-Bonsu', email: 'nana.oseibonsu@gmail.com', amount: 800, type: 'One-time', date: '2026-08-09', status: 'Pending' },
  { donorName: 'Adwoa Korankye', email: 'adwoa.korankye@outlook.com', amount: 2200, type: 'Monthly', date: '2026-08-09', status: 'Completed' },
  { donorName: 'Kwesi Amoako', email: 'kwesi.amoako@gmail.com', amount: 50, type: 'One-time', date: '2026-08-09', status: 'Completed' },
  { donorName: 'Esi Ackah', email: 'esi.ackah@yahoo.com', amount: 3500, type: 'Sponsorship', date: '2026-08-10', status: 'Pending' },
  { donorName: 'Kofi Mensah', email: 'kofi.mensah@gmail.com', amount: 950, type: 'One-time', date: '2026-08-10', status: 'Completed' },
]

const programs = [
  { title: 'Education', subtitle: 'Quality learning for all', icon: 'graduation-cap', description: 'Comprehensive education programs from primary to vocational training, empowering children with knowledge and skills for a brighter future.', status: 'active', beneficiaries: '2500+' },
  { title: 'Healthcare', subtitle: 'Caring for well-being', icon: 'heart', description: 'Holistic healthcare services including medical checkups, dental care, mental health support, and emergency treatments.', status: 'active', beneficiaries: '3000+' },
  { title: 'Nutrition', subtitle: 'Nourishing body and soul', icon: 'lightning', description: 'Balanced meal programs providing nutritious breakfast, lunch, and dinner to ensure every child receives proper nutrition.', status: 'active', beneficiaries: '500K+ meals' },
  { title: 'Shelter', subtitle: 'Safe spaces to grow', icon: 'house', description: 'Safe and loving residential facilities that provide a warm home environment with care, guidance, and stability.', status: 'active', beneficiaries: '500+' },
  { title: 'Aftercare', subtitle: 'Building independent futures', icon: 'gear', description: 'Transition support programs helping youth prepare for independent living through career guidance, life skills, and mentorship.', status: 'inactive', beneficiaries: '1200+' },
  { title: 'Community', subtitle: 'Strengthening families', icon: 'users', description: 'Community outreach initiatives supporting families through parenting workshops, livelihood programs, and social services.', status: 'active', beneficiaries: '5000+' },
]

const galleryItems = [
  { type: 'image', category: 'Events', title: 'Annual Fundraising Gala', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80' },
  { type: 'video', category: 'Programs', title: 'After-School Tutoring', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80' },
  { type: 'image', category: 'Facilities', title: 'New Playground Area', image: 'https://images.unsplash.com/photo-1575783970733-1aaedde1db74?auto=format&fit=crop&w=400&q=80' },
  { type: 'image', category: 'Children', title: 'Art Workshop Day', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400&q=80' },
  { type: 'video', category: 'Events', title: 'Holiday Celebration', image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400&q=80' },
  { type: 'image', category: 'Programs', title: 'Music Lessons', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80' },
  { type: 'image', category: 'Facilities', title: 'Library Reading Corner', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { type: 'video', category: 'Children', title: 'Sports Day Highlights', image: 'https://images.unsplash.com/photo-1461896836934-bd45ba06879b?auto=format&fit=crop&w=400&q=80' },
  { type: 'image', category: 'Events', title: 'Community Outreach', image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=400&q=80' },
  { type: 'image', category: 'Programs', title: 'Computer Literacy Class', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80' },
  { type: 'video', category: 'Facilities', title: 'Dining Hall Renovation', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80' },
  { type: 'image', category: 'Children', title: 'Garden Planting Day', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=80' },
]

const settings = {
  orgName: 'Rescue Mission Orphanage',
  tagline: 'Give Hope To Children In Need',
  description:
    'A dedicated charity organization focused on creating sustainable solutions for those in need.',
  foundedYear: '2008',
  phone1: '+233 24 567 890',
  phone2: '+233 20 567 891',
  email1: 'info@rescuemission.org',
  email2: 'donate@rescuemission.org',
  address: '123 Hope Street, Accra, Ghana',
  officeHours: 'Mon-Fri: 9AM-5PM, Sat: 9AM-1PM',
  facebook: 'https://facebook.com/rescuemission',
  twitter: 'https://twitter.com/rescuemission',
  instagram: 'https://instagram.com/rescuemission',
  youtube: 'https://youtube.com/rescuemission',
  childrenServed: '5,000+',
  countriesActive: '5',
  volunteersActive: '186',
  fundsRaised: 'GH₵2.5M',
  donationPresets: [25, 50, 100, 250, 500, 1000],
}

async function main() {
  // 1. Ensure the database exists
  const admin = new Client({ ...config, database: 'postgres' })
  await admin.connect()
  const exists = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [DB_NAME])
  if (exists.rowCount === 0) {
    await admin.query(`CREATE DATABASE ${DB_NAME}`)
    console.log(`Created database "${DB_NAME}".`)
  } else {
    console.log(`Database "${DB_NAME}" already exists.`)
  }
  await admin.end()

  // 2. Connect to the target database and create schema
  const db = new Client({ ...config, database: DB_NAME })
  await db.connect()
  await db.query(SCHEMA)
  console.log('Schema ready.')

  // 3. Seed data
  await db.query('TRUNCATE stories, contacts, donations, programs, gallery_items, settings RESTART IDENTITY CASCADE')

  for (const s of stories) {
    await db.query(
      `INSERT INTO stories (title, excerpt, category, author, date, read_time, featured, image, content)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [s.title, s.excerpt, s.category, s.author, s.date, s.readTime, s.featured, s.image, s.content]
    )
  }

  for (const c of contacts) {
    await db.query(
      `INSERT INTO contacts (name, email, subject, message, date, read) VALUES ($1,$2,$3,$4,$5,$6)`,
      [c.name, c.email, c.subject, c.message, c.date, c.read]
    )
  }

  for (const d of donations) {
    await db.query(
      `INSERT INTO donations (donor_name, email, amount, type, date, status) VALUES ($1,$2,$3,$4,$5,$6)`,
      [d.donorName, d.email, d.amount, d.type, d.date, d.status]
    )
  }

  for (const p of programs) {
    await db.query(
      `INSERT INTO programs (title, subtitle, icon, description, status, beneficiaries) VALUES ($1,$2,$3,$4,$5,$6)`,
      [p.title, p.subtitle, p.icon, p.description, p.status, p.beneficiaries]
    )
  }

  for (const g of galleryItems) {
    await db.query(
      `INSERT INTO gallery_items (type, category, title, image) VALUES ($1,$2,$3,$4)`,
      [g.type, g.category, g.title, g.image]
    )
  }

  await db.query(
    `INSERT INTO settings (
       id, org_name, tagline, description, founded_year, phone1, phone2, email1, email2,
       address, office_hours, facebook, twitter, instagram, youtube, children_served,
       countries_active, volunteers_active, funds_raised, donation_presets
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20::jsonb)`,
    [
      1, settings.orgName, settings.tagline, settings.description, settings.foundedYear,
      settings.phone1, settings.phone2, settings.email1, settings.email2, settings.address,
      settings.officeHours, settings.facebook, settings.twitter, settings.instagram,
      settings.youtube, settings.childrenServed, settings.countriesActive,
      settings.volunteersActive, settings.fundsRaised, JSON.stringify(settings.donationPresets),
    ]
  )

  const counts = await db.query(
    `SELECT
       (SELECT count(*) FROM stories) AS stories,
       (SELECT count(*) FROM contacts) AS contacts,
       (SELECT count(*) FROM donations) AS donations,
       (SELECT count(*) FROM programs) AS programs,
       (SELECT count(*) FROM gallery_items) AS gallery`
  )
  console.log('Seeded:', counts.rows[0])

  await db.end()
  console.log('Done.')
}

main().catch((err) => {
  console.error('Setup failed:', err.message)
  process.exit(1)
})
