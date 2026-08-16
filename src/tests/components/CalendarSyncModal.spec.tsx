import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { CalendarSyncModal } from "@/features/subscription/components/CalendarSyncModal";

const baseProps = {
  calendarUrl: "https://example.com/ical/dodgers?s=test-id",
  onClose: vi.fn(),
};

describe("CalendarSyncModal", () => {
  beforeEach(() => {
    vi.stubGlobal("gtag", vi.fn());
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      writable: true,
    });
  });

  it("type='google'のとき、Google向けのUIが表示される", () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <CalendarSyncModal {...baseProps} type="google" />
      </ChakraProvider>,
    );

    expect(
      screen.getByRole("button", { name: /Googleカレンダー/i }),
    ).toBeInTheDocument();
  });

  it("type='apple'のとき、Apple向けのUIが表示される", () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <CalendarSyncModal {...baseProps} type="apple" />
      </ChakraProvider>,
    );

    expect(
      screen.getByRole("button", { name: /Appleカレンダー/i }),
    ).toBeInTheDocument();
  });

  it("type='apple'のときcalendarUrlがwebcal://に変換されて表示される", async () => {
    const hrefSetter = vi.fn();
    vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      set href(url: string) {
        hrefSetter(url);
      },
    } as unknown as Location);

    render(
      <ChakraProvider value={defaultSystem}>
        <CalendarSyncModal {...baseProps} type="apple" />
      </ChakraProvider>,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Appleカレンダー/i }),
    );
    expect(hrefSetter).toHaveBeenCalledWith(
      "webcal://example.com/ical/dodgers?s=test-id",
    );
  });

  it("コピーボタンを押すと完了フィードバックが表示される", async () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <CalendarSyncModal {...baseProps} type="google" />
      </ChakraProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: /コピー/i }));
    expect(await screen.findByText(/コピー済み/i)).toBeInTheDocument();
  });

  it("オーバーレイをクリックするとonCloseが呼ばれる", async () => {
    const handleClose = vi.fn();
    const { container } = render(
      <ChakraProvider value={defaultSystem}>
        <CalendarSyncModal {...baseProps} type="google" onClose={handleClose} />
      </ChakraProvider>,
    );

    const overlay = container.firstChild as HTMLElement;
    await userEvent.click(overlay);
    expect(handleClose).toHaveBeenCalled();
  });
});
