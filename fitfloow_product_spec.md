# FitFlOOW — Gym Management SaaS Platform
## Complete Product Specification (Hand-off Document)

---

## 🎯 Business Model

**What we're building:** A white-label Gym Management SaaS platform.

**How it makes money:**
- Gym owners pay a monthly subscription to use the platform
- Each gym gets their own branded portal with their own logo/colors
- The Saiyan Gym website is the live DEMO — what every gym's portal looks like

**Target customer:** Gym owners, not gym members.

**Pricing (charge gym owners):**
| Plan | Price | Gyms |
|------|-------|------|
| Starter | $29/month | Up to 100 members |
| Growth | $79/month | Up to 500 members |
| Elite | $199/month | Unlimited members |

**Revenue projection:** 50 gym clients × $79/month = $3,950/month recurring

---

## 🗺️ Full Sitemap / All Routes

```
/ ................................. Marketing Landing Page (already built)
/login ............................ Login Page (already built)
/signup ........................... New member registration
/forgot-password .................. Password reset

--- MEMBER PORTAL ---
/dashboard ........................ Member home dashboard
/workouts ......................... Workout tracker & history
/workouts/log ..................... Log a new workout
/workouts/:id ..................... View a past workout
/classes .......................... Browse & book classes
/classes/:id ...................... Class detail & booking
/progress ......................... Progress analytics & charts
/nutrition ........................ Nutrition & meal log
/nutrition/log .................... Log a meal
/achievements ..................... Badges, streaks, leaderboard
/profile .......................... Member profile & settings
/membership ....................... Plan details, billing, QR code
/notifications .................... All notifications

--- GYM ADMIN PANEL ---
/admin ............................ Admin dashboard
/admin/members .................... All members list
/admin/members/:id ................ Individual member profile
/admin/classes .................... Manage classes
/admin/classes/new ................ Create a new class
/admin/coaches .................... Manage coaches
/admin/payments ................... Revenue & invoices
/admin/analytics .................. Business analytics
/admin/settings ................... Gym branding & configuration
```

---

## 📱 All Pages — Full Feature Breakdown

---

### 1. `/signup` — Registration Page

**Design:** Same dark Saiyan aesthetic as login page. Split layout.

**Features:**
- Full name, email, password, confirm password fields
- Phone number field
- Goal selector (Build Muscle / Lose Fat / Improve Endurance / General Fitness)
- Experience level (Beginner / Intermediate / Advanced)
- "Join as Member" button
- Google/Apple OAuth buttons
- Terms of service checkbox
- Redirect to onboarding flow after signup

**Onboarding Flow (3 steps after signup):**
- Step 1: Basic info (DOB, gender, height, weight)
- Step 2: Fitness goals & target metrics
- Step 3: Choose membership plan (Free / Warrior / Super Saiyan / Legendary)

---

### 2. `/dashboard` — Member Home Dashboard

**Design:** Dark glassmorphism cards, amber accents, animated stats.

**Left Sidebar Navigation:**
- Logo + gym name
- Dashboard, Workouts, Classes, Progress, Nutrition, Achievements, Profile
- Membership badge (tier name + color)
- Logout button

**Top Bar:**
- Greeting: "Welcome back, [Name]. Your power level is rising." 
- Notification bell with badge count
- Avatar/profile picture

**Main Content — Cards Grid:**

**Card 1 — Power Level (Hero Card, full width)**
- Large animated circular gauge (0–9999)
- Score increases with workouts logged, classes attended, streaks maintained
- Color changes: Orange (0-2999), Red (3000-6999), Gold (7000-9999)
- Scouter-style scanning animation on load
- Label: "CURRENT POWER LEVEL"

**Card 2 — Weekly Streak**
- 7 day row of circles (Mon–Sun)
- Filled = trained that day, empty = rest
- Flame animation on active streak
- "🔥 5-day streak — Keep ascending!"

