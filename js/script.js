document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('energyComparison');
    if (canvas) {
        chart = new Chart(canvas, config);
    }

    // Corrigindo o seletor do formulário para pegar o formulário correto
    const form = document.querySelector('.login-form').closest('form');
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Corrigindo os seletores para corresponder aos IDs do HTML
            const consumoInput = document.getElementById('consumption');
            const valorInput = document.getElementById('conta');
            
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
          
            // Atualizando o Dashboard com formatação de números
            const formatter = new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            // Atualizar elementos com formatação adequada
            document.getElementById("systemCost").textContent = 
                `R$ ${formatter.format(parseFloat(economia.custoSistema))}`;
            document.getElementById("monthlyEconomy").textContent = 
                `R$ ${formatter.format(parseFloat(economia.economiaMensal))}`;
            document.getElementById("yearlyEconomy").textContent = 
                `R$ ${formatter.format(parseFloat(economia.economiaAnual))}`;
            document.getElementById("returnYears").textContent = 
                `${(parseFloat(economia.paybackMeses) / 12).toFixed(1)} anos`;
            document.getElementById("consumption-reduction").textContent = 
                `${parseFloat(economia.eficienciaEnergetica).toFixed(1)}%`;
            document.getElementById("trees").textContent = 
                metricas.treesEquivalent;
            document.getElementById("co2-saved").textContent = 
                `${metricas.co2Avoided} toneladas`;

            // Atualizar o gráfico
            if (chart) {
                atualizarGrafico(chart, valorConta, parseFloat(economia.economiaMensal));
            }
        });
    }
});

// Mantendo as funções de cálculo inalteradas
function calcularMetricasAmbientais(consumoMensal) {
    const KG_CO2_POR_KWH = 0.475;
    const KG_CO2_POR_ARVORE_ANO = 22;
    
    const co2AnualEvitado = (consumoMensal * 12 * KG_CO2_POR_KWH);
    const arvoresEquivalentes = Math.ceil((co2AnualEvitado * 1.2) / KG_CO2_POR_ARVORE_ANO);

    return {
        co2Avoided: (co2AnualEvitado / 1000).toFixed(2),
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

// Configuração do gráfico
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

let chart;

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
    };

    chart.data = novosDados;
    chart.update();
}
