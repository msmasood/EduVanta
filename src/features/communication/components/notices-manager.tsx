"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { DataTable, TableSkeleton, ConfirmDialog } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useNotices } from "@/hooks/queries/use-communication";
import { mapNoticesToRows, type NoticeRow } from "../utils/communication-mappers";
import { computeNoticeStats } from "../utils/communication-calculations";
import { buildNoticeColumns, NOTICE_FILTER_CONFIGS } from "./notice-columns";
import { NoticeFormDialog } from "./notice-form-dialog";
import { NoticeSummaryCards } from "./communication-summary-cards";
import type { NoticeFormValues } from "@/lib/validations/communication";

export function NoticesManager() {
  const noticesQuery = useNotices();

  const [localNotices, setLocalNotices] = React.useState<NoticeRow[]>([]);
  const [addOpen, setAddOpen] = React.useState(false);
  const [editNotice, setEditNotice] = React.useState<NoticeRow | undefined>();
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const rawNotices = noticesQuery.data?.data ?? [];

  React.useEffect(() => {
    if (!noticesQuery.isLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalNotices(mapNoticesToRows(rawNotices));
    }
  }, [noticesQuery.isLoading, rawNotices]);

  const stats = React.useMemo(() => computeNoticeStats(rawNotices), [rawNotices]);

  const handleEdit = (row: NoticeRow) => {
    setEditNotice(row);
    setEditOpen(true);
  };

  const handleSave = (_values: NoticeFormValues, isEdit: boolean) => {
    toast.success(isEdit ? "Notice updated. (Mock)" : "Notice added. (Mock)");
    if (!isEdit) {
      setLocalNotices((prev) => [
        {
          id: `notice-${Date.now()}`,
          title: _values.title,
          category: _values.category,
          priority: _values.priority,
          audience: _values.audience,
          publishedAt: _values.publishDate,
          expiresAt: _values.expiryDate,
          isPinned: _values.pinned,
          status: _values.status,
          body: _values.body,
          createdBy: "emp-001",
        },
        ...prev,
      ]);
    } else if (editNotice) {
      setLocalNotices((prev) =>
        prev.map((n) =>
          n.id === editNotice.id
            ? {
                ...n,
                title: _values.title,
                category: _values.category,
                priority: _values.priority,
                audience: _values.audience,
                publishedAt: _values.publishDate,
                expiresAt: _values.expiryDate,
                isPinned: _values.pinned,
                status: _values.status,
                body: _values.body,
              }
            : n
        )
      );
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      setLocalNotices((prev) => prev.filter((n) => n.id !== deleteId));
      toast.success("Notice deleted. (Mock)");
      setDeleteId(null);
    }
  };

  const columns = React.useMemo(
    () => buildNoticeColumns(handleEdit, (id) => setDeleteId(id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (noticesQuery.isLoading) {
    return (
      <div data-testid="notices-manager">
        <TableSkeleton columns={7} rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="notices-manager">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notice Board</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and publish school notices and announcements.
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          size="sm"
          className="gap-1.5"
          data-testid="add-notice-btn"
        >
          <Plus className="size-4" aria-hidden />
          Add Notice
        </Button>
      </div>

      <NoticeSummaryCards stats={stats} />

      <DataTable
        columns={columns}
        data={localNotices}
        filterConfigs={NOTICE_FILTER_CONFIGS}
        defaultPageSize={10}
        emptyTitle="No notices found"
        emptyDescription="Add your first notice using the button above."
      />

      <NoticeFormDialog open={addOpen} onOpenChange={setAddOpen} onSave={handleSave} />

      <NoticeFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        notice={editNotice}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="Delete Notice"
        description="Are you sure you want to delete this notice? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
