import { useBadgesResult } from "../types/hooks.types";

const useBadges = (): useBadgesResult => {
  const badges: string[] = [
    "gpu",
    "collector",
    "critique",
    "master",
    "fashion",
    "synth",
    "generative",
    "stunning",
    "viral",
    "draft master",
    "hot",
    "trending",
    "merchant",
    "top weekly",
    "top monthly",
  ];

  const badgeColor: string[] = [
    "record1",
    "record2",
    "record3",
    "record4",
    "record5",
    "record6",
    "record7",
    "record8",
    "record9",
    "record10",
    "record11",
    "record12",
    "record13",
    "record14",
    "record15",
  ];

  const badgeImage: string[] = [
    "Qmdt7sijfg9asAHbcJLvFCieaspxosAV9QJskT2rKPHhNz",
    "Qmd2q57GCci7DV8HTdT66D4bqhuyptHYehYa5UnxfcTjuA",
    "QmUGp8UDeARbmqCjHJnGP72q7GAddiKcj2NdTJqbM4DNBY",
    "QmedQ8w5WjSX5aKqdLAKywuwsThpR1dDb6bnLynpH4bh5d",
    "QmeHxDgvWG4gXpUc5oBCPnkHFYRcswffaUEqyMRwiUJJkT",
    "QmWa2nzAUy9dn6xZHE4kFeX2A3gNsNL2oh76gmxypGMqNt",
    "QmPWirsvrp1arB2QKH2uMbnjrenEsWXDsBSBSa83jLSKqG",
    "QmR9qx5CxbSbTDMNyUXCsEZd49aB8mK4cXcWNpKCPuAwdA",
    "QmV9vLf5mu3XGZ5ZdbKg765Z2b7F1WkEFGSEiwreaHsDj6",
    "QmeFv3m9SG7ELeoHwLMaFyCtLne68BpMkKYMjzqShaGjfn",
    "Qmc7QWS3PfRQBjqQrTRHAvo716PLENsvRVMADchbC6eePs",
    "Qmejk9taYW3qY98GMEhu9NjFbQDfQhM6549a5agE4foM3T",
    "QmaJ4w7MWYmz2GCe6aSjesa5HEtgxLrDZuLcqu3rmpCMFC",
    "QmXLaMBkLNyBey8fQ9fCrsQdMkezS3E4jM4CEpNhy4Jaid",
    "QmQX9Y77E5kPVoipczoUUR2jqeYsAcnTBRCH4wKTsewoMU",
  ];

  return { badges, badgeColor, badgeImage };
};

export default useBadges;
