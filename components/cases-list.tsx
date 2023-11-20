import { Category, Case } from "@prisma/client";

import { CaseCard } from "@/components/case-card";

type CaseWithProgressWithCategory = Case & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CasesListProps {
  items: CaseWithProgressWithCategory[];
}

export const CasesList = ({
  items
}: CasesListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <CaseCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl!}
            chaptersLength={item.chapters.length}
            price={item.price!}
            progress={item.progress}
            category={item?.category?.name!}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No cases found
        </div>
      )}
    </div>
  )
}