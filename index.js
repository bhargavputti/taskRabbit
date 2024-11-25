const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
app.use(express.urlencoded({ extended: true }));
const User = require("./models/user.js");
const Task = require("./models/task.js");
const methodOverride = require("method-override");

app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));

const dbUrl = "mongodb://localhost:27017/taskRabbit";
main()
	.then(() => {
		console.log("DB is connected..");
	})
	.catch((err) => {
		console.log(err);
	});

async function main() {
	await mongoose.connect(dbUrl);
}
//for users
app.get("/", (req, res) => {
	res.render("signup.ejs");
});

// app.post("/savedb", (req, res) => {

// 	res.render("signup.ejs");
// });

app.post("/savedb", async (req, res) => {
	let { username, email, password } = req.body;
	let newUser = new User({
		username: username,
    email: email,
    password: password,
	});
	newUser
		.save()
		.then((res) => {
			console.log(res);
		})
		.catch((err) => {
			console.log(err);
		});

  let {tasks} = await User.find({username:username});
  console.log("print "+tasks);
	res.redirect(`/tasks/${tasks._id}`);
});

app.get("/tasks/:id", async (req, res)=>{
  let{id} = req.params;
  let{ tasks } = await User.find({id});
  
  res.render("tasks.ejs", {tasks});
});

//crud for tasks
//get tasks
app.get("/tasks", async (req, res)=>{
  let {tasks} = await Task.find({});
  console.log("tasks "+ tasks);
  res.render("tasks.ejs", {tasks});
});

//add tasks
app.post("/add", (req, res)=>{
  let{task} = req.body;
  let newTask = new Task({
		task: task,
	});
	newTask
		.save()
		.then((res) => {
			console.log(res);
		})
		.catch((err) => {
			console.log(err);
		});
    res.redirect("/tasks");
});

//update task
app.put("/task/:id", async (req, res) => {
	let { id } = req.params;
	//we have to redirect to a web page where user can edit his tasks
	res.redirect("edit.ejs", {id});

});

//
// app.get("/edit/:id", async(req, res)=>{
//   //find that user tasks
//   //and redirect to get request
//   res.redirect("/tasks/:id");
// });

//delete task
app.delete("/task/:id", async (req, res) => {
	let { id } = req.params;
	let task = await Task.findByIdAndDelete(id);
	res.redirect(`/tasks/${id}`);
});



app.listen(3000, () => {
	console.log(`listening to port ..3000`);
});

