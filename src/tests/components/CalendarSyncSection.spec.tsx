import { CalendarSyncSection } from "@/features/subscription/components/CalendarSyncSection";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("CalendarSyncSection", () => {
  it("GoogleとAppleの選択ボタンが表示される", () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <CalendarSyncSection onSync={vi.fn()} />
      </ChakraProvider>,
    );

    expect(screen.getByRole("button", { name: /Google/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /iPhone/i })).toBeInTheDocument();
  });

  it("GoogleボタンをクリックするとonSync('google')が呼ばれる", async () => {
    const handleSync = vi.fn();
    render(
      <ChakraProvider value={defaultSystem}>
        <CalendarSyncSection onSync={handleSync} />
      </ChakraProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: /Google/i }));

    expect(handleSync).toHaveBeenCalledWith("google");
  });

  it("AppleボタンをクリックするとonSync('apple')が呼ばれる", async () => {
    const handleSync = vi.fn();
    render(
      <ChakraProvider value={defaultSystem}>
        <CalendarSyncSection onSync={handleSync} />
      </ChakraProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: /iPhone/i }));

    expect(handleSync).toHaveBeenCalledWith("apple");
  });
});
