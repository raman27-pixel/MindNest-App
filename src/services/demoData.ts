import { 
  PatientProfile, 
  MemoryItem, 
  ActivitySession, 
  PersonalBaseline, 
  MeaningfulChangeAlert, 
  CaregiverReminder, 
  ConsentSettings, 
  AIActivityRecommendation, 
  AuditLog,
  FamilyMember,
  GoogleConnectionStatus,
  ImportedMediaCandidate,
  ActivityReport,
  SOSEvent,
  RegionalCulturalContext,
  CulturalSuggestion,
  RegionalMusicTrack,
  PlaceMemory,
  LifeJourneyStep,
  DailyTaskItem
} from '../types';

export const DEMO_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'fam-1',
    patientId: 'patient-asha-123',
    name: 'Rahul Borah',
    relationship: 'Son & Primary Caregiver',
    phoneNumber: '+91 98765 43210',
    email: 'rahul.borah@example.com',
    photoUrl: '/images/person_son_gaurav.jpg',
    priority: 1,
    isPrimaryCaregiver: true,
    isEmergencyContact: true,
    canReceiveAlerts: true,
    canReceiveReports: true,
    canContactPatient: true,
    notes: 'Lives in Guwahati, visits Nagaon weekly. Primary point of contact.',
    createdAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'fam-2',
    patientId: 'patient-asha-123',
    name: 'Sunita Borah',
    relationship: 'Daughter',
    phoneNumber: '+91 98111 22334',
    email: 'sunita.borah@example.com',
    photoUrl: '/images/person_daughter_sunita.jpg',
    priority: 2,
    isPrimaryCaregiver: false,
    isEmergencyContact: true,
    canReceiveAlerts: true,
    canReceiveReports: true,
    canContactPatient: true,
    notes: 'Calls daily at 6:30 PM for video check-in from Tezpur.',
    createdAt: '2026-01-16T09:00:00Z'
  },
  {
    id: 'fam-3',
    patientId: 'patient-asha-123',
    name: 'Dr. Ashok Barua',
    relationship: 'Geriatric Care Physician',
    phoneNumber: '+91 98222 33445',
    email: 'dr.barua@guwahaticlinic.org',
    photoUrl: '/images/person_doctor_ashok.jpg',
    priority: 3,
    isPrimaryCaregiver: false,
    isEmergencyContact: false,
    canReceiveAlerts: true,
    canReceiveReports: true,
    canContactPatient: false,
    notes: 'Reviews monthly activity reports and baseline changes.',
    createdAt: '2026-01-20T10:00:00Z'
  }
];

