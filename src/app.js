import { envVariables, Server, dbConnection} from './configs';
import { defaultMiddleware } from './middlewares/defaultMiddleware';
import { shoeRoute } from './routers';

const { port, connectString } = envVariables;

const main = async () => {
  const server = new Server(port);

  server.registerMiddleware(defaultMiddleware);
  server.listen();
  dbConnection(connectString);
  server.registerRouter(shoeRoute);
}

main();