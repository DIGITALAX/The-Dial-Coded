import { useSigner } from "wagmi";
import {
  Client,
  Conversation,
  DecodedMessage,
  Signer,
  SortDirection,
} from "@xmtp/xmtp-js";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { Profile } from "../../../../Common/types/lens.types";
import { FormEvent, useEffect, useRef, useState } from "react";
import { getAllProfiles } from "../../../../../graphql/queries/whoMirroredPublications";
import { UseConversationResults } from "../types/account.types";
import { searchProfile } from "../../../../../graphql/queries/search";
import lodash from "lodash";
import { setChosenDMProfile } from "../../../../../redux/reducers/chosenDMProfileSlice";
import parseConversationKey from "../../../../../lib/xmtp/helpers/parseConversationKey";
import buildConversationKey from "../../../../../lib/xmtp/helpers/buildConversationKey";
import buildConversationId from "../../../../../lib/xmtp/helpers/buildConversationId";
import conversationMatchesProfile from "../../../../../lib/xmtp/helpers/conversationMatchesProfile";
import getPostHTML from "../../../../../lib/lens/helpers/postHTML";
import getCaretPos from "../../../../../lib/lens/helpers/getCaretPos";

const useConversations = (): UseConversationResults => {
  const { data: signer } = useSigner();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const chosenProfile = useSelector(
    (state: RootState) => state.app.chosenDMProfileReducer.profile
  );
  const textElement = useRef<HTMLTextAreaElement>(null);
  const dispatch = useDispatch();
  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [profileSearch, setProfileSearch] = useState<Profile[]>([]);
  const [profileLensData, setProfileLensData] = useState<Profile[]>([]);
  const [pageCursor, setPageCursor] = useState<any>();
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [allConversations, setAllConversations] = useState<any[]>([]);
  const [createdClient, setCreatedClient] = useState<boolean>(false);
  const [clientLoading, setClientLoading] = useState<boolean>(false);
  const [searchTarget, setSearchTarget] = useState<string>("");
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [messageProfiles, setMessageProfiles] =
    useState<Map<string, Profile>>();
  const [previewMessages, setPreviewMessages] =
    useState<Map<string, DecodedMessage>>();
  const [profileIds, setProfileIds] = useState<string[]>();
  const [message, setMessage] = useState<string>("");
  const [messageHTML, setMessageHTML] = useState<string>("");
  const [client, setClient] = useState<any>();
  const [caretCoord, setCaretCoord] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [mentionProfiles, setMentionProfiles] = useState<Profile[]>([]);
  const [profilesOpen, setProfilesOpen] = useState<boolean>(false);

  const createClient = async () => {
    setClientLoading(true);
    try {
      const xmtp = await Client.create(signer as Signer | null);
      setClient(xmtp);
      const allConversations = await xmtp.conversations.list();
      const lensConversations = allConversations.filter((conversation) =>
        conversation.context?.conversationId.startsWith("lens.dev/dm/")
      );
      setAllConversations(lensConversations);
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

      const profileIds: (string[] | null)[] = conversationKeysResult.map(
        (key) => getProfileFromKey(key)
      );
      let messagedProfilesArray: string[] = [];
      profileIds.forEach((value) => {
        messagedProfilesArray.push(value?.[1] as string);
      });
      setProfileIds(messagedProfilesArray);
      setCreatedClient(true);
    } catch (err: any) {
      console.error(err?.message);
    }
    setClientLoading(false);
  };

  const getConversationMessages = async () => {
    let chosenConversation: any[] = [];
    const prof = (chosenProfile as any)?.id
      ? (chosenProfile as any)?.id
      : (chosenProfile as any)?.profileId;
    allConversations.filter((convo) => {
      if (convo.context.conversationId.split("-")[1] === prof) {
        chosenConversation.push(convo);
      }
    });
    for (const conversation of chosenConversation) {
      const messagesInConversation = await conversation.messages();
      console.log(messagesInConversation);
      setConversationMessages(messagesInConversation);
    }
  };

  const getProfileMessages = async () => {
    try {
      const { data } = await getAllProfiles({
        profileIds: lodash.uniq(profileIds),
        limit: 50,
      });
      const profiles = data?.profiles?.items as Profile[];
      setProfileLensData(profiles);
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
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const sendConversation = async () => {
    setMessageLoading(true);
    try {
      const conversation = await client.conversations.newConversation(
        chosenProfile?.ownedBy,
        {
          conversationId: buildConversationId(
            lensProfile?.id,
            (chosenProfile as any)?.profileId
              ? (chosenProfile as any)?.profileId
              : (chosenProfile as any)?.id
          ),
          metadata: {},
        }
      );
      const response = await conversation.send(message);
    } catch (err: any) {
      console.error(err.message);
    }
    setMessageLoading(false);
  };

  const conversationStream = async () => {
    try {
      const newStream = await client.conversations.stream();
      for await (const conversation of newStream) {
        if (conversation.context?.conversationId) {
          // listen to new messages and useeffect / show them
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getProfileFromKey = (key: string): string[] | null => {
    const parsed = parseConversationKey(key);
    const userProfileId = lensProfile?.id;
    if (!parsed || !userProfileId) {
      return null;
    }
    return parsed.members;
  };

  const handleMentionClick = (user: any) => {
    setProfilesOpen(false);
    let resultElement = document.querySelector("#highlighted-message");
    const newHTMLPost =
      messageHTML.substring(0, messageHTML.lastIndexOf("@")) +
      `@${user?.handle.split(".test")[0]}</span>`;
    const newElementPost =
      message.substring(0, message.lastIndexOf("@")) +
      `@${user?.handle.split(".test")[0]}`;
    setMessage(newElementPost);
    (resultElement as any).innerHTML = newHTMLPost;
    setMessageHTML(newHTMLPost);
  };

  const handleMessage = async (e: any): Promise<void> => {
    setMessage((e.target as HTMLFormElement).value);
    let resultElement = document.querySelector("#highlighted-message");
    if (e.target.value[e.target.value.length - 1] == "\n") {
      e.target.value += " ";
    }
    setMessageHTML(getPostHTML(e, resultElement as Element));
    setMessage(e.target.value);
    if (
      e.target.value.split(" ")[e.target.value.split(" ").length - 1][0] ===
        "@" &&
      e.target.value.split(" ")[e.target.value.split(" ").length - 1].length ===
        1
    ) {
      setCaretCoord(getCaretPos(e, textElement));
      setProfilesOpen(true);
    }
    if (
      e.target.value.split(" ")[e.target.value.split(" ").length - 1][0] === "@"
    ) {
      const allProfiles = await searchProfile({
        query: e.target.value.split(" ")[e.target.value.split(" ").length - 1],
        type: "PROFILE",
        limit: 50,
      });
      setMentionProfiles(allProfiles?.data?.search?.items);
    } else {
      setProfilesOpen(false);
      setMentionProfiles([]);
    }
  };

  const handleChosenProfile = async (user: Profile): Promise<void> => {
    setSearchTarget(user?.handle);
    dispatch(setChosenDMProfile(user));
    setDropdown(false);
    // await getConversationMessages();
  };

  useEffect(() => {
    if (chosenProfile) {
      getConversationMessages();
    }
  }, [chosenProfile]);

  const searchMessages = async (e: FormEvent): Promise<void> => {
    setSearchLoading(true);
    setSearchTarget((e.target as HTMLFormElement).value);
    if ((e.target as HTMLFormElement).value === "") {
      setDropdown(false);
    } else {
      setDropdown(true);
    }
    try {
      const profiles = await searchProfile({
        query: (e.target as HTMLFormElement).value,
        type: "PROFILE",
        limit: 50,
      });
      setPageCursor(profiles?.data?.search?.pageInfo);
      const sortedArr = lodash.sortBy(profiles?.data?.search?.items, "handle");
      setProfileSearch(sortedArr);
    } catch (err: any) {
      console.error(err.message);
    }
    setSearchLoading(false);
  };

  const searchMoreMessages = async (): Promise<void> => {
    try {
      const moreProfiles = await searchProfile({
        query: searchTarget,
        type: "PROFILE",
        limit: 50,
        cursor: pageCursor?.next,
      });
      setPageCursor(moreProfiles?.data?.search?.pageInfo);
      const sortedArr = lodash.sortBy(
        moreProfiles?.data?.search?.items,
        "handle"
      );
      setProfileSearch([...profileSearch, ...sortedArr]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (profileIds && profileIds?.length > 0) {
      getProfileMessages();
    }
  }, [profileIds]);

  return {
    createClient,
    sendConversation,
    createdClient,
    searchMessages,
    clientLoading,
    searchLoading,
    profileSearch,
    searchMoreMessages,
    handleMessage,
    handleChosenProfile,
    searchTarget,
    dropdown,
    previewMessages,
    profileLensData,
    messageProfiles,
    conversationMessages,
    message,
    textElement,
    messageLoading,
    caretCoord,
    handleMentionClick,
    profilesOpen,
    mentionProfiles
  };
};

export default useConversations;
