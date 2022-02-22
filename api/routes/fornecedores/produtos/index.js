const roteador = require('express').Router({ mergeParams: true })
const TabelaProduto = require('./TabelaProduto')
const Produto = require('./Produto')
const Serializer = require('../../../Serializer').SerializerProduto

roteador.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET,POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
})

roteador.get('/', async (req, res) => {
    const produtos = await TabelaProduto.listar(req.fornecedor.id)
    const serializer = new Serializer(res.getHeader('Content-Type'))
    res.send(
        serializer.serializar(produtos)
    )
})

roteador.post('/', async (req, res, proximo) => {
    try {
        const idFornecedor = req.fornecedor.id
        const corpo = req.body
        const dados = Object.assign({}, corpo, { fornecedor: idFornecedor })
        const produto = new Produto(dados)
        await produto.criar()
        const serializer = new Serializer(res.getHeader('Content-Type'))
        res.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)
        res.set('Location', `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`)
        res.status(201).send(serializer.serializar(produto))
    } catch (error) {
        proximo(error)
    }
})

roteador.options('/:idProduto', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET,PUT,DELETE,HEAD')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
})

roteador.delete('/:idProduto', async (req, res) => {
    const dados = {
        id: req.params.idProduto,
        fornecedor: req.fornecedor.id
    }

    const produto = new Produto(dados)
    await produto.apagar()
    res.status(204).end()
})



roteador.get('/:idProduto', async (req, res, proximo) => {
    try {
        const dados = {
            id: req.params.idProduto,
            fornecedor: req.fornecedor.id
        }
        const produto = new Produto(dados)
        await produto.carregar()
        const serializer = new Serializer(
            res.getHeader('Content-Type'),
            ['preco', 'estoque', 'fornecedor', 'dataCriacao', 'dataAtualizacao', 'versao']
        )
        res.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)
        res.send(serializer.serializar(produto))
    } catch (error) {
        proximo(error)
    }
})

roteador.head('/:idProduto', async (req, res, proximo) => {
    try {
        const dados = {
            id: req.params.idProduto,
            fornecedor: req.fornecedor.id
        }
        const produto = new Produto(dados)
        await produto.carregar()
        res.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)
        res.status(200).end()
    } catch (error) {
        proximo(error)
    }
})

roteador.put('/:idProduto', async (req, res, proximo) => {
    try {
        const dados = Object.assign(
            {},
            req.body,
            {
                id: req.params.idProduto,
                fornecedor: req.fornecedor.id
            }
        )
        const produto = new Produto(dados)
        await produto.atualizar()
        await produto.carregar()
        res.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)
        res.status(204).end()
    } catch (error) {
        proximo(error)
    }
})

roteador.options('/:idProduto/diminuirEstoque', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
})

roteador.post('/:idProduto/diminuirEstoque', async (req, res, proximo) => {
    try {
        const produto = new Produto({
            id: req.params.idProduto,
            fornecedor: req.fornecedor.id
        })

        await produto.carregar()
        produto.estoque = produto.estoque - req.body.quantidade
        await produto.diminuirEstoque()
        await produto.carregar()
        res.set('ETag', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)
        res.status(204).end()
    } catch (error) {
        proximo(error)
    }

})

module.exports = roteador
