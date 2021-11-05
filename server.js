const express= require('express');
const mongoose = require('mongoose');
const Document = require('./models/Document')

const app = express();

app.set('view engine' , 'ejs')
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))

mongoose.connect("mongodb://localhost/wastebin",{
    useUnifiedTopology:true,
    useNewUrlParser:true
})


app.get('/', (req, res) => {
    const code=`Welcome to WasteBin!

Use the Commands in the top right corner
to create a new file to share with others.`

    res.render('code-display',{code,lineNumbers:code.split('\n').length , language : "plain-text"});
})


app.get('/new',(req,res)=>{
    res.render('new')
})

app.post('/save',async(req,res)=>{
    const value = req.body.value;
    try{
        const document = await Document.create({value})
        console.log('value is :',value)
        res.redirect(`/${document.id}`)
 
    }catch(e){
        res.render('new',{value})

    }
})

app.get('/:id',async(req,res)=>{
    const id=req.params.id;
    try{
        const document =await Document.findById(id)
        res.render('code-display' , { code  :document.value})
    }
    catch(e){
        res.redirect('/')
    }


})

app.listen(3000);