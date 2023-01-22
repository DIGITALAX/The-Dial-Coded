import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { UseDraftsResult } from "./../types/canvas.types";
import { saveAs } from "file-saver";
import * as yup from "yup";
import { setDraftTitle } from "../../../../../redux/reducers/draftTitleSlice";
import { setDraftElements } from "../../../../../redux/reducers/draftElementsSlice";
import { INFURA_GATEWAY } from "../../../../../lib/lens/constants";

const useDrafts = (): UseDraftsResult => {
  const dispatch = useDispatch();
  const title = useSelector(
    (state: RootState) => state.app.draftTitleReducer.value
  );
  const [draftsLoading, setDraftsLoading] = useState<boolean>(false);

  const saveCanvasNetwork = async (file: File, elements: string[]) => {
    setDraftsLoading(true);
    try {
      await saveDraft(file, elements);
    } catch (err: any) {
      console.error(err.message);
    }
    setDraftsLoading(false);
  };

  const convertImage = async (elem: any, parsedElements: any[]) => {
    const res: Response = await fetch(
      `${INFURA_GATEWAY}/ipfs/${await JSON.parse(elem).cid}`
    );
    const blob: Blob = await res.blob();
    const postImage = new File([blob], "thedial_drafts", {
      type: "image/png",
    });
    const reader = new FileReader();
    reader?.readAsDataURL(postImage as File);
    reader.onload = (e) => {
      const imageObject = new Image();
      imageObject.src = e.target?.result as string;
      parsedElements.push( imageObject);
    };
  };

  const loadDraft = async (e: any) => {
    try {
      const res = await new Response(e.target.files[0]).json();
      const schema = yup.object().shape({
        title: yup.string().required(),
        elements: yup.string().required(),
        tags: yup.string().required(),
        date: yup.string().required(),
      });
      const valid = await schema.isValid(res);
      if (valid) {
        dispatch(setDraftTitle(res.title));
        const elements = await new Response(res.elements).json();
        let parsedElements: any[] = [];
        for (const elem in elements) {
          if ((await JSON.parse(elements[elem]).type) === "image") {
            await convertImage(elements[elem], parsedElements);
          }
          parsedElements.push(JSON.parse(elements[elem]))
        }

        // elements.forEach(async (elem: any) => {
        //   if (JSON.parse(elem).type === "image") {
        //     const res: Response = await fetch(
        //       `${INFURA_GATEWAY}/ipfs/${JSON.parse(elem).cid}`
        //     );
        //     const blob: Blob = await res.blob();
        //     const postImage = new File([blob], "thedial_drafts", {
        //       type: "image/png",
        //     });
        //     const reader = new FileReader();
        //     reader?.readAsDataURL(postImage as File);
        //     reader.onloadend = (e) => {
        //       const imageObject = new Image();
        //       imageObject.src = e.target?.result as string;
        //       const data = {
        //         id: JSON.parse(elem).id,
        //         type: JSON.parse(elem).type,
        //         x1: JSON.parse(elem).x1,
        //         y1: JSON.parse(elem).y1,
        //         x2: JSON.parse(elem).x2,
        //         y2: JSON.parse(elem).y2,
        //         image: imageObject,
        //       };

        //     };
        //     parsedElements.push(JSON.stringify("")) ;
        //   } else {
        //     parsedElements.push("");
        //   }
        // });
        // console.log(parsedElements, "here parsed")
        dispatch(setDraftElements(parsedElements));
      } else {
        alert("Not a valid Dial Canvas Draft.");
        return;
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const saveDraft = async (file: File, elements: string[]) => {
    try {
      const draft = {
        title: title,
        elements: JSON.stringify(elements),
        tags: "dialDraftsCanvas",
        date: Date.now().toString(),
      };
      const fileName = `${draft.title}_draftCanvas_${draft.date}.json`;
      const fileToSave = new Blob([JSON.stringify(draft)], {
        type: "application/json",
      });
      saveAs(fileToSave, fileName);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return {
    saveCanvasNetwork,
    draftsLoading,
    loadDraft,
  };
};

export default useDrafts;
