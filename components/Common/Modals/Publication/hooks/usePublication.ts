import { FormEvent, useState } from "react";

const usePublication = () => {
  const [postDescription, setPostDesription] = useState<string>();
  const [hashtags, setHashtags] = useState<string | undefined>();
  const [urls, setUrls] = useState<string | undefined>();

  const handleEmoji = (e: any): void => {
    setPostDesription(postDescription + e.emoji);
  };

  const handlePost = (): void => {};

  const handlePostDescription = (e: FormEvent): void => {
    setPostDesription((e.target as HTMLFormElement).value);
    if ((e.target as HTMLFormElement).value.match(/\B#\w*[a-zA-Z]+\w*/)) {
      setHashtags(
        (e.target as HTMLFormElement).value.match(/\B#\w*[a-zA-Z]+\w*/)[0]
      );
    } else {
      setHashtags(undefined);
    }

    if (
      (e.target as HTMLFormElement).value.match(
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
      )
    ) {
      setUrls(
        (e.target as HTMLFormElement).value.match(
          /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
        )[0]
      );
    } else {
      setUrls(undefined);
    }
  };

  return {
    handlePost,
    postDescription,
    handlePostDescription,
    hashtags,
    urls,
    handleEmoji,
  };
};

export default usePublication;
