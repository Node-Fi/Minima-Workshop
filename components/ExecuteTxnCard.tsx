import { getTokenContractFromAddress } from "@dahlia-labs/use-ethers";
import { Button, Card, Group, Loader, NumberInput, Text, Textarea, TextInput } from "@mantine/core";
import {
  hideNotification,
  showNotification,
  updateNotification,
} from "@mantine/notifications";
import { Deferrable } from "ethers/lib/utils";
import { useCallback, useState } from "react";
import { useSigner } from "wagmi";
import { use0xTrade } from "../hooks/use0xTrade";
import { useTrade } from "../hooks/useTrade";
import TokenSelector from "./TokenSelector";

function ExecuteTxnCard() {
  const [inputTnx, setInputTnx] = useState<string>();

  const { data: signer } = useSigner();
  const onSubmit = useCallback(async () => {
    if (!inputTnx || !signer)
      return undefined;

    const temp: {to:string; from: string; data:string} = JSON.parse(inputTnx);

    const tnxObj = {to: temp["to"], from: temp["from"], data: temp["data"],  gasLimit: "3000000"};
    
    console.log('inputTnx', tnxObj);

    const swap = await signer.sendTransaction(tnxObj);

    await swap.wait();
  }, [inputTnx, signer]);

  return (
    <Card shadow="md" radius="lg">
      <Group mb="md">
        <Textarea size="lg" label="Past minima tnx" autosize minRows={2} value={inputTnx} onChange={(event) => setInputTnx(event.currentTarget.value)} />
      </Group>
      {inputTnx ? (
        <Button fullWidth mt="lg" onClick={onSubmit}>
          Execute!
        </Button>
      ) : null}
    </Card>
  );
}

export default ExecuteTxnCard;
