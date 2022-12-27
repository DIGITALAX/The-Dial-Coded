import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  shortNotifications,
  notifications,
} from "../../../../../graphql/queries/notifications";
import { setNotifications } from "../../../../../redux/reducers/notificationsSlice";
import { RootState } from "../../../../../redux/store";
import lodash from "lodash";

const useNotifications = () => {
  const dispatch = useDispatch();
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [notificationsLoading, setNotificationsLoading] =
    useState<boolean>(false);
  const [notificationsPage, setNotificationsPage] = useState<any>();
  const lensProfileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const accountTab = useSelector(
    (state: RootState) => state.app.accountPageReducer.value
  );

  const getShortNotifications = async (): Promise<void> => {
    try {
      const { data } = await shortNotifications({
        profileId: lensProfileId,
        limit: 50,
      });
      if (data?.result?.items?.length > 0) {
        dispatch(setNotifications(true));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getNotifications = async (): Promise<void> => {
    setNotificationsLoading(true);
    try {
      const { data } = await notifications({
        profileId: lensProfileId,
        limit: 50,
      });
      const newData = lodash.filter(data?.result?.items, (item: any) => {
        if (item?.__typename === "NewReactionNotification") {
          if (item?.reaction !== "DOWNVOTE") {
            return true;
          }
        } else if (
          item?.__typename === "NewCollectNotification" &&
          item?.collectedPublication?.collectedBy !== null
        ) {
          return true;
        } else {
          return true;
        }
      });
      console.log(newData);
      setNotificationsPage(data?.result.pageInfo);
      setNotificationsList(newData);
    } catch (err: any) {
      console.error(err.message);
    }
    setNotificationsLoading(false);
  };

  const getMoreNotifications = async (): Promise<void> => {
    try {
      const { data } = await notifications({
        profileId: lensProfileId,
        limit: 50,
        cursor: notificationsPage?.next,
      });
      const newData = lodash.filter(data?.result?.items, (item: any) => {
        if (item?.__typename === "NewReactionNotification") {
          if (item?.reaction !== "DOWNVOTE") {
            return true;
          }
        } else if (
          item?.__typename === "NewCollectNotification" &&
          item?.collectedPublication?.collectedBy !== null
        ) {
          return true;
        } else if (item?.__typename === "NewFollowerNotification") {
          return true;
        }
      });
      setNotificationsList([...notificationsList, ...newData]);
      setNotificationsPage(data?.result.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (lensProfileId && accountTab === "notifications") {
      getNotifications();
    }
  }, [lensProfileId, accountTab]);

  return {
    getMoreNotifications,
    getShortNotifications,
    notificationsList,
    notificationsLoading,
  };
};

export default useNotifications;
