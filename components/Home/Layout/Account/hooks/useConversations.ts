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
import compressImageFiles from "../../../../../lib/misc/helpers/compressImageFiles";
import fileLimitAlert from "../../../../../lib/misc/fileLimitAlert";

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
  const [conversationLoading, setConversationLoading] =
    useState<boolean>(false);
  const [onNetwork, setOnNetwork] = useState<boolean>(false);
  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [profileSearch, setProfileSearch] = useState<Profile[]>([]);
  const [profileLensData, setProfileLensData] = useState<Profile[]>([]);
  const [pageCursor, setPageCursor] = useState<any>();
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [searchGif, setSearchGif] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [openImagePicker, setOpenImagePicker] = useState<string>("");
  const [allConversations, setAllConversations] = useState<any[]>([]);
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
      getAllConversations(xmtp);
    } catch (err: any) {
      console.error(err?.message);
    }
    setClientLoading(false);
  };

  const getAllConversations = async (clientInput?: any) => {
    try {
      const conversationList = await (clientInput
        ? clientInput
        : client
      ).conversations.list();
      const lensConversations = conversationList.filter((conversation: any) =>
        conversation.context?.conversationId.startsWith("lens.dev/dm/")
      );
      setAllConversations(lensConversations);
      const messagedProfilesArray =
        buildConversationforDisplay(lensConversations);
      setProfileIds(messagedProfilesArray);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const buildConversationforDisplay = (lensConversations: any[]): any[] => {
    const conversationKeysResult = lensConversations.map((convo: any) =>
      buildConversationKey(
        convo.peerAddress,
        convo.context?.conversationId as string
      )
    );
    const matcherRegex = conversationMatchesProfile(lensProfile?.id);
    const matchingConvos = lensConversations.filter(
      (convo: any) =>
        convo.context?.conversationId &&
        matcherRegex.test(convo.context.conversationId)
    );
    messagePreviews(matchingConvos);

    const profiles: (string[] | null)[] = conversationKeysResult.map(
      (key: any) => getProfileFromKey(key)
    );
    let messagedProfilesArray: string[] = [];
    profiles.forEach((value) => {
      messagedProfilesArray.push(value?.[1] as string);
    });

    return messagedProfilesArray;
  };

  useEffect(() => {
    if (!client) {
      dispatch(setChosenDMProfile(undefined));
    } else {
      conversationStream();
    }
  }, [client]);

  useEffect(() => {
    if (profileIds && profileIds?.length > 0) {
      getProfileMessages();
    }
  }, [profileIds]);

  useEffect(() => {
    if (client) {
      getAllConversations();
      getConversationMessages(false);
    }
  }, [messageLoading]);

  useEffect(() => {
    if (chosenProfile?.ownedBy) {
      getConversationMessages(true);
      messageStream();
    }
  }, [chosenProfile]);

  const getConversationMessages = async (start: boolean) => {
    setConversationLoading(start);
    if (start) {
      const res = await checkOnNetwork();
      if (!res) {
        setConversationMessages([]);
        setConversationLoading(false);
        return;
      }
    }
    try {
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
        setConversationMessages(messagesInConversation);
      }
    } catch (err: any) {
      console.error(err.message, "HEY");
    }
    setConversationLoading(false);
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

      (Array.from(messageProfiles?.keys() as any) as any)?.map(
        ([key, profile]: any[]) => {
          const message = previewMessages?.get(key);
        }
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const sendConversation = async (media?: string) => {
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
      await conversation.send(media ? media : message);
    } catch (err: any) {
      console.error(err.message);
    }
    setMessage("");
    setMessageHTML("");
    (document as any).querySelector("#highlighted-message").innerHTML = "";
    setMessageLoading(false);
  };

  const conversationStream = async () => {
    try {
      const newStream = await client.conversations.stream();
      for await (const conversation of newStream) {
        if (conversation.context?.conversationId.startsWith("lens.dev/dm/")) {
          const newArray = [...allConversations, conversation];
          setAllConversations(newArray);
          const newMessagedProfilesArray =
            buildConversationforDisplay(newArray);
          setProfileIds(newMessagedProfilesArray);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const messageStream = async () => {
    try {
      const conversation = await client.conversations.newConversation(
        chosenProfile?.ownedBy
      );
      for await (const message of await conversation.streamMessages()) {
        if (message.senderAddress === client.address) {
          continue;
        }
        setConversationMessages([...conversationMessages, message]);
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

  const handleEmoji = (e: any): void => {
    let resultElement = document.querySelector("#highlighted-message");
    (resultElement as any).innerHTML = messageHTML + e.emoji;
    setMessageHTML(messageHTML + e.emoji);
    setMessage(message + e.emoji);
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

  const checkOnNetwork = async (): Promise<boolean> => {
    const res = await Client.canMessage(chosenProfile?.ownedBy);
    if (res && chosenProfile?.ownedBy) setOnNetwork(true);
    return res && chosenProfile?.ownedBy;
  };

  const handleChosenProfile = (user: Profile): void => {
    setSearchTarget(user?.handle);
    dispatch(setChosenDMProfile(user));
    setDropdown(false);
  };

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

  const handleGif = (e: FormEvent): void => {
    setSearchGif((e.target as HTMLFormElement).value);
  };

  const handleGifSubmit = async (e: any): Promise<void> => {
    const getGifs = await fetch("/api/giphy", {
      method: "POST",
      body: JSON.stringify(searchGif),
    });
    const allGifs = await getGifs.json();
    setResults(allGifs?.json?.results);
  };

  const handleSetGif = async (result: any): Promise<void> => {
    try {
      setOpenImagePicker("");
      await sendConversation(result);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleUploadImage = async (e: any): Promise<void> => {
    if (fileLimitAlert((e as any).target.files[0])) {
      return;
    }
    setMessageLoading(true);
    try {
      const compressedImage = await compressImageFiles(
        (e.target as HTMLFormElement).files[0]
      );
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: compressedImage as any,
      });
      let { cid } = await response.json();
      await sendConversation("ipfs://" + cid);
    } catch (err: any) {
      console.error(err.message);
    }
    setMessageLoading(false);
  };

  return {
    createClient,
    sendConversation,
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
    mentionProfiles,
    handleEmoji,
    openImagePicker,
    setOpenImagePicker,
    conversationLoading,
    client,
    onNetwork,
    handleGif,
    handleSetGif,
    handleGifSubmit,
    results,
    handleUploadImage,
  };
};

export default useConversations;
