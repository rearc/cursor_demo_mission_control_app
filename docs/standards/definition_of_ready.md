# Definition of Ready

A ticket is Ready when a developer can start working on it without needing to ask clarifying questions. Every ticket must satisfy all of the following criteria before it moves from Backlog to Ready.

## Required fields

- [ ] **Acceptance criteria**: At least three specific, testable statements describing what "done" looks like. Vague criteria like "it should work" or "needed for trust" do not count.
- [ ] **Dependencies declared**: If this ticket depends on another ticket, a model that does not exist yet, or an external service, those dependencies must be listed explicitly. A developer should never discover a blocker after starting work.
- [ ] **Scope boundaries**: The ticket must state what is in scope and what is out of scope. If the ticket does not say what it will NOT do, the scope is undefined.
- [ ] **Assignee**: Someone owns this ticket. Unassigned tickets cannot be Ready.
- [ ] **Story points estimated**: The team has sized this ticket. Template-default values do not count as an estimate.

## Required context

- [ ] **Description is current with the codebase**: The ticket's description must reflect the actual state of the code, not what the author remembers. If the ticket describes work that is already done, it is not Ready -- it needs to be re-scoped or closed.
- [ ] **Component or area identified**: The ticket names the part of the system it touches (e.g., "backend/app/services/", "frontend/src/components/cards/"). This helps the AI and the developer understand blast radius.

## Recommended (not blocking)

- [ ] **Linked to an Epic**: The ticket should reference its parent Epic so the broader context is traceable.
- [ ] **Priority set**: Urgent, High, Normal, or Low. Helps sprint planning but does not block readiness.
- [ ] **Sprint assigned**: The ticket should be placed in a sprint or explicitly marked as Backlog (uncommitted).

## How this document is used

This Definition of Ready is read by both humans and AI assistants. When an AI agent is asked to check whether a ticket is ready, it reads this file and evaluates the ticket against each criterion. If any required criterion is not met, the agent flags the gap and refuses to advance the ticket.

When the team's standards change, update this file and commit it. The AI will pick up the new standards on the next run.
