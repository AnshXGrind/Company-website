document.addEventListener('DOMContentLoaded', () => {
    const assistantContainer = document.getElementById('strategy-assistant-root');
    if (!assistantContainer) return;

    // ── State ──────────────────────────────────────────────────────────────────
    const state = {
        step: 0,
        loading: false,
        error: null,
        data: {
            companySize: '',
            bottleneck: '',
            techStack: [],
        },
        result: null,
    };

    // ── Step Configuration ─────────────────────────────────────────────────────
    const steps = [
        {
            id: 'companySize',
            question: 'How large is your organization?',
            type: 'single',
            options: [
                { label: '1–10 Employees',   value: '1-10'  },
                { label: '10–50 Employees',  value: '10-50' },
                { label: '50–200 Employees', value: '50-200'},
                { label: '200+ Employees',   value: '200+'  },
            ],
        },
        {
            id: 'bottleneck',
            question: 'What is your primary operational bottleneck?',
            type: 'single',
            options: [
                { label: 'Manual Data Entry',           value: 'data-entry'    },
                { label: 'Slow Sales Process',          value: 'sales'         },
                { label: 'Customer Support Overload',   value: 'support'       },
                { label: 'Reporting Chaos',             value: 'reporting'     },
                { label: 'Tool Fragmentation',          value: 'fragmentation' },
            ],
        },
        {
            id: 'techStack',
            question: 'Which tools do you currently use? (Select all that apply)',
            type: 'multi',
            options: [
                { label: 'HubSpot',         value: 'hubspot'  },
                { label: 'Slack',           value: 'slack'    },
                { label: 'Airtable',        value: 'airtable' },
                { label: 'Notion',          value: 'notion'   },
                { label: 'Shopify',         value: 'shopify'  },
                { label: 'Custom / Other',  value: 'custom'   },
            ],
        },
    ];

    // ── API Call ───────────────────────────────────────────────────────────────
    async function fetchStrategy() {
        state.loading = true;
        state.error = null;
        render();

        try {
            const response = await fetch('/api/strategy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companySize: state.data.companySize,
                    bottleneck:  state.data.bottleneck,
                    techStack:   state.data.techStack,
                }),
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || `Server error ${response.status}`);
            }

            const json = await response.json();
            state.result  = json.result;
            state.step    = steps.length; // advance to result view
        } catch (err) {
            state.error = err.message || 'An unexpected error occurred. Please try again.';
            state.step  = steps.length - 1; // return to last question so user can retry
        } finally {
            state.loading = false;
            render();
        }
    }

    // ── Render ─────────────────────────────────────────────────────────────────
    function render() {
        assistantContainer.innerHTML = '';

        // Progress bar
        const totalPhases = steps.length + 1; // questions + result
        const currentPhase = state.loading ? steps.length : state.step;
        const pct = Math.min(Math.round(((currentPhase + 1) / totalPhases) * 100), 100);

        assistantContainer.insertAdjacentHTML('beforeend', `
            <div class="sa-progress">
                <div class="sa-progress-fill" style="width: ${pct}%;"></div>
            </div>
        `);

        const content = document.createElement('div');
        content.className = 'sa-content';

        if (state.loading) {
            renderLoading(content);
        } else if (state.step < steps.length) {
            renderQuestion(content, steps[state.step]);
        } else {
            renderResult(content);
        }

        if (state.error) {
            const errEl = document.createElement('p');
            errEl.className = 'sa-error';
            errEl.textContent = state.error;
            content.appendChild(errEl);
        }

        assistantContainer.appendChild(content);
    }

    function renderLoading(container) {
        container.innerHTML = `
            <div class="sa-loading">
                <div class="sa-spinner"></div>
                <p>Analyzing your inputs. Generating strategy.</p>
            </div>
        `;
    }

    function renderQuestion(container, stepConfig) {
        const title = document.createElement('h3');
        title.className = 'sa-question';
        title.textContent = stepConfig.question;
        container.appendChild(title);

        const optionsGrid = document.createElement('div');
        optionsGrid.className = 'sa-options';

        stepConfig.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'sa-option-btn';

            const isSelected = stepConfig.type === 'single'
                ? state.data[stepConfig.id] === opt.value
                : state.data.techStack.includes(opt.value);

            if (isSelected) btn.classList.add('selected');
            btn.textContent = opt.label;
            btn.addEventListener('click', () => handleSelect(stepConfig, opt.value));
            optionsGrid.appendChild(btn);
        });

        container.appendChild(optionsGrid);

        if (stepConfig.type === 'multi') {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'btn-primary sa-next-btn';
            nextBtn.textContent = 'Generate My Strategy';
            nextBtn.addEventListener('click', () => fetchStrategy());
            container.appendChild(nextBtn);
        }
    }

    function renderResult(container) {
        const r = state.result || {};

        // Build implementation plan rows
        const plan = r.plan || {};
        const planRows = Object.entries(plan)
            .map(([week, desc]) => `
                <div class="sa-plan-row">
                    <span class="sa-plan-week">${week.replace('week', 'Week ')}</span>
                    <span>${escHtml(desc)}</span>
                </div>
            `).join('');

        container.innerHTML = `
            <div class="sa-result">
                <span class="badge mb-4">Strategy Generated</span>

                <h3 class="mb-4">${escHtml(r.system || 'Custom Automation System')}</h3>

                <p class="sa-diagnosis mb-4">${escHtml(r.diagnosis || '')}</p>

                <div class="sa-stats-grid">
                    <div class="sa-stat-card">
                        <div class="sa-stat-value">${escHtml(r.hoursSaved || '—')}h</div>
                        <div class="sa-stat-label">Estimated Hours Saved / Week</div>
                    </div>
                    <div class="sa-stat-card">
                        <div class="sa-stat-value">${escHtml(r.timeline || '—')}</div>
                        <div class="sa-stat-label">Implementation Timeline</div>
                    </div>
                </div>

                ${planRows ? `
                    <div class="sa-plan">
                        <h4 class="mb-4">Implementation Plan</h4>
                        ${planRows}
                    </div>
                ` : ''}

                <div class="sa-cta-box">
                    <p class="text-sm mb-4" style="color: var(--color-text-muted);">${escHtml(r.nextStep || 'Book a strategy call to get started.')}</p>
                    <a href="/book-call.html" class="btn btn-primary">Book a Free Strategy Call</a>
                </div>

                <button id="restart-sa">Start Over</button>
            </div>
        `;

        setTimeout(() => {
            const restartBtn = document.getElementById('restart-sa');
            if (restartBtn) {
                restartBtn.addEventListener('click', () => {
                    state.step    = 0;
                    state.result  = null;
                    state.error   = null;
                    state.loading = false;
                    state.data    = { companySize: '', bottleneck: '', techStack: [] };
                    render();
                });
            }
        }, 0);
    }

    // ── Handlers ───────────────────────────────────────────────────────────────
    function handleSelect(stepConfig, value) {
        if (stepConfig.type === 'single') {
            state.data[stepConfig.id] = value;
            // Brief visual feedback before advancing
            setTimeout(() => {
                state.step++;
                render();
            }, 220);
        } else {
            const idx = state.data.techStack.indexOf(value);
            if (idx === -1) {
                state.data.techStack.push(value);
            } else {
                state.data.techStack.splice(idx, 1);
            }
            render();
        }
    }

    // ── Utility ────────────────────────────────────────────────────────────────
    function escHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // ── Boot ───────────────────────────────────────────────────────────────────
    render();
});
