export type RecordStatus = "active" | "done" | "archived";

export type KnowledgeKind = "decision" | "research" | "runbook" | "concept";

export interface ChecklistItem {
  id: string;
  title: string;
  done: boolean;
  completedAt?: string;
}

export interface GoalRecord {
  id: string;
  title: string;
  status: RecordStatus;
  tags?: string[];
  linkedKnowledgeIds?: string[];
  doneAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EpicRecord {
  id: string;
  title: string;
  status: RecordStatus;
  goalId?: string;
  targetDate?: string;
  tags?: string[];
  linkedKnowledgeIds?: string[];
  doneAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskRecord {
  id: string;
  title: string;
  status: RecordStatus;
  goalId?: string;
  epicId?: string;
  tags?: string[];
  linkedKnowledgeIds?: string[];
  doneAt?: string;
  createdAt: string;
  updatedAt: string;
  checklist: ChecklistItem[];
}

export interface KnowledgeRecord {
  id: string;
  title: string;
  kind: KnowledgeKind;
  status: RecordStatus;
  tags?: string[];
  linkedWorkIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectOsLayout {
  rootDir: string;
  kernelDir: string;
  readmePath: string;
  projectPath: string;
  gitignorePath: string;
  goalsDir: string;
  epicsDir: string;
  activeTasksDir: string;
  archivedTasksDir: string;
  knowledgeDir: string;
  decisionsDir: string;
  researchDir: string;
  runbooksDir: string;
  conceptsDir: string;
  stateDir: string;
  pointersPath: string;
}
