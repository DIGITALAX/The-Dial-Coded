import { CeramicClient } from "@ceramicnetwork/http-client";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { DIDSession } from "did-session";
import type { AuthMethod } from "@didtools/cacao";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import {
  getCeramicSession,
  setCeramicSession,
} from "../../../../../lib/lens/utils";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";

const useDrafts = () => {
  const { address } = useAccount();
  const [client, setClient] = useState<any>();
  const [draftCanvases, setDraftCanvases] = useState<any[]>([]);
  const [draftSchema, setDraftSchema] = useState<any[]>([]);
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );

  const createAuthProvider = async () => {
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
    } catch (err: any) {
      console.error(err.message);
    }
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

  const createDocument = async () => {};

  const saveCanvasCeramic = async (elements: string, title: string) => {
    console.log({
      title: title,
      elements: elements,
      date: Date.now(),
    });
    try {
      if (!client) await createAuthProvider();
      console.log(client);

      const doc = await TileDocument.deterministic(client, {
        controllers: [client.did.id],
        family: "Drafts",
        tags: ["dial", "canvas"],
      });
      console.log(doc.metadata);
      await doc.update({
        title: title,
        elements: elements,
        date: Date.now(),
      });

      console.log(doc.content, "adter")

      if (doc) {
        setDraftCanvases([...draftCanvases, doc.id]);
        console.log(doc.id);
        const get = await TileDocument.load(client, doc.id);
        console.log(get.content);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  console.log(client?.did?.id)

  const viewPreviousDrafts = async () => {
    console.log("inside")
    const load = await TileDocument.deterministic(client, {
      controllers: [client.did.id],
      family: "Drafts",
      // tags: ["dial", "canvas"],
    });
    console.log(load.content);
    console.log(load)
  };

  useEffect(() => {
    if (client) {
      viewPreviousDrafts();
    }
  }, [draftCanvases]);

  const handleGetSavedCanvasDrawings = () => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleShowSavedCanvas = () => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return { saveCanvasCeramic };
};

export default useDrafts;
