import { 
  CognitiveActivity, 
  MemoryItem, 
  ActivityType, 
  ActivityDifficulty, 
  ActivityQuestion, 
  ActivityChoice,
  SupportedLanguage 
} from '../types';

/**
 * Utility to randomly shuffle an array (Fisher-Yates)
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export class ActivityEngine {
  /**
   * Generates a safe, 7-question (minimum 4 choices per question) cognitive activity.
   */
  public static generateActivity(
    approvedMemories: MemoryItem[],
    requestedType?: ActivityType,
    difficulty: ActivityDifficulty = 'EASY',
    questionCount: number = 7,
    language: SupportedLanguage = 'en'
  ): CognitiveActivity {
    // Filter strictly to memories that are approved AND approved for AI
    const validMemories = approvedMemories.filter(m => m.approved && m.approvedForAI && m.consentStatus === 'GRANTED');
    const targetType = requestedType || this.selectRandomType();

    const questions: ActivityQuestion[] = [];

    for (let i = 1; i <= questionCount; i++) {
      const q = this.generateQuestion(i, targetType, validMemories, difficulty, language);
      questions.push(q);
    }

    const titleMap: Record<ActivityType, string> = {
      photo_recognition: 'Family & Faces Photo Recall',
      picture_matching: 'Gentle Picture Matching',
      memory_recall: 'Familiar Moments & Places',
      sequence: 'Daily Routine Sequencing',
      word_association: 'Calm Word Association',
      familiar_person: 'Familiar People & Loved Ones',
      music_memory: 'Old Melodies & Songs',
      story_recall: 'Warm Life Stories',
      daily_routine_recall: 'Peaceful Routine Recall',
      object_recognition: 'Cherished Objects & Nature',
      memory_lane: 'Memory Lane Journey',
      conversational_reminiscence: 'Memory Companion Talk'
    };

    const firstQ = questions[0];

    return {
      id: `act-${Date.now()}`,
      title: titleMap[targetType] || 'Supportive Cognitive Activity',
      instructions: 'Take your time. One question at a time. All answers are supported with warmth.',
      type: targetType,
      difficulty,
      estimatedDurationMinutes: Math.max(3, Math.round(questionCount * 0.8)),
      prompt: firstQ.prompt,
      questionCount,
      questions,
      choices: firstQ.choices,
      correctChoiceId: firstQ.correctChoiceId,
      memoryId: validMemories[0]?.id,
      memoryTitle: validMemories[0]?.title,
      memoryImageUrl: validMemories[0]?.imageUrl,
      personalizationNote: validMemories.length > 0 ? `Personalized using ${validMemories.length} caregiver-approved memories` : 'Supportive baseline templates',
      safetyNote: 'Non-diagnostic supportive engagement. Minimum 4 choices per question.'
    };
  }

  private static selectRandomType(): ActivityType {
    const types: ActivityType[] = [
      'photo_recognition', 
      'picture_matching', 
      'memory_recall', 
      'word_association', 
      'sequence', 
      'familiar_person', 
      'music_memory'
    ];
    return types[Math.floor(Math.random() * types.length)];
  }

  private static generateQuestion(
    questionNumber: number,
    type: ActivityType,
    memories: MemoryItem[],
    difficulty: ActivityDifficulty,
    language: SupportedLanguage
  ): ActivityQuestion {
    const memory = memories.length > 0 ? memories[(questionNumber - 1) % memories.length] : null;

    switch (type) {
      case 'photo_recognition':
      case 'familiar_person': {
        const PHOTO_QUIZ_PRESETS = [
          {
            prompt: 'Who is gathered in this cherished photograph from 1985?',
            image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
            title: 'Family Gathering (1985)',
            correct: 'Son Gaurav & Family',
            distractors: ['Neighbors from City', 'School Teachers', 'Market Shopkeepers'],
            hint: 'Look at the smiling young boy on the left veranda.'
          },
          {
            prompt: 'What peaceful place is shown in this childhood memory?',
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
            title: 'Childhood Village Home',
            correct: 'Childhood Stilt Home in Tezpur',
            distractors: ['Railway Station', 'City High-rise Flat', 'Modern Hospital'],
            hint: 'Notice the wooden stilts and banana trees.'
          },
          {
            prompt: 'Which spring festival features traditional dance in red & muga silk?',
            image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80',
            title: 'Spring Festival Celebration',
            correct: 'Rongali Bihu Celebration',
            distractors: ['Winter Snow Festival', 'Kite Flying Day', 'Desert Fair'],
            hint: 'Dhol and pepa instruments play joyful rhythms for this festival.'
          },
          {
            prompt: 'What traditional harvest delicacy is prepared with roasted sesame and gur?',
            image: 'https://images.unsplash.com/photo-1613292443284-c7702f3531f8?auto=format&fit=crop&w=800&q=80',
            title: 'Festival Sweets',
            correct: 'Til & Ghila Pitha',
            distractors: ['French Fries', 'Chocolate Cake', 'Spicy Noodles'],
            hint: 'Crisp rolled rice treats baked over grandmother’s clay stove.'
          },
          {
            prompt: 'Which great sacred river is shown at sunset in this evening memory?',
            image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
            title: 'Brahmaputra River Ghat',
            correct: 'Brahmaputra River',
            distractors: ['Yamuna River', 'Arabian Sea Beach', 'City Canal'],
            hint: 'The vast river with evening ferry boats near Tezpur.'
          },
          {
            prompt: 'What lush green plantation did you walk through during morning strolls?',
            image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
            title: 'Assam Tea Estates',
            correct: 'Lush Green Tea Garden',
            distractors: ['Wheat Farm', 'Apple Orchard', 'Desert Cactus Field'],
            hint: 'Emerald bushes picked early in the misty morning.'
          },
          {
            prompt: 'Which heirloom keepsake did mother keep fragrant cardamom and cloves inside?',
            image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
            title: 'Mother’s Keepsake Box',
            correct: 'Handcrafted Silver & Brass Spice Box',
            distractors: ['Plastic Lunchbox', 'Digital Clock', 'Glass Bottle'],
            hint: 'Delicate floral carvings crafted by artisans in Upper Assam.'
          }
        ];

        const preset = PHOTO_QUIZ_PRESETS[(questionNumber - 1) % PHOTO_QUIZ_PRESETS.length];
        const choices: ActivityChoice[] = shuffle([
          { id: 'c-correct', text: preset.correct, isCorrect: true },
          { id: 'c-dist-1', text: preset.distractors[0], isCorrect: false },
          { id: 'c-dist-2', text: preset.distractors[1], isCorrect: false },
          { id: 'c-dist-3', text: preset.distractors[2], isCorrect: false }
        ]);

        return {
          id: `q-${questionNumber}`,
          questionNumber,
          prompt: preset.prompt,
          instructions: 'Take your time. Touch the answer that feels right.',
          choices,
          correctChoiceId: choices.find(c => c.isCorrect)!.id,
          memoryImageUrl: preset.image,
          memoryTitle: preset.title
        };
      }

      case 'picture_matching': {
        const matchingThemes = [
          {
            prompt: 'Which picture shows the pink blooming rose?',
            correct: { text: 'Pink Rose Flower', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80' },
            distractors: [
              { text: 'Yellow Sunflower', url: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=400&q=80' },
              { text: 'Green Fern Leaves', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80' },
              { text: 'Purple Lavender', url: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=400&q=80' }
            ]
          },
          {
            prompt: 'Which cup is the warm morning tea?',
            correct: { text: 'Clay Cup of Spiced Chai', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80' },
            distractors: [
              { text: 'Cold Glass of Water', url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=400&q=80' },
              { text: 'Fresh Orange Juice', url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80' },
              { text: 'Empty Teapot', url: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=400&q=80' }
            ]
          },
          {
            prompt: 'Which item is the vintage brass gramophone?',
            correct: { text: 'Brass Gramophone', url: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?auto=format&fit=crop&w=400&q=80' },
            distractors: [
              { text: 'Digital Tablet', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80' },
              { text: 'Wall Clock', url: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=400&q=80' },
              { text: 'Telephone Receiver', url: 'https://images.unsplash.com/photo-1520923642038-b4259aceffd7?auto=format&fit=crop&w=400&q=80' }
            ]
          }
        ];

        const theme = matchingThemes[(questionNumber - 1) % matchingThemes.length];
        const choices: ActivityChoice[] = shuffle([
          { id: 'c-1', text: theme.correct.text, imageUrl: theme.correct.url, isCorrect: true },
          { id: 'c-2', text: theme.distractors[0].text, imageUrl: theme.distractors[0].url, isCorrect: false },
          { id: 'c-3', text: theme.distractors[1].text, imageUrl: theme.distractors[1].url, isCorrect: false },
          { id: 'c-4', text: theme.distractors[2].text, imageUrl: theme.distractors[2].url, isCorrect: false }
        ]);

        return {
          id: `q-${questionNumber}`,
          questionNumber,
          prompt: theme.prompt,
          instructions: 'Touch the picture that matches best.',
          choices,
          correctChoiceId: choices.find(c => c.isCorrect)!.id
        };
      }

      case 'sequence': {
        const sequencePool = [
          {
            prompt: 'What comes first when waking up in the morning?',
            correct: 'Opening the curtains to see the morning sun',
            distractors: ['Going to bed for nighttime sleep', 'Eating late dinner', 'Switching off the house lights']
          },
          {
            prompt: 'When watering your balcony plants, what do we do first?',
            correct: 'Fill the watering can with fresh cool water',
            distractors: ['Pick all the rose petals off', 'Put the pot in a dark closet', 'Leave the balcony door locked']
          },
          {
            prompt: 'What do we prepare before drinking morning tea?',
            correct: 'Boil water with ginger and cardamom',
            distractors: ['Freeze water into ice cubes', 'Wash dinner plates', 'Put on a winter jacket']
          }
        ];

        const seq = sequencePool[(questionNumber - 1) % sequencePool.length];
        const choices: ActivityChoice[] = shuffle([
          { id: 'c-1', text: seq.correct, isCorrect: true },
          { id: 'c-2', text: seq.distractors[0], isCorrect: false },
          { id: 'c-3', text: seq.distractors[1], isCorrect: false },
          { id: 'c-4', text: seq.distractors[2], isCorrect: false }
        ]);

        return {
          id: `q-${questionNumber}`,
          questionNumber,
          prompt: seq.prompt,
          instructions: 'Pick what happens first.',
          choices,
          correctChoiceId: choices.find(c => c.isCorrect)!.id
        };
      }

      case 'music_memory': {
        const musicQuestions = [
          {
            prompt: 'Which beloved singer sang the timeless melody "Ajeeb Dastan Hai Yeh"?',
            correct: 'Lata Mangeshkar',
            distractors: ['A Western Rock Band', 'Modern Heavy Metal', 'An Electronic Synthesizer']
          },
          {
            prompt: 'Which Indian classical instrument has 100 strings played with gentle walnut mallets?',
            correct: 'Santoor',
            distractors: ['Drums', 'Saxophone', 'Electric Guitar']
          },
          {
            prompt: 'Which morning flute melody brings peaceful feelings to the home?',
            correct: 'Bansuri (Morning Raga)',
            distractors: ['Car Horns', 'Siren Whistle', 'Loud Trumpet']
          }
        ];

        const m = musicQuestions[(questionNumber - 1) % musicQuestions.length];
        const choices: ActivityChoice[] = shuffle([
          { id: 'c-1', text: m.correct, isCorrect: true },
          { id: 'c-2', text: m.distractors[0], isCorrect: false },
          { id: 'c-3', text: m.distractors[1], isCorrect: false },
          { id: 'c-4', text: m.distractors[2], isCorrect: false }
        ]);

        return {
          id: `q-${questionNumber}`,
          questionNumber,
          prompt: m.prompt,
          instructions: 'Select the musical choice you remember.',
          choices,
          correctChoiceId: choices.find(c => c.isCorrect)!.id
        };
      }

      default: { // word_association / memory_recall / routine
        if (memory) {
          const place = memory.place || 'Home Garden';
          const distractorPlaces = ['At a crowded airport', 'In a foreign subway', 'On a desert highway', 'In a factory'];
          const choices: ActivityChoice[] = shuffle([
            { id: 'c-correct', text: place, isCorrect: true },
            { id: 'c-d1', text: distractorPlaces[0], isCorrect: false },
            { id: 'c-d2', text: distractorPlaces[1], isCorrect: false },
            { id: 'c-d3', text: distractorPlaces[2], isCorrect: false }
          ]);

          return {
            id: `q-${questionNumber}`,
            questionNumber,
            prompt: `Where was this happy moment recorded? (${memory.title})`,
            instructions: 'Touch the location that matches this family memory.',
            choices,
            correctChoiceId: choices.find(c => c.isCorrect)!.id,
            memoryImageUrl: memory.imageUrl,
            memoryTitle: memory.title
          };
        }

        const words = [
          { prompt: 'A sunny garden is full of pretty...', correct: 'Roses & Jasmine Flowers', distractors: ['Bicycle tires', 'Computer cables', 'Bricks & stones'] },
          { prompt: 'A warm cup of morning tea tastes wonderful with...', correct: 'Cardamom & Fresh Milk', distractors: ['Cold ice cubes', 'Spicy mustard paste', 'Salty sea water'] },
          { prompt: 'In the evening, when family calls on video, we share...', correct: 'Smiles & Happy Stories', distractors: ['Silence and darkness', 'Exam papers', 'Office blueprints'] }
        ];

        const w = words[(questionNumber - 1) % words.length];
        const choices: ActivityChoice[] = shuffle([
          { id: 'c-1', text: w.correct, isCorrect: true },
          { id: 'c-2', text: w.distractors[0], isCorrect: false },
          { id: 'c-3', text: w.distractors[1], isCorrect: false },
          { id: 'c-4', text: w.distractors[2], isCorrect: false }
        ]);

        return {
          id: `q-${questionNumber}`,
          questionNumber,
          prompt: w.prompt,
          instructions: 'Choose the word that fits best.',
          choices,
          correctChoiceId: choices.find(c => c.isCorrect)!.id
        };
      }
    }
  }
}
