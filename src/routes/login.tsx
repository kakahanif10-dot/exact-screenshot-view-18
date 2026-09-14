import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/components/auth/login-page";

const title = "Sign in — Vibecode Inc.";
const description =
  "Create your Vibecode account or sign back in to return to your AI software workspace.";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});
