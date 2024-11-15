// Função para calcular métricas ambientais com valores ajustados
function calcularMetricasAmbientais(consumoMensal) {
    // Fatores de conversão ajustados:
    // - Média de emissão do grid brasileiro: 0.475 kg CO2/kWh (fonte: Ministério da Ciência e Tecnologia)
    // - Uma árvore absorve em média 22 kg de CO2 por ano
    const KG_CO2_POR_KWH = 0.475;
    const KG_CO2_POR_ARVORE_ANO = 22;
    
    // Cálculo do CO2 evitado anualmente
    const co2AnualEvitado = (consumoMensal * 12 * KG_CO2_POR_KWH);
    
    // Cálculo do número de árvores equivalentes
    // Multiplicamos por 1.2 para considerar outros benefícios ambientais
    const arvoresEquivalentes = Math.ceil((co2AnualEvitado * 1.2) / KG_CO2_POR_ARVORE_ANO);

    return {
        co2Avoided: (co2AnualEvitado / 1000).toFixed(2), // Convertendo para toneladas
        treesEquivalent: arvoresEquivalentes
    };
}

function calcularEconomia(consumoMensal, valorConta) {
    const TAXA_MINIMA = 30;
    const PERDA_EFICIENCIA = 0.20;
    const CUSTO_POR_KW = 4000;
    const VIDA_UTIL = 25;
  
    const consumoAjustado = consumoMensal * (1 + PERDA_EFICIENCIA);
    const potenciaNecessaria = consumoAjustado / 30 / 4;
    const custoSistema = potenciaNecessaria * CUSTO_POR_KW;
    const economiaMensal = valorConta - TAXA_MINIMA;
    const economiaAnual = economiaMensal * 12;
    const economia25Anos = economiaAnual * VIDA_UTIL;
    const paybackMeses = custoSistema / economiaMensal;
    
    const eficienciaEnergetica = ((valorConta - TAXA_MINIMA) / valorConta * 100);
  
    return {
        potenciaSistemaKw: potenciaNecessaria.toFixed(2),
        custoSistema: custoSistema.toFixed(2),
        economiaMensal: economiaMensal.toFixed(2),
        economiaAnual: economiaAnual.toFixed(2),
        economia25Anos: economia25Anos.toFixed(2),
        paybackMeses: paybackMeses.toFixed(1),
        eficienciaEnergetica: eficienciaEnergetica.toFixed(1)
    };
}

// Função para atualizar o gráfico com os novos dados
function atualizarGrafico(chart, valorConta, economiaMensal) {
    const gastoEnergiaEletrica = valorConta;
    const gastoEnergiaSolar = 30; // Taxa mínima
    const eficienciaEnergetica = ((valorConta - gastoEnergiaSolar) / valorConta * 100);

    const novosDados = {
        labels: ['Eficiência Energética (%)', 'Gasto Energia Elétrica (R$)', 'Gasto Energia Solar (R$)'],
        datasets: [{
            data: [
                eficienciaEnergetica,
                gastoEnergiaEletrica,
                gastoEnergiaSolar
            ],
            backgroundColor: [
                'rgba(46, 204, 113, 0.7)',  // Verde
                'rgba(231, 76, 60, 0.7)',   // Vermelho
                'rgba(241, 196, 15, 0.7)'   // Amarelo
            ],
            borderColor: [
                'rgba(46, 204, 113, 1)',
                'rgba(231, 76, 60, 1)',
                'rgba(241, 196, 15, 1)'
            ],
            borderWidth: 1
        }]
    };

    chart.data = novosDados;
    chart.update();
}

let chart; // Variável global para o gráfico

// Configuração inicial do gráfico
const config = {
    type: 'bar',
    data: {
        labels: ['Eficiência Energética (%)', 'Gasto Energia Elétrica (R$)', 'Gasto Energia Solar (R$)'],
        datasets: [{
            data: [0, 0, 0],
            backgroundColor: [
                'rgba(46, 204, 113, 0.7)',
                'rgba(231, 76, 60, 0.7)',
                'rgba(241, 196, 15, 0.7)'
            ],
            borderColor: [
                'rgba(46, 204, 113, 1)',
                'rgba(231, 76, 60, 1)',
                'rgba(241, 196, 15, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Comparativo de Consumo e Gastos',
                font: {
                    size: 16
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Valor (R$ / %)',
                    font: {
                        size: 14
                    }
                }
            }
        }
    }
};

// Inicialização após o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('energyComparison');
    if (canvas) {
        chart = new Chart(canvas, config);
    }

    const form = document.querySelector('form');
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const consumoInput = document.querySelector("input[placeholder='Digite seu consumo mensal em kWh']");
            const valorInput = document.querySelector("input[placeholder='Valor da conta de luz']");
            
            if (!consumoInput || !valorInput) {
                console.error("Inputs não encontrados");
                return;
            }

            const consumoMensal = parseFloat(consumoInput.value);
            const valorConta = parseFloat(valorInput.value);
          
            if (isNaN(consumoMensal) || isNaN(valorConta) || consumoMensal <= 0 || valorConta <= 0) {
                alert("Por favor, insira valores válidos para o consumo e o valor da conta.");
                return;
            }
          
            // Calculando resultados
            const economia = calcularEconomia(consumoMensal, valorConta);
            const metricas = calcularMetricasAmbientais(consumoMensal);
          
            // Atualizando o Dashboard
            const elements = {
                systemCost: document.getElementById("systemCost"),
                monthlyEconomy: document.getElementById("monthlyEconomy"),
                yearlyEconomy: document.getElementById("yearlyEconomy"),
                returnYears: document.getElementById("returnYears"),
                totalSavings: document.getElementById("total-savings"),
                trees: document.getElementById("trees"),
                consumptionReduction: document.getElementById("consumption-reduction"),
                co2Saved: document.getElementById("co2-saved")
            };

            // Atualizar elementos se eles existirem
            if (elements.systemCost) elements.systemCost.textContent = `R$ ${economia.custoSistema}`;
            if (elements.monthlyEconomy) elements.monthlyEconomy.textContent = `R$ ${economia.economiaMensal}`;
            if (elements.yearlyEconomy) elements.yearlyEconomy.textContent = `R$ ${economia.economiaAnual}`;
            if (elements.returnYears) elements.returnYears.textContent = `${(economia.paybackMeses / 12).toFixed(1)} anos`;
            if (elements.totalSavings) elements.totalSavings.textContent = `R$ ${economia.economia25Anos}`;
            if (elements.trees) elements.trees.textContent = metricas.treesEquivalent;
            if (elements.consumptionReduction) elements.consumptionReduction.textContent = `${economia.eficienciaEnergetica}%`;
            if (elements.co2Saved) elements.co2Saved.textContent = `${metricas.co2Avoided} toneladas`;

            // Atualizar o gráfico se ele existir
            if (chart) {
                atualizarGrafico(chart, valorConta, parseFloat(economia.economiaMensal));
            }
        });
    }
})
