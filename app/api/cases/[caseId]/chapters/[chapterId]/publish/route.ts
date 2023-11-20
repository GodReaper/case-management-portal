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
      include: {
        chapters: {
          include: {
            muxData: true,
          }
        }
      }
    });

    if (!cases) {
      return new NextResponse("Not found", { status: 404 });
    }

    const hasPublishedChapter = cases.chapters.some((chapter) => chapter.isPublished);

    if (!cases.title || !cases.description || !cases.imageUrl || !cases.categoryId || !hasPublishedChapter) {
      return new NextResponse("Missing required fields", { status: 401 });
    }

    const publishedCase = await db.case.update({
      where: {
        id: params.caseId,
        userId,
      },
      data: {
        isPublished: true,
      }
    });

    return NextResponse.json(publishedCase);
  } catch (error) {
    console.log("[CASE_ID_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  } 
}