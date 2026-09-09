# MindNest — AI-Powered Dementia Companion

> **"Familiar memories. Meaningful moments. Better support."**

MindNest is a production-quality, full-stack AI dementia companion designed for elderly individuals with cognitive impairment, family caregivers, and healthcare professionals.

> ⚠️ **Important Medical Disclaimer:** MindNest is a supportive engagement companion — **not a diagnostic or medical system**. It does not diagnose, cure, reverse, or medically assess dementia. Any clinically concerning observations are escalated to caregivers or healthcare professionals.

---

## 🌟 Core Product Loop

```
PERSON (Anita Sharma, Age 72)
      ↓
APPROVED MEMORIES (Caregiver verified with approvedForAI === true)
      ↓
7-QUESTION COGNITIVE ACTIVITIES (4+ choices, 1-at-a-time, warm feedback)
      ↓
ENGAGEMENT & TRACKING (Duration, hesitation, hint usage, voice interaction)
      ↓
PERSONAL BASELINE (5-session rolling averages comparing patient only to their own history)
      ↓
NON-DIAGNOSTIC CHANGE AWARENESS (Safe, explainable observations)
      ↓
CAREGIVER INSIGHT & PDF REPORTS (Exportable for geriatricians and family)
      ↓
BETTER SUPPORT & CARE
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🇮🇳 **23 Indian Languages** | English + 22 scheduled Indian languages (Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Urdu, Odia, Assamese, etc.) with independent caregiver/patient language settings |
| 🎙️ **Indian Voice Registry & TTS** | 4 conceptual Indian voice profiles (Male 1/2, Female 1/2) with ElevenLabs backend integration and Web Speech API fallback |
| 🛡️ **Emoji-Free Speech Sanitizer** | Guarantees emojis (`🎉`, `❤️`, `👏`) and decorative symbols are never spoken aloud while fully preserving Indian scripts and natural punctuation |
| 📸 **Google Photos Picker API** | Official session-based Photos Picker API flow (`photospicker.mediaitems.readonly`) with mandatory caregiver review & approval |
| 📁 **Google Drive File Import** | Categorized import for nostalgic family photos, videos, music, and stories |
| 🧠 **Memory Companion Chatbot** | Conversational reminiscence grounded strictly in approved memories with Gemini backend and strict Zod guardrails (zero fabricated facts, zero diagnosis) |
| 🎮 **7-Question, 4+ Option Quizzes** | Minimum 4 randomized options per question, 7 questions per session, 1-at-a-time flow with non-punitive encouraging feedback |
| 🚨 **Patient SOS Emergency Button** | Prominent high-contrast emergency button with 2-step confirmation and direct `tel:`/`sms:` calling integration to primary contacts |
| 👨‍👩‍👧 **Family & Care Team** | CRUD directory for family members, emergency roles, and alert/report permissions |
| 📊 **Activity Analysis & PDF Reports** | Printable PDF, CSV, and JSON report generation with 7-day secure expiring share links |
| 🖼️ **Human-Crafted Claymorphism** | 24–32px rounded surfaces, 60px+ touch targets for seniors, soft lavender (`#6C63FF`) & soft teal (`#2CDA9D`) palette |
| 🧭 **Three-Dot Patient Navigation** | Bottom nav with clear Home icon, Memories, Play, Talk, and a dedicated 3-dot drawer for secondary tools |

---

## 🚀 Quick Start (Demo Mode — No Config Required)

MindNest launches with zero external configuration required in **Demo Mode**:
- **Patient:** Anita Sharma (Age 72)
- **Caregiver:** Rahul Sharma (Son & Primary Caregiver)
- **Family:** Sunita Sharma (Daughter), Dr. Ashok Raman (Geriatrician)
- **Memories:** 5 approved memories including Lodhi Gardens Picnic and Balcony Roses

```bash
# 1. Install dependencies
npm install

# 2. Run the automated test suite
npm run dev:all   # Or run frontend with 'npm run dev'
```

