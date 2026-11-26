# CLAUDE.md — Coaching Guide for the 8-Month Upper-Body Program

This file is the complete coaching brain for this repository. It holds the athlete's profile, the program's design logic, every decision made so far and why, and the exact procedure for processing check-ins. Read all of it before changing the plan.

**Source of truth:** `data/upper_body_8_month_plan.json`. This file explains *why* the JSON looks the way it does and *how* to change it. If this file and the JSON disagree on a number, the JSON wins; if they disagree on a rule, this file wins and the JSON should be fixed.

**Plan version this guide was written against:** v2.2

---

## 0. Quick start for Claude Code

When the user pastes a message starting with `=== 2-WEEK CHECK-IN ===`:

1. Read the JSON (`meta`, the current block's template, `finishers`, `meta.changelog`, `meta.last_checkin`).
2. Run the check-in procedure in §6.
3. Edit the JSON with a script (never hand-edit 100+ KB of JSON), run the validation in §12, bump the version, add a changelog line, update `meta.last_checkin`.
4. Reply to the user using the format in §6.4.

Golden rules:
- **When processing a check-in, only edit `data/upper_body_8_month_plan.json`.** Outside check-ins, app code changes are fine when the user asks for app changes. Do not edit `CLAUDE_CODE_MIGRATION_BRIEF.md` (user's standing instruction). Flag it if a change makes the brief structurally wrong.
- Never prescribe a weight the user has already done as if it were progress. Either it's a jump, or it's "same weight, chase reps" — say which.
- Never add 1-rep-max testing. Never recommend cutting calories.
- Main workout: **4–5 exercises per day, never more.** Every muscle trained **2x per week.**
- Anchor compounds never change. Isolation swaps happen **between blocks only** (pain is the one exception).
- Ask questions when data is missing or ambiguous — the user explicitly welcomes questions during check-ins.

---

## 1. Athlete profile

- **Age 15**, 5'11", ~140 lbs at program start, self-estimated ~15% body fat. Still growing.
- Training age: started structured training ~2 months before this program. Ran a prior 6-week, 6-day bro-split (chest/tri, back/bi, shoulders, conditioning, arms, full-upper circuit) with heavy compounds; skipped its forearm finishers, abs circuits, and bench max attempt.
- Understands progressive overload and RIR; has trained near failure.
- No injuries, no joint pain (elbows, wrists, neck, lower back all fine) as of last report.
- Sleep ~8 h/night. Protein ~90–100 g/day at start. Bodyweight was flat over the 2 months before the program (eating at maintenance).
- Parents handle groceries, but he can change what he eats.
- Gets cardio at school — the program contains **no cardio** by design.

### Goals (in his words / priorities)
- Upper body only. "Lots of volume and definition", a jacked/toned look; cares most about **looking shredded with a shirt off**.
- All upper muscles roughly equally important (chest, shoulders, arms, back/V-taper, forearms, abs).
- **Bigger forearms** — dedicated finishers.
- **Visible six-pack + strong core** — dedicated core finishers.
- Abs don't have to arrive by month 8; it's fine if they come sooner and he keeps building.
- Prefers moderate weight/moderate reps and hypertrophy-style work. Willing to train hard on the last sets of each session, not necessarily every set. Willing to track everything.

---

## 2. Equipment and hard constraints

**Has:**
- Centr 3 home gym: selectorized Smith bar (~330 lb max, counterbalanced — numbers aren't comparable to a free barbell), dual adjustable cable pulleys (82.5 lb per side), built-in pull-up bar.
- Attachments: 2 D-handles, triceps rope, dual-hook **curl bar** (has several straight sections), ankle strap, belt, 2 × 5 lb add-on weights.
- Adjustable bench. Separate pull-up bar. Treadmill (unused in program).

**Does NOT have — never program these:**
- No straight bar / lat bar. All "bar" cable work uses the **curl bar** (lat pulldowns are done on the curl bar's outer straight sections — confirmed by the user; nothing else needs to change for those).
- No dumbbells. No dip bars (bench dips only). No resistance bands.
- No dedicated low-row station: seated cable row = sitting on the bench, feet flat on the floor, low pulleys, two D-handles. This works; keep it.

**How he actually does things:**
- Cable curls are **single-arm, one arm at a time** (all reps left, then all reps right). All curl loads are **per arm**. Rest starts after the second arm. His tracking app sometimes labels this "Dual cable curl" — treat it as the single-arm curl.
- Lateral raises are single-arm. Loads per arm.

---

## 3. Program architecture

### 3.1 Blocks

| Block | Weeks | Template(s) | Purpose |
|---|---|---|---|
| 1 Foundation & Calibration | 1–4 | `block1_wk1` (week 1 only), `block1` (weeks 2–4) | Learn form, find real working weights. Conservative RIR. |
| 2 Hypertrophy Accumulation | 5–12 | `block2` | Volume climbs, load climbs. Longest, most productive block. |
| 3 Intensification | 13–20 | `block3` | Compounds drop to 5–8 reps, heavier. Isolation stays 12–20. |
| 4 Volume Peak & Definition | 21–28 | `block4` | Back to 8–12 with block-3 strength, shorter rests, supersets. |
| 5 Consolidation & Best-Of | 29–34 | `block5` | Re-selected around what worked best for him. |

Deloads: **weeks 12, 20, 28, 34** (`is_deload: true`). Deload = half the sets (2 per exercise), same or ~60% load, stop 3–4 reps short of failure.

### 3.2 Weekly schedule (all 34 weeks, 4 training days)

| Mon | Tue | Wed | Thu | Fri | Sat | Sun |
|---|---|---|---|---|---|---|
| D1 Push A | D2 Pull A | Rest | D3 Push B | D4 Pull B | Rest | Rest — **Check-in on even weeks** |

Block 1 was originally 5 days with cardio; it was changed to this 4-day split (v1.5) after the user had already done week 1 D1–D2.

### 3.3 Day structure
- **D1 Push A — chest emphasis.** Flat press, incline press, chest fly (rotating), standing single-arm lateral raise, overhead rope extension.
- **D2 Pull A — width & biceps.** Pull-ups, wide pulldown (curl bar), seated cable row, primary curl (rotating), incline cable curl.
- **D3 Push B — shoulder emphasis.** Seated Smith OHP, second chest movement (rotating), leaning-away lateral raise, cable rear delt fly, close-grip Smith press.
- **D4 Pull B — thickness & arms.** Smith bent row, neutral-grip pulldown, single-arm cable row, face pull, rope hammer curl.

Each session: 5-min warm-up (in `warmup_protocol`) → 5 main exercises (~30–40 min) → finishers.

### 3.4 Finishers (on top of the main work)

| Day | Forearm finisher | Core finisher |
|---|---|---|
| D1 | Forearm A (flexors & grip) | Core A (lower abs) |
| D2 | — | Core B (weighted flexion) |
| D3 | Forearm B (extensors & rotators) | Core C (obliques/anti-rotation) |
| D4 | — | Core A |

The user asked for forearm finishers only on some days so there's enough rest — keep them at 2/week.

- **Forearm A:** seated Smith wrist curl 3×15–20, behind-the-back wrist curl 2×15–20, dead hang 2×max (graduated to **towel hang** after hitting 60 s — the finisher still lists `dead_hang`; the note tells him to use towels).
- **Forearm B:** cable reverse curl 3×12–15, Smith reverse wrist curl 3×15–20, cable pronation/supination 2×15 each way each arm.
- **Core A:** hanging knee raise 3×10–15 (progressing toward hanging leg raise), reverse crunch 3×12–15, dead bug 2×10/side.
- **Core B:** cable crunch 4×12–15 (progressively loaded — this builds the ab muscle itself), hollow hold 3×20–40 s, slow bicycle 2×20.
- **Core C:** Pallof press 3×10/side, side plank 3×30–45 s, cable woodchop 2×12/side, long-lever plank 2×20–40 s (replaces long standard planks, which he can hold 60+ s passively).

### 3.5 Between-block rotation (isolation only)

Anchors fixed for all 34 weeks: `smith_flat_press`, `smith_incline_press`, `smith_ohp_seated`, `smith_bent_row`, `pullup`, `lat_pulldown_wide`, `lat_pulldown_neutral`, `seated_cable_row`, `single_arm_cable_row`, `cable_face_pull`. Also constant: both lateral raises, `cable_rear_delt_fly`, `smith_close_grip_press`, `overhead_rope_extension`, `incline_cable_curl`, `cable_hammer_curl_rope`.

Rotating slots:

| Slot | B1 | B2 | B3 | B4 | B5 |
|---|---|---|---|---|---|
| D1 chest fly | high→low | **low→high** | high→low | low→high | high→low |
| D3 chest movement | cable chest press | cable chest press | feet-elevated push-up | cable chest press | feet-elevated push-up |
| D2 primary curl | single-arm curl | single-arm curl | high cable curl | single-arm curl | high cable curl |

A former triceps rotation (rope pushdown ↔ kickback) was removed when days were cut to 5 exercises (v1.6). If he ever wants triceps variety back, rotate the D1 overhead-extension slot between blocks rather than adding a 6th exercise.

### 3.6 Why variety works this way (explain this if he asks again)
- Each muscle is hit on two different days with different exercises → plenty of angles per week.
- The **same exercise stays in its slot for a whole block** so double progression has a stable reference ("beat last week"). Swapping a slot week to week breaks that — avoid it.
- Isolation rotates between blocks to cover all angles over 8 months. Compounds never rotate; they're the progress measuring sticks.
- "Muscle confusion" is not a thing; progressive tension is.

---

## 4. Current state (as of v2.1)

### 4.1 Check-in history

**Weeks 1–2 check-in** (best working sets, all at RIR 2 unless noted):
flat press 160×10 · incline 130×12 · OHP 120×10 · close-grip 130×10 · bent row 110×10 · wide pulldown 80×12 · cable row 70×10 @ RIR 1 · pull-ups 8 clean · standing lateral raise 15×8 · single-arm curl 25/arm ×12 · rope pushdown 40×10 (no longer scheduled) · cable crunch 30 (reps blank) · wrist curl 50×15 · dead hang 60 s · hanging knee raise 10.
Bodyweight, sleep, adherence, subjective notes: **all n/a — ask for them.**

Outcome: nearly every estimate was too low (OHP est. 105 → real 120, bent row 95 → 110, wrist curl 30 → 50). No pain, no stalls.

### 4.2 Current prescribed loads — Block 1 (`block1`, weeks 2–4)

| Day | Exercise | Prescription | Load |
|---|---|---|---|
| D1 | Smith flat press | 4×8–10 @ RIR 2–3 | **170** |
| D1 | Smith incline press | 3×8–12 @ RIR 2 | **140** |
| D1 | High-to-low cable fly | 3×12–15 | 15/side |
| D1 | Standing single-arm lateral raise | 5×12–15 | **12.5/arm** (dropped from 15 — 15×8 was below range) |
| D1 | Overhead rope extension | 2×12–15 | 30 |
| D2 | Pull-ups | 4×max (target 6–10) | BW — at 12+ clean, add backpack load |
| D2 | Wide pulldown (curl bar) | 3×8–12 | **90** |
| D2 | Seated cable row | 3×10–12 | 70 (hold, chase reps) |
| D2 | Single-arm cable curl | 3×10–12 | **30/arm** |
| D2 | Incline cable curl | 2×12–15 | 15/arm |
| D3 | Seated Smith OHP | 4×8–10 | **130** |
| D3 | Standing cable chest press | 3×10–12 | 30/side |
| D3 | Leaning-away lateral raise | 4×12–15 | 7.5/arm |
| D3 | Cable rear delt fly | 3×12–15 | 15 |
| D3 | Smith close-grip press | 3×8–12 | 130 (hold, chase reps to 12) |
| D4 | Smith bent row | 4×8–10 | **120** |
| D4 | Neutral-grip pulldown | 3×10–12 | 65 |
| D4 | Single-arm cable row | 3×10–12 | 35/arm |
| D4 | Face pull | 3×15 | 25 |
| D4 | Rope hammer curl | 3×12–15 | 25 |

Finisher loads: wrist curl 50 (hold, chase 20 reps), behind-back wrist curl 40, reverse curl 20, reverse wrist curl 15, pronation 5, cable crunch 30, Pallof 20, woodchop 25.

Blocks 2–5 templates have `start_load_lbs: null` on purpose — they get filled at block transitions (§9).

### 4.3 Open items to raise at the next check-in
- **Bodyweight** (weigh first thing in the morning, same day each week) and **sleep** — both missing last time. Bodyweight is the most important number for his muscle-gain goal.
- Cable crunch reps were blank.
- Reverse wrist curl and cable reverse curl were n/a.
- Next check-in: end of week 4 = Block 1 → Block 2 transition (populate `block2` loads).

---

## 5. Progression engine

**Method: double progression.** Every exercise has a rep range. Work at a load until you hit the top of the range on all prescribed sets at the target RIR, then add load and drop back to the bottom of the range.

**RIR** = reps in reserve. RIR 2 = stopped with 2 clean reps left. RIR 0 = true failure. Reported sets at RIR 2 are **not maxes.**

**Tempo default:** 2–3 s lowering, no bounce, 1 s squeeze at peak contraction.

### 5.1 Increments

| Lift | Increment |
|---|---|
| Smith flat press, Smith incline press, wide lat pulldown, Smith bent row | **+10 lb** (user's explicit preference) |
| Smith OHP, Smith close-grip | +5 to +10 lb (OHP was given +10 last time) |
| Other cable compounds (rows, neutral pulldown, chest press) | +5 lb |
| Cable isolation (curls, raises, flies, extensions, face pulls) | +2.5 to +5 lb (5 lb add-ons available). Curl was bumped 25 → 30 by request. |
| Forearm work | Add reps to the top of the range first, then smallest increment |
| Bodyweight (pull-ups, push-ups, dips) | Add reps; past ~12 clean pull-ups add backpack load or slower negatives |

After a big jump, expect reps to fall to the bottom of the range (e.g., 7–8 on an 8–10 lift). Tell him that's correct. If a jump turns form ugly (especially bent row — rounding back, heaving), drop back one increment and earn it.

### 5.2 Decision table per lift (apply at every check-in)

| What he reported | Action |
|---|---|
| Hit the **top** of the rep range at target RIR (or easier) | **Jump** to next load. Store the new load in the template. Note the expected rep drop. |
| Inside the range | **Hold load, chase reps.** Write a note saying so explicitly — this is not a stall. |
| **Below** the bottom of the range (e.g., lateral raise 15×8 on 12–15) | Too heavy → **drop** 10–20% to land inside the range. |
| Same best set as the previous check-in | Not yet a stall. Hold, ask about sleep/food/effort. |
| No progress across 2 consecutive check-ins (≈4 weeks) | Stall → drop load ~10% and rebuild, or swap to a close variation at the next block change. Check sleep and food first. |
| Pain in a joint (not muscle soreness) | Remove/swap the exercise now, ask details, suggest a doctor if it persists more than a few days. |
| Bodyweight flat or dropping for 4+ weeks | Nutrition talk (§11) — this is the biggest lever. |

The stored `start_load_lbs` means **"the weight to use next"**, never "what you did last". This was a real mistake once (v1.8) and the user called it out.

---

## 6. Check-in procedure

### 6.1 The template
Lives at `checkin.template` in the JSON. The user's tracking app fills the `{{blanks}}` and he pastes it. Lines may say n/a.

Since v2.2 the lift lines are **generated, not hard-coded**: the template has `{{main_lifts}}`, `{{forearm_lifts}}` and `{{core_lifts}}`, and `fillCheckinTemplate` in `data/workoutPlan.ts` writes one line per exercise scheduled in the two covered weeks (main + both finishers), named by `exercise_library[id].name`, with the best logged set. Format: `lbs x reps @ RIR` (RIR only if the exercise prescribes it), `BW x reps` when no load is logged, `N seconds` for timed holds, `PER ARM` for single-arm work (`PER_ARM_IDS`). Rotations and new exercises show up automatically — don't add fixed lift lines back. If you add a new single-arm exercise, add its id to `PER_ARM_IDS`.

### 6.2 Steps
1. **Identify the weeks and block** from the header. Confirm which template applies (`block1` for weeks 2–4, `block2` for 5–12, etc.).
2. **Map lines to exercise_ids.** Each lift line uses the exercise's library name (e.g. "High-to-Low Cable Fly:" → `cable_fly_high_low`), so match by name. Every scheduled exercise has a line; `n/a` means he didn't log it.
3. **Apply the decision table (§5.2)** to every reported lift, main work and finishers alike. Lines that say `n/a` → hold the load and ask whether he skipped it or just didn't log it.
4. **Check body data:** bodyweight trend (target +0.5–1 lb/month), sleep (target 8.5–9 h), ab status, pain.
5. **Check adherence:** if sessions/finishers were skipped, ask why before adding load or volume.
6. **Read the subjective section:** exercises that felt useless/awkward/painful are swap candidates (swap between blocks unless painful).
7. **Block transition?** If the check-in ends weeks 4, 12, 20, or 28, run §9.
8. **Edit the JSON** (script), validate (§12), bump version, changelog line, update `meta.last_checkin` (weeks, block, today's date, summary, open data gaps).
9. **Reply** (§6.4).

### 6.3 If nothing needs changing
Say so. The user said "update the JSON (or don't if it's not needed)."

### 6.4 Reply format
- One line verdict ("Strong two weeks — everything moved up").
- **Add weight now:** lift old → new.
- **Hold & chase reps:** lift — why.
- **Drop:** lift — why.
- Any form/safety notes, with the specific cue.
- Questions / missing data (always ask for bodyweight and sleep if absent).
- Deliver the updated JSON and state the new version.
Keep it short, direct, and explain *why* in one clause. He's 15 and smart — don't talk down, don't lecture.

---

## 7. Volume and coverage targets

Steady-state week (Block 2), direct working sets after v1.7:

| Muscle | Direct sets/wk | With indirect | Status |
|---|---|---|---|
| Chest | 16 | 16 | Good |
| Front delts | 7 | ~12 (presses) | Adequate |
| Side delts | **9** | ~10 | Good — was 7, bumped for the capped-delt goal |
| Rear delts | 6 | ~10 (rows) | Adequate |
| Lats / width | 10 | 10 | Good |
| Back thickness | 17 | 17 | Good |
| Biceps | 8 | ~18 (pulls) | Good |
| Triceps | 5 | ~12 (presses) | Adequate — watch this |
| Traps | **0** | low (rows, face pulls) | Accepted gap; shrug was cut in v1.6. He chose not to add it back. |
| Forearms | 15 (finishers) + hammer curls | — | Good |
| Core | 4 finisher sessions | — | Good |

Rules:
- Target ≥10 effective sets/week per major muscle; 10–20 is the productive range.
- Side delts stay ≥9 direct (shirtless "capped" look is a core goal).
- Before any change that removes sets, recount and tell the user exactly which muscle drops and by how much. Before any change that adds an exercise, check the 5-exercise cap and session time.

---

## 8. Exercise selection rules

- **5 exercises max per main session.** If something must be added, something leaves, or add a set to an existing exercise instead.
- Swap only between blocks unless pain/awkwardness.
- Every exercise must exist in `exercise_library` with full form (setup, grip, execution, cues, common_mistakes, notes). If you add one, write all fields at the same quality as the existing entries.
- Equipment check every new exercise against §2 (no straight bar, no dumbbells, no dip bars, no bands).

### 8.1 What was cut and why (v1.6 → 5 exercises/day)
- D1: rope pushdown/kickback slot (kept overhead extension — long head is the biggest part of the triceps).
- D2: straight-arm pulldown (three back compounds remain).
- D3: bench dips (close-grip covers triceps).
- D4: cable shrug (traps get indirect work).

### 8.2 Unused reserves in the library
`rope_pushdown`, `cable_kickback`, `cable_shrug`, `straight_arm_pulldown`, `bench_dip`, `pushup`, `cable_y_raise`, `pullup_neutral`, `hanging_leg_raise` (progression for knee raises), `towel_hang` (progression for dead hang), `plank`, `cable_curl_bar_alt` (two-hand curl — load is a **total**, don't log in the same column as single-arm), `cable_static_hold`, `loaded_carry`, `suitcase_carry` (carries need a loadable object like a backpack), `treadmill_z2`, `treadmill_intervals` (no cardio in program).

### 8.3 Progressions to trigger when earned
- Hanging knee raise → hanging leg raise once 15 clean knee raises with pelvic curl are easy.
- Dead hang → towel hang (triggered: hit 60 s at weeks 1–2). Consider switching the finisher's `exercise_id` to `towel_hang` at the next edit.
- Pull-ups → weighted (backpack) at 12+ clean reps.
- Push-ups → feet-elevated / slow negatives (already in rotation).

---

## 9. Block transition procedure

At the check-in that ends weeks **4, 12, 20, 28**:

1. Take the latest working loads and write `start_load_lbs` into every exercise of the **next** block's template.
2. Adjust for that block's rep ranges:
   - **→ Block 2 (week 5):** compounds go to 6–10 reps at RIR 1–2 → use current load (or +1 increment if he topped the old range).
   - **→ Block 3 (week 13):** apply `blocks[block_3].modifications` *to the template itself*: flat/OHP/bent row 4–5 sets × 5–8, rest 180 s, load ≈ +10–15%; second compound each day 3–4 × 8–10; isolation stays 12–20; myo-reps on lateral raises (one set to failure, then 3–4 mini-sets of 4–5 with 15 s rest).
   - **→ Block 4 (week 21):** compounds back to 8–12 using block-3 loads (expect them to feel heavy at 10 reps); isolation rest 45 s; one antagonist superset per session (e.g., curl + overhead extension); still 5 exercises.
   - **→ Block 5 (week 29):** re-select isolation based on 8 months of check-ins (what grew, what lagged, what he liked); each day = 2 heavy compounds (6–8 reps) + 3 isolation (12–20) to respect the 5-exercise cap; lagging muscles get +2–3 sets/week.
3. Rotating slots switch per §3.5. The new exercise starts with an estimated load and a "calibrate this week" note.
4. Deload week: don't change loads; just cut to 2 sets each and RIR 3–4. Tell him deloads are where growth consolidates.

---

## 10. Safety — non-negotiable

- **No 1-rep-max testing.** Use rep PRs (beat best set by a rep). If he ever insists on testing a max, only with a spotter present, never alone.
- **Smith safeties** set just below the bottom position on every press.
- **Pain rule:** burn and soreness are normal; sharp pain, joint pain, or pain lingering into the next day in a joint is not. Stop the exercise, swap it, and if it persists more than a few days, see a doctor.
- **Form over load**, especially on hinged rows and overhead pressing. He's still growing; controlled loads and good technique make resistance training safe and beneficial at his age.
- **Warning signs → unscheduled deload week:** strength dropping on multiple lifts 2+ weeks, persistent joint pain, worse sleep/elevated resting heart rate, loss of motivation.
- No supplement dosing advice. Creatine is the only well-supported one; at 15 it's a conversation with his parents and doctor, not something to just start.

---

## 11. Nutrition and recovery (what to tell him)

- **Do not cut. Do not count calories.** He's already lean (~15%). Abs aren't visible mainly because the ab muscles aren't developed enough yet, not because of fat. Weighted core work plus overall growth reveals them.
- Small surplus: bodyweight should trend up ~0.5–1 lb/month. His weight was flat before the program → he was at maintenance and leaving muscle on the table.
- Protein: raise from 90–100 g to **120–140 g/day** (Greek yogurt, milk, eggs, chicken, tuna, cottage cheese, a shake).
- Add one extra eating occasion per day rather than forcing huge meals. Protein + carbs within a couple hours of training. Hydrate.
- Loop in his parents since they buy groceries; check with a doctor for any medical concerns.
- **Sleep 8.5–9 h** — this is where muscle is actually built at his age; it matters more than any exercise choice.
- If he ever shows signs of restrictive eating or wants to diet down hard, don't give numbers or plans — steer back to eating enough and talking to a parent/doctor.

---

## 12. Editing the JSON

### 12.1 Schema (top-level keys)
`meta` (title, version, athlete, equipment, structure_summary, rotation, last_checkin, changelog) · `warmup_protocol` · `progression` · `safety` · `recovery` · `nutrition` · `expectations` · `blocks[]` (id, name, weeks, days_per_week, goal, intensity, session_template, modifications, weekly_notes keyed by week number as string) · `session_templates` (`block1_wk1`, `block1`, `block2`…`block5`; each an array of sessions: day, name, target_min, main[], forearm_finisher, core_finisher, cardio) · `finishers` (forearm_A/B, core_A/B/C) · `exercise_library` (by id) · `checkin` (template) · `schedule[]` (34 weeks: week, block, days_per_week, session_template, days[7], is_deload, is_checkin_week, checkin_day on even weeks).

`main[]` item: `exercise_id, sets, reps, rir, rest_sec, note, start_load_lbs (nullable)`.

- `block1_wk1` is week 1 only and is history — don't edit it.
- A template is shared by every week of its block, so its `start_load_lbs` = current working weight for that block.
- The user's iOS app reads this JSON (via a resolver in `data/workoutPlan.ts`). Don't rename keys or change structure without telling him — the app may break.

### 12.2 How to edit
Write a short Python script that loads the JSON, changes the specific fields, and dumps with `indent=2`. Never retype the file.

### 12.3 Validation — run after every edit

```python
import json
d = json.load(open("data/upper_body_8_month_plan.json"))
lib = set(d["exercise_library"])
tpl = set(d["session_templates"])
errors = []
for tn, t in d["session_templates"].items():
    for s in t:
        ids = [b["exercise_id"] for b in s["main"]]
        if len(ids) != len(set(ids)): errors.append(f"duplicate in {tn} D{s['day']}")
        if tn != "block1_wk1" and not (4 <= len(ids) <= 5): errors.append(f"{tn} D{s['day']} has {len(ids)} exercises")
        errors += [f"unknown id {i}" for i in ids if i not in lib]
        for k in ("forearm_finisher", "core_finisher"):
            if s.get(k) and s[k] not in d["finishers"]: errors.append(f"bad {k} {s[k]}")
for f in d["finishers"].values():
    errors += [f"unknown finisher id {e['exercise_id']}" for e in f["exercises"] if e["exercise_id"] not in lib]
errors += [f"week {w['week']} -> missing template" for w in d["schedule"] if w["session_template"] not in tpl]
assert len(d["schedule"]) == 34
print("OK" if not errors else errors)
```

### 12.4 Versioning
Bump `meta.version` (2.1 → 2.2 …) and append one line to `meta.changelog` describing what changed and why.

---

## 13. Decision log (why the plan looks like this)

| Ver | Change | Reason |
|---|---|---|
| 1.0 | Initial 34-week, 5-block plan | Built from intake answers |
| 1.1 | Cable curl → single-arm, one arm at a time, per-arm loads | That's how he actually does it |
| 1.2 | Removed straight-bar pushdown; purged straight bar everywhere | He has no straight bar |
| 1.3 | Wide pulldown on curl bar; filled D4 triceps slot | Curl bar is what he uses |
| 1.4 | Between-block isolation rotation; low→high fly added; leaning lateral raise on Push B | Same exercises week 1 → 34 felt stale; upper-chest isolation was missing |
| 1.5 | Block 1 → 4 days, all cardio removed | School covers cardio; he'd done week 1 D1–D2 already |
| 1.6 | 6 → 5 exercises/day from week 1 D4 | Shorter sessions |
| 1.7 | +1 set on every lateral raise | Side delts fell to 7 sets after the cut |
| 1.8 | Weeks 1–2 check-in loads recorded | First calibration |
| 1.9 | Stored loads = next weight, not achieved weight | User asked why he was repeating his best sets |
| 2.0 | +10 on flat (170), incline (140), wide pulldown (90), bent row (120) | User preference |
| 2.1 | Single-arm curl → 30/arm | User request |
| 2.2 | Check-in lift lines auto-generated from the schedule; rope pushdown + cardio lines removed | Cable fly (and ~15 other exercises) were missing from check-ins |

---

## 14. Known inconsistencies (resolve with these rules)

- **`blocks[].weekly_notes` and `modifications` were written before v1.6.** Where they imply more than 5 exercises (block 4 supersets are fine; block 5's "4 isolation exercises" is not) the 5-exercise cap wins. Notes asking to add *sets* are fine if session time allows. Block 2 week 5's "add the extra set on lateral raises" is already done (v1.7) — don't double it. Block 4's "add core_C to day 4" is moot; core already runs 4×/week.
- **Block 3 template rep ranges** still show 6–10 on compounds; the 5–8 change in §9 must be written into `block3` at the week-12 check-in.
- **`CLAUDE_CODE_MIGRATION_BRIEF.md` is stale** (doesn't know about `block1_wk1`, the 5-exercise cap, or removed cardio). Don't edit it — the user said not to.
- `meta.last_checkin.date_processed` for weeks 1–2 is approximate.

---

## 15. Working with this user

- Implements small, specific requests directly ("bump curl to 30") — just do it, confirm in 2–4 lines, mention any real risk in one sentence.
- For structural changes (cutting/adding exercises, changing days), explain the tradeoff (volume per muscle, time) and recount sets.
- He pushes back when something seems off — take it seriously and check the data before answering. Admit mistakes plainly.
- He likes knowing *why*. One clause of reasoning per change is enough.
- Prefers plain-language, compact replies. Use short lists for load changes.
- He's 15: be encouraging and direct, never preachy; keep safety and eating-enough messages brief and practical.
