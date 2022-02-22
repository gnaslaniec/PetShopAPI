const Model = require('./ModeloTabelaFornecedor')
const NotFound = require('../../errors/NotFound')

module.exports = {
    listar() {
        return Model.findAll({ raw: true })
    },

    inserir(fornecedor) {
        return Model.create(fornecedor)
    },

    async pegarPorId(id) {
        const result = await Model.findOne({
            where: {
                id: id
            }
        })

        if (!result) {
            throw new NotFound('Fornecedor')
        }

        return result
    },

    async atualizar(id, dadosParaAtualizar) {
        return Model.update(
            dadosParaAtualizar,
            {
                where: {
                    id: id
                }
            }
        )
    },

    async remover(id) {
        return Model.destroy({
            where: {
                id: id
            }
        })
    }
}