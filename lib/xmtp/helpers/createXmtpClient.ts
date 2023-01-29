import { Client, Signer } from "@xmtp/xmtp-js";

const createXmtpClient = async (signer: Signer) => {
  try {
    return await Client.create(signer);
  } catch (err: any) {
    console.error(err.message);
  }
};

export default createXmtpClient;
