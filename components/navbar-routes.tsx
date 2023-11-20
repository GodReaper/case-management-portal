"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";

export const NavbarRoutes = () => {
  const pathname = usePathname();
 

  const isLawyerPage = pathname?.startsWith("/lawyer");
  const isPlayerPage = pathname?.includes("/chapter");
  const isSearchPage = pathname === "/search"

  return (
    <>
    {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
    <div className="flex gap-x-2 ml-auto">
      {isLawyerPage || isPlayerPage ? (
        <Link href="/">
        <Button size="sm" variant="ghost">
          <LogOut className="h-4 w-4 mr-2" />
          Exit
        </Button>
        </Link>
      ) : (
        <Link href="/lawyer/cases">
          <Button size="sm" variant="ghost">
            Lawyer mode
          </Button>
        </Link>
      )}
      <UserButton afterSignOutUrl="/" />
    </div>
    </>
  );
};
