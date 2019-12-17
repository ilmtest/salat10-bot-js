const SunCalc = require("suncalc");
const { CalculationMethod, PrayerTimes, Coordinates } = require("adhan");

exports.calculate = (date, latitude, longitude) => {
  const {
    nauticalDawn: fajr,
    sunrise,
    sunset: maghrib,
    nauticalDusk: isha,
    solarNoon: dhuhr
  } = SunCalc.getTimes(date, latitude, longitude);
  const { asr } = new PrayerTimes(
    new Coordinates(latitude, longitude),
    date,
    CalculationMethod.MuslimWorldLeague()
  );

  return {
    fajr,
    sunrise,
    dhuhr,
    asr,
    maghrib,
    isha
  };
};
