class NoData extends Error {
    constructor() {
        super("Não foram enviados dados para atualizar!")
        this.name = 'No Data'
        this.idErro = 2
    }
}

module.exports = NoData