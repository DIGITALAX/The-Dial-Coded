import React, { FunctionComponent } from "react";
import CollectButton from "../../../Miscellaneous/CollectButton/CollectButton";
import { CollectOptionsModalProps } from "../../../types/common.types";
import CollectInput from "./CollectInput";
import { useMediaQuery } from "@material-ui/core";

const CollectOptionsModal: FunctionComponent<CollectOptionsModalProps> = ({
  enabledCurrencies,
  audienceTypes,
  handleCollectValues,
  setAudienceType,
  audienceType,
  setEnabledCurrency,
  enabledCurrency,
  setChargeCollectDropDown,
  setAudienceDropDown,
  setCurrencyDropDown,
  chargeCollectDropDown,
  audienceDropDown,
  currencyDropDown,
  dispatch,
  referral,
  setReferral,
  value,
  setValue,
  limit,
  setLimit,
  collectibleDropDown,
  setCollectibleDropDown,
  collectible,
  setCollectible,
  chargeCollect,
  setChargeCollect,
  limitedEdition,
  setLimitedEdition,
  limitedDropDown,
  setLimitedDropDown,
  setTimeLimit,
  timeLimit,
  timeLimitDropDown,
  setTimeLimitDropDown,
}): JSX.Element | null => {
  let queryWindowSize570: boolean = useMediaQuery("(max-width:570px)");
  let queryWindowSize450: boolean = useMediaQuery("(max-width:450px)");
  return (
    <div className="inset-0 justify-center fixed z-40 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-fit h-fit col-start-1 place-self-center bg-white/95 rounded-lg p-3">
        <div className="relative w-fit h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-fit h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-fit h-full grid grid-flow-row auto-rows-auto gap-10">
              <div className="relative w-fit h-fit row-start-1 grid grid-flow-row auto-rows-auto place-self-start gap-3 px-4">
                <CollectButton
                  col={"1"}
                  row={"1"}
                  selectFunction={setCollectible}
                  openDropdown={collectibleDropDown}
                  handleOpenDropdown={setCollectibleDropDown}
                  selectValue={collectible}
                  label={"Is this post collectible?"}
                />
                {collectible === "yes" && (
                  <CollectButton
                    col={!queryWindowSize450 ? "2" : "1"}
                    row={!queryWindowSize450 ? "1" : "2"}
                    values={audienceTypes}
                    selectFunction={setAudienceType}
                    openDropdown={audienceDropDown}
                    handleOpenDropdown={setAudienceDropDown}
                    selectValue={audienceType}
                    label={"Who can collect your post?"}
                  />
                )}
                {collectible === "yes" && chargeCollect === "yes" && (
                  <CollectButton
                    col={"1"}
                    row={!queryWindowSize450 ? "4" : "8"}
                    selectFunction={setTimeLimit}
                    openDropdown={timeLimitDropDown}
                    handleOpenDropdown={setTimeLimitDropDown}
                    selectValue={timeLimit}
                    label={"Limit collects to 24 hours"}
                  />
                )}
                {collectible === "yes" && chargeCollect === "yes" && (
                  <CollectButton
                    col={!queryWindowSize450 ? "2" : "1"}
                    row={!queryWindowSize450 ? "4" : "7"}
                    selectFunction={setLimitedEdition}
                    openDropdown={limitedDropDown}
                    handleOpenDropdown={setLimitedDropDown}
                    selectValue={limitedEdition}
                    label={"Is this a limited edition post?"}
                  />
                )}
                {collectible === "yes" &&
                  limitedEdition === "yes" &&
                  chargeCollect === "yes" && (
                    <CollectInput
                      min="1"
                      step="1"
                      defaultValue={limit.toString()}
                      placeholder={limit.toString()}
                      id="collectLimit"
                      label="Limited Edition"
                      name="collectLimit"
                      col={!queryWindowSize570 ? "3" : "1"}
                      row={
                        !queryWindowSize570
                          ? "4"
                          : !queryWindowSize450
                          ? "5"
                          : "9"
                      }
                      valueChange={limit}
                      handleValueChange={setLimit}
                    />
                  )}
                {collectible === "yes" && (
                  <CollectButton
                    col={"1"}
                    row={!queryWindowSize450 ? "2" : "3"}
                    selectFunction={setChargeCollect}
                    openDropdown={chargeCollectDropDown}
                    handleOpenDropdown={setChargeCollectDropDown}
                    selectValue={chargeCollect}
                    label={"Set awards for creator when collected?"}
                  />
                )}
                {collectible === "yes" && chargeCollect === "yes" && (
                  <CollectButton
                    col={!queryWindowSize450 ? "2" : "1"}
                    row={!queryWindowSize450 ? "2" : "4"}
                    values={enabledCurrencies}
                    selectFunction={setEnabledCurrency}
                    openDropdown={currencyDropDown}
                    handleOpenDropdown={setCurrencyDropDown}
                    selectValue={enabledCurrency}
                    label={"Choose an award currency"}
                  />
                )}
                {collectible === "yes" && chargeCollect === "yes" && (
                  <CollectInput
                    min="0"
                    defaultValue={value.toString()}
                    placeholder={value.toString()}
                    id="valueAmount"
                    label="Award amount"
                    name="valueAmount"
                    col={!queryWindowSize570 ? "3" : "1"}
                    row={
                      !queryWindowSize570
                        ? "2"
                        : !queryWindowSize450
                        ? "3"
                        : "5"
                    }
                    step="0.00001"
                    valueChange={value}
                    handleValueChange={setValue}
                  />
                )}
                {collectible === "yes" && chargeCollect === "yes" && (
                  <CollectInput
                    min="0"
                    max="100"
                    defaultValue={referral.toString()}
                    placeholder={referral.toString()}
                    id="referral"
                    label="Pass along awards for mirrored posts (%)"
                    name="referral"
                    col={
                      !queryWindowSize570
                        ? "1"
                        : !queryWindowSize450
                        ? "2"
                        : "1"
                    }
                    row={!queryWindowSize450 ? "3" : "6"}
                    step="0.1"
                    valueChange={referral}
                    handleValueChange={setReferral}
                  />
                )}
              </div>
              <div className="relative w-fit text-base justify-self-center self-center text-center h-fit row-start-2 text-black font-dosis capitalize py-2 px-4 whitespace-pre-wrap break-all">
                {collectible === "yes" ? (
                  <p>
                    <a className="underline decoration-offBlue">
                      {" "}
                      {`${
                        audienceType === "everyone" ? "anyone" : audienceType
                      } `}{" "}
                    </a>{" "}
                    can collect your post{" "}
                    <a className="underline decoration-offBlue">
                      {" "}
                      {`${
                        timeLimit === "yes" ? "for 24 hrs" : "to infinity ∞"
                      }`}
                    </a>
                    <a className="underline decoration-offBlue">
                      {`${
                        limitedEdition === "yes" && limit !== 0
                          ? ` or until ${
                              limit > 1
                                ? `all ${limit} editions have`
                                : "the edition has"
                            } been collected`
                          : "."
                      }`}{" "}
                    </a>
                    <br />
                    {chargeCollect === "yes" && value > 0 && (
                      <p>
                        You&apos;ll receive an award in{" "}
                        <a className="underline decoration-offBlue">
                          {enabledCurrency}
                        </a>{" "}
                        of{" "}
                        <a className="underline decoration-offBlue">${value}</a>{" "}
                        each time someone collects your post.
                      </p>
                    )}
                    <br />
                    {referral > 0 && (
                      <a>
                        You&apos;ll pass on an award of{" "}
                        <a className="underline decoration-offBlue">
                          {referral}%
                        </a>{" "}
                        each time your post is mirrored.
                      </a>
                    )}
                  </p>
                ) : (
                  <p>No one can collect your post.</p>
                )}
              </div>
              <div
                className="relative w-fit h-fit grid grid-flow-col auto-cols-auto row-start-3 cursor-pointer active:scale-95 bg-offBlue/80 font-dosis text-white rounded-md place-self-end"
                onClick={() => handleCollectValues()}
              >
                <div className="relative w-fit h-fit place-self-center col-start-1 text-sm p-2 text-center">
                  Set Collect Values
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectOptionsModal;
