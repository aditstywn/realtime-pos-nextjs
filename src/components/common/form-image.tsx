import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "../ui/field";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FileImage } from "lucide-react";
import { Input } from "../ui/input";
import { getImageData } from "@/lib/utils";

export default function FormImage<T extends FieldValues>({
  form,
  name,
  label,
  preview,
  setPreview,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  preview?: {
    file: File;
    displayUrl: string;
  };
  setPreview: (preview: { file: File; displayUrl: string } | undefined) => void;
}) {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, ...rest }, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={rest.name}>{label}</FieldLabel>
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 rounded-lg">
              <AvatarImage
                src={preview?.displayUrl || ""}
                alt={preview?.file.name || ""}
                className="object-cover rounded-lg"
              />
              <AvatarFallback className="rounded-lg">
                <FileImage className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <Input
              type="file"
              name={rest.name}
              ref={rest.ref}
              onBlur={rest.onBlur}
              disabled={rest.disabled}
              onChange={async (e) => {
                const data = getImageData(e);
                if (data?.file) {
                  // 1. Masukkan objek File ke state React Hook Form agar validasi Zod mendeteksi File
                  onChange(data.file);
                  // 2. Set preview untuk tampilan gambar
                  setPreview(data);
                } else {
                  onChange(undefined);
                  setPreview(undefined);
                }
              }}
            />
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
