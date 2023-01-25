import { FunctionComponent } from "react";
import { NotificationBarProps } from "../../types/common.types";
import NotificationMessage from "./NotificationMessage";
import NotificationSlider from "./NotificationSlider";

const NotificationsBar: FunctionComponent<NotificationBarProps> = ({
  images,
  message,
}): JSX.Element => {
  return (
    <div className="relative w-full h-60 bg-comp border-t-4 border-white flex flex-row p-6 gap-4">
      {message && <NotificationMessage message={message} />}
      <NotificationSlider images={images} />
    </div>
  );
};

export default NotificationsBar;
