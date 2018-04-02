#!/usr/bin/python
import time

from pyfirmata import Arduino, util
board = Arduino("/dev/ttyACM0")

pin = 13

print 'Led On'
board.digital[pin].write(1)
time.sleep(2)
print 'Led Off'
board.digital[pin].write(0)
