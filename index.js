const { response } = require("express");
const express = require("express");
const morgan = require("morgan");
const cors =require('cors')


const app = express();
app.use(cors())
app.use(express.json());
app.use(express.static('build'))

morgan.token("info", function getInfo(req) {
  const info = JSON.stringify(req.body);
  return info;
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :info")
);

let notes = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Aada Lovelace",
    number: "432543254325",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "040-2342436",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "04032562576456",
  },
];

app.get("/info", (req, res) => {
  res.send(`<p>phonebook has info of ${notes.length} people<p>
    <p>${new Date()}</p>`);
});

app.get("/api/persons", (req, res) => {
  res.send(notes);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  const person = notes.find((note) => note.id === id);
  if (person) {
    return res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);

  res.status(204).end();
});

app.post("/api/persons/", (req, res) => {
  if (!req.body.name || !req.body.number) {
    return res.status(404).json({
      error: "name and number required",
    });
  }
  if (notes.some((person) => person.name === req.body.name)) {
    return res.status(404).json({
      error: "name must be unique",
    });
  }
  const id = Math.floor(Math.random() * 1000);

  const newPerson = {
    id: id,
    name: req.body.name,
    number: req.body.number,
  };

  notes = notes.concat(newPerson);
  res.json(newPerson);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
