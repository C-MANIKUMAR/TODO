const mongoClient=require("mongodb").MongoClient;
const cors=require("cors");
const express=require("express");
const constring="mongodb://localhost:27017";
const app=express();
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//user data
app.get('/users/:userid',(req,res)=>{
    mongoClient.connect(constring).then(clientobj=>{
        var database=clientobj.db("todo");
        database.collection('users').findOne({user_id:req.params.userid}).then(user=>{
            res.send(user);
            res.end();
        });
    });
});

//appointments data
app.get('/appointments/:userid',(req,res)=>{
    mongoClient.connect(constring).then(clientobj=>{
        var database=clientobj.db("todo");
        database.collection('appointments').find({user_id:req.params.userid}).toArray().then(documents=>{
            res.send(documents);
            res.end()
        });
    });
});

//appoinment data
app.get('/appointment/:id',(req,res)=>{
    mongoClient.connect(constring).then(clientobj=>{
        var database=clientobj.db("todo");
        database.collection('appointments').findOne({appointment_id:parseInt(req.params.id)}).then(document=>{
            res.send(document);
            res.end()
    
        })
    })

})

//register user
app.post('/register-user',(req,res)=>{
    var user={
        user_id:req.body.user_id,
        user_name:req.body.user_name,
        password:req.body.password,
        mobile:req.body.mobile
    }
    mongoClient.connect(constring).then(clientobj=>{
        var database=clientobj.db("todo");
        database.collection('users').insertOne(user).then(()=>{
            console.log('user Registered');
            res.end(); 
        });
        

    })
})

//add-appoinment
app.post('/add-appointment',(req,res)=>{
    var appointment={
        appointment_id:parseInt(req.body.appointment_id),
        title:req.body.title,
        description:req.body.description,
        date:new Date(req.body.date),
        user_id:req.body.user_id
    };
    mongoClient.connect(constring).then(clientobj=>{
        var database=clientobj.db("todo");
        database.collection("appointments").insertOne(appointment).then(()=>{
            console.log('appontment added');
            res.end();
        })
    })
})

//edit-appontments
app.put('/edit-appointment/:id',(req,res)=>{
    var id=parseInt(req.params.id);

    var appointment={
        appointment_id:parseInt(req.body.appointment_id),
        title:req.body.title,
        description:req.body.description,
        date:new Date(req.body.date),
        user_id:req.body.user_id
    };
    mongoClient.connect(constring).then(clientobj=>{
        var database=clientobj.db("todo");
        database.collection('appointments').updateOne({appointment_id:id},{$set:appointment}).then(()=>{
            console.log('appoinment updated')
            res.end();
        });
    });
});

//delete-appointment

app.delete('/delete-appointment/:id',(req,res)=>{
    var id=parseInt(req.params.id);
    mongoClient.connect(constring).then(clientobj=>{
        var database=clientobj.db("todo");
        database.collection('appointments').deleteOne({appointment_id:id}).then(()=>{
            console.log('appointment deleted');
            res.end();
        });
    });
});

app.listen(4040);
console.log(`server started http://127.0.0.1:4040`);

