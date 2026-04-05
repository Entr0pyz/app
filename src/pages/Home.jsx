import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, ChevronRight, Dumbbell } from 'lucide-react';
import { useWorkoutData } from '../hooks/useWorkoutData';
import { ROUTINES_DB } from '../data/exerciseDatabase';

export default function Home() {
  const navigate = useNavigate();
  const { data } = useWorkoutData();
  const { weeklyRoutine, userProfile } = data;

  const greeting = userProfile.name ? `Hey, ${userProfile.name}.` : 'Hey, Athlete.';

  // Count completed routines this week
  const completedCount = weeklyRoutine.filter((r) => r.isCompleted).length;

  return (
    <main className="home-page">

      {/* ── Greeting ─────────────────────────────────────────── */}
      <section className="home-greeting">
        <p className="home-greeting__sub">Welcome back</p>
        <h1 className="home-greeting__name heading">{greeting}</h1>
        <p className="home-greeting__sub">
          {completedCount === 0
            ? 'No sessions logged yet this week. Let\'s get to work.'
            : completedCount === weeklyRoutine.length
            ? 'Week complete. Outstanding work.'
            : `${completedCount} of ${weeklyRoutine.length} sessions done this week.`}
        </p>
      </section>

      {/* ── Weekly Checklist ─────────────────────────────────── */}
      <section className="home-section">
        <h2 className="home-section__title heading">This Week</h2>
        <div className="checklist">
          {weeklyRoutine.map((routine) => (
            <div
              key={routine.id}
              className={`checklist__item${routine.isCompleted ? ' checklist__item--done' : ''}`}
            >
              {routine.isCompleted ? (
                <CheckCircle2
                  className="checklist__icon checklist__icon--done"
                  size={22}
                  strokeWidth={2}
                />
              ) : (
                <Circle
                  className="checklist__icon checklist__icon--empty"
                  size={22}
                  strokeWidth={1.75}
                />
              )}
              <div className="checklist__text">
                <span className="checklist__day">{routine.dayLabel}</span>
                <span className="checklist__routine">{routine.routineTitle}</span>
              </div>
              {routine.isCompleted && (
                <span className="checklist__badge">Done</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Start Workout ─────────────────────────────────────── */}
      <section className="home-section">
        <h2 className="home-section__title heading">Start a Session</h2>
        <div className="routine-grid">
          {ROUTINES_DB.map((routine) => {
            const weeklyEntry = weeklyRoutine.find((r) => r.id === routine.id);
            const isDone = weeklyEntry?.isCompleted ?? false;

            return (
              <button
                key={routine.id}
                id={`start-${routine.id}`}
                className={`routine-card${isDone ? ' routine-card--done' : ''}`}
                onClick={() =>
                  navigate('/workout', { state: { routineId: routine.id } })
                }
                aria-label={`Start ${routine.dayLabel} ${routine.title} workout`}
              >
                <div className="routine-card__header">
                  <span className="routine-card__day text-muted">{routine.dayLabel}</span>
                  {isDone && <span className="routine-card__done-badge">✓ Done</span>}
                </div>
                <h3 className="routine-card__title heading">{routine.title}</h3>
                <p className="routine-card__targets text-muted">
                  {routine.targets.join(' · ')}
                </p>
                <div className="routine-card__footer">
                  <span className="routine-card__count text-muted">
                    <Dumbbell size={13} strokeWidth={1.75} />
                    {routine.exercises.length} exercises
                  </span>
                  <ChevronRight size={18} className="routine-card__arrow" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

    </main>
  );
}
