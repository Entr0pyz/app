/**
 * IronLog Exercise Database
 *
 * ROUTINES_DB — the user's specific 4-day Push/Pull/Legs split.
 * EXERCISE_DB  — the original body-part catalogue (retained for reference).
 *
 * Equipment available:
 * Power Rack, Barbells, Dumbbells, Smith/Functional Trainer Combo,
 * Leg Press, Lat Pulldown/Row Combo, Leg Ext/Curl Machine,
 * EZ-Bar, Bosu/Stability Balls.
 */

// ─── 4-Day Routine Split ──────────────────────────────────────────────────────

export const ROUTINES_DB = [
  // ── Routine 1: Push ────────────────────────────────────────────────────────
  {
    id: 'push',
    title: 'Push',
    dayLabel: 'Monday',
    targets: ['Chest', 'Shoulders', 'Triceps'],
    exercises: [
      {
        id: 'push_01',
        name: 'Barbell Bench Press',
        targetMuscle: 'Pectoralis Major',
        equipment: 'Barbell',
        formTip:
          'Pinch shoulder blades together and plant feet flat. Lower the bar to mid-chest then press in a slight arc toward the rack.',
      },
      {
        id: 'push_02',
        name: 'Incline Dumbbell Press',
        targetMuscle: 'Upper Chest',
        equipment: 'Dumbbells',
        formTip:
          'Set bench to 30–45°. Press from shoulder level to full lockout, keeping wrists stacked over elbows throughout.',
      },
      {
        id: 'push_03',
        name: 'Barbell Overhead Press',
        targetMuscle: 'Anterior & Lateral Deltoids',
        equipment: 'Barbell',
        formTip:
          'Brace core and glutes before pressing. Push your head through after the bar clears your forehead and lock out fully overhead.',
      },
      {
        id: 'push_04',
        name: 'Dumbbell Lateral Raise',
        targetMuscle: 'Lateral Deltoid',
        equipment: 'Dumbbells',
        formTip:
          'Lean forward 10–15° and lead with the pinky side (as if pouring a jug) to maximize lateral head activation.',
      },
      {
        id: 'push_05',
        name: 'Cable Tricep Pushdown',
        targetMuscle: 'Triceps Brachii',
        equipment: 'Cable',
        formTip:
          'Pin elbows at your sides and push handle down to full extension. On a rope, flare wrists outward at the bottom for peak contraction.',
      },
    ],
  },

  // ── Routine 2: Legs 1 ──────────────────────────────────────────────────────
  {
    id: 'legs1',
    title: 'Legs 1',
    dayLabel: 'Wednesday',
    targets: ['Quads', 'Hamstrings', 'Calves', 'Glutes'],
    exercises: [
      {
        id: 'legs1_01',
        name: 'Barbell Back Squat',
        targetMuscle: 'Quads & Glutes',
        equipment: 'Barbell',
        formTip:
          'Bar sits across upper traps. Brace hard, break at hips and knees together, squat to parallel, and drive knees out over toes on the ascent.',
      },
      {
        id: 'legs1_02',
        name: 'Romanian Deadlift',
        targetMuscle: 'Hamstrings & Glutes',
        equipment: 'Barbell',
        formTip:
          'Soft knee bend throughout. Hinge at the hips and push them back as the bar traces the legs. Stop when you feel a strong hamstring stretch — not when the lower back rounds.',
      },
      {
        id: 'legs1_03',
        name: 'Leg Press',
        targetMuscle: 'Quads, Glutes & Hamstrings',
        equipment: 'Leg Press Machine',
        formTip:
          'Feet shoulder-width at mid-platform. Never lock out completely at the top. Lower until hips just start to tuck — that\'s your safe range.',
      },
      {
        id: 'legs1_04',
        name: 'Lying Leg Curl',
        targetMuscle: 'Hamstrings',
        equipment: 'Leg Curl Machine',
        formTip:
          'Hips stay pressed into the pad. Curl until heels nearly touch glutes and hold the squeeze. Control the descent — 3 seconds down.',
      },
      {
        id: 'legs1_05',
        name: 'Smith Machine Calf Raise',
        targetMuscle: 'Gastrocnemius & Soleus',
        equipment: 'Smith Machine',
        formTip:
          'Stand on a plate for full range. Rise to full extension, hold 1 second, then drop all the way into a stretch. Slow and controlled beats heavy and bouncy.',
      },
    ],
  },

  // ── Routine 3: Pull + Arms ─────────────────────────────────────────────────
  {
    id: 'pull_arms',
    title: 'Pull + Arms',
    dayLabel: 'Friday',
    targets: ['Back', 'Biceps', 'Rear Delts'],
    exercises: [
      {
        id: 'pull_01',
        name: 'Barbell Deadlift',
        targetMuscle: 'Erector Spinae & Hamstrings',
        equipment: 'Barbell',
        formTip:
          'Bar over mid-foot. Push the floor away with hips and knees extending simultaneously. Keep the bar dragging close to the legs the whole way up.',
      },
      {
        id: 'pull_02',
        name: 'Lat Pulldown',
        targetMuscle: 'Latissimus Dorsi',
        equipment: 'Lat Pulldown Machine',
        formTip:
          'Lean back slightly and initiate the pull by depressing the shoulder blades first. Drive elbows toward your hips — don\'t just pull the bar down.',
      },
      {
        id: 'pull_03',
        name: 'Seated Cable Row',
        targetMuscle: 'Rhomboids & Mid-Traps',
        equipment: 'Cable Row Machine',
        formTip:
          'Sit tall and brace. Pull the handle to your lower sternum, squeezing shoulder blades together at end range. No shrugging.',
      },
      {
        id: 'pull_04',
        name: 'Cable Face Pull',
        targetMuscle: 'Rear Deltoids & Rotator Cuff',
        equipment: 'Cable',
        formTip:
          'Set cable at upper-chest height with a rope. Pull to the face, separating the rope at ear level with arms parallel to the floor. Prioritize quality over load.',
      },
      {
        id: 'pull_05',
        name: 'EZ-Bar Curl',
        targetMuscle: 'Biceps Brachii',
        equipment: 'EZ-Bar',
        formTip:
          'Elbows pinned at sides. Curl to full contraction and supinate slightly at the top. Lower for a full 2-second count — the stretch matters as much as the peak.',
      },
    ],
  },

  // ── Routine 4: Legs + Core ─────────────────────────────────────────────────
  {
    id: 'legs_core',
    title: 'Legs + Core',
    dayLabel: 'Saturday',
    targets: ['Quads', 'Hamstrings', 'Core'],
    exercises: [
      {
        id: 'legs2_01',
        name: 'Smith Machine Squat',
        targetMuscle: 'Quads & Glutes',
        equipment: 'Smith Machine',
        formTip:
          'Place feet slightly forward of the bar (Smith path is fixed). Push knees out and maintain an upright torso throughout the movement.',
      },
      {
        id: 'legs2_02',
        name: 'Leg Extension',
        targetMuscle: 'Quadriceps',
        equipment: 'Leg Extension Machine',
        formTip:
          'Sit upright with back against the pad. Extend fully and hold 1 second at peak. Control the descent — 2–3 seconds — for maximum time under tension.',
      },
      {
        id: 'legs2_03',
        name: 'Dumbbell Romanian Deadlift',
        targetMuscle: 'Hamstrings & Glutes',
        equipment: 'Dumbbells',
        formTip:
          'Dumbbells glide down the front of the thighs. Push hips back, maintain a proud chest and neutral spine. Squeeze glutes aggressively at lockout.',
      },
      {
        id: 'legs2_04',
        name: 'Cable Crunch',
        targetMuscle: 'Rectus Abdominis',
        equipment: 'Cable',
        formTip:
          'Kneel facing the stack, rope beside ears. Crunch by flexing the spine — not the hips. All movement comes from the abs contracting, not from swinging forward.',
      },
      {
        id: 'legs2_05',
        name: 'Stability Ball Rollout',
        targetMuscle: 'Core Anti-Extension',
        equipment: 'Stability Ball',
        formTip:
          'Kneel with hands on the ball. Roll forward until hips near full extension, bracing your core the entire time. Pull back using the abs — not the lower back.',
      },
    ],
  },
];

