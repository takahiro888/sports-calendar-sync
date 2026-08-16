
import { useState, useEffect } from "react";
import type { Game } from "@/features/subscription/api/mlbApi";
import { fetchDodgerGames } from "@/features/subscription/api/mlbApi";

export const useGames = (season: number) => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    fetchDodgerGames(season)
      .then(setGames)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [season]);

  return { games, isLoading };
};