import {
  IconBrandWhatsapp,
  IconFileInvoice,
  IconPhoneCall,
} from '@tabler/icons-react'
import { FlaskConicalIcon, HomeIcon, PipetteIcon, ShieldCheckIcon, StarIcon, UsersIcon } from 'lucide-react'

export const navLinks = [
  {
    id: crypto.randomUUID(),
    label: 'Home',
    href: '/',
  },
  {
    id: crypto.randomUUID(),
    label: 'Tests',
    href: '/tests',
  },
  {
    id: crypto.randomUUID(),
    label: 'Packages',
    href: '/packages',
  },
  {
    id: crypto.randomUUID(),
    label: 'Blogs',
    href: '/blogs',
  },
  {
    id: crypto.randomUUID(),
    label: 'Contact Us',
    href: '/contact-us',
  },
]

export const packagesLink = [
  {
    id: crypto.randomUUID(),
    label: 'Silver',
    href: '/packages/silver',
  },
  {
    id: crypto.randomUUID(),
    label: 'Gold',
    href: '/packages/gold',
  },
  {
    id: crypto.randomUUID(),
    label: 'Diamond',
    href: '/packages/diamond',
  },
  {
    id: crypto.randomUUID(),
    label: 'Platinum',
    href: '/packages/platinum',
  },
  {
    id: crypto.randomUUID(),
    label: 'Signature',
    href: '/packages/signature',
  },
]

export const miniPackagesLink = [
  {
    id: crypto.randomUUID(),
    label: 'Renal Pack',
    href: '/packages/mini-packages/renal-pack',
  },
  {
    id: crypto.randomUUID(),
    label: 'Liver Pack',
    href: '/packages/mini-packages/liver-pack',
  },
  {
    id: crypto.randomUUID(),
    label: 'Bone Pack',
    href: '/packages/mini-packages/bone-pack',
  },
  {
    id: crypto.randomUUID(),
    label: 'Gut Pack',
    href: '/packages/mini-packages/gut-pack',
  },
  {
    id: crypto.randomUUID(),
    label: 'Fever Pack',
    href: '/packages/mini-packages/fever-pack',
  },
  {
    id: crypto.randomUUID(),
    label: 'Obesity Pack',
    href: '/packages/mini-packages/obesity-pack',
  },
  {
    id: crypto.randomUUID(),
    label: 'Diabetic Pack',
    href: '/packages/mini-packages/diabetic-pack',
  },
  {
    id: crypto.randomUUID(),
    label: 'Hypertension Pack',
    href: '/packages/mini-packages/hypertension-pack',
  },
  {
    id: crypto.randomUUID(),
    label: 'Cardiac Pack',
    href: '/packages/mini-packages/cardiac-pack',
  },
]

export const packageIcons = [
  '/packages/1.svg',
  '/packages/2.svg',
  '/packages/3.svg',
  '/packages/4.svg',
  '/packages/5.svg',
  '/packages/6.svg',
  '/packages/7.svg',
  '/packages/8.svg',
  '/packages/9.svg',
  '/packages/10.svg',
  '/packages/11.svg',
  '/packages/12.svg',
  '/packages/13.svg',
  '/packages/14.svg',
]

export const featureItems = [
  {
    id: crypto.randomUUID(),
    title: 'Talk to an Expert',
    desc: 'Need guidance before booking? Our healthcare team is here to help.',
    icon: (
      <IconPhoneCall className={'size-8 fill-orange-600 stroke-orange-200'} />
    ),
    bgColor: 'bg-destructive/30',
    href: 'tel:+918277842200',
  },
  {
    id: crypto.randomUUID(),
    title: 'Whatsapp Support',
    desc: 'Chat with our support team for quick assistance.',
    icon: (
      <IconBrandWhatsapp className={'size-8 fill-green-400 stroke-green-50'} />
    ),
    bgColor: 'bg-green-500/30',
    href: 'https://wa.link/fvmq1j',
  },
  {
    id: crypto.randomUUID(),
    title: 'Upload Prescription',
    desc: "Upload your doctor's prescription and we'll recommend the right tests.",
    icon: <IconFileInvoice className={'size-8 fill-blue-700 stroke-blue-50'} />,
    bgColor: 'bg-blue-500/20',
    href: '/profile',
  },
]

