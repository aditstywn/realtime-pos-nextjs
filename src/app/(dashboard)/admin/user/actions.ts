"use server";

import { uploadFile } from "@/actions/storage-action";
import { createClient } from "@/lib/supabase/server";
import { AuthFormState } from "@/types/auth";
import { createUserSchema } from "@/validations/auth-validation";

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
