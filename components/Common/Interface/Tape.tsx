import { FunctionComponent } from "react";
import { TapeProps } from "../types/common.types";

const Tape: FunctionComponent<TapeProps> = ({height, width, bgColor, sideImage, title}): JSX.Element => {
    return (
        <div className={`relative w-${width} h-${height} bg-${bgColor}`}>
            {title}
        </div>
    )
}

export default Tape;