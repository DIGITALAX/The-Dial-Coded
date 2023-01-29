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
import fileLimitAlert from "../../../../../lib/misc/helpers/fileLimitAlert";
import { setXmtpClient } from "../../../../../redux/reducers/xmtpClientSlice";
import { setInsufficientFunds } from "../../../../../redux/reducers/insufficientFunds";
import { setXmtpSearch } from "../../../../../redux/reducers/xmtpSearchSlice";
import createXmtpClient from "../../../../../lib/xmtp/helpers/createXmtpClient";

const useConversations = (): UseConversationResults => {
  const { data: signer } = useSigner();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const chosenProfile = useSelector(
    (state: RootState) => state.app.chosenDMProfileReducer.profile
  );
  const xmtpSearch = useSelector(
    (state: RootState) => state.app.xmtpSearchReducer.value
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
  const [allConversationsLoading, setAllConversationsLoading] =
    useState<boolean>(false);
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [messageProfiles, setMessageProfiles] =
    useState<Map<string, Profile>>();
  const [previewMessages, setPreviewMessages] =
    useState<Map<string, DecodedMessage>>();
  const [profileIds, setProfileIds] = useState<string[]>();
  const [message, setMessage] = useState<string>("");
  const [messageHTML, setMessageHTML] = useState<string>("");
  const client = useSelector(
    (state: RootState) => state.app.xmtpClientReducer.value
  );
  const [caretCoord, setCaretCoord] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [mentionProfiles, setMentionProfiles] = useState<Profile[]>([]);
  const [profilesOpen, setProfilesOpen] = useState<boolean>(false);

  const createClient = async () => {
    setClientLoading(true);
    try {
      const xmtp = await createXmtpClient(signer as Signer);
      dispatch(setXmtpClient(xmtp));
      // getAllConversations(true, xmtp);
    } catch (err: any) {
      console.error(err?.message);
    }
    setClientLoading(false);
  };

  const getAllConversations = async (
    load: boolean,
    clientInput?: any
  ): Promise<any[] | void> => {
    setAllConversationsLoading(load);
    try {
      const conversationList = await (clientInput
        ? clientInput
        : client
      ).conversations.list({
        direction: SortDirection.SORT_DIRECTION_DESCENDING,
      });
      if (conversationList?.length > 0) {
        const lensConversations = conversationList?.filter(
          (conversation: any) =>
            conversation?.context?.conversationId?.startsWith("lens.dev/dm/")
        );
        setAllConversations(
          lensConversations.length > 0 ? lensConversations : []
        );
        const messagedProfilesArray =
          lensConversations?.length > 0 &&
          buildConversationforDisplay(lensConversations);
        setProfileIds(
          messagedProfilesArray && messagedProfilesArray?.length > 0
            ? messagedProfilesArray
            : []
        );

        return lensConversations.length > 0 ? lensConversations : [];
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setAllConversationsLoading(false);
  };

  const buildConversationforDisplay = (lensConversations: any[]): any[] => {
    const conversationKeysResult = lensConversations?.map((convo: any) => {
      return buildConversationKey(
        convo.peerAddress,
        convo.context?.conversationId as string
      );
    });
    const matcherRegex = conversationMatchesProfile(lensProfile?.id);
    const matchingConvos = lensConversations.filter((convo: any) => {
      if (
        convo.context?.conversationId &&
        matcherRegex.test(convo.context.conversationId)
      ) {
        return true;
      }
    });
    if (matchingConvos?.length > 0) {
      messagePreviews(matchingConvos);
    }
    let messagedProfilesArray: string[] = [];
    if (conversationKeysResult?.length > 0) {
      const profiles: (string[] | null)[] = conversationKeysResult?.map(
        (key: any) => getProfileFromKey(key)
      );
      if (profiles?.length > 0) {
        profiles?.forEach((value) => {
          if (value?.[0] !== lensProfile?.id) {
            messagedProfilesArray.push(value?.[0] as string);
          } else {
            messagedProfilesArray.push(value?.[1] as string);
          }
        });
      }
    }
    return messagedProfilesArray;
  };

  useEffect(() => {
    if (!client) {
      dispatch(setChosenDMProfile(undefined));
    } else {
      // this may not work here
      getAllConversations(true, client);
      conversationStream();
    }
  }, [client]);

  useEffect(() => {
    if (profileIds && profileIds.length > 0) {
      getProfileMessages();
    }
  }, [profileIds]);

  useEffect(() => {
    if (client) {
      getAllConversations(false);
      messageStream();
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
        dispatch(setXmtpSearch(""));
        dispatch(setChosenDMProfile(undefined));
        dispatch(setInsufficientFunds("xmtp"));
        return;
      }
    }
    try {
      let chosenConversation: any[] = [];
      const prof = (chosenProfile as any)?.id
        ? (chosenProfile as any)?.id
        : (chosenProfile as any)?.profileId;
      let recordedConversations: any;
      if (allConversations.length === 0) {
        // try one more time for dm click
        recordedConversations = await getAllConversations(false);
      }
      if (allConversations?.length > 0 || recordedConversations.length > 0) {
        const loopConvo =
          allConversations.length > 0
            ? allConversations
            : recordedConversations;
        for (const convo in loopConvo) {
          if (loopConvo[convo as any].context.conversationId.includes(prof)) {
            chosenConversation.push(loopConvo[convo as any]);
          }
        }
        if (chosenConversation?.length > 0) {
          for (const conversation of chosenConversation) {
            const messagesInConversation = await conversation.messages();
            setConversationMessages(messagesInConversation);
          }
        } else {
          setConversationMessages([]);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setConversationLoading(false);
  };

  const getProfileMessages = async () => {
    try {
      const { data } = await getAllProfiles({
        profileIds: lodash.remove(lodash.uniq(profileIds), (value: any) => {
          return value !== "undefined";
        }),
        limit: 50,
      });
      const profiles = data?.profiles?.items as Profile[];
      if (profiles?.length > 0) {
        const sortedProfiles = profiles?.sort((a, b) => {
          let aIndex = (profileIds as any).indexOf(a.id.toString());
          let bIndex = (profileIds as any).indexOf(b.id.toString());
          return aIndex - bIndex;
        });
        setProfileLensData([...sortedProfiles]?.reverse());
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
      }
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
      if (previews?.length > 0) {
        for (const preview of previews) {
          if (preview?.message?.content) {
            newPreviewMessages?.set(preview?.key, preview?.message);
          }
        }
        setPreviewMessages(newPreviewMessages);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleKeyEnter = async (e: KeyboardEvent): Promise<void> => {
    if (e.key === "Enter" && !e.shiftKey) {
      await sendConversation();
    }
  };

  const sendConversation = async (media?: string) => {
    if (
      (!media && !message) ||
      !lensProfile?.id ||
      (!(chosenProfile as any)?.profileId && !(chosenProfile as any)?.id) ||
      !chosenProfile?.ownedBy
    ) {
      return;
    }
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
      getConversationMessages(false);
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
      const newStream = await client?.conversations?.streamAllMessages();
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
      const conversation = await client?.conversations?.newConversation(
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
      for await (const message of await conversation?.streamMessages()) {
        getAllConversations(false);
        if (message.senderAddress === client.address) {
          continue;
        }
        getConversationMessages(false);
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
      messageHTML?.substring(0, messageHTML.lastIndexOf("@")) +
      `@${user?.handle}</span>`;
    const newElementPost =
      message?.substring(0, message.lastIndexOf("@")) + `@${user?.handle}`;
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

  const checkOnNetwork = async (): Promise<boolean | undefined> => {
    try {
      const res = await Client.canMessage(chosenProfile?.ownedBy);
      if (res && chosenProfile?.ownedBy) setOnNetwork(true);
      return res && chosenProfile?.ownedBy;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleChosenProfile = (user: Profile): void => {
    dispatch(setXmtpSearch(user?.handle));
    dispatch(setChosenDMProfile(user));
    setDropdown(false);
    setConversationMessages([]);
  };

  const searchMessages = async (e: FormEvent): Promise<void> => {
    setSearchLoading(true);
    dispatch(setXmtpSearch((e.target as HTMLFormElement).value));
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
        query: xmtpSearch,
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
    if ((e as any).target.files.length < 1) {
      return;
    }
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
    dropdown,
    previewMessages,
    profileLensData,
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
    onNetwork,
    handleGif,
    handleSetGif,
    handleGifSubmit,
    results,
    handleUploadImage,
    allConversationsLoading,
    handleKeyEnter,
  };
};

export default useConversations;
