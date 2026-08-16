import { SyncItemCard } from "@/features/subscription/components/SyncItemCard";
import type { SyncItem } from "@/types/sync";
import { render, screen } from "@testing-library/react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// テスト用の最小限 SyncItem
const item: SyncItem = {
  id: "dodgers",
  title: "ドジャース全試合",
  description: "今シーズン全162試合",
  badge: "チーム",
};

describe("SyncItemCard", () => {
  it("タイトル・説明・バッジが表示される", () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <SyncItemCard item={item} checked={false} onChange={vi.fn()} />
      </ChakraProvider>,
    );

    expect(screen.getByText("ドジャース全試合")).toBeInTheDocument();
    expect(screen.getByText("今シーズン全162試合")).toBeInTheDocument();
    expect(screen.getByText("チーム")).toBeInTheDocument();
  });

  it("subDescriptionがある場合は表示される", () => {
    const itemWithSub = {
      ...item,
      subDescription: "(今後 10試合 / 過去 5試合)",
    };
    render(
      <ChakraProvider value={defaultSystem}>
        <SyncItemCard item={itemWithSub} checked={false} onChange={vi.fn()} />
      </ChakraProvider>,
    );

    expect(screen.getByText("(今後 10試合 / 過去 5試合)")).toBeInTheDocument();
  });

  it("カードをクリックするとonChangeがidとtrueで呼ばれる", async () => {
    const handleChange = vi.fn();
    render(
      <ChakraProvider value={defaultSystem}>
        <SyncItemCard item={item} checked={false} onChange={handleChange} />
      </ChakraProvider>,
    );

    await userEvent.click(screen.getByText("ドジャース全試合"));

    expect(handleChange).toHaveBeenCalledWith("dodgers", true);
  });

  it("checked=trueのときonChangeがidとfalseで呼ばれる（選択解除）", async () => {
    const handleChange = vi.fn();
    render(
      <ChakraProvider value={defaultSystem}>
        <SyncItemCard item={item} checked={true} onChange={handleChange} />
      </ChakraProvider>,
    );

    await userEvent.click(screen.getByText("ドジャース全試合"));

    expect(handleChange).toHaveBeenCalledWith("dodgers", false);
  });

  it("disableのカードはクリックしてもonChangeが呼ばれない", async () => {
    const handleChange = vi.fn();
    const disabledItem = { ...item, disabled: true };
    render(
      <ChakraProvider value={defaultSystem}>
        <SyncItemCard
          item={disabledItem}
          checked={false}
          onChange={handleChange}
        />
      </ChakraProvider>,
    );

    await userEvent.click(screen.getByText("ドジャース全試合"));

    expect(handleChange).not.toHaveBeenCalled();
  });
});
