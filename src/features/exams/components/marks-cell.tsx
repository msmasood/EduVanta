"use client";

interface Props {
  marksObtained: number;
  maxMarks: number;
  percentage: number;
}

export function MarksCell({ marksObtained, maxMarks, percentage }: Props) {
  return (
    <div>
      <span className="font-medium">
        {marksObtained}/{maxMarks}
      </span>
      <span className="ml-1.5 text-xs text-muted-foreground">({percentage}%)</span>
    </div>
  );
}