**Card 3 — Next Class**
- Class name, time, coach name, spots remaining
- "Book Now" / "Cancel Booking" button
- Countdown timer to class start

**Card 4 — This Week's Stats (3 mini cards)**
- Sessions completed: 4
- Total volume lifted: 12,400 kg
- Calories burned: 2,840 kcal

**Card 5 — Recent Workout**
- Last workout name, date, duration
- Top 3 exercises with sets × reps
- "View Full Workout" link

**Card 6 — Active Program**
- Current training program name (e.g., "Saiyan Strength — Phase 2")
- Progress bar: Week 4 of 8
- Today's planned session
- "Start Today's Workout" button

**Card 7 — Leaderboard Preview**
- Top 3 members this week by sessions
- User's current rank
- "View Full Leaderboard" link (locked for free tier)

**Card 8 — Latest Achievement**
- Most recently unlocked badge
- With unlock animation (particle burst)

---

### 3. `/workouts` — Workout Tracker

**Workout History List:**
- Calendar view (toggle between calendar/list)
- Each entry: date, workout name, duration, volume
- Filter by: All / This Week / This Month / By Muscle Group
- Search bar

**Personal Records Section:**
- Top PRs per exercise (Bench Press, Squat, Deadlift, etc.)
- Date it was set
- Gold trophy icon for current PR

**Stats Bar:**
- Total workouts all time
- Total volume lifted (kg)
- Average session duration
- Most trained muscle group

---

### 4. `/workouts/log` — Log New Workout

**Header:**
- Workout name input (e.g., "Push Day — Monday")
- Start timer (stopwatch running since page opened)
- Notes field

