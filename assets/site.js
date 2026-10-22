(() => {
  'use strict';
  const catalog = window.AI_VIRTUAL_CELL_CATALOG;
  if (!catalog) {
    document.getElementById('result-count').textContent = 'Catalogue could not be loaded. Browse the complete reading list in the README.';
    return;
  }
  const $ = id => document.getElementById(id);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = url => /^https?:\/\//.test(url) ? escape(url) : '#';
  const {project, stats, papers} = catalog;
  const tasks = ['State representation learning', 'Perturbation-response prediction', 'Intervention discovery and design'];
  const state = {category:'', limit:24};
  $('stats').innerHTML = [[stats.records,'publications and resources'],[papers.filter(p=>tasks.includes(p.category)).length,'task-organized entries'],[stats.with_code,'records with code links'],[project.categories.length,'resource categories']].map(([n,label])=>`<div><strong>${n}</strong><span>${label}</span></div>`).join('');
  const categories = [{name:'', title:'All records'}, ...project.categories];
  $('category-list').innerHTML = categories.map(c=>`<button type="button" data-filter-category="${escape(c.name)}" aria-pressed="${c.name===''}"><span>${escape(c.title.replace(/^\d+\. /,''))}</span><small>${c.name ? stats.categories[c.name] : stats.records}</small></button>`).join('');
  [...new Set(papers.map(p=>p.year))].sort((a,b)=>Number(b)-Number(a)).forEach(year=>{
    const option = new Option(year,year); $('year').add(option);
  });
  function record(p) {
    const codes = p.code_links.map((link,i)=>`<a href="${safeUrl(link.url)}" target="_blank" rel="noopener noreferrer">${i ? 'Reproduction' : 'Code'} ↗</a>`).join('');
    const resources = p.resource_links.map(link=>`<a href="${safeUrl(link.url)}" target="_blank" rel="noopener noreferrer">${escape(link.label)} ↗</a>`).join('');
    const evidence = p.code_links.map(link=>`<p><a href="${safeUrl(link.evidence_url)}" target="_blank" rel="noopener noreferrer">Implementation source ↗</a></p>`).join('');
    const related = (p.related_tasks||[]).length ? '<p>Related task: '+p.related_tasks.map(escape).join(' · ')+'</p>' : '';
    return `<article class="paper-card" id="paper-${escape(p.id)}">
      <div class="paper-top"><span>${escape(p.category)}</span><span class="year">${escape(p.year)}</span></div>
      <h3>${escape(p.name)}</h3><p class="paper-title">${escape(p.title)}</p>
      <div class="paper-meta">${escape(p.venue_short)}<br>${(p.components||[]).map(x=>'<span class="tag">'+escape(x)+'</span>').join('')}${p.modalities ? '<span class="tag">'+escape(p.modalities)+'</span>' : ''}</div>
      ${related}
      <div class="paper-actions"><a href="${safeUrl(p.paper_url)}" target="_blank" rel="noopener noreferrer">Paper ↗</a>${codes}${resources}</div>
      <details><summary>Publication and link sources</summary><p>${escape(p.authors)}</p>${evidence}</details>
    </article>`;
  }
  function render(resetLimit=false) {
    if (resetLimit) state.limit=24;
    const terms = $('search').value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    const measurement = $('modality').value.toLocaleLowerCase();
    const filtered = papers.filter(p=>(!state.category || p.category===state.category) && (!$('year').value || p.year===$('year').value) && (!measurement || (p.modalities||'').toLocaleLowerCase().includes(measurement)) && (!$('code-only').checked || p.code_links.length) && terms.every(term=>[p.name,p.title,p.authors,p.id,p.category,p.modalities,...(p.related_tasks||[]),...(p.components||[])].join(' ').toLocaleLowerCase().includes(term)));
    const sort = $('sort').value;
    filtered.sort((a,b)=>sort==='name' ? a.name.localeCompare(b.name) : (sort==='oldest' ? Number(a.year)-Number(b.year) : Number(b.year)-Number(a.year)) || a.name.localeCompare(b.name));
    $('paper-grid').innerHTML=filtered.slice(0,state.limit).map(record).join('');
    $('result-count').textContent=`${filtered.length} ${filtered.length===1 ? 'record' : 'records'}${state.category ? ' · '+state.category : ''}`;
    $('empty-state').hidden=filtered.length!==0;
    $('load-more').hidden=filtered.length<=state.limit;
    $('load-more').textContent=`Show more (${Math.max(0,filtered.length-state.limit)} remaining)`;
    document.querySelectorAll('[data-filter-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filterCategory===state.category)));
  }
  $('search-form').addEventListener('submit',event=>event.preventDefault());
  $('search').addEventListener('input',()=>render(true));
  ['year','modality','code-only','sort'].forEach(id=>$(id).addEventListener('change',()=>render(true)));
  $('clear-search').addEventListener('click',()=>{$('search').value='';render(true);$('search').focus();});
  $('reset').addEventListener('click',()=>{state.category='';$('search').value='';$('year').value='';$('modality').value='';$('code-only').checked=false;$('sort').value='newest';render(true);});
  $('load-more').addEventListener('click',()=>{state.limit+=24;render();});
  $('category-list').addEventListener('click',event=>{const b=event.target.closest('[data-filter-category]');if(b){state.category=b.dataset.filterCategory;render(true);}});
  document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{state.category=button.dataset.category;$('search').value='';$('year').value='';$('modality').value='';$('code-only').checked=false;render(true);$('catalog').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}));
  if (project.repository_url) $('repo-link').href=project.repository_url;
  else if (location.hostname.endsWith('.github.io')) {
    const user=location.hostname.slice(0,-10);
    const repository=location.pathname.split('/').filter(Boolean)[0];
    $('repo-link').href=`https://github.com/${encodeURIComponent(user)}/${encodeURIComponent(repository||user+'.github.io')}`;
  }
  render();
})();
