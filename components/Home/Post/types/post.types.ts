import { PublicationsQueryRequest } from "../../../Common/types/lens.types";

export type MainPostProps = {
  publicationData: any;
  fetchReactions: (id: string) => Promise<any>;
  didMirror: any[];
  getMoreMirrors: () => Promise<void>
};
