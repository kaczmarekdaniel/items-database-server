import { Router } from "express";
import { handleInputErrors } from "../modules/middleware";
import { protectWithRole } from "../modules/auth";
import * as item from "../handlers/items";

const itemRouter = Router();

itemRouter.get("/", protectWithRole("public_user"), item.getUserItems);

itemRouter.post(
  "/",
  handleInputErrors,
  protectWithRole("supervisor"),
  item.createItem
);
// router.delete('/product/:id', deleteProduct)

export default itemRouter;
