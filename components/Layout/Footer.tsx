import Image from "next/image";
import Link from "next/link";
import { FunctionComponent } from "react";
import { BsTwitter } from "react-icons/bs";
import { INFURA_GATEWAY } from "../../lib/lens/constants";

const Footer: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative bottom-0 w-full h-72 grid grid-flow-col auto-cols-auto p-6">
      <div className="relative w-fit h-fit self-end justify-self-start col-start-1">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmezZzto6fapjAkN5mT18WFZ2vHRHAoxx4CL74GRwzcDTM`}
          alt="grid"
          width={26}
          height={26}
        />
      </div>
      <div className="col-start-2 grid grid-flow-col auto-cols-auto relative h-fit w-fit gap-3 place-self-end">
        <div className="relative w-fit h-fit col-start-1 place-self-end">
          <Link
            href={"https://blog.digitalax.xyz/"}
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmagzBh9TbN3YvYsUZ9cwxwceb6n2NNtbEixtVZbpioQyb`}
              width={27}
              height={32}
              priority
              className="h-fit relative pr-1"
              alt="mirror"
            />
          </Link>
        </div>
        <div className="relative w-fit h-fit col-start-2 place-self-end">
          <Link
            href={"https://github.com/digitalax"}
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmS3VAwkxRAecoENrF1dPsG7zMoJYiJzdJy7YBx3K5o1Rr`}
              alt="github"
              width={29}
              height={28}
              priority
            />
          </Link>
        </div>
        <div className="relative w-fit h-fit col-start-3">
          <Link
            href={"https://lenster.xyz/u/digitalax.lens"}
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmSLfNX9cjYoMPqec8WHEZfDV79WMdhSZZu64tTf2nP5Xk`}
              alt="lens"
              width={30}
              height={30}
              priority
            />
          </Link>
        </div>
        <div className="relative w-fit h-fit col-start-4">
          <Link
            href={"https://twitter.com/digitalax_"}
            target="_blank"
            rel="noreferrer"
          >
            <BsTwitter size={30} color={"#0091FF"} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
