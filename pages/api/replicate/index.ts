import nextConnect from "next-connect";
const bodyParser = require("body-parser");
import Replicate from "replicate-js";

const handler = nextConnect();

handler.use((req: any, res: any, next) => {
  bodyParser();
  next();
});

handler.post(async (req: any, res: any) => {
  try {
    const images = await makePromptRequest(JSON.parse(req.body));
    return res.json(images);
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: "Error making Prompt", success: false });
  }
});

export default handler;

const makePromptRequest = async (obj: any) => {
  const client = makeReplicateClient(obj.token);
  try {
    const model: any = await client.models.get(obj.model);
    const prediction = await model.predict(obj.input);
    return prediction;
  } catch (err: any) {
    console.error(err.message);
  }
};

const makeReplicateClient = (token: string) => {
  return new Replicate({ token });
};
