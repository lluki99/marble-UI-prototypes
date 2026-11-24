from PIL import Image
import numpy as np
from collections import defaultdict
from pathlib import Path
src=Path(r'C:\Users\Lluc\Downloads\Hamster_faction_logo.jpg')
out=Path(r'output\marble-ability-icons\hamster-faction-logo.svg')
a=np.asarray(Image.open(src).convert('L')) < 128
h,w=a.shape
pad=np.pad(a,1,constant_values=False)
edges=defaultdict(list)
def add(mask, dx1,dy1,dx2,dy2):
    ys,xs=np.nonzero(mask)
    for y,x in zip(ys.tolist(),xs.tolist()):
        edges[(x+dx1,y+dy1)].append((x+dx2,y+dy2))
add(a & ~pad[0:h,1:w+1],0,0,1,0)
add(a & ~pad[1:h+1,2:w+2],1,0,1,1)
add(a & ~pad[2:h+2,1:w+1],1,1,0,1)
add(a & ~pad[1:h+1,0:w],0,1,0,0)
paths=[]
while edges:
    start=next(iter(edges)); p=start; points=[]
    while True:
        points.append(p)
        targets=edges[p]; q=targets.pop()
        if not targets: del edges[p]
        p=q
        if p==start: break
        if p not in edges: raise RuntimeError('Open contour')
    if len(points)<4: continue
    simplified=[]
    for i,pt in enumerate(points):
        a0=points[i-1]; b=points[(i+1)%len(points)]
        if (pt[0]-a0[0])*(b[1]-pt[1]) != (pt[1]-a0[1])*(b[0]-pt[0]): simplified.append(pt)
    if len(simplified)<3: continue
    paths.append('M'+' '.join(f'{x},{y}' if i==0 else f'L{x},{y}' for i,(x,y) in enumerate(simplified))+'Z')
svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-labelledby="title"><title id="title">Hamster faction logo</title><path fill="#000000" fill-rule="evenodd" d="{" ".join(paths)}"/></svg>'
out.write_text(svg,encoding='utf-8')
print(f'{w}x{h}; {len(paths)} contours; {out.stat().st_size} bytes')
