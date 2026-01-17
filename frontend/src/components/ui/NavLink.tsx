import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
}

export const NavLink = ({ to, children, className, activeClassName, exact = false }: NavLinkProps) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={cn(className, isActive && activeClassName)}
    >
      {children}
    </Link>
  );
};
