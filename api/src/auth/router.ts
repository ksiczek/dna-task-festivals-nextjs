import { Request, Response, Router } from 'express';
import { db } from './db';

const authRouter = Router();

authRouter.options('/login', (request: Request, response: Response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', '*');
  response.setHeader('Access-Control-Allow-Headers', '*');

  response.end()
})

authRouter.post('/login', (request: Request, response: Response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', '*');
  response.setHeader('Access-Control-Allow-Headers', '*');

    const user = db.getAllUsers().find(({ email, password }) =>
        request.body.email === email &&
        request.body.password === password
    );

    if (!user) {
        return response
            .status(404)
            .send({
                message: 'User not found',
                data: {
                    user: null,
                },
            });
    }

    const { password: _password, ...safeUser } = user;

    return response
        .status(200)
        .send({
            message: 'Login successful',
            data: {
                token: user.id,
                user: safeUser,
            },
        });
});

export { authRouter };
