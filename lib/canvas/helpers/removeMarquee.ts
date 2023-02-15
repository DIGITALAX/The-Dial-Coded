import getCanvas from "./getCanvas";

import lodash from "lodash";
import { ElementInterface } from "../../../components/Home/Layout/Canvas/types/canvas.types";

const removeMarquee = (elements: any): ElementInterface[] => {
  const filteredMarqueeElements = lodash.filter(
    elements,
    (element) => element.type !== "marquee"
  );
  return filteredMarqueeElements;
};

export default removeMarquee;
