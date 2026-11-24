from pathlib import Path
from io import BytesIO
import pdfplumber
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas

translations = [
'''interrupt|give off; submit|decide; determine|place; put|state; indicate|concern; relate to|arrest|arrive|consider; regard|employ; hire|ask; pray|deceive; cheat|be; feel (with sig)|commit (an act)|keep|describe|pass; consist of|occupy|mean; signify|bite|contribute|tie; bind|become; stay|bring|burst; break|break|wrestle|offer; bid|carry; wear|participate|draw; travel|drink''',
'''drive; run; drift|die|leave behind|fall|rush; travel|maintain; hold on to|establish; ascertain|set; determine|find|exist; be found|fart|flow; float|fly|giggle|snort|connect; bandage|remain|take place|occur; seem|suggest|do (an activity)|prefer|relate to; respond to|leave|regret|understand|disappear|continue|tell''',
'''assume; presuppose|be evident; emerge|present; put forward|put forward; propose|freeze; feel cold|drift (snow/sand)|follow|get; receive|go through; review|repeat|feel like; bother to|give|slide; glide|rub|grab; catch|cry|spawn; pour out|shudder|apply; be valid|do; make|go; walk|have|be called|pull; tug|help|hold; keep|hang (be suspended)|involve; withdraw|entail; imply''',
'''contain|enter into; form part of|take; occupy; consume|hunt; chase|ring; sound|pinch|come|crawl; creep|can; be able to|sing (poetic)|let; leave|laugh|suffer; like (lide ... godt)|lie; be situated|sound|succeed|lie (say something false)|lay; put|run|receive|meet (each other)|must; may; be allowed to|close down; lay down|reduce; establish|enjoy|make do with|publish; make public|surround|raise; bring up|invent|give up; state''',
'''arise; originate|record; occupy; admit|perform; behave; appear|comply with; keep|leave to; entrust|take over|whistle; squeak|plan|ride (a horse)|flow (literary)|tear; pull; rake|smoke|reach; hand; suffice|see|see each other; be seen|sit|say|shit (vulgar)|scream|write|bray (a donkey)|shall; be supposed to|shoot|be due to|cut|grind; sharpen; polish|wear down; toil|let go; escape|hit; beat|fight|throw; throw away''',
'''sneak|cheat; deceive|sleep|spin; purr|jump; leap; burst|crack; split|ask|fry; roast|rise; climb|prick; stab; stick|run away|stink|steal|struggle; conflict with|quarrel; dispute|iron; stroke; cross out|stretch|stand|get up|scorch; sting|betray; fail|dwindle; diminish|swing; turn|swear|think; seem|sing|sink|sell|put; set|take|go home|be silent''',
'''spend (time)|offer|allow|step; tread|meet; make (a decision)|pull; draw|dare|twist; twine|force|count|carry out; perform|publish; issue|constitute; amount to|be published; come out|postpone; expose|entertain|adopt; pass (a proposal)|know (a fact)|yield; give way|want to; will|win|twist; wring|choose|be|eat (animals; informal)|destroy; ruin'''
]
source = Path('C:/Users/Lluc/Downloads/Uregelmæssige verber.pdf')
output = Path('output/pdf/Uregelmaessige_verber_English.pdf')
reader = PdfReader(source)
writer = PdfWriter()
count = 0
with pdfplumber.open(source) as doc:
    for idx, page in enumerate(doc.pages):
        table = page.find_tables()[0]
        data = table.extract()
        rows = [(r, geometry) for r, geometry in zip(data,table.rows) if r[0] and not r[0].startswith('navne-')]
        meanings = translations[idx].split('|')
        assert len(rows) == len(meanings), (idx,len(rows),len(meanings))
        stream = BytesIO()
        c = canvas.Canvas(stream, pagesize=(800,792))
        x, width = table.bbox[2], 215
        c.setFont('Helvetica-Bold',10)
        c.drawString(x+8, 792-45, 'English meaning')
        for (row, geometry), meaning in zip(rows, meanings):
            top, bottom = geometry.bbox[1], geometry.bbox[3]
            c.setStrokeColorRGB(.65,.65,.65)
            c.setLineWidth(.35)
            c.rect(x,792-bottom,width,bottom-top,stroke=1,fill=0)
            c.setFillColorRGB(.08,.15,.20)
            c.setFont('Helvetica',9)
            assert c.stringWidth(meaning,'Helvetica',9) < width-16
            c.drawString(x+8,792-(top+bottom)/2-3,meaning)
            count += 1
        c.setFont('Helvetica',8)
        c.drawString(65,24,'English: common meanings; usage depends on context. Original Danish forms preserved.')
        c.save()
        original = reader.pages[idx]
        original.mediabox.upper_right = (800,792)
        original.cropbox.upper_right = (800,792)
        original.merge_page(PdfReader(stream).pages[0])
        writer.add_page(original)
writer.write(output)
assert len(PdfReader(output).pages)==7
print(f'Created {output.resolve()} with {count} translations')

