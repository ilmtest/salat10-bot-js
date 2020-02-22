const calculator = require("./calculator");

const stringify = t =>
  new Date(t).toLocaleString("en-US", {
    timeZone: "America/Toronto"
  });

describe("calculator", () => {
  it("should get correct results for DAS, Ottawa during winter (non-DST)", () => {
    const result = calculator(
      "45.3506",
      "-75.793",
      new Date(2020, 1, 20, 0, 24, 0)
    );
    Object.keys(result).forEach(
      event => (result[event] = stringify(result[event]))
    );

    expect(result.fajr).toEqual("2/20/2020, 5:54:37 AM");
    expect(result.sunrise).toEqual("2/20/2020, 6:59:08 AM");
    expect(result.dhuhr).toEqual("2/20/2020, 12:18:25 PM");
    expect(result.asr).toEqual("2/20/2020, 3:09:00 PM");
    expect(result.maghrib).toEqual("2/20/2020, 5:37:42 PM");
    expect(result.isha).toEqual("2/20/2020, 6:42:13 PM");
    expect(result.halfNight).toEqual("2/20/2020, 11:45:24 PM");
    expect(result.lastThirdNight).toEqual("2/21/2020, 1:47:57 AM");
  });
});
