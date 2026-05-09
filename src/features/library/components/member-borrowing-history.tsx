"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IssueStatusBadge } from "./library-status-badges";
import type { MemberDetailHistoryEntry } from "../utils/library-mappers";

interface MemberBorrowingHistoryProps {
  history: MemberDetailHistoryEntry[];
}

export function MemberBorrowingHistory({ history }: MemberBorrowingHistoryProps) {
  return (
    <Card data-testid="member-borrowing-history">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Borrowing History</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No borrowing history.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="pb-2 pe-4 text-start font-medium">Book</th>
                  <th className="pb-2 pe-4 text-start font-medium">Issued</th>
                  <th className="pb-2 pe-4 text-start font-medium">Due</th>
                  <th className="pb-2 pe-4 text-start font-medium">Returned</th>
                  <th className="pb-2 pe-4 text-start font-medium">Fine</th>
                  <th className="pb-2 text-start font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {history.map((entry) => (
                  <tr key={entry.id}>
                    <td className="py-2 pe-4">
                      <p className="font-medium leading-tight">{entry.bookTitle}</p>
                      <p className="text-xs text-muted-foreground font-mono">{entry.bookIsbn}</p>
                    </td>
                    <td className="py-2 pe-4 tabular-nums">{entry.issueDate}</td>
                    <td className="py-2 pe-4 tabular-nums">{entry.dueDate}</td>
                    <td className="py-2 pe-4 tabular-nums">{entry.returnDate ?? "—"}</td>                    <td className="py-2 pe-4 tabular-nums">
                      {entry.fine > 0 ? (
                        <span className="text-destructive font-medium">{entry.fineFormatted}</span>
                      ) : (
                        <span className="text-muted-foreground">{entry.fineFormatted}</span>
                      )}
                    </td>
                    <td className="py-2">
                      <IssueStatusBadge status={entry.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
