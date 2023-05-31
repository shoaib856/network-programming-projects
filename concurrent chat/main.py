from socket import *
from threading import *

s = socket(AF_INET, SOCK_STREAM)
s.connect(("LocalHost", 59000))
alias = input("choose alias name ====> ")
def client_receive():
    while True:
        try:
            msg = s.recv(1024).decode("utf-8")
            if msg == "alias?":
                s.send(alias.encode("utf-8"))
            else:
                print(msg)
        except:
            print("Error!")
            s.close()
            break

def client_send():
    while True:
        msg = f'{alias}: {input("")}'
        s.send(msg.encode('utf-8'))


receive_thread = Thread(target=client_receive)
receive_thread.start()

send_thread = Thread(target=client_send)
send_thread.start()


