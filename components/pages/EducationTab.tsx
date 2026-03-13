"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { SectionTitle } from "../SectionTitle";
import { ViewCard } from "../ViewCard";
import { CancelBtn } from "../ButtonComponents";
import { blankEdu } from "../Blanks";
import { Field } from "../Field";
import { InfoRow, SaveBtn } from "../SharedUi";
import { LoadingCard } from "../LoadingCard";
import { CardHeader } from "../CardHeader";
import { EmptyState } from "../EmptyState";
import { EduItem } from "@/types/type";

export function EducationTab() {
  const [items, setItems] = useState<EduItem[]>([]);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState(false);
  const [forms, setForms] = useState<EduItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiFetch("/profile/education")
      .then((r) => setItems(r.items ?? []))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const startEdit = () => {
    setForms([...items]);
    setEditing(true);
  };
  const cancel = () => setEditing(false);
  const setField = (i: number, k: keyof EduItem) => (v: string) =>
    setForms((arr) => arr.map((x, idx) => (idx === i ? { ...x, [k]: v } : x)));

  const save = async () => {
    setSaving(true);
    try {
      await apiFetch("/profile/education", "POST", forms);
      setItems(forms);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (fetching) return <LoadingCard />;

  return (
    <div className="space-y-4">
      <SectionTitle title="Education" desc="Degrees and qualifications" />

      {items.length === 0 ? (
        <ViewCard>
          <EmptyState
            message="No education saved yet"
            onAdd={() => {
              setForms([blankEdu()]);
              setEditing(true);
            }}
          />
        </ViewCard>
      ) : (
        items.map((edu, i) => (
          <ViewCard key={i}>
            <CardHeader
              title={edu.institution}
              subtitle={edu.degree || undefined}
              onEdit={startEdit}
              editing={editing && i === 0}
            />
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <InfoRow label="Field" value={edu.field_of_study} />
              <InfoRow label="Grad Year" value={edu.graduation_year} />
              <InfoRow label="Status" value={edu.status} />
            </div>
          </ViewCard>
        ))
      )}

      {items.length > 0 && !editing && (
        <button
          onClick={startEdit}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-[#30363d] text-[#8b949e] hover:border-[#58a6ff] hover:text-[#58a6ff] text-xs font-mono transition-colors"
        >
          ✎ Edit all education
        </button>
      )}

      {editing && (
        <ViewCard editing>
          <p className="text-[#58a6ff] text-xs font-mono uppercase tracking-wider mb-4">
            Editing education
          </p>
          <div className="space-y-6">
            {forms.map((form, i) => (
              <div
                key={i}
                className="pb-6"
                style={{
                  borderBottom:
                    i < forms.length - 1 ? "1px solid #21262d" : "none",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#8b949e] text-xs font-mono">
                    Entry {i + 1}
                  </p>
                  {forms.length > 1 && (
                    <button
                      onClick={() =>
                        setForms((f) => f.filter((_, idx) => idx !== i))
                      }
                      className="text-xs text-[#f85149] font-mono transition-colors hover:text-[#ff7b72]"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Institution"
                    value={form.institution}
                    onChange={setField(i, "institution")}
                    placeholder="Lovely Professional University"
                  />
                  <Field
                    label="Degree"
                    value={form.degree}
                    onChange={setField(i, "degree")}
                    placeholder="Bachelor of Computer Applications"
                  />
                  <Field
                    label="Field of Study"
                    value={form.field_of_study}
                    onChange={setField(i, "field_of_study")}
                    placeholder="Computer Science"
                  />
                  <Field
                    label="Grad Year"
                    value={form.graduation_year}
                    onChange={setField(i, "graduation_year")}
                    placeholder="2025"
                  />
                  <Field
                    label="Status"
                    value={form.status}
                    onChange={setField(i, "status")}
                    placeholder="Pursuing / Completed"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setForms((f) => [...f, blankEdu()])}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-[#30363d] text-[#8b949e] hover:border-[#58a6ff] hover:text-[#58a6ff] text-xs font-mono transition-colors"
            >
              + Add another
            </button>
            <div className="flex gap-3">
              <CancelBtn onClick={cancel} />
              <SaveBtn onClick={save} loading={saving} saved={saved} />
            </div>
          </div>
        </ViewCard>
      )}
    </div>
  );
}
