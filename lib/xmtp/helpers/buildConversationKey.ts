const buildConversationKey = (peerAddress: string, conversationId: string) => {
  return `${peerAddress.toLowerCase()}/${conversationId}`;
};

export default buildConversationKey;
