'use strict';
const functions = require('firebase-functions'); // Cloud Functions for Firebase library
const DialogflowApp= require('actions-on-google').DialogflowApp; // Google Assistant helper library

const dummyData = {
  "meetups": [
    {
      "manual_attendance_count": 46,
      "link": "https://www.meetup.com/gdgourense/events/247831247/",
      "name": "GDG Talk11# Progressive Web Apps are here to stay!",
      "time": 1.5203628E12,
      "id": "247831247",
      "yes_rsvp_count": 50,
      "status": "past"
    },
    {
      "manual_attendance_count": 31,
      "link": "https://www.meetup.com/gdgourense/events/246937053/",
      "name": "GDG Talk10# Automatiza tus servidores con ANSIBLE",
      "time": 1.5173388E12,
      "id": "246937053",
      "yes_rsvp_count": 36,
      "status": "past"
    },
    {
      "manual_attendance_count": 38,
      "link": "https://www.meetup.com/gdgourense/events/244931979/",
      "name": "GDG Talk9# Introducción a Inteligencia Artificial",
      "time": 1.5138828E12,
      "id": "244931979",
      "yes_rsvp_count": 40,
      "status": "past"
    },
    {
      "manual_attendance_count": 15,
      "link": "https://www.meetup.com/gdgourense/events/244931931/",
      "name": "GDG Talk8# Impresión 3D",
      "time": 1.5120684E12,
      "id": "244931931",
      "yes_rsvp_count": 19,
      "status": "past"
    },
    {
      "manual_attendance_count": 19,
      "link": "https://www.meetup.com/gdgourense/events/244496806/",
      "name": "GDG Talk7# Creación de APIs REST con NodeJS",
      "time": 1.5097338E12,
      "id": "244496806",
      "yes_rsvp_count": 21,
      "status": "past"
    },
    {
      "manual_attendance_count": 14,
      "link": "https://www.meetup.com/gdgourense/events/243455620/",
      "name": "GDG Talk6# Scraping de contenidos e integración en Drupal 8",
      "time": 1.5064488E12,
      "id": "243455620",
      "yes_rsvp_count": 15,
      "status": "past"
    },
    {
      "manual_attendance_count": 13,
      "link": "https://www.meetup.com/gdgourense/events/241543375/",
      "name": "GDG Talk5# Introducción a MeteorJS",
      "time": 1.5004008E12,
      "id": "241543375",
      "yes_rsvp_count": 16,
      "status": "past"
    },
    {
      "manual_attendance_count": 33,
      "link": "https://www.meetup.com/gdgourense/events/240752315/",
      "name": "GDG Talk 4# Videojuegos hoy en día",
      "time": 1.4985864E12,
      "id": "240752315",
      "yes_rsvp_count": 35,
      "status": "past"
    },
    {
      "manual_attendance_count": 17,
      "link": "https://www.meetup.com/gdgourense/events/239334435/",
      "name": "I/O Extended 2017 Ourense",
      "time": 1.4950332E12,
      "id": "239334435",
      "yes_rsvp_count": 22,
      "status": "past"
    },
    {
      "manual_attendance_count": 32,
      "link": "https://www.meetup.com/gdgourense/events/238853790/",
      "name": "GDG Talk 3# Your arsenal in Node",
      "time": 1.4931432E12,
      "id": "238853790",
      "yes_rsvp_count": 35,
      "status": "past"
    },
    {
      "manual_attendance_count": 29,
      "link": "https://www.meetup.com/gdgourense/events/238235203/",
      "name": "GDG Talk 2# ¿Qué es un programador ágil? y un poco de Polymer",
      "time": 1.490724E12,
      "id": "238235203",
      "yes_rsvp_count": 34,
      "status": "past"
    },
    {
      "manual_attendance_count": 18,
      "link": "https://www.meetup.com/gdgourense/events/237696766/",
      "name": "Introducción a virtualiazación de datacenters",
      "time": 1.4878764E12,
      "id": "237696766",
      "yes_rsvp_count": 20,
      "status": "past"
    },
    {
      "link": "https://www.meetup.com/gdgourense/events/249031594/",
      "name": "GDG Talk12# Interfaces por voz con Google Assistant y Voice Kit",
      "time": 1.522692E12,
      "id": "249031594",
      "yes_rsvp_count": 33,
      "status": "upcoming"
    },
    {
      "link": "https://www.meetup.com/gdgourense/events/249257281/",
      "name": "I/O Extended 2018 Ourense",
      "time": 1.5257952E12,
      "id": "249257281",
      "yes_rsvp_count": 2,
      "status": "upcoming"
    }
  ],
  "conferences": [
    {
      "manual_attendance_count": 172,
      "link": "https://www.meetup.com/gdgourense/events/237686246/",
      "name": "High School Developers Parade #Ourense",
      "time": 1.4877504E12,
      "id": "237686246",
      "yes_rsvp_count": 197,
      "status": "past"
    }
  ],
  "members": 468
};

