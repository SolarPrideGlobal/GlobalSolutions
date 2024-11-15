// Função para calcular a economia financeira
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
  
    return {
        potenciaSistemaKw: potenciaNecessaria.toFixed(2),
        custoSistema: custoSistema.toFixed(2),
        economiaMensal: economiaMensal.toFixed(2),
        economiaAnual: economiaAnual.toFixed(2),
        economia25Anos: economia25Anos.toFixed(2),
        paybackMeses: paybackMeses.toFixed(1),
    };
}
  
// Função para calcular métricas ambientais
function calcularMetricasAmbientais(consumoMensal) {
    const VIDA_UTIL = 25;
    const kwhEconomiaAnual = consumoMensal * 12;
    const CO2_POR_KWH = 0.084; // em kg CO₂ por kWh
    const CO2_AVOIDED = (kwhEconomiaAnual * CO2_POR_KWH * VIDA_UTIL) / 1000; // Convertido para toneladas
    const TREES_EQUIVALENT = Math.floor(CO2_AVOIDED * 7.14); // Cada árvore absorve ~7.14 kg de CO₂ por ano
  
    return {
        co2Avoided: CO2_AVOIDED.toFixed(1),
        treesEquivalent: TREES_EQUIVALENT,
    };
}

const data = {
    labels: ['Redução de Consumo', 'Gasto Energia Elétrica', 'Gasto Energia Solar'],
    datasets: [{
        data: [75, 850, 350],
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

const config = {
    type: 'bar',
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: true,
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
            },
            x: {
                ticks: {
                    font: {
                        size: 12
                    }
                }
            }
        }
    }
};

window.onload = function() {
    new Chart(
        document.getElementById('energyComparison'),
        config
    );
};

// Função para exibir resultados na interface
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Previne o comportamento padrão do formulário
        
        const consumoMensal = parseFloat(document.querySelector("input[placeholder='Digite seu consumo mensal em kWh']").value);
        const valorConta = parseFloat(document.querySelector("input[placeholder='Valor da conta de luz']").value);
      
        if (isNaN(consumoMensal) || isNaN(valorConta) || consumoMensal <= 0 || valorConta <= 0) {
            alert("Por favor, insira valores válidos para o consumo e o valor da conta.");
            return;
        }
      
        // Calculando resultados financeiros
        const economia = calcularEconomia(consumoMensal, valorConta);
      
        // Calculando métricas ambientais
        const metricas = calcularMetricasAmbientais(consumoMensal);
      
        // Atualizando o Dashboard
        document.getElementById("systemCost").textContent = `R$ ${economia.custoSistema}`;
        document.getElementById("monthlyEconomy").textContent = `R$ ${economia.economiaMensal}`;
        document.getElementById("yearlyEconomy").textContent = `R$ ${economia.economiaAnual}`;
        document.getElementById("returnYears").textContent = `${(economia.paybackMeses / 12).toFixed(1)} anos`;
      
        // Atualizando as estatísticas
        document.getElementById("total-savings").textContent = `R$ ${economia.economia25Anos}`;
        document.getElementById("trees").textContent = metricas.treesEquivalent;
        document.getElementById("consumption-reduction").textContent = `${(consumoMensal * 12 * 25).toFixed(0)} kWh`;
        document.getElementById("co2-saved").textContent = `${metricas.co2Avoided} toneladas`;
    });
});
