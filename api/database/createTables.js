const models = [
    require('../routes/fornecedores/ModeloTabelaFornecedor'),
    require('../routes/fornecedores/produtos/ModeloTabelaProduto')
]

async function createTables() {
    for (let contador = 0; contador < models.length; contador++) {
        const model = models[contador]
        await model.sync()
    }
}

createTables()