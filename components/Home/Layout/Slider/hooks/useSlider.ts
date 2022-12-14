import { UseSliderResults } from "../types/slider.types";

const useSlider = (): UseSliderResults => {
  const scannerSlider: string[] = [
    "QmcBV71Rt3DnPUG6JX8a3Y87eio4jnDNbw5mFynNbgzbUK",
    "QmUa96CBCsBxSyEgFS6bU9T6yZtpwcTT92LHuBqGAWhYPg",
    "QmUeuM2GdkfQmGtTy5zJ2PFTMNj6Kh3A4PruuXkTTbFUGG",
    "QmXTE1yHUs6geX3Y1QDaTLk1jLbm9Vyx7y3xAB9ox8j13j",
    "QmQeYKz6SUAiPb3pGdbUg4uK9UYhLHwS1RZrg91jvrBMq2",
    "QmZT3PtRxSNt3LmXnWB5eECSovoUndAgzgTKjaCXNyk8vX",
    "QmemMvPmXD6DyiRbwFTyg4LHMHhF7SLkSgX5tqaXmFwqCs",
    "QmWM6aEpVWnwMwUcPJKKEWnj1deNq1H934y9sHz7SQsh6U",
    "QmRKBiZ9idW6dmQCMQnLbsaRJBAiYysKJhF5xz4LX3dXMt",
    "QmdmQNGLjyfJuCrHVsK9xrck7E9mEfm6oprp1dtxbNhr3K",
    "QmT6RpQZ4Sdv135sz1CQBy1dm4XtWJzXeGFPo9p1PvxHdx",
    "QmcwCAacJT6WzcyUEP4HngCqTXVogGPP4cFDpw5NMcBATt",
    "QmWRnieLeHfC3jQkuXZ4z2Z1DHfKsThCaReUGkcp3GGU6b",
    "QmeodnXaSi9jXczczcN4i5a9VEp5fDowVGBJtRHvy1hHRD",
  ];

  const highlightsSlider: string[] = [
    "QmdiKR4AMy69VBbur9McfTvGAaw7SwU11NiKpNS9RQZ1sF",
    "QmTPoECBmvRHG31ntnE9wnvX4rw4eJZeaRFzKW1xtHgeAZ",
    "Qma2YEkLWnMTr5uUARDoaM96EkCwzyhJ1vTCXhjFPMGVL5",
    "QmZ4uFpbnjR4z7BbivbbieWz6QQqGt5zK6JUe92uw7nygn",
    "QmY5WPMencscnU4Gqbd9deDfy3aenQAUvrjhd3Njns96gH",
    "QmXMtv2sTvR56nznxZW4t3fkona5ppJdwwRmAt2dcPCpyt",
    "QmTkkPxZFttDrPtsHViWReGc7avPq3GN3erGQet7mxHBXn",
    "QmRMRtQshiby87ECX7Ktvyyz9toX12aHMtYUhUS5qJTZN9",
    "Qmb3eWA9cT1VTfpM6QG4bYCeGziCzA7A3NeU3CqLAAYiwQ",
    "QmTeyvsFPW7GUkUSPWzrT7kBGLrp6ANPnmE9RmzK5VkGT3",
    "QmYwCMdsedbZ3SRtCCEqUYBJn2Lcdf2vABQhm7ScxUoUHd",
    "QmUzVntqTNoV4TKTvzTp7D6SG62oU9SehZmCmeukaRjceS",
  ];

  const dropsSlider: string[] = [
    "QmTVMXcjyMNmkMiyUFKxx3iqqdCTMuSpnLCgUS6usLX9Bu",
    "QmNwn2k2XFqs1aw6zBFS2n82pbFeHy6G59oTzwaM1FYM6a",
    "QmUVL7BRGpbZUMKsmKxshwzS88d6FgssLpvoiUda7NqPwr",
    "QmP1f9jSctxnRKwMaLP3LKFo23VQFoxjemrnjhAmNaaGZN",
    "QmRyvBxEHQL8CLmUKRehGLUvP6DcCMRzEgZZ9PZiGH7wYE",
    "QmXfjyZLfvHyB6nHWBnmbnq7spRREvui9RzNtfp7Wyjsej",
    "QmNvDugwUQ6BQTdSD6AXGNJBmomUxibxG7dKz1QTCtqK9D",
    "QmQh4Dubk6S6hC2KKTdLxj67sepa6ZDin8Qh6HRshgvj2E",
    "QmbgS1g7EcaXMEXa8T4xaGTudhzQsteTxGVZUEpiXzovG8",
    "Qma3QtAizcmW2JjBRLGWHZA16oGPPFwhCvKoVyfvyepdfN",
    "QmbpRBzg48MJH8bS6zyeFEC4713FDfqNNXjSvXvW1b5JKH",
    "QmQwHMwXuHnchqM6Y3ZSKuC88JytgmhUz1hNHkCoAwTcMq",
    "QmZZAAe2XnTt7E3cQoUjsLrS72WrhUe4SG83zMTnxTSrpT",
    "QmSBqLbq8VAMM7Ww8xTsENtpEQRY9KPei128tg7LHutsJF",
    "QmYVWMk7eDG2QJHPyjr5hTkYaWgfA3Bb5EDNmYH4FUAp8a",
    "QmdBLqv5wDxfd9fgREYCvpygA3bHLskB1cmDueFN9WhVYh",
    "QmNpShvT7kmhGRanfSS6CaNH4E7HWxL9s5gAjzs7bFZ153",
  ];

  const reachSlider: string[] = [
    "QmPfYcdeKrqdeaovLHKJfcqa95JJmSWsSH4HTuDajCiCX5",
    "QmWkr4mugAkeMvFDhUcsUdaAWKVYgisx8UjSXnkwGRLRXb",
    "QmR3gNbyDankUaDEtkjWvywy3bx3jHqArRUmcAVKtcermY",
    "QmXqb8FsYbUuw5X2F2FVyN45oHq3FJLe8zPQRcTU3nKfxR",
    "QmNqm2KGjJgHEXCkkRDJFeEW6qfT4AydLhc6Z8YoqY9ci5",
    "QmaBy4D6HF4LqE3tnLoVKd9zP4c7Zb77zH16eP6AKw3jT7",
    "QmW4P4g5YPiCBXX4fm7gYk4M4E59kcdEqiZCsrdyKyDYNd",
    "QmQen3WfHNFDp93mLdAHnaxyGjbTVHPABPKfPpKSk2jhHa",
    "QmQw5uTVUYBH3JB6C4KFaWw8LqvvdFNJngm6cD6VuYChDc",
    "Qmc6CZNLhK63oSps2ENoJ3DDM7aMHPaoMVmVMmfQqs7g5A",
    "QmSEXQdgbu7jvhAPkwwzAysvvuECdE8HFwRQKn9wohqU2v",
    "QmctDwzVrqefZhGYhSk2zV2VZP3CzSxfQ3wmyCgnPwaRCh",
  ];

  const recordsSlider: string[] = [
    "Qmaq7ZPiyGMrwqWfiBL3Ptfp2Ts5y4SiDw11mopqYCxQTH",
    "QmYvHs8P2VMUhrMb1gyNHJQcUNH9KxffHDCz8XKCStibg2",
    "QmfA1nj3zLdLJgEQibD94GrHs3cUq5AHFQipsD5M8c4h1n",
    "QmW3ug13HzGcw41ZmyCGzcDWKuqS6jzJjDoSrsmXkHpfgw",
    "QmckXz2zRUUVLfh5LYDt4Hi169Nh3GwRTRJxGEDw1bhWRD",
    "QmbFSh25XPfQ6uQjRhviTB9yN6GKAj5U47qUN37xgkebHd",
    "QmTsCMGgvFng72wQVQiwTATZKkYeTXDdRZ3UFJwXmsXRzd",
    "QmbGpt7vCEoUgwX8SnUPx6gM7hV7BUJhZvzK71Mocx85Qq",
    "QmRKAH6bwXPVns4JwSahsCaCRa9GhUxpNUkgMNxcc3apWs",
    "QmdkdTcstEBizD7VZsFrutnkRm9UHBi5knVyfhQtqJgohd",
    "QmWkorB41T6WPJjMQ9RwdgXgsThP1NWR9DqjixKQ6knb5f",
    "QmTrNdRxVaZ8CMBAiAaUHFrgGgq4iaVo8rxX7UkMxKKLqe",
    "QmNf3YWPHHc18uUpEVhZPxa5CweXpABTV6XcBGBpwMUQ8R",
  ];

  const handleForward = (current: number): void => {
    // if (dialSetting) {
    //   if ((dialSetting as number) < 4) {
    //     dispatch(setDialSetting(dialSetting + 1));
    //   }
    // }
  };

  const handleBackward = (current: number): void => {
    // if (dialSetting) {
    //   if ((dialSetting as number) > 0) {
    //     dispatch(setDialSetting(dialSetting - 1));
    //   }
    // }
  };

  return {
    scannerSlider,
    highlightsSlider,
    recordsSlider,
    reachSlider,
    dropsSlider,
    handleForward,
    handleBackward,
  };
};

export default useSlider;
