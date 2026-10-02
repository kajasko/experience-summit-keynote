import {test,expect} from '@playwright/test';
import {writeFileSync,mkdirSync} from 'node:fs';

test('settled visuals stay still and repeated navigation releases scene objects',async({page})=>{
 await page.goto('/');await expect(page.locator('[data-state="o1"]')).toHaveAttribute('data-motion','settled');
 await page.evaluate(()=>document.fonts.ready);
 const cdp=await page.context().newCDPSession(page);await cdp.send('Performance.enable');
 await cdp.send('HeapProfiler.collectGarbage');
 const metrics=async()=>Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));
 const before=await metrics();
 for(let cycle=0;cycle<3;cycle++){
  for(let i=0;i<74;i++)await page.keyboard.press('ArrowRight');
  for(let i=0;i<74;i++)await page.keyboard.press('ArrowLeft');
 }
 await expect(page.locator('[data-state="o1"]')).toHaveAttribute('data-motion','settled');
 await cdp.send('HeapProfiler.collectGarbage');const after=await metrics();
 expect(await page.locator('.scene-layer').count()).toBe(1);
 expect(after.Nodes).toBeLessThan(before.Nodes+100);
 expect(after.JSEventListeners).toBeLessThan(before.JSEventListeners+10);
 for(const hash of ['scene=opening&step=0','scene=adapt&step=2','scene=funnel&step=2','scene=channels&step=7','scene=hero-end&step=1']){
  await page.goto('/#'+hash);await expect(page.locator('.scene-layer')).toHaveAttribute('data-motion','settled');
  await page.waitForTimeout(1400);
  const first=await page.locator('#stage').screenshot();await page.waitForTimeout(1000);const second=await page.locator('#stage').screenshot();
  if(await page.locator('[data-live]').count()) continue;
  expect(second.equals(first),hash).toBe(true);
 }
 mkdirSync('validation',{recursive:true});writeFileSync('validation/performance.json',JSON.stringify({before,after},null,2));
});
