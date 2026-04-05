import { useNavigate } from 'react-router-dom';
import { Calendar, Dumbbell, TrendingUp, Zap, ChevronRight, BarChart2 } from 'lucide-react';
import { useWorkoutData } from '../hooks/useWorkoutData';

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Format ISO date string → "Mon, Apr 5 · 10:32 AM" */
function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }) + ' · ' + d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Return the best set (highest weight × reps) from a set array */
function getBestSet(sets) {
  if (!sets || sets.length === 0) return null;
  return sets.reduce((best, s) => {
    const score = (s.weightKg ?? 0) * (s.reps ?? 0);
    const bestScore = (best.weightKg ?? 0) * (best.reps ?? 0);
    return score > bestScore ? s : best;
  }, sets[0]);
}

/** Calculate total volume (sum of weight × reps across all sets) */
function calcVolume(exercises) {
  return exercises.reduce((total, ex) => {
    const exVol = (ex.sets ?? []).reduce(
      (s, set) => s + (set.weightKg ?? 0) * (set.reps ?? 0),
      0
    );
    return total + exVol;
  }, 0);
}

// ─── Exercise Row ──────────────────────────────────────────────────────────────

function ExerciseRow({ exercise }) {
  const { exerciseName, sets = [] } = exercise;
  const best = getBestSet(sets);
  const setCount = sets.length;

  let summary = `${setCount} ${setCount === 1 ? 'set' : 'sets'}`;
  if (best) {
    const weightStr = best.weightKg > 0 ? ` · Best: ${best.weightKg} kg × ${best.reps}` : ` · ${best.reps} reps`;
    summary += weightStr;
  }

  return (
    <div className="history-exercise-row">
      <Dumbbell size={13} className="history-exercise-row__icon" strokeWidth={2} />
      <div className="history-exercise-row__content">
        <span className="history-exercise-row__name">{exerciseName}</span>
        <span className="history-exercise-row__summary">{summary}</span>
      </div>
    </div>
  );
}

// ─── Session Card ──────────────────────────────────────────────────────────────

function SessionCard({ session, index }) {
  const { routineTitle, date, exercises = [] } = session;
  const volume = calcVolume(exercises);
  const totalSets = exercises.reduce((n, ex) => n + (ex.sets?.length ?? 0), 0);

  return (
    <article className="history-card" style={{ '--card-index': index }}>
      {/* Timeline dot + connector */}
      <div className="history-card__timeline">
        <div className="history-card__dot" />
        <div className="history-card__line" />
      </div>

      {/* Card body */}
      <div className="history-card__body">
        {/* Header */}
        <div className="history-card__header">
          <h2 className="history-card__title heading">{routineTitle}</h2>
          <span className="history-card__date">
            <Calendar size={12} strokeWidth={2} />
            {formatDate(date)}
          </span>
        </div>

        {/* Stats strip */}
        <div className="history-card__stats">
          <div className="history-stat">
            <Zap size={13} strokeWidth={2} className="history-stat__icon" />
            <span>{exercises.length} exercises</span>
          </div>
          <div className="history-stat">
            <TrendingUp size={13} strokeWidth={2} className="history-stat__icon" />
            <span>{totalSets} sets</span>
          </div>
          {volume > 0 && (
            <div className="history-stat history-stat--accent">
              <span>{volume.toLocaleString()} kg vol</span>
            </div>
          )}
        </div>

        {/* Exercise breakdown */}
        {exercises.length > 0 && (
          <div className="history-card__exercises">
            {exercises.map((ex) => (
              <ExerciseRow key={ex.exerciseId} exercise={ex} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ onGoHome }) {
  return (
    <div className="history-empty">
      <div className="history-empty__icon-wrap">
        <BarChart2 size={52} strokeWidth={1.25} className="history-empty__icon" />
      </div>
      <h1 className="history-empty__headline heading">
        No history yet.
        <br />
        <span className="text-accent">Go crush a session.</span>
      </h1>
      <p className="history-empty__sub">
        Every rep you log will appear here as a permanent record of your progress.
      </p>
      <button
        id="history-go-home"
        className="btn-primary history-empty__cta"
        onClick={onGoHome}
      >
        Start a Workout <ChevronRight size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function History() {
  const navigate = useNavigate();
  const { data } = useWorkoutData();
  const workoutHistory = data?.workoutHistory ?? [];

  if (workoutHistory.length === 0) {
    return (
      <main className="history-page history-page--empty">
        <EmptyState onGoHome={() => navigate('/')} />
      </main>
    );
  }

  return (
    <main className="history-page">
      {/* Page headline */}
      <header className="history-header">
        <h1 className="history-header__title heading">Progress Log</h1>
        <p className="history-header__count text-muted">
          {workoutHistory.length} {workoutHistory.length === 1 ? 'session' : 'sessions'} recorded
        </p>
      </header>

      {/* Timeline feed — already sorted newest-first by the hook */}
      <div className="history-feed">
        {workoutHistory.map((session, i) => (
          <SessionCard key={session.id} session={session} index={i} />
        ))}
      </div>
    </main>
  );
}
