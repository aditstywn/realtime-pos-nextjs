import FormImage from "@/components/common/form-image";
import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { ROLE_LIST } from "@/constants/auth-constant";
import { Preview } from "@/types/general";
import { Loader2 } from "lucide-react";
import { SubmitEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormUser<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
  preview,
  setPreview,
}: {
  form: UseFormReturn<T>;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
  preview?: Preview;
  setPreview?: (preview: Preview | undefined) => void;
}) {
  return (
    <DialogContent className="sm:max-w-106.25">
      <DialogHeader>
        <DialogTitle>{type} User</DialogTitle>
        <DialogDescription>
          {type === "Create"
            ? "Register new user to the system"
            : "Update user information"}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} noValidate>
        <CardContent>
          <FieldGroup>
            <FormInput
              form={form}
              name={"name" as Path<T>}
              label="Name"
              placeholder="Enter your name"
            />
            {type === "Create" && (
              <FormInput
                form={form}
                name={"email" as Path<T>}
                label="Email"
                placeholder="Enter your email"
              />
            )}
            <FormImage
              form={form}
              label="Avatar"
              name={"avatar_url" as Path<T>}
              preview={preview}
              setPreview={setPreview ?? (() => {})}
            />
            <FormSelect
              form={form}
              name={"role" as Path<T>}
              label="Role"
              selectItem={ROLE_LIST}
            />
            {type === "Create" && (
              <FormInput
                form={form}
                name={"password" as Path<T>}
                label="Password"
                placeholder="Enter your password"
                type="password"
              />
            )}
          </FieldGroup>
        </CardContent>

        <DialogFooter className="mt-4">
          <DialogClose
            render={<Button variant="outline">Cancel</Button>}
          ></DialogClose>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : type}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
