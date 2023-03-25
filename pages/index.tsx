import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LayoutSwitch from "../components/Home/LayoutSwitch/LayoutSwitch";
import Scan from "../components/Home/Scan/Scan";
import checkDispatcher from "../lib/lens/helpers/checkDispatcher";
import { setLayout } from "../redux/reducers/layoutSlice";
import { RootState } from "../redux/store";

export interface HomeProps {
  newLink: string;
}

const Home: NextPage<HomeProps> = ({ newLink }): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );

  useEffect(() => {
    if (router?.asPath?.includes("#")) {
      dispatch(setLayout(router.asPath.split("/#")[1]));
    } else {
      router?.push("/#Post").catch((e) => {
        if (!e.cancelled) {
          throw e;
        }
      });
    }
  }, [router?.asPath]);

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      sessionStorage.clear();
    });
  }, []);

  useEffect(() => {
    checkDispatcher(dispatch, profile?.id, profile?.dispatcher?.canUseRelay);
  }, [profile?.id, profile?.dispatcher?.canUseRelay]);
  return (
    <div className="relative w-full h-full grid grid-flow-col auto-cols-auto">
      <Scan newLink={newLink} />
      <LayoutSwitch />
    </div>
  );
};

export default Home;
