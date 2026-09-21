export type CategoryId =
  | 'caf-fiscali'
  | 'caf-bonus'
  | 'caf-casa'
  | 'pat-pensioni'
  | 'pat-lavoro'
  | 'pat-invalidita'
  | 'immigrazione'
  | 'digitale'

export interface Category {
  id: CategoryId
  name: string
  area: 'CAF' | 'Patronato' | 'Immigrazione' | 'Digitale'
  icon: string // lucide icon name key in ServiceIcon map
  blurb: string
}

export interface Service {
  id: string
  category: CategoryId
  name: string
  simple: string // spiegazione in parole semplici
  who: string // a chi spetta
  docs: string[]
  steps: string[]
  time: string
  mvp?: boolean
  keywords: string[]
}

export const CATEGORIES: Category[] = [
  { id: 'caf-fiscali', name: 'Fiscali', area: 'CAF', icon: 'receipt', blurb: 'Dichiarazioni, ISEE e tasse' },
  { id: 'caf-bonus', name: 'Bonus e agevolazioni', area: 'CAF', icon: 'gift', blurb: 'Sostegni al reddito e bollette' },
  { id: 'caf-casa', name: 'Lavoro e casa', area: 'CAF', icon: 'home', blurb: 'Affitti, colf e badanti' },
  { id: 'pat-pensioni', name: 'Pensioni e previdenza', area: 'Patronato', icon: 'sunset', blurb: 'Pensioni, contributi, estero' },
  { id: 'pat-lavoro', name: 'Disoccupazione e lavoro', area: 'Patronato', icon: 'briefcase', blurb: 'NASpI, maternità, congedi' },
  { id: 'pat-invalidita', name: 'Invalidità e assistenza', area: 'Patronato', icon: 'heart', blurb: 'Invalidità, Legge 104, INAIL' },
  { id: 'immigrazione', name: 'Immigrazione', area: 'Immigrazione', icon: 'globe', blurb: 'Permesso, cittadinanza, ricongiungimento' },
  { id: 'digitale', name: 'Prossimità digitale', area: 'Digitale', icon: 'smartphone', blurb: 'SPID, CIE e aiuto col digitale' },
]

