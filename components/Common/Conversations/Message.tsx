import Image from "next/legacy/image";
import { FunctionComponent, FormEvent } from "react";
import { useSelector } from "react-redux";
import createProfilePicture from "../../../lib/lens/helpers/createProfilePicture";
import descriptionRegex from "../../../lib/lens/helpers/descriptionRegex";
import syncScroll from "../../../lib/lens/helpers/syncScroll";
import { RootState } from "../../../redux/store";
import { MessageProps } from "../../Home/Layout/Account/types/account.types";

const Message: FunctionComponent<MessageProps> = ({
  sendConversation,
  handleMessage,
  chosenProfile,
  conversationMessages,
  message,
  textElement,
  messageLoading,
  caretCoord,
  mentionProfiles,
  handleMentionClick,
  profilesOpen,
}): JSX.Element => {
  const profileImage = createProfilePicture(chosenProfile);
  const lensProfileAddress = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.ownedBy
  );
  return (
    <div className="relative w-full h-full flex flex-col rounded-x-md bg-white/50 text-black font-dosis">
      <div className="relative w-full h-12 p-2 col-start-1 self-start grid grid-flow-col auto-cols-auto bg-white/70">
        {chosenProfile && (
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
            <div className="relative col-start-2 place-self-center justify-self-start self-center text-base">
              @{chosenProfile?.handle}
            </div>
          </div>
        )}
      </div>
      {conversationMessages && (
        <div className="relative h-full w-full grid grid-flow-col auto-cols-auto pb-4 px-3">
          <div
            className={`relative w-full h-fit self-end col-start-1 text-right gap-2 grid grid-flow-row auto-rows-auto`}
          >
            {Array.from(conversationMessages.values())?.map(
              (convo: any, index: number) => {
                return (
                  <div
                    key={index}
                    className={`relative w-fit py-1 px-3 rounded-full text-base ${
                      convo?.senderAddress === lensProfileAddress
                        ? "justify-self-end bg-offBlue text-white"
                        : "justify-self-start bg-white text-black"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: descriptionRegex(convo?.content),
                    }}
                  ></div>
                );
              }
            )}
          </div>
        </div>
      )}
      <div className="relative w-full h-10 col-start-1 grid grid-flow-col auto-cols-auto self-end">
        <div className="relative w-full h-full grid grid-flow-col auto-cols-auto">
          <textarea
            id="message"
            onScroll={(e: any) => syncScroll(e, "highlighted-message")}
            onInput={(e: FormEvent) => {
              handleMessage(e);
              syncScroll(e, "highlighted-message");
            }}
            style={{ resize: "none" }}
            ref={textElement}
            value={message}
            className="relative bg-white grid grid-flow-col auto-cols-auto px-2 py-1 w-full h-10 col-start-1 justify-self-start col-span-4 border-2 border-black z-1 text-black"
            disabled={messageLoading ? true : false}
          ></textarea>
          <pre
            id="highlighting-message"
            className={`absolute bg-white grid grid-flow-col auto-cols-auto px-2 py-1 w-full h-10 col-start-1 justify-self-start col-span-4 border-2 border-black z-0 text-black`}
          >
            <code
              id="highlighted-message"
              className={`w-full h-full place-self-center text-left whitespace-pre-wrap overflow-y-scroll`}
            >
              Have something to share...
            </code>
          </pre>
          {mentionProfiles?.length > 0 && profilesOpen && (
            <div
              className={`absolute w-52 max-w-52 max-h-28 h-fit grid grid-flow-row auto-rows-auto overflow-y-scroll z-2`}
              style={{
                top: caretCoord.y + 30,
                left: caretCoord.x,
              }}
            >
              {mentionProfiles?.map((user: any, index: number) => {
                const profileImage: string = createProfilePicture(
                  user?.picture
                );
                return (
                  <div
                    key={index}
                    className={`relative w-full h-fit px-3 py-2 bg-white col-start-1 grid grid-flow-col auto-cols-auto gap-3 cursor-pointer border-y border-black hover:bg-offBlue z-2`}
                    onClick={() => {
                      handleMentionClick(user);
                    }}
                  >
                    <div className="relative w-fit h-fit col-start-1 text-black font-dosis lowercase place-self-center grid grid-flow-col auto-cols-auto gap-2">
                      <div
                        className={`relative rounded-full flex bg-white w-3 h-3 place-self-center col-start-1`}
                        id="crt"
                      >
                        {profileImage !== "" && (
                          <Image
                            src={profileImage}
                            objectFit="cover"
                            alt="pfp"
                            layout="fill"
                            className="relative w-fit h-fit rounded-full self-center"
                          />
                        )}
                      </div>
                      <div className="relative col-start-2 place-self-center w-fit h-fit text-xs">
                        @{user?.handle}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
