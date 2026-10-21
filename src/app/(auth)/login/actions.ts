"use server";

import { INITIAL_STATE_LOGIN_FORM } from "@/constants/auth-constant";
import { createClient } from "@/lib/supabase/server";
import { AuthFormState } from "@/types/auth";
import { loginSchemaForm } from "@/validations/auth-validation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  prevState: AuthFormState,
  formData: FormData | null,
): Promise<AuthFormState> {
  if (!formData) {
    return INITIAL_STATE_LOGIN_FORM;
  }

  const validationFields = loginSchemaForm.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
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

  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword(validationFields.data);

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState?.errors,
        _form: [error.message],
      },
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  if (profile) {
    const cookiesStore = await cookies();

    cookiesStore.set("user", JSON.stringify(profile), {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "lax",
    });
  }

  revalidatePath("/", "layout");
  redirect("/");
}
