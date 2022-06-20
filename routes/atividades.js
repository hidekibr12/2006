const atividades = require('../models/atividades')
const usuarios = require('../models/usuarios')
module.exports = (app)=>{
    app.post('/atividades', async(req,res)=>{
        var dados = req.body
        const database = require('../config/database')()
        const atividades = require('../models/atividades')
        var gravar = await new atividades({
            data:dados.data,
            tipo:dados.tipo,
            entrega:dados.forma,
            disciplina:dados.disciplina,
            usuario:dados.id,
            instrucoes:dados.orientacoes,
            titulo:dados.titulo
        }).save()
        res.redirect('/atividades?id='+dados.id)
    })
    app.get('/atividades', async(req,res)=>{
        var user = req.query.id
        if(!user){
            res.redirect("/login")
        }
        var usuarios = require('../models/usuarios')
        var atividades = require('../models/atividades')
        var dadosUser = await usuarios.findOne({_id:user})
        var dadosAberto = await atividades.find({usuario:user,status:"0"}).sort({data:'1'})
        var dadosEntregue = await atividades.find({usuario:user,status:"1"}).sort({data:'1'})
        var dadosExcluido = await atividades.find({usuario:user,status:"2"}).sort({data:'1'})
        //res.render('atividades.ejs',{nome:dadosUser.nome, id:dadosUser._id, lista:dadosAtividades})
        res.render('atividades.ejs',{nome:dadosUser.nome, id:dadosUser._id, dadosAberto,dadosEntregue,dadosExcluido})
    })
    app.get('/excluir',async(req,res)=>{
        var doc = req.query.id
        var excluir = await atividades.findOneAndUpdate({_id:doc},{status:"2"})
        res.redirect('/atividades?id='+excluir.usuario)
    })
    app.get('/entregue',async(req,res)=>{
        var doc = req.query.id
        var entregue = await atividades.findOneAndUpdate({_id:doc},{status:"1"})
        res.redirect('/atividades?id='+entregue.usuario)
    })
    app.get('/desfazer', async(req,res)=>{
        var doc = req.query.id
        var desfazer = await atividades.findOneAndUpdate({_id:doc},{status:"0"})
        res.redirect('/atividades?id='+desfazer.usuario)
    })
    app.get('/alterar', async(req,res)=>{
        var id = req.query.id
        var alterar = await atividades.findOne({_id:id})
        var user = await usuarios.findOne({_id:alterar.usuario})
        res.render("alterar.ejs",{nome:user.nome, id:user._id, alterar})
    })
    //gravar as alterações na atividade selecionada 
    app.post("/alterar",async(req,res)=>{
      //armazenar as info recebidas do formulário
      var dados = req.body
      //visualizar os dados 
        res.send(dados)
    })
}