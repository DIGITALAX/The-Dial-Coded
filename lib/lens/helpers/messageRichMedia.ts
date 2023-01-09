import { INFURA_GATEWAY } from "../constants";
import descriptionRegex from "./descriptionRegex";

const messageRichMedia = (
  convo: any
): {
  src: string;
  type: string;
} => {
  let ipfsRegex = /ipfs:\/\//;
  let gifRegex = /https:\/\/media\.tenor\.com/;
  let value: {
    src: string;
    type: string;
  };
  if (ipfsRegex.test(convo)) {
    value = {
      src: `${INFURA_GATEWAY}/ipfs/${convo.split("://")[1]}`,
      type: "image",
    };
  } else if (gifRegex.test(convo)) {
    value = {
      src: convo,
      type: "gif",
    };
  } else {
    value = {
      src: descriptionRegex(convo, true),
      type: "html",
    };
  }

  return value;
};

export default messageRichMedia;