// the actions we are supporting (get them from intents)
const ACTION_PEOPLE_AMOUNT = 'peopleAmount';
const ACTION_PAST_EVENTS = 'pastEvents';
const ACTION_NEXT_EVENTS = 'nextEvents';


const gdgourense = (req, res) => {
  const assistant = new DialogflowApp({request: req, response: res});
  console.log('gdgourense Request headers: ' + JSON.stringify(req.headers));
  console.log('gdgourense Request body: ' + JSON.stringify(req.body));

  function nextEventsHandler (assistant) {
      const events = dummyData.meetups.filter(meetup => meetup.status !== 'past');
      const assistants = events.reduce(function(sum, meetup) {
        return sum + meetup.yes_rsvp_count;
      }, 0);
      let msg = '';

      console.log(events, assistants);

      if (!events || events.length === 0) {
          msg += 'No hay próximos eventos programados.';
          assistant.tell(msg);
      } else {
          msg = 'El grupo tiene programado ' + events.length + ' meetups. De momento hay ' + assistants + ' personas apuntadas.\n';
          msg += events.length > 1 ? 'Los próximos eventos son:\n' : 'El próximo evento es:\n';
          msg += events.map(meetup => 'Meetup: ' + meetup.name).join('.\n')
          msg += '\nSi te apetece ir, me daría prisa.';
          assistant.tell(msg);
      }
  }

  function pastEventsHandler (assistant) {
      const events = dummyData.meetups.filter(meetup => meetup.status === 'past');
      const assistants = events.reduce(function(sum, meetup) {
      console.log(meetup);
        return sum + meetup.manual_attendance_count;
      }, 0);

      console.log(assistants);

      const msg = 'El grupo ha celebrado ' + events.length + ' meetups a los que han asistido ' + assistants + ' personas.';
      assistant.tell(msg);
  }

  // Fulfill peopleAmount action business logic
  function peopleAmountHandler (assistant) {
      const number = assistant.getArgument('number');
      let msg = '';
      if (number && (typeof number === 'number') ) {
          if (number < (dummyData.members/2)) {
              msg += 'Muchos más!! ';
          } else if (number > 400 && number < dummyData.members) {
              msg += 'Casi! ';
          } else if (number < dummyData.members) {
              msg += 'Más! ';
          } else {
              msg += 'Algunos menos! ';
          }
      }
      msg += 'El grupo tiene ' + dummyData.members + ' miembros.';
      console.log(msg);
      assistant.tell(msg);
  }

  // The Entry point to all our actions
  const actionMap = new Map();
  actionMap.set(ACTION_PEOPLE_AMOUNT, peopleAmountHandler);
  actionMap.set(ACTION_PAST_EVENTS, pastEventsHandler);
  actionMap.set(ACTION_NEXT_EVENTS, nextEventsHandler);

  assistant.handleRequest(actionMap);
};

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(gdgourense);
