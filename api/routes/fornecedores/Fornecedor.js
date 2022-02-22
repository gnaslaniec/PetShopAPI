const TabelaFornecedor = require('./TabelaFornecedor')
const BadRequest = require('../../errors/BadRequest')
const NoData = require('../../errors/NoData')

class Fornecedor {
    constructor({ id, empresa, email, categoria, dataCriacao, dataAtualizacao, versao }) {
        this.id = id,
            this.empresa = empresa,
            this.email = email,
            this.categoria = categoria,
            this.dataCriacao = dataCriacao,
            this.dataAtualizacao = dataAtualizacao,
            this.versao = versao
    }

    async criar() {
        this.validar()
        const result = await TabelaFornecedor.inserir({
            empresa: this.empresa,
            email: this.email,
            categoria: this.categoria
        })

        this.id = result.id,
            this.dataCriacao = result.dataCriacao,
            this.dataAtualizacao = result.dataAtualizacao,
            this.versao = result.versao
    }

    async carregar() {
        const result = await TabelaFornecedor.pegarPorId(this.id)
        this.empresa = result.empresa
        this.email = result.email
        this.categoria = result.categoria
        this.dataCriacao = result.dataCriacao
        this.dataAtualizacao = result.dataAtualizacao
        this.versao = result.versao
    }

    async atualizar() {
        await TabelaFornecedor.pegarPorId(this.id)
        const fields = ['empresa', 'email', 'categoria']
        const fieldsToUpdate = {}

        fields.forEach((field) => {
            const value = this[field]
            if (typeof value === 'string' && value.length > 0) {
                fieldsToUpdate[field] = value
            }
        })

        console.log(fieldsToUpdate)

        if (Object.keys(fieldsToUpdate).length === 0) {
            throw new NoData()
        }

        await TabelaFornecedor.atualizar(this.id, fieldsToUpdate)
    }

    async remover() {
        return await TabelaFornecedor.remover(this.id)
    }

    validar() {
        const campos = ['empresa', 'email', 'categoria']

        campos.forEach(campo => {
            const valor = this[campo]

            if (typeof valor !== 'string' || valor.length === 0) {
                throw new BadRequest(campo)
            }
        })
    }

}

module.exports = Fornecedor