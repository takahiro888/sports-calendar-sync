import type { Game } from "@/features/subscription/api/mlbApi";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import * as mlbApi from "@/features/subscription/api/mlbApi";
import { useGames } from "@/hooks/useGames";

// モジュール全体をモック
vi.mock("@/features/subscription/api/mlbApi");

const mockGame = (): Game => ({
  id: 1,
  date: "08/16",
  time: "12:00",
  matchup: "ドジャース vs ヤンキース",
  location: "HOME",
  broadcast: "-",
  tag: "ドジャース全試合",
});

describe("useGames", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("初期状態は isLoading:true, games:[]である", () => {
    vi.mocked(mlbApi.fetchDodgerGames).mockResolvedValue([mockGame()]);

    const { result } = renderHook(() => useGames(2026));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.games).toEqual([]);
  });

  it("API成功後にgamesがセットされ、isLoadingがfalseになる", async () => {
    vi.mocked(mlbApi.fetchDodgerGames).mockResolvedValue([mockGame()]);

    const { result } = renderHook(() => useGames(2026));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.games).toEqual([mockGame()]);
  });

  it("APIエラー時はgames:[]のまま isLoadingがfalseになる", async () => {
    vi.mocked(mlbApi.fetchDodgerGames).mockRejectedValue(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useGames(2026));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.games).toEqual([]);
  });
});
