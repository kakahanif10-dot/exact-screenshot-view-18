import { createFileRoute } from "@tanstack/react-router";
import { WorkspacePage } from "@/components/workspace/workspace-page";

const title = "Workspace — Vibecode Inc.";
const description =
  "Describe an app, watch the AI consultant compile it, and explore the live phone preview in your Vibecode workspace.";

export const Route = createFileRoute("/workspace")({
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
  component: WorkspacePage,
});
