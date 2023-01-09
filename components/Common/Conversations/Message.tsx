import Image from "next/legacy/image";
import { FunctionComponent, FormEvent } from "react";
import { useSelector } from "react-redux";
import createProfilePicture from "../../../lib/lens/helpers/createProfilePicture";
import descriptionRegex from "../../../lib/lens/helpers/descriptionRegex";
import syncScroll from "../../../lib/lens/helpers/syncScroll";
import { RootState } from "../../../redux/store";
import { MessageProps } from "../../Home/Layout/Account/types/account.types";
import { TbSend } from "react-icons/tb";
import { BsFillEmojiLaughingFill } from "react-icons/bs";
import { AiOutlineLoading } from "react-icons/ai";
import Emoji from "emoji-picker-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from "next/router";

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
  handleEmoji,
  openImagePicker,
  setOpenImagePicker,
  conversationLoading,
  onNetwork,
}): JSX.Element => {
  const profileImage = createProfilePicture(chosenProfile);
  const lensProfileAddress = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.ownedBy
  );
  console.log(onNetwork)
  const router = useRouter();
  const tags = document.querySelectorAll("em");
  if (tags.length > 0) {
    for (let i = 0; i < tags.length; i++) {
      tags[i].addEventListener("click", (e) => {
        router
          ?.push(
            `/?search=${(e.target as any)?.innerText.replaceAll(
              "#",
              ""
            )}/#Slider`
          )
          .catch((e) => {
            if (!e.cancelled) {
              throw e;
            }
          });
      });
    }
  }
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
      {conversationMessages && !conversationLoading ? (
        <div
          className="relative h-full w-full grid grid-flow-col auto-cols-auto pb-4 px-3"
          id="scrollableDiv"
        >
          <InfiniteScroll
            className={`relative w-full h-full self-end col-start-1 text-right gap-2 grid grid-flow-row auto-rows-auto`}
            hasMore={true}
            height={"42rem"}
            loader={""}
            style={{ display: "flex", flexDirection: "column-reverse" }}
            inverse={true}
            scrollableTarget="scrollableDiv"
            dataLength={conversationMessages?.length}
            next={() => {}}
          >
            {Array.from(conversationMessages.values())
              ?.reverse()
              ?.map((convo: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative w-full h-fit grid grid-flow-col auto-cols-auto"
                  >
                    <div
                      className={`relative w-fit col-start-1 py-1 px-3 rounded-full text-base ${
                        convo?.senderAddress === lensProfileAddress
                          ? "justify-self-end bg-offBlue text-white"
                          : "justify-self-start bg-white text-black"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: descriptionRegex(convo?.content, true),
                      }}
                    ></div>
                  </div>
                );
              })}
          </InfiniteScroll>
        </div>
      ) : (
        conversationLoading && (
          <div className="relative grid grid-flow-col auto-cols-auto w-full h-full">
            <div className="relative w-fit h-fit col-start-1 place-self-center animate-spin">
              <AiOutlineLoading color="black" size={20} />
            </div>
          </div>
        )
      )}
      {openImagePicker !== "" && (
        <div className="absolute w-full h-full grid grid-flow-col auto-cols-auto pb-10">
          <div className="relative w-fit h-fit self-end col-start-1 justify-self-center">
            <Emoji onEmojiClick={handleEmoji} />
          </div>
        </div>
      )}
      {/* {openImagePicker !== "" && (
          <ImagePicker
            imagePicker={openImagePicker as string}
            handleEmoji={handleEmoji}
            handleGif={() => {}}
            handleGifSubmit={async () => {}}
            results={[]}
            searchGif={""}
            handleSetGif={() => {}}
          />
        )} */}
      <div className="relative w-full h-10 col-start-1 flex flex-row self-end">
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
            disabled={messageLoading || !onNetwork ? true : false}
          ></textarea>
          <pre
            id="highlighting-message"
            className={`absolute bg-white grid grid-flow-col auto-cols-auto px-2 py-1 w-full h-10 col-start-1 justify-self-start col-span-4 border-2 border-black z-0 text-black`}
          >
            <code
              id="highlighted-message"
              className={`w-full h-full place-self-center text-left whitespace-pre-wrap overflow-y-scroll`}
            >
              Send a message...
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
          className={`relative w-28 h-full rounded-r-md grid grid-flow-col auto-cols-auto justify-self-end ${
            !onNetwork ? "bg-black/70" : "bg-black"
          }`}
        >
          {!messageLoading ? (
            <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto place-self-center gap-4">
              <div
                className={`relative text-white col-start-1 place-self-center w-fit h-fit ${
                  onNetwork && "cursor-pointer active:scale-95"
                }`}
                onClick={onNetwork ? () => sendConversation() : () => {}}
              >
                <TbSend size={15} />
              </div>
              <div
                className={`relative text-white col-start-2 place-self-center w-fit h-fit ${
                  onNetwork && "cursor-pointer active:scale-95"
                }`}
                onClick={() =>
                  onNetwork
                    ? setOpenImagePicker(
                        openImagePicker === "emoji" ? "" : "emoji"
                      )
                    : {}
                }
              >
                <BsFillEmojiLaughingFill size={15} />
              </div>
            </div>
          ) : (
            <div className="relative w-fit h-fit place-self-center animate-spin">
              <AiOutlineLoading color="white" size={10} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
