import omitDeep from "omit-deep";

const omit = (object: any, name: readonly string[]) => {
  return omitDeep(object, name);
};

export default omit;
