import type { NextApiResponse } from "next";
import nextConnect from "next-connect";
import { GiphyFetch } from "@giphy/js-fetch-api";

const handler = nextConnect();

const key = process.env.GIPHY_API as string;

handler.post(async (req: any, res: NextApiResponse<any>) => {
  const giphy = await createGiphy();
  console.log("hi")
  console.log(giphy)
  console.log(req)
  try {
    const results = await giphy.gifs(req);
    console.log(results?.data)
    return res.status(200).json({ results });
  } catch (err: any) {
    console.log(err.message);
  }
});

const createGiphy = async () => {
  return new GiphyFetch(key);
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
