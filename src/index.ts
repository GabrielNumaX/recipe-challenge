import 'reflect-metadata';

import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import { createConnection } from 'typeorm';
import { typeOrmConfig } from './database/db';

import cors from 'cors';
import dotenv from 'dotenv';
import  { allDefs } from './typeDefs/typeDefs';
import { resolvers } from './resolvers/index';

import { jwtAuth } from './middleware/jwt';

(async () => {
    const conn = await createConnection(typeOrmConfig);
    console.log('Postgres connected.');

    // Closing the TypeORM db connection at the end of the app prevents the process from hanging at the end (ex when you
    // use ctrl-c to stop the process in your console, or when Docker sends the signal to terminate the process).

    const typeDefs = allDefs;

    dotenv.config();

    const PORT = process.env.PORT || 3030;

    const app = express();

    app.use(cors());

    app.use(express.json());

    const apolloServer = new ApolloServer({

        typeDefs,
        resolvers,
        context: async (req:any) => {
            const contextObj = {
                userId: ''
            };

            if(req) {
                await jwtAuth(req);
                contextObj.userId = req.userId
            }
            
            return contextObj;
        },

        formatError: (error) => {

            return {message: error.message};
        }
    });

    apolloServer.applyMiddleware({app, path: '/graphql'});

    const httpServer = app.listen(PORT, () => {

        console.log(`Server listening on PORT: ${PORT}`);
        console.log(`Graphql Endpoint: ${apolloServer.graphqlPath}`);
    });

    apolloServer.installSubscriptionHandlers(httpServer);

    // await conn.close();
    // console.log('PG connection closed.');
})();

