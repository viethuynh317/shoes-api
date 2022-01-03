import { Router } from "express";
import { jwtMiddleware } from "../middlewares";
import { wishlistController } from "../controllers";
const { getWishlist, updateWishlist, deleteItemFromWishlist } =
  wishlistController;
export const wishlistRoute = Router();
const baseUrl = "/api/v1/wishlist";
wishlistRoute.use(`${baseUrl}`, jwtMiddleware);
wishlistRoute.route(`${baseUrl}`).get(getWishlist);
wishlistRoute.route(`${baseUrl}`).put(updateWishlist);
wishlistRoute.route(`${baseUrl}/shoeId`).delete(deleteItemFromWishlist);
