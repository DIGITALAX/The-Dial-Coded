import { XMTP_PREFIX } from "../../lens/constants";

const buildConversationId = (profileIdA: string, profileIdB: string) => {
  const profileIdAParsed = parseInt(profileIdA, 16);
  const profileIdBParsed = parseInt(profileIdB, 16);
  return profileIdAParsed < profileIdBParsed
    ? `${XMTP_PREFIX}/${profileIdA}-${profileIdB}`
    : `${XMTP_PREFIX}/${profileIdB}-${profileIdA}`;
};

export default buildConversationId;
