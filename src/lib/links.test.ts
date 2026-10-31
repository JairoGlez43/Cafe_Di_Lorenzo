import { describe, expect, it } from "vitest";
import { comoLlegarUrl, instagramUrl, whatsappUrl } from "./links";

describe("comoLlegarUrl", () => {
  it("builds a Google Maps directions URL with the destination encoded", () => {
    expect(comoLlegarUrl("Café Di Lorenzo, Calle 20 e/ 31A y 33, Miramar")).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=" +
        "Caf%C3%A9%20Di%20Lorenzo%2C%20Calle%2020%20e%2F%2031A%20y%2033%2C%20Miramar",
    );
  });
});

describe("whatsappUrl", () => {
  it.each([
    ["+53 50539476"],
    ["(+53) 5053-9476"],
    ["0053 50539476"],
  ])("keeps only the international digits of %s", (numero) => {
    expect(whatsappUrl(numero)).toBe("https://wa.me/5350539476");
  });
});

describe("instagramUrl", () => {
  it.each([["cafe_dilorenzo_habana"], ["@cafe_dilorenzo_habana"]])(
    "links to the profile of %s",
    (usuario) => {
      expect(instagramUrl(usuario)).toBe("https://www.instagram.com/cafe_dilorenzo_habana/");
    },
  );
});
