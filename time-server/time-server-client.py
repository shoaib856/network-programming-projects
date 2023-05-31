from socket import *

s = socket(AF_INET, SOCK_STREAM)

s.connect(("LocalHost",12345))

try:
    msg = s.recv(1024)
    print("Received: ",msg.decode("utf-8"))
except Exception as e:
    print("Error: ",e)
finally:
    s.close()