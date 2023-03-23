import { FormEvent, useEffect, useRef, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useSignTypedData,
} from "wagmi";
import { LENS_HUB_PROXY_ADDRESS_MUMBAI } from "../../../../../lib/lens/constants";
import LensHubProxy from "../../../../../abis/LensHubProxy.json";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import {
  MediaType,
  PostArgsType,
  UploadedMedia,
} from "../../../types/common.types";
import {
  createPostTypedData,
  createDispatcherPostData,
} from "../../../../../graphql/mutations/createPost";
import { searchProfile } from "../../../../../graphql/queries/search";
import { setPublication } from "../../../../../redux/reducers/publicationSlice";
import lodash from "lodash";
import { setInsufficientFunds } from "../../../../../redux/reducers/insufficientFunds";
import {
  createCommentTypedData,
  createDispatcherCommentData,
} from "../../../../../graphql/mutations/comment";
import { useRouter } from "next/router";
import { setIndexModal } from "../../../../../redux/reducers/indexModalSlice";
import omit from "../../../../../lib/lens/helpers/omit";
import splitSignature from "../../../../../lib/lens/helpers/splitSignature";
import { setFollowerOnly } from "../../../../../redux/reducers/followerOnlySlice";
import { Profile } from "../../../types/lens.types";
import getPostHTML from "../../../../../lib/lens/helpers/postHTML";
import getCaretPos from "../../../../../lib/lens/helpers/getCaretPos";
import handleIndexCheck from "../../../../../lib/lens/helpers/handleIndexCheck";
import { setPostImages } from "../../../../../redux/reducers/postImagesSlice";
import broadcast from "../../../../../graphql/mutations/broadcast";
import {
  getPostData,
  removePostData,
  setPostData,
} from "../../../../../lib/lens/utils";
import uploadPostContent from "../../../../../lib/lens/helpers/uploadPostContent";

