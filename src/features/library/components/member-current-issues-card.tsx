"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IssueStatusBadge } from "./library-status-badges";
import type { MemberDetailCurrentIssue } from "../utils/library-mappers";

interface MemberCurrentIssuesCardProps {
  issues: MemberDetailCurrentIssue[];
}

export function MemberCurrentIssuesCard({ issues }: MemberCurrentIssuesCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Currently Issued Books</CardTitle>
      </CardHeader>
      <CardContent>
        {issues.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No books currently issued.
          </p>
        ) : (
          <ul className="divide-y">
            {issues.map((issue) => (
              <li key={issue.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-sm">{issue.bookTitle}</p>
                  <p className="text-xs text-muted-foreground font-mono">{issue.bookIsbn}</p>
                </div>
                <div className="shrink-0 text-end">
                  <IssueStatusBadge status={issue.status} />
                  <p className="mt-0.5 text-xs text-muted-foreground">Due: {issue.dueDate}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
