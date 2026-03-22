let chart;

function predict() {
    const data = {
        state: +state.value,
        district: +district.value,
        population: +population.value,
        police: +police.value,
        urban: +urban.value
    };

    fetch("/predict", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        animateValue("crimeValue", res.prediction);
        setGauge(res.risk);
        drawChart(res.prediction);
    });
}

function animateValue(id, value) {
    let el = document.getElementById(id);
    let start = 0;
    let step = value / 40;

    let interval = setInterval(() => {
        start += step;
        el.innerText = Math.round(start);
        if (start >= value) {
            el.innerText = value;
            clearInterval(interval);
        }
    }, 20);
}

function setGauge(risk) {
    let needle = document.getElementById("needle");
    let label = document.getElementById("riskLevel");

    label.innerText = risk;

    if (risk === "Low") needle.style.transform = "rotate(-60deg)";
    else if (risk === "Medium") needle.style.transform = "rotate(0deg)";
    else needle.style.transform = "rotate(60deg)";
}

function drawChart(val) {
    const ctx = document.getElementById("crimeChart");
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["AI Prediction"],
            datasets: [{
                data: [val],
                borderWidth: 3,
                tension: 0.4
            }]
        }
    });
}

function toggleTheme() {
    document.body.classList.toggle("light");
    document.body.classList.toggle("dark");
}

function startVoice() {
    const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    rec.lang = "en-US";
    rec.onresult = e => {
        let text = e.results[0][0].transcript.toLowerCase();
        if (text.includes("high")) state.value = 3;
        if (text.includes("medium")) state.value = 2;
        if (text.includes("low")) state.value = 1;
        alert("Voice input applied");
    };
    rec.start();
}
