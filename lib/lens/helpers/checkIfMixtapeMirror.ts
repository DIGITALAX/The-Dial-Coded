import lodash from "lodash";

const checkIfMixtapeMirror = (arr: any[]): boolean[] => {
  let checkedArr: boolean[] = [];
  lodash.filter(arr, (item) => {
    if (item?.__typename === "Mirror") {
      if (item?.mirrorOf?.metadata?.content.includes("*Dial Mixtape*")) {
        checkedArr.push(true);
      } else {
        checkedArr.push(false);
      }
    } else {
      checkedArr.push(false);
    }
  });

  return checkedArr;
};

export default checkIfMixtapeMirror;
