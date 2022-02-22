class NotFound extends Error {
    constructor(entidade) {
        super(`${entidade} não foi encontrado!`)
        this.name = 'Not Found'
        this.idErro = 0
    }
}

module.exports = NotFound