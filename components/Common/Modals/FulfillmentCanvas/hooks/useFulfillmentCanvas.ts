import { useState } from "react";

const useFulfillmentCanvas = () => {
  const [notes, setNotes] = useState<string>("");
  const [amount, setAmount] = useState<number>(1);
  const [sizes, setSizes] = useState<string[]>([]);
  const [baseColor, setBaseColor] = useState<string>("amarillo");
  const [payment, setPayment] = useState<string>();

  return {
    notes,
    setNotes,
    amount,
    setAmount,
    sizes,
    setSizes,
    baseColor,
    setBaseColor,
    payment,
    setPayment,
  };
};

export default useFulfillmentCanvas;
