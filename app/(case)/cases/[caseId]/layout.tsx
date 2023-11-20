import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";

import { CaseSidebar } from "./_components/case-sidebar";
import { CaseNavbar } from "./_components/case-navbar";

const CaseLayout = async ({
  children,
  params
}: {
  children: React.ReactNode;
  params: { caseId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/")
  }

  const cases = await db.case.findUnique({
    where: {
      id: params.caseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            }
          }
        },
        orderBy: {
          position: "asc"
        }
      },
    },
  });

  if (!cases) {
    return redirect("/");
  }

  const progressCount = await getProgress(userId, cases.id);

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CaseNavbar
          cases={cases}
          progressCount={progressCount}
        />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CaseSidebar
          cases={cases}
          progressCount={progressCount}
        />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">
        {children}
      </main>
    </div>
  )
}

export default CaseLayout