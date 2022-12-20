import type { NextApiResponse } from "next";
import nextConnect from "next-connect";
import { create } from "ipfs-http-client";

const handler = nextConnect();

type Data = {
  cid: string | undefined;
};

const projectId = process.env.INFURA_PROJECT_ID;
const projectSecret = process.env.INFURA_SECRET_KEY;

const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

handler.post(async (req: any, res: NextApiResponse<Data>) => {
  try {
    const cid = await uploadToIPFS(req);
    return res.status(200).json({ cid: cid });
  } catch (err: any) {
    console.error(err.message);
  }
});

const uploadToIPFS = async (file: any) => {
  const client = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
      authorization: auth,
    },
  });
  try {
    const added = await client.add(file);
    const cid = added.path;
    return cid;
  } catch (err: any) {
    console.error(err.message);
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
