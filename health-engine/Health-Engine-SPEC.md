# Health Engine --- Locked Product Specification

## 1. Product purpose

Health Engine is a personal fitness application designed around two
distinct environments:

-   **Gym / TV Mode:** 16:9 interface running in Amazon Silk on a Fire
    TV Stick connected to a 32-inch TV. It is controlled primarily with
    a Bluetooth air mouse. Interaction must be extremely simple, large,
    and readable at distance.
-   **PC Admin Mode:** conventional desktop interface used to configure
    exercises, targets, progression, settings, history, and other
    detailed data.

The application is a separate codebase from Map Engine and Tax Engine.
It shares the existing **Map Engine Supabase project** but uses only
tables prefixed `health_`. Existing `uber_*` tables and Map Engine
functionality must not be modified.

**Supabase is the source of truth.** LocalStorage may be used only for
harmless transient UI state, never as the authoritative store for
workout configuration or history.

------------------------------------------------------------------------

## 2. Design language

### TV Mode

-   16:9 first.
-   Dark cinematic gym aesthetic.
-   Navy/black translucent rounded panels.
-   Bold, high-contrast white typography.
-   Large click targets suitable for an air mouse.
-   No text entry.
-   No hover-dependent functionality.
-   Avoid dropdowns.
-   Numeric changes use large vertical steppers: `▲ value ▼`.
-   Strength accent: blue.
-   Cardio accent: green.
-   Mobility accent: purple.
-   Timers and important completions use sound.
-   Approved supplied imagery must be used; Codex must not invent
    substitute artwork or redesign the visual language.

### PC Admin Mode

-   Desktop-first.
-   Light workspace with dark navy navigation.
-   Conventional forms, tables, toggles and editable fields are
    acceptable.
-   Admin defines prescriptions; TV Mode conducts and records sessions.

------------------------------------------------------------------------

## 3. TV Home

Brand:

**HEALTH ENGINE**\
**STRONGER · FITTER · HEALTHIER**

Primary content consists of three large activity cards:

1.  **Strength**
2.  **Cardio**
3.  **Mobility**

Each card shows useful last-session/current-week information and a large
action area.

Supporting navigation may include:

-   Home/Today
-   Progress/History
-   Badges
-   Settings where appropriate

Avoid duplicate navigation controls.

------------------------------------------------------------------------

## 4. Strength

### 4.1 Routine

There is **one repeating Strength workout**, not A/B routines.

Exercise order:

1.  Squat
2.  Bench Press
3.  Seated Shoulder Press
4.  Barbell Row
5.  EZ Bar Bicep Curl
6.  Deadlift

Initial defaults are configurable in Admin and must not be hard-coded as
permanent rules.

Suggested starting prescription:

  Exercise                  Sets    Reps   Progression
  ----------------------- ------ ------- -------------
  Squat                        3   8--12         +2 kg
  Bench Press                  3   8--12         +2 kg
  Seated Shoulder Press        3   8--12         +1 kg
  Barbell Row                  3   8--12         +2 kg
  EZ Bar Bicep Curl            3   8--12         +1 kg
  Deadlift                     1   8--12         +2 kg

Rest defaults are configurable per exercise. Approximately 2 minutes is
suitable for Squat/Bench; approximately 1--2 minutes for the other
multi-set exercises.

### 4.2 Active exercise screen

Persistent left-side exercise list with exercise imagery and 1--6
numbering.

Main area shows:

-   Exercise name.
-   Prescribed sets.
-   Rep range.
-   Rest duration.
-   Current/prescribed weight.
-   Weight stepper.
-   Reps-completed stepper.
-   Current set (`SET 1 OF 3` etc.).
-   Large **COMPLETE SET** button.

Reps may default to the top of the range (normally 12) so the user only
adjusts downward when required.

Weight loads automatically from the current prescription and normally
requires no interaction.

Footer/status area:

-   End Workout / Save and Exit.
-   Workout progress.
-   Total elapsed workout time.
-   Next exercise.

### 4.3 Rest timer

Pressing **COMPLETE SET** starts the configured rest timer
automatically.

The rest state keeps the overall Strength screen context visible but
replaces the central interaction area with a very large countdown.

Show:

-   Remaining rest time.
-   Next set details.
-   Current weight.
-   Next exercise where useful.
-   Large **SKIP REST** button.

At zero, automatically return to the next set/exercise state.

Use audible countdown/completion cues. Exact sound files and countdown
cue timings remain configurable.

### 4.4 Exercise completion

After the final set:

-   Show an exercise-complete celebration.
-   Show sets completed and rep breakdown.
-   Show weight used.
-   Show next exercise.
-   Large **NEXT EXERCISE** action.

### 4.5 Double progression

Strength uses double progression.

For a 3-set 8--12 exercise, progression is earned only when **all three
working sets reach 12 reps** at the prescribed weight.

Example:

-   `12 / 12 / 12` → progression earned.
-   `12 / 12 / 11` → no progression yet.

Deadlift uses one working set, so reaching the configured upper rep
target earns progression.

