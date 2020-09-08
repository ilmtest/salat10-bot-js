jest.mock('axios');

const hat = require('hat');
const axios = require('axios');
const getTimeZone = require('../../src/utils/getTimeZone');

describe('getTimeZone', () => {
    beforeEach(() => {
        axios.mockRestore();
    });

    it('should get the timezone', async () => {
        const zoneName = hat();

        axios.get.mockResolvedValue({ data: { zoneName } });

        const result = await getTimeZone(hat(), hat(), hat());
        expect(result).toEqual({ timeZone: zoneName });
    });
});
