import * as dotenv from "dotenv";
dotenv.config();

import app from "./server";

app.listen(4000, () => {
  console.log("hello on localhost 4000");
});
