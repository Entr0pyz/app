import { useState, useRef } from 'react';
import { User, Download, Upload, AlertTriangle, CheckCircle2, Save } from 'lucide-react';
import { useWorkoutData } from '../hooks/useWorkoutData';

// ─── Athlete Profile Card ──────────────────────────────────────────────────────

function ProfileCard({ userProfile, updateProfile }) {
  const [name, setName] = useState(userProfile?.name ?? '');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    if (!name.trim()) return;
    updateProfile(name.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSave();
  }

  return (
    <section className="settings-card" aria-labelledby="profile-heading">
      <div className="settings-card__header">
        <div className="settings-card__icon-wrap">
          <User size={18} strokeWidth={2} />
        </div>
        <h2 id="profile-heading" className="settings-card__title heading">
          Athlete Profile
        </h2>
      </div>

      <p className="settings-card__description">
        Your name shows up on the home screen greeting. Keep it short and fierce.
      </p>

      <div className="settings-field">
        <label htmlFor="athlete-name" className="settings-field__label">
          Display Name
        </label>
        <input
          id="athlete-name"
          type="text"
          className="input-field settings-field__input"
          placeholder="e.g. Alex"
          value={name}
          maxLength={32}
          onChange={(e) => { setName(e.target.value); setSaved(false); }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
      </div>

      <button
        id="save-profile-name"
        className={`settings-btn settings-btn--primary${saved ? ' settings-btn--saved' : ''}`}
        onClick={handleSave}
        disabled={!name.trim()}
      >
        {saved ? (
          <>
            <CheckCircle2 size={18} strokeWidth={2.5} />
            Saved!
          </>
        ) : (
          <>
            <Save size={18} strokeWidth={2.5} />
            Save Name
          </>
        )}
      </button>
    </section>
  );
}

// ─── Data Vault Card ───────────────────────────────────────────────────────────

function DataVaultCard({ exportDataAsJSON, importDataFromJSON }) {
  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState(null); // null | 'success' | 'error'
  const [importMsg, setImportMsg] = useState('');

  function handleExport() {
    exportDataAsJSON();
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus(null);
    setImportMsg('');

    try {
      await importDataFromJSON(file);
      setImportStatus('success');
      setImportMsg('Backup restored! Refresh the app to load your data.');
    } catch (err) {
      setImportStatus('error');
      setImportMsg(err.message ?? 'Failed to import backup.');
    } finally {
      // Reset so the same file can be re-selected
      e.target.value = '';
    }
  }

  return (
    <section className="settings-card" aria-labelledby="vault-heading">
      <div className="settings-card__header">
        <div className="settings-card__icon-wrap">
          <Download size={18} strokeWidth={2} />
        </div>
        <h2 id="vault-heading" className="settings-card__title heading">
          Data Vault
        </h2>
      </div>

      {/* ── Export ── */}
      <div className="settings-action-group">
        <div className="settings-action-group__text">
          <p className="settings-action-group__label">Download Backup</p>
          <p className="settings-action-group__hint">
            Exports your entire workout history and profile as a .json file, saved directly to your device.
          </p>
        </div>
        <button
          id="export-backup"
          className="settings-btn settings-btn--primary settings-btn--full"
          onClick={handleExport}
        >
          <Download size={18} strokeWidth={2.5} />
          Download Backup
        </button>
      </div>

      <div className="settings-divider" />

      {/* ── Import ── */}
      <div className="settings-action-group">
        <div className="settings-action-group__text">
          <p className="settings-action-group__label">Upload Backup</p>
          <p className="settings-action-group__hint">
            Restore data from a previously downloaded IronLog .json backup file.
          </p>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          aria-hidden="true"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <button
          id="import-backup"
          className="settings-btn settings-btn--ghost settings-btn--full"
          onClick={handleImportClick}
        >
          <Upload size={18} strokeWidth={2.5} />
          Upload Backup
        </button>

        {/* Warning */}
        <div className="settings-warning">
          <AlertTriangle size={13} strokeWidth={2} className="settings-warning__icon" />
          <p className="settings-warning__text">
            Uploading a backup will <strong>permanently overwrite</strong> all existing local data. This cannot be undone.
          </p>
        </div>

        {/* Import feedback */}
        {importStatus && (
          <div className={`settings-feedback settings-feedback--${importStatus}`}>
            {importStatus === 'success'
              ? <CheckCircle2 size={14} strokeWidth={2} />
              : <AlertTriangle size={14} strokeWidth={2} />}
            <span>{importMsg}</span>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Settings() {
  const { data, updateProfile, exportDataAsJSON, importDataFromJSON } = useWorkoutData();
  const { userProfile } = data;

  return (
    <main className="settings-page">
      <header className="settings-header">
        <h1 className="settings-header__title heading">Settings</h1>
        <p className="settings-header__sub text-muted">Manage your profile and workout data.</p>
      </header>

      <ProfileCard userProfile={userProfile} updateProfile={updateProfile} />
      <DataVaultCard
        exportDataAsJSON={exportDataAsJSON}
        importDataFromJSON={importDataFromJSON}
      />

      <footer className="settings-footer">
        <p className="settings-footer__text">
          IronLog stores all data locally on your device. Nothing is ever sent to a server.
        </p>
      </footer>
    </main>
  );
}
