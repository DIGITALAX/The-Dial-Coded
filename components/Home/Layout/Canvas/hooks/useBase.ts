import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { setInsufficientFunds } from "../../../../../redux/reducers/insufficientFunds";

const useBase = () => {
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchTarget, setSearchTarget] = useState<string>("");
  const [quickSearchResults, setQuickSearchResults] = useState<any[]>([]);
  const dispatch = useDispatch();
  const handleKeyEnter = async (e: any): Promise<void> => {
    setSearchLoading(true);
    if (e.key === "Enter") {
      console.log("now", e.target);
      if (e.target?.value !== "" || !e.target?.value) {
        const getLexicaImages = await fetch("/api/lexica", {
          method: "POST",
          body: JSON.stringify(searchTarget),
        });

        if (getLexicaImages.status === 200) {
          const { json } = await getLexicaImages.json();
          setQuickSearchResults(json?.images);
        } else {
          dispatch(setInsufficientFunds("images"));
          setSearchLoading(false);
        }
      }
    }
    setSearchLoading(false);
  };

  const handleChangeSearch = (e: FormEvent) => {
    setSearchTarget((e.target as HTMLFormElement).value);
  };

  const fillImages: string[] = [
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

  return {
    quickSearchResults,
    searchLoading,
    handleChangeSearch,
    searchTarget,
    handleKeyEnter,
    fillImages,
  };
};

export default useBase;
