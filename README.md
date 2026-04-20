# Agenti v1 — Premium Director Workspace

Agenti is an iPad-first, local-first director operating workspace built for focused execution.

## Architecture
- **TypeScript-first SPA** with modular domain logic in `src/core` and UI modules in `src/app.ts`.
- **Local-first persistence** via browser `localStorage` with seeded demo workspace on first load.
- **Typed domain model** for ideas, tasks, quadrant routing, 8% human-value focus, 92% automation queue, templates, agents, workflows, and studio history.
- **No external secrets / no mandatory auth** for v1.
- **Vercel ready**: static output deploys from standard repository layout.
- **Netlify fallback**: generated `/netlify-drop` folder for manual drag-and-drop deploy.

## Features
- Command Center overview with KPI cards
- Idea Capture → convert idea into tasks/workflows
- Weekly Task Inbox with quadrant + score + automation route calculations
- Quadrant Board (Q1–Q4)
- 8 Percent Focus and 92 Percent Automation Queue
- Agent Library, Workflow Builder, template save/duplicate/archive/restore
- Writing / Research / Analysis / Scheduling / Drafting / Build / Social Prompt / Video Prompt studios with output history
- Daily Brief synthesis
- Workspace JSON export/import
- Archive/restore flows and seeded demo content

## Run
```bash
npm run build
```
Then host `netlify-drop/` with any static server.

## Test
```bash
npm run test
```

## Deploy
- **Vercel**: connect GitHub repo and deploy branch/main normally.
- **Netlify drag-and-drop**: upload the generated `netlify-drop/` folder.
