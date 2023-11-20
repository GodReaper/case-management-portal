import { Category, Case } from "@prisma/client";

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

type CaseWithProgressWithCategory = Case & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCases = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCases = async ({
  userId,
  title,
  categoryId
}: GetCases): Promise<CaseWithProgressWithCategory[]> => {
  try {
    const cases = await db.case.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          }
        },
        purchases: {
          where: {
            userId,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    const casesWithProgress: CaseWithProgressWithCategory[] = await Promise.all(
      cases.map(async cases => {
        if (cases.purchases.length === 0) {
          return {
            ...cases,
            progress: null,
          }
        }

        const progressPercentage = await getProgress(userId, cases.id);

        return {
          ...cases,
          progress: progressPercentage,
        };
      })
    );

    return casesWithProgress;
  } catch (error) {
    console.log("[GET_CASES]", error);
    return [];
  }
}