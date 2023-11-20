import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const CaseIdPage = async ({
  params
}: {
  params: { caseId: string; }
}) => {
  const cases = await db.case.findUnique({
    where: {
      id: params.caseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc"
        }
      }
    }
  });

  if (!cases) {
    return redirect("/");
  }

  return redirect(`/cases/${cases.id}/chapters/${cases.chapters[0].id}`);
}
 
export default CaseIdPage;