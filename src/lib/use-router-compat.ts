import { useNavigate } from "@tanstack/react-router";

/** Minimal Next-style router shim over TanStack Router. */
export function useRouter() {
  const navigate = useNavigate();
  return {
    push: (to: string) => navigate({ to }),
    replace: (to: string) => navigate({ to, replace: true }),
  };
}
