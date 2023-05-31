from socket import *

host = "LocalHost"
port = 59000
s = socket(AF_INET, SOCK_STREAM)
s.connect((host, port))
while True:
    s.send(input("Client: ").encode("utf-8"))
    msg = s.recv(500).decode("utf-8")
    print("Server: ", msg)