export const heroStats = [
  {
    id: crypto.randomUUID(),
    stat: '10,000+',
    description: 'Samples Collected',
    icon: <UsersIcon className={'stroke-red-500'} />,
    bgColor: 'bg-red-500/10',
  },
  {
    id: crypto.randomUUID(),
    stat: '4.9/5',
    description: 'Customer Rating',
    icon: <StarIcon className={'stroke-amber-400 fill-amber-400'} />,
    bgColor: 'bg-amber-400/10',
  },
  {
    id: crypto.randomUUID(),
    stat: 'Free',
    description: 'Home Collection',
    icon: <HomeIcon className={'stroke-purple-600'} />,
    bgColor: 'bg-purple-600/10',
  },
  {
    id: crypto.randomUUID(),
    stat: 'NABL',
    description: 'Accredited Labs',
    icon: <ShieldCheckIcon className={'stroke-green-600'} />,
    bgColor: 'bg-green-600/10',
  },
]

// export const healthPackages = [
//   {
//     id: crypto.randomUUID(),
//     planName: 'silver',
//     features: ['61+ tests included', 'Essential Check', 'Report in 24 hrs'],
//     originalPrice: '1599',
//     discountedPrice: '1199',
//     isPopular: false,
//   },
//   {
//     id: crypto.randomUUID(),
//     planName: 'gold',
//     features: ['79+ Tests Included', 'Advanced Profilling', 'Report in 24 hrs'],
//     originalPrice: '3299',
//     discountedPrice: '2499',
//     isPopular: false,
//   },
//   {
//     id: crypto.randomUUID(),
//     planName: 'diamond',
//     features: ['90+ Tests Included', 'Executive Screen', 'Report in 24 hrs'],
//     originalPrice: '3999',
//     discountedPrice: '2999',
//     isPopular: true,
//   },
//   {
//     id: crypto.randomUUID(),
//     planName: 'platinum',
//     features: ['110+ Tests Included', 'Full Body Master', 'Report in 24 hrs'],
//     originalPrice: '4599',
//     discountedPrice: '3499',
//     isPopular: false,
//   },
//   {
//     id: crypto.randomUUID(),
//     planName: 'signature',
//     features: ['130+ Tests Included', 'Elite Wellness', 'Report in 24 hrs'],
//     originalPrice: '5299',
//     discountedPrice: '3999',
//     isPopular: false,
//   },
// ]

export const healthCategories = [
  {
    id: crypto.randomUUID(),
    title: 'heart',
    img: '/health-category/1.png',
    href: '#',
  },
  {
    id: crypto.randomUUID(),
    title: 'liver',
    img: '/health-category/2.png',
    href: '#',
  },
  {
    id: crypto.randomUUID(),
    title: 'kidneys',
    img: '/health-category/3.png',
    href: '#',
  },
  {
    id: crypto.randomUUID(),
    title: 'bone health',
    img: '/health-category/4.png',
    href: '#',
  },
  {
    id: crypto.randomUUID(),
    title: 'hypertension',
    img: '/health-category/5.png',
    href: '#',
  },
  {
    id: crypto.randomUUID(),
    title: 'diabetes',
    img: '/health-category/6.png',
    href: '#',
  },
  {
    id: crypto.randomUUID(),
    title: 'gut health',
    img: '/health-category/7.png',
    href: '#',
  },
  {
    id: crypto.randomUUID(),
    title: 'no name',
    img: '/health-category/8.png',
    href: '#',
  },
  {
    id: crypto.randomUUID(),
    title: 'no name',
    img: '/health-category/9.png',
    href: '#',
  },
]

// export const individualCategories = [
//   {
//     id: crypto.randomUUID(),
//     title: 'Complete Blood Count',
//     desc: '24 parameters',
//     originalPrice: '399',
//     discountedPrice: '299',
//   },
//   {
//     id: crypto.randomUUID(),
//     title: 'Throid Profile (T3, T4, TSH)',
//     desc: '3 parameters',
//     originalPrice: '799',
//     discountedPrice: '599',
//   },
//   {
//     id: crypto.randomUUID(),
//     title: 'HbA1c - Diabetes Check',
//     desc: '1 parameter',
//     originalPrice: '499',
//     discountedPrice: '399',
//   },
//   {
//     id: crypto.randomUUID(),
//     title: 'Vitamin D Total',
//     desc: '1 parameter',
//     originalPrice: '999',
//     discountedPrice: '699',
//   },
//   {
//     id: crypto.randomUUID(),
//     title: 'Lipid Profile',
//     desc: '9 parameters',
//     originalPrice: '599',
//     discountedPrice: '499',
//   },
// ]