export const DEMO_PATIENT: PatientProfile = {
  id: 'patient-asha-123',
  name: 'Asha Devi',
  preferredName: 'Asha',
  age: 72,
  profilePhotoUrl: '/images/patient_anita.jpg',
  context: 'Asha was born in Nagaon, Assam. She loves Bihu celebrations, Assamese folk songs, tea garden walks, pitha preparation, and watching family photos from 1985.',
  abilities: [
    'Recognizes immediate family members and childhood photographs',
    'Follows simple 1-step visual prompts and responds warmly to Assamese tunes',
    'Responds well to voice prompts in Assamese and gentle reminders',
    'Enjoys tactile matching of familiar people and life milestones'
  ],
  limitations: [
    'Requires gentle visual reassurance with multiple choices',
    'Occasional hesitation when recalling dates or complex sequences',
    'Best supported with calm, unhurried 1-task-at-a-time interactions'
  ],
  communicationPreferences: 'Soft tone, concise single-sentence questions, warm encouragement, Assamese & simple English mix.',
  interests: ['Bihu Celebrations', 'Assamese Folk Music', 'Tea Gardening', 'Pitha & Traditional Cooking', 'Village Memories'],
  favoriteMusic: ['Bihu Song', 'Xopunor Xun', 'Rongali Bihu', 'Borgeet Melodies'],
  importantPeople: [
    { name: 'Rahul Borah', relation: 'Son & Caregiver', photoUrl: '/images/person_son_gaurav.jpg' },
    { name: 'Sunita Borah', relation: 'Daughter', photoUrl: '/images/person_daughter_sunita.jpg' },
    { name: 'Grandfather (Late Mukul)', relation: 'Father / Tea Planter', photoUrl: '/images/person_grandfather_mukul.jpg' }
  ],
  importantPlaces: ['Village Home, Nagaon', 'Guwahati Riverbank', 'Childhood School, Tezpur', 'Brahmaputra Valley'],
  routines: [
    { id: 'r1', time: '08:00 AM', title: 'Morning Assam Tea & Folk Music', category: 'WAKEUP', completedToday: true },
    { id: 'r2', time: '10:30 AM', title: 'Memory Lane Photo Reminiscence', category: 'ACTIVITY', completedToday: true },
    { id: 'r3', time: '01:00 PM', title: 'Traditional Lunch & Rest', category: 'MEAL', completedToday: true },
    { id: 'r4', time: '05:30 PM', title: 'Garden Walk & Tea', category: 'ACTIVITY', completedToday: false },
    { id: 'r5', time: '06:30 PM', title: 'Family Call with Sunita', category: 'FAMILY_CALL', completedToday: false },
    { id: 'r6', time: '09:00 PM', title: 'Restful Bedtime Routine', category: 'SLEEP', completedToday: false }
  ],
  accessibility: {
    textSize: 'NORMAL',
    contrast: 'NORMAL',
    voiceEnabled: true,
    speechSpeed: 0.85,
    language: 'as',
    caregiverLanguage: 'en',
    simplifiedMode: false,
    reducedMotion: false,
    voiceSettings: {
      patientLanguage: 'as',
      caregiverLanguage: 'en',
      voiceProfileId: 'female-in-warm-1',
      voiceGender: 'FEMALE',
      voiceStyle: 'warm',
      voiceAccent: 'Regional Indian',
      speechSpeed: 0.85,
      speechVolume: 1.0,
      autoReadEnabled: true,
      useElevenLabs: false
    }
  },
  preferredLanguage: 'as',
  emergencyNumber: '112',
  emergencyCustomMessage: 'Emergency alert for Asha Devi. Immediate family and local support notified.',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-02-15T10:42:00Z'
};
export const DEMO_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    patientId: 'patient-asha-123',
    title: 'Family (1985)',
    description: 'Black and white vintage photograph of the Borah family gathered in Nagaon during autumn 1985.',
    imageUrl: '/images/memory_vintage_album.jpg',
    people: ['Rahul Borah', 'Sunita Borah', 'Grandfather Mukul', 'Asha Devi'],
    relationship: 'Family & Children',
    place: 'Nagaon Courtyard, Assam',
    dateApproximation: 'October 1985',
    category: 'Family Photo',
    tags: ['family', '1985', 'vintage', 'children', 'assam'],
    associatedStory: 'Everyone gathered on the veranda after the harvest season. Little Rahul wore his first new shirt.',
    associatedMusic: 'Assamese Folk Melodies',
    approved: true,
    approvedForAI: true,
    approvalStatus: 'APPROVED',
    approvedBy: 'Rahul Borah',
    approvedAt: '2026-02-01T10:00:00.000Z',
    consentStatus: 'GRANTED',
    source: 'manual',
    createdBy: 'Rahul Borah',
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-02-01T10:00:00.000Z'
  },
  {
    id: 'mem-2',
    patientId: 'patient-asha-123',
    title: 'My Village',
    description: 'Traditional Assamese village house with tin roof and wooden stilts surrounded by emerald paddy fields and bamboo trees.',
    imageUrl: '/images/location_village_home.jpg',
    people: ['Asha Devi', 'Grandfather Mukul'],
    relationship: 'Childhood Home',
    place: 'Nagaon Village, Assam',
    dateApproximation: '1950s–1970s',
    category: 'Place',
    tags: ['village', 'home', 'childhood', 'paddy', 'northeast'],
    associatedStory: 'This was our village home where we used to sit on bamboo mats in the afternoon breeze.',
    associatedMusic: 'Mur Aai Asomi (Flute)',
    approved: true,
    approvedForAI: true,
    approvalStatus: 'APPROVED',
    approvedBy: 'Rahul Borah',
    approvedAt: '2026-02-05T12:00:00.000Z',
    consentStatus: 'GRANTED',
    source: 'manual',
    createdBy: 'Rahul Borah',
    createdAt: '2026-02-05T12:00:00.000Z',
    updatedAt: '2026-02-05T12:00:00.000Z'
  },
  {
    id: 'mem-3',
    patientId: 'patient-asha-123',
    title: 'Bihu Celebration',
    description: 'Joyful dancers in traditional red and golden muga silk mekhela sador celebrating Rongali Bihu under the spring trees.',
    imageUrl: '/images/festival_bihu.jpg',
    people: ['Village Friends', 'Young Asha'],
    relationship: 'Youth & Community',
    place: 'Village Ground, Nagaon',
    dateApproximation: 'Bohag 1972',
    category: 'Event',
    tags: ['bihu', 'celebration', 'dance', 'festival', 'muga'],
    associatedStory: 'Dhol, pepa horn, and gogona playing all night. Asha used to weave the gamosa gifts for her brothers.',
    associatedMusic: 'Bihu Song (Assamese Folk)',
    approved: true,
    approvedForAI: true,
    approvalStatus: 'APPROVED',
    approvedBy: 'Rahul Borah',
    approvedAt: '2026-02-10T14:00:00.000Z',
    consentStatus: 'GRANTED',
    source: 'manual',
    createdBy: 'Rahul Borah',
    createdAt: '2026-02-10T14:00:00.000Z',
    updatedAt: '2026-02-10T14:00:00.000Z'
  },
  {
    id: 'mem-4',
    patientId: 'patient-asha-123',
    title: 'Traditional Food',
    description: 'Assamese festival feast: freshly made til pitha, ghila pitha, doi-chira with jaggery, and warm tea.',
    imageUrl: '/images/food_traditional_thali.jpg',
    people: ['Grandmother', 'Asha Devi'],
    relationship: 'Family Culinary Heritage',
    place: 'Kitchen Hearth, Nagaon',
    dateApproximation: 'Magh Bihu 1968',
    category: 'Other',
    tags: ['food', 'pitha', 'tea', 'bihu', 'kitchen'],
    associatedStory: 'Grandmother always roasted the black sesame and poured molasses slowly over bamboo hollows.',
    associatedMusic: 'Acoustic Dotara Tunes',
    approved: true,
    approvedForAI: true,
    approvalStatus: 'APPROVED',
    approvedBy: 'Rahul Borah',
    approvedAt: '2026-02-15T15:00:00.000Z',
    consentStatus: 'GRANTED',
    source: 'manual',
    createdBy: 'Rahul Borah',
    createdAt: '2026-02-15T15:00:00.000Z',
    updatedAt: '2026-02-15T15:00:00.000Z'
  },
  {
    id: 'mem-5',
    patientId: 'patient-asha-123',
    title: 'Brahmaputra Sunset (Clip)',
    description: 'A 3-second gentle looping clip of calm river ripples and golden sunset breeze over the Brahmaputra.',
    imageUrl: '/images/location_riverbank.jpg',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    mediaType: 'video',
    people: ['Family'],
    relationship: 'Sacred River',
    place: 'Tezpur Ghat',
    dateApproximation: 'Summer Evenings',
    category: 'Family Video',
    tags: ['video', 'river', 'brahmaputra', 'sunset', 'water'],
    associatedStory: 'Whenever we went to Tezpur, we watched the ferry boats glide through the golden waters.',
    associatedMusic: 'Evening Flute Raga',
    approved: true,
    approvedForAI: true,
    approvalStatus: 'APPROVED',
    approvedBy: 'Rahul Borah',
    approvedAt: '2026-02-20T10:00:00.000Z',
    consentStatus: 'GRANTED',
    source: 'manual',
    createdBy: 'Rahul Borah',
    createdAt: '2026-02-20T10:00:00.000Z',
    updatedAt: '2026-02-20T10:00:00.000Z'
  },
  {
    id: 'mem-6',
    patientId: 'patient-asha-123',
    title: 'Bihu Dance Steps (Loop)',
    description: 'Short 2-second rhythm loop of rhythmic clapping and smiling dancers in muga silk under the spring sun.',
    imageUrl: '/images/clip_folk_dance.jpg',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    mediaType: 'video',
    people: ['Village Friends'],
    relationship: 'Celebration',
    place: 'Bohag Pandal',
    dateApproximation: 'Spring 1978',
    category: 'Family Video',
    tags: ['video', 'bihu', 'dance', 'rhythm'],
    associatedStory: 'Listen to the dhol beats! You loved showing the younger girls how to hold the red gamosa.',
    associatedMusic: 'Bihu Dhol Beats',
    approved: true,
    approvedForAI: true,
    approvalStatus: 'APPROVED',
    approvedBy: 'Rahul Borah',
    approvedAt: '2026-02-22T11:00:00.000Z',
    consentStatus: 'GRANTED',
    source: 'manual',
    createdBy: 'Rahul Borah',
    createdAt: '2026-02-22T11:00:00.000Z',
    updatedAt: '2026-02-22T11:00:00.000Z'
  }
];

