import { db } from './db';
import { AuthContext } from '../auth';
import { GraphQLError } from 'graphql';

export const resolvers = {
    Query: {
        festivals: (_: unknown, __: unknown, context: AuthContext) => {
            if (!context.userId) {
                throw new GraphQLError('Unauthorized', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            return db.getAllFestivals();
        },
    },
};
