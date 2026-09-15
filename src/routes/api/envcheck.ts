import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/envcheck")({
  server: {
    handlers: {
      GET: () =>
        Response.json({
          keys: Object.keys(process.env ?? {}).filter((k) => k.includes("LOVABLE")),
          hasKey: Boolean(process.env["LOVABLE_API_KEY"]),
        }),
    },
  },
});
