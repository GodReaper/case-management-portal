import { auth } from "@clerk/nextjs";
import { Chapter, Case, UserProgress } from "@prisma/client"
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { CaseProgress } from "@/components/case-progress";

import { CaseSidebarItem } from "./case-sidebar-item";

interface CaseSidebarProps {
  cases: Case & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[]
  };
  progressCount: number;
};

export const CaseSidebar = async ({
  cases,
  progressCount,
}: CaseSidebarProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_caseId: {
        userId,
        caseId: cases.id,
      }
    }
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">
          {cases.title}
        </h1>
        {purchase && (
          <div className="mt-10">
            <CaseProgress
              variant="success"
              value={progressCount}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {cases.chapters.map((chapter) => (
          <CaseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            caseId={cases.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  )
}