import { Chapter, Case, UserProgress } from "@prisma/client"

import { NavbarRoutes } from "@/components/navbar-routes";

import { CaseMobileSidebar } from "./case-mobile-sidebar";

interface CaseNavbarProps {
  cases: Case & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
};

export const CaseNavbar = ({
  cases,
  progressCount,
}: CaseNavbarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <CaseMobileSidebar
        cases={cases}
        progressCount={progressCount}
      />
      <NavbarRoutes />      
    </div>
  )
}