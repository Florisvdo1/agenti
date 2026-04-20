import { automationQueue, id, loadWorkspace, routeAutomation, saveWorkspace, scoreEightPercent, topEightPercentTasks, calculateQuadrant, appStorageKey } from './core/logic.js';
const modules = [
    'Command Center', 'Idea Capture', 'Weekly Task Inbox', 'Quadrant Board', '8 Percent Focus', '92 Percent Automation Queue',
    'Agent Library', 'Writing Studio', 'Research Studio', 'Analysis Studio', 'Scheduling Studio', 'Drafting Studio', 'Build Studio',
    'Social Prompt Studio', 'Video Prompt Studio', 'Daily Brief', 'Workflow Builder', 'Templates, Saved Systems, Settings'
];
let workspace = loadWorkspace();
let active = 'Command Center';
const app = document.querySelector('#app');
if (!app)
    throw new Error('Missing app root');
const render = () => {
    const focus8 = topEightPercentTasks(workspace.tasks);
    const queue92 = automationQueue(workspace.tasks);
    app.innerHTML = `
  <div class="layout">
    <aside class="sidebar">
      <h1>Agenti</h1>
      <p class="subtitle">Premium Director Workspace</p>
      <nav>${modules.map((m) => `<button class="nav-btn ${active === m ? 'active' : ''}" data-module="${m}">${m}</button>`).join('')}</nav>
    </aside>
    <main class="main">
      ${renderModule(active, focus8, queue92)}
    </main>
  </div>`;
    document.querySelectorAll('.nav-btn').forEach((btn) => btn.onclick = () => { active = btn.dataset.module; render(); });
    attachActions();
};
function renderCards(tasks) {
    if (!tasks.length)
        return '<div class="empty">No items yet.</div>';
    return `<div class="grid">${tasks.map((t) => `<article class="card"><h3>${t.title}</h3><p>${t.description}</p><small>${t.zone} • ${t.quadrant}</small><div class="meta">8% ${t.score8} • ${t.automationRoute}</div></article>`).join('')}</div>`;
}
function renderModule(module, focus8, queue92) {
    switch (module) {
        case 'Command Center':
            return `<section><h2>Command Center</h2><div class="kpis"><div><strong>${workspace.tasks.length}</strong><span>Weekly tasks</span></div><div><strong>${focus8.length}</strong><span>8% human-value</span></div><div><strong>${queue92.length}</strong><span>92% automation queue</span></div></div>${renderCards(workspace.tasks.filter(t => !t.archived).slice(0, 4))}</section>`;
        case 'Idea Capture':
            return `<section><h2>Idea Capture</h2><form id="idea-form" class="panel"><input name="title" placeholder="Capture idea" required/><textarea name="notes" placeholder="Context"></textarea><button>Add Idea</button></form><div class="list">${workspace.ideas.filter(i => !i.archived).map((i) => `<div class="row"><strong>${i.title}</strong><p>${i.notes}</p><button data-convert-idea="${i.id}">Convert to task</button></div>`).join('') || '<div class="empty">Capture your first idea.</div>'}</div></section>`;
        case 'Weekly Task Inbox':
            return `<section><h2>Weekly Task Inbox</h2><form id="task-form" class="panel two-col"><input name="title" placeholder="Task title" required/><input name="description" placeholder="Description" required/><select name="zone">${['Writing', 'Research', 'Analysis', 'Scheduling', 'Drafting', 'Build Things'].map(z => `<option>${z}</option>`)}</select><input type="number" name="impact" min="1" max="10" value="7"/><input type="number" name="urgency" min="1" max="10" value="6"/><input type="number" name="strategic" min="1" max="10" value="7"/><input type="number" name="effort" min="1" max="10" value="5"/><input type="number" name="repeatability" min="1" max="10" value="5"/><button>Add task</button></form>${renderCards(workspace.tasks.filter(t => !t.archived))}</section>`;
        case 'Quadrant Board':
            return `<section><h2>Quadrant Board</h2><div class="quad">${['Q1-Urgent-Important', 'Q2-Strategic', 'Q3-Delegate', 'Q4-Eliminate'].map(q => `<div class="quad-col"><h3>${q}</h3>${renderCards(workspace.tasks.filter(t => !t.archived && t.quadrant === q))}</div>`).join('')}</div></section>`;
        case '8 Percent Focus':
            return `<section><h2>8 Percent Focus</h2>${renderCards(focus8)}</section>`;
        case '92 Percent Automation Queue':
            return `<section><h2>92 Percent Automation Queue</h2>${renderCards(queue92)}</section>`;
        case 'Agent Library':
            return `<section><h2>Agent Library</h2><form id="agent-form" class="panel"><input name="name" placeholder="Agent name" required/><input name="purpose" placeholder="Purpose" required/><textarea name="prompt" placeholder="Prompt"></textarea><button>Save Agent</button></form><div class="list">${workspace.agents.filter(a => !a.archived).map((a) => `<div class="row"><strong>${a.name}</strong><p>${a.purpose}</p></div>`).join('')}</div></section>`;
        case 'Workflow Builder':
            return `<section><h2>Workflow Builder</h2><form id="workflow-form" class="panel"><input name="name" placeholder="Workflow name" required/><textarea name="steps" placeholder="One step per line"></textarea><button>Save Workflow</button></form><div class="list">${workspace.workflows.filter(w => !w.archived).map((w) => `<div class="row"><strong>${w.name}</strong><p>${w.steps.join(' → ')}</p></div>`).join('')}</div></section>`;
        case 'Templates, Saved Systems, Settings':
            return `<section><h2>Templates, Saved Systems, Settings</h2><form id="template-form" class="panel"><input name="title" placeholder="Template title" required/><select name="type"><option>Prompt</option><option>Workflow</option><option>System</option></select><textarea name="content" placeholder="Template content"></textarea><button>Save Template</button></form>
      <div class="list">${workspace.templates.map((t) => `<div class="row ${t.archived ? 'dim' : ''}"><strong>${t.title}</strong><p>${t.type}</p><button data-dup-template="${t.id}">Duplicate</button><button data-toggle-template="${t.id}">${t.archived ? 'Restore' : 'Archive'}</button></div>`).join('')}</div>
      <div class="panel"><button id="export-json">Export workspace JSON</button><input id="import-json" type="file" accept="application/json"/><button id="reset-seed">Reset to seeded demo</button></div></section>`;
        case 'Daily Brief':
            return `<section><h2>Daily Brief</h2><div class="panel"><p>Today focus: <strong>${focus8[0]?.title ?? 'No focus selected yet'}</strong></p><p>Top automation: <strong>${queue92[0]?.title ?? 'Queue empty'}</strong></p><p>Latest output: ${workspace.history[workspace.history.length - 1]?.title ?? 'None yet'}</p></div></section>`;
        default:
            return `<section><h2>${module}</h2><div class="panel"><p>Studio ready for premium output generation.</p></div><div class="list">${workspace.history.filter(h => h.studio === module || h.studio.includes(module.split(' ')[0])).map(h => `<div class="row"><strong>${h.title}</strong><p>${h.output}</p></div>`).join('') || '<div class="empty">No outputs yet. Create one in this studio.</div>'}</div></section>`;
    }
}
function attachActions() {
    const taskForm = document.querySelector('#task-form');
    if (taskForm)
        taskForm.onsubmit = (e) => {
            e.preventDefault();
            const data = new FormData(taskForm);
            const base = {
                title: String(data.get('title') ?? ''), description: String(data.get('description') ?? ''),
                zone: String(data.get('zone')),
                impact: Number(data.get('impact')), urgency: Number(data.get('urgency')), strategic: Number(data.get('strategic')), effort: Number(data.get('effort')), repeatability: Number(data.get('repeatability'))
            };
            const score8 = scoreEightPercent(base);
            workspace.tasks.unshift({ ...base, id: id(), score8, quadrant: calculateQuadrant(base), automationRoute: routeAutomation({ ...base, score8 }), archived: false, createdAt: new Date().toISOString() });
            persist();
        };
    const ideaForm = document.querySelector('#idea-form');
    if (ideaForm)
        ideaForm.onsubmit = (e) => {
            e.preventDefault();
            const data = new FormData(ideaForm);
            workspace.ideas.unshift({ id: id(), title: String(data.get('title')), notes: String(data.get('notes') ?? ''), createdAt: new Date().toISOString(), archived: false });
            persist();
        };
    document.querySelectorAll('[data-convert-idea]').forEach((btn) => btn.onclick = () => {
        const idea = workspace.ideas.find((i) => i.id === btn.dataset.convertIdea);
        if (!idea)
            return;
        const base = { title: idea.title, description: idea.notes || 'Created from idea capture.', zone: 'Build Things', impact: 7, urgency: 6, strategic: 7, effort: 4, repeatability: 5 };
        const score8 = scoreEightPercent(base);
        workspace.tasks.unshift({ ...base, id: id(), score8, quadrant: calculateQuadrant(base), automationRoute: routeAutomation({ ...base, score8 }), archived: false, createdAt: new Date().toISOString() });
        idea.archived = true;
        persist();
    });
    const agentForm = document.querySelector('#agent-form');
    if (agentForm)
        agentForm.onsubmit = (e) => {
            e.preventDefault();
            const fd = new FormData(agentForm);
            workspace.agents.unshift({ id: id(), name: String(fd.get('name')), purpose: String(fd.get('purpose')), prompt: String(fd.get('prompt') ?? ''), zone: 'Analysis', archived: false });
            persist();
        };
    const workflowForm = document.querySelector('#workflow-form');
    if (workflowForm)
        workflowForm.onsubmit = (e) => {
            e.preventDefault();
            const fd = new FormData(workflowForm);
            workspace.workflows.unshift({ id: id(), name: String(fd.get('name')), steps: String(fd.get('steps') ?? '').split('\n').filter(Boolean), archived: false });
            persist();
        };
    const templateForm = document.querySelector('#template-form');
    if (templateForm)
        templateForm.onsubmit = (e) => {
            e.preventDefault();
            const fd = new FormData(templateForm);
            workspace.templates.unshift({ id: id(), title: String(fd.get('title')), type: String(fd.get('type')), content: String(fd.get('content') ?? ''), archived: false });
            persist();
        };
    document.querySelectorAll('[data-dup-template]').forEach((btn) => btn.onclick = () => {
        const t = workspace.templates.find((x) => x.id === btn.dataset.dupTemplate);
        if (!t)
            return;
        workspace.templates.unshift({ ...t, id: id(), title: `${t.title} (Copy)`, archived: false });
        persist();
    });
    document.querySelectorAll('[data-toggle-template]').forEach((btn) => btn.onclick = () => {
        const t = workspace.templates.find((x) => x.id === btn.dataset.toggleTemplate);
        if (!t)
            return;
        t.archived = !t.archived;
        persist();
    });
    document.querySelector('#export-json')?.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(workspace, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'agenti-workspace.json';
        a.click();
        URL.revokeObjectURL(url);
    });
    document.querySelector('#import-json')?.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const text = await file.text();
        workspace = JSON.parse(text);
        persist();
    });
    document.querySelector('#reset-seed')?.addEventListener('click', () => {
        localStorage.removeItem(appStorageKey);
        workspace = loadWorkspace();
        render();
    });
}
function persist() {
    saveWorkspace(workspace);
    render();
}
render();