export const SERVICES: Service[] = [
  // ── CAF fiscali ─────────────────────────────────────────────
  {
    id: '730', category: 'caf-fiscali', name: 'Modello 730', mvp: true,
    simple: 'La dichiarazione dei redditi per lavoratori dipendenti e pensionati. Serve per pagare le tasse giuste e spesso per ricevere indietro dei soldi.',
    who: 'Lavoratori dipendenti e pensionati.',
    docs: ['Documento di identità', 'Codice fiscale (tuo e dei familiari a carico)', 'CU (Certificazione Unica)', 'Documenti spese: sanitarie, scuola, affitto, mutuo', 'IBAN per eventuale rimborso'],
    steps: ['Raccogli i documenti', 'Un operatore compila il 730 con te', 'Controlli e firmi', 'Rimborso in busta paga o pensione'],
    time: '30–45 minuti',
    keywords: ['730', 'dichiarazione', 'redditi', 'tasse', 'rimborso', 'fisco', 'busta paga', 'lavoro dipendente', 'detrazioni', 'cu', 'certificazione unica', 'soldi indietro'],
  },
  {
    id: 'isee', category: 'caf-fiscali', name: 'ISEE / DSU', mvp: true,
    simple: 'Un documento che dice quanto guadagna la tua famiglia. Serve per quasi tutti i bonus, gli assegni e le agevolazioni.',
    who: 'Chiunque voglia accedere a bonus, assegni, agevolazioni, mense e rette ridotte.',
    docs: ['Documento di identità', 'Codice fiscale di tutta la famiglia', 'Giacenza media e saldo conti al 31/12', 'Redditi di 2 anni prima', 'Eventuale contratto di affitto', 'Eventuale invalidità: certificato'],
    steps: ['Raccogli i documenti', 'Compiliamo insieme la DSU', 'Ricevi l\'ISEE in pochi giorni', 'Lo usi per i bonus'],
    time: '20–30 minuti',
    keywords: ['isee', 'dsu', 'bonus', 'reddito famiglia', 'agevolazioni', 'assegno unico', 'mensa', 'retta', 'asilo nido', 'università'],
  },
  {
    id: 'redditi-pf', category: 'caf-fiscali', name: 'Redditi PF',
    simple: 'La dichiarazione dei redditi per chi ha partita IVA, più lavori o redditi che non entrano nel 730.',
    who: 'Lavoratori autonomi, partite IVA, chi ha redditi esteri o affitti.',
    docs: ['Documento e codice fiscale', 'Documentazione redditi', 'Fatture e spese deducibili', 'Estratti conto'],
    steps: ['Raccolta documenti', 'Compilazione con operatore', 'Invio telematico', 'Pagamento F24 se dovuto'],
    time: '1–2 appuntamenti',
    keywords: ['redditi pf', 'partita iva', 'autonomo', 'modello redditi', 'fatture', 'tasse autonomo'],
  },
  {
    id: 'imu', category: 'caf-fiscali', name: 'IMU',
    simple: 'La tassa sulla casa (non sulla prima casa, salvo eccezioni). Si calcola e si paga con modello F24.',
    who: 'Proprietari di seconde case, terreni e fabbricati.',
    docs: ['Visura o atto di proprietà', 'Rendita catastale', 'Dati di residenza'],
    steps: ['Verifica degli immobili', 'Calcolo dell\'imposta', 'Pagamento F24'],
    time: '20 minuti',
    keywords: ['imu', 'tasi', 'tassa casa', 'seconda casa', 'f24', 'immobile'],
  },
  {
    id: 'successione', category: 'caf-fiscali', name: 'Successione',
    simple: 'Quando una persona cara muore, i suoi beni passano agli eredi: questa pratica lo rende ufficiale.',
    who: 'Eredi di una persona deceduta.',
    docs: ['Certificato di morte', 'Documenti del defunto e degli eredi', 'Atti di proprietà, conti, investimenti'],
    steps: ['Raccolta documenti', 'Compilazione dichiarazione', 'Invio all\'Agenzia delle Entrate', 'Voltura degli immobili'],
    time: 'Da concordare',
    keywords: ['successione', 'eredità', 'morte', 'eredi', 'defunto', 'casa ereditata'],
  },
  {
    id: 'cu', category: 'caf-fiscali', name: 'Certificazione Unica (CU)',
    simple: 'Il documento che riassume quanto hai guadagnato in un anno. Ti serve per il 730 e per tante pratiche.',
    who: 'Lavoratori dipendenti, pensionati, collaboratori.',
    docs: ['Documento di identità', 'Codice fiscale'],
    steps: ['Richiesta al CAF', 'Ricezione CU', 'Uso per il 730'],
    time: 'Immediato se disponibile',
    keywords: ['cu', 'certificazione unica', 'cud', 'guadagni anno', 'busta paga'],
  },

  // ── CAF bonus ───────────────────────────────────────────────
  {
    id: 'adi', category: 'caf-bonus', name: 'Assegno di Inclusione (ADI)', mvp: true,
    simple: 'Un aiuto economico mensile per famiglie in difficoltà con minorenni, over 60, disabili o persone fragili. Ha sostituito il Reddito di Cittadinanza.',
    who: 'Famiglie con ISEE basso e almeno un minorenne, un over 60, una persona con disabilità o in condizione di fragilità.',
    docs: ['ISEE in corso di validità', 'Documenti di tutta la famiglia', 'IBAN', 'Composizione del nucleo'],
    steps: ['Verifica requisiti con ISEE', 'Domanda online con operatore', 'Firma del patto di attivazione', 'Ricezione mensile'],
    time: '45 minuti',
    keywords: ['adi', 'assegno di inclusione', 'reddito di cittadinanza', 'sostegno', 'aiuto economico', 'povertà', 'non arrivo a fine mese', 'soldi', 'sfl', 'supporto formazione'],
  },
  {
    id: 'bonus-edilizi', category: 'caf-bonus', name: 'Bonus edilizi',
    simple: 'Detrazioni per ristrutturare casa, risparmiare energia o comprare mobili: recuperi parte della spesa dalle tasse.',
    who: 'Chi ristruttura, cambia infissi, caldaia o arreda casa.',
    docs: ['Fatture e bonifici parlanti', 'Dati catastali dell\'immobile', 'Documento e codice fiscale'],
    steps: ['Verifica spese ammissibili', 'Calcolo detrazione', 'Inserimento in dichiarazione'],
    time: '30 minuti',
    keywords: ['bonus ristrutturazione', 'ecobonus', 'bonus mobili', 'detrazione', 'ristrutturare', 'infissi', 'caldaia'],
  },
  {
    id: 'bonus-bollette', category: 'caf-bonus', name: 'Bonus luce, gas e acqua',
    simple: 'Sconti automatici sulle bollette per chi ha l\'ISEE basso. Basta avere l\'ISEE: lo sconto arriva da solo.',
    who: 'Famiglie con ISEE sotto la soglia prevista.',
    docs: ['ISEE in corso di validità'],
    steps: ['Fai l\'ISEE', 'Lo sconto arriva automaticamente in bolletta', 'Rinnova l\'ISEE ogni anno'],
    time: 'Automatico con ISEE',
    keywords: ['bonus luce', 'bonus gas', 'bonus acqua', 'bollette', 'bolletta cara', 'sconto bollette'],
  },
  {
    id: 'canone-rai', category: 'caf-bonus', name: 'Esenzione canone RAI',
    simple: 'Gli over 75 con reddito basso non pagano il canone RAI. Basta presentare la domanda.',
    who: 'Over 75 con reddito familiare sotto la soglia.',
    docs: ['Documento di identità', 'Dati reddito familiare'],
    steps: ['Verifica requisiti', 'Invio modulo esenzione', 'Rinnovo annuale se richiesto'],
    time: '15 minuti',
    keywords: ['canone rai', 'esenzione rai', 'bolletta rai', 'over 75'],
  },

  // ── CAF casa/lavoro ─────────────────────────────────────────
  {
    id: 'locazioni', category: 'caf-casa', name: 'Contratti di affitto', mvp: true,
    simple: 'Registriamo il tuo contratto di affitto, calcoliamo la cedolare secca e gestiamo rinnovi e chiusure.',
    who: 'Proprietari che affittano e inquilini che vogliono un contratto regolare.',
    docs: ['Contratto di affitto', 'Documenti di proprietario e inquilino', 'Dati catastali dell\'immobile', 'Planimetria (se richiesta)'],
    steps: ['Verifica contratto', 'Scelta regime (cedolare o ordinario)', 'Registrazione telematica', 'Ricevuta di registrazione'],
    time: '30 minuti',
    keywords: ['affitto', 'locazione', 'contratto affitto', 'cedolare secca', 'inquilino', 'proprietario casa', 'registrare contratto', 'casa in affitto'],
  },
  {
    id: 'colf-badanti', category: 'caf-casa', name: 'Colf e badanti',
    simple: 'Assunzione, buste paga, contributi e chiusura del rapporto di lavoro per colf e badanti. Tutto regolare, tutti protetti.',
    who: 'Famiglie che assumono una colf o una badante, e lavoratrici/lavoratori domestici.',
    docs: ['Documenti di datore e lavoratore', 'Permesso di soggiorno (se richiesto)', 'IBAN del lavoratore'],
    steps: ['Lettera di assunzione', 'Comunicazione INPS', 'Buste paga mensili', 'Contributi trimestrali'],
    time: '30 minuti',
    keywords: ['colf', 'badante', 'lavoro domestico', 'assumere badante', 'busta paga colf', 'assistenza anziani', 'cerco lavoro badante', 'lavoro in casa'],
  },
  {
    id: 'visure', category: 'caf-casa', name: 'Visure catastali',
    simple: 'Il documento ufficiale che dice chi possiede un immobile e com\'è registrato al catasto.',
    who: 'Proprietari, acquirenti, eredi.',
    docs: ['Dati dell\'immobile o del proprietario'],
    steps: ['Richiesta telematica', 'Consegna immediata'],
    time: 'Immediato',
    keywords: ['visura', 'catasto', 'visura catastale', 'proprietà immobile'],
  },

  // ── Patronato pensioni ──────────────────────────────────────
  {
    id: 'pensione', category: 'pat-pensioni', name: 'Pensione', mvp: true,
    simple: 'Vecchiaia, anzianità, reversibilità: verifichiamo quando puoi andare in pensione e presentiamo la domanda.',
    who: 'Chi ha raggiunto i requisiti di età e contributi; i familiari superstiti per la reversibilità.',
    docs: ['Documento di identità', 'Estratto conto previdenziale', 'Buste paga / documentazione contributi', 'Stato di famiglia (reversibilità)'],
    steps: ['Verifica requisiti ed ecografia contributiva', 'Scelta della pensione migliore', 'Domanda online', 'Monitoraggio fino al primo pagamento'],
    time: '1 appuntamento + attesa INPS',
    keywords: ['pensione', 'pensione vecchiaia', 'pensione anzianità', 'reversibilità', 'andare in pensione', 'quando vado in pensione', 'contributi', 'quota', 'opzione donna', 'vedova'],
  },
  {
    id: 'totalizzazione', category: 'pat-pensioni', name: 'Totalizzazione contributi esteri', mvp: true,
    simple: 'Hai lavorato in Italia e anche all\'estero? I tuoi contributi si possono unire per darti una pensione più piena.',
    who: 'Chi ha lavorato in Italia e in paesi UE o con accordi (es. Marocco, Tunisia, Albania, Argentina…).',
    docs: ['Documento e permesso/carta di soggiorno', 'Estratti conto dei periodi esteri', 'Documentazione lavorativa estera'],
    steps: ['Mappatura dei periodi lavorativi', 'Verifica accordi internazionali', 'Domanda di totalizzazione', 'Calcolo pensione pro-quota'],
    time: 'Percorso dedicato',
    keywords: ['totalizzazione', 'contributi esteri', 'lavorato all\'estero', 'pensione estero', 'marocco', 'ricongiunzione contributi', 'contributi in due paesi', 'pensione internazionale'],
  },
  {
    id: 'assegno-sociale', category: 'pat-pensioni', name: 'Assegno sociale',
    simple: 'Un piccolo assegno mensile per chi ha più di 67 anni, vive in Italia da almeno 10 anni e ha reddito molto basso.',
    who: 'Over 67 residenti in Italia da 10 anni continuativi con reddito sotto soglia.',
    docs: ['Documento e titolo di soggiorno', 'Certificazione residenza 10 anni', 'Dati reddituali'],
    steps: ['Verifica requisiti', 'Domanda INPS', 'Verifica annuale reddito'],
    time: '30 minuti',
    keywords: ['assegno sociale', 'pensione sociale', '67 anni', 'anziano senza pensione', 'pensione minima'],
  },
  {
    id: 'estratto-conto', category: 'pat-pensioni', name: 'Estratto conto previdenziale',
    simple: 'La fotografia di tutti i tuoi contributi: ti dice quanto hai versato e che pensione avrai.',
    who: 'Tutti i lavoratori.',
    docs: ['SPID o documento'],
    steps: ['Accesso al fascicolo', 'Analisi dei contributi', 'Stima della pensione futura'],
    time: '15 minuti',
    keywords: ['estratto conto', 'contributi versati', 'quanto ho versato', 'fascicolo previdenziale'],
  },

  // ── Patronato lavoro ────────────────────────────────────────
  {
    id: 'naspi', category: 'pat-lavoro', name: 'NASpI (disoccupazione)', mvp: true,
    simple: 'Se hai perso il lavoro senza colpa tua, lo Stato ti dà un sussidio mensile mentre cerchi un nuovo lavoro.',
    who: 'Chi ha perso il lavoro per licenziamento, fine contratto o dimissioni per giusta causa.',
    docs: ['Documento di identità', 'Lettera di licenziamento o fine contratto', 'Ultima busta paga', 'IBAN'],
    steps: ['Verifica requisiti', 'Domanda entro 68 giorni', 'Risposta INPS', 'Pagamenti mensili'],
    time: '30 minuti',
    keywords: ['naspi', 'disoccupazione', 'perso il lavoro', 'licenziato', 'licenziata', 'fine contratto', 'senza lavoro', 'sussidio', 'discoll', 'dis-coll', 'dimissioni'],
  },
  {
    id: 'maternita', category: 'pat-lavoro', name: 'Maternità e congedi',
    simple: 'Se aspetti un bambino, hai diritto a mesi pagati prima e dopo la nascita, e a congedi per stare coi figli.',
    who: 'Lavoratrici e lavoratori dipendenti (e alcune categorie autonome).',
    docs: ['Certificato di gravidanza', 'Documento di identità', 'Dati del datore di lavoro'],
    steps: ['Verifica del periodo spettante', 'Domanda online', 'Comunicazione al datore'],
    time: '30 minuti',
    keywords: ['maternità', 'congedo', 'incinta', 'gravidanza', 'bambino in arrivo', 'paternità', 'aspetto un bambino', 'congedo parentale'],
  },
  {
    id: 'disoccupazione-agricola', category: 'pat-lavoro', name: 'Disoccupazione agricola',
    simple: 'Il sussidio per i braccianti agricoli: si richiede una volta all\'anno, con le giornate lavorate.',
    who: 'Operai agricoli a tempo determinato.',
    docs: ['Documento di identità', 'Elenco giornate lavorate', 'IBAN'],
    steps: ['Verifica requisiti', 'Domanda annuale', 'Pagamento unico'],
    time: '30 minuti',
    keywords: ['disoccupazione agricola', 'bracciante', 'lavoro agricolo', 'giornate agricole', 'campi'],
  },

  // ── Patronato invalidità ────────────────────────────────────
  {
    id: 'invalidita', category: 'pat-invalidita', name: 'Invalidità civile e Legge 104', mvp: true,
    simple: 'Se tu o un familiare avete una disabilità, ci sono riconoscimenti economici, permessi dal lavoro e agevolazioni.',
    who: 'Persone con disabilità e loro familiari.',
    docs: ['Certificato medico introduttivo (dal medico di base)', 'Documento di identità', 'Documentazione sanitaria', 'ISEE (per le quote economiche)'],
    steps: ['Certificato medico telematico', 'Domanda con operatore', 'Visita di accertamento', 'Verbale e benefici'],
    time: '45 minuti',
    keywords: ['invalidità', 'legge 104', 'disabilità', 'handicap', 'accompagnamento', 'indennità di accompagnamento', 'permessi 104', 'familiare disabile', 'madre anziana', 'non autosufficiente', 'alzheimer'],
  },
  {
    id: 'assegno-unico', category: 'pat-invalidita', name: 'Assegno unico per i figli',
    simple: 'Un contributo mensile per ogni figlio, dal settimo mese di gravidanza fino ai 21 anni. L\'importo dipende dall\'ISEE.',
    who: 'Genitori con figli a carico (anche stranieri con requisiti di residenza/soggiorno).',
    docs: ['ISEE in corso di validità', 'Codici fiscali dei figli', 'IBAN', 'Titolo di soggiorno (se richiesto)'],
    steps: ['Fai l\'ISEE', 'Domanda online', 'Accredito mensile'],
    time: '20 minuti',
    keywords: ['assegno unico', 'figli', 'assegno figli', 'bonus figli', 'bambini', 'anf', 'assegno nucleo familiare'],
  },
  {
    id: 'inail', category: 'pat-invalidita', name: 'Infortuni INAIL',
    simple: 'Se ti fai male al lavoro o andando al lavoro, l\'INAIL copre cure e giorni di assenza, e in caso di danni permanenti una rendita.',
    who: 'Lavoratori infortunati o con malattia professionale.',
    docs: ['Certificato medico di infortunio', 'Dati del datore di lavoro', 'Testimonianze (se disponibili)'],
    steps: ['Denuncia infortunio', 'Pratica medico-legale', 'Eventuale rendita'],
    time: 'Da concordare',
    keywords: ['inail', 'infortunio', 'incidente lavoro', 'fatto male lavoro', 'malattia professionale', 'in itinere'],
  },
  {
    id: 'bonus-bebe', category: 'pat-invalidita', name: 'Bonus bebè / premio nascita',
    simple: 'Contributi per chi ha un bambino: un aiuto per le prime spese del neonato.',
    who: 'Neogenitori con ISEE entro le soglie.',
    docs: ['ISEE', 'Certificato di nascita o gravidanza'],
    steps: ['Verifica requisiti', 'Domanda', 'Accredito'],
    time: '20 minuti',
    keywords: ['bonus bebè', 'premio nascita', 'neonato', 'nato figlio'],
  },

  // ── Immigrazione ────────────────────────────────────────────
  {
    id: 'permesso', category: 'immigrazione', name: 'Permesso di soggiorno', mvp: true,
    simple: 'Il documento che ti permette di vivere e lavorare in Italia. Ti aiutiamo col kit, il rinnovo e a controllare lo stato.',
    who: 'Cittadini extra-UE che vivono in Italia.',
    docs: ['Passaporto', 'Permesso precedente (per rinnovo)', 'Fototessere', 'Contratto di lavoro / buste paga', 'Contratto di affitto o ospitalità', 'Marca da bollo'],
    steps: ['Preparazione kit con checklist', 'Invio all\'ufficio postale', 'Appuntamento in Questura', 'Ritiro del permesso'],
    time: '45 minuti + appuntamenti',
    keywords: ['permesso di soggiorno', 'rinnovo permesso', 'kit postale', 'questura', 'soggiorno', 'scade il permesso', 'documenti per stare in italia', 'visto'],
  },
  {
    id: 'carta-soggiorno', category: 'immigrazione', name: 'Carta di soggiorno UE',
    simple: 'Il permesso a tempo illimitato per chi vive in Italia da almeno 5 anni: più stabilità, meno rinnovi.',
    who: 'Cittadini extra-UE residenti da 5+ anni con reddito e alloggio adeguati.',
    docs: ['Permesso di soggiorno valido', 'Passaporto', 'Test di italiano A2 (se richiesto)', 'Documentazione reddito e alloggio', 'Certificato penale'],
    steps: ['Verifica dei 5 anni e del reddito', 'Test di italiano', 'Domanda in Questura', 'Ritiro carta'],
    time: 'Percorso dedicato',
    keywords: ['carta di soggiorno', 'lungo periodo', 'soggiorno illimitato', '5 anni in italia', 'residenza lungo periodo'],
  },
  {
    id: 'cittadinanza', category: 'immigrazione', name: 'Cittadinanza italiana',
    simple: 'Diventare cittadino italiano: verifichiamo i requisiti (anni di residenza, reddito, B1 di italiano) e prepariamo la domanda.',
    who: 'Residenti extra-UE da 10 anni (4 per UE, meno in casi particolari) con reddito e B1.',
    docs: ['Passaporto e permesso', 'Certificato penale del paese d\'origine', 'Atto di nascita tradotto e legalizzato', 'Certificazione B1 italiano', 'Documentazione reddito 3 anni'],
    steps: ['Verifica requisiti e anni di residenza', 'Raccolta certificati esteri', 'Domanda online al Ministero', 'Monitoraggio fino al giuramento'],
    time: 'Percorso dedicato',
    keywords: ['cittadinanza', 'cittadino italiano', 'passaporto italiano', 'diventare italiano', 'b1 italiano', 'giuramento'],
  },
  {
    id: 'ricongiungimento', category: 'immigrazione', name: 'Ricongiungimento familiare',
    simple: 'Portare in Italia il coniuge, i figli o i genitori a carico: nulla osta, visto e arrivo in famiglia.',
    who: 'Titolari di permesso valido con reddito e alloggio adeguati.',
    docs: ['Permesso di soggiorno', 'Certificati di stato di famiglia esteri', 'Documentazione reddito e alloggio', 'Passaporti dei familiari'],
    steps: ['Verifica requisiti', 'Domanda nulla osta', 'Visto familiare nel paese d\'origine', 'Ingresso e permesso in Italia'],
    time: 'Percorso dedicato',
    keywords: ['ricongiungimento', 'portare famiglia', 'marito all\'estero', 'moglie all\'estero', 'figli nel mio paese', 'genitori anziani estero', 'nulla osta', 'visto famiglia'],
  },
  {
    id: 'test-italiano', category: 'immigrazione', name: 'Test di italiano',
    simple: 'Per carta di soggiorno (A2) e cittadinanza (B1) serve una certificazione di italiano: ti prepariamo e prenotiamo il test.',
    who: 'Chi deve certificare l\'italiano per soggiorno o cittadinanza.',
    docs: ['Documento di identità', 'Permesso di soggiorno'],
    steps: ['Valutazione del livello', 'Preparazione con materiali semplici', 'Prenotazione test', 'Certificazione'],
    time: 'Su misura',
    keywords: ['test italiano', 'esame italiano', 'a2', 'b1', 'certificazione lingua', 'corso italiano'],
  },

  // ── Digitale ────────────────────────────────────────────────
  {
    id: 'spid-cie', category: 'digitale', name: 'Attivazione SPID / CIE',
    simple: 'SPID e CIE sono le chiavi dei servizi pubblici online. Te li attiviamo e ti insegniamo a usarli.',
    who: 'Tutti, dai 18 anni (SPID anche per i figli a carico in alcuni casi).',
    docs: ['Documento di identità valido', 'Tessera sanitaria / codice fiscale', 'Email e cellulare personali'],
    steps: ['Verifica documenti', 'Attivazione guidata', 'Prova di accesso insieme'],
    time: '20 minuti',
    keywords: ['spid', 'cie', 'carta identità elettronica', 'identità digitale', 'attivare spid', 'non riesco ad accedere', 'password spid'],
  },
  {
    id: 'aiuto-digitale', category: 'digitale', name: 'Aiuto col digitale',
    simple: 'Prenotazioni sanitarie, app IO, moduli online: se qualcosa sul telefono ti blocca, lo facciamo insieme.',
    who: 'Chiunque abbia bisogno di una mano con servizi online.',
    docs: ['Il tuo smartphone', 'Documento di identità'],
    steps: ['Raccontaci il problema', 'Lo risolviamo insieme', 'Ti lasciamo una guida semplice'],
    time: '15–30 minuti',
    keywords: ['aiuto', 'non so usare', 'prenotazione online', 'app io', 'fascicolo sanitario', 'modulo online', 'non ci riesco', 'telefono'],
  },
]

export function servicesByCategory(cat: CategoryId): Service[] {
  return SERVICES.filter((s) => s.category === cat)
}

export function getService(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id)
}
