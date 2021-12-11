import { envVariables, Server, dbConnection } from "./configs";
import { defaultMiddleware } from "./middlewares/defaultMiddleware";
import { errorHandleMiddleware } from "./middlewares/errorHandleMiddleware";
import {
  adminRoute,
  authRoute,
  cartRoute,
  feedbackRoute,
  orderRoute,
  profileRoute,
  shipperRoute,
  shoeRoute,
  wishlistRoute,
} from "./routers";

const { port, connectString } = envVariables;

const main = async () => {
  const server = new Server(port);

  server.registerMiddleware(defaultMiddleware);

  server.listen();
  dbConnection(connectString);
  server.registerRouter(shoeRoute);
  server.registerRouter(authRoute);
  server.registerRouter(cartRoute);
  server.registerRouter(profileRoute);
  server.registerRouter(wishlistRoute);
  server.registerRouter(adminRoute);
  server.registerRouter(feedbackRoute);
  server.registerRouter(orderRoute);
  server.registerRouter(shipperRoute);
  server.registerMiddleware(errorHandleMiddleware);
};

main();
