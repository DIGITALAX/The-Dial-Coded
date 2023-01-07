const descriptionRegex = (description: string) => {
  const styledText = description?.split(" ")?.map((word: string) => {
    if (word[0] === "#") {
      return `<span style="color: #81A8F8;">${word}</span>`;
    } else if (word[0] === "@") {
      return `
        <a href="${`/profile/${word.replace("@", "")}`}" rel="noreferrer">
        <span style="color: #81A8F8;">${word}</span>
        </a>
        `;
    } else if (word[0] && word[1] && word[2] === "w")
      return `
      <a href=${
        word.includes("//") ? word : `//${word}`
      } target="_blank" rel="noreferrer">
      <span style="color: #81A8F8;">${word}</span>
      </a>
      `;
    else {
      return word;
    }
  });

  return styledText.join(",");
};

export default descriptionRegex;
