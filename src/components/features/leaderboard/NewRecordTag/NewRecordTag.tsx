import { Tag } from "@/components/ui/tag";
import { recentResultCheck } from "../Leaderboard.utils";

const stylesTag = {
  colorPalette: "orange",
  variant: "solid" as const,
  ml: 2,
};

interface INewRecordTagProps{
  createdAt: Date | undefined;
}

export default function NewRecordTag({createdAt}: INewRecordTagProps) {
  return (
    recentResultCheck(createdAt ?? new Date()) && (
      <Tag {...stylesTag}>NEW!</Tag>
    )
  );
}
