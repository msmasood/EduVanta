// Guardians feature barrel export

// ─── Components ───────────────────────────────────────────────────────────────
export { GuardianList } from "./components/guardian-list";
export { GuardianForm } from "./components/guardian-form";
export { GuardianProfileHeader } from "./components/guardian-profile-header";
export { GuardianProfileTabs } from "./components/guardian-profile-tabs";
export { GuardianInfoCard } from "./components/guardian-info-card";
export { GuardianContactCard } from "./components/guardian-contact-card";
export { GuardianAccessCard } from "./components/guardian-access-card";
export { GuardianLinkedStudentsCard } from "./components/guardian-linked-students-card";
export { GuardianStudentLinksTable } from "./components/guardian-student-links-table";
export { GuardianStatusCards } from "./components/guardian-status-summary";

// ─── Utils ────────────────────────────────────────────────────────────────────
export {
  guardianStatusToVariant,
  formatRelation,
  mapGuardiansToRows,
  buildGuardianStatusSummary,
  mapLinkedStudentsToRows,
  createRelationFilterOptions,
} from "./utils/guardian-mappers";
export type {
  GuardianTableRow,
  GuardianStatusSummary,
  LinkedStudentRow,
} from "./utils/guardian-mappers";

export {
  GUARDIAN_RELATION_OPTIONS,
  GUARDIAN_STATUS_OPTIONS,
  COUNTRY_OPTIONS,
} from "./utils/guardian-form-options";
