# Health Engine --- Asset Manifest

This document defines the canonical asset names and intended use for
Health Engine.

## Rules for Codex

-   Use supplied assets exactly where a canonical asset is available.
-   Do not generate substitute artwork.
-   Do not crop exercise artwork from contact sheets.
-   Do not redesign supplied imagery.
-   Do not infer filenames from old mock-ups; use this manifest.
-   AI mock-ups and contact sheets are references only unless an asset
    is explicitly listed as production-ready.
-   If a canonical file is missing from the repository, leave the
    defined path in place and report the missing asset rather than
    silently substituting another image.

## Root

`/public/assets/health-engine/`

## Shared background

The approved general cinematic gym image can be reused throughout TV
Mode rather than creating near-identical backgrounds for every section.

Canonical filename:

`backgrounds/gym-main.webp`

Use on: - TV Home - Strength - Cardio - Mobility - Progress - Badges

Apply section-specific overlays/tints in CSS rather than generating
duplicate background files.

## Strength --- production assets

  Exercise                Canonical path
  ----------------------- ---------------------------------------
  Squat                   `strength/squat.webp`
  Bench Press             `strength/bench-press.webp`
  Seated Shoulder Press   `strength/seated-shoulder-press.webp`
  Barbell Row             `strength/barbell-row.webp`
  EZ Bar Bicep Curl       `strength/ez-bar-bicep-curl.webp`
  Deadlift                `strength/deadlift.webp`

These are cinematic demonstration images using the consistent gym/model
aesthetic established during design.

## Cardio --- production asset

  Activity    Canonical path
  ----------- -------------------------
  Treadmill   `cardio/treadmill.webp`

There is only one cardio machine/activity in the current Health Engine
specification.

## Mobility --- canonical paths

  -----------------------------------------------------------------------------------------------
                     \# Exercise         Canonical path                          Status
  --------------------- ---------------- --------------------------------------- ----------------
                      1 Standing Calf    `mobility/standing-calf-stretch.webp`   Individual image
                        Stretch                                                  available

                      2 Ankle            `mobility/ankle-dorsiflexion.webp`      Individual image
                        Dorsiflexion /                                           available
                        Knee-to-Wall                                             

                      3 Hamstring        `mobility/hamstring-stretch.webp`       Individual image
                        Stretch                                                  available

                      4 Hip Flexor       `mobility/hip-flexor-stretch.webp`      Individual image
                        Stretch                                                  available

                      5 Figure-4 / Glute `mobility/figure-4-glute.webp`          Multiple
                        Stretch                                                  candidates;
                                                                                 select one
                                                                                 canonical image

                      6 Adductor /       `mobility/adductor-stretch.webp`        Individual image
                        Inner-Thigh                                              available
                        Stretch                                                  

                      7 Supported        `mobility/supported-deep-squat.webp`    Individual image
                        Deep-Squat Hold                                          available

                      8 Sit-to-Stand     `mobility/sit-to-stand.webp`            Individual image
                                                                                 available

                      9 Supported        `mobility/single-leg-balance.webp`      Individual image
                        Single-Leg                                               available
                        Balance                                                  

                     10 Heel-to-Toe Walk `mobility/heel-to-toe-walk.webp`        Standalone
                                                                                 production file
                                                                                 still required

                     11 Standing Hip     `mobility/standing-hip-circles.webp`    Standalone
                        Circles                                                  production file
                                                                                 still required

                     12 Thoracic         `mobility/thoracic-rotations.webp`      Individual image
                        Rotations                                                available

                     13 Cat-Cow          `mobility/cat-cow.webp`                 Standalone
                                                                                 production file
                                                                                 still required

                     14 Wall Shoulder    `mobility/wall-shoulder-slides.webp`    Standalone
                        Slides                                                   production file
                                                                                 still required

                     15 Doorway Chest    `mobility/doorway-chest-stretch.webp`   Standalone
                        Stretch                                                  production file
                                                                                 still required
  -----------------------------------------------------------------------------------------------

### Mobility contact-sheet warning

A generated reference sheet visually contains all five currently missing
standalone exercises:

-   Heel-to-Toe Walk
-   Standing Hip Circles
-   Cat-Cow
-   Wall Shoulder Slides
-   Doorway Chest Stretch

That sheet is **reference artwork only**. It does not count as five
production assets.

Codex must not cut those five images out of the sheet.

## Duplicate / non-canonical imagery

During generation, some prompts produced the wrong exercise or duplicate
alternatives. These should not be placed in the production asset folders
unless explicitly selected.

Known alternatives/duplicates include: - Additional Figure-4 / Glute
Stretch image. - Additional Standing Calf Stretch image. - Mis-prompted
images that nevertheless became valid assets for another named Mobility
exercise.

Only the canonical filenames above should be referenced by application
code or seeded database records.

## UI mock-ups

Approved mock-ups are visual references, not runtime assets.

Suggested reference folder:

`/references/health-engine/`

Suggested names:

-   `tv-home-reference.png`
-   `tv-strength-active-reference.png`
-   `tv-strength-rest-reference.png`
-   `tv-strength-complete-reference.png`
-   `tv-cardio-reference.png`
-   `tv-mobility-reference.png`
-   `tv-progress-reference.png`
-   `tv-badges-reference.png`
-   `admin-reference.png`

Mock-up text is not authoritative. `Health-Engine-SPEC.md` overrides any
accidental labels, metrics, controls or workflows visible in generated
mock-ups.

## Database seed paths

When exercise seed data is created, store paths relative to the Health
Engine asset root, for example:

`strength/squat.webp`

not a deployment hostname or absolute URL.

The UI should resolve the final public path consistently.

## Missing-asset behaviour during development

If an expected image is unavailable: 1. Render the normal panel/card
layout. 2. Use a neutral built-in placeholder treatment without
exercise-specific generated imagery. 3. Log/report the missing canonical
filename. 4. Do not substitute another exercise image. 5. Do not fetch
an image from the internet.

## Final pre-build asset checklist

Before final visual acceptance: - General gym background present. - All
six Strength images present. - Treadmill image present. - Fifteen
individual Mobility images present. - One canonical Figure-4 image
chosen. - Duplicate Calf/Figure-4 alternatives excluded from production
paths. - Five final Mobility contact-sheet subjects supplied as
individual production files. - All filenames match this manifest
exactly. - No contact sheets referenced by application code.
