import { Message } from "../../../../Common/types/common.types";

export type UseMixtapeResults = {
  mixtapeTitles: string[];
  handleTapeSet: (title: string) => void;
  notificationImages: string[];
  backgroundImages: string[];
  message: Message;
};
