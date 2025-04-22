import fs from 'fs';
import readline from 'readline';
import áth from 'path';


const banco = path.join(_dirname, 'banco.js');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


let transacoes = []

function carregarTrasacoes(){
    if(fs.existsSync(banco)){
            const data = fs.readFileSync(banco, 'utf-8')
        try{
            transacoes.JSON.parse(data);
        }catch{
            console.error("erro ao ler banco.json. Criando novo banco...");
            transacoes = []
        }
    }
}

function salvarTransicao(){
    fs.writeFileSync(banco, JSON.stringify(transacoes,null,2))
}

function menu(){
    console.log("\n --- Dasbord Financeiro Lindaõ --- \n");
    console.log("1. Adicionar entrada");
    console.log("2. Adicionar saida");
    console.log("3. Listar transações");
    console.log("4. Filtrar por data");
    console.log("5. ver resumo");
    console.log("0.Sair\n");


    rl.question('escolha uma opção: ', (reposta) => {
        switch(reposta){
            case '1':
            adicionarTransacao('entrada');
            break;

            case '2':
            adicionarTransacao('saída');
            break;

            case '3':
            ListarTransacao()
            break;

            case '4':
            FiltarporData()
            break;

            case '5':
            mostarResumo()
            break;

            case '0':
            rl.close();
            break;

            default:
            console.log("Opção invalida");
            menu();
            break;
        }
    })
    
}