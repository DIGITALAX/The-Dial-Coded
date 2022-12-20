import { useState } from "react";
import getPublication from "../../../../graphql/queries/getPublication";

const usePostPage = () => {
  const [publicationDataLoading, setPublicationDataLoading] = useState<any>();
  const [publicationData, setPublicationData] = useState<any>();

  const getPublicationData = async (id: string): Promise<void> => {
    setPublicationDataLoading(true);
    try {
      const { data } = await getPublication({
        publicationId: id,
      });
      setPublicationData(data?.publication);
    } catch (err: any) {
      console.error(err.message);
    }
    setPublicationDataLoading(false);
  };
  
  return { publicationDataLoading, getPublicationData, publicationData };
};

export default usePostPage;
