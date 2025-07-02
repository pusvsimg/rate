// --- Constants and Configuration ---
const currencyNames = {
  USD: '美元 (USD)',
  EUR: '欧元 (EUR)',
  GBP: '英镑 (GBP)',
  JPY: '日元 (JPY)',
  CNY: '人民币 (CNY)',
  CAD: '加元 (CAD)',
  AUD: '澳元 (AUD)',
  CHF: '瑞士法郎 (CHF)',
  HKD: '港币 (HKD)',
  SGD: '新加坡元 (SGD)',
  KRW: '韩元 (KRW)',
  INR: '印度卢比 (INR)',
};

const currencyFlags = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  JPY: '🇯🇵',
  CNY: '🇨🇳',
  CAD: '🇨🇦',
  AUD: '🇦🇺',
  CHF: '🇨🇭',
  HKD: '🇭🇰',
  SGD: '🇸🇬',
  KRW: '🇰🇷',
  INR: '🇮🇳',
};

const currencies = Object.keys(currencyNames);

// --- DOM Elements ---
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const swapButton = document.getElementById('swap-button');
const statusMessagesDiv = document.getElementById('status-messages');
const toggleChartButton = document.getElementById('toggle-chart-button');
const chartContainer = document.getElementById('chart-container');
const historicalChartCanvas = document.getElementById('historicalChart');
const usdCnyButton = document.getElementById('usd-cny-button');
const eurCnyButton = document.getElementById('eur-cny-button');
const gbpCnyButton = document.getElementById('gbp-cny-button');

// --- State Management ---
let currentChart = null; // To store the Chart.js instance
let state = {
  amount: 1,
  fromCurrency: 'USD',
  toCurrency: 'CNY', // Default to a common pair
  exchangeRate: null,
  convertedAmount: null,
  error: null,
  loading: false,
  historicalData: null,
  showChart: false,
};

// --- UI Functions ---

function populateCurrencySelects() {
  const fromFragment = document.createDocumentFragment();
  const toFragment = document.createDocumentFragment();

  currencies.forEach(currency => {
    const optionText = `${currencyFlags[currency]} ${currencyNames[currency]}`;
    
    const optionFrom = document.createElement('option');
    optionFrom.value = currency;
    optionFrom.textContent = optionText;
    fromFragment.appendChild(optionFrom);

    const optionTo = document.createElement('option');
    optionTo.value = currency;
    optionTo.textContent = optionText;
    toFragment.appendChild(optionTo);
  });

  fromCurrencySelect.appendChild(fromFragment);
  toCurrencySelect.appendChild(toFragment);

  fromCurrencySelect.value = state.fromCurrency;
  toCurrencySelect.value = state.toCurrency;
}

function updateUI() {
  statusMessagesDiv.innerHTML = '';

  if (state.loading) {
    statusMessagesDiv.innerHTML = `
        <div class="status-message loading">
          <div class="loading-spinner"></div>
          正在获取最新汇率...
        </div>
      `;
  } else if (state.error) {
    statusMessagesDiv.innerHTML = `
        <div class="status-message error">
          <i class="fas fa-exclamation-triangle"></i>
          ${state.error}
        </div>
      `;
  } else if (state.exchangeRate !== null && state.convertedAmount !== null) {
    statusMessagesDiv.innerHTML = `
        <div class="status-message success">
          <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
            <div style="display: flex; align-items: center; gap: var(--space-sm); font-weight: 600; font-size: 1.1rem;">
              <i class="fas fa-calculator"></i>
              兑换结果
            </div>
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-accent); text-align: center; margin: var(--space-md) 0;">
              ${currencyFlags[state.fromCurrency]} ${state.amount} ${state.fromCurrency} → ${currencyFlags[state.toCurrency]} ${state.convertedAmount} ${state.toCurrency}
            </div>
            <div style="font-size: 0.95rem; opacity: 0.9;">
              当前汇率: 1 ${state.fromCurrency} = ${state.exchangeRate} ${state.toCurrency}
            </div>
            <div style="font-size: 0.85rem; opacity: 0.7; display: flex; align-items: center; gap: var(--space-xs);">
              <i class="fas fa-clock"></i>
              数据更新时间: ${new Date().toLocaleString('zh-CN')}
            </div>
          </div>
        </div>
      `;
  }

  if (state.showChart) {
    chartContainer.style.display = 'block';
    toggleChartButton.innerHTML = `<i class="fas fa-chart-line"></i> 隐藏走势图`;
    if (state.historicalData) {
      renderChart();
    } else if (!state.loading && !state.error && state.fromCurrency !== state.toCurrency) {
      statusMessagesDiv.innerHTML += `
          <div class="status-message loading">
            <div class="loading-spinner"></div>
            正在加载走势图数据...
          </div>
        `;
    }
  } else {
    chartContainer.style.display = 'none';
    toggleChartButton.innerHTML = `<i class="fas fa-chart-area"></i> 显示历史走势`;
  }
}

