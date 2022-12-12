import { useState } from "react";
import { UsePanelResults } from "../types/search.types";

const usePanel = (): UsePanelResults => {
  const [open, setOpen] = useState<boolean>(false);

  const uris: string[] = [
    "QmRUztxbrNETu85M3o9RoyqEKBeGEeV5kT5K8hberNTHw7",
    "QmfG4dGSYrtv2hCUnURNvfKyk92ZwVJoG9wiMvtjhVQm8y",
    "QmS3dGNFY7JuqGaQcuZnmSqTZxsKBHjsKfCySEMxjLduQc",
    "QmVvtK2x9TQJzqfAnQPUKapQKVohXAjUrTrpry8TWZMhei",
    "QmdptnVYNSsfrg7s39y4QetAFtcVsrNRR5eH7ayifS1j79",
  ];

  const layoutType: string[] = [
    "Slider",
    "Canvas",
    "Mixtape",
    "Post",
    "Account",
  ];

  return { open, setOpen, uris, layoutType };
};

export default usePanel;
