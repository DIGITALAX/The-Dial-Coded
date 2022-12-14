import { Profile } from "../../../../Common/types/lens.types";

export type PostBoxProps = {
  isConnected: boolean;
  openConnectModal: (() => void) | undefined;
  lensProfile: Profile | undefined;
};

export type UsePostResult = {
  connected: boolean;
};
