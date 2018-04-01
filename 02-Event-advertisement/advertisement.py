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

"""A demo of the Google CloudSpeech recognizer."""

import aiy.audio
import aiy.cloudspeech
import aiy.voicehat
import time


def main():
    aiy.i18n.set_language_code('es-ES')
    recognizer = aiy.cloudspeech.get_recognizer()
    recognizer.expect_phrase('Me puedes encontrar un plan para después de Semana Santa')
    recognizer.expect_phrase('Que es el GDG Ourense')
    recognizer.expect_phrase('Cuando dices que es la charla')
    recognizer.expect_phrase('Me lo puedes repetir')
    recognizer.expect_phrase('adios')

    led = aiy.voicehat.get_led()
    aiy.audio.get_recorder().start()

    while True:
        print('Listening...')
        led.set_state(aiy.voicehat.LED.BLINK)
        text = recognizer.recognize()
        if text is None:
            aiy.audio.say(u'No te he entendido bien, puedes repetir?')
            print(u'Sorry, I did not hear you.')
        else:
            print(u'You said "', text, '"')
            if 'hoy' in text:
                led.set_state(aiy.voicehat.LED.ON)
                aiy.audio.say(u'Yo siempre estoy bien, soy un robot, no lo recuerdas?')
            if 'Semana Santa' in text:
                led.set_state(aiy.voicehat.LED.ON)
                aiy.audio.say(u'Dejame buscar que planes hay en Ourense...')
                led.set_state(aiy.voicehat.LED.BLINK)
                time.sleep(2)
                led.set_state(aiy.voicehat.LED.ON)
                aiy.audio.say(u'El GDG Ourense organiza una charla el dia 2 de Abril sobre interfaces de voz.')
                aiy.audio.say(u'Creo que deberias ir, tiene buena pinta.')
            elif 'Ourense' in text:
                led.set_state(aiy.voicehat.LED.ON)
                aiy.audio.say(u'Es el Grupo de Desarrolladores de Google de Ourense, organizan una charla una vez al mes.')
            elif 'cuando' in text or 'repetir' in text:
                led.set_state(aiy.voicehat.LED.ON)
                if 'repetir' in text:
                    aiy.audio.say(u'Madre mia... no se que voy a hacer contigo.')
                    aiy.audio.say(u'Apunta')
                aiy.audio.say(u'Dia 2 de Abril a las 8 de la tarde en Magma espacio')
            elif 'adios' in text:
                led.set_state(aiy.voicehat.LED.BLINK)
                aiy.audio.say(u'AAADIOS')
                break
            led.set_state(aiy.voicehat.LED.OFF)


if __name__ == '__main__':
    main()