// Multi-Region Cultural Presets for 5 Indian States
export interface StateCulturalPreset {
  state: string;
  regionalContext: RegionalCulturalContext;
  culturalSuggestions: CulturalSuggestion[];
  culturalFoods: { name: string; desc: string; image: string }[];
  culturalFestivals: { name: string; desc: string; month: string; image: string }[];
}

export const STATE_CULTURAL_PRESETS: Record<string, StateCulturalPreset> = {
  'Assam': {
    state: 'Assam',
    regionalContext: {
      state: 'Assam',
      region: 'Brahmaputra Valley, Upper Assam',
      preferredLanguage: 'Assamese',
      otherLanguages: ['Hindi', 'English', 'Bengali'],
      homeTown: 'Nagaon',
      familiarPlaces: ['Guwahati', 'Village Home', 'Tezpur Ghat', 'Kaziranga Edge'],
      familiarMusic: ['Assamese Folk Music', 'Bihu Songs', 'Borgeet', 'Goalparia Lokageet'],
      importantCelebrations: ['Rongali Bihu', 'Bhogali Bihu', 'Durga Puja', 'Kati Bihu'],
      familiarPeople: ['Son (Gaurav Borah)', 'Daughter (Sunita)', 'Grandmother Mukul'],
      childhoodMemories: [
        'Grandmother preparing til pitha over clay stove',
        'Listening to dhol and pepa on Bohag mornings',
        'Tea garden walks near Nagaon'
      ]
    },
    culturalSuggestions: [
      { id: 'cs-1', category: 'Festival', title: 'Bihu Celebration', description: 'Rongali and Bhogali Bihu spring & harvest traditions', approved: true },
      { id: 'cs-2', category: 'Music', title: 'Assamese Folk Music', description: 'Traditional Bihu songs, Pepa horn and Dhol rhythms', approved: true },
      { id: 'cs-3', category: 'Tradition', title: 'Traditional Dance', description: 'Graceful Bihu dance with muga silk mekhela sador', approved: false },
      { id: 'cs-4', category: 'Place', title: 'Tea Gardens', description: 'Lush green tea estates of Upper Assam and morning walks', approved: true },
      { id: 'cs-5', category: 'Food', title: 'Traditional Assamese Food', description: 'Pitha, doi-chira, masor tenga, and aromatic Assam tea', approved: true },
      { id: 'cs-6', category: 'Music', title: 'Borgeet & Lokageet', description: 'Devotional songs composed by Srimanta Sankardev', approved: false },
      { id: 'cs-7', category: 'Place', title: 'Brahmaputra River', description: 'Vast river sunset, ferry crossings, and riverbank picnics', approved: true }
    ],
    culturalFoods: [
      { name: 'Til & Ghila Pitha', desc: 'Crisp rice rolls filled with roasted sesame seeds and liquid jaggery.', image: '/images/food_pitha.jpg' },
      { name: 'Doi-Chira with Gur', desc: 'Beaten flat rice served with thick curd and golden sugarcane jaggery.', image: '/images/food_sweets_mithai.jpg' },
      { name: 'Masor Tenga', desc: 'Light, tangy freshwater fish curry brewed with sweet tomatoes and elephant apple.', image: '/images/food_traditional_thali.jpg' }
    ],
    culturalFestivals: [
      { name: 'Rongali Bihu', desc: 'Assamese New Year celebrated with folk dance, dhol, and new handwoven gamosas.', month: 'Mid-April', image: '/images/festival_bihu.jpg' },
      { name: 'Bhogali (Magh) Bihu', desc: 'Winter harvest festival with grand community bonfires (Meji) and feast feasts.', month: 'Mid-January', image: '/images/festival_lohri.jpg' }
    ]
  },
  'Punjab': {
    state: 'Punjab',
    regionalContext: {
      state: 'Punjab',
      region: 'Majha & Malwa Plains',
      preferredLanguage: 'Punjabi',
      otherLanguages: ['Hindi', 'English'],
      homeTown: 'Amritsar',
      familiarPlaces: ['Golden Temple', 'Ludhiana Fields', 'Village Haveli', 'Jallianwala Bagh'],
      familiarMusic: ['Punjabi Folk Tappe', 'Gurbani Kirtan', 'Bhangra Dhol', 'Heer Ranjha'],
      importantCelebrations: ['Baisakhi Harvest', 'Lohri Bonfire', 'Gurpurab', 'Teeyan'],
      familiarPeople: ['Son (Harpreet Singh)', 'Daughter-in-law (Simran)', 'Grandson (Kabir)'],
      childhoodMemories: [
        'Clay tandoor roasting warm rotis in the village courtyard',
        'Singing folk songs around the roaring Lohri bonfire with roasted rewri',
        'Morning walk listening to Gurbani echoes near the sarovar'
      ]
    },
    culturalSuggestions: [
      { id: 'cs-p1', category: 'Festival', title: 'Lohri Bonfire Night', description: 'Winter celebration with rewri, peanuts, and folk songs around fire', approved: true },
      { id: 'cs-p2', category: 'Music', title: 'Shabad Kirtan & Tappe', description: 'Peaceful acoustic hymns and joyful village folk verses', approved: true },
      { id: 'cs-p3', category: 'Place', title: 'Golden Temple Sarovar', description: 'Serene sacred pool at Amritsar surrounded by white marble', approved: true },
      { id: 'cs-p4', category: 'Food', title: 'Sarson Ka Saag & Makki Roti', description: 'Mustard greens simmered with white butter and fresh corn rotis', approved: true },
      { id: 'cs-p5', category: 'Tradition', title: 'Phulkari Hand Embroidery', description: 'Vibrant geometric floral needlework woven on khaddar', approved: true }
    ],
    culturalFoods: [
      { name: 'Makki di Roti & Sarson Saag', desc: 'Tender mustard greens with generous dollops of homemade white butter and jaggery.', image: '/images/food_sarson_saag.jpg' },
      { name: 'Amritsari Kulcha & Chhole', desc: 'Crisp layered tandoor bread stuffed with spiced potatoes and tangy chickpeas.', image: '/images/food_chai_samosa.jpg' },
      { name: 'Creamy Sweet Lassi', desc: 'Thick churned yogurt drink topped with clotted malai and saffron strands.', image: '/images/food_sweets_mithai.jpg' }
    ],
    culturalFestivals: [
      { name: 'Baisakhi Harvest', desc: 'Golden wheat harvest celebration with vibrant Bhangra and thanksgiving prayers.', month: 'Mid-April', image: '/images/festival_holi.jpg' },
      { name: 'Lohri', desc: 'Festive winter solstice gathering throwing sesame seeds, popcorn, and rewri into the fire.', month: 'January 13', image: '/images/festival_lohri.jpg' }
    ]
  },
  'West Bengal': {
    state: 'West Bengal',
    regionalContext: {
      state: 'West Bengal',
      region: 'Gangetic Bengal & Shantiniketan',
      preferredLanguage: 'Bengali',
      otherLanguages: ['Hindi', 'English'],
      homeTown: 'Kolkata',
      familiarPlaces: ['Dakshineswar Temple', 'Victoria Memorial', 'Shantiniketan', 'Howrah Ghat'],
      familiarMusic: ['Rabindra Sangeet', 'Baul Folk with Ektara', 'Nazrul Geeti', 'Bhatiyali'],
      importantCelebrations: ['Durga Puja', 'Poila Baisakh (Noboborsho)', 'Saraswati Puja', 'Rabindra Jayanti'],
      familiarPeople: ['Son (Anirban Sen)', 'Granddaughter (Rhea)', 'Brother (Subhash)'],
      childhoodMemories: [
        'Dhak drum rhythms echoing through neighborhood pandals during Durga Puja',
        'Grandfather reciting Tagore poems on the balcony overlooking the rain',
        'Buying fresh warm Sandesh from the corner sweet shop on Sundays'
      ]
    },
    culturalSuggestions: [
      { id: 'cs-wb1', category: 'Festival', title: 'Durga Puja Sharodotsav', description: 'Autumn celebration with dhak beats, fragrant shiuli flowers, and family pandal visits', approved: true },
      { id: 'cs-wb2', category: 'Music', title: 'Rabindra Sangeet', description: 'Gentle, melodious songs of Tagore evoking monsoon and nostalgia', approved: true },
      { id: 'cs-wb3', category: 'Place', title: 'Dakshineswar Riverbank', description: 'Serene temple ghat on the Hooghly river where the afternoon breeze blows', approved: true },
      { id: 'cs-wb4', category: 'Food', title: 'Rosogolla & Mishti Doi', description: 'Spongy cottage cheese balls soaked in warm syrup and baked sweet yogurt', approved: true }
    ],
    culturalFoods: [
      { name: 'Mishti Doi & Sandesh', desc: 'Silky caramelized sweet curd served in earthen pots alongside pistachio sandesh.', image: '/images/food_sweets_mithai.jpg' },
      { name: 'Luchi & Chholar Dal', desc: 'Puffy deep-fried golden flatbread served with fragrant Bengal gram dal and coconut.', image: '/images/food_traditional_thali.jpg' },
      { name: 'Shorshe Ilish / Freshwater Fish', desc: 'Tender fish simmered delicately in stone-ground mustard paste and green chillies.', image: '/images/food_chai_samosa.jpg' }
    ],
    culturalFestivals: [
      { name: 'Durga Puja', desc: 'The most beloved autumn carnival with community art, sound of dhak, and sindoor khela.', month: 'October', image: '/images/festival_durga_puja.jpg' },
      { name: 'Poila Baisakh', desc: 'Bengali New Year celebrated with fresh white-and-red sarees and traditional sweets.', month: 'April 15', image: '/images/festival_bihu.jpg' }
    ]
  },
  'Kerala': {
    state: 'Kerala',
    regionalContext: {
      state: 'Kerala',
      region: 'Malabar & Travancore Coast',
      preferredLanguage: 'Malayalam',
      otherLanguages: ['English', 'Tamil', 'Hindi'],
      homeTown: 'Kochi',
      familiarPlaces: ['Alleppey Backwaters', 'Fort Kochi Beach', 'Thrissur Round', 'Munnar Hills'],
      familiarMusic: ['Sopana Sangeetham', 'Onappattukal', 'Chenda Melam', 'Mappila Pattu'],
      importantCelebrations: ['Onam Feast', 'Vishu Kani', 'Thrissur Pooram', 'Vallam Kali (Boat Race)'],
      familiarPeople: ['Daughter (Meera Nair)', 'Son-in-law (Arun)', 'Grandchildren (Diya & Dev)'],
      childhoodMemories: [
        'Making intricate flower carpets (Pookkalam) in the courtyard for 10 days of Onam',
        'Watching houseboats glide quietly along the emerald backwater coconut palms',
        'Opening eyes on Vishu morning to the golden Kani bell metal bowl'
      ]
    },
    culturalSuggestions: [
      { id: 'cs-kl1', category: 'Festival', title: 'Onam Harvest & Pookkalam', description: 'Welcoming King Mahabali with floral carpets and a grand 24-dish feast', approved: true },
      { id: 'cs-kl2', category: 'Music', title: 'Chenda Melam & Onam Songs', description: 'Powerful, joyous temple percussion and rhythmic harvest melodies', approved: true },
      { id: 'cs-kl3', category: 'Place', title: 'Backwaters of Alleppey', description: 'Tranquil canals lined with coconut palms and gentle water ripples', approved: true },
      { id: 'cs-kl4', category: 'Food', title: 'Traditional Sadya on Banana Leaf', description: 'Avial, sambar, payasam, and crispy banana chips served on fresh leaf', approved: true }
    ],
    culturalFoods: [
      { name: 'Onam Sadya Feast', desc: 'Lavish multi-course vegetarian feast served on plantain leaves with creamy payasam.', image: '/images/food_traditional_thali.jpg' },
      { name: 'Appam with Coconut Stew', desc: 'Lacy fermented rice pancakes with a soft fluffy center and vegetable coconut milk stew.', image: '/images/food_chai_samosa.jpg' },
      { name: 'Pazham Pori & Banana Chips', desc: 'Ripe sweet plantain fritters fried golden alongside crisp coconut oil banana chips.', image: '/images/food_sweets_mithai.jpg' }
    ],
    culturalFestivals: [
      { name: 'Onam Festival', desc: '10-day celebration of abundance, floral pookkalam, and snake boat races.', month: 'August / September', image: '/images/festival_diwali.jpg' },
      { name: 'Vishu', desc: 'Astronomical New Year featuring the auspicious sight of golden Cassia flowers and fruits.', month: 'Mid-April', image: '/images/festival_bihu.jpg' }
    ]
  },
  'Gujarat': {
    state: 'Gujarat',
    regionalContext: {
      state: 'Gujarat',
      region: 'Saurashtra & North Gujarat',
      preferredLanguage: 'Gujarati',
      otherLanguages: ['Hindi', 'English'],
      homeTown: 'Ahmedabad',
      familiarPlaces: ['Sabarmati Ashram', 'Kankaria Lake', 'Gir Lion Sanctuary', 'Dwarka Shore'],
      familiarMusic: ['Garba & Raas Beats', 'Sugam Sangeet', 'Dayro Folk Ballads', 'Prabhatiya'],
      importantCelebrations: ['Navratri Garba', 'Uttarayan (Kite Flying)', 'Janmashtami', 'Diwali & Bestu Varas'],
      familiarPeople: ['Son (Bhavik Patel)', 'Daughter (Kinjal)', 'Sister (Hansaben)'],
      childhoodMemories: [
        'Dancing in a spinning circle with wooden dandiya sticks under fairy lights during Navratri',
        'Flying colorful paper kites from the terrace rooftop all day on Makar Sankranti',
        'Enjoying hot crispy jalebis and fafda with papaya sambharo on Sunday mornings'
      ]
    },
    culturalSuggestions: [
      { id: 'cs-gj1', category: 'Festival', title: 'Navratri 9-Night Garba', description: 'World famous dance festival in colorful chaniya cholis with live dholak', approved: true },
      { id: 'cs-gj2', category: 'Music', title: 'Raas Garba & Sugam Sangeet', description: 'Energetic clapping beats and soul-stirring Gujarati poetic songs', approved: true },
      { id: 'cs-gj3', category: 'Place', title: 'Sabarmati Riverfront & Ashram', description: 'Historic peaceful grounds with neem trees and gentle river breezes', approved: true },
      { id: 'cs-gj4', category: 'Food', title: 'Khaman Dhokla & Thepla', description: 'Steamed spongy gram flour cakes seasoned with mustard seeds and fresh theplas', approved: true }
    ],
    culturalFoods: [
      { name: 'Khaman Dhokla & Fafda', desc: 'Porous yellow steamed savories tempered with curry leaves and paired with sweet jalebi.', image: '/images/food_sweets_mithai.jpg' },
      { name: 'Methi Thepla with Pickle', desc: 'Spiced fenugreek flatbread that stays soft for days, eaten with mango chunda.', image: '/images/food_chai_samosa.jpg' },
      { name: 'Winter Undhiyu', desc: 'Rich vegetable casserole cooked upside down in earthen pots with muthia dumplings.', image: '/images/food_traditional_thali.jpg' }
    ],
    culturalFestivals: [
      { name: 'Navratri Garba', desc: 'Nine nights of divine celebration, swirling traditional attire, and joyous community circles.', month: 'September / October', image: '/images/festival_diwali.jpg' },
      { name: 'Uttarayan (International Kite Day)', desc: 'Rooftop festival filling the clear winter sky with thousands of vibrant soaring kites.', month: 'January 14', image: '/images/festival_holi.jpg' }
    ]
  }
};