const usePublication = () => {
  const {
    query: { id },
    route,
  } = useRouter();
  const [postDescription, setPostDescription] = useState<string>("");
  const [postHTML, setPostHTML] = useState<string>("");
  const [caretCoord, setCaretCoord] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const isCanvas = useSelector(
    (state: RootState) => state.app.publicationReducer.canvas
  );
  const dispatcher = useSelector(
    (state: RootState) => state.app.dispatcherReducer.value
  );
  const postBox = useSelector(
    (state: RootState) => state.app.publicationReducer.open
  );
  const [mentionProfiles, setMentionProfiles] = useState<Profile[]>([]);
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [contentURI, setContentURI] = useState<string | undefined>();
  const [args, setArgs] = useState<PostArgsType | undefined>();
  const [searchGif, setSearchGif] = useState<string>();
  const [results, setResults] = useState<any>([]);
  const [commentArgs, setCommentArgs] = useState<any>();
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const textElement = useRef<HTMLTextAreaElement>(null);
  const [profilesOpen, setProfilesOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const defaultProfile = useSelector(
    (state: RootState) => state?.app?.lensProfileReducer?.profile?.id
  );
  const [tags, setTags] = useState<string[]>(
    route.includes("/post/") ? [] : JSON.parse(getPostData() || "{}").tags || []
  );
  const pubId = useSelector(
    (state: RootState) => state.app.reactionStateReducer.value
  );
  const { signTypedDataAsync } = useSignTypedData();
  const postImages = useSelector(
    (state: RootState) => state?.app?.postImageReducer?.value
  );
  const followersOnly = useSelector(
    (state: RootState) => state.app.followerOnlyReducer.value
  );
  const collectModuleType = useSelector(
    (state: RootState) => state?.app?.collectValueTypeReducer?.type
  );
  const [gifs, setGifs] = useState<UploadedMedia[]>(
    route.includes("/post/")
      ? []
      : JSON.parse(getPostData() || "{}").images || []
  );
  const { config, isSuccess: postSuccess } = usePrepareContractWrite({
    address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
    abi: LensHubProxy,
    functionName: "postWithSig",
    enabled: Boolean(args),
    args: [args],
  });

  useEffect(() => {
    const savedData = getPostData();
    if (savedData && postBox) {
      setPostDescription(JSON.parse(savedData).post);
      let resultElement = document.querySelector("#highlighted-content");
      if (
        JSON.parse(savedData).post[JSON.parse(savedData).post.length - 1] ==
        "\n"
      ) {
        JSON.parse(savedData).post += " ";
      }
      setPostHTML(
        getPostHTML(JSON.parse(savedData).post, resultElement as Element, true)
      );
    }
  }, []);

  const { writeAsync } = useContractWrite(config);

  const { config: commentConfig, isSuccess: commentSuccess } =
    usePrepareContractWrite({
      address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
      abi: LensHubProxy,
      functionName: "commentWithSig",
      enabled: Boolean(commentArgs),
      args: [commentArgs],
    });

  const { writeAsync: commentWriteAsync } = useContractWrite(commentConfig);

  const commentPost = async (e: FormEvent): Promise<void> => {
    if (
      (!postDescription ||
        postDescription === "" ||
        postDescription.trim().length < 0) &&
      (!postImages?.length || postImages.length < 1)
    ) {
      return;
    }
    setCommentLoading(true);
    let result: any;
    try {
      const contentURIValue = await uploadPostContent(
        postImages,
        tags,
        postDescription,
        isCanvas,
        setContentURI,
        contentURI
      );
      if (dispatcher) {
        result = await createDispatcherCommentData({
          profileId: defaultProfile,
          publicationId: pubId ? pubId : id,
          contentURI: "ipfs://" + contentURIValue,
          collectModule: collectModuleType,
          referenceModule: {
            followerOnlyReferenceModule: followersOnly ? followersOnly : false,
          },
        });
        clearComment();
        setTimeout(async () => {
          await handleIndexCheck(
            result?.data?.createCommentViaDispatcher?.txHash,
            dispatch,
            true
          );
        }, 7000);
      } else {
        result = await createCommentTypedData({
          profileId: defaultProfile,
          publicationId: pubId ? pubId : id,
          contentURI: "ipfs://" + contentURIValue,
          collectModule: collectModuleType,
          referenceModule: {
            followerOnlyReferenceModule: followersOnly ? followersOnly : false,
          },
        });

        const typedData: any = result.data.createCommentTypedData.typedData;

        const signature: any = await signTypedDataAsync({
          domain: omit(typedData?.domain, ["__typename"]),
          types: omit(typedData?.types, ["__typename"]) as any,
          value: omit(typedData?.value, ["__typename"]) as any,
        });

        const broadcastResult: any = await broadcast({
          id: result?.data?.createCommentTypedData?.id,
          signature,
        });

        if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
          const { v, r, s } = splitSignature(signature);

          const commentArgs = {
            profileId: typedData.value.profileId,
            contentURI: typedData.value.contentURI,
            profileIdPointed: typedData.value.profileIdPointed,
            pubIdPointed: typedData.value.pubIdPointed,
            referenceModuleData: typedData.value.referenceModuleData,
            referenceModule: typedData.value.referenceModule,
            referenceModuleInitData: typedData.value.referenceModuleInitData,
            collectModule: typedData.value.collectModule,
            collectModuleInitData: typedData.value.collectModuleInitData,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          };
          setCommentArgs(commentArgs);
        } else {
          clearComment();
          setTimeout(async () => {
            await handleIndexCheck(
              broadcastResult?.data?.broadcast?.txHash,
              dispatch,
              true
            );
          }, 7000);
        }
      }
    } catch (err: any) {
      console.error(err.message);
      dispatch(setInsufficientFunds("Unsuccessful. Please Try Again."));
    }
    setCommentLoading(false);
  };

  const handleEmoji = (e: any): void => {
    let resultElement = document.querySelector("#highlighted-content");
    (resultElement as any).innerHTML = postHTML + e.emoji;
    setPostHTML(postHTML + e.emoji);
    setPostDescription(postDescription + e.emoji);
    if (!route.includes("/post/")) {
      const postStorage = JSON.parse(getPostData() || "{}");
      setPostData(
        JSON.stringify({
          ...postStorage,
          post: postDescription + e.emoji,
        })
      );
    }
  };

  const handleGif = (e: FormEvent): void => {
    setSearchGif((e.target as HTMLFormElement).value);
  };

  const handleGifSubmit = async (e: any): Promise<void> => {
    const getGifs = await fetch("/api/giphy", {
      method: "POST",
      body: JSON.stringify(searchGif),
    });
    const allGifs = await getGifs.json();
    setResults(allGifs?.json?.results);
  };

  const handleSetGif = (result: any): void => {
    if ((postImages as any)?.length <= 4) {
      setGifs([
        ...(postImages as any),
        {
          cid: result,
          type: MediaType.Gif,
        },
      ]);
      if (!route.includes("/post/")) {
        const postStorage = JSON.parse(getPostData() || "{}");
        setPostData(
          JSON.stringify({
            ...postStorage,
            images: [
              ...(postImages as any),
              {
                cid: result,
                type: MediaType.Gif,
              },
            ],
          })
        );
      }
    }
  };

  const handlePost = async (): Promise<void> => {
    if (
      (!postDescription ||
        postDescription === "" ||
        postDescription.trim().length < 0) &&
      (!postImages?.length || postImages.length < 1)
    ) {
      return;
    }
    setPostLoading(true);
    let result: any;
    try {
      const contentURIValue = await uploadPostContent(
        postImages,
        tags,
        postDescription,
        isCanvas,
        setContentURI,
        contentURI
      );

      if (dispatcher) {
        result = await createDispatcherPostData({
          profileId: defaultProfile,
          contentURI: "ipfs://" + contentURIValue,
          collectModule: collectModuleType,
          referenceModule: {
            followerOnlyReferenceModule: followersOnly ? followersOnly : false,
          },
        });
        clearPost();
        setTimeout(async () => {
          await handleIndexCheck(
            result?.data?.createPostViaDispatcher?.txHash,
            dispatch,
            true
          );
        }, 7000);
      } else {
        result = await createPostTypedData({
          profileId: defaultProfile,
          contentURI: "ipfs://" + contentURIValue,
          collectModule: collectModuleType,
          referenceModule: {
            followerOnlyReferenceModule: followersOnly ? followersOnly : false,
          },
        });

        const typedData: any = result.data.createPostTypedData.typedData;

        const signature: any = await signTypedDataAsync({
          domain: omit(typedData?.domain, ["__typename"]),
          types: omit(typedData?.types, ["__typename"]) as any,
          value: omit(typedData?.value, ["__typename"]) as any,
        });

        const broadcastResult: any = await broadcast({
          id: result?.data?.createPostTypedData?.id,
          signature,
        });

        if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
          const { v, r, s } = splitSignature(signature);

          const postArgs: PostArgsType = {
            profileId: typedData.value.profileId,
            contentURI: typedData.value.contentURI,
            collectModule: typedData.value.collectModule,
            collectModuleInitData: typedData.value.collectModuleInitData,
            referenceModule: typedData.value.referenceModule,
            referenceModuleInitData: typedData.value.referenceModuleInitData,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          };
          setArgs(postArgs);
        } else {
          clearPost();
          setTimeout(async () => {
            await handleIndexCheck(
              broadcastResult?.data?.broadcast?.txHash,
              dispatch,
              true
            );
          }, 7000);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setPostLoading(false);
  };

  const clearComment = () => {
    setCommentLoading(false);
    setPostDescription("");
    setPostHTML("");
    setGifs([]);
    setTags([]);
    (document as any).getElementById("tagSearch").value = "";
    (document as any).querySelector("#highlighted-content").innerHTML = "";
    dispatch(setFollowerOnly(false));
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: "Indexing Interaction",
      })
    );
  };

  const clearPost = () => {
    dispatch(
      setPublication({
        actionOpen: false,
        actionCanvas: false,
      })
    );
    dispatch(setFollowerOnly(false));
    setPostLoading(false);
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: "Indexing Interaction",
      })
    );
    setPostDescription("");
    setPostHTML("");
    setGifs([]);
    setTags([]);
    removePostData();
    (document as any).getElementById("tagSearch").value = "";
    (document as any).querySelector("#highlighted-content").innerHTML = "";
  };

  const handlePostWrite = async (): Promise<void> => {
    setPostLoading(true);
    try {
      const tx = await writeAsync?.();
      clearPost();
      const res = await tx?.wait();
      await handleIndexCheck(res?.transactionHash, dispatch, true);
    } catch (err) {
      console.error(err);
      setPostLoading(false);
      dispatch(setInsufficientFunds("Unsuccessful. Please Try Again."));
    }
  };

  const handleCommentWrite = async (): Promise<void> => {
    setCommentLoading(true);
    try {
      const tx = await commentWriteAsync?.();
      clearComment();
      const res = await tx?.wait();
      await handleIndexCheck(res, dispatch, true);
    } catch (err) {
      console.error(err);
      setCommentLoading(false);
      dispatch(setInsufficientFunds("Unsuccessful. Please Try Again."));
    }
  };

  const handleMentionClick = (user: any) => {
    setProfilesOpen(false);
    let resultElement = document.querySelector("#highlighted-content");
    const newHTMLPost =
      postHTML?.substring(0, postHTML.lastIndexOf("@")) +
      `@${user?.handle}</span>`;
    const newElementPost =
      postDescription?.substring(0, postDescription.lastIndexOf("@")) +
      `@${user?.handle}`;
    setPostDescription(newElementPost);
    if (!route.includes("/post/")) {
      const postStorage = JSON.parse(getPostData() || "{}");
      setPostData(
        JSON.stringify({
          ...postStorage,
          post: newElementPost,
        })
      );
    }
    (resultElement as any).innerHTML = newHTMLPost;
    setPostHTML(newHTMLPost);
  };

  const handlePostDescription = async (e: any): Promise<void> => {
    let resultElement = document.querySelector("#highlighted-content");
    if (e.target.value[e.target.value.length - 1] == "\n") {
      e.target.value += " ";
    }
    setPostHTML(getPostHTML(e, resultElement as Element));
    setPostDescription(e.target.value);
    if (!route.includes("/post/")) {
      const postStorage = JSON.parse(getPostData() || "{}");
      setPostData(
        JSON.stringify({
          ...postStorage,
          post: e.target.value,
        })
      );
    }
    if (
      e.target.value.split(" ")[e.target.value.split(" ").length - 1][0] ===
        "@" &&
      e.target.value.split(" ")[e.target.value.split(" ").length - 1].length ===
        1
    ) {
      setCaretCoord(getCaretPos(e, textElement));
      setProfilesOpen(true);
    }
    if (
      e.target.value.split(" ")[e.target.value.split(" ").length - 1][0] === "@"
    ) {
      const allProfiles = await searchProfile({
        query: e.target.value.split(" ")[e.target.value.split(" ").length - 1],
        type: "PROFILE",
        limit: 50,
      });
      setMentionProfiles(allProfiles?.data?.search?.items);
    } else {
      setProfilesOpen(false);
      setMentionProfiles([]);
    }
  };

  const handleTags = (e: FormEvent) => {
    e.preventDefault();
    let newTags: string[] = [...(tags as string[])];
    newTags.push((e.target as HTMLFormElement).tag?.value);
    setTags(newTags);
    if (!route.includes("/post/")) {
      const postStorage = JSON.parse(getPostData() || "{}");
      setPostData(
        JSON.stringify({
          ...postStorage,
          tags: newTags,
        })
      );
    }
  };

  const handleRemoveTag = (removeTag: string) => {
    const newArr = lodash.filter(tags, (tag: string) => tag !== removeTag);
    setTags(newArr);
    const postStorage = JSON.parse(getPostData() || "{}");
    if (!route.includes("/post/")) {
      setPostData(
        JSON.stringify({
          ...postStorage,
          tags: newArr,
        })
      );
    }
  };

  useEffect(() => {
    if (postSuccess) {
      handlePostWrite();
    }

    if (commentSuccess) {
      handleCommentWrite();
    }
  }, [postSuccess, commentSuccess]);

  useEffect(() => {
    dispatch(setPostImages(gifs));
  }, [gifs]);

  return {
    handlePost,
    postDescription,
    handlePostDescription,
    handleEmoji,
    postLoading,
    postSuccess,
    searchGif,
    results,
    handleGif,
    handleGifSubmit,
    handleSetGif,
    commentLoading,
    commentSuccess,
    commentPost,
    handleTags,
    tags,
    handleRemoveTag,
    textElement,
    mentionProfiles,
    handleMentionClick,
    caretCoord,
    profilesOpen,
  };
};

export default usePublication;