Open browser at: **[http://localhost:3000/](http://localhost:3000/)**

---

## 🧪 Automated Test Suite

MindNest includes an automated test runner verifying safety constraints:

```bash
npx tsx test/runTests.ts
```

Tests verify:
1. Mandatory speech sanitization: `"Great job! 🎉👏 You remembered Grandpa ❤️."` → `"Great job! You remembered Grandpa."`
2. Preservation of Indian scripts (Devanagari, Bengali, Tamil, etc.) with emojis stripped
3. Minimum 4 choices per quiz question and randomized correct answer position
4. 7-question session progression
5. AI Activity Guard Zod schema (strictly rejects 2-choice questions and diagnostic text)
6. Reminiscence structured response validation
7. Family member CRUD operations
8. SOS emergency telephony link and database event logging
9. Approved memory AI security boundary (`approvedForAI === true`)

---

## ⚙️ External API Setup & Configuration

Copy `.env.example` to `.env` to configure live credentials:

### 1. Google Cloud & Google Photos Picker API
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project and enable:
   - **Google Identity Services (OAuth 2.0)**
   - **Photos Picker API** (`photospicker.mediaitems.readonly`)
   - **Google Drive API** (`drive.file`)
3. Create OAuth 2.0 Client Credentials:
   - Authorized Javascript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/login`
4. Set in `.env`:
   ```env
   GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_PHOTOS_API_ENABLED=true
   ```

### 2. Google Gemini API (Personalization & Reminiscence)
1. Generate an API Key at [Google AI Studio](https://aistudio.google.com/).
2. Set in `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
*Note: Gemini calls are routed strictly server-side through `/api/ai/*` with Zod validation. The key is never exposed to the frontend.*

### 3. ElevenLabs Text-to-Speech (Indian Voice Profiles)
1. Obtain an API key from [ElevenLabs](https://elevenlabs.io/).
2. Configure conceptual Indian voice profile IDs in `.env`:
   ```env
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   ELEVENLABS_MALE_INDIAN_VOICE_1=voice_id_1
   ELEVENLABS_MALE_INDIAN_VOICE_2=voice_id_2
   ELEVENLABS_FEMALE_INDIAN_VOICE_1=voice_id_3
   ELEVENLABS_FEMALE_INDIAN_VOICE_2=voice_id_4
   ```
*If ElevenLabs is disabled or unavailable, MindNest falls back seamlessly to browser SpeechSynthesis.*

### 4. Telephony & SMS Emergency Notifications
- MindNest defaults to native browser `tel:` and `sms:` deep links, requiring no paid carrier subscriptions.
- For backend carrier SMS dispatch (e.g. Twilio), configure:
  ```env
  SMS_PROVIDER=twilio
  SMS_API_KEY=your_twilio_key
  EMERGENCY_NUMBER=112
  ```

---

## 👥 User Roles & Access Boundaries

| Role | Access Scope |
|---|---|
| `PATIENT` | Frictionless access (no password barriers); activities, Memory Lane, voice companion, SOS button, routine |
| `CAREGIVER` | Google OAuth authenticated; full patient management, memory approval for AI, reports, baseline analytics, family care team |
| `FAMILY_MEMBER` | View approved memories, receive activity reports, receive emergency alerts |
| `PROFESSIONAL_CAREGIVER` | Read-only clinical activity reports and non-diagnostic trend observation |
| `ADMIN` | System health and append-only audit trail; zero access to private family photos |

---

## 🔒 Security & Privacy Guarantees

- **No Diagnostic Language:** Enforced by regex sanitizers and Zod safety schemas.
- **Strict Memory Boundary:** Memories only enter the AI context if `approved === true` AND `approvedForAI === true`.
- **Expiring Share Links:** Activity reports shared with physicians use expiring 7-day tokens.
- **Audit Trail:** Every approval, export, login, and SOS trigger is logged to the append-only audit record.

---

## 📄 License

MIT License — Built with ❤️ for Smart India Hackathon.
