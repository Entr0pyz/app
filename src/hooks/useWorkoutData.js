import { useState, useCallback } from 'react';
import { ROUTINES_DB } from '../data/exerciseDatabase';

// ─── Storage key ──────────────────────────────────────────────────────────────
const STORAGE_KEY = 'ironlog_data';

// ─── Default weekly routine (built from ROUTINES_DB) ─────────────────────────
function buildDefaultWeeklyRoutine() {
  return ROUTINES_DB.map((routine) => ({
    id: routine.id,
    title: `${routine.dayLabel}: ${routine.title}`,   // e.g. "Monday: Push"
    dayLabel: routine.dayLabel,
    routineTitle: routine.title,
    isCompleted: false,
  }));
}

// ─── Default state shape ──────────────────────────────────────────────────────
/**
 * workoutHistory entries:
 * {
 *   id:           string   (timestamp-based)
 *   date:         string   (ISO)
 *   routineId:    string   (matches ROUTINES_DB id)
 *   routineTitle: string
 *   exercises: [
 *     {
 *       exerciseId:   string
 *       exerciseName: string
 *       sets: [{ setNumber: number, reps: number, weightKg: number }]
 *     }
 *   ]
 * }
 */
const DEFAULT_STATE = {
  userProfile: {
    name: '',
  },
  weeklyRoutine: buildDefaultWeeklyRoutine(),
  workoutHistory: [],
};

// ─── localStorage helpers ─────────────────────────────────────────────────────
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      userProfile:   { ...DEFAULT_STATE.userProfile,   ...(parsed.userProfile ?? {}) },
      weeklyRoutine: parsed.weeklyRoutine ?? DEFAULT_STATE.weeklyRoutine,
      workoutHistory: parsed.workoutHistory ?? DEFAULT_STATE.workoutHistory,
    };
  } catch (err) {
    console.error('[IronLog] Failed to load from localStorage:', err);
    return DEFAULT_STATE;
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('[IronLog] Failed to save to localStorage:', err);
  }
}

// ─── Backup utilities (module-level — no hook dependency) ────────────────────

/**
 * Downloads the current localStorage data as a timestamped .json backup file.
 */
export function exportDataAsJSON() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    console.warn('[IronLog] Nothing in localStorage to export.');
    return;
  }
  const blob = new Blob([raw], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const timestamp = new Date().toISOString().slice(0, 10);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `IronLog-Backup-${timestamp}.json`;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Reads an uploaded .json file and overwrites localStorage with its contents.
 * Returns a Promise — on resolve, reload the app.
 *
 * @param {File} file
 * @returns {Promise<object>}
 */
export function importDataFromJSON(file) {
  return new Promise((resolve, reject) => {
    if (!file || file.type !== 'application/json') {
      reject(new Error('Invalid file. Please upload a valid IronLog .json backup.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed.userProfile && !parsed.workoutHistory) {
          reject(new Error('File does not appear to be a valid IronLog backup.'));
          return;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        resolve(parsed);
      } catch (err) {
        reject(new Error('Failed to parse JSON file: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
}

// ─── The Hook ─────────────────────────────────────────────────────────────────
/**
 * useWorkoutData
 *
 * Single source of truth for all IronLog app state.
 * Automatically reads from and persists to localStorage.
 *
 * Returns:
 *   data                             — full state object
 *   updateProfile(name)              — update display name
 *   saveWorkoutSession(sessionData)  — log a session & mark its routine done
 *   resetWeeklyRoutine()             — reset all 4 routines to incomplete
 *   exportDataAsJSON                 — backup download
 *   importDataFromJSON               — backup restore
 */
export function useWorkoutData() {
  const [data, setData] = useState(() => loadFromStorage());

  /** Internal updater — keeps React state and localStorage in sync. */
  const updateData = useCallback((updaterFn) => {
    setData((prev) => {
      const next = updaterFn(prev);
      saveToStorage(next);
      return next;
    });
  }, []);

  // ── Profile ───────────────────────────────────────────────────────────────

  /** @param {string} name */
  const updateProfile = useCallback(
    (name) =>
      updateData((prev) => ({
        ...prev,
        userProfile: { ...prev.userProfile, name: String(name).trim() },
      })),
    [updateData]
  );

  // ── Weekly Routine ────────────────────────────────────────────────────────

  /** Resets all 4 routines back to isCompleted: false. */
  const resetWeeklyRoutine = useCallback(
    () =>
      updateData((prev) => ({
        ...prev,
        weeklyRoutine: buildDefaultWeeklyRoutine(),
      })),
    [updateData]
  );

  // ── Workout History ───────────────────────────────────────────────────────

  /**
   * Logs a completed workout session and marks the matching routine as done.
   *
   * sessionData shape:
   * {
   *   routineId:    string,          // must match a ROUTINES_DB id
   *   routineTitle: string,
   *   exercises: [
   *     {
   *       exerciseId:   string,
   *       exerciseName: string,
   *       sets: [{ setNumber, reps, weightKg }]
   *     }
   *   ]
   * }
   *
   * @param {object} sessionData
   * @returns {object} the saved session record
   */
  const saveWorkoutSession = useCallback(
    (sessionData) => {
      const session = {
        id:           `session_${Date.now()}`,
        date:         new Date().toISOString(),
        routineId:    sessionData.routineId,
        routineTitle: sessionData.routineTitle,
        exercises:    sessionData.exercises ?? [],
      };

      updateData((prev) => ({
        ...prev,
        // Newest session first
        workoutHistory: [session, ...prev.workoutHistory],
        // Mark the matching routine as completed
        weeklyRoutine: prev.weeklyRoutine.map((r) =>
          r.id === session.routineId ? { ...r, isCompleted: true } : r
        ),
      }));

      return session;
    },
    [updateData]
  );

  // ─────────────────────────────────────────────────────────────────────────
  return {
    data,
    updateProfile,
    saveWorkoutSession,
    resetWeeklyRoutine,
    exportDataAsJSON,
    importDataFromJSON,
  };
}
