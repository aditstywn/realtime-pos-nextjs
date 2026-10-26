"use server";

import { deleteFile, uploadFile } from "@/actions/storage-action";
import { createClient } from "@/lib/supabase/server";
import { AuthFormState } from "@/types/auth";
import {
  createUserSchema,
  updateUserSchema,
} from "@/validations/auth-validation";

export async function createUser(prevState: AuthFormState, formData: FormData) {
  let validationFields = createUserSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
    role: formData.get("role"),
    avatar_url: formData.get("avatar_url"),
  });

  if (!validationFields.success) {
    return {
      status: "error",
      errors: {
        ...validationFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  if (validationFields.data.avatar_url instanceof File) {
    const { data, error } = await uploadFile(
      "images",
      "users",
      validationFields.data.avatar_url,
    );

    if (error) {
      return {
        status: "error",
        errors: {
          ...prevState?.errors,
          _form: [...(error._form || ["Failed to upload image"])],
        },
      };
    }

    validationFields = {
      ...validationFields,
      data: {
        ...validationFields.data,
        avatar_url: data?.url || "",
      },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: validationFields.data.email,
    password: validationFields.data.password,
    options: {
      data: {
        name: validationFields.data.name,
        role: validationFields.data.role,
        avatar_url: validationFields.data.avatar_url,
      },
    },
  });

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState?.errors,
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
    errors: {
      ...prevState?.errors,
      _form: [],
    },
  };
}
export async function updateUser(prevState: AuthFormState, formData: FormData) {
  let validatedFields = updateUserSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    avatar_url: formData.get("avatar_url"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  if (validatedFields.data.avatar_url instanceof File) {
    const oldAvatarUrl = formData.get("old_avatar_url") as string;
    const { error, data } = await uploadFile(
      "images",
      "users",
      validatedFields.data.avatar_url,
      oldAvatarUrl.split("/images/")[1],
    );
    if (error) {
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: [...error._form],
        },
      };
    }

    validatedFields = {
      ...validatedFields,
      data: {
        ...validatedFields.data,
        avatar_url: data.url,
      },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      name: validatedFields.data.name,
      role: validatedFields.data.role,
      avatar_url: validatedFields.data.avatar_url,
    })
    .eq("id", formData.get("id"));

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
  };
}

export async function deleteUser(prevState: AuthFormState, formData: FormData) {
  const supabase = await createClient({ isAdmin: true });
  const image = formData.get("avatar_url") as string;
  const { status, errors } = await deleteFile(
    "images",
    image.split("/images/")[1],
  );

  if (status === "error") {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [
          errors?._form?.[0] ||
            "Unknown error occurred while deleting the image.",
        ],
      },
    };
  }

  const { error } = await supabase.auth.admin.deleteUser(
    formData.get("id") as string,
  );

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [
          error?.message || "Unknown error occurred while deleting the user.",
        ],
      },
    };
  }

  return { status: "success" };
}