// ─── Convenience lookups ──────────────────────────────────────────────────────

/** Find a routine by its ID string. */
export function getRoutineById(id) {
  return ROUTINES_DB.find((r) => r.id === id) ?? null;
}

/** Flat array of every exercise across all routines. */
export const ALL_ROUTINE_EXERCISES = ROUTINES_DB.flatMap((r) => r.exercises);

// ─── Legacy body-part catalogue (retained for reference) ─────────────────────

export const EXERCISE_DB = {
  Chest: [
    { id: 'chest_01', name: 'Barbell Bench Press',    targetMuscle: 'Pectoralis Major', equipment: 'Barbell',          formTip: 'Keep shoulder blades pinched and feet flat. Lower to mid-chest and press in a slight arc.' },
    { id: 'chest_02', name: 'Incline Dumbbell Press', targetMuscle: 'Upper Chest',      equipment: 'Dumbbells',         formTip: 'Set bench 30–45°. Press from shoulder level to full lockout, wrists over elbows.' },
    { id: 'chest_03', name: 'Cable Crossover Fly',    targetMuscle: 'Pectoralis Major', equipment: 'Cable',             formTip: 'Slight elbow bend. Squeeze the chest at the midpoint — don\'t just swing the arms.' },
    { id: 'chest_04', name: 'Smith Close-Grip Press', targetMuscle: 'Inner Chest & Triceps', equipment: 'Smith Machine', formTip: 'Elbows at 45° to protect the shoulder and maximize tricep activation.' },
  ],
  Back: [
    { id: 'back_01', name: 'Barbell Deadlift',       targetMuscle: 'Erector Spinae',    equipment: 'Barbell',            formTip: 'Push the floor away, keep the bar on the legs the full way up.' },
    { id: 'back_02', name: 'Lat Pulldown',           targetMuscle: 'Latissimus Dorsi',  equipment: 'Lat Pulldown Machine', formTip: 'Depress shoulder blades first, then drive elbows toward hips.' },
    { id: 'back_03', name: 'Seated Cable Row',       targetMuscle: 'Rhomboids',         equipment: 'Cable Row Machine',   formTip: 'Sit tall, pull to lower sternum, squeeze blades — no shrugging.' },
    { id: 'back_04', name: 'Single-Arm DB Row',      targetMuscle: 'Lats & Rhomboids',  equipment: 'Dumbbells',           formTip: 'Pull the elbow, not the hand. Slight torso rotation at the top.' },
  ],
  Legs: [
    { id: 'legs_01', name: 'Barbell Back Squat', targetMuscle: 'Quads & Glutes',    equipment: 'Barbell',             formTip: 'Break at hips and knees together. Drive knees out over toes on the way up.' },
    { id: 'legs_02', name: 'Leg Press',          targetMuscle: 'Quads & Glutes',    equipment: 'Leg Press Machine',   formTip: 'Mid-platform foot placement. Never fully lock out at the top.' },
    { id: 'legs_03', name: 'Leg Extension',      targetMuscle: 'Quadriceps',        equipment: 'Leg Extension Machine', formTip: 'Hold 1 s at the top. 2–3 s controlled descent.' },
    { id: 'legs_04', name: 'Lying Leg Curl',     targetMuscle: 'Hamstrings',        equipment: 'Leg Curl Machine',    formTip: 'Hips stay on pad. Flex hard at the top; control the descent.' },
  ],
  Arms: [
    { id: 'arms_01', name: 'EZ-Bar Curl',           targetMuscle: 'Biceps Brachii',  equipment: 'EZ-Bar',  formTip: 'Elbows pinned. Supinate at the top for peak contraction.' },
    { id: 'arms_02', name: 'Dumbbell Hammer Curl',  targetMuscle: 'Brachialis',      equipment: 'Dumbbells', formTip: 'Neutral grip throughout — targets thickness under the bicep.' },
    { id: 'arms_03', name: 'Cable Tricep Pushdown', targetMuscle: 'Triceps Brachii', equipment: 'Cable',   formTip: 'Elbows fixed at sides. Rope — flare wrists at the bottom.' },
    { id: 'arms_04', name: 'EZ-Bar Skull Crusher',  targetMuscle: 'Triceps Long Head', equipment: 'EZ-Bar', formTip: 'Upper arms stay vertical. Lower to forehead; extend fully.' },
  ],
  Shoulders: [
    { id: 'sh_01', name: 'Barbell OHP',          targetMuscle: 'Anterior & Lateral Delts', equipment: 'Barbell',   formTip: 'Brace and lock out overhead; push head through after bar clears.' },
    { id: 'sh_02', name: 'DB Lateral Raise',     targetMuscle: 'Lateral Deltoid',          equipment: 'Dumbbells', formTip: 'Lead with the pinky side. 10–15° forward lean.' },
    { id: 'sh_03', name: 'Cable Face Pull',       targetMuscle: 'Rear Delts',              equipment: 'Cable',     formTip: 'Pull to face level; externally rotate at the end.' },
    { id: 'sh_04', name: 'DB Front Raise',        targetMuscle: 'Anterior Deltoid',         equipment: 'Dumbbells', formTip: 'Raise to just above shoulder height. Slow and controlled.' },
  ],
  Core: [
    { id: 'core_01', name: 'Cable Crunch',           targetMuscle: 'Rectus Abdominis',  equipment: 'Cable',          formTip: 'Flex the spine — not the hips. Movement comes from the abs.' },
    { id: 'core_02', name: 'Bosu Ball Plank',        targetMuscle: 'Deep Stabilizers',  equipment: 'Bosu Ball',      formTip: 'Forearms on flat side. Hips level — no sag or pike.' },
    { id: 'core_03', name: 'Stability Ball Rollout', targetMuscle: 'Anti-Extension Core', equipment: 'Stability Ball', formTip: 'Roll out until hips extend; pull back using abs, not the back.' },
  ],
};

export const BODY_PARTS = Object.keys(EXERCISE_DB);
export const ALL_EXERCISES = Object.values(EXERCISE_DB).flat();
