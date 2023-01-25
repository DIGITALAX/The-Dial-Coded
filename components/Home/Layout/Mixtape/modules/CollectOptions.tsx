import { FunctionComponent } from "react";
import CollectButton from "../../../../Common/Miscellaneous/CollectButton/CollectButton";
import MixCheckCollect from "../../../../Common/Miscellaneous/Mixtape/MixCheck/MixCheckCollect";
import CollectInput from "../../../../Common/Modals/Publications/modules/CollectInput";
import { CollectOptionsMixtapeProps } from "../../../../Common/types/common.types";

const CollectOptions: FunctionComponent<CollectOptionsMixtapeProps> = ({
  enabledCurrencies,
  audienceType,
  setAudienceType,
  setEnabledCurrency,
  enabledCurrency,
  setCurrencyDropDown,
  currencyDropDown,
  referral,
  setReferral,
  value,
  setValue,
  limit,
  setLimit,
  collectible,
  setCollectible,
  chargeCollect,
  setChargeCollect,
  limitedEdition,
  setLimitedEdition,
  setTimeLimit,
  timeLimit,
}): JSX.Element => {
  return (
    <div className="relative w-fit h-fit rounded-xl flex flex-row flex-wrap">
      <div className="relative w-fit h-full flex flex-row flex-wrap rounded-xl place-self-center">
        <div className="relative w-fit h-full flex flex-row flex-wrap  gap-10">
          <div className="relative w-fit h-fit flex flex-row flex-wrap gap-3">
            <MixCheckCollect
              handleClicked={setCollectible}
              valueClicked={collectible}
              label={"Collectible?"}
              col={"1"}
              row={"1"}
            />
            {collectible === "yes" && (
              <MixCheckCollect
                handleClicked={setAudienceType}
                valueClicked={audienceType}
                label={"Followers Only?"}
                col={"2"}
                row={"1"}
              />
            )}
            {collectible === "yes" && (
              <MixCheckCollect
                handleClicked={setChargeCollect}
                valueClicked={chargeCollect}
                label={"Creator Awards?"}
                col={"3"}
                row={"1"}
              />
            )}
            {collectible === "yes" && chargeCollect === "yes" && (
              <CollectButton
                col={"4"}
                row={"1"}
                values={enabledCurrencies}
                selectFunction={setEnabledCurrency}
                openDropdown={currencyDropDown}
                handleOpenDropdown={setCurrencyDropDown}
                selectValue={enabledCurrency}
                label={"Award Currency"}
                mixtape={true}
              />
            )}
            {collectible === "yes" && chargeCollect === "yes" && (
              <CollectInput
                min="0"
                defaultValue={value.toString()}
                placeholder={value.toString()}
                id="valueAmount"
                label="Award Amount"
                name="valueAmount"
                col="1"
                row="2"
                step="0.00001"
                valueChange={value}
                handleValueChange={setValue}
                mixtape={true}
              />
            )}
            {collectible === "yes" && chargeCollect === "yes" && (
              <CollectInput
                min="0"
                max="100"
                defaultValue={referral.toString()}
                placeholder={referral.toString()}
                id="referral"
                label="Mirror Awards"
                name="referral"
                col="2"
                row="2"
                step="0.1"
                valueChange={referral}
                handleValueChange={setReferral}
                mixtape={true}
              />
            )}
            {collectible === "yes" && chargeCollect === "yes" && (
              <MixCheckCollect
                handleClicked={setTimeLimit}
                valueClicked={timeLimit}
                label={"24 Hours Only?"}
                col={"3"}
                row={"2"}
              />
            )}
            <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto col-start-4 row-start-2 gap-3">
              {collectible === "yes" && chargeCollect === "yes" && (
                <MixCheckCollect
                  handleClicked={setLimitedEdition}
                  valueClicked={limitedEdition}
                  label={"Limited Edition?"}
                  col={"1"}
                  row={"1"}
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
                    col="2"
                    row="1"
                    valueChange={limit}
                    handleValueChange={setLimit}
                    mixtape={true}
                  />
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectOptions;
