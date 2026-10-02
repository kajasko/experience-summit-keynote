import {test,expect} from '@playwright/test';
import {steps} from '../src/deck/deck';
import {mkdirSync,writeFileSync} from 'node:fs';

test('76 intermediate frames, text bounds and quiet final states',async({page})=>{
 mkdirSync('validation/intermediate',{recursive:true});
 const quick=process.env.VISUAL_QUICK==='1';
 if(quick) await page.emulateMedia({reducedMotion:'reduce'});
 const issues:unknown[]=[];
 await page.goto('/');await page.evaluate(()=>document.fonts.ready);
 for(const [i,step] of steps.entries()){
  await expect(page.locator(`[data-state="${step.id}"]`)).toHaveCount(1);
  if(!quick) await page.waitForTimeout(300);
  if(!quick) await page.screenshot({path:`validation/intermediate/${String(i+1).padStart(2,'0')}.png`});
  if(!quick) await page.waitForTimeout(1150);
  const problem=await page.locator('.scene-layer').evaluate(layer=>{
   const walker=document.createTreeWalker(layer,NodeFilter.SHOW_TEXT);
   const boxes:{text:string;left:number;right:number;top:number;bottom:number;reel?:boolean}[]=[];
   const clipping:unknown[]=[];
   const ctx=document.createElement('canvas').getContext('2d')!;
   for(let node=walker.nextNode();node;node=walker.nextNode()){
    if(!node.textContent?.trim())continue;
    let parent=node.parentElement,opacity=1,hidden=false;
    while(parent&&parent!==layer){const c=getComputedStyle(parent);opacity*=Number(c.opacity);if(c.visibility==='hidden'||c.display==='none')hidden=true;parent=parent.parentElement;}
    if(hidden||opacity<.2)continue;
    const slot=(node.parentElement as HTMLElement|null)?.closest?.('.roll-slot') as HTMLElement|null;
    const slotBox=slot?.getBoundingClientRect();
    const style=getComputedStyle(node.parentElement!);
    ctx.font=`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const metrics=ctx.measureText(node.textContent);
    // DOM Range includes unused font ascender/descender space. Use ink extents for collisions.
    const range=document.createRange();range.selectNodeContents(node);
    for(const rect of range.getClientRects()){
     if(slotBox&&(rect.bottom<slotBox.top+2||rect.top>slotBox.bottom-2))continue;
     const ratio=rect.height/(metrics.fontBoundingBoxAscent+metrics.fontBoundingBoxDescent);
     const baseline=rect.top+metrics.fontBoundingBoxAscent*ratio;
     const box={text:node.textContent.trim(),left:rect.left,right:rect.right,top:baseline-metrics.actualBoundingBoxAscent*ratio,bottom:baseline+metrics.actualBoundingBoxDescent*ratio,reel:Boolean(slot)};
     if(rect.width&&rect.height){boxes.push(box);if(rect.left < -1 || rect.top < -1 || rect.right > 1921 || rect.bottom > 1081)clipping.push(box);}
    }
   }
   const overlap:unknown[]=[];
   for(let a=0;a<boxes.length;a++)for(let b=a+1;b<boxes.length;b++){
    const x=boxes[a],y=boxes[b];const w=Math.min(x.right,y.right)-Math.max(x.left,y.left),h=Math.min(x.bottom,y.bottom)-Math.max(x.top,y.top);
    if(w>3&&h>4&&!(x.reel&&y.reel))overlap.push({a:x.text,b:y.text,w,h});
   }
   return {clipping,overlap};
  });
  if(problem.clipping.length||problem.overlap.length)issues.push({state:step.id,...problem});
  if(i<74)await page.keyboard.press('ArrowRight');
 }
 writeFileSync('validation/text-bounds.json',JSON.stringify(issues,null,2));
 expect(issues).toEqual([]);
});