export const bookingSteps = [
  {
    id: crypto.randomUUID(),
    title: 'Choose a Test',
    desc: 'Search from a wide range of diagnostic tests health packages.',
    icon: '/steps/step-1.png',
  },
  {
    id: crypto.randomUUID(),
    title: 'Schedule Your Appointment',
    desc: 'Select your preferred date and time for sample collection.',
    icon: '/steps/step-2.png',
  },
  {
    id: crypto.randomUUID(),
    title: 'Sample Collection & Digital Reports',
    desc: 'Our trained professionals collect samples at your doorstep and reports are delivered online.',
    icon: '/steps/step-3.png',
  },
]

export const whyChooseReasons = [
  {
    id: crypto.randomUUID(),
    text: 'NABL & ICMR accredited partner labs',
  },
  {
    id: crypto.randomUUID(),
    text: 'Free home sample collection, zero hidden fees',
  },
  {
    id: crypto.randomUUID(),
    text: 'Reports in 12-24 hours via Whatsapp & email',
  },
  {
    id: crypto.randomUUID(),
    text: 'Expert phlebotomists, safe & hygienic process',
  },
]

export const testimonies = [
  {
    id: crypto.randomUUID(),
    rating: 5,
    msg: 'The phlebotomist arrived exactly on time. Reports were Whatsapped in under 12 hours. Absolutely seamless experience!',
    author: {
      name: 'Priya S.',
      location: 'Bangalore',
      avatar: '/testimonials/1.jpg',
    },
  },
  {
    id: crypto.randomUUID(),
    rating: 5,
    msg: 'Booked the Gold package for my parents. Entire process was smooth, professional and the staff was very courteous.',
    author: {
      name: 'Rajesh M.',
      location: 'Bangalore',
      avatar: '/testimonials/2.jpg',
    },
  },
  {
    id: crypto.randomUUID(),
    rating: 5,
    msg: 'Best diagnostic service. NABL certified, accurate results, and truly free home collection, Will use again!',
    author: {
      name: 'Anita K.',
      location: 'Bangalore',
      avatar: '/testimonials/3.jpg',
    },
  },
  {
    id: crypto.randomUUID(),
    rating: 5,
    msg: 'Highly recommended for accurate diagnostic and grest customer support.',
    author: {
      name: 'Amit K.',
      location: 'Bangalore',
      avatar: '/testimonials/4.jpg',
    },
  },
  // {
  //   id: crypto.randomUUID(),
  //   rating: 5,
  //   msg: 'The phlebotomist arrived exactly on time. Reports were Whatsapped in under 12 hours. Absolutely seamless experience!',
  //   author: {
  //     name: 'Priya S.',
  //     location: 'Bangalore',
  //     avatar: '/testimonials/1.jpg',
  //   },
  // },
  // {
  //   id: crypto.randomUUID(),
  //   rating: 5,
  //   msg: 'Booked the Gold package for my parents. Entire process was smooth, professional and the staff was very courteous.',
  //   author: {
  //     name: 'Rajesh M.',
  //     location: 'Bangalore',
  //     avatar: '/testimonials/2.jpg',
  //   },
  // },
  // {
  //   id: crypto.randomUUID(),
  //   rating: 5,
  //   msg: 'Best diagnostic service. NABL certified, accurate results, and truly free home collection, Will use again!',
  //   author: {
  //     name: 'Anita K.',
  //     location: 'Bangalore',
  //     avatar: '/testimonials/3.jpg',
  //   },
  // },
  // {
  //   id: crypto.randomUUID(),
  //   rating: 5,
  //   msg: 'Highly recommended for accurate diagnostic and grest customer support.',
  //   author: {
  //     name: 'Amit K.',
  //     location: 'Bangalore',
  //     avatar: '/testimonials/4.jpg',
  //   },
  // },
  // {
  //   id: crypto.randomUUID(),
  //   rating: 5,
  //   msg: 'The phlebotomist arrived exactly on time. Reports were Whatsapped in under 12 hours. Absolutely seamless experience!',
  //   author: {
  //     name: 'Priya S.',
  //     location: 'Bangalore',
  //     avatar: '/testimonials/1.jpg',
  //   },
  // },
  // {
  //   id: crypto.randomUUID(),
  //   rating: 5,
  //   msg: 'Booked the Gold package for my parents. Entire process was smooth, professional and the staff was very courteous.',
  //   author: {
  //     name: 'Rajesh M.',
  //     location: 'Bangalore',
  //     avatar: '/testimonials/2.jpg',
  //   },
  // },
  // {
  //   id: crypto.randomUUID(),
  //   rating: 5,
  //   msg: 'Best diagnostic service. NABL certified, accurate results, and truly free home collection, Will use again!',
  //   author: {
  //     name: 'Anita K.',
  //     location: 'Bangalore',
  //     avatar: '/testimonials/3.jpg',
  //   },
  // },
  // {
  //   id: crypto.randomUUID(),
  //   rating: 5,
  //   msg: 'Highly recommended for accurate diagnostic and grest customer support.',
  //   author: {
  //     name: 'Amit K.',
  //     location: 'Bangalore',
  //     avatar: '/testimonials/4.jpg',
  //   },
  // },
]