Health Engine must **not silently increase the stored weight**.

When progression is earned, show a celebration/recommendation such as:

**PROGRESSION EARNED**\
`40 kg → 42 kg`

Actions:

-   **ACCEPT**
-   **STAY**

Only ACCEPT changes the current prescribed weight.

------------------------------------------------------------------------

## 5. Cardio

### 5.1 Equipment

Health Engine currently supports **one cardio activity only:
treadmill**.

Do not add:

-   exercise bike
-   rowing machine
-   cross trainer
-   stepper
-   outdoor running modes

unless explicitly added later through a new specification.

### 5.2 Workflow

Cardio does **not** have an active workout screen.

There is:

-   no Start Treadmill button;
-   no browser-based cardio timer;
-   no Pause button;
-   no background timer;
-   no requirement for Silk to remain open during exercise.

The user watches TV during treadmill exercise and returns to Health
Engine afterwards to record what was completed.

### 5.3 Cardio record screen

Record exactly these four primary variables:

-   Duration --- minutes.
-   Speed --- km/h.
-   Incline --- percent.
-   Distance --- km.

Use large `▲ value ▼` steppers.

Values should pre-populate sensibly from the previous session so a
repeated session requires minimal interaction.

Large action:

**SAVE CARDIO**

After saving, display suitable completion feedback/celebration and
update progress/history.

Distance is retained for future-proofing even if it is not initially a
primary goal metric.

Do not rely on treadmill calorie estimates.

------------------------------------------------------------------------

## 6. Mobility

### 6.1 Philosophy

Mobility starts deliberately broad. The initial library contains more
movements than may ultimately remain in the routine so the user can
discover which exercises are comfortable and useful.

Admin can activate/deactivate exercises and change their order.

### 6.2 Initial exercise library

1.  Standing Calf Stretch --- TIME
2.  Ankle Dorsiflexion / Knee-to-Wall --- REPS
3.  Hamstring Stretch --- TIME
4.  Hip Flexor Stretch --- TIME
5.  Figure-4 / Glute Stretch --- TIME
6.  Adductor / Inner-Thigh Stretch --- TIME
7.  Supported Deep-Squat Hold --- TIME
8.  Sit-to-Stand --- REPS
9.  Supported Single-Leg Balance --- TIME
10. Heel-to-Toe Walk --- REPS/steps
11. Standing Hip Circles --- REPS
12. Thoracic Rotations --- REPS
13. Cat-Cow --- REPS
14. Wall Shoulder Slides --- REPS
15. Doorway Chest Stretch --- TIME

All targets remain Admin-configurable.

### 6.3 Measurement model

A Mobility exercise must support at least:

-   `TIME`
-   `REPS`

It must also support:

-   sets;
-   rest duration;
-   per-side yes/no;
-   target value;
-   active/inactive;
-   display order.

### 6.4 Timed exercise screen

For a timed movement:

-   Exercise name and image.
-   Side where applicable.
-   Large target duration.
-   Large START action.
-   Large countdown while active.
-   Audible completion.
-   Move logically to opposite side, next set, or next exercise.

The same common timer component may be shared with Strength rest timing.

### 6.5 Rep exercise screen

For a rep-based movement:

-   Exercise name and image.
-   Target reps/steps.
-   Side where applicable.
-   Set indicator.
-   Large **COMPLETE** button.
-   No unnecessary timer.

### 6.6 Trial-and-error feedback

Mobility may include simple post-exercise feedback:

-   KEEP
-   UNSURE
-   DROP

This is intended to help refine the routine over time and should remain
simple rather than becoming a medical/pain-scoring system.

------------------------------------------------------------------------

## 7. Progress

Progress brings Strength, Cardio and Mobility together.

Useful information includes:

-   Sessions completed this week.
-   Strength activity/progression.
-   Cardio minutes and distance.
-   Mobility sessions.
-   Weekly activity/consistency.
-   Recent progression events.
-   Historical trends where useful.

Avoid filling the screen with low-value statistics merely because they
can be calculated.

------------------------------------------------------------------------

## 8. Badges and celebrations

Health Engine includes restrained gamification.

Examples:

-   Workout Complete.
-   Strength-session consistency.
-   Progression accepted/new weight.
-   Personal best where meaningfully defined.
-   Cardio minutes/distance milestones.
-   Mobility consistency.
-   Weekly completion goals.

Celebrations may include sound and visual effects.

Badges should mark meaningful achievements rather than fire constantly.

------------------------------------------------------------------------

## 9. PC Admin

### 9.1 Strength Admin

For each Strength exercise, support:

-   Name.
-   Display order.
-   Sets.
-   Minimum reps.
-   Maximum reps.
-   Current prescribed weight.
-   Progression increment.
-   Rest seconds.
-   Image path.
-   Active/inactive.

No Strength A/B routine system is required.

### 9.2 Cardio Admin

Treadmill-only configuration.

Support sensible defaults for:

-   Duration.
-   Speed.
-   Incline.
-   Distance if desired.

Do not create multiple cardio-machine configuration rows.

