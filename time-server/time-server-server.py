from socket import *
import datetime

s = socket(AF_INET, SOCK_STREAM)
s.bind(("LocalHost", 12345))
s.listen(1)

while True:
    c, addr = s.accept()
    print("Connection from: ", addr)
    c.send(str(datetime.datetime.now()).encode("utf-8"))
    c.close()
