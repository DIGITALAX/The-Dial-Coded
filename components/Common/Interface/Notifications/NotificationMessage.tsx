import { FunctionComponent } from "react";
import { NotificationMessageProps } from "../../types/common.types";

const NotificationMessage: FunctionComponent<NotificationMessageProps> = ({
  message,
}): JSX.Element => {
  return (
    <div className="relative w-fit justify-self-start self-center h-full col-start-1 grid grid-flow-col auto-cols-auto">
      <div
        className="relative w-80 h-full col-start-1 grid grid-flow-col auto-cols-auto self-center bg-gradient-to-r from-black via-gray-600 to-black rounded-lg"
      >
        <div className="relative w-full p-2 h-fit col-start-1 grid grid-flow-row auto-rows-auto place-self-center gap-3">
          <div className="relative w-fit h-fit row-start-1 place-self-center font-digiB text-3xl text-dialY">
            {message?.title}
          </div>
          <div className="relative w-fit h-fit row-start-2 place-self-center text-lg font-digiR text-dialG text-center">
            {message?.paragraph}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationMessage;
