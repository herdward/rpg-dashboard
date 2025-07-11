# RPG Dashboard

Made with assistance with Claude, to get something up and running for personal usage.

A visually impressive personal RPG dashboard that tracks XP and progress across real-life domains (coding, strength, cardio, etc.) with a video game aesthetic.

## Features

- **Dashboard** (`/`) - View XP progress bars for each domain with glowing animations
- **Log XP** (`/log`) - Add new XP entries with a sleek form interface
- **Quests** (`/quests`) - Track and complete quests to earn XP automatically
- **Dark Theme** - Cyberpunk-inspired design with glassmorphism effects
- **Responsive Design** - Works on desktop, tablet, and mobile devices

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Custom animations** and glowing effects
- **File-based data storage** (JSON files)

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Run the development server**:
   ```bash
   npm run dev
   ```
3. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## File Structure

```
rpg-dashboard/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Dashboard page
│   │   ├── log/page.tsx       # XP logging page
│   │   ├── quests/page.tsx    # Quests page
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── XPBar.tsx          # Glowing XP progress bar
│   │   ├── LogForm.tsx        # XP form component
│   │   └── QuestCard.tsx      # Quest card component
│   └── lib/
│       └── xpUtils.ts         # Utility functions
├── data/
│   ├── log.json              # XP log entries
│   └── quests.json           # Quest definitions
└── package.json
```

## XP System

- **Level Formula**: `level = floor(totalXP / 100)`
- **Progress**: `progress = totalXP % 100`
- **Domains**: Coding, Strength, Cardio, and custom domains

## Usage

1. **View Dashboard** - See your current XP and levels for each domain
2. **Log XP** - Add new achievements and earn experience points
3. **Complete Quests** - Finish predefined challenges for bonus XP
4. **Track Progress** - Watch your levels grow with animated progress bars

## Customization

1. **Add new domains** by logging XP or adding quests
2. **Modify quest rewards** in `data/quests.json`
3. **Adjust styling** in `src/app/globals.css`
4. **Change XP formula** in `src/lib/xpUtils.ts`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

Enjoy tracking your real-life progress like a video game! 🎮✨
