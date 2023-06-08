const express = require('express');
const router = express.Router();



router.get("/",(req,res)=>{
    
    console.log(req.session);

    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
      } else {
    req.conn.query("SELECT * FROM todo",(error,result)=>{
        if(error){
            res.status(500).send("error aayo");
        }
        res.render("index",{items:result.rows});
    });
}
});


router.get("/login", (req, res) => {
    res.render("login");
  });

  router.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password);
  
    req.conn.query(
      "select * FROM users WHERE username = $1 and password = $2",
      [username, password],
      (error, result) => {
        if (error) {
          res.status(500).send({ message: "failed to fetch info" });
        }
        req.session.isLoggedIn = true;
        res.redirect("/");
      }
    );
  });




//adding todo tasks
router.post("/add-todo",(req,res)=>{
    console.log(req.body);
   req.conn.query("insert into todo (id,title,iscomplete) values($1,$2,$3)",[Math.floor(Math.random(5)*1000),req.body.todo,false],(error,result)=>{
    if(error){
        res.status(500).send("error aayo");
    }
    res.redirect("/");
   })
   
    res.end();
})

//delete
router.post("/remove-todo", (req, res) => {
    const id = parseInt(req.body.delete);
    req.conn.query("delete from todo where id = $1", [id], (error, result) => {
      if (error) {
        res.status(500).send({ message: "failed to remove todo" });
      }
    });
    res.redirect("/");
  });

router.post("/logout", (req, res) => {
    req.session.destroy();
    return res.redirect("/login");
  });

//export the router
module.exports = router;