// Default context (Assam)
export const DEMO_REGIONAL_CONTEXT: RegionalCulturalContext = STATE_CULTURAL_PRESETS['Assam'].regionalContext;
export const DEMO_CULTURAL_SUGGESTIONS: CulturalSuggestion[] = STATE_CULTURAL_PRESETS['Assam'].culturalSuggestions;

// Regional Music Tracks
export const DEMO_REGIONAL_MUSIC: RegionalMusicTrack[] = [
  {
    id: 'track-1',
    title: 'Bihu Song',
    artist: 'Assamese Folk Artists',
    genre: 'Assamese Folk',
    region: 'Assam',
    language: 'Assamese',
    duration: '3:45',
    albumArt: '/images/festival_bihu.jpg',
    memoryAssociation: 'Reminds Asha of Bohag Bihu dance in Nagaon village',
    audioToneFrequency: 440,
    approved: true
  },
  {
    id: 'track-2',
    title: 'Xopunor Xun',
    artist: 'Zubeen & Folk Troupe',
    genre: 'Assamese Melodic',
    region: 'Upper Assam',
    language: 'Assamese',
    duration: '4:12',
    albumArt: '/images/culture_music_harmonium.jpg',
    memoryAssociation: 'Gentle acoustic song listened to during afternoon tea',
    audioToneFrequency: 523.25,
    approved: true
  },
  {
    id: 'track-3',
    title: 'Rongali Bihu',
    artist: 'Traditional Troupe',
    genre: 'Traditional Folk',
    region: 'Assam',
    language: 'Assamese',
    duration: '3:20',
    albumArt: '/images/clip_folk_dance.jpg',
    memoryAssociation: 'Festive spring song played on the village gramophone',
    audioToneFrequency: 392,
    approved: true
  },
  {
    id: 'track-4',
    title: 'Rangamati',
    artist: 'Bodo Folk Collective',
    genre: 'Bodo Folk',
    region: 'Northeast India',
    language: 'Bodo',
    duration: '3:55',
    albumArt: '/images/location_riverbank.jpg',
    memoryAssociation: 'Flute and serja rhythms of Kokrajhar and Bodoland',
    audioToneFrequency: 349.23,
    approved: true
  }
];

