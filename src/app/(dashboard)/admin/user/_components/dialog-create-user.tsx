"use client";

import FormInput from "@/components/common/form-input";
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
import {
  INITIAL_CREATE_USER_FORM,
  INITIAL_STATE_CREATE_USER,
  ROLE_LIST,
} from "@/constants/auth-constant";
import {
  CreateUserForm,
  createUserSchema,
} from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createUser } from "../actions";
import FormSelect from "@/components/common/form-select";

export default function DialogCreateUser({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: INITIAL_CREATE_USER_FORM,
  });

  const [createUserState, createUserAction, isPendingCreateUser] =
    useActionState(createUser, INITIAL_STATE_CREATE_USER);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    startTransition(() => {
      createUserAction(formData);
    });
  });

  useEffect(() => {
    if (createUserState.status === "error") {
      toast.error("Create User Failed", {
        description: createUserState.errors?._form?.[0] || "Create User failed",
      });
    }

    if (createUserState.status === "success") {
      toast.success("Create User Success", {
        description: "Create User successfully",
      });
      form.reset();
      onSuccess?.();
    }
  }, [createUserState]);

  return (
    <DialogContent className="sm:max-w-106.25">
      <DialogHeader>
        <DialogTitle>Create User</DialogTitle>
        <DialogDescription>register new user to the system</DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} noValidate>
        <CardContent>
          <FieldGroup>
            <FormInput
              form={form}
              name="name"
              label="Name"
              placeholder="Enter your name"
            />
            <FormInput
              form={form}
              name="email"
              label="Email"
              placeholder="Enter your email"
            />
            <FormSelect
              form={form}
              name="role"
              label="Role"
              selectItem={ROLE_LIST}
            />
            <FormInput
              form={form}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />
          </FieldGroup>
        </CardContent>

        <DialogFooter className="mt-4">
          <DialogClose
            render={<Button variant="outline">Cancel</Button>}
          ></DialogClose>

          <Button type="submit" disabled={isPendingCreateUser}>
            {isPendingCreateUser ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
