import { FunctionComponent } from "react";
import CanvasOption from "../../../../Common/Miscellaneous/CanvasOption";

const Publish: FunctionComponent  = (): JSX.Element => {
    return (
        <div className="absolute justify-self-start self-start w-fit h-fit grid grid-flow-row auto-rows-auto gap-2 p-3 z-10">
            <div className="relative row-start-1 w-fit h-fit">
                <CanvasOption  bgColor="black"
              image="QmQSKG8kDsX1pkXysx1sMcFiX6hJjy6ytu5tEeiPoiLUq4"
              width={20}
              height={20} />
            </div>
            <div className="relative row-start-2 w-fit h-fit">
            <CanvasOption  bgColor="black"
              image="QmUBtNtbovXo6iXuRofDyg1JvzHND8YwvVr2x9TvyjPv82"
              width={20}
              height={20} />
            </div>
        </div>
    )
}

export default Publish