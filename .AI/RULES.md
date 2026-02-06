---
description: Rules for PRD generation, task breakdown, and task execution control
globs: ["**/*.md"]
alwaysApply: true
---

# AI Operating Rules for Product Development

These rules define how the AI must assist in planning, breaking down, and executing product development work using PRDs and task lists.

They are designed to:
- Generate clear PRDs
- Derive structured task lists
- Enforce disciplined, step-by-step execution
- Prevent uncontrolled scope creep

---

## RULE 1: Generating a Product Requirements Document (PRD)

### Goal

Guide the AI to create a clear, actionable Product Requirements Document (PRD) in Markdown format, suitable for a **junior developer** to understand and implement.

### Process

1. Receive a brief feature description from the user.
2. **Before writing the PRD, ask clarifying questions.**
   - Focus on *what* and *why*, not *how*.
3. Generate the PRD only after the user answers the questions.
4. Save the PRD as:
/.cursor/dev-planning/prd/prd-[feature-name].md


### Clarifying Question Areas (examples)

- Problem / goal
- Target user
- Core functionality
- User stories
- Acceptance criteria
- Scope boundaries (non-goals)
- Data requirements
- Design or UI constraints
- Edge cases and error states

### Required PRD Structure

1. Introduction / Overview
2. Goals
3. User Stories
4. Functional Requirements (numbered)
5. Non-Goals (Out of Scope)
6. Design Considerations (optional)
7. Technical Considerations (optional)
8. Success Metrics
9. Open Questions

### Hard Constraints

- Do **NOT** start implementation
- Always ask clarifying questions first
- Improve the PRD using the user’s answers
- Output must be Markdown

---

## RULE 2: Generating a Task List from a PRD

### Goal

Create a structured, step-by-step task list derived from an existing PRD.

### Output Location
/.cursor/dev-planning/tasks/tasks-[prd-file-name].md


### Process

1. User references a PRD file.
2. Analyze:
   - Functional requirements
   - User stories
   - Scope and constraints
3. **Phase 1 – Parent Tasks**
   - Generate ~5 high-level tasks.
   - Do **NOT** generate subtasks yet.
   - Ask the user to confirm with **"Go"**.
4. **Phase 2 – Subtasks**
   - Break each parent task into actionable subtasks.
5. Identify relevant files (including test files).
6. Save the final task list.

### Mandatory Task List Structure

```md
## Relevant Files

- path/to/file.ts — Description
- path/to/file.test.ts — Unit tests

### Notes

- Tests should live next to the files they test
- Use `npx jest` to run tests

## Tasks

- [ ] 1.0 Parent Task
  - [ ] 1.1 Subtask
  - [ ] 1.2 Subtask
- [ ] 2.0 Parent Task

Interaction Constraint

The AI must pause after parent tasks and wait for "Go".

## RULE 3: Task Execution and Progress Management

### Execution Discipline

- Work on one sub-task at a time
- Never start the next sub-task without explicit user approval ("yes" or "y")

### Completion Protocol

- When a sub-task is finished:
  - Mark it [x]
- When all subtasks of a parent task are [x]:
  - Mark the parent task [x]
- Stop and wait for user confirmation after each sub-task

### Task List Maintenance

- Keep task list updated at all times
- Add new tasks only with explicit approval
- Maintain an accurate Relevant Files section

### AI Behavioral Rules

- **Before working:**
  - Identify the next incomplete sub-task
- **After working:**
  - Update the task list
  - Pause for approval

### Definition of Significant Work

Any of the following:
- Completing a sub-task
- Completing a PRD section
- Refactoring affecting multiple files

⚠️ **Never make automatic or silent changes to the task list.**


---

## 🧠 POR QUE ESSE FORMATO É O “FINAL”

- ✔ Compatível com **Claude Code / Antigravity / Codex**
- ✔ Não depende de semântica interna do Cursor
- ✔ Mantém controle rígido de execução (estilo “AI como dev júnior”)
- ✔ Facilita versionamento em Git
- ✔ Evita frontmatter inválido

