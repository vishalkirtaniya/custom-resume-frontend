"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { SectionTitle } from "../SectionTitle";
import { ViewCard } from "../ViewCard";
import { CancelBtn } from "../ButtonComponents";
import { CardHeader } from "../CardHeader";
import { LoadingCard } from "../LoadingCard";
import { InfoRow, SaveBtn } from "../SharedUi";
import { Field } from "../Field";

export function ProfileTab() {
  const [data, setData] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    phone: "",
    location: "",
    website_url: "",
    linkedin_url: "",
    github_url: "",
    summary: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiFetch("/profile")
      .then((r) => {
        const p = r.profile ?? {};
        setData(p);
        setForm({
          phone: p.phone ?? "",
          location: p.location ?? "",
          website_url: p.website_url ?? "",
          linkedin_url: p.linkedin_url ?? "",
          github_url: p.github_url ?? "",
          summary: p.summary ?? "",
        });
      })
      .catch(() => setData({}))
      .finally(() => setFetching(false));
  }, []);

  const set = (k: string) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      await apiFetch("/profile", "PATCH", form);
      setData((d: any) => ({ ...d, ...form }));
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
    setForm({
      phone: data?.phone ?? "",
      location: data?.location ?? "",
      website_url: data?.website_url ?? "",
      linkedin_url: data?.linkedin_url ?? "",
      github_url: data?.github_url ?? "",
      summary: data?.summary ?? "",
    });
    setEditing(false);
  };

  if (fetching) return <LoadingCard />;

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Personal Info"
        desc="Your contact details and summary shown on the resume header"
      />

      {/* View card */}
      <ViewCard editing={editing}>
        <CardHeader
          title={data?.full_name ?? "—"}
          subtitle={data?.email}
          onEdit={() => setEditing(true)}
          editing={editing}
        />
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-4">
          <InfoRow label="Phone" value={data?.phone} />
          <InfoRow label="Location" value={data?.location} />
          <InfoRow label="Website" value={data?.website_url} />
          <InfoRow label="LinkedIn" value={data?.linkedin_url} />
          <InfoRow label="GitHub" value={data?.github_url} />
        </div>
        {data?.summary && (
          <div className="pt-4" style={{ borderTop: "1px solid #21262d" }}>
            <p className="text-[#8b949e] text-xs font-mono uppercase tracking-wider mb-1">
              Summary
            </p>
            <p className="text-[#e6edf3] text-sm leading-relaxed">
              {data.summary}
            </p>
          </div>
        )}
        {!data?.phone && !data?.location && !data?.summary && !editing && (
          <p className="text-[#484f58] text-xs font-mono mt-2">
            No details yet — click{" "}
            <span
              className="text-[#58a6ff] cursor-pointer"
              onClick={() => setEditing(true)}
            >
              Edit
            </span>{" "}
            to add.
          </p>
        )}
      </ViewCard>

      {/* Edit form */}
      {editing && (
        <ViewCard editing>
          <p className="text-[#58a6ff] text-xs font-mono uppercase tracking-wider mb-4">
            Editing profile
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field
              label="Phone"
              value={form.phone}
              onChange={set("phone")}
              placeholder="+91 98765 43210"
            />
            <Field
              label="Location"
              value={form.location}
              onChange={set("location")}
              placeholder="Mumbai, India"
            />
            <Field
              label="Website"
              value={form.website_url}
              onChange={set("website_url")}
              placeholder="https://yoursite.com"
            />
            <Field
              label="LinkedIn"
              value={form.linkedin_url}
              onChange={set("linkedin_url")}
              placeholder="https://linkedin.com/in/you"
            />
            <Field
              label="GitHub"
              value={form.github_url}
              onChange={set("github_url")}
              placeholder="https://github.com/you"
            />
          </div>
          <Field
            label="Summary"
            value={form.summary}
            onChange={set("summary")}
            textarea
            placeholder="2–3 sentences about yourself…"
          />
          <div className="flex justify-end gap-3 mt-4">
            <CancelBtn onClick={cancel} />
            <SaveBtn onClick={save} loading={saving} saved={saved} />
          </div>
        </ViewCard>
      )}
    </div>
  );
}
