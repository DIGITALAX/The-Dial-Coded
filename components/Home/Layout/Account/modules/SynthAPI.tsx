import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/lens/constants";
import { getReplicateKey } from "../../../../../lib/replicate/utils";
import { SynthAPIProps } from "../types/account.types";

const SynthAPI: FunctionComponent<SynthAPIProps> = ({
  handleKeyAdd,
  setKeyStorage,
  keyValue,
  setKeyValue,
  decryptedKey,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-row flex-wrap gap-6 border-2 border-black bg-white">
      <div className="relative w-full h-[40rem]">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmXtvCVbZXdcvbEBN4MCP2MXLV8edZPPXeLXUuBqzYceMJ`}
          layout="fill"
          className="flex w-full h-full"
          objectFit="cover"
        />
      </div>
      <div className="relative w-full h-full grid grid-flow-col auto-cols-auto">
        <div className="relative w-fit h-fit place-self-center grid grid-flow-col auto-cols-auto gap-2">
          <div
            className="relative w-fit h-fit place-self-center col-start-1 row-start-1 text-base f2:text-xl f10:text-3xl f9:text-5xl drop-shadow-lg font-jose"
            id="username"
          >
            STABLE DIFFUSION ACTIVATION
          </div>
          <div
            className="relative w-24 h-fit place-self-center flex flex-col rounded-sm p-px gap-px f10:col-start-2 f10:row-start-1 row-start-2 col-start-1"
            id="api"
          >
            <div className="relative w-full h-10 bg-white">
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmauuTeAdCT7pPJKR1FBSkNvJkz57Dc8RpQ5iwgRU5WXYo`}
                layout="fill"
                className="flex w-full h-full"
              />
            </div>
            <div className="relative w-full h-full bg-white text-sm grid grid-flow-col auto-cols-auto">
              <div
                className="relative w-fit hit place-self-center font-sats"
                id="username"
              >
                SYNTH API
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full h-full grid grid-flow-col auto-cols-auto">
        <div className="relative w-6 f2:w-10 h-full">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmPLm9SZAtfZ9oibaPgRWPDPwkovQ7mS56bAH712mtawAU`}
            layout="fill"
            className="flex"
          />
        </div>
        <div className="relative w-5/6 h-full grid grid-flow-row auto-rows-auto place-self-center gap-4 pb-2">
          <div className="relative w-full h-full font-sats text-deep break-word text-sm f10:text-lg place-self-center">
            The DIAL operates a HUMAN IN THE LOOP + AI paradigm. You must
            complete the circuit to activate STABLE DIFFUSION.
            <br />
            <br />
            1) CREATE a{" "}
            <a
              className="underline"
              href="https://replicate.com/"
              target={"_blank"}
              rel="noreferrer"
            >
              REPLICATE
            </a>{" "}
            account
            <br />
            <br />
            2) CONFIRM all required information in order to receive your API key
            <br />
            <br />
            3) COPY your API key and ENTER below:
          </div>
          <div
            className="relative h-10 rounded-md w-full border-2 border-deep"
            onClick={() => setKeyValue(!keyValue)}
          >
            <input
              onChange={(e) => handleKeyAdd(e)}
              type={keyValue ? "password" : "text"}
              defaultValue={decryptedKey ? decryptedKey : ""}
              className="h-full w-full rounded-md font-sats p-1"
            />
          </div>
          <div
            className="relative w-full rounded-md h-8 f10:h-14 cursor-pointer active:scale-95 grid grid-flow-col auto-cols-auto"
            id="set"
            onClick={() => setKeyStorage()}
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmTLN24oXMbEj3QgHX7dD3GWnYwL2GqsP16yvLzm29bk5X`}
              objectFit="cover"
              layout="fill"
              className="absolute rounded-md flex"
              draggable={false}
            />
            <div className="relative w-fit h-fit place-self-center text-white font-earl text-xl f10:text-4xl">
              ALL SET!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SynthAPI;
