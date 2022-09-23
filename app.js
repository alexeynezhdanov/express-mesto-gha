const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: "632c4c5fa801ff9a450b3c31",
  };
  next();
});

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
