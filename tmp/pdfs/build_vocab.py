from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle, Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import json

OUT=Path('output/pdf/Vocabulari_danes_DU3_modul_2.pdf')
pdfmetrics.registerFont(TTFont('Arial','C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('ArialB','C:/Windows/Fonts/arialbd.ttf'))
W,H=A4
c=canvas.Canvas(str(OUT),pagesize=A4)
c.setTitle('Vocabulari danès per al DU3 mòdul 2')
c.setAuthor('Material de pràctica personal')
style=ParagraphStyle('body',fontName='Arial',fontSize=9.3,leading=12.6,textColor=colors.HexColor('#172129'))
small=ParagraphStyle('small',parent=style,fontSize=8.3,leading=11)
page=0
count=0
catalog=[]
def p(t,st=style): return Paragraph(t,st)
def header(title,sub):
 global page
 page+=1
 c.setFont('Arial',8);c.setFillColor(colors.HexColor('#555555'));c.drawString(38,H-30,'DANSK  ·  DU3 MODUL 2  ·  DANISH → ENGLISH')
 c.setFont('ArialB',18);c.setFillColor(colors.black);c.drawString(38,H-58,title)
 q=p(sub,small); _,hh=q.wrap(W-76,60);q.drawOn(c,38,H-72-hh)
 c.setStrokeColor(colors.HexColor('#cccccc'));c.line(38,35,W-38,35)
 c.setFont('Arial',8);c.drawString(38,23,'Vocabulari de preparació  ·  Fonts i criteris al final');c.drawRightString(W-38,23,str(page))
 return H-90-hh
def prose(text,y):
 q=p(text);_,h=q.wrap(W-76,700);q.drawOn(c,38,y-h);return y-h-12
def tablepage(title,sub,heads,raw,widths,note=''):
 global count
 rows=[r.split('|') for r in raw.strip().splitlines() if r.strip()]
 assert all(len(r)==len(heads) for r in rows),(title,rows)
 count+=len(rows);catalog.extend(rows)
 y=header(title,sub)
 cells=[[p('<b>'+escape(s)+'</b>',small) for s in heads]]+[[p(escape(s),small) for s in r] for r in rows]
 t=Table(cells,colWidths=widths,repeatRows=1)
 t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e3edf0')),('GRID',(0,0),(-1,-1),.35,colors.HexColor('#d4d8da')),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,colors.HexColor('#f7f8f9')])]))
 _,h=t.wrap(W-76,H);assert h<y-65,(title,h,y)
 t.drawOn(c,38,y-h)
 if note: prose(note,y-h-13)
 c.showPage()

y=header('Vocabulari danès per al DU3 mòdul 2','Guia d’estudi amb traduccions a l’anglès · A4 vertical · Consulta de fonts el 25 d’octubre de 2026')
for txt in [
'<b>Objectiu</b><br/>Reconèixer el vocabulari dels textos i les instruccions, parlar de la teva vida quotidiana i escriure respostes senzilles. Inclou substantius, verbs, adjectius, adverbis i conjuncions, més preguntes i expressions pràctiques.',
'<b>Què s’ha investigat</b><br/>S’han consultat els materials públics oficials de SIRI per al DU3 mòdul 2: els sis mindmaps orals, el cas Maja, dos exemples de lectura i un de redacció. Els temes observats són feina i pràctiques, estudis i escola de llengües, habitatge, activitats de lleure i viatges. Les fonts enllaçades són al final.',
'<b>Com interpretar la selecció</b><br/>És una llista pedagògica orientada als exemples disponibles, no un recompte de freqüències ni una llista oficial de paraules que sortiran a l’examen. El material complet de les proves no és públic. S’hi afegeixen paraules quotidianes que permeten parlar dels mateixos temes.',
'<b>Codis de procedència</b><br/><b>M</b> = mindmaps oficials · <b>O</b> = exemple oral Maja · <b>L1</b> = lectura sobre anuncis de feina · <b>L4</b> = lectura sobre habitatges · <b>E</b> = exemple d’escriptura sobre un viatge · <b>+</b> = ampliació pedagògica. Un codi indica que el mot o una forma flexionada apareix a la font; no que hi sigui especialment freqüent.',
'<b>Com estudiar</b><br/>Comença per feina, habitatge, els verbs bàsics i els connectors. Tapa la columna anglesa i intenta recuperar-ne el significat. Després fes el contrari. Fes una frase sobre tu amb cada paraula nova. Repassa les anteriors abans d’afegir-ne més.',
'<b>Formes que convé memoritzar juntes</b><br/>Substantius: article i plural, per exemple <i>en bolig - boliger</i>. Verbs: infinitiu, present i passat. Adjectius: forma amb <i>en</i>, amb <i>et</i> i plural. El significat anglès correspon al sentit quotidià indicat; alguns mots tenen altres usos.',
'<b>Ordre del document</b><br/>Substantius per temes → verbs i expressions verbals → adjectius → adverbis i temps → conjuncions → preguntes i instruccions → frases de pràctica → fonts.'
]:y=prose(txt,y)
c.showPage()
N=['Danès amb article','Plural indefinit','English','Font']
NW=[145,120,206,48]
tablepage('Substantius de feina','Prioritat alta · Horaris, llocs de treball, persones i condicions laborals.',N,'''et arbejde|arbejder (feines concretes)|work; a job|M L1
et job|job|job|M L1
en arbejdsplads|arbejdspladser|workplace|+
et arbejdssted|arbejdssteder|place of work|M
en arbejdsopgave|arbejdsopgaver|work task|M O
en kollega|kolleger / kollegaer|colleague|M L1
en chef|chefer|boss; manager|M
en medarbejder|medarbejdere|employee; staff member|L1
en kunde|kunder|customer|L1
en stilling|stillinger|job position|L1
en arbejdstid|arbejdstider|working hours|L1
en vagt|vagter|shift|L1
en pause|pauser|break|M
en løn|lønninger|salary; pay|+
en ansøgning|ansøgninger|application|L1
en erfaring|erfaringer|experience|L1
en uddannelse|uddannelser|education; qualification|M L1
en praktik|praktikker|work placement; internship|M
et praktiksted|praktiksteder|placement workplace|M
et kontor|kontorer|office|L1
en butik|butikker|shop; store|L1
en kok|kokke|cook; chef|L1
en sekretær|sekretærer|secretary|L1
en opvasker|opvaskere|dishwasher (person)|L1''',NW,'<b>Ús:</b> <i>arbejde</i> i <i>erfaring</i> sovint són incomptables: <i>Jeg har arbejde. Jeg har erfaring.</i>')
tablepage('Substantius d’estudis','Paraules per descriure l’escola, les activitats de classe i la preparació.',N,'''en sprogskole|sprogskoler|language school|M
en skole|skoler|school|L1
et studie|studier|course of study; studies|M L4
et fag|fag|subject|M
en lærer|lærere|teacher|M
en kursist|kursister|course participant; learner|M
en studiekammerat|studiekammerater|fellow student|M
en studerende|studerende|student|L4
et kursus|kurser|course|+
en klasse|klasser|class|+
en lektion|lektioner|lesson|+
et sprog|sprog|language|+
et ord|ord|word|E
en sætning|sætninger|sentence|+
en tekst|tekster|text|L1 L4
et spørgsmål|spørgsmål|question|L4 E
et svar|svar|answer; reply|E
en opgave|opgaver|task; exercise|L1
et eksempel|eksempler|example|L1 L4 E
en bog|bøger|book|+
et bibliotek|biblioteker|library|+
en ordbog|ordbøger|dictionary|+
en prøve|prøver|test|+
en eksamen|eksamener|exam|+''',NW,'<b>També:</b> <i>lektier</i> = homework; habitualment s’utilitza en plural: <i>Jeg laver lektier.</i>')
tablepage('Substantius d’habitatge','Prioritat alta · Compartir pis, descriure una habitació i parlar de despeses.',N,'''en bolig|boliger|home; accommodation|M L4
et hus|huse|house|M L4
en lejlighed|lejligheder|flat; apartment|M L4
et værelse|værelser|room|M L4
et køkken|køkkener|kitchen|L4
en stue|stuer|living room|L4
et badeværelse|badeværelser|bathroom|L4
et bad|bade|bath; shower; bathing facilities|L4
et kollegium|kollegier|student residence|L4
en nabo|naboer|neighbour|M
en husleje|huslejer|rent|L4
en udgift|udgifter|expense|L4
et område|områder|area; neighbourhood|M
en by|byer|town; city|M O
et sted|steder|place|M O
en gang|gange|corridor; time/occasion|L4
en dør|døre|door|+
et vindue|vinduer|window|+
en nøgle|nøgler|key|+
en have|haver|garden|+
et møbel|møbler|piece of furniture|+
et problem|problemer|problem|L4
en rengøringsdag|rengøringsdage|cleaning day|L4
et fællesareal|fællesarealer|shared area|L4''',NW,'<b>Sense plural habitual en aquests sentits:</b> <i>larm</i> = noise; <i>ro</i> = peace and quiet; <i>rengøring</i> = cleaning.')
tablepage('Substantius de persones i lleure','Família, relacions i activitats per ampliar les respostes orals.',N,'''en familie|familier|family|+
en ven|venner|friend|L4 E
en veninde|veninder|female friend|+
en kæreste|kærester|partner; boyfriend/girlfriend|L4
et barn|børn|child|+
en søn|sønner|son|+
en datter|døtre|daughter|+
en bror|brødre|brother|+
en søster|søstre|sister|+
en mor|mødre|mother|+
en far|fædre|father|+
en person|personer|person|L1 L4
en mand|mænd|man; husband|+
en kvinde|kvinder|woman|+
en fritidsaktivitet|fritidsaktiviteter|leisure activity|M
en aktivitet|aktiviteter|activity|M O
en fest|fester|party|L4
en hobby|hobbyer|hobby|+
en film|film|film; movie|+
en café|caféer|café|O L1
en restaurant|restauranter|restaurant|+
en tur|ture|trip; walk; outing|+
en pris|priser|price|M
en billet|billetter|ticket|+''',NW,'<b>Altres mots útils:</b> <i>forældre</i> = parents; <i>søskende</i> = siblings; <i>fritid</i> = free time; <i>musik</i> = music.')
tablepage('Substantius de viatges i vida diària','Transport, aliments, temps i comunicació.',N,'''en bus|busser|bus|+
et tog|tog|train|+
en cykel|cykler|bicycle|+
en bil|biler|car|+
en station|stationer|station|+
et stoppested|stoppesteder|bus stop|+
en rejse|rejser|journey; trip|+
en ferie|ferier|holiday; vacation|+
et land|lande|country|+
en strand|strande|beach|+
en dag|dage|day|M L1
en uge|uger|week|L1 L4
en måned|måneder|month|L1
et år|år|year|L1 L4
en time|timer|hour; lesson|L1
et minut|minutter|minute|+
en morgen|morgener|morning|+
en aften|aftener|evening|L1
en weekend|weekender|weekend|L1
en besked|beskeder|message|+
en e-mail|e-mails|email|E
en aftale|aftaler|arrangement; appointment|+
et æble|æbler|apple|+
et måltid|måltider|meal|+''',NW,'<b>Habitualment sense plural:</b> <i>mad</i> food · <i>vand</i> water · <i>kaffe</i> coffee · <i>vejr</i> weather (E) · <i>transport</i> transport (M O) · <i>tid</i> time (M O L1).')
V=['Infinitiu','Present · passat','Perfecte','English','Font'];VW=[88,123,105,155,48]
tablepage('Verbs bàsics i modals','At és la marca d’infinitiu. La columna del perfecte mostra una construcció habitual.',V,'''at være|er · var|har været|be|L1 L4 E
at have|har · havde|har haft|have|L1 L4 E
at blive|bliver · blev|er blevet|become|L4
at gøre|gør · gjorde|har gjort|do; make|L1 L4
at lave|laver · lavede|har lavet|do; make|L1 L4 E
at få|får · fik|har fået|get; receive|L1 L4 E
at give|giver · gav|har givet|give|+
at tage|tager · tog|har taget|take|+
at komme|kommer · kom|er kommet|come; arrive|+
at gå|går · gik|er gået|go; walk|L1
at kunne|kan · kunne|har kunnet|can; be able to|L1
at ville|vil · ville|har villet|want to; will|L1 L4
at skulle|skal · skulle|har skullet|have to; be supposed to|L1 L4 E
at måtte|må · måtte|har måttet|may; must|L4
at burde|bør · burde|har burdet|should; ought to|+
at turde|tør · turde|har turdet|dare|+
at vide|ved · vidste|har vidst|know a fact|+
at kende|kender · kendte|har kendt|know a person/place|+
at sige|siger · sagde|har sagt|say|+
at se|ser · så|har set|see|+
at høre|hører · hørte|har hørt|hear; listen to|L1 L4 E
at synes|synes · syntes|har syntes|think; have an opinion|L4''',VW,'<b>Modal + infinitiu sense at:</b> <i>Jeg kan komme.</i> Per a <i>gå, køre, flytte</i>, entre altres, l’auxiliar pot canviar segons el sentit; aquí es dona un ús habitual.')
tablepage('Verbs de feina i aprenentatge','Prioritat alta · Reconèixer les formes del passat ajuda a llegir històries i correus.',V,'''at arbejde|arbejder · arbejdede|har arbejdet|work|M O L1
at søge|søger · søgte|har søgt|look for; apply for|L1
at finde|finder · fandt|har fundet|find|L1 L4
at passe|passer · passede|har passet|look after; fit|L1 L4
at bruge|bruger · brugte|har brugt|use; spend|L1
at betale|betaler · betalte|har betalt|pay|+
at tjene|tjener · tjente|har tjent|earn|+
at hjælpe|hjælper · hjalp|har hjulpet|help|+
at møde|møder · mødte|har mødt|meet; turn up|+
at begynde|begynder · begyndte|er begyndt|begin; start|+
at slutte|slutter · sluttede|er sluttet|end; finish (be over)|+
at lære|lærer · lærte|har lært|learn; teach|+
at læse|læser · læste|har læst|read; study|L1 L4 E
at skrive|skriver · skrev|har skrevet|write|L1 E
at tale|taler · talte|har talt|speak; talk|+
at snakke|snakker · snakkede|har snakket|chat; talk|L4
at spørge|spørger · spurgte|har spurgt|ask|+
at svare|svarer · svarede|har svaret|answer; reply|E
at forstå|forstår · forstod|har forstået|understand|+
at fortælle|fortæller · fortalte|har fortalt|tell; describe|L4
at forklare|forklarer · forklarede|har forklaret|explain|+
at øve sig|øver sig · øvede sig|har øvet sig|practise|+''',VW,'<b>Dues construccions:</b> <i>passe børn</i> = look after children; <i>passe til teksten</i> = match the text. <i>møde klokken otte</i> = start/turn up at eight.')
tablepage('Verbs d’habitatge i vida diària','Aprèn també la preposició o partícula quan forma part de l’expressió.',V,'''at bo|bor · boede|har boet|live; reside|L4
at leve|lever · levede|har levet|live; be alive|+
at flytte|flytter · flyttede|er flyttet|move home|L4
at leje|lejer · lejede|har lejet|rent|L4
at dele|deler · delte|har delt|share; divide|L4
at ligge|ligger · lå|har ligget|lie; be situated|L1 L4
at sidde|sidder · sad|har siddet|sit|+
at stå|står · stod|har stået|stand|+
at rydde op|rydder op · ryddede op|har ryddet op|tidy up|L4
at gøre rent|gør rent · gjorde rent|har gjort rent|clean|L4
at købe|køber · købte|har købt|buy|+
at sælge|sælger · solgte|har solgt|sell|+
at spise|spiser · spiste|har spist|eat|L4
at drikke|drikker · drak|har drukket|drink|+
at sove|sover · sov|har sovet|sleep|+
at stå op|står op · stod op|er stået op|get up|+
at køre|kører · kørte|har kørt|drive; travel by vehicle|+
at cykle|cykler · cyklede|har cyklet|cycle|+
at rejse|rejser · rejste|har rejst|travel|E
at besøge|besøger · besøgte|har besøgt|visit|+
at mødes|mødes · mødtes|har mødtes|meet each other|+
at vente|venter · ventede|har ventet|wait|+''',VW,'<b>No confonguis:</b> <i>bo</i> = reside; <i>leve</i> = live/be alive. <i>Jeg bor i Aarhus.</i> <i>Vi lever sundt.</i>')
tablepage('Verbs per ampliar les respostes','Comunicació, activitats i plans.',V,'''at ringe|ringer · ringede|har ringet|phone; ring|L1
at sende|sender · sendte|har sendt|send|L1
at aftale|aftaler · aftalte|har aftalt|arrange; agree on|L1 L4
at planlægge|planlægger · planlagde|har planlagt|plan|L1
at prøve|prøver · prøvede|har prøvet|try|L1
at mangle|mangler · manglede|har manglet|lack; be missing|L1
at kræve|kræver · krævede|har krævet|require|L1
at tilbyde|tilbyder · tilbød|har tilbudt|offer|L1
at betjene|betjener · betjente|har betjent|serve customers; operate|L1
at samarbejde|samarbejder · samarbejdede|har samarbejdet|cooperate; work together|L1
at behøve|behøver · behøvede|har behøvet|need|L1
at holde|holder · holdt|har holdt|hold; keep; host|L4
at spille|spiller · spillede|har spillet|play a game/instrument|L4
at lege|leger · legede|har leget|play (children)|+
at træne|træner · trænede|har trænet|train; exercise|+
at svømme|svømmer · svømmede|har svømmet|swim|+
at hygge sig|hygger sig · hyggede sig|har hygget sig|have a cosy/enjoyable time|L4
at glæde sig|glæder sig · glædede sig|har glædet sig|look forward to; be glad|+
at håbe|håber · håbede|har håbet|hope|+
at huske|husker · huskede|har husket|remember|+
at glemme|glemmer · glemte|har glemt|forget|+
at lyde|lyder · lød|har lydt|sound|E''',VW,'<b>Reflexius:</b> <i>jeg øver mig</i>, <i>du hygger dig</i>, <i>hun glæder sig</i>. El pronom canvia segons el subjecte.')
A=['Forma base','Amb et · plural','English','Font'];AW=[130,150,191,48]
tablepage('Adjectius descriptius','Normalment: en + base, et + t, plural + e. Les formes irregulars es mostren explícitament.',A,'''god|godt · gode|good|L1 L4
dårlig|dårligt · dårlige|bad; poor|L4
stor|stort · store|big; large|L4
lille|lille · små|small; little|L4
ny|nyt · nye|new|L1
gammel|gammelt · gamle|old|L4
ung|ungt · unge|young|L4
billig|billigt · billige|cheap; inexpensive|L4
dyr|dyrt · dyre|expensive|L4
høj|højt · høje|high; tall; loud|L4
lav|lavt · lave|low|L4
lang|langt · lange|long|+
kort|kort · korte|short|+
nem|nemt · nemme|easy|+
svær|svært · svære|difficult|L4
hurtig|hurtigt · hurtige|fast; quick|+
langsom|langsomt · langsomme|slow|+
varm|varmt · varme|warm; hot|+
kold|koldt · kolde|cold|+
ren|rent · rene|clean|L4
beskidt|beskidt · beskidte|dirty|+
sund|sundt · sunde|healthy|L1
syg|sygt · syge|ill; sick|+
træt|træt · trætte|tired|L4''',AW,'<b>Comparatius imprescindibles:</b> <i>god - bedre - bedst</i>; <i>stor - større - størst</i>; <i>lille - mindre - mindst</i>; <i>billig - billigere - billigst</i>.')
tablepage('Adjectius per opinar i parlar de feina','Combina’ls amb exemples personals. No totes les formes en t són adequades amb persones.',A,'''glad|glad · glade|happy; pleased|L1 L4
ked af det|ked af det · kede af det|sad; upset|L4
dejlig|dejligt · dejlige|lovely; pleasant|L1 L4
spændende|spændende · spændende|exciting; interesting|E
interessant|interessant · interessante|interesting|+
kedelig|kedeligt · kedelige|boring|+
sjov|sjovt · sjove|fun; funny|L4
hyggelig|hyggeligt · hyggelige|cosy; pleasant|+
venlig|venligt · venlige|friendly; kind|+
hjælpsom|hjælpsomt · hjælpsomme|helpful|L1
positiv|positivt · positive|positive|L1
effektiv|effektivt · effektive|efficient; effective|L1
erfaren|erfarent · erfarne|experienced|L1
ufaglært|ufaglært · ufaglærte|without vocational training|L1
fleksibel|fleksibelt · fleksible|flexible|L1
fast|fast · faste|fixed; regular|L1 L4
fælles|fælles · fælles|shared; common|L4
færdig|færdigt · færdige|finished; ready|L4
nødvendig|nødvendigt · nødvendige|necessary|L4
vigtig|vigtigt · vigtige|important|+
forskellig|forskelligt · forskellige|different|+
travl|travlt · travle|busy|+
ledig|ledigt · ledige|available; unemployed|+
gratis|gratis · gratis|free of charge|M''',AW,'<b>Blocs útils:</b> <i>glad for</i> = pleased with/fond of; <i>god til</i> = good at; <i>træt af</i> = tired of; <i>færdig med</i> = finished with. <i>Jeg har travlt</i> = I am busy.')
D=['Danès','English','Ús o contrast','Font'];DW=[133,155,183,48]
tablepage('Adverbis freqüents','Negació, freqüència, quantitat i actitud. No tots ocupen la mateixa posició.',D,'''ikke|not|Jeg kommer ikke.|L1 L4
aldrig|never|Jeg kommer aldrig for sent.|+
altid|always|Sempre; oposat a aldrig.|L4
ofte|often|Freqüència alta.|+
tit|often|Molt habitual en conversa.|L4
nogle gange|sometimes|Algunes vegades.|+
sjældent|rarely|Freqüència baixa.|+
engang imellem|occasionally|De tant en tant.|L4
også|also; too|Afegeix informació.|L4
kun|only|Limita una quantitat.|L4
bare|just; simply|Sentit segons el context.|+
meget|very; much|meget dyr; meget tid|L4
lidt|a little; a bit|lidt dyr; lidt tid|L4
mere|more|mere tid; læse mere|L1
mest|most|Màxim de quantitat o grau.|+
næsten|almost|næsten færdig|+
helt|completely; entirely|helt færdig|+
ret|quite; fairly|ret dyrt|L4
rigtig|really; very|rigtig ked af det|L4
gerne|gladly; willingly|vil gerne = would like to|L1 L4
måske|maybe; perhaps|Possibilitat.|L1
desværre|unfortunately|Valoració negativa.|L4
heldigvis|fortunately|Valoració positiva.|+
især|especially|Destaca un element.|L4''',DW,'<b>Ordre:</b> <i>Jeg vil gerne komme</i>, però <i>fordi jeg gerne vil komme</i>. <i>Jeg kommer ikke</i>, però <i>fordi jeg ikke kommer</i>.')
tablepage('Temps i lloc','Expressions temporals i adverbis espacials per narrar i explicar plans.',D,'''nu|now|Ara.|L1 L4
lige nu|right now|En aquest moment.|+
før|before; previously|Jeg har boet her før.|L1
allerede|already|Abans del que s’esperava.|+
endnu|yet; still|ikke endnu = not yet|+
stadig|still|Una situació continua.|+
snart|soon|Futur proper.|L4
senere|later|Després.|+
først|first|Primer pas.|+
bagefter|afterwards|Pas posterior.|+
til sidst|finally; in the end|Últim pas.|+
i dag|today|Avui.|+
i går|yesterday|Ahir.|+
i morgen|tomorrow|Demà, no al matí.|+
om morgenen|in the morning|Habitualment al matí.|+
om aftenen|in the evening|Habitualment al vespre.|+
om ugen|per week|tre dage om ugen|L1 L4
hver anden uge|every other week|Una setmana sí i una no.|L4
her|here|Ubicació.|L4
der|there|També subjecte formal: der er.|L4
hjemme|at home|Ubicació: Jeg er hjemme.|+
hjem|home; homewards|Destí: Jeg skal hjem.|+
henne|located; over there|Hvor er du henne?|E
sammen|together|sammen med = together with|M O L4 E''',DW,'<b>També:</b> <i>alene</i> alone (M O) · <i>ude</i> outside/out (L4 E) · <i>inde</i> inside (+) · <i>tæt på</i> close to (L4) · <i>langt fra</i> far from (+).')
C=['Connector','English','Exemple propi','Font'];CW=[95,120,256,48]
tablepage('Conjuncions i connectors','No són tots de la mateixa categoria: derfor i derefter són adverbis connectors.',C,'''og|and|Jeg arbejder og studerer.|M L1 L4 E
men|but|Jeg vil komme, men jeg er syg.|L1 L4
eller|or|Vil du have te eller kaffe?|L1 L4
for|for; because|Jeg går hjem, for jeg er træt.|L4
fordi|because|Jeg går hjem, fordi jeg er træt.|+
at|that|Jeg tror, at hun kommer.|L1 L4 E
hvis|if|Hvis det regner, bliver jeg hjemme.|+
om|whether; if|Jeg ved ikke, om han kommer.|L1
når|when; whenever|Når jeg har fri, læser jeg.|L4
da|when (past); since|Da jeg kom hjem, spiste jeg.|L4
mens|while|Jeg lytter, mens hun taler.|+
før|before|Jeg ringer, før jeg går.|+
inden|before|Jeg spiser, inden jeg går.|+
efter at|after|Efter at jeg havde spist, gik jeg.|+
selvom|although; even though|Jeg går ud, selvom det regner.|L4
så|so; then|Det regner, så jeg tager bussen.|L1 L4
både ... og|both ... and|Jeg taler både dansk og engelsk.|+
enten ... eller|either ... or|Vi går enten i dag eller i morgen.|+
derfor|therefore; so|Jeg er syg. Derfor bliver jeg hjemme.|L1
derefter|after that|Vi spiser. Derefter går vi hjem.|+''',CW,'<b>At té dos usos:</b> <i>at læse</i> = to read; <i>Jeg ved, at...</i> = I know that... <b>Derfor:</b> verb abans del subjecte. <b>Fordi:</b> <i>fordi jeg ikke kan komme</i>.')
tablepage('Preguntes i instruccions','Paraules per entendre què et demanen i formular preguntes a l’oral.',D,'''hvad|what|Hvad laver du?|E
hvem|who|Hvem bor du sammen med?|L4 E
hvor|where|Hvor bor du?|E
hvornår|when|Hvornår møder du?|+
hvordan|how|Hvordan er vejret?|E
hvorfor|why|Hvorfor lærer du dansk?|+
hvilken / hvilket / hvilke|which|Concorda amb en / et / plural.|+
hvis|whose|Hvis bog er det? No és if aquí.|+
hvor mange|how many|Amb elements comptables.|+
hvor meget|how much|Preu o quantitat no comptable.|+
hvor længe|how long|Durada.|+
hvor ofte|how often|Freqüència.|+
hvor langt|how far|Distància.|+
hvor ... fra|where ... from|Hvor kommer du fra?|+
læs|read|Imperatiu de læse.|L1 L4 E
skriv|write|Imperatiu de skrive.|L1 E
find|find|Imperatiu de finde.|L1 L4
sæt kryds|tick; put a cross|Marca la resposta.|L4
et bogstav|a letter of the alphabet|Plural: bogstaver.|L1
en annonce|an advertisement|Plural: annoncer.|L1
svare på|answer|svare på spørgsmål|E
passe til|match; fit|passe til teksten|L1 L4
minimum|at least; minimum|Límit mínim.|E
et emne|a topic; a subject|Plural: emner.|+''',DW,'<b>Patró oral:</b> <i>Hv-ord + verb + subjecte</i>: <i>Hvor arbejder du?</i> Quan hvem és subjecte: <i>Hvem kommer?</i>')
tablepage('Expressions per produir frases','Blocs complets amb traducció anglesa. Selecció pedagògica pròpia, no respostes oficials.', ['Danès','English'],'''arbejde på fuld tid|work full-time
arbejde på deltid|work part-time
have fri|be off work; have time off
holde en pause|take a break
tage bussen|take the bus
være på vej|be on the way
lede efter en lejlighed|look for a flat
flytte ind / flytte ud|move in / move out
bo sammen med nogen|live with someone
have brug for hjælp|need help
have lyst til at læse|feel like reading
kunne godt lide at læse|like reading
glæde sig til ferien|look forward to the holiday
være god til dansk|be good at Danish
lave mad|cook; prepare food
købe ind|do the grocery shopping
gå en tur|go for a walk
gå i seng|go to bed
Det lyder spændende.|That sounds exciting.
Tak for din e-mail.|Thank you for your email.
Hvordan går det?|How are things?
Jeg håber, du har det godt.|I hope you are well.
Mange hilsner|Best wishes
Kan du gentage det?|Can you repeat that?''',[250,269])
y=header('Pràctica amb el vocabulari','Frases originals. Tapa la resposta anglesa o la danesa i reconstrueix-la en veu alta.')
for da,en in [
('Jeg arbejder på et kontor tre dage om ugen.','I work in an office three days a week.'),
('Jeg søger et job med faste arbejdstider.','I am looking for a job with fixed working hours.'),
('Jeg bor i en lille lejlighed sammen med min kæreste.','I live in a small flat with my partner.'),
('Vi deler køkkenet, men vi har hver vores værelse.','We share the kitchen, but we each have our own room.'),
('Huslejen er høj, så vi leder efter en billigere bolig.','The rent is high, so we are looking for cheaper accommodation.'),
('Jeg tager bussen til sprogskolen.','I take the bus to the language school.'),
('I går kunne jeg ikke komme, fordi jeg var syg.','Yesterday I could not come because I was ill.'),
('Jeg vil gerne øve mig, fordi jeg gerne vil tale bedre dansk.','I would like to practise because I want to speak better Danish.'),
('I min fritid går jeg ture og besøger mine venner.','In my free time I go for walks and visit my friends.'),
('Vi er på ferie, og vejret er dejligt.','We are on holiday, and the weather is lovely.'),
('Hvis du har tid, kan vi mødes på lørdag.','If you have time, we can meet on Saturday.'),
('Jeg ved ikke, hvornår toget kommer.','I do not know when the train arrives.')]:
 y=prose('<b>'+da+'</b><br/>'+en,y)
y=prose('<b>Exercici:</b> substitueix llocs, persones i horaris per dades reals teves. Després transforma quatre frases al passat. Per al correu, respon cada pregunta del remitent; no afegeixis frases memoritzades que no responguin a la situació.',y)
c.showPage()
y=header('Fonts i criteris de selecció','Materials públics oficials consultats · SIRI · Dansk og Prøver')
sources=[
('Portal DU3 amb materials públics','https://danskogproever.dk/sprogcenter/modultest/danskuddannelse-3-materialer-til-modultest/','Punt d’accés als exemples orals i escrits; diferencia material públic i material reservat als centres.'),
('M  Mindmaps de l’oral DU3 mòdul 2','https://danskogproever.dk/media/2x4ifgr2/a4_mindmaps-du3m2_opg1_2022.pdf','Sis temes: feina, pràctiques, estudis, escola de llengües, habitatge i activitat de lleure.'),
('O  Exemple oral Maja','https://danskogproever.dk/media/ollh3jy1/eksempel_maja_du3-m2_opg-2.pdf','Cas per intercanviar informació sobre feina i lleure.'),
('L1  Exemple de lectura tasca 1','https://danskogproever.dk/media/e2dj53nm/eksempel-laesning-opgave-1-du3m2-pdf.pdf','Relacionar persones que busquen feina amb anuncis; horaris, experiència i tasques.'),
('L4  Exemple de lectura tasca 4','https://danskogproever.dk/media/yenffk5l/eksempel-laesning-opgave-4-du3m2-pdf.pdf','Relacionar preguntes amb tres descripcions d’habitatges compartits.'),
('E  Exemple d’escriptura tasca 1','https://danskogproever.dk/media/chvdloda/eksempel-skrivning-opgave-1-du3m2.pdf','Respondre un correu sobre un viatge. Aquest exemple demana un mínim de 70 paraules.'),
('Resum oficial de les proves DU3','https://danskogproever.dk/media/dr2c0ugk/oversigt-til-underviser-modultest-du3.pdf','Referència per distingir mòduls i tipus de tasca.')]
for title,url,desc in sources:
 y=prose('<b>'+title+'</b><br/>'+desc+'<br/><link href="'+url+'" color="#24556b">Obre el material oficial</link>',y)
y=prose('<b>Abast:</b> les formes s’han normalitzat al lema: per exemple, un mot observat en plural pot aparèixer aquí en singular amb el seu article. Les traduccions i els exemples de pràctica són elaboració pròpia. Les entrades amb + amplien el camp temàtic, però no se n’afirma presència als exemples consultats.',y)
y=prose('<b>Recurrència:</b> els temes i les estructures es repeteixen entre els materials; els codis múltiples permeten veure coincidències concretes. No s’ha calculat una freqüència en un corpus representatiu d’exàmens. Confirma sempre les instruccions específiques amb el professor.',y)
c.showPage();c.save()
Path('tmp/pdfs/vocab_catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'pages':page,'table_entries':count,'output':str(OUT.resolve())}))
