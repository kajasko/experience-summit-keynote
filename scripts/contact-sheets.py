from PIL import Image,ImageDraw
from pathlib import Path
r=Path(__file__).resolve().parents[1]/'validation'
for mode in ['normal','reduced','intermediate']:
 if not (r/mode).exists():continue
 for start in range(1,76,15):
  canvas=Image.new('RGB',(1800,5*360),'#102526');d=ImageDraw.Draw(canvas)
  for i in range(start,min(start+15,76)):
   p=r/mode/f'{i:02}.png'
   if not p.exists():continue
   im=Image.open(p);im.thumbnail((592,333));x=((i-start)%3)*600;y=((i-start)//3)*360;canvas.paste(im,(x,y));d.text((x+8,y+337),str(i),fill='white')
  canvas.save(r/f'{mode}-{start}.jpg')
