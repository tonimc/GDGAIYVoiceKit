#!/usr/bin/env python3
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import os
import logging

import aiy.audio
import aiy.cloudspeech
import aiy.voicehat

from socketIO_client_nexus import SocketIO, LoggingNamespace

SOCKET_IP_ADDR = '192.168.13.18'
SOCKET_PORT = 3000

def on_connect():
    print('connect')

def on_disconnect():
    print('disconnect')

def on_reconnect():
    print('reconnect')


def websocket_config():
    socket = SocketIO(SOCKET_IP_ADDR, SOCKET_PORT, LoggingNamespace)
    socket.on('connect', on_connect)
    socket.on('disconnect', on_disconnect)
    socket.on('reconnect', on_reconnect)

    logging.getLogger('socketIO-client').setLevel(logging.DEBUG)
    logging.basicConfig()
    return socket


def get_voice_command(recognizer):
    print('Listening...')
    text = recognizer.recognize()
    return text


def send_ws_msg(socket, text):
    print(u'SEND TO SOCKET: ', text)
    socket.emit('msg', text)


def play_stranger_things_music():
    # File downloaded from https://www.looperman.com/loops/detail/120883/stranger-things-bass-by-dokfraktal-free-82bpm-cinematic-bass-synth-loop
    aiy.voicehat.get_led().set_state(aiy.voicehat.LED.BLINK)
    aiy.audio.play_wave(os.path.abspath('./looperman-l-1199946-0120883-dokfraktal-stranger-bass.wav'))


def main():
    socket = websocket_config()

    aiy.i18n.set_language_code('es-ES')
    recognizer = aiy.cloudspeech.get_recognizer()
    recognizer.expect_phrase(u'hay alguien ahí')
    recognizer.expect_phrase(u'quién eres')

    led = aiy.voicehat.get_led()
    play_stranger_things_music()
    aiy.audio.get_recorder().start()

    while True:

        led.set_state(aiy.voicehat.LED.ON)
        text = get_voice_command(recognizer)

        if text is None:
            print(u'Sorry, I did not hear you.')
        else:
            print(u'You said "', text, '"')

            if u'hay alguien ahí' in text:
                print(u'SEND TO SOCKET: SI ')
                send_ws_msg(socket, u'SI')
                led.set_state(aiy.voicehat.LED.BLINK)

            if u'quién eres' in text:
                print(u'SEND TO SOCKET: GDGOURENSE ')
                send_ws_msg(socket, u'GDGOURENSE')
                led.set_state(aiy.voicehat.LED.BLINK)

            elif 'adios' in text:
                break

    led.set_state(aiy.voicehat.LED.OFF)


if __name__ == '__main__':
    main()
