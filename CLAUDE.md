# CLAUDE.md - flashcard.ai

> **Documentation Version**: 1.0
> **Last Updated**: 2026-03-17
> **Project**: flashcard.ai
> **Description**: flashcard.ai combines flashcard with AI to make your learning more effective and challenging. It uses spaced-interval method to help retain information better and paraphrase the flashcards content to challenge learner.
> **Stack**: Next.js 15 + TypeScript + Tailwind CSS
> **Features**: GitHub auto-backup, Task agents, technical debt prevention

This file provides essential guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL RULES - READ FIRST

### ❌ ABSOLUTE PROHIBITIONS
- **NEVER** create new files in root directory → use proper module structure
- **NEVER** write output files directly to root directory → use designated output folders
- **NEVER** create documentation files (.md) unless explicitly requested by user
- **NEVER** use git commands with -i flag (interactive mode not supported)
- **NEVER** use `find`, `grep`, `cat`, `head`, `tail`, `ls` commands → use Read, Grep, Glob tools instead
- **NEVER** create duplicate files (manager_v2.py, enhanced_xyz.py, utils_new.js) → ALWAYS extend existing files
- **NEVER** create multiple implementations of same concept → single source of truth
- **NEVER** copy-paste code blocks → extract into shared utilities/functions
- **NEVER** hardcode values that should be configurable → use config files/environment variables
- **NEVER** use naming like enhanced_, improved_, new_, v2_ → extend original files instead

### 📝 MANDATORY REQUIREMENTS
- **COMMIT** after every completed task/phase - no exceptions
- **GITHUB BACKUP** - Push to GitHub after every commit: `git push origin main`
- **READ FILES FIRST** before editing
- **DEBT PREVENTION** - Before creating new files, check for existing similar functionality
- **SINGLE SOURCE OF TRUTH** - One authoritative implementation per feature/concept

### 🔍 PRE-TASK COMPLIANCE CHECK
Before starting any task:
- [ ] Will this create files in root? → Use proper module structure instead
- [ ] Does similar functionality exist? → Extend existing code
- [ ] Am I creating a duplicate? → Consolidate instead

## 🏗️ PROJECT STRUCTURE

```
flashcard/
├── CLAUDE.md              # Claude Code rules
├── README.md              # Project documentation
├── .gitignore
├── src/
│   ├── app/               # Next.js App Router pages & API routes
│   │   ├── api/           # API routes (AI, spaced repetition logic)
│   │   ├── (routes)/      # Page routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/        # Reusable React components
│   │   ├── ui/            # Generic UI components (Button, Card, etc.)
│   │   └── flashcard/     # Flashcard-specific components
│   ├── lib/               # Shared utilities & logic
│   │   ├── ai.ts          # AI/Claude API integration
│   │   ├── spaced-rep.ts  # Spaced repetition algorithm (SM-2)
│   │   └── db.ts          # Data persistence helpers
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
└── tests/                 # Test files
```

## 🎯 PROJECT OVERVIEW

**flashcard.ai** is a Next.js web app that:
- Lets users create and study flashcard decks
- Uses the **SM-2 spaced repetition algorithm** to schedule reviews
- Integrates **Claude AI** to paraphrase/rephrase card content to challenge learners
- Tracks learning progress and due dates

### Key Features
- Create/edit/delete flashcard decks and cards
- Spaced repetition scheduling (SM-2 algorithm)
- AI-powered card paraphrasing to prevent rote memorization
- Study session UI (flip cards, rate difficulty)
- Progress tracking

## 🚀 COMMON COMMANDS

```bash
npm run dev       # Start development server (localhost:3000)
npm run build     # Production build
npm run lint      # Run ESLint
npm test          # Run tests
```

## 🔧 ENVIRONMENT VARIABLES

```env
ANTHROPIC_API_KEY=   # Claude API key for AI paraphrasing
```

## 🤖 AI INTEGRATION

Use the Anthropic SDK (`@anthropic-ai/sdk`) for card paraphrasing. All AI calls go through `src/lib/ai.ts`. Use `claude-sonnet-4-6` as the default model.

## 🚨 TECHNICAL DEBT PREVENTION

### ✅ CORRECT APPROACH:
1. **Search first** - Use Grep/Glob to find existing implementations
2. **Read existing** - Understand current patterns before modifying
3. **Extend existing** - Add to existing files rather than creating new ones
