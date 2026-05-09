"use client";

import { StatusBadge } from "@/components/data-table";
import { gradeToVariant } from "../utils/exam-mappers";

interface Props {
  grade: string;
}

export function GradeBadge({ grade }: Props) {
  return <StatusBadge status={gradeToVariant(grade)} label={grade} />;
}
