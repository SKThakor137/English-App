import { PrismaClient, UserRole, CefrLevel } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding curriculum and system defaults...');

  // 1. Create Default Admin User
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('AdminPassword123!', salt);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@englishfluency.com' },
    update: { role: UserRole.ADMIN },
    create: {
      email: 'admin@englishfluency.com',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      isEmailVerified: true,
      profile: {
        create: {
          fullName: 'System Administrator',
          currentLevel: CefrLevel.ADVANCED,
          targetGoal: 'Platform Management',
          dailyGoalMinutes: 30,
        },
      },
      streak: {
        create: {
          currentStreak: 10,
          longestStreak: 10,
        },
      },
      subscription: {
        create: {
          planTier: UserRole.ADMIN,
        },
      },
    },
  });
  console.log(`Admin user seeded: ${admin.email}`);

  // 2. Curriculum Seed Data
  const coursesData = [
    {
      title: 'Everyday Conversational Foundations',
      slug: 'everyday-conversational-foundations',
      description: 'Master essential English for introductions, daily routines, shopping, and asking for directions.',
      level: CefrLevel.BEGINNER,
      topic: 'Daily Life',
      orderIndex: 1,
      isPublished: true,
      lessons: [
        {
          title: 'Introducing Yourself & Greetings',
          orderIndex: 1,
          estimatedMinutes: 8,
          sentences: [
            {
              targetText: 'Hello, my name is Priya and I am pleased to meet you.',
              ipaTranscription: 'həˈloʊ, maɪ neɪm ɪz ˈpriːjə ænd aɪ æm pliːzd tu miːt juː.',
              grammarFocus: 'Present Simple (to be)',
              level: CefrLevel.BEGINNER,
            },
            {
              targetText: 'Where are you from, and how long have you lived here?',
              ipaTranscription: 'wɛr ɑr ju frʌm, ænd haʊ lɔŋ hæv ju lɪvd hɪr?',
              grammarFocus: 'Present Perfect & Question Formation',
              level: CefrLevel.BEGINNER,
            },
            {
              targetText: 'I usually wake up early and drink a cup of coffee before starting work.',
              ipaTranscription: 'aɪ ˈjuːʒuəli weɪk ʌp ˈɜrli ænd drɪŋk ə kʌp ʌv ˈkɔfi bɪˈfɔr ˈstɑrtɪŋ wɜrk.',
              grammarFocus: 'Adverbs of Frequency',
              level: CefrLevel.BEGINNER,
            },
          ],
        },
        {
          title: 'Ordering Food & Shopping',
          orderIndex: 2,
          estimatedMinutes: 10,
          sentences: [
            {
              targetText: 'Could I please have a black coffee and a warm croissant?',
              ipaTranscription: 'kʊd aɪ pliːz hæv ə blæk ˈkɔfi ænd ə wɔrm krwɑːˈsɑːnt?',
              grammarFocus: 'Polite Requests (Could / Would)',
              level: CefrLevel.BEGINNER,
            },
            {
              targetText: 'Excuse me, how much does this pair of headphones cost?',
              ipaTranscription: 'ɪkˈskjuːz miː, haʊ mʌtʃ dʌz ðɪs pɛr ʌv ˈhɛdˌfoʊnz kɔst?',
              grammarFocus: 'Inquiries & Pricing',
              level: CefrLevel.BEGINNER,
            },
          ],
        },
      ],
    },
    {
      title: 'Travel, Airports & Socializing',
      slug: 'travel-airports-socializing',
      description: 'Navigate flights, hotels, taxi bookings, and casual conversations while abroad.',
      level: CefrLevel.ELEMENTARY,
      topic: 'Travel',
      orderIndex: 2,
      isPublished: true,
      lessons: [
        {
          title: 'Airport Check-in & Security',
          orderIndex: 1,
          estimatedMinutes: 10,
          sentences: [
            {
              targetText: 'I would like an aisle seat near the front of the airplane if possible.',
              ipaTranscription: 'aɪ wʊd laɪk ən aɪl siːt nɪr ðə frʌnt ʌv ði ˈɛrˌpleɪn ɪf ˈpɑːsəbl.',
              grammarFocus: 'Conditional & Preferences',
              level: CefrLevel.ELEMENTARY,
            },
            {
              targetText: 'Which gate is flight forty-two departing from this afternoon?',
              ipaTranscription: 'wɪtʃ ɡeɪt ɪz flaɪt ˈfɔrti tuː dɪˈpɑrtɪŋ frʌm ðɪs ˌæftərˈnuːn?',
              grammarFocus: 'Present Continuous for Scheduled Events',
              level: CefrLevel.ELEMENTARY,
            },
          ],
        },
      ],
    },
    {
      title: 'Professional Workplace & Agile Communication',
      slug: 'professional-workplace-agile-communication',
      description: 'Speak with authority in daily agile standups, sprint reviews, and cross-functional meetings.',
      level: CefrLevel.INTERMEDIATE,
      topic: 'Workplace',
      orderIndex: 3,
      isPublished: true,
      lessons: [
        {
          title: 'Delivering Agile Standup Updates',
          orderIndex: 1,
          estimatedMinutes: 12,
          sentences: [
            {
              targetText: 'Yesterday I finished implementing the authentication endpoints and wrote unit tests.',
              ipaTranscription: 'ˈjɛstərˌdeɪ aɪ ˈfɪnɪʃt ˈɪmpləmɛntɪŋ ði ɔːˌθɛntɪˈkeɪʃən ˈɛndˌpɔɪnts ænd roʊt ˈjuːnɪt tɛsts.',
              grammarFocus: 'Past Simple & Irregular Verbs',
              level: CefrLevel.INTERMEDIATE,
            },
            {
              targetText: 'Today I am working on the audio upload pipeline, and I am currently unblocked.',
              ipaTranscription: 'təˈdeɪ aɪ æm ˈwɜrkɪŋ ɑn ði ˈɔdiˌoʊ ˈʌpˌloʊd ˈpaɪpˌlaɪn, ænd aɪ æm ˈkɜrəntli ʌnˈblɑːkt.',
              grammarFocus: 'Present Continuous & Workplace Collocations',
              level: CefrLevel.INTERMEDIATE,
            },
            {
              targetText: 'I usually go for a walk in the evening because it helps me relax.',
              ipaTranscription: 'aɪ ˈjuːʒuəli ɡoʊ fɔr ə wɔk ɪn ði ˈiːvnɪŋ bɪˈkɔz ɪt hɛlps miː rɪˈlæks.',
              grammarFocus: 'Third Person Singular & Compound Clauses',
              level: CefrLevel.INTERMEDIATE,
            },
          ],
        },
      ],
    },
    {
      title: 'Technical Presentations & System Architecture',
      slug: 'technical-presentations-system-architecture',
      description: 'Articulate complex engineering tradeoffs, distributed system diagrams, and interview questions.',
      level: CefrLevel.UPPER_INTERMEDIATE,
      topic: 'Engineering',
      orderIndex: 4,
      isPublished: true,
      lessons: [
        {
          title: 'Explaining Architectural Decisions',
          orderIndex: 1,
          estimatedMinutes: 15,
          sentences: [
            {
              targetText: 'We chose a modular monolith to avoid distributed network latency while retaining strict module boundaries.',
              ipaTranscription: 'wiː tʃoʊz ə ˈmɑːdʒələr ˈmɑːnəlɪθ tuː əˈvɔɪd dɪˈstrɪbjutɪd ˈnɛtˌwɜrk ˈleɪtənsi...',
              grammarFocus: 'Infinitives of Purpose & Complex Technical Reasoning',
              level: CefrLevel.UPPER_INTERMEDIATE,
            },
          ],
        },
      ],
    },
    {
      title: 'Executive Persuasion & Strategic Debates',
      slug: 'executive-persuasion-strategic-debates',
      description: 'Master high-stakes stakeholder negotiations, diplomatic disagreements, and keynote delivery.',
      level: CefrLevel.ADVANCED,
      topic: 'Leadership',
      orderIndex: 5,
      isPublished: true,
      lessons: [
        {
          title: 'Diplomatic Disagreements in Executive Meetings',
          orderIndex: 1,
          estimatedMinutes: 15,
          sentences: [
            {
              targetText: 'While I acknowledge your perspective regarding timelines, compromising on security guarantees would jeopardize our compliance posture.',
              ipaTranscription: 'waɪl aɪ ækˈnɑːlɪdʒ jɔr pərˈspɛktɪv rɪˈɡɑrdɪŋ ˈtaɪmˌlaɪnz...',
              grammarFocus: 'Concessive Clauses & Diplomatic Phrasing',
              level: CefrLevel.ADVANCED,
            },
          ],
        },
      ],
    },
  ];

  for (const cData of coursesData) {
    const { lessons, ...courseInfo } = cData;

    const course = await prisma.course.upsert({
      where: { slug: courseInfo.slug },
      update: courseInfo,
      create: courseInfo,
    });

    for (const lData of lessons) {
      const { sentences, ...lessonInfo } = lData;

      const lesson = await prisma.lesson.create({
        data: {
          ...lessonInfo,
          courseId: course.id,
          isPublished: true,
        },
      });

      for (let i = 0; i < sentences.length; i++) {
        const sData = sentences[i];
        await prisma.sentence.create({
          data: {
            ...sData,
            lessonId: lesson.id,
            orderIndex: i + 1,
          },
        });
      }
    }
  }

  console.log('Curriculum successfully seeded with courses, lessons, and practice sentences!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

