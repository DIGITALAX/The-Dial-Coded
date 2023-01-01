import { FunctionComponent } from "react";
import Message from "../../../../Common/Conversations/Message";
import Preview from "../../../../Common/Conversations/Preview";
import Search from "../../../../Common/Conversations/Search";
import { ConversationsProps } from "../types/account.types";

const Conversations: FunctionComponent<ConversationsProps> = ({
  createClient,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full grid grid-flow-col auto-cols-auto">
      <div className="relative w-fit h-fit col-start-1 grid grid-flow-row auto-rows-auto">
        <Search />
        <Preview />
      </div>
      <div className="relative w-full h-fit col-start-2">
        <Message />
      </div>
    </div>
  );
};

export default Conversations;
