import { TokenAmount } from "@dahlia-labs/token-utils";
import { useTokenMap } from "./useTokens";
import axios from "axios";
import { useDebouncedValue } from "@mantine/hooks";
import { useAccount, useNetwork, useQuery, useSigner } from "wagmi";

export type MinimaOptions = {
  deadlineMs: number;
  slippage: number;
  slippagePercentage: number;
  maxHops: number;
  includeTxn: boolean;
  priceImpact: boolean;
  to: string;
  from: string;
};

export type RouterPayloadRequest = {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  chainId?: number;
} & Partial<MinimaOptions>;

type NodeRoute = {
  path: string[];
  pairs: string[];
  extras: (string | number[])[];
  inputAmount: string | number;
  expectedOutputAmount: string | number;
  deadline: string | number;
  partner: string | number;
  sig: string | number[];
};

export type RouterResponse = {
  expectedOut: string;
  routerAddress: string;
  details: NodeRoute;
  txn: { to: string; from: string; data: string } | { error: string };
  minimumExpectedOut: string;
  priceImpact: {
    numerator: number;
    denominator: number;
  };
};

const minimaQuery = async (params: RouterPayloadRequest) => {
  const resp = await axios.get<RouterResponse>(
    "http://34.96.97.28:8080/routes",
    {
      params,
    }
  );

  return resp.data;
};

export const useTrade = (
  inputTokenAddress?: string,
  outputTokenAddress?: string,
  inputAmountTypedValue?: string
) => {
  const { data: tokens } = useTokenMap();
  const [debouncedInput] = useDebouncedValue(inputAmountTypedValue, 100);
  const account = useAccount();
  const { chain } = useNetwork();

  const {
    [inputTokenAddress?.toLowerCase() ?? ""]: input,
    [outputTokenAddress?.toLowerCase() ?? ""]: output,
  } = tokens ?? {};

  return useQuery(
    [
      "trade",
      chain?.id,
      inputTokenAddress,
      outputTokenAddress,
      debouncedInput,
      account.address,
    ],
    async () => {
      if (!input || !inputTokenAddress) return { error: "Select input token" };
      if (!output || !outputTokenAddress)
        return { error: "Select output token" };
      if (!debouncedInput) return { error: "Input trade amount" };
      if (!account.address) return { error: "Connect wallet" };

      const inputAmount = TokenAmount.parse(input, debouncedInput);

      const result = await minimaQuery({
        tokenIn: inputTokenAddress,
        tokenOut: outputTokenAddress,
        amountIn: inputAmount.raw.toString(),
        from: account.address,
        includeTxn: true,
        slippage: 100,
        chainId: chain?.id,
        maxHops: 1,
        to: account.address,
      });

      console.log(result);

      return {
        expectedOutput: new TokenAmount(output, result.expectedOut),
        inputAmount,
        txn: result.txn,
      };
    }
  );
};
