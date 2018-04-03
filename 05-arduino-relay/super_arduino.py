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
import unicodedata

import aiy.audio
import aiy.cloudspeech
import aiy.voicehat

from pyfirmata import Arduino, util

def get_voice_command(recognizer):
    print('Listening...')
    text = recognizer.recognize()
    return text

def main():

    board = Arduino("/dev/ttyACM0")

    # Relays
    relay1 = 7
    relay2 = 5
    relay3 = 6
    relay4 = 4

    aiy.i18n.set_language_code('es-ES')
    recognizer = aiy.cloudspeech.get_recognizer()
    recognizer.expect_phrase(u'sube persiana')
    recognizer.expect_phrase(u'baja persiana')
    recognizer.expect_phrase(u'enciende luz')
    recognizer.expect_phrase(u'apaga luz')

    led = aiy.voicehat.get_led()
    aiy.audio.get_recorder().start()

    while True:

        led.set_state(aiy.voicehat.LED.ON)
        text = get_voice_command(recognizer)

        if text is None:
            print(u'Sorry, I did not hear you.')
        else:
            print(u'You said "', text, '"')

            if u'sube persiana' in text:
                board.digital[relay2].write(1)

            if u'baja persiana' in text:
                board.digital[relay2].write(0)

            if u'enciende luz' in text:
                board.digital[relay1].write(1)

            if u'apaga luz' in text:
                board.digital[relay1].write(0)

            elif 'adios' in text:
                aiy.audio.get_recorder().stop()
                break

    led.set_state(aiy.voicehat.LED.OFF)


if __name__ == '__main__':
    main()
