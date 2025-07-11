Create a complete **Next.js + Tailwind CSS** project for a **visually impressive personal RPG dashboard** that tracks XP and progress across real-life domains (e.g., coding, strength, cardio).

---

### ✨ Theme & Style
- Design it like a **video game stats screen**, with:
  - Clean **dark theme** (default)
  - Glowing XP bars with animation
  - Animated hover effects and soft transitions
  - Cards with glassmorphism or frosted blur
  - Retro pixel/arcade or cyberpunk-inspired typography

---

### 🧩 Pages

1. **`/` (Dashboard)**
   - Display XP bars for each domain (Leetcode, Strength, Cardio, etc.)
   - Show **Level** (floor(xp / 100)) and % to next level
   - Use a progress bar with glowing fill and level indicator badge
   - Grid layout for responsive design

2. **`/log`**
   - A floating card form UI to log new XP:
     - Domain (dropdown)
     - Task name (text)
     - XP (number)
     - Submit button → appends to `data/log.json` and redirects to `/`
   - Form should have animated feedback (toast or animation on success)

3. **`/quests`**
   - Show active quests (loaded from `data/quests.json`)
   - Each quest card includes:
     - Domain
     - Description
     - XP reward
     - Checkbox to mark as complete → auto-logs XP to that domain
   - Completed quests should fade out or display a ✅ animation

---

### 🧠 Logic Requirements

- `lib/xpUtils.ts`:
  - Load XP from `log.json`
  - Calculate level and % to next level
  - Add XP to logs (append to file)
  - Optional: auto-calculate daily XP or streaks later

- XP formula: `level = floor(totalXP / 100)`, `progress = totalXP % 100`

---

### 📁 Folder Structure

- `pages/index.tsx`: Main dashboard
- `pages/log.tsx`: XP log form
- `pages/quests.tsx`: Quest tracker
- `components/XPBar.tsx`: Glowing progress bar
- `components/LogForm.tsx`: XP form component
- `components/QuestCard.tsx`: Quest UI card
- `data/log.json`: Array of XP logs: `{ domain, task, xp, date }`
- `data/quests.json`: Array of quests: `{ id, domain, description, xp, completed }`
- `lib/xpUtils.ts`: Utility logic for XP handling
- `styles/globals.css`: Tailwind + theme CSS
- `tailwind.config.js`, `postcss.config.js`, `package.json`: Standard setup

---

### 🛠 Tech

- **Next.js 13+ with App Router or Pages Router (your choice)**
- **Tailwind CSS with dark mode and animation support**
- Optional: Add **Framer Motion** or `@headlessui/react` for transitions

---

### 🎯 Goals

- Make it look like a real game's stat dashboard
- Maximize interactivity and visual appeal
- Keep code modular and easy to expand (for streaks, achievements, etc.)
- Fully runnable with `yarn install && yarn dev` locally
