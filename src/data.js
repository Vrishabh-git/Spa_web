import heroImage from './assets/lotus-ayurveda-hero.png'

export const navItems = [
  ['Home', '/'],
  ['Therapies', '/therapies'],
  ['Dosha Quiz', '/dosha-quiz'],
  ['Book', '/book'],
  ['Journal', '/journal'],
  ['Contact', '/contact'],
]

export const therapies = [
  {
    id: 'abhyanga',
    name: 'Abhyanga',
    category: 'Oil therapies',
    tone: 'Grounding',
    duration: 75,
    price: 3800,
    featured: true,
    popular: true,
    doshas: ['Vata', 'Kapha'],
    image: heroImage,
    short: 'Traditional full-body warm oil massage with slow rhythmic strokes.',
    description:
      'A deeply nourishing Ayurvedic-inspired oil ritual designed for guests seeking warmth, softness, and a calmer rhythm.',
    preparation: 'Arrive hydrated and avoid a heavy meal for two hours before your appointment.',
    aftercare: 'Allow time after the session, drink warm water, and keep the evening unhurried.',
    benefits: ['Restful mood', 'Warmth', 'Gentle mobility'],
    related: ['shirodhara', 'padabhyanga', 'steam'],
  },
  {
    id: 'shirodhara',
    name: 'Shirodhara',
    category: 'Mind rituals',
    tone: 'Cooling',
    duration: 60,
    price: 4200,
    featured: true,
    popular: true,
    doshas: ['Vata', 'Pitta'],
    image: heroImage,
    short: 'A steady stream of warm oil over the forehead for a meditative pause.',
    description:
      'A quiet, sensory-softening ritual for guests who want to step away from mental noise and settle into stillness.',
    preparation: 'Come with clean, dry hair and plan for oil to remain in the hair after the session.',
    aftercare: 'Avoid rushing back into screens or loud environments immediately after the ritual.',
    benefits: ['Quiet focus', 'Sensory ease', 'Unhurried rest'],
    related: ['abhyanga', 'padabhyanga', 'potli'],
  },
  {
    id: 'potli',
    name: 'Potli Massage',
    category: 'Herbal warmth',
    tone: 'Restorative',
    duration: 80,
    price: 4500,
    featured: false,
    popular: true,
    doshas: ['Kapha', 'Vata'],
    image: heroImage,
    short: 'Warm herbal pouches pressed and glided across the body.',
    description:
      'Textured herbal compresses bring fragrant warmth and steady pressure to areas that feel heavy or tired.',
    preparation: 'Share heat sensitivity or pressure preferences before the ritual begins.',
    aftercare: 'Choose light meals and gentle movement after the treatment.',
    benefits: ['Herbal warmth', 'Muscle comfort', 'Grounded energy'],
    related: ['steam', 'udwarthanam', 'abhyanga'],
  },
  {
    id: 'udwarthanam',
    name: 'Udwarthanam',
    category: 'Energizing bodywork',
    tone: 'Energizing',
    duration: 50,
    price: 3200,
    featured: true,
    popular: false,
    doshas: ['Kapha'],
    image: heroImage,
    short: 'A brisk herbal powder massage with an enlivening dry finish.',
    description:
      'A more active ritual using upward strokes and herbal powders for guests seeking lightness and polish.',
    preparation: 'Avoid applying lotion before arriving so the powder texture can work cleanly.',
    aftercare: 'Rinse gently and moisturize if your skin feels dry.',
    benefits: ['Skin polish', 'Lightness', 'Invigoration'],
    related: ['steam', 'potli', 'padabhyanga'],
  },
  {
    id: 'padabhyanga',
    name: 'Padabhyanga',
    category: 'Focused rituals',
    tone: 'Soothing',
    duration: 45,
    price: 2400,
    featured: false,
    popular: true,
    doshas: ['Vata', 'Pitta'],
    image: heroImage,
    short: 'Foot and lower-leg oil massage with warm towels and attentive pressure.',
    description:
      'A shorter grounding ritual for tired feet, long travel days, or guests who want a focused treatment.',
    preparation: 'Wear comfortable footwear and share pressure preferences with your therapist.',
    aftercare: 'Walk slowly after the treatment and stay warm for the next hour.',
    benefits: ['Grounding', 'Foot comfort', 'Gentle decompression'],
    related: ['abhyanga', 'shirodhara', 'steam'],
  },
  {
    id: 'steam',
    name: 'Herbal Steam Therapy',
    category: 'Steam and aroma',
    tone: 'Clarifying',
    duration: 35,
    price: 1900,
    featured: false,
    popular: false,
    doshas: ['Kapha', 'Vata'],
    image: heroImage,
    short: 'Aromatic herbal steam with tulsi, lemongrass, and eucalyptus notes.',
    description:
      'A simple warm steam ritual that pairs well with oil massage or powder-based bodywork.',
    preparation: 'Avoid this ritual if you are heat-sensitive; share comfort needs before beginning.',
    aftercare: 'Cool down gradually and drink water after the session.',
    benefits: ['Aromatic clarity', 'Warmth', 'Easy reset'],
    related: ['potli', 'udwarthanam', 'abhyanga'],
  },
]

