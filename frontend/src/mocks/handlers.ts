import { rest } from "msw";

export const handlers = [
  rest.post("/login", async (req, res, ctx) => {
    const { email, password } = await req.json();

    if (email === "admin@example.com" && password === "1234") {
      return res(
        ctx.status(200),
        ctx.json({ token: "mock-token", user: { name: "Admin User" } })
      );
    }
    return res(ctx.status(401), ctx.json({ message: "Invalid credentials" }));
  }),

  rest.post("/register", async (req, res, ctx) => {
    const { email } = await req.json();

    return res(
      ctx.status(201),
      ctx.json({ message: `Account created for ${email}` })
    );
  }),
];
