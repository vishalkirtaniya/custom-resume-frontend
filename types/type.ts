export type CertItem = {
  name: string;
  issuer: string;
  issue_date: string | null;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
};

export type Tab =
  | "profile"
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | "certifications"
  | "generate";

export interface Skill {
  category: string;
  skill_name: string;
}
export interface ExpItem {
  company: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string;
  is_internship: boolean;
  stack: string[];
  highlights: string[];
}
export interface EduItem {
  institution: string;
  degree: string;
  field_of_study: string;
  graduation_year: string;
  status: string;
}
export interface ProjectItem {
  title: string;
  description: string;
  stack: string[];
  metrics: string[];
  link: string;
}