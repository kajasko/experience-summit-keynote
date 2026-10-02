import { useLayoutEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import type { FlatStep } from '../deck/types';
import { EASE, MOTION as T } from './motion';
import { score } from './choreography';

type Snapshot = Record<string, string | number>;
/** One owner per animated property; context restores inline styles before React's next beat. */
export function SceneMotion({ step, reduced, children }: { step: FlatStep; reduced: boolean; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const previous = useRef<number | null>(null);
  const geometry = useRef(new Map<string, DOMRect>());
  const snapshots = useRef(new Map<string, Snapshot>());
  useLayoutEffect(() => {
    const el = root.current!;
    const plan = score[step.id];
    const adjacent = previous.current === null || previous.current === step.index || Math.abs(previous.current - step.index) === 1;
    const animate = !reduced && adjacent;
    const tracked: { key: string; node: Element; props: string[] }[] = [];
    const query = (selector: string) => Array.from(el.querySelectorAll<HTMLElement>(selector));
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.enter }, onComplete: () => { el.dataset.motion = 'settled'; } });
      const transition = (selector: string, vars: gsap.TweenVars, at = 0, duration: number = T.camera) => {
        query(selector).forEach((node, index) => {
          const key = `${selector}:${index}`;
          const props = Object.keys(vars).filter(p => p !== 'transformOrigin');
          tracked.push({ key, node, props });
          const from = snapshots.current.get(key);
          if (animate && from) tl.fromTo(node, from, { ...vars, duration, ease: EASE.move }, at);
          else gsap.set(node, vars);
        });
      };
      for (const c of plan.cues) {
        const nodes = query(c.selector);
        // Optional statement exists only in hero states that have supporting copy.
        if (!nodes.length && c.selector !== '[data-hero-statement]') console.warn(`Motion cue missing: ${step.id}/${c.role}`);
        nodes.forEach(node => {
          node.dataset.motionRole = c.role;
          if (!animate) {
            if(c.effect === 'mask') gsap.set(node,{clipPath:'inset(0 0 0% 0)'});
            if(c.effect === 'cutout') gsap.set(node,{y:0});
            if(c.effect === 'line') gsap.set(node,{scaleX:1,transformOrigin:'left center'});
            return;
          }
          const finalOpacity = c.selector === "[data-compass]" ? 1 : Number(getComputedStyle(node).opacity);
          const from: gsap.TweenVars = { opacity: 0 };
          const to: gsap.TweenVars = { opacity: finalOpacity, duration: c.duration ?? T.enter };
          if (c.effect === 'reveal') { from.y = T.y; to.y = 0; }
          if (c.effect === 'cutout') { from.y = 8; to.y = 0; to.duration = c.duration ?? T.enter; }
          if (c.effect === 'mask') {
            from.clipPath = 'inset(0 0 100% 0)'; to.clipPath = 'inset(0 0 0% 0)'; to.duration = T.mask;
          }
          if (c.effect === 'line') {
            from.scaleX = 0;
            to.scaleX = 1;
            from.opacity = 1;
            to.opacity = 1;
            from.transformOrigin = to.transformOrigin = 'left center';
            to.duration = c.duration ?? T.line;
          }
          tl.fromTo(node, from, to, c.at);
        });
      }
      query('img').forEach((node) => {
        if (node.classList.contains('vision-sharp') || node.classList.contains('vision-soft')) return;
        if (node.closest('[data-art]')) return;
        if (node.dataset.motionRole || node.closest('[data-motion-role]')) return;
        node.dataset.motionRole = 'cutout';
        if (!animate) {
          gsap.set(node, { y: 0, opacity: 1 });
          return;
        }
        tl.fromTo(node, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: T.enter, ease: EASE.enter }, T.reveal + 0.18);
      });
      // FLIP only the three persistent delivery layers; titles stay typographically stable.
      const nextGeometry = new Map<string, DOMRect>();
      query('[data-delivery-layer]').forEach(node => {
        const key=node.dataset.deliveryLayer!;
        const next=node.getBoundingClientRect();
        const before=geometry.current.get(key);
        nextGeometry.set(key,next);
        if(animate && before && previous.current !== step.index) {
          const scale=el.getBoundingClientRect().width/1920;
          tl.fromTo(node,{x:(before.left-next.left)/scale,y:(before.top-next.top)/scale,scaleX:before.width/next.width,scaleY:before.height/next.height,transformOrigin:'top left'},
            {x:0,y:0,scaleX:1,scaleY:1,duration:T.camera,ease:EASE.move},0);
        }
      });
      geometry.current=nextGeometry;
      const local = step.local;
      if (step.sceneId === 'understanding' && local === 0) {
        query('[data-need-path]').forEach(node => {
          const length = (node as unknown as SVGPathElement).getTotalLength();
          gsap.set(node, { strokeDasharray: length, strokeDashoffset: animate ? length : 0 });
          if (animate) tl.to(node, { strokeDashoffset: 0, duration: T.line, ease: EASE.move }, 0.12);
        });
      }
      if (step.sceneId === 'journey' && local === 3) {
        query('[data-route]').forEach(node => {
          const length = (node as unknown as SVGPathElement).getTotalLength();
          gsap.set(node,{strokeDasharray:length,strokeDashoffset:animate ? length : 0});
          if(animate) tl.to(node,{strokeDashoffset:0,duration:T.line,ease:EASE.move},T.reveal);
        });
        query('[data-stop]').forEach((node,i) => {
          gsap.set(node,{opacity:animate ? .34 : 1});
          if(animate) tl.to(node,{opacity:1,duration:T.emphasis},.28+i*.18);
        });
        query('[data-journey-label]').forEach((node,i) => {
          gsap.set(node,{opacity:animate ? 0 : 1});
          if(animate) tl.to(node,{opacity:1,duration:T.emphasis},.38+i*.18);
        });
      }
      if(step.sceneId === 'funnel') {
        const positions = [{x:-136,y:-24},{x:100,y:-65},{x:-65,y:70},{x:140,y:38}];
        positions.forEach((p,i) => transition(`[data-band="${i}"]`,{x:local ? p.x : 0,y:local ? p.y : 0,opacity:local===2 ? .11 : local===1 ? .48 : 1},0));
        const paths = query('[data-fluid-path]');
        paths.forEach(node => gsap.set(node,{strokeDasharray:(node as unknown as SVGPathElement).getTotalLength()}));
        const route = paths[0] as unknown as SVGPathElement | undefined;
        if (route) transition('[data-fluid-path]',{strokeDashoffset:local===0 ? route.getTotalLength() : 0,opacity:local===0 ? 0 : 1},local===1 ? .22 : 0,T.line);
        transition('[data-need]',{opacity:local===0 ? .28 : local===1 ? .68 : 1},T.reveal,T.enter);
      }
      if(step.sceneId === 'adapt') {
        query('[data-module]').forEach((node,i) => {
          const x=Number(node.dataset.moduleX), y=Number(node.dataset.moduleY);
          transition(`[data-module="${i}"]`,{x,y,width:Number(node.dataset.moduleWidth),height:Number(node.dataset.moduleHeight)},0,T.camera);
        });
      }
      if(step.sceneId === 'uiai' && local !== 1 && query('[data-bridge]').length) {
        transition('[data-bridge]',{scaleX:local===2 ? 1 : 0,opacity:local===2 ? 1 : 0,transformOrigin:'center'},T.reveal,T.line);
        // Entry from the chat state mounts a new bridge, so it has no earlier geometry.
        if(local===2 && animate && !snapshots.current.has('[data-bridge]:0')) tl.fromTo('[data-bridge]',{scaleX:0,opacity:0},{scaleX:1,opacity:1,duration:T.line},T.reveal);
      }
      el.dataset.duration = String(tl.duration());
      el.dataset.motion = animate && tl.duration() ? 'running' : 'settled';
      if(animate) tl.play(0); else tl.progress(1);
    },el);
    previous.current = step.index;
    return () => {
      tracked.forEach(({key,node,props}) => {
        const values: Snapshot = {};
        props.forEach(p => { values[p]=gsap.getProperty(node,p) as string | number; });
        snapshots.current.set(key,values);
      });
      ctx.revert();
    };
  },[step,reduced]);
  return <div ref={root} className="scene-layer" data-state={step.id} data-scene={step.sceneId} data-local={step.local} data-reduced={reduced}>{children}</div>;
}
