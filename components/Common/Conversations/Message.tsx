import Image from "next/legacy/image";
import { FunctionComponent, FormEvent } from "react";
import { INFURA_GATEWAY } from "../../../lib/lens/constants";
import createProfilePicture from "../../../lib/lens/helpers/createProfilePicture";
import { MessageProps } from "../../Home/Layout/Account/types/account.types";

const Message: FunctionComponent<MessageProps> = ({
  sendConversation,
  handleMessage,
  searchTarget,
  chosenProfile,
}): JSX.Element => {
  const profileImage = createProfilePicture(chosenProfile);
  return (
    <div className="relative w-full h-full grid grid-flow-row auto-rows-auto rounded-x-md bg-white/50 text-black font-dosis">
      {chosenProfile && (
        <div className="relative w-full h-fit p-2 col-start-1 self-start grid grid-flow-col auto-cols-auto bg-white/70">
          <div className="relative w-fit h-fit col-start-1 grid grid-flow-col auto-cols-auto gap-3">
            <div className="relative w-fit h-fit col-start-1 justify-self-start self-center">
              <div className="relative w-7 h-7 rounded-full border-black border flex">
                <Image
                  src={profileImage}
                  layout="fill"
                  alt="pfp"
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="relative col-start-2 place-self-center justify-self-start self-center text-md">
              @{chosenProfile?.handle}
            </div>
          </div>
        </div>
      )}
      <div className="relative w-full h-10 col-start-1 grid grid-flow-col auto-cols-auto self-end">
        <input
          className="relative bg-white grid grid-flow-col auto-cols-auto px-2 w-full h-full col-start-1 justify-self-start col-span-4 border-2 border-black"
          onChange={(e: FormEvent) => handleMessage(e)}
        />
        <div
          className="relative w-full h-full bg-black rounded-r-md grid grid-flow-col auto-cols-auto justify-self-end cursor-pointer active:scale-95"
          onClick={() => sendConversation()}
        >
          <div className="relative text-white col-start-1 place-self-center w-fit h-fit">
            Send
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
