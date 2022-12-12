import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FunctionComponent } from "react";

const Connect: FunctionComponent = (): JSX.Element => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }: any) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
                zIndex: "0",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <div
                    id={"connect"}
                    className="relative w-fit h-fit col-start-4 place-self-center cursor-pointer active:scale-95 hover:opacity-60 font-dosis p-2 border-2 border-white text-white bg-offBlue/40"
                    onClick={openConnectModal}
                  >
                    Connect
                  </div>
                );
              }

              if (chain.unsupported) {
                return (
                  <div
                    id={"switch"}
                    className="relative w-fit h-fit col-start-4 place-self-center cursor-pointer active:scale-95 hover:opacity-60 font-dosis p-2 border-2 border-white text-white bg-offBlue/40"
                    onClick={openChainModal}
                  >
                    Switch Network
                  </div>
                );
              }
              
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default Connect;
