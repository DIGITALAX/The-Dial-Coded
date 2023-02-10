import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  shortNotifications,
  notifications,
} from "../../../../../graphql/queries/notifications";
import { setNotifications } from "../../../../../redux/reducers/notificationsSlice";
import { RootState } from "../../../../../redux/store";
import lodash from "lodash";
import {
  getNotificationLength,
  setNotificationLength,
} from "../../../../../lib/lens/utils";

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
  const [hasMoreNotifications, setHasMoreNotifications] =
    useState<boolean>(true);

  const getShortNotifications = async (): Promise<void> => {
    try {
      const results = await shortNotifications({
        profileId: lensProfileId,
        limit: 50,
        sources: "thedial",
      });
      const previousNotifications = getNotificationLength()?.notifLength;
      if (!previousNotifications) {
        if (results?.data?.result?.items?.length > 0) {
          dispatch(setNotifications(true));
        }
      } else {
        if (
          results?.data?.result?.items?.length >
          (previousNotifications as number)
        ) {
          dispatch(setNotifications(true));
        }
      }
      setNotificationLength(results?.data?.result?.items?.length);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getNotifications = async (): Promise<void> => {
    setNotificationsLoading(true);
    try {
      const results = await notifications({
        profileId: lensProfileId,
        limit: 50,
        sources: "thedial",
      });
      if (!results || results?.data?.result?.items?.length < 50) {
        setHasMoreNotifications(false);
      } else {
        setHasMoreNotifications(true);
      }
      const newData = lodash.filter(
        results?.data?.result?.items,
        (item: any) => {
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
        }
      );
      setNotificationsPage(results?.data?.result.pageInfo);
      setNotificationsList(newData);
    } catch (err: any) {
      console.error(err.message);
    }
    setNotificationsLoading(false);
  };

  const getMoreNotifications = async (): Promise<void> => {
    try {
      if (!notificationsPage?.next) {
        // fix apollo duplications on null next
        setHasMoreNotifications(false);
        return;
      }
      setHasMoreNotifications(true);
      const results = await notifications({
        profileId: lensProfileId,
        limit: 50,
        cursor: notificationsPage?.next,
        sources: "thedial",
      });
      if (results?.data?.result?.items?.length < 50) {
        setHasMoreNotifications(false);
      }
      const newData = lodash.filter(
        results?.data?.result?.items,
        (item: any) => {
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
        }
      );
      setNotificationsList([...notificationsList, ...newData]);
      setNotificationsPage(results?.data?.result.pageInfo);
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
    hasMoreNotifications,
  };
};

export default useNotifications;
