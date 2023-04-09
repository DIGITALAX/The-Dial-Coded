const getLinkPreview = (text: string) => {
  const linkRegex = /(https?:\/\/[^\s]+)/gi;
  const link = text?.split(" ")?.map((word: string) => {
    if (
      (word[0] && word[1] && word[2] === "w" && word[3] === ".") ||
      (word[word.length] === "z" &&
        word[word.length - 1] === "y" &&
        word[word.length - 2] === "x" &&
        word[word.length - 3] === ".") ||
      (word[word.length] === "m" &&
        word[word.length - 1] === "o" &&
        word[word.length - 2] === "c" &&
        word[word.length - 3] === ".") || word?.match(linkRegex)
    ) {
        
    }
  });
};

export default getLinkPreview;
