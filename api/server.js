const express = require('express')
const bodyParser = require('body-parser')
const config = require('config')

const app = express()
const NotFound = require('./errors/NotFound')
const BadRequest = require('./errors/BadRequest')
const NoData = require('./errors/NoData')
const InvalidType = require('./errors/InvalidType')
const formatosAceitos = require('./Serializer').formatosAceitos
const SerializerErro = require('./Serializer').SerializerErro


app.use(bodyParser.json())

app.use((req, res, proximo) => {
    let formatoRequisitado = req.header('Accept')

    if (formatoRequisitado === '*/*') {
        formatoRequisitado = 'application/json'
    }

    if (formatosAceitos.indexOf(formatoRequisitado) === -1) {
        res.status(406).end()
        return
    }

    res.setHeader('Content-Type', formatoRequisitado)
    proximo()
})

app.use((req, res, proximo) => {
    res.set('Access-Control-Allow-Origin', '*')
    proximo()
})

const router = require('./routes/fornecedores')
app.use('/api/fornecedores', router)

const routerV2 = require('./routes/fornecedores/rotas.v2')
app.use('/api/v2/fornecedores', routerV2)

app.use((error, req, res, proximo) => {
    let status = 500
    if (error instanceof NotFound) {
        status = 404
    }

    if (error instanceof BadRequest || error instanceof NoData) {
        status = 400
    }

    if (error instanceof InvalidType) {
        status = 406
    }

    const serializer = new SerializerErro(res.getHeader('Content-Type'))

    res.status(status).send(serializer.serializar({
        mensagem: error.message,
        id: error.idErro
    }))
})

app.listen(config.get('api.port'), () => {
    console.log("API On")
})