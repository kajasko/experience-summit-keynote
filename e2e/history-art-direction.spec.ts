import {test,expect} from '@playwright/test';
test('history rail follows the speaker in both directions and stops at the current era',async({page})=>{
 for(const reducedMotion of ['no-preference','reduce'] as const){
  await page.emulateMedia({reducedMotion});
  await page.goto('/#scene=history&step=0');
  await page.evaluate(()=>document.fonts.ready);
  for(const step of [0,1,2,3,4,3,2,1,0]){
   if(step!==0 || (await page.locator('.scene-layer').getAttribute('data-local'))!=='0'){
    const current=Number(await page.locator('.scene-layer').getAttribute('data-local'));
    await page.keyboard.press(step>current?'ArrowRight':'ArrowLeft');
   }
   await expect(page.locator('.scene-layer')).toHaveAttribute('data-local',String(step));
   await page.waitForTimeout(reducedMotion==='reduce'?30:step===3?4200:step===0?2600:2100);
   const x=await page.locator('[data-time-head]').evaluate(n=>new DOMMatrix(getComputedStyle(n).transform).m41);
   expect(x).toBeCloseTo(Math.min(step,3)*144,1);
   if(step<3) await expect(page.locator(`[data-era="${step}"] [data-art]`)).toBeVisible();
   if(step<3) await expect(page.locator('[data-year]')).toHaveAttribute('data-year',['1945','1964','1973'][step]);
   if(step===3) {
    await expect(page.locator('[data-hello-text]')).toHaveText('Hello! How can I help you today?');
    await expect(page.locator('[data-dnes]')).toHaveText('Dnes');
    const x=await page.locator('[data-dnes]').evaluate(n=>n.getBoundingClientRect().left);
    expect(x).toBeGreaterThan(500);
   }
   if(step===4) {
    await expect(page.locator('[data-dnes]')).toHaveText('Dnes');
    const x=await page.locator('[data-dnes]').evaluate(n=>n.getBoundingClientRect().left);
    expect(x).toBeLessThan(150);
    await expect(page.locator('img[src*="intent-laptop"]')).toBeVisible();
   }
  }
 }
});
