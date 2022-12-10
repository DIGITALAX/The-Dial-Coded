import { useState } from "react";
import { UseSearchResults } from "../types/search.types";

const useSearch = (): UseSearchResults => {
  const [open, setOpen] = useState<boolean>(false);

  const uris: string[] = [
    "QmRUztxbrNETu85M3o9RoyqEKBeGEeV5kT5K8hberNTHw7",
    "QmfG4dGSYrtv2hCUnURNvfKyk92ZwVJoG9wiMvtjhVQm8y",
    "QmcW5F3a6WyWzj9cYZSxcecTe93dMxYeXPj2GZ9MvGWrJa",
    "QmWqomti4SpttTLXj878VHFgSM6c4EEGmEooDGm134HU9T",
    "Qmct1VBhhLeRnBu7WynCrXSUYYFKubBWruRAuP2LgDbDTY",
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

export default useSearch;
