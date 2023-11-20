import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const CasePage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const cases = await db.case.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return ( 
    <div className="p-6">
      <DataTable columns={columns} data={cases} />
    </div>
   );
}
 
export default CasePage;