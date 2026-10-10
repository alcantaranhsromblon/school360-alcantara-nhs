import React, { useRef, useState } from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadToDrive, DriveUploadResult } from '../../lib/driveUpload';
import { toImageUrl } from '../../lib/drive';

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** called after a successful upload so the form can also fill file name/size/type */
  onUploaded?: (info: DriveUploadResult) => void;
  accept?: string;
  showPreview?: boolean;
  hint?: string;
}

/** Text box for a link + "Upload to Google Drive" button. */
export const DriveUploadField: React.FC<Props> = ({
  label, value, onChange, onUploaded, accept = 'image/*', showPreview = false, hint,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [percent, setPercent] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError(null); setNote(null); setBusy(true); setPercent(0);
    try {
      const res = await uploadToDrive(file, setPercent);
      onChange(res.viewUrl);
      onUploaded?.(res);
      setNote(res.publicLinkFailed
        ? 'Uploaded to Drive, but the link could not be made public (your Drive may block public sharing).'
        : `Uploaded to Google Drive: ${res.name}`);
    } catch (err: any) {
      setError(err?.message || 'Upload failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label className="block font-bold text-slate-700 mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder="Paste a link, or upload a file →"
          className="flex-1 min-w-0 px-3 py-2 border border-slate-300 rounded-lg font-mono text-[11px]"
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="shrink-0 px-3 py-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
        >
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {busy ? `${percent}%` : 'Upload to Drive'}
        </button>
        <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" />
      </div>
      {hint && !error && !note && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>}
      {note && (
        <p className="mt-1 text-[11px] text-emerald-700 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> {note}
        </p>
      )}
      {error && (
        <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}
      {showPreview && value && (
        <img
          src={toImageUrl(value, 400)}
          alt=""
          className="mt-2 h-24 rounded-lg border border-slate-200 object-cover"
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      )}
    </div>
  );
};
