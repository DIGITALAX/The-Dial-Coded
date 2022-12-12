import { useDispatch } from "react-redux";
import { setMixtapePage } from "../../../../../redux/reducers/mixtapePageSlice";
import { Message } from "../../../../Common/types/common.types";
import { UseMixtapeResults } from "../types/mixtape.types";

const useMixtape = (): UseMixtapeResults => {
  const dispatch = useDispatch();

  const mixtapeTitles: string[] = [
    "instant sampler",
    "latent waves",
    "Synth",
    "infinite runway",
    "public memory",
    "eigensocial",
    "reflex",
    "forever records",
    "per DIa.m",
    "AI ART DROP",
    "latent sounds",
    "random curation",
  ];

  const handleTapeSet = (title: string): void => {
    dispatch(setMixtapePage(title));
  };

  const notificationImages: string[] = [
    "QmWR9hQkHLZ8VwWMCX1mnDUgabniBr7SuvSA4JpDVmUrjX",
    "QmUFEhfqFsKAnTPZaL8Ln9yaz8QPNiJNnuvbStZmXvage3",
    "QmZ6Theb5qCCscnBZhYZK2epoJftL67yLsD3JweBkBXtvK",
    "QmXfuFr8qDbajQ4nCTnrb4bfdrZgD7TymxMziSukyqxHk2",
  ];

  const backgroundImages: string[] = [
    "QmYAkxnWQsPJW3JMhppDkuuZsTe9ZzMK9tYi1V2QkpiWTu",
    "QmWYxU3VTECDRPCndpsD4GF1WDiECcgHu2YA33ugjVyewG",
    "QmRe72544oLTxq1gA4zvXS7SVXuKhqbdr4ioheFPgKYuYY",
    "QmY54nAeKfHJBZN224HbbejhAcks5Bsqo3RSoG6qaWskHC",
    "QmRiHSR28A8R8Lg3tGQtv3Rwwv7DiiZC79GsW8ori3KxiN",
    "QmYgqmyXwo5TdSkFkdKBLBW2NyK6296R19aRnAcS8w8UCA",
    "QmS4mHgwTnVbb4vpuXdcfKLzhkg3fTsT1rAuUyfkiVL8Y3",
    "QmXWMcUuhyJnpD3fEDHk1VjsLtc5QCdohJwo9z5z7aXEwu",
    "QmVyb7eW2RPAs45qPdtb9v2c24eP5zZgFh4o8ZtqFm8PPU",
    "QmcYd24Uihwb7c39XUyVz1vsMKMy6MQMWPJMFtUVAUqvRY",
    "QmYAkxnWQsPJW3JMhppDkuuZsTe9ZzMK9tYi1V2QkpiWTu",
    "QmcYd24Uihwb7c39XUyVz1vsMKMy6MQMWPJMFtUVAUqvRY",
    "QmRe72544oLTxq1gA4zvXS7SVXuKhqbdr4ioheFPgKYuYY",
  ];

  const message: Message = {
    title: "The dial in retro*",
    paragraph: "A New Mix Made For You To Evolve & Enjoy Each Week",
  };

  return {
    mixtapeTitles,
    handleTapeSet,
    notificationImages,
    backgroundImages,
    message,
  };
};
export default useMixtape;