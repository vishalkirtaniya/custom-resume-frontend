"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { SectionTitle } from "../SectionTitle";
import { ViewCard } from "../ViewCard";
import { CancelBtn } from "../ButtonComponents";
import { CertItem } from "@/types/type";
import { blankCert } from "../Blanks";
import { Field } from "../Field";
import { InfoRow, SaveBtn } from "../SharedUi";
import { LoadingCard } from "../LoadingCard";
import { CardHeader } from "../CardHeader";
import { EmptyState } from "../EmptyState";

export function CertificationsTab() {
  const [items, setItems] = useState<CertItem[]>([]);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState(false);
  const [forms, setForms] = useState<CertItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiFetch("/profile/certifications")
      .then((r) => setItems(r.items ?? []))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const startEdit = () => {
    setForms([...items]);
    setEditing(true);
  };
  const cancel = () => setEditing(false);
  const setField = (i: number, k: keyof CertItem) => (v: string) =>
    setForms((arr) =>
      arr.map((x, idx) => (idx === i ? { ...x, [k]: v || null } : x)),
    );

  const save = async () => {
    setSaving(true);
    try {
      await apiFetch("/profile/certifications", "POST", forms);
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
      <SectionTitle
        title="Certifications"
        desc="Professional certificates and credentials"
      />

      {items.length === 0 ? (
        <ViewCard>
          <EmptyState
            message="No certifications saved yet"
            onAdd={() => {
              setForms([blankCert()]);
              setEditing(true);
            }}
          />
        </ViewCard>
      ) : (
        items.map((cert, i) => (
          <ViewCard key={i}>
            <CardHeader
              title={cert.name}
              subtitle={`Issued by ${cert.issuer}`}
              onEdit={startEdit}
              editing={editing && i === 0}
            />
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <InfoRow label="Credential ID" value={cert.credential_id ?? ""} />
              <InfoRow label="Issue Date" value={cert.issue_date ?? ""} />
              <InfoRow
                label="Expiry Date"
                value={cert.expiry_date || "No expiry"}
              />
            </div>
          </ViewCard>
        ))
      )}

      {items.length > 0 && !editing && (
        <button
          onClick={startEdit}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-[#30363d] text-[#8b949e] hover:border-[#58a6ff] hover:text-[#58a6ff] text-xs font-mono transition-colors"
        >
          ✎ Edit all certifications
        </button>
      )}

      {editing && (
        <ViewCard editing>
          <p className="text-[#58a6ff] text-xs font-mono uppercase tracking-wider mb-4">
            Editing certifications
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
                    Cert {i + 1}
                  </p>
                  {forms.length > 1 && (
                    <button
                      onClick={() =>
                        setForms((f) => f.filter((_, idx) => idx !== i))
                      }
                      className="text-xs text-[#f85149] font-mono hover:text-[#ff7b72] transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Name"
                    value={form.name}
                    onChange={setField(i, "name")}
                    placeholder="AWS Solutions Architect"
                  />
                  <Field
                    label="Issuer"
                    value={form.issuer}
                    onChange={setField(i, "issuer")}
                    placeholder="Amazon Web Services"
                  />
                  <Field
                    label="Issue Date"
                    value={form.issue_date ?? ""} // ← add ?? ""
                    onChange={setField(i, "issue_date")}
                    placeholder="2024-06-01"
                  />
                  <Field
                    label="Expiry Date"
                    value={form.expiry_date ?? ""} // ← add ?? ""
                    onChange={setField(i, "expiry_date")}
                    placeholder="2027-06-01 (blank = no expiry)"
                  />
                  <Field
                    label="Credential ID"
                    value={form.credential_id ?? ""} // ← add ?? ""
                    onChange={setField(i, "credential_id")}
                    placeholder="ABC123"
                  />
                  <Field
                    label="Credential URL"
                    value={form.credential_url ?? ""} // ← add ?? ""
                    onChange={setField(i, "credential_url")}
                    placeholder="https://verify.example.com/abc"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setForms((f) => [...f, blankCert()])}
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
