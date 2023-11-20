import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!,
);

export async function DELETE(
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
        userId: userId,
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

    for (const chapter of cases.chapters) {
      if (chapter.muxData?.assetId) {
        await Video.Assets.del(chapter.muxData.assetId);
      }
    }

    const deletedCase = await db.case.delete({
      where: {
        id: params.caseId,
      },
    });

    return NextResponse.json(deletedCase);
  } catch (error) {
    console.log("[CASE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { caseId: string } }
) {
  try {
    const { userId } = auth();
    const { caseId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cases = await db.case.update({
      where: {
        id: caseId,
        userId
      },
      data: {
        ...values,
      }
    });

    return NextResponse.json(cases);
  } catch (error) {
    console.log("[CASE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}