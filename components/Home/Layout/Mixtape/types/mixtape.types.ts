import { Message } from "../../../../Common/types/common.types";

export type UseMixtapeResults = {
  mixtapeBackgrounds: string[];
  mixtapeTitles: string[];
  handleTapeSet: (title: string) => void;
  notificationImages: string[];
  message: Message;
  getMoreMixtapes: () => Promise<void>;
  getMixLoading: boolean;
  mixtapes: any;
  updateMix: any;
};
