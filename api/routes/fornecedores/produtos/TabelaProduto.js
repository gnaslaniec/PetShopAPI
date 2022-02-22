const Model = require('./ModeloTabelaProduto')
const instance = require('../../../database/database')
const NotFound = require('../../../errors/NotFound')

module.exports = {
    async listar(id) {
        return Model.findAll({
            where: {
                fornecedor: id
            },
            raw: true
        })
    },

    async inserir(dados) {
        return Model.create(dados)
    },

    async remover(idProduto, idFornecedor) {
        return Model.destroy({
            where: {
                id: idProduto,
                fornecedor: idFornecedor
            }
        })
    },

    async pegarPorId(idProduto, idFornecedor) {
        const encontrado = await Model.findOne({
            where: {
                id: idProduto,
                fornecedor: idFornecedor
            },
            raw: true
        })

        if (!encontrado) {
            throw new NotFound('Produto')
        }

        return encontrado
    },

    async atualizar(dadosDoProduto, dadosParaAtualizar) {
        return Model.update(
            dadosParaAtualizar,
            {
                where: dadosDoProduto
            }
        )
    },

    async subtrair(idProduto, idFornecedor, campo, quantidade) {
        return instance.transaction(async transaction => {
            const produto = await Model.findOne({
                where: {
                    id: idProduto,
                    fornecedor: idFornecedor
                }
            })

            produto[campo] = quantidade

            await produto.save()

            return produto
        })
    }

}