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
import { DID } from "dids";
import { getResolver as getKeyResolver } from "key-did-resolver";
// import { getResolver as get3IDResolver } from '@ceramicnetwork/3id-did-resolver'
import { EthereumAuthProvider, ThreeIdConnect } from "@3id/connect";
import { Eip1193Bridge } from "@ethersproject/experimental";
import { Signer } from "ethers";

const useDrafts = () => {
  const { address } = useAccount();
  const [client, setClient] = useState<any>();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const ethersSigner = useSigner().data as Signer;
  const wagmiProvider = useProvider({
    chainId: 8001,
  });
  const provider = new Eip1193Bridge(ethersSigner, wagmiProvider);
  useEffect(() => {
    if (lensProfile && !client) {
      createAuthProvider();
    }
  }, [lensProfile]);

  const createAuthProvider = async () => {
    try {
      const auth = new EthereumAuthProvider(provider, address as string);
      const threeIDConnect = new ThreeIdConnect();
      await threeIDConnect.connect(auth);
      const accountId = await getAccountId(provider, address as string);
      const authProv = await EthereumWebAuth.getAuthMethod(provider, accountId);
      const session = await loadSession(authProv);
      const ceramic = new CeramicClient();
      ceramic.did = session.did;
      setClient(ceramic);
    } catch (err: any) {
      console.error(err.message, err, "HERE");
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