// Places I Remember (Screen 8)
export const DEMO_PLACES: PlaceMemory[] = [
  {
    id: 'pl-1',
    title: 'Village Home',
    period: 'Childhood • 1950s',
    category: 'Childhood',
    location: 'Nagaon Rural, Assam',
    imageUrl: '/images/location_village_home.jpg',
    description: 'Ancestral stilt house surrounded by areca nut palms and paddy fields.',
    relatedPeople: ['Parents', 'Grandfather Mukul', 'Siblings']
  },
  {
    id: 'pl-2',
    title: 'School',
    period: 'Education • 1960s',
    category: 'Education',
    location: 'Tezpur Government School',
    imageUrl: '/images/location_tea_garden.jpg',
    description: 'Red brick school veranda where morning assemblies were held under the banyan tree.',
    relatedPeople: ['Classmate Minoti', 'Teacher Bipin Sir']
  },
  {
    id: 'pl-3',
    title: 'Guwahati',
    period: 'Work • 1970s',
    category: 'Work',
    location: 'Panbazar & Riverbank, Guwahati',
    imageUrl: '/images/location_riverbank.jpg',
    description: 'First city home near the Brahmaputra ghat and busy Panbazar bookshops.',
    relatedPeople: ['Husband', 'Colleagues']
  },
  {
    id: 'pl-4',
    title: 'Family Home',
    period: 'Present',
    category: 'Present',
    location: 'Nagaon Town, Assam',
    imageUrl: '/images/location_village_home.jpg',
    description: 'Warm garden home where children and grandchildren gather for holidays.',
    relatedPeople: ['Rahul Borah', 'Sunita Borah', 'Caregiver']
  }
];

