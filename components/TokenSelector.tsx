import { useTokenList, useTokenMap } from "../hooks/useTokens";
import { Select, SelectItem } from "@mantine/core";
import { useMemo } from "react";

interface TokenSelectorProps {
  onSelectToken: (addr: string) => void;
  selectedToken?: string;
  label?: string;
}

function TokenSelector({
  onSelectToken,
  selectedToken,
  label = "Select Token",
}: TokenSelectorProps) {
  const tokenList = useTokenList();

  const data = useMemo(
    () =>
      tokenList?.data?.map(
        (t) =>
          ({
            value: t.address,
            label: t.symbol,
            image: t.icon,
            name: t.name,
          } as SelectItem)
      ) ?? [],
    [tokenList]
  );
  return (
    <Select
      data={data}
      allowDeselect
      label={label}
      value={selectedToken}
      onChange={onSelectToken}
      searchable
    />
  );
}

export default TokenSelector;
