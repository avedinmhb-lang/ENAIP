import { Exam } from '../types';

export const staticCilsExam: Exam = {
  id: 'cils_b1_cittadinanza_standard',
  title: 'CILS B1 - Modulo Cittadinanza (Official Paper)',
  isAiGenerated: false,
  difficulty: 'medium',
  listening: {
    title: 'Test di ascolto',
    instructions: 'Ascolta i testi registrati e rispondi alle domande. Tempo a disposizione: 30 minuti.',
    timeLimitMinutes: 30,
    prova1: {
      instructions: 'Ascolta i testi. Poi completa le frasi. Scegli una delle tre proposte di completamento. Alla fine del test di ascolto, DEVI SCRIVERE LE RISPOSTE NEL ‘FOGLIO DELLE RISPOSTE’.',
      audioTranscript: `Dialogo 1:
A: Buongiorno signore, sono venuto per l'intervista di lavoro per la posizione di fotografo naturalista per la vostra rivista di viaggi. Ho portato i miei ultimi scatti stampati.
B: Buongiorno signor Cavani, si accomodi pure. Ho visto il suo portfolio via e-mail ed è davvero eccellente. Mi dica, è pronto a viaggiare spesso?

Dialogo 2:
A: Mi scusi signore, sa se c'è un parcheggio pubblico qui vicino? Ho girato per venti minuti ma è tutto occupato, e ho una prenotazione al ristorante tra poco.
B: Ah sì, non si preoccupi. Se prosegue dritto per un centinaio di metri, subito dopo il semaforo a destra c'è un grande parcheggio coperto sotterraneo, di solito c'è sempre posto.

Dialogo 3:
A: Ramona, che ne dici se prima di andare al cinema stasera andiamo a mangiare una pizza veloce in quella nuova pizzeria all'angolo? Il film comincia alle nove e abbiamo tutto il tempo.
B: Ottima idea! Così possiamo chiacchierare un po' con calma e non dobbiamo aspettare la fine dello spettacolo per cenare.

Dialogo 4:
A: Pronto, comando dei Carabinieri di Milano, come posso aiutarla?
B: Salve, sono il signor Vlady. Vorrei denunciare un furto. Pochi minuti fa, mentre stavo facendo il biglietto alla cassa automatica della stazione, qualcuno ha rubato la mia valigia rossa che avevo lasciato per terra di fianco a me.

Dialogo 5:
A: Guarda che coda incredibile all'ingresso della cattedrale! C'è da aspettare almeno due ore sotto il sole.
B: È vero, fa troppo caldo. Sai che ti dico? Rinuncio alla visita per oggi. Preferisco andare a bere qualcosa di fresco e tornare domani mattina molto presto quando c'è meno gente.

Dialogo 6:
A: Ciao Giacomo, sono Beatrice. Volevo sapere se hai già preso i biglietti del treno per Palermo per venerdì prossimo, così inizio a fare i bagagli e mi organizzo per l'orario di partenza.
B: Ciao Beatrice! Sì, tranquilla, li ho acquistati ieri sera online. Partiamo alle quattordici e trenta.`,
      questions: [
        {
          id: 'l1_q1',
          text: '1. Il signor Cavani',
          type: 'multiple_choice',
          options: [
            'A) è a un colloquio di lavoro.',
            'B) è in vacanza con la moglie.',
            'C) ha vinto un concorso fotografico.'
          ],
          correctAnswer: 'A',
          explanation: 'Il signor Cavani si presenta per un\'intervista di lavoro come fotografo per una rivista.'
        },
        {
          id: 'l1_q2',
          text: '2. Il signore',
          type: 'multiple_choice',
          options: [
            'A) cerca un parcheggio vicino al ristorante.',
            'B) vuole prendere un taxi.',
            'C) riceve indicazioni stradali da un passante.'
          ],
          correctAnswer: 'C',
          explanation: 'Un passante indica al signore dove trovare un parcheggio coperto vicino al ristorante.'
        },
        {
          id: 'l1_q3',
          text: '3. Ramona propone di',
          type: 'multiple_choice',
          options: [
            'A) cenare prima di vedere il film.',
            'B) preparare la pizza in casa.',
            'C) andare al cinema il giorno dopo.'
          ],
          correctAnswer: 'A',
          explanation: 'Ramona propone di andare a mangiare una pizza prima dell\'inizio del film alle 21:00.'
        },
        {
          id: 'l1_q4',
          text: '4. Il signor Vlady telefona al comando dei Carabinieri per',
          type: 'multiple_choice',
          options: [
            'A) segnalare un incidente stradale.',
            'B) chiedere aiuto su come compilare un modulo.',
            'C) denunciare il furto della sua valigia.'
          ],
          correctAnswer: 'C',
          explanation: 'Il signor Vlady chiama per denunciare il furto della sua valigia rossa avvenuto alla stazione ferroviaria.'
        },
        {
          id: 'l1_q5',
          text: '5. Il turista decide di',
          type: 'multiple_choice',
          options: [
            'A) rinunciare alla visita alla cattedrale.',
            'B) acquistare un biglietto unico per tutta la famiglia.',
            'C) prenotare il giro del museo con la guida.'
          ],
          correctAnswer: 'A',
          explanation: 'A causa della lunga coda e del caldo, il turista decide di rinunciare alla visita e tornare il giorno successivo.'
        },
        {
          id: 'l1_q6',
          text: '6. Beatrice vuol sapere',
          type: 'multiple_choice',
          options: [
            'A) il costo dei biglietti per Palermo.',
            'B) se Giacomo ha già preso i biglietti.',
            'C) perché Giacomo non parte più.'
          ],
          correctAnswer: 'B',
          explanation: 'Beatrice telefona a Giacomo proprio per verificare se lui abbia già acquistato i biglietti del treno per Palermo.'
        }
      ]
    },
    prova2: {
      instructions: 'Ascolta i testi. Poi leggi le informazioni. Indica se le informazioni sono presenti (VERO) o non presenti (FALSO) nei testi che ascolti. Alla fine del test di ascolto, DEVI SCRIVERE LE RISPOSTE NEL ‘FOGLIO DELLE RISPOSTE’.',
      audioTranscript: `Testo A (Turismo in Puglia):
Gentili ascoltatori di Radio Italia, benvenuti! Nella puntata di oggi parliamo di viaggi e bellezze del nostro territorio. La splendida regione Puglia ha appena ricevuto un prestigioso premio internazionale come migliore destinazione turistica dell'anno per le sue meravigliose coste pulite e i borghi storici. Nonostante le difficoltà economiche generali, questa estate in Puglia il flusso turistico è aumentato in modo eccezionale, registrando un record storico di presenze. Per chi ama la quiete, la regione è piena di piccoli paesi tranquilli immersi nella campagna, tra uliveti secolari, dove ci si può rilassare lontano dallo stress cittadino. Inoltre, la Puglia offre un'ampia scelta di sistemazioni turistiche adatte a qualsiasi esigenza: dai lussuosi resort a cinque stelle alle caratteristiche masserie storiche, fino a campeggi confortevoli immersi nella macchia mediterranea.

Testo B (La storia di Chiara Burberi):
Secondo una recente indagine del Ministero dello Sviluppo Economico, in Italia le donne propongono progetti sempre più competitivi, creativi e interessanti in ambito lavorativo, portando un enorme contributo all'imprenditoria nazionale. Purtroppo, la stessa indagine rileva come le donne con bambini piccoli abbiano ancora oggi maggiori difficoltà a conciliare la vita familiare con il successo e la crescita nel lavoro. A questo proposito, oggi ospitiamo Chiara Burberi. Chiara, laureata con il massimo dei voti in Discipline Economiche e Sociali alla prestigiosa Università Bocconi di Milano, ha lavorato per molti anni nel settore bancario e della consulenza direzionale. Pur non avendo mai svolto l'attività di insegnante di matematica nelle scuole statali di Milano, ha fondato 'Redooc', un portale web interattivo per l'apprendimento delle materie scientifiche. Il suo sito si rivolge a tutti gli studenti che desiderano esercitarsi in matematica in modo innovativo e divertente.`,
      questions: [
        {
          id: 'l2_q1',
          text: '1. Il programma radiofonico riguarda la cucina tradizionale italiana.',
          type: 'true_false',
          correctAnswer: false,
          explanation: 'FALSO: Il programma radiofonico parla della Puglia in generale, del suo turismo e dei borghi, non di cucina tipica.'
        },
        {
          id: 'l2_q2',
          text: '2. Gli ascoltatori partecipano a un quiz e possono vincere un viaggio.',
          type: 'true_false',
          correctAnswer: false,
          explanation: 'FALSO: Nel testo non si menziona alcun quiz o estrazione di viaggi per gli ascoltatori.'
        },
        {
          id: 'l2_q3',
          text: '3. La regione Puglia ha ricevuto un importante premio.',
          type: 'true_false',
          correctAnswer: true,
          explanation: 'VERO: Il testo dice esplicitamente che ha ricevuto un prestigioso premio internazionale come migliore destinazione.'
        },
        {
          id: 'l2_q4',
          text: '4. Questa estate in Puglia è diminuito il numero dei turisti.',
          type: 'true_false',
          correctAnswer: false,
          explanation: 'FALSO: Il testo indica che questa estate il numero di turisti è aumentato in modo eccezionale.'
        },
        {
          id: 'l2_q5',
          text: '5. In Puglia ci sono paesi tranquilli dove ci si può rilassare.',
          type: 'true_false',
          correctAnswer: true,
          explanation: 'VERO: Il testo dice che ci sono paesi tranquilli immersi negli uliveti dove rilassarsi.'
        },
        {
          id: 'l2_q6',
          text: '6. La Puglia offre un’ampia scelta di sistemazioni turistiche.',
          type: 'true_false',
          correctAnswer: true,
          explanation: 'VERO: Viene descritta un\'ampia offerta che spazia dai lussuosi resort alle masserie e campeggi.'
        },
        {
          id: 'l2_q7',
          text: '7. Secondo una recente indagine le donne propongono progetti interessanti in ambito lavorativo.',
          type: 'true_false',
          correctAnswer: true,
          explanation: 'VERO: Secondo l\'indagine citata, le donne propongono progetti sempre più competitivi e interessanti.'
        },
        {
          id: 'l2_q8',
          text: '8. Le donne con bambini hanno più difficoltà ad avere successo nel lavoro.',
          type: 'true_false',
          correctAnswer: true,
          explanation: 'VERO: Il testo evidenzia la difficoltà delle madri nel conciliare la famiglia col successo lavorativo.'
        },
        {
          id: 'l2_q9',
          text: '9. Chiara Burberi ha una laurea in Ingegneria.',
          type: 'true_false',
          correctAnswer: false,
          explanation: 'FALSO: Chiara si è laureata in Discipline Economiche e Sociali alla Bocconi.'
        },
        {
          id: 'l2_q10',
          text: '10. Chiara Burberi ha insegnato matematica nelle scuole di Milano.',
          type: 'true_false',
          correctAnswer: false,
          explanation: 'FALSO: Il testo dice chiaramente che non ha mai svolto l\'attività di insegnante nelle scuole.'
        },
        {
          id: 'l2_q11',
          text: '11. Chiara Burberi ha lavorato all’Università Bocconi.',
          type: 'true_false',
          correctAnswer: false,
          explanation: 'FALSO: Chiara ha studiato e si è laureata alla Bocconi, ma ha lavorato nel settore bancario e della consulenza, non all\'università.'
        },
        {
          id: 'l2_q12',
          text: '12. Gli studenti che vogliono esercitarsi in matematica possono andare sul sito di Chiara Burberi.',
          type: 'true_false',
          correctAnswer: true,
          explanation: 'VERO: Il portale interattivo Redooc da lei fondato serve proprio per fare esercizi di matematica.'
        }
      ]
    }
  },
  reading: {
    title: 'Test di comprensione della lettura e riflessione grammaticale',
    instructions: 'Leggi i testi e rispondi alle domande di comprensione e di grammatica. Tempo a disposizione: 40 minuti.',
    timeLimitMinutes: 40,
    prova1: {
      title: 'Regione Toscana: ultime novità nell’ambito della mobilità pubblica',
      text: `Numero Verde per il trasporto pubblico locale
La Regione Toscana ha attivato il numero verde 800-570530 per i cittadini che usano il trasporto pubblico locale. Questo numero serve per comunicare problemi e cattivo funzionamento del trasporto pubblico all’interno della Regione Toscana, per presentare segnalazioni e suggerimenti su autobus urbani, extraurbani, treni regionali e collegamenti via mare. I cittadini possono contattare il numero verde dalle 8:00 alle 18:00 dal lunedì al venerdì. Il numero verde raccoglie la segnalazione e la trasmette sia all’azienda che offre il servizio sia all’ente competente, per trovare una soluzione al problema. Dopo la segnalazione al numero verde, il cittadino riceve una comunicazione che spiega le cause del problema e le possibili soluzioni.

Sito internet “Muoversi in Toscana”
La Regione Toscana ha messo delle telecamere nelle zone della città con maggiore traffico. Grazie a queste telecamere il cittadino può guardare le immagini direttamente sul sito internet “Muoversi in Toscana” o sulla relativa App.
Con questo nuovo servizio è possibile avere un quadro chiaro e preciso del traffico stradale. Basta navigare online nella mappa della Toscana e cliccare sulle webcam per vedere le immagini del traffico in tempo reale sulle strade regionali. Tutti, con un semplice clic, possono quindi vedere in anticipo la situazione delle strade che devono percorrere.
Le novità di “Muoversi in Toscana” non riguardano solo il traffico urbano, ma anche quello in mare: grazie alla collaborazione con l’Autorità Portuale di Livorno è possibile consultare su internet gli orari di arrivi e partenze dal Porto di Livorno.`,
      questions: [
        {
          id: 'r1_q1',
          text: '1. La Regione Toscana vuole migliorare i servizi online per i cittadini e i turisti.',
          type: 'true_false',
          correctAnswer: true,
          explanation: 'VERO: Attivando webcam, sito internet, app e monitoraggio del porto, la regione punta a potenziare i servizi informativi digitali.'
        },
        {
          id: 'r1_q2',
          text: '2. Attraverso un numero verde i cittadini possono segnalare difficoltà, chiedere informazioni, dare consigli sui trasporti pubblici.',
          type: 'true_false',
          correctAnswer: true,
          explanation: 'VERO: Il numero verde raccoglie segnalazioni di malfunzionamenti, problemi e suggerimenti su bus, treni e navi.'
        },
        {
          id: 'r1_q3',
          text: '3. L’attivazione del numero verde ha lo scopo di limitare i danni ai viaggiatori nell’ambito del trasporto locale.',
          type: 'true_false',
          correctAnswer: false,
          explanation: 'FALSO: Lo scopo indicato è raccogliere segnalazioni e suggerimenti per risolverli, non limitare i danni monetari o legali.'
        },
        {
          id: 'r1_q4',
          text: '4. Il numero verde 800-570530 non è attivo il sabato e la domenica.',
          type: 'true_false',
          correctAnswer: true,
          explanation: 'VERO: Il testo specifica che il servizio è attivo solo dal lunedì al venerdì.'
        },
        {
          id: 'r1_q5',
          text: '5. Se il numero verde riceve una telefonata di protesta su un servizio deve informare la ditta responsabile di quel servizio.',
          type: 'true_false',
          correctAnswer: true,
          explanation: 'VERO: La segnalazione viene trasmessa all\'azienda che offre il servizio e all\'ente competente.'
        },
        {
          id: 'r1_q6',
          text: '6. In particolari situazioni di emergenza il numero verde può avvertire l’Amministrazione regionale.',
          type: 'true_false',
          correctAnswer: false,
          explanation: 'FALSO: Il testo non parla di procedure speciali di emergenza o di contatti speciali verso l\'amministrazione.'
        },
        {
          id: 'r1_q7',
          text: '7. Chi telefona al numero verde può sapere che cosa ha causato un particolare problema.',
          type: 'true_false',
          correctAnswer: true,
          explanation: 'VERO: Il cittadino riceve successivamente una comunicazione con la spiegazione delle cause e le soluzioni.'
        },
        {
          id: 'r1_q8',
          text: '8. La Regione Toscana ha posizionato nuovi semafori per regolare il traffico.',
          type: 'true_false',
          correctAnswer: false,
          explanation: 'FALSO: La regione ha posizionato telecamere (webcam) per monitorare il traffico, non semafori.'
        },
        {
          id: 'r1_q9',
          text: '9. Sul sito della Regione Toscana è possibile segnalare interruzioni e incidenti stradali.',
          type: 'true_false',
          correctAnswer: false,
          explanation: 'FALSO: Sul sito si possono guardare le webcam e consultare orari, non è indicato che i cittadini possano inserire segnalazioni di incidenti lì.'
        },
        {
          id: 'r1_q10',
          text: '10. L’Autorità Portuale di Livorno ha messo online gli orari dei traghetti che partono o arrivano a Livorno.',
          type: 'true_false',
          correctAnswer: true,
          explanation: 'VERO: Grazie alla collaborazione con l\'Autorità Portuale di Livorno, gli orari del porto sono consultabili online.'
        },
        {
          id: 'r1_q11',
          text: '11. La Regine Toscana vuole pubblicare sul sito le informazioni sui voli in arrivo o in partenza dagli aeroporti toscani.',
          type: 'true_false',
          correctAnswer: false,
          explanation: 'FALSO: Nel testo non si menzionano in alcun modo gli aeroporti o i voli aerei.'
        },
        {
          id: 'r1_q12',
          text: '12. La Regione Toscana ha intenzione di potenziare il servizio di autobus che collegano Firenze al Porto di Livorno.',
          type: 'true_false',
          correctAnswer: false,
          explanation: 'FALSO: Questa intenzione non è minimamente indicata nel testo fornito.'
        }
      ]
    },
    prova2: {
      title: 'Lo sport torna in piazza',
      textWithGaps: `Venerdì 1 e sabato 2 marzo ritorna l’(0) __A__ “Sport in Piazza”. Pilates, yoga, step, gag, total body, stretching sono alcune tra le tante (1) ______ che si possono fare grazie al progetto “Sport in Piazza”.

Questo appuntamento ha due obiettivi importanti: la salute e un percorso culturale per coinvolgere non solo i giovani e gli appassionati di sport, ma (2) ______ le persone adulte, gli anziani e i bambini.

Le due giornate dedicate al benessere (3) ______ si svolgono in Piazza della Costituzione (4) ______ inizio venerdì 1 marzo, dalle ore 15:00 alle ore 19:00.

Il programma di venerdì prevede:
• dalle 15:00 alle 17:30: pilates, gag, circuit training, ginnastica posturale, step;
• dalle 18:00 alle 19:00: yoga flex, zumba, stretching, total body.

La giornata di sabato prevede:
• ore 10:00: risveglio muscolare, tonificazione;
• dalle 11:00 alle 12:30: yoga, step, postural workout, zumba;
• dalle 16:00 alle 18:00: stretching, gag, pilates, zumba, tonificazione.

Sabato alle ore 19:10 c’è la corsa a piedi per principianti “The Selfie Run” dove i partecipanti si divertono a farsi dei selfie. Alle ore 20:30 ha inizio l’evento musicale “Music & Fun” con DJ Osso di M2O. Nella serata è possibile vedere le foto che i partecipanti (5) ______ durante la corsa.

L’ingresso alle lezioni è gratuito. (6) ______ possono provare le varie discipline e gli istruttori sono a disposizione per seguire i vari gruppi.

Non è necessaria la prenotazione, è sufficiente iscriversi al momento.`,
      questions: [
        {
          id: 'r2_q0',
          text: 'Gap (0) [Esempio]',
          type: 'cloze',
          options: ['A) iniziativa', 'B) idea', 'C) azione'],
          correctAnswer: 'A',
          explanation: 'Ritorna l\'iniziativa "Sport in Piazza".'
        },
        {
          id: 'r2_q1',
          text: 'Gap (1)',
          type: 'cloze',
          options: ['A) funzioni', 'B) attività', 'C) occupazioni'],
          correctAnswer: 'B',
          explanation: 'Pilates, yoga, ecc. sono alcune delle molte "attività" sportive che si possono fare.'
        },
        {
          id: 'r2_q2',
          text: 'Gap (2)',
          type: 'cloze',
          options: ['A) anche', 'B) ancora', 'C) infine'],
          correctAnswer: 'A',
          explanation: 'La congiunzione correlativa "non solo... ma anche..." esprime un\'aggiunta.'
        },
        {
          id: 'r2_q3',
          text: 'Gap (3)',
          type: 'cloze',
          options: ['A) materiale', 'B) reale', 'C) fisico'],
          correctAnswer: 'C',
          explanation: 'Si parla di "benessere fisico" in relazione allo sport e alle attività ginniche.'
        },
        {
          id: 'r2_q4',
          text: 'Gap (4)',
          type: 'cloze',
          options: ['A) con', 'B) di', 'C) su'],
          correctAnswer: 'A',
          explanation: 'La preposizione corretta è "con", a formare la locuzione "con inizio venerdì".'
        },
        {
          id: 'r2_q5',
          text: 'Gap (5)',
          type: 'cloze',
          options: ['A) farebbero', 'B) facevano', 'C) hanno fatto'],
          correctAnswer: 'C',
          explanation: 'Si usa il passato prossimo "hanno fatto" per riferirsi a foto completate precedentemente durante la corsa.'
        },
        {
          id: 'r2_q6',
          text: 'Gap (6)',
          type: 'cloze',
          options: ['A) tutti', 'B) questi', 'C) molti'],
          correctAnswer: 'A',
          explanation: '"Tutti" esprime l\'universalità del pubblico che può partecipare, rafforzata dal fatto che l\'ingresso sia gratuito.'
        }
      ]
    }
  },
  writing: {
    title: 'Test di produzione scritta',
    instructions: 'Scrivi un testo basato sul tema proposto. Fai attenzione al numero di parole richiesto. Tempo a disposizione: 40 minuti.',
    timeLimitMinutes: 40,
    prompt: 'Sei arrivato in Italia da qualche tempo e desideri richiedere la cittadinanza italiana. Scrivi una lettera amichevole o una e-mail a un amico o amica italiana (circa 80-120 parole) spiegando:\n1) Da quanto tempo vivi in Italia e in quale città abiti.\n2) Qual è la tua occupazione attuale o cosa stai studiando.\n3) Quali sono i motivi principali per cui ami l\'Italia e desideri ottenere la cittadinanza.',
    minWords: 80,
    maxWords: 120
  },
  speaking: {
    title: 'Test di produzione orale',
    instructions: 'Scegli una delle due prove per registrare o digitare il tuo discorso. Tempo a disposizione: 10 minuti di riflessione e 3 minuti di registrazione.',
    timeLimitMinutes: 10,
    prova1RoleplayPrompt: 'Prova 1 (Interazione): Sei in un ufficio comunale italiano per richiedere informazioni sui documenti necessari per la cittadinanza. Interagisci con l\'operatore (l\'IA) chiedendo i dettagli sul modulo, la marca da bollo e i tempi di attesa.',
    prova2MonologuePrompt: 'Prova 2 (Monologo): Parla di te stesso, della tua famiglia, del tuo lavoro e di come ti sei integrato nella comunità della tua città in Italia. Spiega perché questa tappa è importante per il tuo futuro.'
  }
};
