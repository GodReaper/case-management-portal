import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { caseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cases = await db.case.findUnique({
      where: {
        id: params.caseId,
        userId,
      },
    });

    if (!cases) {
      return new NextResponse("Not found", { status: 404 });
    }

    const unpublishedCase = await db.case.update({
      where: {
        id: params.caseId,
        userId,
      },
      data: {
        isPublished: false,
      }
    });

    return NextResponse.json(unpublishedCase);
  } catch (error) {
    console.log("[CASE_ID_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  } 
}