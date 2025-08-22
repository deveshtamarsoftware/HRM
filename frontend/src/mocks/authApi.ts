// src/features/auth/authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }), // still here for later real API use
  endpoints: (builder) => ({
    login: builder.mutation<
      { user: any; role: "EMPLOYEE" | "MANAGER" | "HR"; token: string },
      { email: string; password: string }
    >({
      // Mocked login for testing
      async queryFn({ email, password }) {
        // Hardcoded users
        if (email === "employee@example.com" && password === "123456") {
          return {
            data: {
              user: { email, name: "Employee One" },
              role: "EMPLOYEE",
              token: "emp-token",
            },
          };
        }

        if (email === "admin@example.com" && password === "123456") {
          return {
            data: {
              user: { email, name: "Admin User" },
              role: "HR",
              token: "admin-token",
            },
          };
        }

        if (email === "manager@example.com" && password === "123456") {
          return {
            data: {
              user: { email, name: "Manager User" },
              role: "MANAGER",
              token: "mgr-token",
            },
          };
        }

        // Invalid credentials
        return {
          error: {
            status: 401,
            data: { message: "Invalid email or password" },
          },
        };
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
