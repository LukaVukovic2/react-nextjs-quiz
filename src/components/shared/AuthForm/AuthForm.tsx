"use client";
import { Button } from "@/styles/theme/components/button";
import { Flex, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { Heading } from "@/styles/theme/components/heading";
import { useState } from "react";
import { PasswordStrengthMeter } from "@/components/ui/password-input";
import zxcvbn from "zxcvbn";
import { login } from "../utils/actions/auth/login";
import { register as registerUser } from "../utils/actions/auth/register";
import { toaster } from "@/components/ui/toaster";
import { deleteCookie } from "cookies-next";
import { checkSessionItems } from "../utils/checkSessionItems";

export default function AuthForm({ closeModal }: { closeModal: () => void }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [isLogin, setIsLogin] = useState(true);
  const passwordStrengthValue = zxcvbn(watch("password", ""))?.score;

  const handleLoginResponse = async (error: string | undefined) => {
    toaster.create({
      title: error ? `Error: ${error}` : "Logged in successfully",
      type: error ? "error" : "success",
      duration: 5000,
    });
    if (error) return false;
    closeModal();
    deleteCookie("isAnonymous");
    return true;
  };

  const onSubmit = handleSubmit(async (d) => {
    const formData = JSON.parse(JSON.stringify(d));

    if (isLogin) {
      const res = await login(formData);
      const success = await handleLoginResponse(res?.error);
      if (success && res?.user?.id) {
        checkSessionItems(res?.user?.id);
      }
    } else {
      const res = await registerUser(formData);

      if (res === null) {
        const loginRes = await login(formData);
        await handleLoginResponse(loginRes?.error);
      } else {
        toaster.create({
          title: res?.error
            ? `Error: ${res.error}`
            : "Confirmation email sent. Please check your inbox.",
          type: res?.error ? "error" : "loading",
          meta: {
            closable: res.error ? false : true,
          },
        });
        closeModal();
      }
    }
  });

  return (
    <>
      <Heading size="h3">{isLogin ? "Login" : "Sign Up"}</Heading>
      <form onSubmit={onSubmit}>
        <Stack
          gap="4"
          align="flex-start"
          maxW="sm"
        >
          <Field
            label="Email"
            invalid={!!errors.email}
            errorText={errors.email?.message?.toString()}
          >
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^([^.@]+)(\.[^.@]+)*@([^.@]+\.)+([^.@]+)$/i,
                  message: "Email is not valid",
                },
              })}
            />
          </Field>
          <Field
            label="Password"
            invalid={!!errors.password}
            errorText={errors.password?.message?.toString()}
          >
            <Input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must have at least 6 characters",
                },
              })}
            />
            {!isLogin && watch("password") && (
              <Flex
                width="100%"
                justifyContent="end"
              >
                <PasswordStrengthMeter
                  value={passwordStrengthValue}
                  maxWidth="200px"
                  width="100%"
                />
              </Flex>
            )}
          </Field>
          {!isLogin && (
            <Field
              label="Repeat Password"
              invalid={!!errors.password2}
              errorText={errors.password2?.message?.toString()}
            >
              <Input
                type="password"
                {...register("password2", {
                  required: "Password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
              />
            </Field>
          )}
          <Flex>
            <Button type="submit">{isLogin ? "Login" : "Sign Up"}</Button>
            <Button
              type="button"
              onClick={() => setIsLogin((prev) => !prev)}
              visual="ghost"
            >
              {isLogin ? "Create new account" : "Already have an account?"}
            </Button>
          </Flex>
        </Stack>
      </form>
    </>
  );
}
