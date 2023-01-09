const syncScroll = (e: any, element: string) => {
  let resultElement = document.querySelector(`#${element}`);
  (resultElement as any).scrollTop = e.target.scrollTop;
  (resultElement as any).scrollLeft = e.target.scrollLeft;
};

export default syncScroll;
