const router = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializerFornecedor = require('../../Serializer').SerializerFornecedor

router.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET,POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
})

router.get('/', async (req, res) => {
    const result = await TabelaFornecedor.listar()
    const serializer = new SerializerFornecedor(res.getHeader('Content-Type'), ['empresa'])
    res.status(200).send(serializer.serializar(result))
})

router.post('/', async (req, res, proximo) => {
    try {
        const data = req.body
        const fornecedor = new Fornecedor(data)
        await fornecedor.criar()
        const serializer = new SerializerFornecedor(res.getHeader('Content-Type'), ['empresa'])
        res.status(201).send(serializer.serializar(fornecedor))
    } catch (error) {
        proximo(error)
    }
})

router.options('/:idFornecedor', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET,PUT,DELETE')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
})

router.get('/:idFornecedor', async (req, res, proximo) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id })
        await fornecedor.carregar()
        const serializer = new SerializerFornecedor(res.getHeader('Content-Type'), ['email', 'empresa ', 'dataCriacao', 'dataAtualizacao'])
        res.status(200).send(serializer.serializar(fornecedor))
    } catch (error) {
        proximo(error)
    }
})

router.put("/:idFornecedor", async (req, res, proximo) => {
    try {
        const id = req.params.idFornecedor
        const dataBody = req.body
        const data = Object.assign({}, dataBody, { id: id })
        const fornecedor = new Fornecedor(data)
        await fornecedor.atualizar()
        res.status(204).end()
    } catch (error) {
        proximo(error)
    }
})

router.delete("/:idFornecedor", async (req, res, proximo) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id })
        await fornecedor.carregar()
        await fornecedor.remover()
        res.status(204).end()
    } catch (error) {
        proximo(error)
    }
})

const routerProdutos = require('./produtos/')

const verificarFornecedor = async (req, res, proximo) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id })
        await fornecedor.carregar()
        req.fornecedor = fornecedor
        proximo()
    } catch (error) {
        proximo(error)
    }
}

router.use('/:idFornecedor/produtos', verificarFornecedor, routerProdutos)

module.exports = router