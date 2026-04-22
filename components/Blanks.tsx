import { CertItem, EduItem, ProjectItem, ExpItem } from "@/types/type";

export const blankCert = (): CertItem => ({
  name: "",
  issuer: "",
  issue_date: null,
  expiry_date: null,
  credential_id: null,
  credential_url: null,
});

export const blankEdu = (): EduItem => ({
  institution: "",
  degree: "",
  field_of_study: "",
  graduation_year: "",
  status: "",
});

export const blankProject = (): ProjectItem => ({
  title: "",
  description: "",
  stack: [],
  metrics: [],
  link: "",
});

export const blankExp = (): ExpItem => ({
  company: "",
  role: "",
  location: "",
  start_date: "",
  end_date: "",
  is_internship: false,
  stack: [],
  highlights: [],
});