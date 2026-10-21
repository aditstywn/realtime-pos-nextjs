import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";

import { Textarea } from "../ui/textarea";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

export default function FormInput<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  type = "text",
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          {type === "textarea" ? (
            <Textarea
              {...field}
              id={field.name}
              placeholder={placeholder}
              autoComplete="off"
              className="resize-none"
            />
          ) : (
            <Input
              {...field}
              id={field.name}
              type={type}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              autoComplete="off"
              className="rounded-sm h-10"
            />
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
