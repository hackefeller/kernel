---
name: kernel-task-archive
kind: command
tags: [workflow]
description: Archive a completed task and write a learnings essay to .kernel/knowledge/learnings/.
group: workflow
target: task archive
argumentHint: optional task id
---

Archive a task when its planned work is complete or deliberately closed, then write a permanent learnings essay capturing what happened and why it matters.

## Steps

1. **Identify the task.** If an ID was provided use it; otherwise read the active task from `.kernel/work/tasks/`.

2. **Run the archive CLI.**
   ```
   kernel task archive [taskId]
   ```
   Note any incomplete checklist warnings from the output.

3. **Read the task record.** Open `task.yaml` and `task.md` from the archived location (`.kernel/work/tasks/archived/<taskId>/`). Read linked knowledge, epic, and goal IDs from `task.yaml`.

4. **Write a learnings essay.** Create `.kernel/knowledge/learnings/<slug>.md` where `<slug>` is a short kebab-case summary of the task's core insight (not the task ID). Use this exact structure — every section is required:

```markdown
# <Descriptive Title: What Was Done and the Central Insight>

## Abstract

One paragraph. What was the scope of the work, what was the core problem solved, and what was the outcome. Written for someone who has never seen the task.

## Problem

What was broken, missing, or unclear before this task started? Be specific about symptoms and scope.

## Background

Context a reader needs to understand why this problem existed and why the chosen approach made sense. Include relevant prior decisions, constraints, or knowledge records.

## Approach

How was the problem tackled? Document key decision points, alternatives considered, and why the chosen path was taken over others.

## Implementation

Concrete specifics: what files or modules changed, what was added or removed, what contracts were established. Include code snippets only when they clarify a non-obvious decision.

## Outcomes

What is measurably different now? List what works, what was confirmed correct, and what was explicitly deferred.

## Lessons Learned

**Bold claim per lesson, followed by a sentence explaining why it matters or what evidence supports it.** Aim for 3–5 lessons. Each should be generalisable beyond this task — something a future engineer could apply to a different problem.

## References

- Task: `<taskId>` (archived <YYYY-MM-DD>)
- Link any relevant epics, goals, decisions, research, or concept records by ID.
```

5. **Ensure the learnings directory exists** before writing:
   ```
   mkdir -p .kernel/knowledge/learnings
   ```

6. **Do not** create a yaml sidecar — learnings are plain markdown only.

7. **Report** the path of the written essay and any archive warnings.

To reopen an archived task, run `kernel task restore <taskId>`.
