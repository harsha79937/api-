const express=require("express");
const mysql=require("mysql2");
const app=express();

app.use(express.json());

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"movie_db"
});

db.connect(err=>{
    if(err){
        console.log("error in connecting mysql!");
    }else{
        console.log("connected to mysql!");
    }
});

//root route
app.get("/",(req,res)=>{
    res.send("welcome to movie API!");
});

//create a movie
app.post("/movies",(req,res)=>{
    const{movie_name,actor,actress,budget}=req.body;
    const sql="INSERT INTO movies (movie_name,actor,actress,budget) VALUES(?,?,?,?)";
    db.query(sql,[movie_name,actor,actress,budget],(err,results)=>{
        if(err)return res.status(500).json({error:err.message});
        res.status(200).json({id:results.insertId,movie_name,actor,actress,budget});
    });
});

//get all movies
app.get("/movies",(req,res)=>{
    const sql="SELECT * FROM movies";
    db.query(sql,(err,results)=>{
        if(err)return res.status(500).json({error:err.message});
        res.json(results);
    });
});

//get a movie by id
app.get("/movies/:id",(req,res)=>{
    const sql="SELECT * FROM movies WHERE id=?";
    db.query(sql,[req.params.id],(err,results)=>{
        if(err)return res.status(500).json({error:err.message});
        if(results.length===0)return res.status(404).json({message:"movie not found"});
        res.json(results[0]);
    });
});

//update a movie
app.put("/movies/:id",(req,res)=>{
    const{movie_name,actor,actress,budget}=req.body;
    const sql="UPDATE movies SET movie_name=?,actor=?,actress=?,budget=? WHERE id=?";
    db.query(sql,[movie_name,actor,actress,budget,req.params.id],(err,results)=>{
        if(err)return res.status(500).json({error:err.message});
        if(results.affectedRows===0)return res.status(404).json({message:"movie not found"});
        res.status(200).json({id:req.params.id,movie_name,actor,actress,budget});
    });
});

//delete a movie
app.delete("/movies/:id",(req,res)=>{
    const sql="DELETE FROM movies WHERE id=?";
    db.query(sql,[req.params.id],(err,results)=>{
        if(err)return res.status(500).json({error:err.message});
        if(results.affectedRows===0)return res.status(404).json({message:"movie not found"});
        res.status(200).json({message:"movie deleted successfully"});
    });
});

const PORT=7000;
app.listen(PORT,()=>{console.log(`server running on http://localhost:${PORT}`)});