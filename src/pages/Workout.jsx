import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Plus, Dumbbell, Info, Home, Timer, PlayCircle, X, Trash2 } from 'lucide-react';
import { ROUTINES_DB } from '../data/exerciseDatabase';
import { useWorkoutData } from '../hooks/useWorkoutData';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildInitialLogs(exercises) {
  return Object.fromEntries(exercises.map((ex) => [ex.id, { sets: [] }]));
}

function buildInitialInputs(exercises) {
  return Object.fromEntries(exercises.map((ex) => [ex.id, { weight: '', reps: '' }]));
}

function formatElapsed(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Determines whether a weight value is valid for logging (numeric > 0 or "BW")
function isWeightValid(weight) {
  if (typeof weight === 'string' && weight.trim().toUpperCase() === 'BW') return true;
  return parseFloat(weight) > 0;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Workout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { saveWorkoutSession } = useWorkoutData();

  const routineId = location.state?.routineId ?? null;
  const routine = routineId ? ROUTINES_DB.find((r) => r.id === routineId) : null;

  // ── Session-local copy of exercises (master DB never modified) ────────────
  // activeExercises is initialised from routine.exercises so removals are
  // session-only and the ROUTINES_DB remains untouched.
  const [activeExercises, setActiveExercises] = useState(() =>
    routine ? [...routine.exercises] : []
  );

  // Per-exercise set logs: { [exerciseId]: { sets: [{setNumber, weightKg, reps}] } }
  const [logs, setLogs] = useState(() =>
    routine ? buildInitialLogs(routine.exercises) : {}
  );

  // Per-exercise input values: { [exerciseId]: { weight: string, reps: string } }
  const [inputs, setInputs] = useState(() =>
    routine ? buildInitialInputs(routine.exercises) : {}
  );

  // Track which form tips are expanded
  const [expandedTips, setExpandedTips] = useState({});

  // Custom exercise input UI state
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState('');

  // Elapsed workout timer
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!routine) return;
    const id = setInterval(() => setElapsed((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [routine]);

  // ── No routine fallback ───────────────────────────────────────────────────
  if (!routine) {
    return (
      <main className="workout-no-routine">
        <Dumbbell size={52} color="var(--color-muted)" strokeWidth={1.25} />
        <h1 className="heading" style={{ fontSize: '2rem' }}>No Routine Selected</h1>
        <p style={{ color: 'var(--color-muted)', maxWidth: '260px', textAlign: 'center', lineHeight: 1.5 }}>
          Choose a workout session from the Home screen to get started.
        </p>
        <button
          className="btn-primary"
          onClick={() => navigate('/')}
          id="back-to-home-btn"
          style={{ marginTop: '8px' }}
        >
          <Home size={16} />
          Back to Home
        </button>
      </main>
    );
  }

  // ── Input handlers ────────────────────────────────────────────────────────
  function handleInputChange(exerciseId, field, value) {
    setInputs((prev) => ({
      ...prev,
      [exerciseId]: { ...prev[exerciseId], [field]: value },
    }));
  }

  function handleSetBodyweight(exerciseId) {
    setInputs((prev) => ({
      ...prev,
      [exerciseId]: { ...prev[exerciseId], weight: 'BW' },
    }));
  }

  function handleLogSet(exerciseId) {
    const { weight, reps } = inputs[exerciseId];
    const repsNum = parseInt(reps, 10);

    if (!isWeightValid(weight) || !repsNum || repsNum <= 0) return;

    const weightValue = weight.trim().toUpperCase() === 'BW' ? 'BW' : parseFloat(weight);

    setLogs((prev) => {
      const existing = prev[exerciseId].sets;
      const newSet = {
        setNumber: existing.length + 1,
        weightKg: weightValue,
        reps: repsNum,
      };
      return {
        ...prev,
        [exerciseId]: { sets: [...existing, newSet] },
      };
    });

    // Clear inputs after logging
    setInputs((prev) => ({
      ...prev,
      [exerciseId]: { weight: '', reps: '' },
    }));
  }

  function toggleTip(exerciseId) {
    setExpandedTips((prev) => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
  }

  // ── Remove exercise (session-only, master DB untouched) ───────────────────
  function handleRemoveExercise(exerciseId) {
    setActiveExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
  }

  // ── Add custom exercise ───────────────────────────────────────────────────
  function handleAddCustomExercise() {
    const trimmed = customName.trim();
    if (!trimmed) return;

    const id = `custom-${Date.now()}`;
    const newExercise = {
      id,
      name: trimmed,
      targetMuscle: 'Custom',
      equipment: 'Various',
      formTip: null,
      isCustom: true,
    };

    // Push into the unified activeExercises list
    setActiveExercises((prev) => [...prev, newExercise]);
    setLogs((prev) => ({ ...prev, [id]: { sets: [] } }));
    setInputs((prev) => ({ ...prev, [id]: { weight: '', reps: '' } }));
    setCustomName('');
    setShowCustomInput(false);
  }

  // ── Finish workout ────────────────────────────────────────────────────────
  function handleFinish() {
    // Map over activeExercises — respects both removals and custom additions
    const exercises = activeExercises.map((ex) => ({
      exerciseId: ex.id,
      exerciseName: ex.name,
      sets: logs[ex.id]?.sets ?? [],
    }));

    saveWorkoutSession({
      routineId: routine.id,
      routineTitle: `${routine.dayLabel.toUpperCase()}: ${routine.title.toUpperCase()}`,
      exercises,
    });

    navigate('/history');
  }

  // Count total sets logged across all active exercises
  const totalSets = activeExercises.reduce(
    (acc, ex) => acc + (logs[ex.id]?.sets.length ?? 0),
    0
  );

  // Combined title: "MONDAY: PUSH"
  const displayTitle = `${routine.dayLabel.toUpperCase()}: ${routine.title.toUpperCase()}`;

  // ── Shared card renderer (used for both routine and custom exercises) ──────
  function renderExerciseCard(exercise, index) {
    const { sets } = logs[exercise.id] ?? { sets: [] };
    const { weight, reps } = inputs[exercise.id] ?? { weight: '', reps: '' };
    const isTipOpen = expandedTips[exercise.id] ?? false;
    const canLog = isWeightValid(weight) && parseInt(reps, 10) > 0;
    const isBW = weight.trim().toUpperCase() === 'BW';

    return (
      <div
        key={exercise.id}
        className={[
          'exercise-card',
          sets.length > 0 ? 'exercise-card--has-sets' : '',
          exercise.isCustom ? 'exercise-card--custom' : '',
        ].filter(Boolean).join(' ')}
        id={`exercise-${exercise.id}`}
      >
        {/* Card header */}
        <div className="exercise-card__header">
          <div className="exercise-card__meta">
            <span className="exercise-card__number text-muted">
              {String(index + 1).padStart(2, '0')}
            </span>
            {exercise.isCustom ? (
              <span className="badge badge--custom">Custom</span>
            ) : (
              <span className="badge">{exercise.targetMuscle}</span>
            )}
            {!exercise.isCustom && (
              <span className="exercise-card__equipment text-muted">
                {exercise.equipment}
              </span>
            )}
          </div>

          <div className="exercise-card__icon-actions">
            {/* YouTube form tutorial link */}
            <a
              className="exercise-card__yt-link"
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name)}+proper+form`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch ${exercise.name} form tutorial on YouTube`}
              id={`yt-link-${exercise.id}`}
            >
              <PlayCircle size={14} strokeWidth={2} />
              <span>Form</span>
            </a>

            {/* Info / form tip toggle (routine exercises only) */}
            {!exercise.isCustom && (
              <button
                className="exercise-card__tip-toggle"
                onClick={() => toggleTip(exercise.id)}
                aria-label="Toggle form tip"
                aria-expanded={isTipOpen}
                id={`tip-toggle-${exercise.id}`}
              >
                <Info size={15} strokeWidth={2} />
              </button>
            )}

            {/* Remove exercise (session-only) */}
            <button
              className="exercise-card__remove"
              onClick={() => handleRemoveExercise(exercise.id)}
              aria-label={`Remove ${exercise.name} from today's session`}
              id={`remove-exercise-${exercise.id}`}
            >
              <Trash2 size={14} strokeWidth={2} />
            </button>
          </div>
        </div>

        <h2 className="exercise-card__name heading">{exercise.name}</h2>

        {/* Form tip (collapsible, routine exercises only) */}
        {isTipOpen && exercise.formTip && (
          <div className="exercise-card__form-tip" role="note">
            <span className="exercise-card__tip-label">Form Tip</span>
            <p>{exercise.formTip}</p>
          </div>
        )}

        {/* Logged sets */}
        {sets.length > 0 && (
          <div className="exercise-card__sets-log">
            {sets.map((set) => (
              <div key={set.setNumber} className="set-row">
                <CheckCircle2
                  size={13}
                  color="var(--color-accent)"
                  strokeWidth={2.5}
                  className="set-row__check"
                />
                <span className="set-row__label">Set {set.setNumber}</span>
                <span className="set-row__data">
                  {set.weightKg} {set.weightKg !== 'BW' ? 'kg' : ''} &times; {set.reps} reps
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Input row */}
        <div className="set-inputs">
          {/* Weight field + BW toggle */}
          <div className="set-inputs__field">
            <label className="set-inputs__label" htmlFor={`weight-${exercise.id}`}>
              Weight (kg)
            </label>
            <div className="set-inputs__weight-wrap">
              <input
                id={`weight-${exercise.id}`}
                className={`input-field${isBW ? ' input-field--bw' : ''}`}
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={weight}
                onChange={(e) => handleInputChange(exercise.id, 'weight', e.target.value)}
              />
              <button
                className={`btn-bw${isBW ? ' btn-bw--active' : ''}`}
                onClick={() => handleSetBodyweight(exercise.id)}
                aria-label="Set weight to bodyweight"
                id={`bw-toggle-${exercise.id}`}
                tabIndex={-1}
              >
                BW
              </button>
            </div>
          </div>

          {/* Reps field */}
          <div className="set-inputs__field">
            <label className="set-inputs__label" htmlFor={`reps-${exercise.id}`}>
              Reps
            </label>
            <input
              id={`reps-${exercise.id}`}
              className="input-field"
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              placeholder="0"
              value={reps}
              onChange={(e) => handleInputChange(exercise.id, 'reps', e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleLogSet(exercise.id);
              }}
            />
          </div>

          <button
            className={`btn-log-set${canLog ? ' btn-log-set--ready' : ''}`}
            onClick={() => handleLogSet(exercise.id)}
            disabled={!canLog}
            aria-label={`Log set for ${exercise.name}`}
            id={`log-set-${exercise.id}`}
          >
            <Plus size={17} strokeWidth={2.5} />
            Log Set
          </button>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="workout-page">

      {/* ── Workout Header ─────────────────────────────────────────── */}
      <header className="workout-header">
        <div className="workout-header__timer">
          <Timer size={13} strokeWidth={2} />
          {formatElapsed(elapsed)}
        </div>
        <h1 className="workout-header__title heading">{displayTitle}</h1>
        <div className="workout-header__targets">
          {routine.targets.map((t) => (
            <span key={t} className="badge">{t}</span>
          ))}
        </div>
        {totalSets > 0 && (
          <p className="workout-header__progress text-muted">
            {totalSets} set{totalSets !== 1 ? 's' : ''} logged
          </p>
        )}
      </header>

      {/* ── Exercise Cards ─────────────────────────────────────────── */}
      <div className="exercise-list">
        {activeExercises.map((exercise, index) =>
          renderExerciseCard(exercise, index)
        )}
      </div>

      {/* ── Add Custom Exercise ────────────────────────────────────── */}
      <div className="add-custom-exercise">
        {!showCustomInput ? (
          <button
            className="btn-add-custom"
            onClick={() => setShowCustomInput(true)}
            id="add-custom-exercise-btn"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Custom Exercise
          </button>
        ) : (
          <div className="add-custom-exercise__input-row">
            <input
              className="input-field add-custom-exercise__input"
              type="text"
              placeholder="e.g. Preacher Curls"
              value={customName}
              autoFocus
              onChange={(e) => setCustomName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddCustomExercise();
                if (e.key === 'Escape') { setShowCustomInput(false); setCustomName(''); }
              }}
              id="custom-exercise-name-input"
            />
            <button
              className="btn-add-custom-confirm"
              onClick={handleAddCustomExercise}
              disabled={!customName.trim()}
              id="confirm-custom-exercise-btn"
            >
              Add
            </button>
            <button
              className="btn-add-custom-cancel"
              onClick={() => { setShowCustomInput(false); setCustomName(''); }}
              aria-label="Cancel"
              id="cancel-custom-exercise-btn"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>

      {/* ── Finish Workout Button ──────────────────────────────────── */}
      <div className="workout-finish">
        {totalSets === 0 && (
          <p className="workout-finish__hint text-muted">
            Log at least one set to save this session.
          </p>
        )}
        <button
          className="btn-finish"
          onClick={handleFinish}
          disabled={totalSets === 0}
          id="finish-workout-btn"
        >
          <CheckCircle2 size={22} strokeWidth={2.5} />
          Finish Workout
        </button>
      </div>

    </main>
  );
}