**Exercise Logger:**
- Search/browse exercise library (500+ exercises with muscle group tags)
- For each exercise:
  - Exercise name + muscle group badge
  - Add sets: each set has [Set #] [kg] [Reps] [✓ Complete]
  - Rest timer between sets (auto-starts after completing a set)
  - "Add Set" button
  - "Remove Exercise" button
- "Add Another Exercise" button
- Superset support (group two exercises together)

**Bottom Bar:**
- Total volume calculated in real time
- "Finish Workout" button → saves & shows summary

**Workout Summary Modal (after finishing):**
- Duration, total volume, PRs broken (with celebration animation)
- Power Level increase animation
- Share workout button
- "Log Another" / "Go to Dashboard"

---

### 5. `/classes` — Class Booking

**Header:**
- Week picker (Mon–Sun with dates)
- Filter by type: All / Strength / HIIT / Yoga / Recovery / Boxing

**Class Schedule Grid:**
- Timeline view (6am–10pm)
- Each class card:
  - Class name & type (color coded)
  - Time & duration
  - Coach name + avatar
  - Spots: "8/15 remaining" (red when <3 left)
  - "Book" button / "Booked ✓" / "Join Waitlist"

**My Bookings Tab:**
- Upcoming booked classes
- Past attended classes
- Cancel button (if >2 hours before class)

---

### 6. `/classes/:id` — Class Detail Page

- Full class description
- Coach bio + photo
- Location in gym (e.g., "Chamber 2 — HIIT Floor")
- Equipment needed
- Difficulty level (Beginner / Intermediate / Advanced)
- What to bring
- List of other members who booked (with privacy option)
- "Book This Class" / "Cancel Booking" button
- Google Calendar export button

---

### 7. `/progress` — Progress & Analytics

**Body Metrics Section:**
- Input fields: Weight, Body Fat %, Muscle Mass, Waist, Chest, Arms
- Date picker to log new measurement
- Line charts for each metric over time (1W / 1M / 3M / 6M / 1Y)

**Strength Progress Section:**
- Select exercise from dropdown
- Line chart showing max weight over time
- Table of all logged sets for that exercise

**Workout Frequency Chart:**
- Heatmap calendar (GitHub-style) showing workout days
- Streaks visualization

**Monthly Report Card:**
- Auto-generated summary: "In June you trained 18 times, lifted 45,000 kg total, and set 3 new PRs"
- Download as PDF button (paid tiers only)
- Blurred preview for free tier with "Upgrade to unlock"

**Before/After Photos:**
- Upload progress photos with date tags
- Side-by-side comparison slider
- Private by default, can make public for community

---

### 8. `/nutrition` — Nutrition Tracker

**Today's Summary Bar:**
- Calories: 1,840 / 2,400 kcal (circular progress)
- Protein: 142g / 180g
- Carbs: 210g / 250g
- Fats: 58g / 70g

**Meal Log:**
- 4 meal slots: Breakfast, Lunch, Dinner, Snacks
- Each meal: add food items via search (database of 1M+ foods)
- Quick-add barcode scanner (mobile)
- Each food shows: calories, protein, carbs, fats

**Water Tracker:**
- 8 glass circles that fill as user logs water
- +250ml button

**Meal Plans Section (paid):**
- Pre-built meal plans by goal (Bulk / Cut / Maintenance)
- Can set as weekly template
- Locked for free tier

---

### 9. `/achievements` — Gamification Hub

**My Badges Section:**
- Grid of all achievements
- Unlocked: full color with unlock date
- Locked: dark with description of how to unlock

**Achievement Categories:**
```
CONSISTENCY
├── "First Step" — Log your first workout
├── "Warrior's Path" — 7-day streak
├── "Iron Will" — 30-day streak
├── "Legendary Discipline" — 100-day streak

STRENGTH
├── "Stone Fist" — Bench press your bodyweight
├── "Crusher" — Squat 1.5× your bodyweight
├── "Earth Shaker" — Deadlift 2× your bodyweight
├── "Unstoppable" — Break 10 personal records

COMMUNITY
├── "First Class" — Attend your first group class
├── "Social Warrior" — Attend 50 classes
├── "The Pillar" — Top 3 on monthly leaderboard

POWER LEVEL
├── "Awakening" — Reach Power Level 1000
├── "Super Saiyan" — Reach Power Level 5000
├── "Legendary" — Reach Power Level 9000
```

**Monthly Leaderboard:**
- Ranked by sessions attended
- Top 10 with avatars, names, scores
- User's own rank highlighted
- Resets every month
- Winners get badge + profile frame

**Power Level Breakdown:**
- Breakdown of how their score is calculated
- +10 per workout logged
- +15 per class attended
- +5 per day of streak
- +50 for each PR broken
- +20 for each achievement unlocked

---

### 10. `/profile` — Member Profile

**Avatar Section:**
- Profile photo upload
- Display name
- Member since date
- Membership tier badge with animated glow

**Personal Info:**
- Name, email, phone (editable)
- DOB, gender
- Height, current weight
- Fitness goal, experience level

**Stats Summary:**
- Total workouts, classes attended, PRs set
- Longest streak ever, current streak
- Power Level with rank title

**Privacy Settings:**
- Show on leaderboard (toggle)
- Allow coach to view nutrition log (toggle)
- Profile visibility (Public / Members only / Private)

**Notification Settings:**
- Class reminders (30 min before)
- Streak reminders (if not trained by 7pm)
- New program available
- Coach messages
- Weekly progress report

---

### 11. `/membership` — Membership & Billing

**Current Plan Card:**
- Plan name with animated tier badge
- Price & billing date
- Features list with checkmarks
- "Upgrade Plan" button

**Gym Check-in QR Code:**
- Large animated QR code
- Scan at gym entrance
- "Valid Today" green status indicator

**Billing History:**
- Table of past invoices
- Download as PDF

**Upgrade/Change Plan:**
- Side-by-side comparison of all tiers
- Features locked in current tier shown with lock icons
- "Upgrade" CTA with payment flow (Stripe integration)

---

## 🔐 Admin Panel — All Pages

---

### 12. `/admin` — Admin Dashboard

**KPI Cards:**
- Total Active Members
- New Members This Month
- Revenue This Month
- Classes Scheduled This Week
- Check-ins Today

**Charts:**
- Revenue line chart (last 12 months)
- Member growth bar chart
- Most popular class types pie chart
- Peak hours heatmap

**Today's Schedule:**
- All classes happening today with coach & spots info
- Quick "Cancel Class" button

**Recent Activity Feed:**
- New member signups
- Membership upgrades
- Cancellations

---

### 13. `/admin/members` — Member Management

**Member Table:**
- Name, email, plan, join date, last active, status
- Sort & filter by any column
- Search by name/email
- Export as CSV

**Member Actions:**
- View full profile
- Edit plan/details
- Send message
- Pause/cancel membership
- Add manual check-in

**Bulk Actions:**
- Send email to all members of a plan
- Export selected members

---

### 14. `/admin/classes` — Class Management

**Class Schedule View:**
- Weekly calendar grid
- Click any slot to create a class
- Drag to reschedule

**Create/Edit Class Form:**
- Class name, type, description
- Coach (dropdown of coaches)
- Date, start time, duration
- Max capacity
- Location in gym
- Equipment needed
- Difficulty level
- Recurring (daily/weekly)

**Class Analytics:**
- Average attendance per class type
- Most popular time slots
- Coach ratings (from member feedback)

---

### 15. `/admin/coaches` — Coach Management

- Add/remove coaches
- Coach profile: name, bio, photo, specialization
- Classes assigned
- Member ratings & reviews
- Availability schedule
- Pay rate (for internal tracking)

---

### 16. `/admin/payments` — Revenue & Billing

**Revenue Overview:**
- Total MRR (Monthly Recurring Revenue)
- Breakdown by plan tier
- Churn rate
- Average revenue per member

**Transactions Table:**
- Date, member, plan, amount, status
- Filter by date range, plan, status
- Refund button per transaction

**Failed Payments:**
- List of failed/pending payments
- Retry payment button
- Send reminder email button

---

### 17. `/admin/analytics` — Business Analytics

- Member retention rate (cohort analysis)
- Class utilization rate (% of spots filled on average)
- Most/least popular classes
- Member journey (signup → first class → subscription)
- Revenue forecast
- Geographic distribution of members (if multi-location)

---

### 18. `/admin/settings` — Gym Settings

**Branding:**
- Gym name, logo upload
- Primary color picker (replaces amber theme with gym's brand color)
- Hero image upload (replaces Goku image with gym's photo)

**Business Info:**
- Address, phone, website
- Opening hours
- Social media links

**Plans & Pricing:**
- Create/edit membership plans
- Set prices, features per plan

**Integrations:**
- Stripe (payment)
- Google Calendar sync
- Email provider (SendGrid/Mailgun)
- WhatsApp notifications

---

## 🛠️ Tech Stack Recommendation

```
FRONTEND (what we already have)
├── React + Vite
├── React Router DOM (routing)
├── CSS (no Tailwind, keep existing style)
├── GSAP (animations, already installed)
├── Recharts or Chart.js (analytics charts)
└── React Query (data fetching + caching)

BACKEND (needs to be built)
├── Node.js + Express.js (REST API)
├── PostgreSQL (database)
├── Prisma (ORM)
├── JWT (authentication)
├── Stripe (payments)
├── Cloudinary (image uploads)
└── SendGrid (emails)

HOSTING
├── Frontend: Vercel (free tier works)
├── Backend: Railway or Render ($5–20/month)
└── Database: Supabase (free PostgreSQL)
```

---

## 📁 Frontend Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   └── AdminLayout.jsx
│   ├── ui/
│   │   ├── Card.jsx
│   │   ├── Button.jsx
│   │   ├── Badge.jsx
│   │   ├── Modal.jsx
│   │   ├── Chart.jsx
│   │   ├── ProgressRing.jsx
│   │   ├── PowerLevelGauge.jsx
│   │   └── StreakCalendar.jsx
│   ├── dashboard/
│   │   ├── PowerLevelCard.jsx
│   │   ├── WeeklyStreakCard.jsx
│   │   ├── NextClassCard.jsx
│   │   ├── WeekStatsCard.jsx
│   │   └── LeaderboardPreview.jsx
│   ├── workouts/
│   │   ├── WorkoutCard.jsx
│   │   ├── ExerciseLogger.jsx
│   │   ├── SetRow.jsx
│   │   └── WorkoutSummaryModal.jsx
│   ├── classes/
│   │   ├── ClassCard.jsx
│   │   └── ClassScheduleGrid.jsx
│   └── admin/
│       ├── MemberTable.jsx
│       ├── RevenueChart.jsx
│       └── ClassCalendar.jsx
│
├── pages/
│   ├── LandingPage.jsx (existing)
│   ├── LoginPage.jsx (existing)
│   ├── SignupPage.jsx
│   ├── Dashboard.jsx
│   ├── WorkoutsPage.jsx
│   ├── WorkoutLogPage.jsx
│   ├── ClassesPage.jsx
│   ├── ProgressPage.jsx
│   ├── NutritionPage.jsx
│   ├── AchievementsPage.jsx
│   ├── ProfilePage.jsx
│   ├── MembershipPage.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── AdminMembers.jsx
│       ├── AdminClasses.jsx
│       ├── AdminPayments.jsx
│       ├── AdminAnalytics.jsx
│       └── AdminSettings.jsx
│
├── context/
│   ├── AuthContext.jsx
│   └── GymContext.jsx
│
├── hooks/
│   ├── useAuth.js
│   ├── usePowerLevel.js
│   ├── useWorkouts.js
│   └── useClasses.js
│
├── utils/
│   ├── api.js
│   └── formatters.js
│
└── App.jsx (routing)
```

---

## 🎨 Design System (Keep Existing)

```css
Colors:
  --bg-dark: #070302
  --accent-orange: #ff5500
  --accent-gold: #ffaa00
  --text-primary: #f5ede6
  --text-secondary: #a3958c

Power Level Colors:
  --level-normal: #ff7700    (0-2999)
  --level-elite: #ff2200     (3000-6999)
  --level-legendary: #ffcc00 (7000-9999)

Fonts:
  --font-sans: 'Outfit'
  --font-heading: 'Cinzel'
  --font-accent: 'Playfair Display' italic
```

---

## 🔑 Key UX Principles for the Agent Building This

1. **Every page uses dark glassmorphism cards** — same as existing site
2. **Amber/orange is the only accent color** — no blue, green, etc.
3. **All numbers animate on load** — count up from 0
4. **Locked features show a blurred preview** with an upgrade CTA, never a hard error
5. **Power Level gauge is on every page** — small version in sidebar
6. **Mobile first** — the member portal must work on phones
7. **Sidebar collapses to icons on mobile** — tap to expand
8. **Smooth page transitions** — fade between routes
9. **Empty states are never boring** — e.g. "No workouts yet? Your legend starts today." with an illustration
10. **All data loads with skeleton placeholders** — never a blank white flash

---

## 🚀 Build Order for the Agent

Build in this exact order (each step works standalone):

1. **Auth system** — signup, login, JWT, protected routes
2. **Layout** — sidebar, topbar, mobile nav
3. **Dashboard page** — all cards with mock data first
4. **Workout logger** — most important member feature
5. **Class booking** — second most important
6. **Progress charts** — analytics
7. **Achievements** — gamification
8. **Profile + Membership** — account management
9. **Admin panel** — member management + analytics
10. **Payment integration** — Stripe subscription
11. **Notifications** — email + in-app
12. **Polish** — animations, transitions, empty states

---

> **Note to the building agent:** The landing page (`/`) and login page (`/login`) are already built and look premium. Match that exact same visual quality for every new page. The design language is dark luxury, anime-inspired, glassmorphism, amber/orange accents. Do NOT introduce any new colors or fonts.
