"""Render Potatopedia profile-picture options (1600 px PNG + 800 px) and the comparison page options.html."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import base64, io, html
S=1600
RED=(198,40,40); DARK=(22,20,15); CREAM=(244,241,236); TAN=(226,192,141); WHITE=(255,255,255)
F=lambda w,s: ImageFont.truetype(f"/Users/macbookpro/Library/Fonts/Poppins-{w}.ttf", s)
po=Image.open("src/potato-clean.png").convert("RGBA")
a=po.getchannel("A").filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.2)); po.putalpha(a)
def potato(w): s=w/po.width; return po.resize((w,int(po.height*s)),Image.LANCZOS)
def base(c): return Image.new("RGBA",(S,S),c+(255,))
def radial(im,c_in,c_out):
    g=Image.new("RGBA",(S,S),c_out+(255,)); d=ImageDraw.Draw(g)
    for r in range(S//2+200,0,-8):
        t=r/(S//2+200); col=tuple(int(c_in[i]*(1-t)+c_out[i]*t) for i in range(3)); d.ellipse([S//2-r,S//2-r,S//2+r,S//2+r],fill=col+(255,))
    return g
def place(bg,img,cx,cy,sh=True):
    if sh:
        P=160; s=Image.new("RGBA",(img.width+2*P,img.height+2*P),(0,0,0,0))
        al=Image.new("L",s.size,0); al.paste(img.getchannel("A").point(lambda v:int(v*110/255)),(P,P)); s.putalpha(al.filter(ImageFilter.GaussianBlur(40)))
        bg.alpha_composite(s,(int(cx-img.width/2-P),int(cy-img.height/2+30-P)))
    bg.alpha_composite(img,(int(cx-img.width/2),int(cy-img.height/2)))
def ring(bg,color,r,w): ImageDraw.Draw(bg).ellipse([S//2-r,S//2-r,S//2+r,S//2+r],outline=color+(255,),width=w)
def text_c(bg,s,f,fill,cy,spacing=0):
    d=ImageDraw.Draw(bg)
    if spacing:
        total=sum(f.getlength(ch) for ch in s)+spacing*(len(s)-1); x=S/2-total/2
        for ch in s: d.text((x,cy),ch,font=f,fill=fill+(255,),anchor="lm"); x+=f.getlength(ch)+spacing
    else: d.text((S/2,cy),s,font=f,fill=fill+(255,),anchor="mm")
opts=[]
im=radial(base(RED),(222,62,58),(165,28,28)); place(im,potato(1000),S/2,S/2+30)
opts.append(("A","Red field, real potato","The current idea, refined: a real potato on a deeper red with soft light and shadow. Reads at every size and stays closest to the site.",im))
im=base(CREAM); ring(im,RED,690,14); place(im,potato(900),S/2,S/2+20)
opts.append(("B","Cream, red ring","Quiet and premium. The thin ring frames the circle crop on YouTube and LinkedIn; the potato stays large.",im))
im=radial(base(DARK),(48,42,32),DARK); ring(im,TAN,700,8); place(im,potato(760),S/2,S/2-70); text_c(im,"POTATOPEDIA",F("SemiBold",92),TAN,1210,spacing=18)
opts.append(("C","Dark, tan ring, wordmark","Matches the dark data scenes in the videos and the tan P app icon. The wordmark shows at 800 px and fades out gracefully at 48 px.",im))
im=base(CREAM); d=ImageDraw.Draw(im); d.ellipse([160,160,S-160,S-160],fill=RED+(255,)); text_c(im,"P",F("Bold",900),WHITE,S/2+20); sp=potato(250); im.alpha_composite(sp,(int(S/2+140),int(S/2+110)))
opts.append(("D","Monogram P with potato","A bold Poppins P on a red disc with a small real potato tucked in. Strongest at tiny sizes such as comments and replies.",im))
im=base(CREAM); sil=potato(1000); mask=sil.getchannel("A"); red=Image.new("RGBA",sil.size,RED+(255,)); red.putalpha(mask)
cx,cy=S/2,S/2+20; im.alpha_composite(red,(int(cx-sil.width/2),int(cy-sil.height/2)))
d=ImageDraw.Draw(im); bw=110; gap=50; x0=cx-(3*bw+2*gap)/2; yb=cy+230
for i,h in enumerate([220,330,440]): d.rounded_rectangle([x0+i*(bw+gap),yb-h,x0+i*(bw+gap)+bw,yb],28,fill=WHITE+(255,))
opts.append(("E","Data mark","A red potato silhouette carrying three rising bars: the knowledge base in one shape. Unique to Potatopedia and needs no photo.",im))
im=radial(base(RED),(222,62,58),(165,28,28)); text_c(im,"Potato",F("Bold",300),WHITE,S/2-190); text_c(im,"pedia",F("Bold",300),WHITE,S/2+190); ImageDraw.Draw(im).rounded_rectangle([S/2-170,S/2-14,S/2+170,S/2+14],14,fill=TAN+(255,))
opts.append(("F","Split wordmark","Name only, two lines, tan rule between. Clear on the channel page; the words blur at 48 px, so it suits YouTube more than LinkedIn.",im))
cards=[]
def uri(im,px): b=io.BytesIO(); im.convert("RGB").resize((px,px),Image.LANCZOS).save(b,"JPEG",quality=86); return "data:image/jpeg;base64,"+base64.b64encode(b.getvalue()).decode()
for key,name,note,im in opts:
    im.convert("RGB").save(f"option-{key}.png"); im.convert("RGB").resize((800,800),Image.LANCZOS).save(f"option-{key}-800.png")
    cards.append((key,name,note,uri(im,640)))
cur=Image.open("/Users/macbookpro/Projects/potatopedia-next/public/logo.png").convert("RGB")
cur_uri=uri(cur,640)
def card(key,name,note,u):
    return f'''<article class="opt" id="opt-{key}">
  <div class="big"><img src="{u}" alt="Option {key}: {html.escape(name)}"></div>
  <div class="info">
    <div class="eyebrow">Option {key}</div>
    <h2>{html.escape(name)}</h2>
    <p>{html.escape(note)}</p>
    <div class="sizes">
      <figure><div class="yt"><img src="{u}" alt=""></div><figcaption>YouTube channel 160 px</figcaption></figure>
      <figure><div class="li"><img src="{u}" alt=""></div><figcaption>LinkedIn page 72 px</figcaption></figure>
      <figure><div class="sm"><img src="{u}" alt=""></div><figcaption>Feed and comments 40 px</figcaption></figure>
      <figure><div class="sq"><img src="{u}" alt=""></div><figcaption>Square, 800 px file</figcaption></figure>
    </div>
    <div class="file">docs/brand/profile-options/option-{key}-800.png</div>
  </div>
</article>'''
page=f'''<title>Potatopedia Profile Marks</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap">
<style>
/* Layout: one column of option cards, each = large circle preview + notes + the four real display sizes */
:root{{--bg:#f6f2ea;--fg:#16140f;--muted:#6b6459;--accent:#c62828;--line:#e3dccf;--card:#ffffff;--tan:#e2c08d;
  --display:"Poppins",system-ui,sans-serif;--body:"Poppins",system-ui,sans-serif}}
@media (prefers-color-scheme: dark){{:root:not([data-theme="light"]){{--bg:#16140f;--fg:#f4f1ec;--muted:#b9b0a1;--accent:#e24a46;--line:#2e2a22;--card:#1f1c16;color-scheme:dark}}}}
:root[data-theme="dark"]{{--bg:#16140f;--fg:#f4f1ec;--muted:#b9b0a1;--accent:#e24a46;--line:#2e2a22;--card:#1f1c16;color-scheme:dark}}
body{{background:var(--bg);color:var(--fg);font-family:var(--body);margin:0;padding-block:32px 64px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}}
.wrap{{max-width:1040px;margin:0 auto;display:grid;gap:28px}}
header h1{{font-family:var(--display);font-size:clamp(28px,4vw,40px);margin:0 0 8px;text-wrap:balance;letter-spacing:-.01em}}
header p{{margin:0;color:var(--muted);max-width:62ch;line-height:1.5}}
.now{{display:flex;gap:18px;align-items:center;padding:16px 20px;border:1px solid var(--line);border-radius:14px;background:var(--card)}}
.now img{{width:72px;height:72px;border-radius:50%;object-fit:cover}}
.now .lbl{{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}}
.opt{{display:grid;grid-template-columns:300px 1fr;gap:28px;padding:24px;border:1px solid var(--line);border-radius:18px;background:var(--card);align-items:start}}
.big img{{width:300px;height:300px;border-radius:50%;object-fit:cover;display:block;max-width:100%}}
.eyebrow{{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);font-weight:600}}
.opt h2{{font-family:var(--display);font-size:24px;margin:4px 0 8px;font-weight:600}}
.opt p{{margin:0 0 18px;line-height:1.55;color:var(--muted);max-width:60ch}}
.sizes{{display:flex;flex-wrap:wrap;gap:22px;align-items:flex-end}}
.sizes figure{{margin:0;display:grid;gap:8px;justify-items:center}}
.sizes figcaption{{font-size:12px;color:var(--muted);text-align:center}}
.yt img{{width:160px;height:160px;border-radius:50%}} .li img{{width:72px;height:72px;border-radius:50%}} .sm img{{width:40px;height:40px;border-radius:50%}} .sq img{{width:72px;height:72px;border-radius:10px}}
.sizes img{{object-fit:cover;display:block}}
.file{{margin-top:18px;font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums;word-break:break-all}}
.pick{{border:1px solid var(--line);border-radius:14px;padding:18px 20px;background:var(--card);line-height:1.55}}
.pick strong{{color:var(--accent)}}
@media (max-width:720px){{.opt{{grid-template-columns:1fr}}.big img{{width:220px;height:220px;margin:0 auto}}}}
</style>
<div class="wrap">
<header>
  <h1>Potatopedia profile marks</h1>
  <p>Six options for the YouTube channel and the LinkedIn page, each shown the way the platforms show it: a circle at channel size, page size and comment size, plus the square file. All are 800×800 PNG, Potatopedia red, cream, dark and tan, Poppins, one real Adobe Stock potato.</p>
</header>
<div class="now"><img src="{cur_uri}" alt="Current logo"><div><div class="lbl">Today</div><div>Red square with the potato photo, on LinkedIn and YouTube now</div></div></div>
{''.join(card(*c) for c in cards)}
<div class="pick"><strong>Suggested pair:</strong> Option A for both YouTube and LinkedIn (same mark everywhere, closest to the site, clearest at 40 px). If you want the channel to feel more like the videos, use C on YouTube and A on LinkedIn. Reply with a letter and I will upload it to both.</div>
</div>'''
open("options.html","w").write(page); print("ok", len(page)//1024, "KB")
