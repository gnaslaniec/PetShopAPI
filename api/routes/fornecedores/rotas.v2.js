const router = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const SerializerFornecedor = require('../../Serializer').SerializerFornecedor

router.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
})

router.get('/', async (req, res) => {
    const result = await TabelaFornecedor.listar()
    const serializer = new SerializerFornecedor(res.getHeader('Content-Type'))
    res.status(200).send(serializer.serializar(result))
})

module.exports = router