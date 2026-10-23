"use client";

import {
  INITIAL_CREATE_USER_FORM,
  INITIAL_STATE_CREATE_USER,
} from "@/constants/auth-constant";
import {
  CreateUserForm,
  createUserSchema,
} from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createUser } from "../actions";
import { Preview } from "@/types/general";
import FormUser from "./form-user";

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

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(
        key,
        key === "avatar_url" && value instanceof File ? preview!.file : value,
      );
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
    <FormUser
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingCreateUser}
      type="Create"
      preview={preview}
      setPreview={setPreview}
    />
  );
}
