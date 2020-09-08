jest.mock('../../src/utils/getTimeZone');

const calculate = require('../../src/utils/calculator');
const SalatLabels = require('../../src/utils/SalatNames');

const getTimeZone = require('../../src/utils/getTimeZone');

const expectDateAndTimes = (result, date, fajr, sunrise, dhuhr, asr, maghrib, isha, halfNight, lastThird) => {
    expect(result).toEqual(
        `${date}\n\nFajr: ${fajr}\nSunrise: ${sunrise}\nDhuhr: ${dhuhr}\nʿAṣr: ${asr}\nMaġrib: ${maghrib}\nʿIshāʾ: ${isha}\n1/2 Night Begins: ${halfNight}\nLast 1/3 Night Begins: ${lastThird}`,
    );
};

describe('calculator', () => {
    describe('daily', () => {
        beforeEach(() => {
            getTimeZone.mockRestore();
        });

        it('should calculate the proper time for Ottawa on June 19th, 2020', async () => {
            getTimeZone.mockResolvedValue({ data: { zoneName: 'America/Toronto' } });

            const result = await calculate(SalatLabels, '45.3506', '-75.793', new Date(2020, 5, 19, 10, 24, 0));
            expectDateAndTimes(
                result,
                'Friday, June 19, 2020',
                '3:46 AM',
                '5:15 AM',
                '1:05 PM',
                '5:15 PM',
                '8:55 PM',
                '10:23 PM',
                '12:21 AM',
                '1:30 AM',
            );
        });

        it('should calculate the proper time for Ottawa on September 8th, 2020', async () => {
            getTimeZone.mockResolvedValue({ data: { zoneName: 'America/Toronto' } });

            const result = await calculate(SalatLabels, '45.3506', '-75.793', new Date(2020, 8, 8, 16, 38, 0));
            expectDateAndTimes(
                result,
                'Tuesday, September 8, 2020',
                '5:28 AM',
                '6:34 AM',
                '1:01 PM',
                '4:35 PM',
                '7:27 PM',
                '8:32 PM',
                '12:28 AM',
                '2:08 AM',
            );
        });
    });
});
