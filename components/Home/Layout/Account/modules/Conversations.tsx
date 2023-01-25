import { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import Message from "../../../../Common/Conversations/Message";
import Preview from "../../../../Common/Conversations/Preview";
import Search from "../../../../Common/Conversations/Search";
import { ConversationsProps } from "../types/account.types";

const Conversations: FunctionComponent<ConversationsProps> = ({
  createClient,
  handleUploadImage,
  searchMessages,
  clientLoading,
  searchLoading,
  profileSearch,
  searchMoreMessages,
  sendConversation,
  handleMessage,
  handleChosenProfile,
  searchTarget,
  dropdown,
  chosenProfile,
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
  client,
  onNetwork,
  handleGif,
  handleSetGif,
  handleGifSubmit,
  results,
  allConversationsLoading
}): JSX.Element => {
  if (!client) {
    return (
      <div className="relative w-full h-full grid grid-flow-col auto-cols-auto bg-white bg-opacity-30 backdrop-blur-sm rounded-md">
        <div
          className="relative w-40 h-10 px-3 py-1 grid grid-flow-col auto-cols-auto bg-offBlack text-white font-dosis rounded-md top-20 justify-self-center cursor-pointer active:scale-95"
          onClick={() => createClient()}
        >
          <div
            className={`relative w-fit h-fit text-base place-self-center ${
              clientLoading && "animate-spin"
            }`}
          >
            {clientLoading ? (
              <AiOutlineLoading size={20} color="white" />
            ) : (
              "Start messaging"
            )}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="relative w-full h-fit sm:h-full flex flex-row sm:flex-nowrap flex-wrap">
      <div className="relative w-full h-full rounded-l-md grid grid-flow-col auto-cols-auto bg-offWhite">
        <div className="relative w-full h-fit col-start-1">
          <Search
            searchMessages={searchMessages}
            searchLoading={searchLoading}
            profileSearch={profileSearch}
            searchMoreMessages={searchMoreMessages}
            handleChosenProfile={handleChosenProfile}
            searchTarget={searchTarget}
            dropdown={dropdown}
          />
          <Preview
            previewMessages={previewMessages}
            profileLensData={profileLensData}
            handleChosenProfile={handleChosenProfile}
            allConversationsLoading={allConversationsLoading}
          />
        </div>
      </div>
      <div className="relative w-full h-full">
        <Message
          sendConversation={sendConversation}
          handleMessage={handleMessage}
          chosenProfile={chosenProfile}
          conversationMessages={conversationMessages}
          message={message}
          textElement={textElement}
          messageLoading={messageLoading}
          caretCoord={caretCoord}
          handleMentionClick={handleMentionClick}
          profilesOpen={profilesOpen}
          mentionProfiles={mentionProfiles}
          handleEmoji={handleEmoji}
          openImagePicker={openImagePicker}
          setOpenImagePicker={setOpenImagePicker}
          conversationLoading={conversationLoading}
          onNetwork={onNetwork}
          handleGif={handleGif}
          handleGifSubmit={handleGifSubmit}
          results={results}
          handleSetGif={handleSetGif}
          handleUploadImage={handleUploadImage}
        />
      </div>
    </div>
  );
};

export default Conversations;
