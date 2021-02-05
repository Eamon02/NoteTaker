// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");
const noteList = require("./db/db.json");

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// =============================================================
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
   //return res.json(noteList)
});

// Create New note - takes in JSON input
app.post("/api/notes", function(req, res){
    let newNote = req.body;
    newNote.id = noteList.length + 1;
    // console.log(newNote)

    //Add new note to end of array
    noteList.push(newNote);
    let newDB = JSON.stringify(noteList)

    // write newNote to db
    fs.writeFileSync("./db/db.json", newDB,function(err){
        if (err) throw err;
     });
    // return res.json(newNote);
    res.sendFile(path.join(__dirname, "/public/notes.html"));

  });


app.delete("/api/notes/:id", function(req, res){
var noteToDelete = req.params.id;
// console.log(noteToDelete);
// console.log((noteList[1].id).toString())

// Filter to show only the selected character
for (var i = 0; i < noteList.length; i++) {
    if (noteToDelete === (noteList[i].id).toString()) {
      noteList.splice(i, 1)  
    // console.log(noteList[i].id)
    }
  }

  for (var i = 0; i < noteList.length; i++) {
      noteList[i].id = i + 1
    // console.log(noteList[i].id)
    }

  let newDB = JSON.stringify(noteList)
  fs.writeFileSync("./db/db.json", newDB,function(err){
    if (err) throw err;
 });
 
  res.sendFile(path.join(__dirname, "/public/notes.html"));

});



  // Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
  