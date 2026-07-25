import React, { useState } from 'react';

interface HinglishReportFormProps {
    onSubmit: (text: string) => Promise<void>;
}

export const HinglishReportForm: React.FC<HinglishReportFormProps> = ({ onSubmit }) => {
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                if (!text.trim() || submitting) return;
                setSubmitting(true);
                try {
                    await onSubmit(text);
                    setText('');
                } catch (err) {
                    console.error(err);
                } finally {
                    setSubmitting(false);
                }
            }}
            className="bg-[var(--color-card-snow)] border border-[var(--color-cloud)] rounded-[var(--radius-cards)] p-3 flex flex-col gap-2 shadow-[var(--shadow-subtle)] shrink-0"
        >
            <div className="text-[var(--text-caption)] font-bold text-[var(--color-steel-gray)] tracking-[var(--tracking-caption)] uppercase flex items-center gap-1.5">
                <span>💡 Hinglish AI Report Ingest</span>
            </div>
            <div className="flex gap-[var(--element-gap)]">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={submitting}
                    placeholder="e.g. ito flyover par heavy jam..."
                    className="flex-grow bg-[var(--color-paper-white)] text-[var(--color-body-charcoal)] border border-[var(--color-mist)] rounded-[var(--radius-inputs)] px-3 py-1.5 text-xs font-sans outline-none focus:border-[var(--color-ink-black)] transition-colors min-w-0"
                />
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-transparent text-[var(--color-ink-black)] border border-[var(--color-ink-black)] hover:bg-[var(--color-paper-white)] rounded-[var(--radius-buttons)] text-xs font-bold px-3 py-1.5 cursor-pointer transition-colors shrink-0"
                >
                    {submitting ? "..." : "Ingest"}
                </button>
            </div>
        </form>
    );
};
