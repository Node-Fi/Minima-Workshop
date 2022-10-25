import { TokenAmount } from "@dahlia-labs/token-utils";
import { useTokenMap } from "./useTokens";
import axios from "axios";
import { useDebouncedValue } from "@mantine/hooks";
import { useAccount, useNetwork, useQuery, useSigner } from "wagmi";

export type ZeroExOptions = {
  skipValidation: boolean;
};

export type RouterPayloadRequest = {
  sellToken: string;
  buyToken: string;
  sellAmount: string;
  takerAddress: string;
} & Partial<ZeroExOptions>;

export type RouterResponse = {
  buyAmount: string;
  allowanceTarget: string;
  to: string;
  value: string;
  gas: string;
  data: string;
  gasPrice: string;
  estimateGas: string;
};

const ZeroExQuery = async (params: RouterPayloadRequest) => {
  const resp = await axios.get<RouterResponse>(
    "https://avalanche.api.0x.org/swap/v1/quote",
    {
      params,
    }
  );

  return resp.data;
};

export const use0xTrade = (
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

      const result = await ZeroExQuery({
        sellToken: inputTokenAddress,
        buyToken: outputTokenAddress,
        sellAmount: inputAmount.raw.toString(),
        takerAddress: account.address,
        skipValidation: true,
      });

      console.log(result);

      return {
        expectedOutput: new TokenAmount(output, result.buyAmount),
        inputAmount,
        approvalAddress: result.allowanceTarget,
        txn: {
          to: result.to,
          data: result.data,
          gas: result.gas,
          gasPrice: result.gasPrice,
          estimateGas: result.estimateGas,
          from: account.address,
        },
      };
    }
  );
};
