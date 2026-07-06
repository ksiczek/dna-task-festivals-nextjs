import request from 'supertest';
import assert from 'node:assert';
import { app, server } from '../../src';

const FESTIVALS_QUERY = JSON.stringify({
    query: `
        query {
            festivals {
                id
                name
                price
                duration {
                    end
                    start
                }
            }
        }
    `
});

describe('Festivals resolver', () => {
    afterAll(() => server.close());

    it('should return UNAUTHENTICATED error when no token is provided', async () => {
        // when
        const response = await request(app)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .send(FESTIVALS_QUERY);

        // then
        assert.strictEqual(response.status, 200);
        assert.ok(response.body.errors, 'errors should be present');
        assert.strictEqual(response.body.errors[0].extensions.code, 'UNAUTHENTICATED');
    });

    it('should return festivals when a valid token is provided', async () => {
        // First login to get the token
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'my_secret_password' });

        const token = loginResponse.body.data.token;

        // when
        const response = await request(app)
            .post('/graphql')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(FESTIVALS_QUERY);

        // then
        assert.strictEqual(response.status, 200);
        assert.ok(response.body.data.festivals, 'festivals should be present');
        assert.ok(Array.isArray(response.body.data.festivals), 'festivals should be an array');
        assert.ok(response.body.data.festivals.length > 0, 'festivals should not be empty');
    });
});
