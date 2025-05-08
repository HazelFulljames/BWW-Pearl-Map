import express, { json, static as expressStatic } from "express";
import { readFileSync, writeFileSync } from "fs";
import { createServer } from "livereload";
import connectLiveReload from "connect-livereload";

const app = express();
const PORT = 8050;

const liveReloadServer = createServer();
liveReloadServer.watch("./src/");
liveReloadServer.watch("./public/");
app.use(connectLiveReload());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(json());
app.use("/scripts", expressStatic("./public/scripts"));
app.use("/css", expressStatic("./public/styles"));
app.use("/assets", expressStatic("./public/assets"));
app.use("/html", expressStatic("./public/html"));
app.use("/config", expressStatic("./src/config"));

const command = process.argv[2];


app.get("/", (request, response) => {
  response.status(200).send(readFileSync("./index.html", "utf8"));
});

app.post("/serverlog", (request, response) => {
  console.log("req body", request.body);
  response.status(200).send("logged");
});

app.listen(PORT, () => {
  console.log(`BWW Pearls Map is listening on ${PORT}!`);
});