export const howItWorks = [
  {
    id: crypto.randomUUID(),
    title: 'book online',
    desc: 'Book via Whatsapp or our Website in under 2 minutes.',
    cover: '/how-it-works/1.png',
    coverColor: 'bg-custom-1',
    stepName: 'book',
  },
  {
    id: crypto.randomUUID(),
    title: 'free home collection',
    desc: 'A certified phiebotomist visits your doorstep, hygienic and on time.',
    cover: '/how-it-works/2.png',
    coverColor: 'bg-custom-2',
    stepName: 'collect',
  },
  {
    id: crypto.randomUUID(),
    title: 'advanced lab analysis',
    desc: 'your sample is analysed using advanced technology and strict quality checks.',
    cover: '/how-it-works/3.png',
    coverColor: 'bg-custom-3',
    stepName: 'analyze',
  },
  {
    id: crypto.randomUUID(),
    title: 'get reports in 24 hrs',
    desc: 'NABL certified results delivered directly to your phone and email.',
    cover: '/how-it-works/4.png',
    coverColor: 'bg-custom-4',
    stepName: 'report',
  },
]

export const faqs = [
  {
    id: crypto.randomUUID(),
    question: 'Is fasting required?',
    answer: 'Fasting is required only for certain blood tests,',
    listItems: [
      'Fasting Blood Sugar (FBS) – 8–12 hours fasting',
      'Lipid Profile (Cholesterol & Triglycerides) – 9–12 hours fasting (especially for triglycerides)',
      'Oral Glucose Tolerance Test (OGTT/GTT) – Overnight fasting (8–12 hours)',
      'Glucose Challenge Tests (as instructed by your doctor)',
      'Fasting Insulin – 8–12 hours fasting',
      'C-Peptide (Fasting) – If specifically requested',
      'Iron Studies (Serum Iron) – Overnight fasting is preferred, with morning sample collection',
      'Vitamin B12 (optional)',
      'Homocysteine – 8–12 hours fasting is preferred',
      'Thyroid function tests',
    ],
    ctaText:
      'When you book your test, our team will inform you in advance if fasting is necessary and provide any preparation instructions.',
  },
  {
    id: crypto.randomUUID(),
    question: 'Is home collection really free?',
    answer:
      'Yes! BloodPanda offers FREE home sample collection in our service areas with no hidden charges. Our trained professionals collect samples safely and hygienically at your doorstep, saving you time and eliminating the need to visit a diagnostic center.',
    listItems: undefined,
    ctaText: undefined,
  },
  {
    id: crypto.randomUUID(),
    question: 'How long does it take to receive reports?',
    answer:
      'Most routine test reports are available within 6–24 hours. Some specialized tests may require 2–7 working days, depending on the investigation. Reports are securely delivered via WhatsApp or email, making them easy to access anytime.',
    listItems: undefined,
    ctaText: undefined,
  },
  {
    id: crypto.randomUUID(),
    question: 'Which areas do you serve?',
    answer:
      'We currently provide home sample collection across Bengaluru. If you’re unsure whether your location is covered, simply contact us—we’ll be happy to assist.',
    listItems: undefined,
    ctaText: undefined,
  },
]

export const GenderEnums = ['MALE', 'FEMALE', 'OTHER'] as const

export const AddressTypeEnums = ['HOME', 'OTHER'] as const

export const PaymentMethodEnums = ['ONLINE_PAYMENT', 'COD'] as const
