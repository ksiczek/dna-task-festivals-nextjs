import request from 'supertest';
import assert from 'node:assert';
import { app, server } from '../../src';

describe('Auth router', () => {
    afterAll(() => server.close());

    describe('POST /login', () => {
        it('should return user data and token on successful login', async () => {
            // when
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'my_secret_password'
                });

            // then
            assert.strictEqual(response.status, 200);
            assert.ok(response.body.data.token, 'token should be present in response');
            assert.ok(response.body.data.user, 'user should be present in response');
        });

        it('should return 404 when credentials are invalid', async () => {
            // when
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'wrong@example.com',
                    password: 'wrong_password'
                });

            // then
            assert.strictEqual(response.status, 404);
        });
    });
});
