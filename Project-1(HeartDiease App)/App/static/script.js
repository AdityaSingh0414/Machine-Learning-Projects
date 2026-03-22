document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');
    const predictionForm = document.getElementById('prediction-form');
    const submitBtn = document.getElementById('submit-btn');
    const resultsSection = document.getElementById('results-section');
    
    // Initial Load
    loadDashboardData();
    
    // --- NAVIGATION LOGIC ---
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetView = item.getAttribute('data-view');
            
            // Update Active Nav
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Switch Views
            views.forEach(v => v.classList.add('hidden'));
            document.getElementById(targetView).classList.remove('hidden');
            
            // Specific View Loading
            if (targetView === 'analytics-view') loadAnalytics();
            if (targetView === 'data-view') loadRawData();
        });
    });

    // --- DASHBOARD DATA (Summary) ---
    async function loadDashboardData() {
        try {
            const response = await fetch('/analytics-data');
            const data = await response.json();
            
            document.getElementById('stat-total').innerText = data.total_samples;
            document.getElementById('stat-age').innerText = Math.round(data.mean_age);
            document.getElementById('stat-prevalence').innerText = Math.round((data.high_risk_count / data.total_samples) * 100) + '%';
            document.getElementById('stat-hr').innerText = Math.round(data.avg_max_hr);
            
            renderDashboardCharts(data);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }

    function renderDashboardCharts(data) {
        const pieData = [{
            values: [data.total_samples - data.high_risk_count, data.high_risk_count],
            labels: ['Low Risk', 'High Risk'],
            type: 'pie',
            marker: { colors: ['#10b981', '#ef4444'] },
            hole: 0.4
        }];
        const layout = { 
            paper_bgcolor: 'rgba(0,0,0,0)', 
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#f8fafc' },
            showlegend: true,
            margin: { t: 0, b: 0, l: 0, r: 0 }
        };
        Plotly.newPlot('risk-pie-chart', pieData, layout);
    }

    // --- ANALYTICS LOGIC ---
    async function loadAnalytics() {
        const response = await fetch('/analytics-data');
        const data = await response.json();
        
        // 1. Correlation Heatmap
        const corr = data.correlation_matrix;
        const keys = Object.keys(corr);
        const zValues = keys.map(k => keys.map(k2 => corr[k][k2]));
        
        const heatmap = [{
            z: zValues,
            x: keys,
            y: keys,
            type: 'heatmap',
            colorscale: 'Viridis'
        }];
        const heatLayout = {
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#f8fafc', size: 10 },
            margin: { t: 30, b: 80, l: 80, r: 30 }
        };
        Plotly.newPlot('corr-heatmap', heatmap, heatLayout);

        // 2. Cholesterol Distribution
        const cholLow = data.cholesterol_by_risk.low;
        const cholHigh = data.cholesterol_by_risk.high;
        
        const cholTrace = [
            { x: cholLow, type: 'histogram', name: 'Low Risk', opacity: 0.6, marker: {color: '#10b981'} },
            { x: cholHigh, type: 'histogram', name: 'High Risk', opacity: 0.6, marker: {color: '#ef4444'} }
        ];
        Plotly.newPlot('chol-dist-chart', cholTrace, {
            ...heatLayout, barmode: 'overlay', margin: {t: 0, b: 40, l: 40, r: 10}
        });

        // 3. Age Distribution
        const ageTrace = [{
            x: data.age_distribution,
            type: 'histogram',
            marker: { color: '#6366f1' }
        }];
        Plotly.newPlot('age-dist-chart', ageTrace, {
            ...heatLayout, margin: {t: 0, b: 40, l: 40, r: 10}
        });
    }

    // --- DATA EXPLORER LOGIC ---
    async function loadRawData() {
        const response = await fetch('/raw-data');
        const data = await response.json();
        
        const header = document.getElementById('table-header');
        const body = document.getElementById('table-body');
        
        // Headers
        header.innerHTML = '';
        Object.keys(data[0]).forEach(key => {
            const th = document.createElement('th');
            th.innerText = key;
            header.appendChild(th);
        });
        
        // Rows
        body.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            Object.values(row).forEach(val => {
                const td = document.createElement('td');
                td.innerText = val;
                tr.appendChild(td);
            });
            body.appendChild(tr);
        });
    }

    // --- PREDICTION LOGIC (Existing) ---
    predictionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const originalBtnText = submitBtn.innerText;
        submitBtn.disabled = true;
        submitBtn.innerText = 'Analyzing clinically...';
        
        const formData = new FormData(predictionForm);
        const data = {};
        formData.forEach((value, key) => data[key] = isNaN(value) ? value : parseFloat(value));

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (response.ok) displayPredictionResults(result);
            else alert('Error: ' + result.error);
        } catch (error) {
            alert('Connection Error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
        }
    });

    function displayPredictionResults(data) {
        resultsSection.classList.remove('hidden');
        const prob = Math.round(data.probability * 100);
        document.getElementById('probability-text').innerText = prob + '%';
        const riskLevelLabel = document.getElementById('risk-level');
        riskLevelLabel.innerText = data.risk_level;
        
        const riskCircle = document.getElementById('risk-score-ring');
        riskCircle.classList.remove('risk-low', 'risk-high');
        
        const desc = document.getElementById('result-desc');
        if (data.prediction === 1) {
            riskCircle.classList.add('risk-high');
            desc.innerText = 'High risk detected. Immediate clinical consultation is advised.';
        } else {
            riskCircle.classList.add('risk-low');
            desc.innerText = 'Low risk detected. Maintain healthy lifestyle choices.';
        }
    }
});
