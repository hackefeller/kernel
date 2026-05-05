export type RecordStatus = "active" | "done" | "archived";

export type KnowledgeKind = "research" | "runbook" | "concept";

export interface FrontmatterRecordBase {
  id: string;
  title: string;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
  doneAt?: string;
}

export interface GoalFrontmatter extends FrontmatterRecordBase {
  tags?: string[];
  linkedKnowledgeIds?: string[];
}

export interface EpicFrontmatter extends FrontmatterRecordBase {
  goalId?: string;
  targetDate?: string;
  tags?: string[];
  linkedKnowledgeIds?: string[];
}

export interface TaskFrontmatter extends FrontmatterRecordBase {
  goalId?: string;
  epicId?: string;
  tags?: string[];
  linkedKnowledgeIds?: string[];
  checklist: ChecklistItem[];
}

export interface KnowledgeFrontmatter extends FrontmatterRecordBase {
  kind: KnowledgeKind;
  tags?: string[];
  linkedWorkIds?: string[];
}

export interface LearningFrontmatter extends FrontmatterRecordBase {
  taskId: string;
  archivedAt: string;
  linkedGoalIds?: string[];
  linkedEpicIds?: string[];
  linkedKnowledgeIds?: string[];
}

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
  researchDir: string;
  runbooksDir: string;
  conceptsDir: string;
  stateDir: string;
  pointersPath: string;
}
