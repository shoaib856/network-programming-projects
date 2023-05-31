from socket import *
from threading import *

s = socket(AF_INET, SOCK_STREAM)
s.bind(("LocalHost", 59000))
s.listen()
aliases = []
clients = []


def broadcast(msg):
    for client in clients:
        client.send(msg)


def handle_client(client):
    while True:
        try:
            msg = client.recv(1024)
            broadcast(msg)
        except:
            i = clients.index(client)
            clients.remove(client)
            client.close()
            broadcast(f"{aliases[i]} leave chat room!".encode("utf-8"))
            aliases.remove(aliases[i])
            break


def receive():
    while True:
        print("server running...")
        c, addr = s.accept()
        print(f"connected to {addr}")
        c.send("alias?".encode("utf-8"))
        alias = c.recv(1024).decode("utf-8")
        aliases.append(alias)
        clients.append(c)
        broadcast(f"{alias} joined the room!".encode("utf-8"))
        c.send("your now connected".encode("utf-8"))
        thread = Thread(target=handle_client, args=(c,))
        thread.start()


if __name__ == '__main__':
    receive()
