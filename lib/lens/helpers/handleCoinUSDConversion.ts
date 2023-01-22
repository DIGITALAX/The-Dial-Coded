import lodash from "lodash";

const handleCoinUSDConversion = async (
  currency: string,
  amount: string
): Promise<number | void> => {
  if (!amount) {
    return;
  }
  try {

    const response = await fetch("/api/coin", {
      method: "POST",
      body: currency?.toLowerCase(),
    });
    const json = response && (await response.json());
    const usdValue = lodash.find(json?.data, "usd");
    const convertedValue = Number(amount) * usdValue?.usd;
    return convertedValue;
  } catch (err: any) {
    console.error(err.message);
  }
};

export default handleCoinUSDConversion;
