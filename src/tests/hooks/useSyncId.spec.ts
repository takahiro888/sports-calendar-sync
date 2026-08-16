import { renderHook } from "@testing-library/react";
import { useSyncId } from "@/hooks/useSyncId";
import { beforeEach, describe, expect, vi, it } from "vitest";

describe("useSyncId", () => {
  beforeEach(() => {
    // localStorageをクリアして、テストごとに初期状態に戻す
    localStorage.clear();
  });

  it("初回はUUIDが生成されて返される", () => {
    const { result } = renderHook(() => useSyncId());
    expect(result.current).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it("生成したIDがlocalStorageに保存される", () => {
    const { result } = renderHook(() => useSyncId());
    const storedId = localStorage.getItem("sportsCalSyncId");
    expect(storedId).toBe(result.current);
  });

  it("localStorageに既存IDがあればそれを返す", () => {
    const existingId = "existing-uuid-1234";
    localStorage.setItem("sportsCalSyncId", existingId);

    const { result } = renderHook(() => useSyncId());
    expect(result.current).toBe(existingId);
  });

  it("既存IDがある場合は新しいUUIDを生成しない", () => {
    localStorage.setItem("sportsCalSyncId", "existing-uuid-1234");
    const spy = vi.spyOn(crypto, "randomUUID");

    renderHook(() => useSyncId());
    expect(spy).not.toHaveBeenCalled();
  });
});
