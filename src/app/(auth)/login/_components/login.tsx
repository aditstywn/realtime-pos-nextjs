"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { LoginForm, loginSchemaForm } from "@/validations/auth-validation";
import {
  INITIAL_LOGIN_FORM,
  INITIAL_STATE_LOGIN_FORM,
} from "@/constants/auth-constant";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/common/form-input";
import { startTransition, useActionState, useEffect } from "react";
import { login } from "../actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchemaForm),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  const [loginState, loginAction, isPendingLogin] = useActionState(
    login,
    INITIAL_STATE_LOGIN_FORM,
  );

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      loginAction(formData);
    });
  });

  useEffect(() => {
    if (loginState.status === "error") {
      toast.error("Login Failed", {
        description: loginState.errors?._form?.[0] || "Login failed",
      });
      startTransition(() => {
        loginAction(null);
      });
    }
  }, [loginState]);

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Login</CardTitle>
        <CardDescription>Login to access all features</CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit} noValidate>
        <CardContent>
          <FieldGroup>
            <FormInput
              form={form}
              name="email"
              label="Email"
              placeholder="Enter your email"
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

        <CardFooter className="mt-6">
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit">
              {isPendingLogin ? <Loader2 className="animate-spin" /> : "Login"}
            </Button>
          </Field>
        </CardFooter>
      </form>
    </Card>
  );
}
