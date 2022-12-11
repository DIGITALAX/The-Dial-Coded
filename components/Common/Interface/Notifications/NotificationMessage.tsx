import { FunctionComponent } from "react";
import { NotificationMessageProps } from "../../types/common.types";

const NotificationMessage: FunctionComponent<NotificationMessageProps> = ({
  message,
}): JSX.Element => {
  return (
    <div className="relative w-fit justify-self-start self-center h-full col-start-1"></div>
  );
};

export default NotificationMessage;
