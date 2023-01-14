import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { useAccount } from "wagmi";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { Draft, UseDraftsResult } from "./../types/canvas.types";
import compressImageFiles from "../../../../../lib/misc/helpers/compressImageFiles";
import { setDraftTitle } from "../../../../../redux/reducers/draftTitleSlice";
import { setDraftElements } from "../../../../../redux/reducers/draftElementsSlice";
import { DIDSession } from "did-session";
import type { AuthMethod } from "@didtools/cacao";
import {
  getCeramicSession,
  setCeramicSession,
} from "../../../../../lib/lens/utils";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";
import { DataModel } from "@glazed/datamodel";
import { DIDDataStore } from "@glazed/did-datastore";

const useDrafts = (): UseDraftsResult => {
  const dispatch = useDispatch();
  const { address } = useAccount();
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
  const [client, setClient] = useState<any>();
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [draftCanvases, setDraftCanvases] = useState<Draft[]>([]);
  const [draftsLoading, setDraftsLoading] = useState<boolean>(false);

  console.log(draftCanvases, "draft canvases");

  const createAuthProvider = async () => {
    setDraftsLoading(true);
    try {
      const accountId = await getAccountId(window.ethereum, address as string);
      const authMethod = await EthereumWebAuth.getAuthMethod(
        window.ethereum,
        accountId
      );

      const session = await loadSession(authMethod);
      const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");
      ceramic.did = session.did;
      setClient(ceramic);
      await getCanvases(ceramic);
    } catch (err: any) {
      console.error(err.message);
    }
    setDraftsLoading(false);
  };

  console.log("client", client);

  const getCanvases = async (clientInput?: any) => {
    const publishedModel = {
      schemas: {
        draftCanvas:
          "ceramic://k3y52l7qbv1fryf5ka6rpi4sk3ty7gdzey2nky5t0xq2miaufudgbqkcbkr74cp34",
      },
      definitions: {
        DraftCanvas:
          "kjzl6cwe1jw14856m0jxqhw9m2v1j9n586xrxyrje3sb5ck27y3m8er1i8qfisw",
      },
      tiles: {},
    };
    const dataStore = new DIDDataStore({
      ceramic: clientInput ? clientInput : client,
      model: publishedModel,
    });
    const get = await dataStore.get("DraftCanvas");
    setDraftCanvases([get]);
  };

  const loadSession = async (authProv: AuthMethod): Promise<DIDSession> => {
    const sessionStr = getCeramicSession();
    let session: any;

    if (sessionStr) {
      session = await DIDSession.fromSession(sessionStr);
    }

    if (!session || (session.hasSession && session.isExpired)) {
      session = await DIDSession.authorize(authProv, {
        resources: [`ceramic://*`],
      });
      setCeramicSession(session);
    }

    return session;
  };

  const saveCanvasNetwork = async (file: File, elements: string[]) => {
    try {
      if (!client) await createAuthProvider();

      await saveDraft(file, elements);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const saveDraft = async (file: File, elements: string[]) => {
    setSaveLoading(true);
    try {
      const coverImage = await handleUploadImage(file);

      const draft = {
        title: title,
        elements: JSON.stringify(elements),
        image: coverImage,
        tags: "*/dialDraftsCanvas/*",
        date: Date.now().toString(),
      };
      const publishedModel = {
        schemas: {
          draftCanvas:
            "ceramic://k3y52l7qbv1fryf5ka6rpi4sk3ty7gdzey2nky5t0xq2miaufudgbqkcbkr74cp34",
        },
        definitions: {
          DraftCanvas:
            "kjzl6cwe1jw14856m0jxqhw9m2v1j9n586xrxyrje3sb5ck27y3m8er1i8qfisw",
        },
        tiles: {},
      };
      let session = getCeramicSession() as any;
      session = await DIDSession.fromSession(session);
      const cer = client;
      cer.did = session.did;
      const dataStore = new DIDDataStore({
        ceramic: cer,
        model: publishedModel,
      });

      const res = await dataStore.set("DraftCanvas", draft);

      console.log(res, "res");
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
      getCanvases();
    }
  }, [modal.value]);

  useEffect(() => {
    if (client) {
      getCanvases();
    }
  }, [saveLoading]);

  return {
    saveCanvasNetwork,
    draftCanvases,
    handleShowDraft,
    draftsLoading,
    createAuthProvider,
    client,
  };
};

export default useDrafts;
