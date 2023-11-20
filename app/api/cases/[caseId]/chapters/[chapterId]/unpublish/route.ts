import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { caseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCase = await db.case.findUnique({
      where: {
        id: params.caseId,
        userId
      }
    });

    if (!ownCase) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        caseId: params.caseId,
      },
      data: {
        isPublished: false,
      }
    });

    const publishedChaptersInCase = await db.chapter.findMany({
      where: {
        caseId: params.caseId,
        isPublished: true,
      }
    });

    if (!publishedChaptersInCase.length) {
      await db.case.update({
        where: {
          id: params.caseId,
        },
        data: {
          isPublished: false,
        }
      });
    }

    return NextResponse.json(unpublishedChapter);
  } catch (error) {
    console.log("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}