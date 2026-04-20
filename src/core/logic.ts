import { Task, Quadrant, WorkspaceData } from './models.js';

export const appStorageKey = 'agenti.workspace.v1';

export const id = () => Math.random().toString(36).slice(2, 10);

export function calculateQuadrant(task: Pick<Task, 'urgency' | 'impact' | 'strategic' | 'repeatability'>): Quadrant {
  if (task.urgency >= 7 && task.impact >= 7) return 'Q1-Urgent-Important';
  if (task.strategic >= 7 && task.impact >= 6) return 'Q2-Strategic';
  if (task.repeatability >= 6 || task.urgency <= 4) return 'Q3-Delegate';
  return 'Q4-Eliminate';
}

export function scoreEightPercent(task: Pick<Task, 'impact' | 'strategic' | 'effort' | 'repeatability'>): number {
  const value = task.impact * 0.45 + task.strategic * 0.35 - task.effort * 0.1 - task.repeatability * 0.1;
  return Number(Math.max(0, Math.min(10, value)).toFixed(2));
}

export function routeAutomation(task: Pick<Task, 'repeatability' | 'effort' | 'strategic' | 'score8'>): Task['automationRoute'] {
  if (task.score8 >= 8) return 'Keep Human';
  if (task.repeatability >= 8) return 'Automate';
  if (task.strategic >= 7 && task.repeatability >= 5) return 'Systemize';
  if (task.effort <= 4) return 'Template';
  return 'Delegate';
}

export function topEightPercentTasks(tasks: Task[]): Task[] {
  const sorted = [...tasks].filter((t) => !t.archived).sort((a, b) => b.score8 - a.score8);
  return sorted.slice(0, Math.max(1, Math.ceil(sorted.length * 0.08)));
}

export function automationQueue(tasks: Task[]): Task[] {
  return tasks.filter((t) => !t.archived && t.automationRoute !== 'Keep Human').sort((a, b) => b.repeatability - a.repeatability);
}

export function seedWorkspace(): WorkspaceData {
  const baseTasks: Array<Pick<Task, 'title' | 'description' | 'zone' | 'effort' | 'impact' | 'urgency' | 'strategic' | 'repeatability'>> = [
    { title: 'Board memo narrative', description: 'Write monthly board narrative with strategic lens.', zone: 'Writing', effort: 7, impact: 10, urgency: 6, strategic: 10, repeatability: 3 },
    { title: 'Competitive sweep', description: 'Summarize 5 competitor launches.', zone: 'Research', effort: 5, impact: 7, urgency: 5, strategic: 8, repeatability: 7 },
    { title: 'Pipeline anomaly review', description: 'Analyze drop in conversion funnel.', zone: 'Analysis', effort: 6, impact: 9, urgency: 8, strategic: 7, repeatability: 5 },
    { title: 'Team weekly scheduling', description: 'Prepare next week meeting blocks and reminders.', zone: 'Scheduling', effort: 4, impact: 6, urgency: 7, strategic: 4, repeatability: 9 },
    { title: 'Client proposal first draft', description: 'Draft proposal sections for enterprise deal.', zone: 'Drafting', effort: 6, impact: 8, urgency: 7, strategic: 8, repeatability: 6 },
    { title: 'Landing page experiment', description: 'Ship rapid MVP for onboarding variant.', zone: 'Build Things', effort: 8, impact: 9, urgency: 7, strategic: 9, repeatability: 4 }
  ];

  const tasks = baseTasks.map((t) => {
    const score8 = scoreEightPercent(t);
    return {
      ...t,
      id: id(),
      quadrant: calculateQuadrant(t),
      score8,
      automationRoute: routeAutomation({ ...t, score8 }),
      archived: false,
      createdAt: new Date().toISOString()
    };
  });

  return {
    ideas: [{ id: id(), title: 'AI-briefing ritual', notes: 'Turn daily signals into one execution brief.', createdAt: new Date().toISOString(), archived: false }],
    tasks,
    agents: [{ id: id(), name: 'Brief Synthesizer', purpose: 'Turn weekly inputs into concise brief', prompt: 'Summarize priorities, risks, and next actions.', zone: 'Analysis', archived: false }],
    templates: [{ id: id(), title: 'Weekly Narrative Prompt', content: 'Write a strategic weekly narrative with KPIs and blockers.', type: 'Prompt', archived: false }],
    workflows: [{ id: id(), name: 'Idea to Task Pipeline', steps: ['Capture idea', 'Classify quadrant', 'Score 8%', 'Route 92%'], archived: false }],
    history: [{ id: id(), studio: 'Writing Studio', title: 'Launch memo draft', output: 'Draft v1 created with three narrative arcs.', timestamp: new Date().toISOString() }],
    settings: { ownerName: 'Director', darkMode: true }
  };
}

export function loadWorkspace(): WorkspaceData {
  const raw = localStorage.getItem(appStorageKey);
  if (!raw) {
    const seeded = seedWorkspace();
    localStorage.setItem(appStorageKey, JSON.stringify(seeded));
    return seeded;
  }
  return JSON.parse(raw) as WorkspaceData;
}

export function saveWorkspace(data: WorkspaceData) {
  localStorage.setItem(appStorageKey, JSON.stringify(data));
}
