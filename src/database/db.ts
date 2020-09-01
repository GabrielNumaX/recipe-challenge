import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

// MODELS
import User from './models/user';
import Recipe from './models/recipe';
import Ingredients from './models/category';

const typeOrmConfig: PostgresConnectionOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "numax",
    password: "admin",
    database: "recipe-challenge",
    synchronize: true,
    logging: false,
    entities: [
        User,
        Recipe,
        Ingredients
    ]
};

export { typeOrmConfig };