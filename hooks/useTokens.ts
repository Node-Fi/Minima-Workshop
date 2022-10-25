import { Token } from "@dahlia-labs/token-utils";
import axios from "axios";
import { useMemo } from "react";
import { useNetwork, useQuery } from "wagmi";

export interface SerializedToken {
  address: string;
  chainId: number;
  logoURI: string;
  name: string;
  symbol: string;
  decimals: number;
}

export const useTokenList = () => {
  const { chain } = useNetwork();

  const fetchTokens = async () => {
    const resp = await fetch(
      `https://raw.githubusercontent.com/Node-Fi/node-finance-token-list/main/build/${chain.id}-tokens.json`
    );

    const tokens = (await resp.json()) as SerializedToken[];

    const supportedTokens = await axios.get<{ tokens: string[] }>(
      "https://staging.router.nodefinance.org/tokens",
      {
        params: {
          chainId: chain?.id,
        },
      }
    );

    const inclusionSet = new Set(
      supportedTokens.data?.tokens.map((s) => s.toLowerCase()) ?? []
    );

    return tokens
      .filter((t) => inclusionSet.has(t.address.toLowerCase()))
      .map((t) => new Token(t));
  };

  return useQuery(["tokens", chain], fetchTokens, { cacheTime: 0 });
};

export const useTokenMap = () => {
  const { data: tokenList, ...rest } = useTokenList();

  return useMemo(
    () => ({
      data: tokenList?.reduce(
        (accum, cur) => ({
          ...accum,
          [cur.address.toLowerCase()]: cur,
        }),
        {} as { [address: string]: Token }
      ),
      ...rest,
    }),
    [tokenList, rest]
  );
};
