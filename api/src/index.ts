import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { festivalResolvers, festivalTypeDefs } from './festival/index';
import { authRouter, buildAuthContext } from './auth/index';
import { Server } from 'http';

let app: Application, server: Server;

const startServer = async () => {
    app = express();

    app.use(express.json());

    const apolloServer = new ApolloServer({
        typeDefs: mergeTypeDefs([festivalTypeDefs]),
        resolvers: mergeResolvers([festivalResolvers]),
        context: buildAuthContext,
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    app.use('/auth', authRouter);

    server = app.listen({ port: 4000 }, () => {
        console.log(`Server ready at http://localhost:4000${apolloServer.graphqlPath}`);
    });
}

startServer().then();

export {
    app,
    server
};
