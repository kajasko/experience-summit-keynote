import {test,expect} from '@playwright/test';

test('twist keeps washer anchored and avoids an orphan in the final assertion',async({page})=>{
 for(const reduced of [false,true]){
  await page.emulateMedia({reducedMotion:reduced?'reduce':'no-preference'});
  await page.goto('/#scene=twist&step=0');
  await expect(page.locator('[data-state="tw1"]')).toHaveAttribute('data-motion','settled');
  await page.evaluate(()=>document.fonts.ready);
  const image=page.locator('img[src*="ai-cutout"]');await image.evaluate(n=>(n as HTMLImageElement).decode());
  const before=await image.boundingBox();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-state="tw2"]')).toHaveCount(1);
  if(!reduced){await page.waitForTimeout(300);await page.screenshot({path:'validation/intermediate/11.png'});}
  await expect(page.locator('[data-state="tw2"]')).toHaveAttribute('data-motion','settled');
  if(!reduced) await expect(page.locator('[data-twist-word]').last()).toHaveCSS('opacity','1',{timeout:4000});
  expect(await image.boundingBox()).toEqual(before);
  const lines=await page.locator('[data-twist-line]').allTextContents();
  expect(lines.map(s=>s.replace(/\s+/g,' ').trim()).at(-1)).toMatch(/bez ní/);
  expect(lines.at(-1)?.trim()).not.toBe('ní.');
  await page.screenshot({path:`validation/${reduced?'reduced':'normal'}/11.png`});
 }
});
