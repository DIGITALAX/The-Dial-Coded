import { UseHotResults } from "../types/feed.types";

const useHot = (): UseHotResults => {
  const topTrending: string[] = [
    "QmcDKJt29aMZeFpHtv61R4TZU1MbBXeb5RzfdoY6Ee2hsY",
    "QmcuNti3wRdtbwmHGXg1S6oExw4mn2DRmK1QqkWrMh97AW",
    "QmRfz2Fp6E93mUuAH5mhYKpeVPJQAQkn7HLKkiSsWwtsd2",
    "QmWsyrjoizyX4GRYeGvJ3ecd7YDMkonDM2KBTW2bHH18VX",
    "QmP2fNq3YQ5RbeZitu8cRc1ajCeW8YbgZmkjV6Nn9VGenT",
  ];

  const topMixtape: string[] = [
    "QmRfz2Fp6E93mUuAH5mhYKpeVPJQAQkn7HLKkiSsWwtsd2",
    "QmWsyrjoizyX4GRYeGvJ3ecd7YDMkonDM2KBTW2bHH18VX",
  ];

  const topTracks: string[] = [
    "QmcDKJt29aMZeFpHtv61R4TZU1MbBXeb5RzfdoY6Ee2hsY",
    "QmcuNti3wRdtbwmHGXg1S6oExw4mn2DRmK1QqkWrMh97AW",
    "QmRfz2Fp6E93mUuAH5mhYKpeVPJQAQkn7HLKkiSsWwtsd2",
    "QmWsyrjoizyX4GRYeGvJ3ecd7YDMkonDM2KBTW2bHH18VX",
    "QmP2fNq3YQ5RbeZitu8cRc1ajCeW8YbgZmkjV6Nn9VGenT",
    "QmWkJaHuQv9LWUDE4eqDPWx4vdq55Ug5gKhHpBnLP6jex4",
    "QmfVLPL7WG3QrgJ63bK33uzG5RCAntB734vo8J2JBGSYyr",
    "QmVQDYFT9A98on8BHdDRNsnXV5e55XTurDYHg52Z6ui7CF",
    "QmbfZrJ79XhFTgBTzTb4CaZwM59EgnPuPYMcx7gtazxcdE",
    "QmUECY83LZx8eYsZ4XUNVYMQDF5Cm8iowrVTYi1vpi1Ajo",
    "QmQ4y8wbehLHjhfdp6P9VZQ88ArC7wYYe6wVXs7Di9MTzm",
    "Qma8CDZVUg5BHYzeB1PeTephfPUx8MWt7jm71YTAKS5tt3",
  ];

  return { topMixtape, topTracks, topTrending };
};

export default useHot;