// Cultural / Personal Journey Life Steps (Screen 14)
export const DEMO_JOURNEY_STEPS: LifeJourneyStep[] = [
  {
    id: 'step-school',
    title: 'School',
    caption: 'Tezpur School Days (1960s)',
    imageUrl: '/images/location_tea_garden.jpg',
    correctOrder: 1
  },
  {
    id: 'step-marriage',
    title: 'Marriage',
    caption: 'Wedding Celebration (1970)',
    imageUrl: '/images/culture_handloom_saree.jpg',
    correctOrder: 2
  },
  {
    id: 'step-work',
    title: 'Work',
    caption: 'Teaching & Guwahati Life (1975)',
    imageUrl: '/images/location_riverbank.jpg',
    correctOrder: 3
  },
  {
    id: 'step-family',
    title: 'Family',
    caption: 'Family in Nagaon (1985)',
    imageUrl: '/images/memory_vintage_album.jpg',
    correctOrder: 4
  }
];

// Daily Tasks Step-by-Step (Screen 17 / Features 17-19)
export const DEMO_DAILY_TASKS: DailyTaskItem[] = [
  {
    id: 'task-teeth',
    title: 'Brushing Teeth',
    category: 'Brushing Teeth',
    icon: 'Sparkles',
    currentStepIndex: 0,
    totalSteps: 5,
    completed: false,
    steps: [
      { stepNumber: 1, totalSteps: 5, instruction: 'Pick up your toothbrush.', voicePrompt: 'Pick up your toothbrush gently.' },
      { stepNumber: 2, totalSteps: 5, instruction: 'Put a little toothpaste on the brush.', voicePrompt: 'Put a small amount of toothpaste on your brush.' },
      { stepNumber: 3, totalSteps: 5, instruction: 'Gently brush the front and sides of your teeth.', voicePrompt: 'Gently brush the front and sides of your teeth.' },
      { stepNumber: 4, totalSteps: 5, instruction: 'Rinse your mouth thoroughly with clean water.', voicePrompt: 'Rinse your mouth with warm water.' },
      { stepNumber: 5, totalSteps: 5, instruction: 'Rinse your brush and place it in the cup.', voicePrompt: 'Well done! Place your brush back in the cup.' }
    ]
  },
  {
    id: 'task-tea',
    title: 'Making Morning Assam Tea',
    category: 'Making Tea',
    icon: 'Coffee',
    currentStepIndex: 0,
    totalSteps: 4,
    completed: true,
    steps: [
      { stepNumber: 1, totalSteps: 4, instruction: 'Take your favourite ceramic cup from the shelf.', voicePrompt: 'Take your favourite ceramic cup from the shelf.' },
      { stepNumber: 2, totalSteps: 4, instruction: 'Carefully pour warm freshly brewed tea into the cup.', voicePrompt: 'Pour the warm tea carefully.' },
      { stepNumber: 3, totalSteps: 4, instruction: 'Add half a spoon of sugar or jaggery if you like.', voicePrompt: 'Add a little jaggery or sugar if you like.' },
      { stepNumber: 4, totalSteps: 4, instruction: 'Sit by the verandah and enjoy your morning tea.', voicePrompt: 'Sit by the window and enjoy your tea peacefully.' }
    ]
  },
  {
    id: 'task-meds',
    title: 'Morning Caregiver Reminder',
    category: 'Medication Reminder',
    icon: 'Pill',
    currentStepIndex: 0,
    totalSteps: 2,
    completed: true,
    steps: [
      { stepNumber: 1, totalSteps: 2, instruction: 'Take the small blue morning pill box kept by Rahul.', voicePrompt: 'Take the morning pill box prepared by Rahul.' },
      { stepNumber: 2, totalSteps: 2, instruction: 'Drink a full glass of fresh water with it.', voicePrompt: 'Take a sip of fresh water.' }
    ]
  }
];


