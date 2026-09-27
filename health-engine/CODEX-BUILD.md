# Health Engine --- Codex Build Instructions

## Mission

Implement the approved Health Engine product exactly as defined by the
build pack.

Health Engine is a personal fitness web application with: - a TV-first
Gym Mode for a 32-inch Fire TV / Amazon Silk display controlled with an
air mouse; - a PC Admin Mode for configuration and history; - Supabase
persistence using the existing Map Engine Supabase project.

This document controls implementation sequencing. It does not replace
the functional specification.

## Required reading before coding

Read these files in full before making changes:

1.  `Health-Engine-SPEC.md`
2.  `Health-Engine-ASSET-MANIFEST.md`
3.  `Health-Engine-SUPABASE.sql`
4.  This file: `CODEX-BUILD.md`

Also inspect all supplied reference mock-ups and the existing repository
structure.

Do not begin implementation until you understand the repository and can
identify where Health Engine will live.

## Source-of-truth hierarchy

When sources conflict, use this order:

1.  `Health-Engine-SPEC.md` --- functional behaviour.
2.  `Health-Engine-SUPABASE.sql` --- persistence/data model.
3.  `Health-Engine-ASSET-MANIFEST.md` --- canonical asset paths and
    usage.
4.  Approved reference mock-ups --- visual appearance only.
5.  Existing code patterns --- implementation guidance only.

Text accidentally visible in AI-generated mock-ups is not authoritative.

## Non-negotiable rules

DO NOT independently redesign approved screens.

DO NOT add functionality merely because it appears useful.

DO NOT create Strength A/B routines.

DO NOT create additional cardio machines.

DO NOT create a treadmill Start/Pause/active-session timer.

DO NOT automatically increase Strength weights.

DO NOT modify, migrate, delete or depend upon existing `uber_*` tables.

DO NOT replace supplied exercise imagery with generated, stock or
internet imagery.

DO NOT crop production images from contact sheets.

DO NOT implement later stages until explicitly instructed.

DO NOT use LocalStorage as the source of truth for workout configuration
or history.

DO NOT introduce small controls, hover-only interactions, text entry or
complex dropdowns into TV Gym Mode.

If something required by the specification is genuinely ambiguous, stop
and report the ambiguity instead of inventing product behaviour.

## Repository safety

Before changing code:

1.  Inspect the repository structure.
2.  Identify framework, package manager, build commands and existing
    conventions.
3.  Identify whether Health Engine is a new application/package or an
    isolated area of an existing repository.
4.  Inspect Supabase integration without changing existing Map Engine
    behaviour.
5.  Report any conflict between the repository and this build pack.

Preserve existing unrelated functionality.

## Implementation quality

Use reusable components where the same interaction appears in multiple
places.

Examples: - TV numeric stepper. - TV primary action button. -
Timer/countdown. - Exercise navigation. - Celebration overlay. - Admin
form controls. - Supabase data access.

Keep domain logic separate from visual components where practical.

Strength progression eligibility must be implemented as testable domain
logic, not buried in display code.

Historical records must remain immutable in meaning when prescriptions
change later.

## Stage 1 --- Foundation only

Implement only:

-   Health Engine application shell.
-   Routing/navigation foundation.
-   Shared TV visual system.
-   Shared PC Admin visual system.
-   Supabase client/configuration layer.
-   Typed Health Engine data models.
-   Data-access functions/repositories for `health_*` tables.
-   Loading, empty and error states.
-   Responsive behaviour necessary for the 16:9 TV target and normal
    desktop Admin.
-   Asset-path resolver based on the Asset Manifest.
-   Development placeholders only where canonical assets are genuinely
    missing.

Do not implement complete Strength, Cardio or Mobility workflows during
Stage 1.

Stage 1 acceptance: - App starts successfully. - TV and Admin shells are
reachable. - Existing unrelated application functionality remains
intact. - Health Engine code does not access `uber_*` data. - Supabase
Health Engine access is isolated. - Build/typecheck/lint succeed where
those commands exist. - No major visual redesign has been introduced.

Stop after Stage 1 and report: - files changed; - architecture used; -
commands/tests run; - any missing assets; - any unresolved issues.

## Stage 2 --- PC Admin

Only after explicit instruction to continue.

Implement: - Strength Admin. - Cardio/treadmill Admin. - Mobility
Admin. - General Health Engine settings. - Appropriate validation. -
Supabase persistence. - Initial/default configuration seeding where
required.

Strength Admin fields must match the specification.

Cardio remains one treadmill.

Mobility must support TIME and REPS, sets, rest, per-side, ordering and
active/inactive.