### 9.3 Mobility Admin

For each Mobility exercise:

-   Name.
-   Measurement type.
-   Target value.
-   Sets.
-   Rest.
-   Per-side.
-   Display order.
-   Image.
-   Active/inactive.

### 9.4 General Settings

May contain:

-   Units.
-   Weekly goals.
-   Sound settings.
-   Timer preferences.
-   TV display preferences.
-   Appearance options.
-   Celebration preferences.

Do not create settings merely to reproduce every control shown in AI
concept imagery. Functional requirements take precedence over accidental
mock-up details.

### 9.5 History/Data Management

Provide:

-   Session history.
-   Filtering.
-   Useful summaries.
-   Ability to inspect recorded session detail.
-   Export capability where straightforward.
-   Safe data-management functions.

Destructive reset/delete operations must require confirmation.

------------------------------------------------------------------------

## 10. Data persistence rules

Supabase is authoritative.

PC Admin: `configuration → Supabase`

TV: `Supabase → current prescription`

TV workout: `results → Supabase`

PC: `Supabase → history/progress`

Historical records must snapshot what actually happened. For example, a
Strength set must store the actual weight and reps used. Later changes
to an exercise prescription must never rewrite historical workout
results.

------------------------------------------------------------------------

## 11. Proposed Supabase table family

All Health Engine tables live inside the existing Map Engine Supabase
project and use the `health_` prefix.

Core tables:

-   `health_settings`
-   `health_strength_exercises`
-   `health_strength_sessions`
-   `health_strength_sets`
-   `health_cardio_settings`
-   `health_cardio_sessions`
-   `health_mobility_exercises`
-   `health_mobility_sessions`
-   `health_mobility_results`
-   `health_achievements`
-   `health_achievement_awards`

The final SQL schema, constraints, indexes, ownership fields and RLS
policies are specified separately in `SUPABASE.sql`.

Health Engine must not read, update, delete, migrate or otherwise depend
upon existing `uber_*` tables.

------------------------------------------------------------------------

## 12. Approved asset strategy

Use individual production assets with deterministic filenames.

Suggested structure:

    public/assets/health-engine/
      backgrounds/
        bg-home.webp
        bg-strength.webp
      strength/
        squat.webp
        bench-press.webp
        seated-shoulder-press.webp
        barbell-row.webp
        ez-bar-bicep-curl.webp
        deadlift.webp
      cardio/
        treadmill.webp
      mobility/
        standing-calf-stretch.webp
        ankle-dorsiflexion.webp
        hamstring-stretch.webp
        hip-flexor-stretch.webp
        figure-4-glute.webp
        adductor-stretch.webp
        supported-deep-squat.webp
        sit-to-stand.webp
        single-leg-balance.webp
        heel-to-toe-walk.webp
        standing-hip-circles.webp
        thoracic-rotations.webp
        cat-cow.webp
        wall-shoulder-slides.webp
        doorway-chest-stretch.webp

Concept/contact sheets are visual references only. Codex must not crop
production assets out of a contact sheet unless explicitly instructed.

------------------------------------------------------------------------

## 13. Codex implementation constraints

The supplied screen mock-ups are the approved visual direction, but this
written specification overrides accidental content in AI-generated
mock-ups.

Codex must:

-   Implement Health Engine as a separate application.
-   Use the existing Map Engine Supabase project.
-   Touch only `health_*` data structures created for Health Engine.
-   Use supplied assets rather than inventing replacements.
-   Preserve the TV-first interaction model.
-   Keep Gym Mode free of text entry.
-   Keep click targets large.
-   Preserve treadmill-only Cardio.
-   Preserve post-workout Cardio entry.
-   Preserve Strength double progression with explicit ACCEPT/STAY.
-   Preserve TIME and REPS Mobility modes.
-   Preserve historical snapshots.

Codex must not:

-   Redesign the application independently.
-   Add extra cardio equipment.
-   Add an active Cardio timer/session screen.
-   Create A/B Strength routines.
-   Automatically increase Strength weights without confirmation.
-   Add low-value metrics simply because data is available.
-   modify Map Engine's `uber_*` tables or application behaviour.
-   Treat concept-image text as authoritative when it conflicts with
    this specification.

------------------------------------------------------------------------

## 14. Build sequence

Recommended implementation order:

1.  Application shell, routing and shared visual system.
2.  Supabase `health_*` schema and data access.
3.  PC Admin configuration.
4.  TV Home.
5.  Strength workflow.
6.  Cardio recording.
7.  Mobility workflow.
8.  Progress/history.
9.  Badges/celebrations.
10. Final Fire TV/Silk usability pass.
11. Data integrity/RLS testing.
12. Visual comparison against approved mock-ups.

Each stage should be tested before moving to the next.

------------------------------------------------------------------------

## 15. Acceptance principle

Health Engine is successful when the PC can define a workout, the gym TV
immediately sees that prescription, the user can conduct or record the
workout with minimal interaction, and the resulting history is
immediately available back on the PC.

The application should feel like a dedicated gym console, not a database
form displayed on a television.
