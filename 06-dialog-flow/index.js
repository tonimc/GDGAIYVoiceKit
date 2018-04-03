'use strict';
const functions = require('firebase-functions'); // Cloud Functions for Firebase library
const DialogflowApp= require('actions-on-google').DialogflowApp; // Google Assistant helper library

const dummyData = undefined; // Get from data.json file

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
