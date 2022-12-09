import { useState } from "react";
import { UseSearchResults } from "../types/search.types";

const useSearch = (): UseSearchResults => {
  const [open, setOpen] = useState<boolean>(false);

  const uris: string[] = [
    "QmRUztxbrNETu85M3o9RoyqEKBeGEeV5kT5K8hberNTHw7",
    "QmfG4dGSYrtv2hCUnURNvfKyk92ZwVJoG9wiMvtjhVQm8y",
    "QmRUztxbrNETu85M3o9RoyqEKBeGEeV5kT5K8hberNTHw7",
    "QmWqomti4SpttTLXj878VHFgSM6c4EEGmEooDGm134HU9T",
  ];

  const layoutType: string[] = ["Slider", "Canvas", "Account", "Post"];

  return { open, setOpen, uris, layoutType };
};

export default useSearch;