export const quizQuestions = [
  {
    prompt: 'When your day feels out of balance, what appears first?',
    choices: [
      { label: 'Restless thoughts and shifting energy', dosha: 'Vata' },
      { label: 'Irritation, intensity, or heat', dosha: 'Pitta' },
      { label: 'Heaviness, fogginess, or low momentum', dosha: 'Kapha' },
    ],
  },
  {
    prompt: 'Which pace feels most natural to you?',
    choices: [
      { label: 'Fast, spontaneous, and varied', dosha: 'Vata' },
      { label: 'Focused, structured, and purposeful', dosha: 'Pitta' },
      { label: 'Steady, measured, and unhurried', dosha: 'Kapha' },
    ],
  },
  {
    prompt: 'Which treatment atmosphere would you choose today?',
    choices: [
      { label: 'Warm, cocoon-like, and quiet', dosha: 'Vata' },
      { label: 'Cooling, refined, and low-stimulation', dosha: 'Pitta' },
      { label: 'Bright, herbal, and energizing', dosha: 'Kapha' },
    ],
  },
  {
    prompt: 'Which season tends to affect you most?',
    choices: [
      { label: 'Dry wind and cold weather', dosha: 'Vata' },
      { label: 'Sharp heat and strong sunlight', dosha: 'Pitta' },
      { label: 'Damp mornings and cloudy heaviness', dosha: 'Kapha' },
    ],
  },
  {
    prompt: 'What does your body seem to ask for?',
    choices: [
      { label: 'Warmth and slow oil massage', dosha: 'Vata' },
      { label: 'A calm ritual that settles the head', dosha: 'Pitta' },
      { label: 'Movement, polish, and herbal heat', dosha: 'Kapha' },
    ],
  },
  {
    prompt: 'How do you prefer to recover after a demanding week?',
    choices: [
      { label: 'Protected rest and a quiet evening', dosha: 'Vata' },
      { label: 'Unplugged time with fewer decisions', dosha: 'Pitta' },
      { label: 'A refreshing reset that gets me moving', dosha: 'Kapha' },
    ],
  },
  {
    prompt: 'Which word feels closest to what you need?',
    choices: [
      { label: 'Grounding', dosha: 'Vata' },
      { label: 'Cooling', dosha: 'Pitta' },
      { label: 'Lightness', dosha: 'Kapha' },
    ],
  },
]

export const doshaResults = {
  Vata: {
    title: 'Vata-leaning rhythm',
    color: '#7c9364',
    description:
      'Your answers point toward a need for warmth, consistency, and sensory quiet. Slow oil-based rituals may feel especially supportive.',
  },
  Pitta: {
    title: 'Pitta-leaning rhythm',
    color: '#b66a41',
    description:
      'Your answers suggest that cooling, unhurried experiences may help soften intensity and create more spaciousness.',
  },
  Kapha: {
    title: 'Kapha-leaning rhythm',
    color: '#284d35',
    description:
      'Your answers lean toward lightness and movement. Herbal warmth, steam, and enlivening massage styles may suit your mood.',
  },
}

export const articles = [
  {
    id: 'warm-oil-rituals',
    title: 'Why Warm Oil Rituals Feel So Grounding',
    category: 'Rituals',
    readTime: '4 min read',
    excerpt: 'A calm look at how texture, warmth, rhythm, and scent shape a restorative spa experience.',
    body:
      'Warm oil rituals invite the body to slow down through repeated rhythm, comforting texture, and a sense of held attention. In an Ayurvedic-inspired setting, the ritual is less about rushing toward a result and more about creating the conditions for rest.',
  },
  {
    id: 'seasonal-reset',
    title: 'A Gentle Seasonal Reset for Busy Weeks',
    category: 'Wellbeing',
    readTime: '5 min read',
    excerpt: 'Simple ways to choose lighter, warmer, or quieter rituals as the season changes.',
    body:
      'Seasonal care begins with noticing what feels excessive. Dryness may ask for warmth, heat may ask for cooling quiet, and heaviness may ask for movement. A good spa visit supports that observation without turning it into a diagnosis.',
  },
  {
    id: 'choosing-treatment',
    title: 'How to Choose a Treatment Without Overthinking It',
    category: 'Guides',
    readTime: '3 min read',
    excerpt: 'Start from how you want to feel: grounded, cooled, clarified, or gently restored.',
    body:
      'A treatment menu becomes easier to navigate when you begin with mood and energy. Choose Abhyanga for warmth, Shirodhara for quiet, Udwarthanam for brightness, and Padabhyanga for a shorter grounding pause.',
  },
]

export const testimonials = [
  {
    quote:
      'The experience is written as a quiet, believable wellness story: attentive, warm, and never overpromised.',
    name: 'Editorial guest note',
  },
  {
    quote:
      'Every interaction feels considered, from therapy discovery to the final booking reference.',
    name: 'Experience review',
  },
]

export const practitioners = [
  ['Anika Rao', 'Wellness host', 'Guest intake, ritual pacing, and comfort preferences.'],
  ['Dev Mehta', 'Therapy specialist', 'Oil rituals, steam preparation, and aftercare guidance.'],
  ['Mira Sen', 'Spa coordinator', 'Booking support and treatment flow design.'],
]
