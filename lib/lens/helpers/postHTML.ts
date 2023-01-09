const getPostHTML = (e: any, resultElement: Element): string => {
  const regexLinks = /\b(https?:\/\/)?(www\.)?\w+\.\b(com|xyz)\b/gi;
  const regexMentions = /(?:^|\s)(@|#)\w+/g;
  const linkHighlight = e.target.value.replace(regexLinks, (match: string) => {
    return `<span style="color: blue">${match}</span>`;
  });
  const mentionHighlight = linkHighlight.replace(
    regexMentions,
    (match: string) => {
      return `<span style="color: blue">${match}</span>`;
    }
  );
  const finalHTML = mentionHighlight
    .replace(new RegExp("&", "g"), "&")
    .replace(new RegExp("<", "g"), "<");
  (resultElement as any).innerHTML = finalHTML;

  return finalHTML;
};

export default getPostHTML;
