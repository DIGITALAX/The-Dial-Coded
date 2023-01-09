import { CONVERSATION_KEY_RE, XMTP_PREFIX } from "../../lens/constants";

const parseConversationKey = (
  conversationKey: string
): {
  peerAddress: string;
  members: string[];
  conversationId: string;
} | null => {
  const matches = conversationKey.match(CONVERSATION_KEY_RE);
  if (!matches || matches.length !== 4) {
    return null;
  }

  const [, peerAddress, memberA, memberB] = Array.from(matches);

  return {
    peerAddress,
    members: [memberA, memberB],
    conversationId: `${XMTP_PREFIX}/${memberA}-${memberB}`,
  };
};

export default parseConversationKey;
