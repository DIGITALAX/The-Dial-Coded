const promptRegex = (prompt: string): string | undefined => {
  const splitPrompt: string[] = prompt.split(" ");
  const pattern =
    /\b(and|the|a|of|an|,|at|but|then|because|as|so|if|or|yet|whereas|unless|since|either|other|however|in|i|for|found|on|while|found)\b/i;
  for (let i = 0; i < splitPrompt?.length; i++) {
    if (!splitPrompt[i]?.match(pattern)) {
      const returnedResult = splitPrompt[i].replace(/,/g, "");
      return returnedResult;
    }
  }
};

export default promptRegex;
