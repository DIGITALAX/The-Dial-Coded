import { FunctionComponent } from "react";

const IndexingModal: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto bottom-10 bg-gradient-to-r from-white to-offBlue rounded-lg p-2 sticky font-dosis text-offBlack gap-3 border-2 border-offBlack z-50">
      <div className="relative w-fit hit col-start-1 place-self-center"></div>
      <div className="relative w-fit h-fit col-start-2 place-self-center">
        Interaction Indexing
      </div>
    </div>
  );
};

export default IndexingModal;
