import { fireEvent, render, screen } from "@testing-library/react";
import CardNumberMaskedField from "./CardNumberMaskedField";

describe("CardNumberMaskedField", () => {
  it("updates the displayed card when the selected row changes", () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <CardNumberMaskedField
        name="cardnumber"
        value="4551290702573033"
        onChange={onChange}
      />
    );

    expect(screen.getByRole("textbox")).toHaveValue("4551 2907 0257 3033");

    rerender(
      <CardNumberMaskedField
        name="cardnumber"
        value="5312600050044436"
        onChange={onChange}
      />
    );

    expect(screen.getByRole("textbox")).toHaveValue("5312 6000 5004 4436");
  });

  it("returns only digits to the form state", () => {
    const onChange = jest.fn();
    render(
      <CardNumberMaskedField
        name="cardnumber"
        value=""
        onChange={onChange}
      />
    );

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "4551 2907 0257 3033" },
    });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          name: "cardnumber",
          value: "4551290702573033",
        }),
      })
    );
  });
});
