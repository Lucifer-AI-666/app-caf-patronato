# 08 — Assistente IA cognitivo

> La finestra intelligente dell'app: un assistente che capisce la tua situazione, parla la tua lingua e ti porta al servizio giusto. Come un amico esperto che ti accompagna per mano nella burocrazia italiana.

## Il problema che risolve

Una persona straniera (ma anche tanti italiani) spesso **non sa quale servizio le serve**. Non conosce i nomi — ISEE, NASpI, DSU, totalizzazione — conosce solo il suo problema: *"ho perso il lavoro"*, *"mia madre è anziana e non cammina più"*, *"devo rinnovare il permesso di soggiorno"*.

L'Assistente IA trasforma il problema raccontato con parole semplici nel servizio giusto, con la lista dei documenti e i passi da fare.

## Come funziona

```
L'utente racconta la sua situazione (scrivendo o parlando, nella sua lingua)
        ↓
L'IA capisce il bisogno e propone i servizi su misura
        ↓
Spiega con parole semplici: cos'è, a chi spetta, cosa serve
        ↓
Genera la checklist personalizzata e accompagna passo passo
        ↓
Se serve, passa la mano a un operatore umano (con il contesto già pronto)
```

### Esempio

> **Utente:** «Salve, sono marocchina, lavoravo come badante ma la signora è morta e sono senza lavoro. Ho due figli piccoli.»
>
> **Assistente:** «Mi dispiace per questo momento difficile. Ti posso aiutare con tre cose:
> 1. **NASpI** — un sussidio di disoccupazione, perché hai perso il lavoro senza colpa tua
> 2. **Assegno unico** — un contributo mensile per i tuoi figli
> 3. **ISEE** — ti serve per accedere a bonus e agevolazioni
>
> Vuoi che iniziamo dalla NASpI? Ci vogliono questi documenti: …»

## Capacità

| Capacità | Descrizione |
|---|---|
| **Service matching** | Dal racconto dell'utente ai servizi giusti del catalogo |
| **Multilingua nativa** | L'utente parla/scrive nella sua lingua; le pratiche restano in italiano |
| **Voce** | Input vocale per chi fatica a scrivere |
| **Spiegazione documenti** | Fotografa un documento → l'IA lo spiega in parole semplici e nella tua lingua |
| **Checklist personalizzata** | Documenti necessari in base al caso specifico |
| **Compilazione assistita** | Pre-compila i moduli con i dati noti, chiede solo ciò che manca |
| **Promemoria proattivi** | «Il tuo permesso di soggiorno scade tra 60 giorni, iniziamo il rinnovo?» |
| **Handoff umano** | Quando il caso è complesso, trasferisce a un operatore con riepilogo già pronto |

## Principi di design

- **Linguaggio semplice**: livello B1 o inferiore, zero gergo burocratico
- **Nessuna domanda inutile**: l'IA riusa i dati già presenti nel profilo
- **Trasparenza**: l'utente sa sempre che sta parlando con un'IA
- **L'operatore resta centrale**: l'IA assiste, le pratiche le chiudono gli operatori
- **Offline-friendly**: le guide principali disponibili anche senza connessione

## Privacy e limiti

- Consenso esplicito prima di usare dati personali nelle conversazioni
- Dati trattati in conformità GDPR, preferenza per modelli ospitati in UE
- L'IA **non invia pratiche** e **non firma documenti**: suggerisce e assiste
- Risposte basate solo sul catalogo servizi e su fonti ufficiali (RAG controllato), con link alle fonti
- Risposta onesta quando non sa: «Non sono sicura, ti metto in contatto con un operatore»

## Note tecniche (proposta)

- LLM con **RAG** su: catalogo servizi, guide ufficiali (INPS, Agenzia delle Entrate, Ministero dell'Interno), FAQ interne
- Guardrails: blocco su consulenza legale/medica vincolante, escalation automatica su casi sensibili
- Valutazione continua: dataset di test multilingua con casi reali (anonimizzati)
- Metriche: % match corretto, % completamento pratica dopo assistenza, soddisfazione utente
