import { getTokenContractFromAddress } from "@dahlia-labs/use-ethers";
import { Button, Card, Group, Loader, NumberInput, Text } from "@mantine/core";
import {
  hideNotification,
  showNotification,
  updateNotification,
} from "@mantine/notifications";
import { useCallback, useState } from "react";
import { useSigner } from "wagmi";
import { use0xTrade } from "../hooks/use0xTrade";
import { useTrade } from "../hooks/useTrade";
import TokenSelector from "./TokenSelector";

function SwapCard() {
  const [inputToken, setInputToken] = useState<string>();
  const [outputToken, setOutputToken] = useState<string>();
  const [inputAmount, setInputAmount] = useState<number>();
  const [hash, setHash] = useState<string>();
  const trade = useTrade(inputToken, outputToken, inputAmount?.toString());
  const { data: signer } = useSigner();
  const onSubmit = useCallback(async () => {
    if (!inputToken || !outputToken || !inputAmount || !trade.data || !signer)
      return undefined;
    const { txn, inputAmount: decimalAdjustedInput } = trade.data;

    if (!txn || "error" in txn) return undefined;

    const erc20Contract = getTokenContractFromAddress(inputToken, signer);
    
    const approval = await erc20Contract.approve(
      txn.to,
      decimalAdjustedInput.raw.toString()
    );
    await approval.wait();

    const swap = await signer.sendTransaction({
      from: txn.from,
      to: txn.to,
      data: txn.data,
      gasLimit: "3000000",
    });

    await swap.wait();
  }, [inputToken, signer, trade, outputToken, inputAmount]);

  return (
    <Card shadow="md" radius="lg">
      <Group mb="md">
        <TokenSelector
          onSelectToken={setInputToken}
          selectedToken={inputToken}
          label="Input"
        />
        <NumberInput
          label="Input Amount"
          onChange={setInputAmount}
          value={inputAmount}
        />
      </Group>
      <Group align="end">
        <TokenSelector
          onSelectToken={setOutputToken}
          selectedToken={outputToken}
          label="Output"
        />
        {trade.isFetching ? (
          <Loader />
        ) : trade.isFetched ? (
          <Text size="xl">{trade.data?.expectedOutput?.toFixed(2)}</Text>
        ) : null}
      </Group>
      {trade.data ? (
        <Button fullWidth mt="lg" onClick={onSubmit}>
          Swap!
        </Button>
      ) : null}
      {hash ? (
        <Text mt="lg" color="green">{`Recent trade: ${hash}`}</Text>
      ) : null}
    </Card>
  );
}

export default SwapCard;
