const express=require("express");
const mysql=require("mysql2");
const app=express();

app.use(express.json());

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"ecommerce_db"
});

db.connect(err=>{
    if(err){
        console.log("error in connecting mysql!",err);
    }else{
        console.log("connected to mysql!");
}
});
//root rote
app.get("/",(req,res)=>{
    res.send("welcome to E-commerce API!");
});

// to create products
app.post("/products",(req,res)=>{
    const{name,price,stock}=req.body;
    const sql="INSERT INTO products(name,price,stock)VALUES(?,?,?)";
    db.query(sql,[name,price,stock],(err,result)=>{
        if(err) return res.status(500).json({error:err.message});
        res.status(200).json({productId:result.insertId,name,stock,price});
    });
});
 
//get all products
app.get("/products",(req,res)=>{
    db.query("SELECT * FROM products",(err,results)=>{
        if(err)return res.status(500).json({error:err.message});
        res.json(results);
    });
});

//get product by id
app.get("/products/:id",(req,res)=>{
    const sql="SELECT * FROM products WHERE id=?";
    db.query(sql,[req.params.id],(err,results)=>{
        if(err)return res.status(500).json({error:err.message});
        if(results.length===0)return res.status(404).json({message:"product not found"});
        res.json(results[0]);
    });
});

//update a product
app.put("/products/:id",(req,res)=>{
    const{name,price,stock}=req.body;
    const sql="UPDATE products SET name=?,price=?,stock=? WHERE id=?";
    db.query(sql,[name,price,stock,req.params.id],(err,results)=>{
        if(err)return res.status(500).json({error:err.message});
        if(results.affectedRows===0)return res.status(404).json({message:"product not found"});
        res.json({id:req.params.id,name,price,stock});
    });
});

//delete a product
app.delete("/products/:id",(req,res)=>{
    const sql="DELETE FROM products WHERE id=?";
    db.query(sql,[req.params.id],(err,results)=>{
        if(err)return res.status(500).json({error:err.message});
        if(results.affectedRows===0)return res.status(404).json({message:"product not found"});
        res.json({message:"product deleted successfully"});
    });
});

const PORT=4000;
app.listen(PORT,()=>console.log(`Server running in http://localhost:${PORT}`));