export const DEMO_SESSIONS: ActivitySession[] = [
  {
    id: 'sess-1',
    patientId: 'patient-anita-123',
    activityId: 'act-1',
    activityType: 'photo_recognition',
    difficulty: 'EASY',
    startedAt: '2026-09-08T10:00:00Z',
    completedAt: '2026-09-08T10:04:30Z',
    durationSeconds: 270,
    completed: true,
    skipped: false,
    assistanceRequested: false,
    hesitationCount: 0,
    selectedChoiceId: 'c1',
    correctCount: 7,
    wrongCount: 0,
    totalQuestions: 7,
    hintCount: 0,
    voiceInteractionUsed: true,
    createdAt: '2026-09-08T10:05:00Z'
  },
  {
    id: 'sess-2',
    patientId: 'patient-anita-123',
    activityId: 'act-2',
    activityType: 'picture_matching',
    difficulty: 'EASY',
    startedAt: '2026-09-08T15:30:00Z',
    completedAt: '2026-09-08T15:35:00Z',
    durationSeconds: 300,
    completed: true,
    skipped: false,
    assistanceRequested: false,
    hesitationCount: 1,
    selectedChoiceId: 'c1',
    correctCount: 6,
    wrongCount: 1,
    totalQuestions: 7,
    hintCount: 1,
    voiceInteractionUsed: false,
    createdAt: '2026-09-08T15:36:00Z'
  },
  {
    id: 'sess-3',
    patientId: 'patient-anita-123',
    activityId: 'act-3',
    activityType: 'memory_recall',
    difficulty: 'EASY',
    startedAt: '2026-09-09T09:30:00Z',
    completedAt: '2026-09-09T09:38:00Z',
    durationSeconds: 480,
    completed: true,
    skipped: false,
    assistanceRequested: true,
    hesitationCount: 3,
    selectedChoiceId: 'c1',
    correctCount: 5,
    wrongCount: 2,
    totalQuestions: 7,
    hintCount: 2,
    voiceInteractionUsed: true,
    createdAt: '2026-09-09T09:39:00Z'
  }
];

export const DEMO_BASELINE: PersonalBaseline = {
  patientId: 'patient-anita-123',
  sampleCount: 15,
  averageSessionDurationSeconds: 310, // ~5.1 minutes
  completionRate: 0.85, // 85%
  skipRate: 0.05,
  averageResponseTimeSeconds: 6.2,
  assistanceRate: 0.12,
  preferredActivityTypes: ['photo_recognition', 'picture_matching', 'memory_recall'],
  preferredTimesOfDay: ['10:00 AM', '04:00 PM'],
  lastUpdated: '2026-09-09T08:00:00Z'
};

export const DEMO_CHANGE_ALERTS: MeaningfulChangeAlert[] = [
  {
    id: 'alert-1',
    patientId: 'patient-anita-123',
    type: 'DURATION_INCREASE',
    severity: 'NOTICE',
    signal: 'Memory recall duration higher than established baseline',
    baselineValue: '5m 10s average duration',
    currentValue: '8m 00s in today’s morning session',
    confidence: 82,
    timeWindow: 'Past 24 Hours',
    explanation: 'Anita took longer to review memories and requested hints twice. This natural variation may reflect slight fatigue or unfamiliar distractions.',
    suggestedAction: 'Offer a familiar relaxing music or garden activity, or schedule engagement earlier in the morning.',
    disclaimer: 'Supportive companion insight — not a clinical diagnosis.',
    status: 'UNREVIEWED',
    createdAt: '2026-09-09T09:40:00Z'
  }
];

export const DEMO_RECOMMENDATIONS: AIActivityRecommendation[] = [
  {
    id: 'rec-1',
    patientId: 'patient-anita-123',
    activityType: 'photo_recognition',
    proposedTitle: 'Remembering Grandson Aarav at Lodhi Gardens',
    proposedDifficulty: 'EASY',
    rationale: 'High positive engagement recorded with garden and grandson memories in previous sessions.',
    sourceMemoryId: 'mem-1',
    sourceMemoryTitle: 'Family Picnic at Lodhi Gardens',
    createdAt: '2026-09-09T08:00:00Z',
    status: 'PENDING'
  }
];

export const DEMO_REMINDERS: CaregiverReminder[] = [
  {
    id: 'rem-1',
    patientId: 'patient-anita-123',
    title: 'Morning Warm Spiced Tea',
    category: 'ROUTINE',
    scheduledTime: '08:30 AM',
    active: true,
    repeatDaily: true,
    iconName: 'Coffee',
    gentleMessage: 'Time for your warm cardamom tea with sunny balcony views.',
    createdAt: '2026-01-20T08:00:00Z'
  },
  {
    id: 'rem-2',
    patientId: 'patient-anita-123',
    title: 'Water Balcony Garden Plants',
    category: 'ACTIVITY',
    scheduledTime: '10:00 AM',
    active: true,
    repeatDaily: true,
    iconName: 'Droplets',
    gentleMessage: 'Your pink roses and jasmine on the verandah would love a gentle drink of water.',
    createdAt: '2026-01-20T08:00:00Z'
  },
  {
    id: 'rem-3',
    patientId: 'patient-anita-123',
    title: 'Evening Family Call with Sunita',
    category: 'FAMILY_CALL',
    scheduledTime: '06:30 PM',
    active: true,
    repeatDaily: true,
    iconName: 'PhoneCall',
    gentleMessage: 'Sunita will be calling to say hello and share her day with you.',
    createdAt: '2026-01-20T08:00:00Z'
  }
];

