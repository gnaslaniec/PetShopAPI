const InvalidType = require('./errors/InvalidType')
const jsontoxml = require('jsontoxml')

class Serializer {
    json(data) {
        return JSON.stringify(data)
    }

    xml(dados) {
        let tag = this.tagSingular

        if (Array.isArray(dados)) {
            tag = this.tagPlural
            dados = dados.map((item) => {
                return {
                    [this.tagSingular]: item
                }
            })
        }
        return jsontoxml({ [tag]: dados })
    }

    serializar(data) {
        data = this.filtrar(data)
        if (this.contentType === 'application/json') {
            return this.json(data)
        }

        if (this.contentType === 'application/xml') {
            return this.xml(data)
        }

        throw new InvalidType(this.contentType)
    }

    filtrarObjeto(dados) {
        const novoObjeto = {}

        this.camposPublicos.forEach((campo) => {
            if (dados.hasOwnProperty(campo)) {
                novoObjeto[campo] = dados[campo]
            }
        })

        return novoObjeto
    }

    filtrar(dados) {
        if (Array.isArray(dados)) {
            dados = dados.map((dado) => {
                return this.filtrarObjeto(dado)
            })
        } else {
            dados = this.filtrarObjeto(dados)
        }

        return dados
    }


}

class SerializerFornecedor extends Serializer {
    constructor(contentType, camposExtras) {
        super()
        this.contentType = contentType
        this.camposPublicos = ['id', 'categoria'].concat(camposExtras || [])
        this.tagSingular = 'fornecedor'
        this.tagPlural = 'fornecedores'
    }
}

class SerializerErro extends Serializer {
    constructor(contentType, camposExtras) {
        super()
        this.contentType = contentType
        this.camposPublicos = ['id', 'mensagem'].concat(camposExtras || [])
        this.tagSingular = 'erro'
        this.tagPlural = 'erros'
    }
}

class SerializerProduto extends Serializer {
    constructor(contentType, camposExtras) {
        super()
        this.contentType = contentType
        this.camposPublicos = ['id', 'titulo'].concat(camposExtras || [])
        this.tagSingular = 'produto'
        this.tagPlural = 'produtos'
    }
}

module.exports = {
    Serializer: Serializer,
    SerializerFornecedor: SerializerFornecedor,
    SerializerErro: SerializerErro,
    SerializerProduto: SerializerProduto,
    formatosAceitos: ['application/json', 'application/xml']
}