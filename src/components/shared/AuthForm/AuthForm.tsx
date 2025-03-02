"use client";
import { Button } from "@/styles/theme/components/button";
import { Flex, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { FieldValues, useForm } from "react-hook-form";
import { Heading } from "@/styles/theme/components/heading";
import { useState } from "react";
import { login } from "../utils/actions/auth/login";
import { register as registerUser } from "../utils/actions/auth/register";
import { toaster } from "@/components/ui/toaster";
import { deleteCookie } from "cookies-next";
import { checkCookieItems } from "../utils/checkCookieItems";
import { PasswordStrengthWrapper } from "../PasswordStrengthWrapper/PasswordStrengthWrapper";

export default function AuthForm({ closeModal }: { closeModal: () => void }) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const [isLogin, setIsLogin] = useState(true);
  
  const handleLogin = async (formData: FieldValues) => {
    const res = await login(formData);
    toaster.create({
      title: res?.error ? `Error: ${res?.error}` : "Logged in successfully",
      type: res?.error ? "error" : "success",
      duration: 5000,
    });
    if (res?.error) return;

    deleteCookie("isAnonymous");
    closeModal();
    if (res?.user?.id) checkCookieItems(res?.user?.id);
  };

  const handleRegister = async (formData: FieldValues) => {
    const res = await registerUser(formData);
    if (res === null) {
      await handleLogin(formData);
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
  };

  const onSubmit = handleSubmit(async (formData) => {
    if (isLogin) await handleLogin(formData);
    else await handleRegister(formData);
  });

  const toggleForm = () => setIsLogin((prev) => !prev);

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
          {
            !isLogin && (
              <Field
                label="Username"
                invalid={!!errors.username}
                errorText={errors.username?.message?.toString()}
              >
                <Input
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must have at least 3 characters",
                    },
                  })}
                />
              </Field>
            )
          }
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
            {!isLogin && (
              <Flex
                width="100%"
                justifyContent="end"
              >
                <PasswordStrengthWrapper isLogin={isLogin} control={control}/>
              </Flex>
            )}
          </Field>
          {!isLogin && (
            <>
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
            </>
          )}
          
          <Flex>
            <Button type="submit">{isLogin ? "Login" : "Sign Up"}</Button>
            <Button
              type="button"
              onClick={toggleForm}
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