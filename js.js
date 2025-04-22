const fs = require('fs');
const path = require('path');
const readline = require('readline');

const banco = path.join(__dirname, 'banco.json');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let transacoes = [];

function carregarTransacoes() {
    if (fs.existsSync(banco)) {
        const data = fs.readFileSync(banco, 'utf-8');
        try {
            transacoes = JSON.parse(data);
        } catch (error) {
            console.error("Erro ao ler banco.json. Criando novo banco...");
            transacoes = [];
        }
    }
}

function salvarTransacoes() {
    fs.writeFileSync(banco, JSON.stringify(transacoes, null, 2));
}

function menu() {
    console.log("\n --- Dashboard Financeiro Lindão --- \n");
    console.log("1. Adicionar entrada");
    console.log("2. Adicionar saída");
    console.log("3. Listar transações");
    console.log("4. Filtrar por data");
    console.log("5. Ver resumo");
    console.log("0. Sair\n");

    rl.question('Escolha uma opção: ', (resposta) => {
        switch (resposta) {
            case '1':
                adicionarTransacao('entrada');
                break;
            case '2':
                adicionarTransacao('saída');
                break;
            case '3':
                listarTransacoes();
                break;
            case '4':
                filtrarPorData();
                break;
            case '5':
                mostrarResumo();
                break;
            case '0':
                rl.close();
                break;
            default:
                console.log("Opção inválida");
                menu();
                break;
        }
    });
}

function adicionarTransacao(tipo) {
    rl.question('Descrição: ', (descricao) => {
        rl.question('Valor: ', (valor) => {
            const valorNumerico = parseFloat(valor);
            if (isNaN(valorNumerico)) {
                console.log('Valor inválido.');
                return menu();
            }
            rl.question('Data (dd/mm/aaaa): ', (data) => {
                if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
                    console.log('Data inválida. Formato esperado: dd/mm/aaaa.');
                    return menu();
                }

                const nova = { tipo, descricao, valor: valorNumerico, data };
                transacoes.push(nova);
                salvarTransacoes();

                console.log(`${tipo === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso!`);
                menu();
            });
        });
    });
}

function listarTransacoes() {
    if (transacoes.length === 0) {
        console.log("Nenhuma transação registrada.");
    } else {
        console.log('\n --- Transações ---');
        transacoes.forEach((transacao, index) => {
            console.log(`${index + 1}. [${transacao.tipo}] R$ ${transacao.valor.toFixed(2)} - ${transacao.descricao} feito em ${transacao.data}`);
        });
    }
    menu();
}

function filtrarPorData() {
    rl.question('Digite a data para filtrar (dd/mm/aaaa): ', (data) => {
        const filtradas = transacoes.filter((transacao) => transacao.data === data);
        if (filtradas.length === 0) {
            console.log('Nenhuma transação encontrada para a data informada.');
        } else {
            console.log('\n --- Transações filtradas ---');
            filtradas.forEach((transacao, index) => {
                console.log(`${index + 1}. [${transacao.tipo}] R$ ${transacao.valor.toFixed(2)} - ${transacao.descricao} feito em ${transacao.data}`);
            });
        }
        menu();
    });
}

function mostrarResumo() {
    const entradas = transacoes
        .filter((t) => t.tipo === "entrada")
        .reduce((acc, t) => acc + t.valor, 0);

    const saidas = transacoes
        .filter((t) => t.tipo === "saída")
        .reduce((acc, t) => acc + t.valor, 0);

    const saldo = entradas - saidas;

    console.log('\n --- Resumo Financeiro ---');
    console.log(`Entradas: R$ ${entradas.toFixed(2)}`);
    console.log(`Saídas: R$ ${saidas.toFixed(2)}`);
    console.log(`Saldo: R$ ${saldo.toFixed(2)}`);
    menu();
}

carregarTransacoes();
menu();
