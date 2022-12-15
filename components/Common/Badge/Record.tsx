import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../lib/lens/constants";
import { RecordProps } from "../types/common.types";

const Record: FunctionComponent<RecordProps> = ({index, recordImage}): JSX.Element => {
    return (
        <div className="relative w-20 h-20 rounded-lg border-2 border-offBlack grid grid-flow-col auto-cols-auto bg-offBlue"
        key={index}>
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${recordImage}`}
            layout="fill"
            objectFit="cover"
          />
          <div
            className="relative w-full h-full col-start-1 grid grid-flow-col auto-cols-auto rounded-md p-1"
          >
            <div className="relative col-start-1 place-self-end rounded-full w-3 h-3 grid grid-flow-col auto-cols-auto rounded-full border-2 border-offBlack p-px hover:scale-110 cursor-pointer">
            <Image
                src={`${INFURA_GATEWAY}/ipfs/QmQZ8UwjeizDQkbCiZED8Ya4LxpFD5JbVbNeAdowurHkiY`}
                layout="fill"
                objectFit="cover"
                className="hover:rotate-12"
              />
            </div>
          </div>
        </div>
    )
}

export default Record