jest.mock('../../src/utils/geocoder');

const hat = require('hat');
const geocoder = require('../../src/utils/geocoder');
const reverseLookup = require('../../src/utils/reverseLookup');

describe('reverseLookup', () => {
    beforeEach(() => {
        geocoder.geocode.mockRestore();
    });

    it('should perform reverse lookup', async () => {
        const data = {
            latitude: hat(),
            longitude: hat(),
            city: hat(),
            countryCode: hat(),
        };

        geocoder.geocode.mockResolvedValue([data]);

        const result = await reverseLookup(hat());
        expect(result).toEqual(data);
    });
});
