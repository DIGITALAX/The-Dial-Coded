import { FunctionComponent } from "react";
import useMain from "./hooks/useMain";
import Hot from "./modules/Hot";
import Main from "./modules/Main";

const Feed: FunctionComponent = (): JSX.Element => {
  const {images} = useMain();
  return (
    <div className="relative row-start-3 w-full h-full grid grid-flow-col auto-cols-auto gap-6">
      <Main images={images} />
      <Hot />
    </div>
  );
};

export default Feed;
