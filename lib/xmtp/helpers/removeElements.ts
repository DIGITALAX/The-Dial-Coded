import { DecodedMessage } from "@xmtp/xmtp-js";

export const elementRegex =
/^(?=.*(?:\*\/dialDraftsCanvas\/\*|\*\/draftsCanvas\/\*))(?=.*element)(?=.*title)(?=.*tags).*$/;

const removeElements = (list: Map<string, DecodedMessage>): any => {
  const newList = Array.from(list.values()).filter((value) => {
    if (elementRegex.test(value.content)) {
      return false;
    } else {
      return true;
    }
  });

  return newList;
};

export default removeElements;
