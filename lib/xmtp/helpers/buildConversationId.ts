import { XMTP_PREFIX } from "../../lens/constants";

const buildConversationId = (profileIdA: string, profileIdB: string) => {
  return `${XMTP_PREFIX}/${profileIdA}-${profileIdB}`;
};

export default buildConversationId;
