import { test, expect } from '@playwright/test';
import { steps } from '../src/deck/deck';
import { score } from '../src/engine/choreography';
import { mkdirSync, writeFileSync } from 'node:fs';

for(const reduced of [false,true]) test(`all speaker states: ${reduced ? 'reduced' : 'normal'}`,async({page})=>{
    expect(steps).toHaveLength(111);
 expect(Object.keys(score).sort()).toEqual(steps.map(s=>s.id).sort());
 const errors:string[]=[];
 page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 page.on('pageerror',e=>errors.push(String(e)));
 page.on('console',m=>{if(['error','warning'].includes(m.type())) errors.push(m.text());});
 await page.emulateMedia({reducedMotion:reduced ? 'reduce':'no-preference'});
 const dir=`validation/${reduced ? 'reduced':'normal'}`;mkdirSync(dir,{recursive:true});
 await page.goto('/');await page.evaluate(()=>document.fonts.ready);
 const report:unknown[]=[];
 for(const [i,step] of steps.entries()){
  const layer=page.locator(`[data-state="${step.id}"]`);
  await expect(layer).toHaveCount(1);
  await expect(layer).toHaveAttribute('data-motion','settled',{timeout:2000});
  // History owns its object continuity independently of the scene score.
  if(step.sceneId==='history' && !reduced) await page.waitForTimeout(1100);
  expect(await page.locator('.scene-layer').count()).toBe(1);
  expect(await layer.evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
  const duration=Number(await layer.getAttribute('data-duration'));expect(duration).toBeLessThanOrEqual(1.4);
  const visibility=await layer.locator('[data-motion-role]').evaluateAll(nodes=>nodes.map(n=>({role:(n as HTMLElement).dataset.motionRole,opacity:Number(getComputedStyle(n).opacity),visibility:getComputedStyle(n).visibility})));
  for(const item of visibility){expect(item.opacity,`${step.id}: ${item.role}`).toBeGreaterThan(0.1);expect(item.visibility).not.toBe('hidden');}
  await layer.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode().catch(()=>{}))));
  const broken=await layer.locator('img').evaluateAll(imgs=>imgs.filter(n=>!n.complete||n.naturalWidth===0).map(n=>n.src));expect(broken).toEqual([]);
  report.push({number:i+1,id:step.id,duration,visibility});
  await page.screenshot({path:`${dir}/${String(i+1).padStart(2,'0')}.png`});
  if(i<steps.length-1) await page.keyboard.press('ArrowRight');
 }
 writeFileSync(`${dir}/report.json`,JSON.stringify(report,null,2));
 expect(errors).toEqual([]);
});
