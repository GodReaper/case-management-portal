import { Menu } from "lucide-react";
import { Chapter, Case, UserProgress } from "@prisma/client";

import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";

import { CaseSidebar } from "./case-sidebar";

interface CaseMobileSidebarProps {
  cases: Case & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
};

export const CaseMobileSidebar = ({ 
  cases,
  progressCount,
}: CaseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-72">
        <CaseSidebar
          cases={cases}
          progressCount={progressCount}
        />
      </SheetContent>
    </Sheet>
  )
}