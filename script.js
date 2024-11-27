let data = []; // Variável global para armazenar os dados da planilha

// Função para ler a planilha Excel
function handleFile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const fileData = event.target.result;
        const workbook = XLSX.read(fileData, { type: 'array' });

        // Certifique-se de que o nome da aba é "telas"
        const sheetName = workbook.SheetNames.find(name => name.toLowerCase() === 'telas');
        if (!sheetName) {
            alert('A aba "telas" não foi encontrada na planilha.');
            return;
        }

        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Exibe os dados no console para depuração
        console.log('Dados carregados da planilha:', jsonData);

        data = jsonData; // Atualiza a variável global
        displayData(data);
    };

    reader.readAsArrayBuffer(file);
}

// Exibir os dados na tabela
function displayData(data) {
    const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ""; // Limpar a tabela antes de adicionar os dados

    if (data.length === 0) {
        console.log('Nenhum dado encontrado para exibir.');
    }

    data.forEach((item, index) => {
        const row = tableBody.insertRow();

        // Certifique-se de que os nomes correspondem exatamente aos cabeçalhos da planilha
        const tela = item['tela'] || 'N/A'; // Se não existir, exibe 'N/A'
        const descricao = item['descricao'] || 'N/A';
        const fila = item['fila'] || 'N/A';

        row.insertCell(0).textContent = tela;
        row.insertCell(1).textContent = descricao;
        row.insertCell(2).textContent = fila;
    });

    document.getElementById('message').style.display = data.length === 0 ? 'block' : 'none';
}

// Função para filtrar dados
function filtrarDados(criterio) {
    const filtro = criterio.toUpperCase();

    const dadosFiltrados = data.filter(item => {
        return (
            (item['tela'] && item['tela'].toString().toUpperCase().includes(filtro)) ||
            (item['descricao'] && item['descricao'].toUpperCase().includes(filtro)) ||
            (item['fila'] && item['fila'].toUpperCase().includes(filtro))
        );
    });

    displayData(dadosFiltrados);

    const message = document.getElementById('message');
    message.style.display = dadosFiltrados.length === 0 ? 'block' : 'none';
}

// Função de pesquisa
function searchTable() {
    const input = document.getElementById('searchInput').value;
    filtrarDados(input);
}

// Adicionar a função de upload de arquivo
document.getElementById('fileInput').addEventListener('change', handleFile, false);
