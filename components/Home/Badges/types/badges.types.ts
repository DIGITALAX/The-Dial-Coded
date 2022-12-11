export type useBadgesResult = {
  badgeInfo: BadgeInfo[];
  records: string[];
  totalPages: number;
  currentPage: number;
  handlePageDecrease: (e: number) => void;
  handlePageIncrease: (e: number) => void;
};

export interface BadgeInfo {
  name: string;
  image: string;
  color: string;
}
