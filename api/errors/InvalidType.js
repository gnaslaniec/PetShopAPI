class InvalidType extends Error {
    constructor(contentType) {
        super("O tipo de conteúdo " + contentType + " não é suportado!")
        this.name = "Invalid Type"
        this.idErro = 3
    }
}

module.exports = InvalidType