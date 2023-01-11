import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { setXmtpClient } from "../../../../../redux/reducers/xmtpClientSlice";
import { Client } from "@xmtp/xmtp-js";
import { Signer } from "ethers";
import { useSigner } from "wagmi";
import buildConversationId from "../../../../../lib/xmtp/helpers/buildConversationId";
import { Draft, UseDraftsResult } from "./../types/canvas.types";
import compressImageFiles from "../../../../../lib/misc/helpers/compressImageFiles";
import { setDraftTitle } from "../../../../../redux/reducers/draftTitleSlice";
import { setDraftElements } from "../../../../../redux/reducers/draftElementsSlice";

const useDrafts = (): UseDraftsResult => {
  const dispatch = useDispatch();
  const { data: signer } = useSigner();
  const client = useSelector(
    (state: RootState) => state.app.xmtpClientReducer.value
  );
  const modal = useSelector(
    (state: RootState) => state.app.insufficientFundsReducer
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const title = useSelector(
    (state: RootState) => state.app.draftTitleReducer.value
  );
  const elements = useSelector(
    (state: RootState) => state.app.draftElementsReducer.value
  );
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [draftCanvases, setDraftCanvases] = useState<Draft[]>([]);
  const [currentDraft, setCurrentDraft] = useState<Draft>();

  const createXmtpClient = async () => {
    try {
      const xmtp = await Client.create(signer as Signer | null);
      dispatch(setXmtpClient(xmtp));
      await getDrafts(xmtp);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const saveCanvasNetwork = async (file: File, elements: string[]) => {
    try {
      if (!client) await createXmtpClient();
      await saveDraft(file, elements);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getDrafts = async (clientInput?: any) => {
    try {
      const conversationList = await (clientInput
        ? clientInput
        : client
      ).conversations.list();
      const personalConversations = conversationList.filter(
        (conversation: any) => {
          if (
            conversation.context?.conversationId.startsWith("lens.dev/dm/") &&
            conversation.peerAddress === lensProfile?.ownedBy
          ) {
            return true;
          }
        }
      );
      let previousDrafts: Draft[] = [];
      // change this back to 0
      const allPersonal = await personalConversations[1].messages();
      for (const drafts of allPersonal) {
        if (drafts.content.includes("*/dialDraftsCanvas/*")) {
          previousDrafts.push(JSON.parse(drafts.content));
        }
      }
      setDraftCanvases(previousDrafts.reverse());
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const saveDraft = async (file: File, elements: string[]) => {
    setSaveLoading(true);
    try {
      const coverImage = await handleUploadImage(file);
      const conversation = await client.conversations.newConversation(
        lensProfile?.ownedBy,
        {
          conversationId: buildConversationId(lensProfile?.id, lensProfile?.id),
          metadata: {},
        }
      );
      await conversation.send(
        JSON.stringify({
          title: title,
          elements: JSON.stringify(elements),
          image: coverImage,
          tags: ["*/dialDraftsCanvas/*"],
          date: Date.now(),
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setSaveLoading(false);
  };

  const handleUploadImage = async (e: any): Promise<string | void> => {
    try {
      const compressedImage = await compressImageFiles(e, true);
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: compressedImage as any,
      });
      let { cid } = await response.json();
      return "ipfs://" + cid;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleShowDraft = (draft: Draft) => {
    setCurrentDraft(draft);
    dispatch(setDraftTitle(draft.title));
    const allElementsParsed = JSON.parse(draft.elements);
    let parsedElems = [];
    for (const elem in allElementsParsed) {
      parsedElems.push(JSON.parse(allElementsParsed[elem as any]));
    }
    dispatch(setDraftElements(parsedElems));
  };

  useEffect(() => {
    if (modal.value === "saved" || modal.value === "unsaved") {
      getDrafts();
    }
  }, [modal.value]);

  useEffect(() => {
    if (client) {
      getDrafts();
    }
  }, [saveLoading]);

  return { saveCanvasNetwork, draftCanvases, handleShowDraft };
};

export default useDrafts;
