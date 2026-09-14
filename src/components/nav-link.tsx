import { Link as RouterLink } from "@tanstack/react-router";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type NavLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: ReactNode;
};

/**
 * Drop-in link that accepts `href` (like a plain anchor) and routes through
 * TanStack Router for internal paths. Hash links, mailto and external URLs
 * fall through to a native anchor.
 */
export default function NavLink({ href, children, ...props }: NavLinkProps) {
  const isInternal = href.startsWith("/") && !href.startsWith("//");

  if (!isInternal) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={href} {...props}>
      {children}
    </RouterLink>
  );
}

export { NavLink as Link };
