document.addEventListener('DOMContentLoaded', () => {
    const assistantContainer = document.getElementById('strategy-assistant-root');
    if (!assistantContainer) return;

    // State
    const state = {
        step: 0,
        data: {
            companySize: '',
            bottleneck: '',
            techStack: []
        },
        recommendation: null
    };

    // Configuration
    const steps = [
        {
            id: 'size',
            question: "How large is your organization?",
            type: 'single',
            options: [
                { label: "1–10 Employees", value: "1-10" },
                { label: "10–50 Employees", value: "10-50" },
                { label: "50–200 Employees", value: "50-200" },
                { label: "200+ Employees", value: "200+" }
            ]
        },
        {
            id: 'bottleneck',
            question: "What is your primary operational bottleneck?",
            type: 'single',
            options: [
                { label: "Manual Data Entry", value: "data-entry" },
                { label: "Slow Sales Process", value: "sales" },
                { label: "Customer Support Overload", value: "support" },
                { label: "Reporting Chaos", value: "reporting" },
                { label: "Tool Fragmentation", value: "fragmentation" }
            ]
        },
        {
            id: 'tech',
            question: "Which tools do you currently use? (Select all that apply)",
            type: 'multi',
            options: [
                { label: "HubSpot", value: "hubspot" },
                { label: "Slack", value: "slack" },
                { label: "Airtable", value: "airtable" },
                { label: "Notion", value: "notion" },
                { label: "Shopify", value: "shopify" },
                { label: "Custom / Other", value: "custom" }
            ]
        }
    ];

    // Logic: Decision Tree for Recommendations
    function generateRecommendation(data) {
        let system = "Custom Integration Protocol";
        let timeSaved = "10-15";
        let timeline = "2-3 weeks";

        if (data.bottleneck === 'data-entry') {
            system = "Autonomous Data Pipeline (n8n + Python)";
            timeSaved = "20+";
        } else if (data.bottleneck === 'sales') {
            system = "Automated Lead Qualification & CRM Sync";
            timeSaved = "15-20";
        } else if (data.bottleneck === 'support') {
            system = "Tier-1 AI Support Agent";
            timeSaved = "25+";
            timeline = "3-4 weeks";
        } else if (data.bottleneck === 'reporting') {
            system = "Real-time BI Dashboard & Aggregation";
            timeSaved = "5-10";
            timeline = "1-2 weeks";
        }

        if (data.companySize === '200+') {
            timeline = "4-6 weeks (Enterprise Rollout)";
        }

        return { system, timeSaved, timeline };
    }

    // Render Functions
    function render() {
        assistantContainer.innerHTML = '';
        
        // Progress Bar
        const progress = document.createElement('div');
        progress.className = 'sa-progress';
        const progressFill = document.createElement('div');
        progressFill.className = 'sa-progress-fill';
        // Calculate progress: if we are at step 0 of 3, show 25%. Step 3 (result) is 100%.
        const percentage = Math.min(((state.step + 1) / (steps.length + 1)) * 100, 100);
        progressFill.style.width = `${percentage}%`;
        progress.appendChild(progressFill);
        assistantContainer.appendChild(progress);

        // Content
        const content = document.createElement('div');
        content.className = 'sa-content fade-in';

        if (state.step < steps.length) {
            renderQuestion(content, steps[state.step]);
        } else {
            renderResult(content);
        }

        assistantContainer.appendChild(content);
    }

    function renderQuestion(container, stepConfig) {
        const title = document.createElement('h3');
        title.className = 'sa-question';
        title.textContent = stepConfig.question;
        container.appendChild(title);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'sa-options';

        stepConfig.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'sa-option-btn';
            
            // Check if selected
            let isSelected = false;
            if (stepConfig.type === 'single') {
                isSelected = state.data[stepConfig.id] === opt.value;
            } else {
                isSelected = state.data.techStack.includes(opt.value);
            }
            
            if (isSelected) btn.classList.add('selected');

            btn.textContent = opt.label;
            btn.onclick = () => handleSelection(stepConfig, opt.value);
            optionsContainer.appendChild(btn);
        });

        container.appendChild(optionsContainer);

        // Navigation for Multi-select
        if (stepConfig.type === 'multi') {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'btn-primary sa-next-btn';
            nextBtn.textContent = 'Analyze Strategy';
            nextBtn.onclick = () => nextStep();
            container.appendChild(nextBtn);
        }
    }

    function renderResult(container) {
        const result = generateRecommendation(state.data);
        
        container.innerHTML = `
            <div class="sa-result text-center">
                <span class="badge mb-4">You are qualified for automation</span>
                <h3 class="mb-4">Recommended Strategy: <br><span class="text-accent">${result.system}</span></h3>
                
                <div class="sa-stats-grid">
                    <div class="sa-stat-card">
                        <div class="sa-stat-value">${result.timeSaved}h</div>
                        <div class="sa-stat-label">Hours Saved / Week</div>
                    </div>
                    <div class="sa-stat-card">
                        <div class="sa-stat-value">${result.timeline}</div>
                        <div class="sa-stat-label">Implementation Time</div>
                    </div>
                </div>

                <div class="sa-cta-box mt-8">
                    <p class="mb-4 text-sm text-muted">This is an estimate based on your inputs. To implement this specific plan:</p>
                    <a href="/book-call.html" class="btn btn-primary btn-lg">Book Implementation Strategy Call</a>
                </div>
                
                <button class="btn-text mt-4" id="restart-sa">Start Over</button>
            </div>
        `;

        // Bind restart separately after render
        setTimeout(() => {
            document.getElementById('restart-sa').onclick = () => {
                state.step = 0;
                state.data = { companySize: '', bottleneck: '', techStack: [] };
                render();
            };
        }, 0);
    }

    // Handlers
    function handleSelection(stepConfig, value) {
        if (stepConfig.type === 'single') {
            state.data[stepConfig.id] = value;
            // Add small delay for visual feedback then next
            setTimeout(() => nextStep(), 250);
        } else {
            // Multi-select toggle
            const index = state.data.techStack.indexOf(value);
            if (index === -1) {
                state.data.techStack.push(value);
            } else {
                state.data.techStack.splice(index, 1);
            }
            render(); // Re-render to update selected state
        }
    }

    function nextStep() {
        state.step++;
        render();
    }

    // Initialize
    render();
});