Do not implement the TV workout workflows as part of Stage 2.

Stop and report after completion.

## Stage 3 --- TV Home and Strength

Only after explicit instruction.

Implement: - TV Home. - Strength workout flow. - Exercise navigation. -
Set recording. - Rest countdown. - Skip Rest. - Exercise-complete
transition. - Workout elapsed time. - End Workout / Save and Exit. -
Double-progression eligibility. - PROGRESSION EARNED presentation. -
ACCEPT / STAY. - Strength celebrations/sounds according to settings. -
Historical snapshot persistence.

Important: `12/12/12` on a 3-set 8--12 prescription earns progression.
`12/12/11` does not.

The progression recommendation must never change `current_weight_kg`
until ACCEPT is explicitly selected.

Stop and report after completion.

## Stage 4 --- Cardio and Mobility

Only after explicit instruction.

### Cardio

Implement post-session treadmill recording only: - duration; - speed; -
incline; - distance; - sensible previous/default values; - Save
Cardio; - completion feedback.

There is no active cardio workout timer.

### Mobility

Implement: - ordered active exercise list; - TIME exercises; - REPS
exercises; - per-side handling; - sets; - rest where configured; -
common timer reuse where appropriate; - KEEP / UNSURE / DROP feedback if
retained by the functional spec; - session completion and persistence.

Stop and report after completion.

## Stage 5 --- Progress, History and Badges

Only after explicit instruction.

Implement: - useful combined progress overview; - Strength
history/progression; - Cardio minutes/distance history; - Mobility
history; - session detail; - restrained achievements/badges; -
meaningful celebrations; - filtering/export where specified and
straightforward.

Avoid low-value dashboard statistics.

Stop and report after completion.

## Stage 6 --- Fire TV / Silk polish

Only after explicit instruction.

Perform a dedicated TV usability pass:

-   Verify 16:9 layout.
-   Verify readability from distance.
-   Verify large air-mouse targets.
-   Verify no required keyboard input.
-   Verify no hover dependency.
-   Verify timers and audio behaviour.
-   Verify navigation using Amazon Silk.
-   Verify focus/click behaviour.
-   Check overscan/safe spacing.
-   Check that browser chrome does not make critical controls
    inaccessible.
-   Compare final screens with approved visual references.

Also run final desktop Admin checks.

## Database instructions

`Health-Engine-SUPABASE.sql` is the approved schema definition.

Do not execute destructive changes against existing tables.

Do not rename existing Map Engine tables.

All Health Engine application-owned tables are prefixed `health_`.

If the SQL script conflicts with the actual Supabase project state,
report the conflict before applying a destructive workaround.

Never weaken RLS simply to make development easier.

## Assets

Follow `Health-Engine-ASSET-MANIFEST.md`.

Canonical application code should reference canonical paths even when a
final asset is temporarily missing.

A missing asset is not permission to invent one.

The final five Mobility subjects that currently exist together on a
reference/contact sheet require standalone production assets before
final visual acceptance.

## Visual fidelity

Reference mock-ups define: - composition; - density; - scale; - general
spacing; - panel treatment; - typography hierarchy; - visual emphasis; -
section colour identity.

They do not override functional corrections in `Health-Engine-SPEC.md`.

The target is a dedicated gym-console experience, not a generic
responsive dashboard template.

## Completion reporting format

At the end of every stage, provide a concise report containing:

### Completed

What was implemented.

### Files changed

Key files created or modified.

### Verification

Build, typecheck, lint and tests run, with results.

### Visual check

Which supplied reference screens were matched.

### Outstanding

Missing assets, ambiguities, environment requirements or known issues.

### Next stage

State the next defined stage but do not begin it.

## First Codex prompt

Use this after the build-pack files and references are present in the
repository:

> Read `CODEX-BUILD.md`, `Health-Engine-SPEC.md`,
> `Health-Engine-ASSET-MANIFEST.md` and `Health-Engine-SUPABASE.sql` in
> full before making any changes. Inspect the existing repository and
> supplied reference screens. The approved specification and references
> are not an invitation to redesign the product. Implement Stage 1 only
> from `CODEX-BUILD.md`. Preserve all unrelated existing functionality.
> When Stage 1 is complete, stop and report using the completion format
> defined in `CODEX-BUILD.md`.

## Subsequent prompt

After reviewing and accepting a completed stage:

> Stage \[N\] is accepted. Read the build pack again where necessary and
> implement Stage \[N+1\] only. Preserve the approved design and all
> previously accepted behaviour. Stop when that stage is complete and
> report using the required completion format.
