export type MainPostMixtapeProps = {
  publicationData: any;
  hasPostMirrored: boolean[];
  hasPostCommented: boolean[];
  hasPostReacted: boolean[];
  reactionsPostFeed: any[];
  handleHidePost: (id: string) => Promise<void>;
};
