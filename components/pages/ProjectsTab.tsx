"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { SectionTitle } from "../SectionTitle";
import { ViewCard } from "../ViewCard";
import { CancelBtn } from "../ButtonComponents";
import { ProjectItem } from "@/types/type";
import { blankProject } from "../Blanks";
import { Field } from "../Field";
import { InfoRow, SaveBtn, Chip } from "../SharedUi";
import { LoadingCard } from "../LoadingCard";
import { CardHeader } from "../CardHeader";
import { EmptyState } from "../EmptyState";
import { projToForm, formToProj } from "../ProjectForm";

export function ProjectsTab() {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState(false);
  const [forms, setForms] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiFetch("/profile/projects")
      .then((r) => setItems(r.items ?? []))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const startEdit = () => {
    setForms(items.map(projToForm));
    setEditing(true);
  };
  const cancel = () => setEditing(false);
  const setField = (i: number, k: string) => (v: string) =>
    setForms((arr) => arr.map((x, idx) => (idx === i ? { ...x, [k]: v } : x)));

  const save = async () => {
    setSaving(true);
    try {
      const payload = forms.map(formToProj);
      await apiFetch("/profile/projects", "POST", payload);
      setItems(payload);
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
      <SectionTitle
        title="Projects"
        desc="Personal and professional projects — used by the AI matcher"
      />

      {items.length === 0 ? (
        <ViewCard>
          <EmptyState
            message="No projects saved yet"
            onAdd={() => {
              setForms([projToForm(blankProject())]);
              setEditing(true);
            }}
          />
        </ViewCard>
      ) : (
        items.map((p, i) => (
          <ViewCard key={i}>
            <CardHeader
              title={p.title}
              subtitle={p.link || undefined}
              onEdit={startEdit}
              editing={editing && i === 0}
            />
            {p.description && (
              <p className="text-[#8b949e] text-sm mb-3">{p.description}</p>
            )}
            {(p.stack ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {(p.stack ?? []).map((s, j) => (
                  <Chip key={j} label={s} />
                ))}
              </div>
            )}
            {(p.metrics ?? []).length > 0 && (
              <ul className="space-y-1">
                {(p.metrics ?? []).map((m, j) => (
                  <li key={j} className="flex gap-2 text-sm text-[#8b949e]">
                    <span className="text-[#484f58] mt-0.5">▸</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            )}
          </ViewCard>
        ))
      )}

      {items.length > 0 && !editing && (
        <button
          onClick={startEdit}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-[#30363d] text-[#8b949e] hover:border-[#58a6ff] hover:text-[#58a6ff] text-xs font-mono transition-colors"
        >
          ✎ Edit all projects
        </button>
      )}

      {editing && (
        <ViewCard editing>
          <p className="text-[#58a6ff] text-xs font-mono uppercase tracking-wider mb-4">
            Editing projects
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
                    Project {i + 1}
                  </p>
                  {forms.length > 1 && (
                    <button
                      onClick={() =>
                        setForms((f) => f.filter((_, idx) => idx !== i))
                      }
                      className="text-xs text-[#f85149] hover:text-[#ff7b72] font-mono transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Field
                    label="Title"
                    value={form.title}
                    onChange={setField(i, "title")}
                    placeholder="Golf Swing Analysis App"
                  />
                  <Field
                    label="Link"
                    value={form.link}
                    onChange={setField(i, "link")}
                    placeholder="https://github.com/you/project"
                  />
                </div>
                <div className="space-y-4">
                  <Field
                    label="Description"
                    value={form.description}
                    onChange={setField(i, "description")}
                    textarea
                    placeholder="What does this project do?"
                  />
                  <Field
                    label="Stack (comma-sep)"
                    value={form.stack}
                    onChange={setField(i, "stack")}
                    placeholder="Python, gRPC, React"
                  />
                  <Field
                    label="Metrics (one per line)"
                    value={form.metrics}
                    onChange={setField(i, "metrics")}
                    textarea
                    placeholder={
                      "Reduced latency by 20%.\nImproved accuracy by 15%."
                    }
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() =>
                setForms((f) => [...f, projToForm(blankProject())])
              }
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-[#30363d] text-[#8b949e] hover:border-[#58a6ff] hover:text-[#58a6ff] text-xs font-mono transition-colors"
            >
              + Add another project
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
