import { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import FetchMoreLoading from "../../../../Common/Loaders/FetchMoreLoading";
import NotificationBanner from "../../../../Common/Notifications/NotificationBanner";
import { NotificationsProps } from "../types/account.types";

const Notifications: FunctionComponent<NotificationsProps> = ({
  getMoreNotifications,
  notificationsList,
  notificationsLoading,
}): JSX.Element => {
  return (
    <div className={`relative w-full h-full grid grid-flow-row auto-rows-auto`}>
      {notificationsLoading ? (
        <div className="relative w-full h-fit row-start-2 grid grid-flow-row auto-rows-auto self-start justify-self-center">
          <div className="relative w-fit h-fit place-self-center row-start-1 animate-spin">
            <AiOutlineLoading size={25} color="black" />
          </div>
        </div>
      ) : notificationsList?.length > 0 ? (
        <div
          className="relative w-full h-full row-start-2 grid grid-flow-row auto-rows-auto gap-5"
          id="targetDiv"
        >
          <InfiniteScroll
            scrollableTarget={"targetDiv"}
            height={"44rem"}
            loader={<FetchMoreLoading />}
            hasMore={true}
            next={getMoreNotifications}
            dataLength={notificationsList?.length}
            className={`relative row-start-1 w-full h-full overflow-y-scroll grid grid-flow-row auto-rows-auto gap-3`}
            style={{ color: "#131313", fontFamily: "Digi Reg" }}
          >
            {notificationsList?.map((notification: any, index: number) => {
              return (
                <NotificationBanner key={index} notification={notification} />
              );
            })}
          </InfiniteScroll>
        </div>
      ) : (
        <div className="relative w-fit h-fit place-self-start text-center text-offBlack font-dosis text-lg pt-10 pl-5">No notifications yet...</div>
      )}
    </div>
  );
};

export default Notifications;
