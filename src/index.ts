import * as express from "express";
import { AppDataSource } from "./data-source";
import * as bodyParser from "body-parser";
import router from "./routes";
import * as formData from "express-form-data";
import * as os from "os";
const app = express();
require('dotenv').config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const options = {
  uploadDir: os.tmpdir(),
  autoClean: false,
};

// parse data with connect-multiparty.
app.use(formData.parse(options));
// delete from the request all empty files (size == 0)
app.use(formData.format());
// change the file objects to fs.ReadStream
app.use(formData.stream());
// union the body and the files
app.use(formData.union());

const PORT = process.env.PORT || 8000;

//Database connection
AppDataSource.initialize()
  .then(async () => {
    console.log("Database Connected");
  })
  .catch((error) => console.log(error));


//Call router
app.use(router);

//Listen
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
