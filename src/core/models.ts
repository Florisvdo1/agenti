export type CapabilityZone =
  | 'Writing'
  | 'Research'
  | 'Analysis'
  | 'Scheduling'
  | 'Drafting'
  | 'Build Things';

export type Quadrant = 'Q1-Urgent-Important' | 'Q2-Strategic' | 'Q3-Delegate' | 'Q4-Eliminate';

export interface Idea {
  id: string;
  title: string;
  notes: string;
  createdAt: string;
  archived: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  zone: CapabilityZone;
  effort: number;
  impact: number;
  urgency: number;
  strategic: number;
  repeatability: number;
  quadrant: Quadrant;
  automationRoute: 'Automate' | 'Template' | 'Delegate' | 'Systemize' | 'Keep Human';
  score8: number;
  archived: boolean;
  createdAt: string;
}

export interface AgentCard {
  id: string;
  name: string;
  purpose: string;
  prompt: string;
  zone: CapabilityZone;
  archived: boolean;
}

export interface TemplateCard {
  id: string;
  title: string;
  content: string;
  type: 'Prompt' | 'Workflow' | 'System';
  archived: boolean;
}

export interface WorkflowCard {
  id: string;
  name: string;
  steps: string[];
  archived: boolean;
}

export interface StudioEntry {
  id: string;
  studio: string;
  title: string;
  output: string;
  timestamp: string;
}

export interface WorkspaceData {
  ideas: Idea[];
  tasks: Task[];
  agents: AgentCard[];
  templates: TemplateCard[];
  workflows: WorkflowCard[];
  history: StudioEntry[];
  settings: {
    ownerName: string;
    darkMode: boolean;
  };
}
