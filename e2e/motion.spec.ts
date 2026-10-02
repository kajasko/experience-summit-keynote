import {test,expect} from '@playwright/test';
import {steps} from '../src/deck/deck';

test('speaker owns arguments, navigation and interrupted sequences',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('/#act=4&scene=channels&step=4');
 await expect(page.locator('[data-state="mo1"]')).toBeVisible();
 await page.waitForTimeout(1600);
 await expect(page).toHaveURL(/scene=channels&step=4/);
 expect(Number(await page.locator('[data-mortgage-agent]').getAttribute('opacity'))).toBeLessThan(.2);
 for(let i=1;i<=3;i++){
  await page.keyboard.press('ArrowRight');await page.waitForTimeout(1400);
  await expect(page.locator(`[data-state="mo${i+1}"]`)).toHaveAttribute('data-motion','settled');
  if(i<3) expect(Number(await page.locator('[data-mortgage-outcome]').evaluate(n=>getComputedStyle(n).opacity))).toBeLessThan(.2);
 }
 await page.goto('/');await expect(page.locator('[data-state="o1"]')).toBeVisible();
 for(let i=0;i<steps.length-1;i++) {await page.keyboard.press('ArrowRight');await page.waitForTimeout(24);}
 await expect(page.locator('[data-state="vd1"]')).toBeVisible();
 for(let i=0;i<steps.length-1;i++) {await page.keyboard.press('ArrowLeft');await page.waitForTimeout(24);}
 await expect(page.locator('[data-state="o1"]')).toHaveAttribute('data-motion','settled');
 for(const id of ['history','adapt','funnel','channels']){
  await page.goto(`/#scene=${id}&step=0`);await expect(page.locator('.scene-layer')).toHaveAttribute('data-scene',id);
  for(let i=0;i<8;i++){await page.keyboard.press('ArrowRight');await page.waitForTimeout(40);await page.keyboard.press('ArrowLeft');await page.waitForTimeout(40);}
  await page.waitForTimeout(1400);
  await expect(page.locator('.scene-layer')).toHaveCount(1);
  await expect(page.locator('.scene-layer')).toHaveAttribute('data-local','0');
  if(id==='history') {
   await expect(page.locator('[data-era="0"] [data-copy]')).toBeVisible();
   for(let i=1;i<4;i++) expect(await page.locator(`[data-era="${i}"] [data-copy]`).evaluate(n=>getComputedStyle(n).visibility)).toBe('hidden');
  }
 }
 expect(errors).toEqual([]);
});

test('direct links, reverse, restart and live reduced-motion switch',async({page})=>{
 for(const step of steps){
  await page.goto(`/#act=${step.act}&scene=${step.sceneId}&step=${step.local}`);
  await expect(page.locator(`[data-state="${step.id}"]`)).toBeVisible();
 }
 await page.goto('/#scene=adapt&step=0');await page.keyboard.press('ArrowRight');
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('.scene-layer')).toHaveAttribute('data-motion','settled');
 await expect(page.locator('.scene-layer')).toHaveAttribute('data-reduced','true');
 await page.keyboard.press('ArrowRight');await page.keyboard.press('r');
 await expect(page).toHaveURL(/scene=adapt&step=0/);
});
