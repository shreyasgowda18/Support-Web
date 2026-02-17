import { app } from "./app.js";
import { env } from "./config/env.js";
import { store } from "./services/store.js";

store.seed();

app.listen(env.port, () => {
  console.log(`Backend running on http://localhost:${env.port}`);
});
