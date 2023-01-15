import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { UseDraftsResult } from "./../types/canvas.types";
import { saveAs } from "file-saver";
import { draftRegex } from "../../../../../lib/misc/helpers/removeElements";
import * as yup from "yup";
import { setDraftTitle } from "../../../../../redux/reducers/draftTitleSlice";
import { setDraftElements } from "../../../../../redux/reducers/draftElementsSlice";

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
      if (valid && draftRegex.test(JSON.stringify(res))) {
        dispatch(setDraftTitle(res.title));
        const elements = await new Response(res.elements).json();
        let parsedElements = [];
        console.log(JSON.parse(elements[0]))
        for (let i = 0; i < elements.length - 1; i++) {
          if (JSON.parse(elements)[i].type === "image") {
            console.log("hi")
          } else {
            parsedElements.push(JSON.parse(elements[i]));
          }
          
        }

        console.log(parsedElements)
        // const res: Response = await fetch(imgURL);
        // const blob: Blob = await res.blob();
        // const postImage = new File([blob], "thedial_drafts", {
        //   type: "image/png",
        // });
        // await handleImageAdd(postImage, true);
        // dispatch(setDraftElements(parsedElements));
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
