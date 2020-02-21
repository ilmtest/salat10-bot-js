const SunCalc = require("suncalc");
const { CalculationMethod, PrayerTimes, Coordinates } = require("adhan");

const extractTime = data => data.getTime();

const calculate = (date, latitude, longitude) => {
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

const calculateForCoordinates = (latitude, longitude) => {
  const now = new Date();
  now.setUTCHours(12); // we set it to 12 since we want it for that specific day, so we should get a good average
  now.setUTCMinutes(0);
  now.setUTCSeconds(0);
  now.setUTCMilliseconds(0);

  const today = calculate(now, Number(latitude), Number(longitude));

  const next = new Date(now.getTime());
  next.setUTCHours(12); // for some reason by default it sets it to 5AM
  next.setUTCDate(next.getUTCDate() + 1);

  const tomorrow = calculate(next, Number(latitude), Number(longitude));

  const halfNight = new Date(
    (today.maghrib.getTime() + tomorrow.fajr.getTime()) / 2
  );

  const diff = tomorrow.fajr.getTime() - today.maghrib.getTime();
  const lastThirdNight = new Date(tomorrow.fajr.getTime() - diff / 3);

  return {
    fajr: extractTime(today.fajr),
    sunrise: extractTime(today.sunrise),
    dhuhr: extractTime(today.dhuhr),
    asr: extractTime(today.asr),
    maghrib: extractTime(today.maghrib),
    isha: extractTime(today.isha),
    halfNight: extractTime(halfNight),
    lastThirdNight: extractTime(lastThirdNight)
  };
};

module.exports = calculateForCoordinates;