export const DEMO_CONSENT: ConsentSettings = {
  patientId: 'patient-anita-123',
  personalProfile: true,
  photos: true,
  videos: true,
  audioVoice: true,
  voiceProcessing: true,
  aiPersonalization: true,
  memoryCompanion: true,
  activityAnalysis: true,
  reportSharing: true,
  familyNotifications: true,
  emergencyNotifications: true,
  googlePhotosImport: true,
  googleDriveImport: true,
  caregiverSharing: true,
  professionalAccess: true,
  approvedBy: 'Rahul Sharma (Power of Attorney / Family Caregiver)',
  updatedAt: '2026-02-01T10:00:00Z'
};

export const DEMO_GOOGLE_CONNECTIONS: GoogleConnectionStatus = {
  accountConnected: true,
  googleEmail: 'rahul.sharma@gmail.com',
  googleDisplayName: 'Rahul Sharma',
  photosConnected: true,
  driveConnected: true,
  lastSyncAt: '2026-09-09T10:15:00Z'
};

export const DEMO_IMPORTED_MEDIA: ImportedMediaCandidate[] = [
  {
    id: 'imp-1',
    source: 'google_photos',
    filename: 'anita_saree_diwali_2023.jpg',
    title: 'Diwali Lighting with Aarav',
    mediaUrl: '/images/festival_diwali.jpg',
    mimeType: 'image/jpeg',
    description: 'Lighting clay diyas on the verandah with Aarav during Diwali festival.',
    category: 'Family Photo',
    people: ['Anita Sharma', 'Aarav'],
    place: 'Home Courtyard',
    dateApproximation: 'November 2023',
    approvalStatus: 'PENDING_REVIEW'
  },
  {
    id: 'imp-2',
    source: 'google_drive',
    filename: 'shimla_monsoon_trip.mp4',
    title: 'Short Family Clip: Courtyard Tea',
    mediaUrl: '/images/clip_family_gathering.jpg',
    mimeType: 'video/mp4',
    description: 'Gentle video clip of family gathered together drinking afternoon tea in the courtyard.',
    category: 'Family Video',
    people: ['Rahul Sharma', 'Anita Sharma'],
    place: 'Home Courtyard',
    dateApproximation: 'July 2022',
    approvalStatus: 'PENDING_REVIEW'
  }
];

export const DEMO_REPORTS: ActivityReport[] = [
  {
    id: 'rep-2026-09-09',
    patientId: 'patient-anita-123',
    patientName: 'Anita Sharma',
    reportDateRange: 'September 2, 2026 – September 9, 2026 (7 Days)',
    generatedAt: '2026-09-09T10:00:00Z',
    totalActivitiesCompleted: 18,
    completionRate: 0.81,
    averageDurationMinutes: 5.6,
    assistanceLevel: 'Low',
    activityBreakdown: {
      'Photo Recognition': 8,
      'Picture Matching': 6,
      'Memory Recall': 4
    },
    baselineComparison: {
      durationDelta: '+0.5 min vs baseline',
      completionDelta: '-4% vs baseline',
      commentary: 'Engagement remained high throughout the week with strong recognition of immediate family photos. Recent memory recall required slightly more time.'
    },
    caregiverNotes: 'Anita had restful sleep most nights. Responded very happily to the Lodhi Gardens picnic photo.',
    aiSummary: 'Over the past 7 days, Anita completed 18 supportive activities. Family photo recognition remains a source of high positive engagement. Slight time variations on recall tasks indicate natural pacing changes.',
    disclaimer: 'Supportive activity report for caregiver review — not a medical or diagnostic assessment.'
  }
];

export const DEMO_SOS_EVENTS: SOSEvent[] = [
  {
    id: 'sos-demo-1',
    patientId: 'patient-anita-123',
    triggeredAt: '2026-09-05T14:20:00Z',
    triggeredBy: 'PATIENT',
    contactsNotified: ['Rahul Sharma'],
    callAttempted: true,
    smsAttempted: true,
    status: 'RESOLVED',
    notes: 'Anita pressed emergency button; Rahul called back within 2 minutes to assist with glasses.'
  }
];

export const DEMO_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'caregiver-rahul',
    userRole: 'CAREGIVER',
    action: 'LOGIN_GOOGLE',
    details: 'Caregiver Rahul Sharma authenticated securely via Google Sign-In',
    timestamp: '2026-09-09T08:00:00.000Z'
  },
  {
    id: 'log-2',
    userId: 'caregiver-rahul',
    userRole: 'CAREGIVER',
    action: 'GOOGLE_PHOTOS_SESSION_CREATED',
    details: 'Created Google Photos Picker session (session-photos-9812)',
    timestamp: '2026-09-09T08:15:00.000Z'
  },
  {
    id: 'log-3',
    userId: 'caregiver-rahul',
    userRole: 'CAREGIVER',
    action: 'MEMORY_APPROVED_FOR_AI',
    details: 'Approved memory "Family Picnic at Lodhi Gardens" for AI cognitive activities',
    timestamp: '2026-09-09T08:30:00.000Z'
  },
  {
    id: 'log-4',
    userId: 'patient-anita',
    userRole: 'PATIENT',
    action: 'ACTIVITY_COMPLETED',
    details: 'Completed Photo Recognition activity with 7 of 7 correct choices',
    timestamp: '2026-09-09T09:30:00.000Z'
  }
];
