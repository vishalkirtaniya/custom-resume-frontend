"use client";

import { Skill } from "@/types/type";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { SectionTitle } from "../SectionTitle";
import { ViewCard } from "../ViewCard";
import { CancelBtn } from "../ButtonComponents";
import { inputCls, SaveBtn } from "../SharedUi";
import { LoadingCard } from "../LoadingCard";
import { CardHeader } from "../CardHeader";
import { EmptyState } from "../EmptyState";
import { Chip } from "../SharedUi";

export function SkillsTab() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Skill[]>([]);
  const [cat, setCat] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiFetch("/profile/skills")
      .then((r) => {
        setSkills(r.items ?? []);
        setDraft(r.items ?? []);
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const addSkill = () => {
    if (!cat.trim() || !name.trim()) return;
    setDraft((d) => [...d, { category: cat.trim(), skill_name: name.trim() }]);
    setName("");
  };

  const save = async () => {
    setSaving(true);
    try {
      await apiFetch("/profile/skills", "POST", draft);
      setSkills(draft);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setDraft(skills);
    setEditing(false);
  };

  // Group for display
  const group = (list: Skill[]) =>
    list.reduce(
      (acc, s) => {
        (acc[s.category] ??= []).push(s);
        return acc;
      },
      {} as Record<string, Skill[]>,
    );

  if (fetching) return <LoadingCard />;

  const grouped = group(skills);
  const draftGrouped = group(draft);

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Skills"
        desc="Grouped by category — matched against job descriptions during generation"
      />

      {/* View card */}
      <ViewCard>
        <CardHeader
          title="Saved Skills"
          onEdit={() => {
            setDraft(skills);
            setEditing(true);
          }}
          editing={editing}
        />
        {Object.keys(grouped).length === 0 ? (
          <EmptyState
            message="No skills saved yet"
            onAdd={() => setEditing(true)}
          />
        ) : (
          Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="mb-3">
              <p className="text-[#8b949e] text-xs font-mono uppercase tracking-wider mb-1.5">
                {cat}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((s, i) => (
                  <Chip key={i} label={s.skill_name} />
                ))}
              </div>
            </div>
          ))
        )}
      </ViewCard>

      {/* Edit form */}
      {editing && (
        <ViewCard editing>
          <p className="text-[#58a6ff] text-xs font-mono uppercase tracking-wider mb-4">
            Editing skills
          </p>

          {/* Add new skill */}
          <div className="flex gap-2 mb-4">
            <input
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              placeholder="Category (e.g. Backend)"
              className={inputCls + " flex-1"}
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
              placeholder="Skill name"
              className={inputCls + " flex-1"}
            />
            <button
              onClick={addSkill}
              className="px-4 py-2 bg-[#1f2937] hover:bg-[#374151] text-[#93c5fd] text-sm rounded-lg border border-[#374151] transition-colors font-mono"
            >
              Add
            </button>
          </div>

          {/* Draft preview grouped */}
          {Object.entries(draftGrouped).map(([category, items]) => (
            <div key={category} className="mb-3">
              <p className="text-[#8b949e] text-xs font-mono uppercase tracking-wider mb-1.5">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((s, i) => (
                  <Chip
                    key={i}
                    label={s.skill_name}
                    onRemove={() =>
                      setDraft((d) =>
                        d.filter(
                          (x, idx) =>
                            !(
                              x.category === s.category &&
                              x.skill_name === s.skill_name
                            ) ||
                            idx !==
                              d.findIndex(
                                (y) =>
                                  y.category === s.category &&
                                  y.skill_name === s.skill_name,
                              ),
                        ),
                      )
                    }
                  />
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-3 mt-4">
            <CancelBtn onClick={cancel} />
            <SaveBtn onClick={save} loading={saving} saved={saved} />
          </div>
        </ViewCard>
      )}
    </div>
  );
}
