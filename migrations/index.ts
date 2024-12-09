import { createConnection } from "typeorm";
import * as dotenv from "dotenv";
import { UserEntity } from "../src/entity/user.entity";
import { UserAppConfigEntity } from "../src/entity";

dotenv.config();

const ormConfig = require("../ormconfig.js")[0];

!(async () => {
  const connection = await createConnection({
    type: ormConfig.type,
    host: ormConfig.host,
    port: ormConfig.port,
    username: ormConfig.username,
    password: ormConfig.password,
    database: ormConfig.database,
    logging: true,
    entities: ["src/**/*.entity.ts"]
  });

  const userRepository = connection.getRepository(UserEntity);
  const userAppConfigRepository = connection.getRepository(UserAppConfigEntity);
  const users = await userRepository.find();

  for (const user of users) {
    const userAppConfig = await userAppConfigRepository.findOne({
      where: { user }
    });
    if (!userAppConfig) {
      const userAppConfig = new UserAppConfigEntity();
      userAppConfig.user = user;
      await userAppConfigRepository.save(userAppConfig);
    }
  }
})();
