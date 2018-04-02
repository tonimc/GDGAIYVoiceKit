#!/usr/bin/python
import time

from pyfirmata import Arduino, util
board = Arduino("/dev/ttyACM0")

# Relays are 4, 5, 6 and 7
relay1 = 4

print 'Relay 1 On'
board.digital[relay1].write(1)
time.sleep(2)
print 'Relay 1 Off'
board.digital[relay1].write(0)
