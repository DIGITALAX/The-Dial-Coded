import { FormEvent, useEffect, useRef, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useContractWrite as useCommentWrite,
  usePrepareContractWrite as usePrepareCommentWrite,
  useSignTypedData,
} from "wagmi";
import { LENS_HUB_PROXY_ADDRESS_MUMBAI } from "../../../../../lib/lens/constants";
import LensHubProxy from "../../../../../abis/LensHubProxy.json";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { PostArgsType, PostImage } from "../../../types/common.types";
import createPostTypedData from "../../../../../graphql/mutations/createPost";
import { searchProfile } from "../../../../../graphql/queries/search";
import checkIndexed from "../../../../../graphql/queries/checkIndexed";
import { setPublication } from "../../../../../redux/reducers/publicationSlice";
import { setSignIn } from "../../../../../redux/reducers/signInSlice";
import lodash from "lodash";
import { setInsufficientFunds } from "../../../../../redux/reducers/insufficientFunds";
import CreateCommentTypedData from "../../../../../graphql/mutations/comment";
import { useRouter } from "next/router";
import { setIndexModal } from "../../../../../redux/reducers/indexModalSlice";
import omit from "../../../../../lib/lens/helpers/omit";
import splitSignature from "../../../../../lib/lens/helpers/splitSignature";
import { setFollowerOnly } from "../../../../../redux/reducers/followerOnlySlice";
import { Profile } from "../../../types/lens.types";
import getPostHTML from "../../../../../lib/lens/helpers/postHTML";
import getCaretPos from "../../../../../lib/lens/helpers/getCaretPos";

