import { CeramicClient } from "@ceramicnetwork/http-client";
import { useProvider, useAccount, useSigner } from "wagmi";
import { useEffect, useState } from "react";
import { DIDSession } from "did-session";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";
import type { AuthMethod } from "@didtools/cacao";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import {
  getCeramicSession,
  setCeramicSession,
} from "../../../../../lib/lens/utils";

const useDrafts = () => {
  const { address } = useAccount();
  const [client, setClient] = useState<any>();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );

  useEffect(() => {
    if (lensProfile && !client) {
      createAuthProvider();
    }
  }, [lensProfile]);

  const createAuthProvider = async () => {
    try {
      const accountId = await getAccountId(window.ethereum, address as string);
      const authMethod = await EthereumWebAuth.getAuthMethod(
        window.ethereum,
        accountId
      );

      const session = await loadSession(authMethod);
      const ceramic = new CeramicClient();
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

  const saveCanvasCeramic = async (elements: string, title: string) => {
    try {
      if (!client) await createAuthProvider();
    } catch (err: any) {
      console.error(err.message);
    }
  };

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
