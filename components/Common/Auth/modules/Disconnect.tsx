import { FunctionComponent } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Disconnect: FunctionComponent = () => {
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

              return (
                <div
                className="relative text-black row-start-2 w-fit h-fit place-self-center text-xs hover:opacity-60 cursor-pointer"
                  style={{ display: "flex", gap: 1, zIndex: "30" }}
                  onClick={openAccountModal}
                >
                  Disconnect Wallet
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
    )
}

export default Disconnect;