const usePublication = () => {
  const {
    query: { id },
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
  const [tags, setTags] = useState<string[]>([]);
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
  const [gifs, setGifs] = useState<string[]>([]);
  const { config, isSuccess: postSuccess } = usePrepareContractWrite({
    address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
    abi: LensHubProxy,
    functionName: "postWithSig",
    enabled: Boolean(args),
    args: [args],
  });

  const { writeAsync } = useContractWrite(config);

  const { config: commentConfig, isSuccess: commentSuccess } =
    usePrepareCommentWrite({
      address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
      abi: LensHubProxy,
      functionName: "commentWithSig",
      enabled: Boolean(commentArgs),
      args: [commentArgs],
    });

  const { writeAsync: commentWriteAsync } = useCommentWrite(commentConfig);

  const commentPost = async (e: FormEvent): Promise<void> => {
    setCommentLoading(true);
    try {
      const contentURI = await uploadContent();
      const result: any = await CreateCommentTypedData({
        profileId: defaultProfile,
        publicationId: pubId ? pubId : id,
        contentURI: "ipfs://" + contentURI,
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
    } catch (err: any) {
      console.error(err.message);
      dispatch(setInsufficientFunds("failed"));
    }
    setCommentLoading(false);
  };

  const handleEmoji = (e: any): void => {
    let resultElement = document.querySelector("#highlighted-content");
    (resultElement as any).innerHTML = postHTML + e.emoji;
    setPostHTML(postHTML + e.emoji);
    setPostDescription(postDescription + e.emoji);
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
    setGifs([...gifs, result]);
  };

  const handleRemoveGif = (result: any): void => {
    const filtered: string[] = lodash.filter(gifs, (gif) => gif !== result);
    setGifs(filtered);
  };

  const uploadContent = async (): Promise<string | undefined> => {
    let newImages: PostImage[] = [];
    let formattedTags: string[] = [];
    postImages?.forEach((image) => {
      newImages.push({
        item: "ipfs://" + image,
        type: "image/png",
        altTag: image,
      });
    });

    if (gifs.length > 0) {
      for (let i = 0; i < gifs.length; i++) {
        newImages.push({
          item: gifs[i],
          type: "image/gif",
          altTag: gifs[i],
        });
      }
    }

    if (tags?.length > 0) {
      lodash.filter(tags, (tag) => {
        if (tag.length > 50) {
          formattedTags.push(tag.substring(0, 49));
        } else {
          formattedTags.push(tag);
        }
      });
    }

    if (isCanvas) {
      if (formattedTags.length < 5) {
        formattedTags.push("dialCanvasDraft");
      } else {
        formattedTags.pop();
        formattedTags.push("dialCanvasDraft");
      }
    }

    const data = {
      version: "2.0.0",
      metadata_id: uuidv4(),
      description: postDescription ? postDescription : "",
      content: postDescription ? postDescription : "",
      external_url: "https://www.thedial.xyz/",
      image:
        postImages && postImages?.length > 0 ? "ipfs://" + postImages[0] : null,
      imageMimeType: "image/png",
      name: postDescription ? postDescription?.slice(0, 20) : "The Dial",
      mainContentFocus:
        newImages.length > 0 || gifs.length > 0 ? "IMAGE" : "TEXT_ONLY",
      contentWarning: null,
      attributes: [
        {
          traitType: "string",
          key: "date",
          date: Date.now(),
        },
      ],
      media: newImages,
      locale: "en",
      tags: formattedTags?.length > 0 ? formattedTags : null,
      createdOn: new Date(),
      appId: "thedial",
    };

    try {
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (response.status !== 200) {
      } else {
        let responseJSON = await response.json();
        setContentURI(responseJSON.cid);
        return responseJSON.cid;
      }
    } catch (err: any) {
      console.error(err.message);
    }
    return contentURI;
  };

  const handlePost = async (): Promise<void> => {
    setPostLoading(true);
    try {
      const contentURI = await uploadContent();
      const result: any = await createPostTypedData({
        profileId: defaultProfile,
        contentURI: "ipfs://" + contentURI,
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
    } catch (err: any) {
      console.error(err.message);
      dispatch(setSignIn(true));
    }
    setPostLoading(false);
  };

  const handlePostWrite = async (): Promise<void> => {
    setPostLoading(true);
    try {
      const tx = await writeAsync?.();
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
      (document as any).getElementById("tagSearch").value = "";
      (document as any).querySelector("#highlighted-content").innerHTML = "";
      const res = await tx?.wait();
      const indexedStatus = await checkIndexed(res?.transactionHash);
      if (
        indexedStatus?.data?.hasTxHashBeenIndexed?.metadataStatus?.status ===
        "SUCCESS"
      ) {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Successfully Indexed",
          })
        );
      } else {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Post Unsuccessful, Please Try Again",
          })
        );
      }
      setTimeout(() => {
        dispatch(
          setIndexModal({
            actionValue: false,
            actionMessage: undefined,
          })
        );
      }, 3000);
    } catch (err) {
      console.error(err);
      setPostLoading(false);
      dispatch(setInsufficientFunds("failed"));
    }
  };

  const handleCommentWrite = async (): Promise<void> => {
    setCommentLoading(true);
    try {
      const tx = await commentWriteAsync?.();
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
      const res = await tx?.wait();
      const indexedStatus = await checkIndexed(res?.transactionHash);
      if (
        indexedStatus?.data?.hasTxHashBeenIndexed?.metadataStatus?.status ===
        "SUCCESS"
      ) {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Successfully Indexed",
          })
        );
      } else {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Comment Unsuccessful, Please Try Again",
          })
        );
      }
      setTimeout(() => {
        dispatch(
          setIndexModal({
            actionValue: false,
            actionMessage: undefined,
          })
        );
      }, 3000);
    } catch (err) {
      console.error(err);
      setCommentLoading(false);
      dispatch(setInsufficientFunds("failed"));
    }
  };

  const handleMentionClick = (user: any) => {
    setProfilesOpen(false);
    let resultElement = document.querySelector("#highlighted-content");
    const newHTMLPost =
      postHTML.substring(0, postHTML.lastIndexOf("@")) +
      `@${user?.handle.split(".test")[0]}</span>`;
    const newElementPost =
      postDescription.substring(0, postDescription.lastIndexOf("@")) +
      `@${user?.handle.split(".test")[0]}`;
    setPostDescription(newElementPost);
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
  };

  const handleRemoveTag = (removeTag: string) => {
    const newArr = lodash.filter(tags, (tag: string) => tag !== removeTag);
    setTags(newArr);
  };

  useEffect(() => {
    if (postSuccess) {
      handlePostWrite();
    }

    if (commentSuccess) {
      handleCommentWrite();
    }
  }, [postSuccess, commentSuccess]);

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
    gifs,
    handleRemoveGif,
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
