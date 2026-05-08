import type { AgentTemplate, CommandTemplate, SkillTemplate } from "../templates/types.js";

export type HostId = "claude" | "codex" | "copilot" | "pi";

export interface CatalogConfig {
  version: string;
  hosts: HostId[];
  packages?: string[];
}

export interface BuiltInCatalog {
  skills: SkillTemplate[];
  agents: AgentTemplate[];
  commands: CommandTemplate[];
}

export interface HostDescriptor {
  id: HostId;
  name: string;
  homeDir: string;
  projectMarker: string;
}

export interface SyncManifestEntry {
  path: string;
  kind: "file" | "symlink";
  hash: string;
  templateId: string;
  adapterVersion: string;
}

export interface SyncManifest {
  version: number;
  scopes: Partial<Record<HostId | "catalog", SyncManifestEntry[]>>;
}

export interface SyncAction {
  path: string;
  kind: "file" | "symlink";
  content?: string;
  target?: string;
  hash?: string;
  templateId?: string;
  scope?: HostId | "catalog";
  adapterVersion?: string;
}

export interface SyncHostResult {
  host: HostId | "catalog";
  created: number;
  updated: number;
  removed: number;
  tracked: string[];
}

export interface SyncResult {
  catalogPath: string;
  hosts: SyncHostResult[];
}

export interface InitResult {
  configPath: string;
  catalogPath: string;
  detectedHosts: HostId[];
  enabledHosts: HostId[];
}

export interface DoctorIssue {
  level: "error" | "warning";
  message: string;
}

export interface DoctorResult {
  configPath: string;
  catalogPath: string;
  hosts: HostId[];
  issues: DoctorIssue[];
}

export interface HostStatus {
  id: HostId;
  name: string;
  detected: boolean;
  enabled: boolean;
  homePath: string;
}
