import { useSigner } from "wagmi";
import {
  Client,
  Conversation,
  DecodedMessage,
  Signer,
  SortDirection,
} from "@xmtp/xmtp-js";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import {
  CONVERSATION_KEY_RE,
  XMTP_PREFIX,
} from "../../../../../lib/lens/constants";
import { Profile } from "../../../../Common/types/lens.types";
import { FormEvent, useEffect, useState } from "react";
import { getAllProfiles } from "../../../../../graphql/queries/whoMirroredPublications";
import { UseConversationResults } from "../types/account.types";

const useConversations = (): UseConversationResults => {
  const { data: signer } = useSigner();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const [createdClient, setCreatedClient] = useState<boolean>(false);
  const [messageProfiles, setMessageProfiles] =
    useState<Map<string, Profile>>();
  const [previewMessages, setPreviewMessages] =
    useState<Map<string, DecodedMessage>>();
  const [profileIds, setProfileIds] = useState<(string | null)[]>();

  const createClient = async () => {
    setCreatedClient(true);
    try {
      const xmtp = await Client.create(signer as Signer | null);
      const allConversations = await xmtp.conversations.list();
      const lensConversations = allConversations.filter((conversation) =>
        conversation.context?.conversationId.startsWith("lens.dev/dm/")
      );
      const conversationKeysResult = lensConversations.map((convo) =>
        buildConversationKey(
          convo.peerAddress,
          convo.context?.conversationId as string
        )
      );
      const matcherRegex = conversationMatchesProfile(lensProfile?.id);
      const matchingConvos = allConversations.filter(
        (convo) =>
          convo.context?.conversationId &&
          matcherRegex.test(convo.context.conversationId)
      );
      messagePreviews(matchingConvos);
      const profileIds = conversationKeysResult.map((key) =>
        getProfileFromKey(key)
      );
      setProfileIds(profileIds);
    } catch (err: any) {
      console.error(err?.message);
    }
    setCreatedClient(false);
  };

  const getProfileMessages = async () => {
    try {
      const { data } = await getAllProfiles({
        profileIds: profileIds,
        limit: 50,
      });
      const profiles = data?.profiles?.items as Profile[];
      const newMessageProfiles = new Map(messageProfiles);
      for (const profile of profiles) {
        const peerAddress = profile.ownedBy as string;
        const key = buildConversationKey(
          peerAddress,
          buildConversationId(lensProfile?.id, profile.id)
        );
        newMessageProfiles.set(key, profile);
      }
      setMessageProfiles(newMessageProfiles);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const fetchMostRecentMessage = async (
    convo: Conversation
  ): Promise<{ key: string; message?: DecodedMessage } | void> => {
    try {
      const key = buildConversationKey(
        convo.peerAddress,
        convo.context?.conversationId as string
      );
      const newMessages = await convo.messages({
        limit: 1,
        direction: SortDirection.SORT_DIRECTION_DESCENDING,
      });
      if (newMessages.length <= 0) {
        return { key };
      }
      return { key, message: newMessages[0] };
    } catch (err: any) {
      console.error(err?.message);
    }
  };

  const messagePreviews = async (matchingConvos: any): Promise<void> => {
    try {
      const newPreviewMessages = new Map(previewMessages);
      const previews = await Promise.all(
        matchingConvos?.map(fetchMostRecentMessage)
      );
      for (const preview of previews) {
        if (preview.message) {
          newPreviewMessages.set(preview.key, preview.message);
        }
      }
      setPreviewMessages(newPreviewMessages);
      (messageProfiles as any)?.map(([key, profile]: any[]) => {
        const message = previewMessages?.get(key);
        console.log(`profileId: ${profile.id} messageId: ${message?.id}`);
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const conversationMatchesProfile = (profileId: string) =>
    new RegExp(`lens.dev/dm/.*${profileId}`);

  const sendConversation = async (otherProfile: Profile, e: FormEvent) => {
    try {
      const xmtp = await Client.create(signer as Signer | null);
      const conversation = await xmtp.conversations.newConversation(
        otherProfile.ownedBy,
        {
          conversationId: buildConversationId(lensProfile?.id, otherProfile.id),
          metadata: {},
        }
      );
      await conversation.send((e.target as HTMLFormElement).value);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const buildConversationId = (profileIdA: string, profileIdB: string) => {
    const profileIdAParsed = parseInt(profileIdA, 16);
    const profileIdBParsed = parseInt(profileIdB, 16);
    return profileIdAParsed < profileIdBParsed
      ? `${XMTP_PREFIX}/${profileIdA}-${profileIdB}`
      : `${XMTP_PREFIX}/${profileIdB}-${profileIdA}`;
  };

  const buildConversationKey = (
    peerAddress: string,
    conversationId: string
  ) => {
    return `${peerAddress.toLowerCase()}/${conversationId}`;
  };

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

  const getProfileFromKey = (key: string): string | null => {
    const parsed = parseConversationKey(key);
    const userProfileId = lensProfile?.id;
    if (!parsed || !userProfileId) {
      return null;
    }

    return parsed.members.find((member) => member !== userProfileId) ?? null;
  };

  useEffect(() => {
    if (profileIds) {
      getProfileMessages();
    }
  }, [profileIds]);

  return { createClient, sendConversation, createdClient };
};

export default useConversations;
