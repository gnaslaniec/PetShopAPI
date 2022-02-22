class BadRequest extends Error {
    constructor(campo) {
        super('O campo ' + campo + ' está inválido!')
        this.name = 'Bad Request'
        this.idErro = 1
    }
}

module.exports = BadRequest