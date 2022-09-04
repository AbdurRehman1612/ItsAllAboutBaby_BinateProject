// const express = require("express");
// const app = express();
// const cors = require("cors");
// const originURL = ["http://localhost:3000"];
// const bodyParser = require("body-parser");

// app.use(
//   cors({
//     origin: originURL,
//     credentials: true,
//   })
// );

// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));

// app.use("/routes/user/",require("./routes/user"))

// app.listen(5000, () => {
//   console.log("Server is running on port http://localhost:5000/");
// });

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
 // const preferRouter = require("./routes/preferenceRouter")
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
dotenv.config();

// Router config
app.use("/routes/user/", require("./routes/user"));
app.use("/routes/scannedproducts/", require("./routes/ScannedProducts"));
// app.use(preferRouter)

// mongoose.connect(process.env.DB, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
// },
//     () => console.log("Db connected"))

const PORT = 5000 || process.env.PORT;

app.listen(PORT, (req, res) => {
  console.log(`Server running on ${PORT}`);
});
