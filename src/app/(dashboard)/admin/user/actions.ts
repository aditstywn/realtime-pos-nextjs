"use server";

import { createClient } from "@/lib/supabase/server";
import { AuthFormState } from "@/types/auth";
import { createUserSchema } from "@/validations/auth-validation";

export async function createUser(prevState: AuthFormState, formData: FormData) {
  const validationFields = createUserSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
    role: formData.get("role"),
    // avatar_url: formData.get("avatar_url"),
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

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: validationFields.data.email,
    password: validationFields.data.password,
    options: {
      data: {
        name: validationFields.data.name,
        role: validationFields.data.role,
        // avatar_url: validationFields.data.avatar_url,
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