function renderChart() {
    if (currentChart) {
        currentChart.destroy();
    }

    if (!state.historicalData || state.fromCurrency === state.toCurrency) {
        chartContainer.style.display = 'none';
        return;
    };

    const ctx = historicalChartCanvas.getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: state.historicalData.labels,
            datasets: [{
                label: `${state.fromCurrency} → ${state.toCurrency}`,
                data: state.historicalData.rates,
                fill: true,
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderColor: '#6366f1',
                borderWidth: 3,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#f8fafc',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.4,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#cbd5e1', font: { family: 'Inter' } }
                },
                title: {
                    display: true,
                    text: `${currencyFlags[state.fromCurrency]} ${state.fromCurrency} → ${currencyFlags[state.toCurrency]} ${state.toCurrency} 汇率走势 (过去30天)`,
                    color: '#f8fafc',
                    font: { size: 16, family: 'Inter', weight: '600' },
                    padding: { top: 10, bottom: 30 },
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    titleColor: '#f8fafc',
                    bodyColor: '#cbd5e1',
                    borderColor: '#6366f1',
                    borderWidth: 1,
                    callbacks: {
                        label: (context) => `汇率: ${Number(context.raw).toFixed(4)}`,
                    },
                },
            },
            scales: {
                x: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(148, 163, 184, 0.1)' },
                },
                y: {
                    ticks: { color: '#94a3b8', callback: (value) => Number(value).toFixed(4) },
                    grid: { color: 'rgba(148, 163, 184, 0.1)' },
                },
            },
        },
    });
}

// --- Data Fetching ---

async function fetchExchangeRate() {
  state.error = null;
  state.loading = true;
  updateUI();

  if (state.fromCurrency === state.toCurrency) {
    state.exchangeRate = 1;
    state.convertedAmount = Number(state.amount).toFixed(2);
    state.loading = false;
    updateUI();
    return;
  }

  try {
    const response = await fetch(`https://api.frankfurter.app/latest?from=${state.fromCurrency}&to=${state.toCurrency}`);
    if (!response.ok) {
      throw new Error('获取汇率数据失败');
    }
    const data = await response.json();
    if (data.rates && data.rates[state.toCurrency]) {
      const rate = data.rates[state.toCurrency];
      state.exchangeRate = rate;
      state.convertedAmount = (state.amount * rate).toFixed(2);
    } else {
      state.error = `无法获取 ${state.fromCurrency} 到 ${state.toCurrency} 的汇率。`;
    }
  } catch (err) {
    state.error = '获取汇率时出错，请检查网络连接并重试。';
    console.error(err);
  } finally {
    state.loading = false;
    updateUI();
  }
}

async function fetchHistoricalData() {
  if (state.fromCurrency === state.toCurrency) {
    state.historicalData = null;
    updateUI();
    return;
  }

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const formatDate = (date) => date.toISOString().split('T')[0];
  const startDate = formatDate(thirtyDaysAgo);
  const endDate = formatDate(today);

  try {
    const response = await fetch(`https://api.frankfurter.app/${startDate}..${endDate}?from=${state.fromCurrency}&to=${state.toCurrency}`);
    if (!response.ok) {
      throw new Error('获取历史数据失败');
    }
    const data = await response.json();
    if (data.rates) {
      const labels = Object.keys(data.rates).sort();
      const rates = labels.map(date => data.rates[date][state.toCurrency]);
      state.historicalData = { labels, rates };
    }
  } catch (err) {
    console.error('获取历史数据时出错:', err);
    state.historicalData = null;
  } finally {
    updateUI();
  }
}

// --- Logic & Event Handling ---

function updateData() {
  fetchExchangeRate();
  if (state.showChart) {
    fetchHistoricalData();
  } else {
    state.historicalData = null;
    if (currentChart) {
        currentChart.destroy();
        currentChart = null;
    }
    updateUI();
  }
}

function handleQuickAction(from, to) {
  fromCurrencySelect.value = from;
  toCurrencySelect.value = to;
  amountInput.value = 1;
  
  state.amount = 1;
  state.fromCurrency = from;
  state.toCurrency = to;
  
  updateData();
}

function setupEventListeners() {
  amountInput.addEventListener('input', (e) => {
    state.amount = parseFloat(e.target.value) || 0;
    if (state.amount > 0) {
      fetchExchangeRate();
    } else {
      state.convertedAmount = null;
      state.exchangeRate = null;
      updateUI();
    }
  });

  fromCurrencySelect.addEventListener('change', (e) => {
    state.fromCurrency = e.target.value;
    updateData();
  });

  toCurrencySelect.addEventListener('change', (e) => {
    state.toCurrency = e.target.value;
    updateData();
  });

  swapButton.addEventListener('click', () => {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
    
    state.fromCurrency = fromCurrencySelect.value;
    state.toCurrency = toCurrencySelect.value;
    updateData();
  });

  toggleChartButton.addEventListener('click', () => {
    state.showChart = !state.showChart;
    updateData();
  });

  usdCnyButton.addEventListener('click', () => handleQuickAction('USD', 'CNY'));
  eurCnyButton.addEventListener('click', () => handleQuickAction('EUR', 'CNY'));
  gbpCnyButton.addEventListener('click', () => handleQuickAction('GBP', 'CNY'));
}

// --- Initialization ---
function init() {
  populateCurrencySelects();
  setupEventListeners();
  updateData();
}

document.addEventListener('DOMContentLoaded', init);