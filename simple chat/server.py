from socket import *

host = "LocalHost"
port = 59000
s = socket(AF_INET, SOCK_STREAM)
s.bind((host, port))
s.listen()
c, addr = s.accept()
print("connected to: ", addr)
while True:
    try:
        msg = c.recv(500).decode("utf-8")
        print("Client: ", msg)
        c.send(input("Server: ").encode("utf-8"))
    except KeyboardInterrupt:
        print("user stop")

