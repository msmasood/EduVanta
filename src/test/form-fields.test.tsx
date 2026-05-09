import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import userEvent from "@testing-library/user-event";

import { FormSection } from "@/components/forms/form-section";
import { TextField } from "@/components/forms/text-field";
import { SelectField } from "@/components/forms/select-field";
import { CheckboxField } from "@/components/forms/checkbox-field";
import { SwitchField } from "@/components/forms/switch-field";
import { PasswordField } from "@/components/forms/password-field";
import { FormActions } from "@/components/forms/form-actions";
import { FormErrorSummary } from "@/components/forms/form-error-summary";

// ─── Mock next-intl ───────────────────────────────────────────────────────────

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// ─── Helper: simple wrapper to provide RHF control ───────────────────────────

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  role: z.string().min(1, "Role is required"),
  agree: z.boolean().optional(),
  active: z.boolean().optional(),
  password: z.string().min(6, "Password too short"),
});
type FormValues = z.infer<typeof schema>;

function TestForm({ onSubmit = () => {} }: { onSubmit?: (d: FormValues) => void }) {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", role: "", agree: false, active: false, password: "" },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormErrorSummary errors={errors} />
      <TextField control={control} name="name" label="Full Name" required />
      <SelectField
        control={control}
        name="role"
        label="Role"
        options={[{ value: "student", label: "Student" }]}
        required
      />
      <CheckboxField control={control} name="agree" label="I agree" />
      <SwitchField control={control} name="active" label="Active" />
      <PasswordField control={control} name="password" label="Password" required />
      <FormActions />
    </form>
  );
}

// ─── FormSection tests ────────────────────────────────────────────────────────

describe("FormSection", () => {
  it("renders title", () => {
    render(
      <FormSection title="Personal Details">
        <p>content</p>
      </FormSection>
    );
    expect(screen.getByText("Personal Details")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <FormSection title="Section" description="Fill in all required fields">
        <p>content</p>
      </FormSection>
    );
    expect(screen.getByText("Fill in all required fields")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <FormSection title="Section">
        <p>Child content</p>
      </FormSection>
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });
});

// ─── TextField tests ──────────────────────────────────────────────────────────

describe("TextField", () => {
  it("renders label and input", () => {
    render(<TestForm />);
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
  });

  it("shows validation error on submit with empty value", async () => {
    const user = userEvent.setup();
    render(<TestForm />);
    await user.click(screen.getByRole("button", { name: /submit/i }));
    const alerts = await screen.findAllByRole("alert");
    expect(alerts.length).toBeGreaterThan(0);
  });
});

// ─── SelectField tests ────────────────────────────────────────────────────────

describe("SelectField", () => {
  it("renders label", () => {
    render(<TestForm />);
    expect(screen.getByText("Role")).toBeInTheDocument();
  });
});

// ─── CheckboxField tests ──────────────────────────────────────────────────────

describe("CheckboxField", () => {
  it("renders label", () => {
    render(<TestForm />);
    expect(screen.getByText("I agree")).toBeInTheDocument();
  });
});

// ─── SwitchField tests ────────────────────────────────────────────────────────

describe("SwitchField", () => {
  it("renders label", () => {
    render(<TestForm />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });
});

// ─── PasswordField tests ──────────────────────────────────────────────────────

describe("PasswordField", () => {
  it("renders password label", () => {
    render(<TestForm />);
    expect(screen.getByText("Password", { exact: false })).toBeInTheDocument();
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();
    render(<TestForm />);
    const inputs = screen.getAllByLabelText(/Password/i);
    const input = inputs.find((el) => el.tagName === "INPUT") as HTMLInputElement;
    expect(input.type).toBe("password");
    // Click the show/hide toggle button
    const toggle = screen.getByRole("button", { name: /showPassword/i });
    await user.click(toggle);
    expect(input.type).toBe("text");
  });
});

// ─── FormActions tests ────────────────────────────────────────────────────────

describe("FormActions", () => {
  it("renders submit button", () => {
    render(<TestForm />);
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("renders cancel button by default", () => {
    render(<TestForm />);
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });
});
