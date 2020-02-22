const { formatAsObject, formatAsText } = require("./eventFormatter");
const axios = require("axios");

describe("eventFormatter", () => {
  let calculationResult;

  beforeEach(() => {
    axios.get.mockRestore();

    calculationResult = {
      fajr: new Date(1995, 11, 17, 1, 24, 0).getTime(),
      sunrise: new Date(1995, 11, 17, 2, 24, 0).getTime(),
      dhuhr: new Date(1995, 11, 17, 3, 24, 0).getTime(),
      asr: new Date(1995, 11, 17, 4, 24, 0).getTime(),
      maghrib: new Date(1995, 11, 17, 5, 24, 0).getTime(),
      isha: new Date(1995, 11, 17, 12, 24, 0).getTime(),
      halfNight: new Date(1995, 11, 17, 13, 24, 0).getTime(),
      lastThirdNight: new Date(1995, 11, 17, 20, 24, 0).getTime()
    };
  });

  describe("formatAsObject", () => {
    it("should properly format the date and times", async () => {
      axios.get.mockResolvedValue({
        data: {
          zoneName: "America/Toronto",
          dst: "0"
        }
      });

      const result = await formatAsObject(calculationResult, 1, 2);
      expect(result).toEqual({
        date: "Sunday, December 17, 1995",
        fajr: { label: "Fajr", time: "1:24 AM" },
        sunrise: { label: "Sunrise", time: "2:24 AM" },
        dhuhr: { label: "Dhuhr", time: "3:24 AM" },
        asr: { label: "ʿAṣr", time: "4:24 AM" },
        maghrib: { label: "Maġrib", time: "5:24 AM" },
        isha: { label: "ʿIshāʾ", time: "12:24 PM" },
        halfNight: { label: "1/2 Night Begins", time: "1:24 PM" },
        lastThirdNight: { label: "Last 1/3 Night Begins", time: "8:24 PM" }
      });
    });

    it("should properly format the DST adjusted date and times", async () => {
      axios.get.mockResolvedValue({
        data: {
          zoneName: "America/Toronto",
          dst: "1"
        }
      });

      const result = await formatAsObject(calculationResult, 1, 2);
      expect(result).toEqual({
        date: "Sunday, December 17, 1995",
        fajr: { label: "Fajr", time: "2:24 AM" },
        sunrise: { label: "Sunrise", time: "3:24 AM" },
        dhuhr: { label: "Dhuhr", time: "4:24 AM" },
        asr: { label: "ʿAṣr", time: "5:24 AM" },
        maghrib: { label: "Maġrib", time: "6:24 AM" },
        isha: { label: "ʿIshāʾ", time: "1:24 PM" },
        halfNight: { label: "1/2 Night Begins", time: "2:24 PM" },
        lastThirdNight: { label: "Last 1/3 Night Begins", time: "9:24 PM" }
      });
    });
  });

  describe("formatAsText", () => {
    it("should properly format the date and times", async () => {
      axios.get.mockResolvedValue({
        data: {
          zoneName: "America/Toronto",
          dst: "0"
        }
      });

      const result = await formatAsText(calculationResult, 1, 2);
      expect(result).toBe(
        "Sunday, December 17, 1995\n\nFajr: 1:24 AM\nSunrise: 2:24 AM\nDhuhr: 3:24 AM\nʿAṣr: 4:24 AM\nMaġrib: 5:24 AM\nʿIshāʾ: 12:24 PM\n1/2 Night Begins: 1:24 PM\nLast 1/3 Night Begins: 8:24 PM"
      );
    });

    it("should properly format the DST-adjusted date and times", async () => {
      axios.get.mockResolvedValue({
        data: {
          zoneName: "America/Toronto",
          dst: "1"
        }
      });

      const result = await formatAsText(calculationResult, 1, 2);
      expect(result).toBe(
        "Sunday, December 17, 1995\n\nFajr: 2:24 AM\nSunrise: 3:24 AM\nDhuhr: 4:24 AM\nʿAṣr: 5:24 AM\nMaġrib: 6:24 AM\nʿIshāʾ: 1:24 PM\n1/2 Night Begins: 2:24 PM\nLast 1/3 Night Begins: 9:24 PM"
      );
    });
  });
});
