"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TextField, SelectField, TextareaField, FormActions } from "@/components/forms";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { noticeFormSchema, type NoticeFormValues } from "@/lib/validations/communication";
import {
  NOTICE_CATEGORY_OPTIONS,
  NOTICE_PRIORITY_OPTIONS,
  NOTICE_STATUS_OPTIONS,
  NOTICE_AUDIENCE_OPTIONS,
} from "../utils/communication-form-options";
import type { NoticeRow } from "../utils/communication-mappers";

interface NoticeFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  notice?: NoticeRow;
  onSave: (values: NoticeFormValues, isEdit: boolean) => void;
}

const DEFAULT_VALUES: NoticeFormValues = {
  title: "",
  category: "",
  priority: "medium",
  audience: ["all"],
  publishDate: "",
  expiryDate: "",
  body: "",
  pinned: false,
  status: "published",
};

export function NoticeFormDialog({ open, onOpenChange, notice, onSave }: NoticeFormDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const isEdit = !!notice;

  const { control, handleSubmit, reset } = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  React.useEffect(() => {
    if (open) {
      if (notice) {
        reset({
          title: notice.title,
          category: notice.category,
          priority: notice.priority,
          audience: notice.audience as NoticeFormValues["audience"],
          publishDate: notice.publishedAt,
          expiryDate: notice.expiresAt ?? "",
          body: notice.body,
          pinned: notice.isPinned,
          status: notice.status,
        });
      } else {
        reset(DEFAULT_VALUES);
      }
    }
  }, [open, notice, reset]);

  const onSubmit = async (values: NoticeFormValues) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    onSave(values, isEdit);
    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" data-testid="notice-form-dialog">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Notice" : "Add Notice"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField control={control} name="title" label="Title" placeholder="Notice title" required />
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              control={control}
              name="category"
              label="Category"
              options={NOTICE_CATEGORY_OPTIONS}
              placeholder="Select category"
              required
            />
            <SelectField
              control={control}
              name="priority"
              label="Priority"
              options={NOTICE_PRIORITY_OPTIONS}
              placeholder="Select priority"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextField control={control} name="publishDate" label="Publish Date" placeholder="YYYY-MM-DD" required />
            <TextField control={control} name="expiryDate" label="Expiry Date" placeholder="YYYY-MM-DD (optional)" />
          </div>
          <TextareaField control={control} name="body" label="Body" placeholder="Notice content..." required />
          <SelectField
            control={control}
            name="status"
            label="Status"
            options={NOTICE_STATUS_OPTIONS}
            placeholder="Select status"
            required
          />
          <div>
            <Label className="text-sm font-medium">Audience</Label>
            <div className="mt-2 flex flex-wrap gap-3">
              <Controller
                control={control}
                name="audience"
                render={({ field }) => (
                  <>
                    {NOTICE_AUDIENCE_OPTIONS.map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox
                          checked={field.value?.includes(opt.value as NoticeFormValues["audience"][number])}
                          onCheckedChange={(checked) => {
                            const current = field.value ?? [];
                            if (checked) {
                              field.onChange([...current, opt.value]);
                            } else {
                              field.onChange(current.filter((v) => v !== opt.value));
                            }
                          }}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </>
                )}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="pinned"
              render={({ field }) => (
                <Checkbox
                  id="pinned"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="pinned" className="text-sm cursor-pointer">Pin this notice</Label>
          </div>
          <FormActions
            isLoading={isLoading}
            showCancel
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
