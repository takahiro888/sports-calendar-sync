import type { Game } from "@/features/subscription/api/mlbApi";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GamePreviewSection } from "@/features/subscription/components/GamePreviewSection";

const makeGame = (id: number, date: string): Game => ({
  id,
  date,
  time: "19:00",
  matchup: "ドジャース vs ヤンキース",
  location: "HOME",
  broadcast: "NHK",
  tag: "ドジャース全試合",
});

describe("GamePreviewSection", () => {
  it("isLoading=trueのときスピナーが表示される", () => {
    const { container } = render(
      <ChakraProvider value={defaultSystem}>
        <GamePreviewSection filteredGames={[]} isLoading={true} />
      </ChakraProvider>,
    );
    expect(container.querySelector(".chakra-spinner")).toBeInTheDocument();
  });

  it("試合リストが渡されると試合の情報が表示される", () => {
    const games = [makeGame(1, "08/16")];
    render(
      <ChakraProvider value={defaultSystem}>
        <GamePreviewSection filteredGames={games} isLoading={false} />
      </ChakraProvider>,
    );
    expect(
      screen.getAllByText("ドジャース vs ヤンキース")[0],
    ).toBeInTheDocument();
  });

  it("試合が0件のとき案内メッセージが表示される", () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <GamePreviewSection filteredGames={[]} isLoading={false} />
      </ChakraProvider>,
    );
    expect(screen.getByText(/同期対象が選ばれていません/i)).toBeInTheDocument();
  });

  it("試合数バッジに正しい件数が表示される", () => {
    const games = [makeGame(1, "08/16"), makeGame(2, "08/20")];
    render(
      <ChakraProvider value={defaultSystem}>
        <GamePreviewSection filteredGames={games} isLoading={false} />
      </ChakraProvider>,
    );
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
