from abc import ABC, abstractmethod
from collections import deque

class BankConfig:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.currency = "ETB"
            cls._instance.min_balance = 100
        return cls._instance

class Account(ABC):
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
        self.observers = []
    
    def attach(self, observer):
        self.observers.append(observer)
    
    def notify(self):
        for obs in self.observers:
            obs.update(self)
    
    @abstractmethod
    def get_type(self):
        pass
    
    def deposit(self, amount):
        if amount > 0:
            self.balance += amount
            self.notify()
            print(f"Deposited {amount} {BankConfig().currency}")
    
    def withdraw(self, amount):
        if amount > 0 and self.balance >= amount + BankConfig().min_balance:
            self.balance -= amount
            self.notify()
            print(f"Withdrawn {amount} {BankConfig().currency}")
        else:
            print("Not enough balance or below minimum!")

class SavingsAccount(Account):
    def get_type(self):
        return "Savings Account"

class CheckingAccount(Account):
    def get_type(self):
        return "Checking Account"

class AccountRegistory:
    @staticmethod
    def create(type_name, owner, balance=0):
        if type_name == "savings":
            return SavingsAccount(owner, balance)
        elif type_name == "checking":
            return CheckingAccount(owner, balance)
        else:
            print("Unknown account type!")
            return None

class SMSNotifier:
    def update(self, account):
        print(f"[SMS] Dear {account.owner}, your {account.get_type()} balance is now: {account.balance}")


# Transaction History 
transactions = []

# Customer balances
customer_balances = {}

# Undo last action (LIFO)
undo_stack = []

# Customer service queue (FIFO)
service_queue = deque()

def main():
    print("=== Addis Bank - Day 07 Mini Project (on top of Day 06) ===\n")
    
    config = BankConfig()
    
    # Day 06 part
    acc1 = AccountRegistory.create("savings", "Almaz Bekele", 800)
    acc1.attach(SMSNotifier())
    
    acc1.deposit(400)
    acc1.withdraw(150)
    
    print("\n=== Day 07: Linear Data Structures Demo ===")
    
    # List (Array)
    transactions.append(400)
    transactions.append(-150)
    print("Transaction History (List):", transactions)
    
    # Dictionary (HashMap)
    customer_balances[acc1.owner] = acc1.balance
    print("Customer Balances (Dictionary):", customer_balances)
    
    # Stack (Undo)
    undo_stack.append(400)   # push
    print("Stack (Undo):", undo_stack)
    last = undo_stack.pop()  # pop
    print("Undid last transaction:", last)
    
    # Queue (FIFO)
    service_queue.append("Almaz")
    service_queue.append("Dawit")
    print("Service Queue:", list(service_queue))
    served = service_queue.popleft()
    print("Served customer:", served)
    
    print(f"\nFinal balance for {acc1.owner}: {acc1.balance} {config.currency}")

if __name__ == "__main__":
    main()