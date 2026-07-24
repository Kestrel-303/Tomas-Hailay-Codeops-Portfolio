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
    def __init__(self, owner, acc_number, balance=0):
        self.owner = owner
        self.account_number = acc_number
        self.balance = balance
        self.observers = []
        self.transactions = []
    
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
            self.transactions.append(amount)
            self.notify()
            print(f"Deposited {amount} {BankConfig().currency}")
    
    def withdraw(self, amount):
        if amount > 0 and self.balance >= amount + BankConfig().min_balance:
            self.balance -= amount
            self.transactions.append(-amount)
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
    def create(type_name, owner, acc_number, balance=0):
        if type_name == "savings":
            return SavingsAccount(owner, acc_number, balance)
        elif type_name == "checking":
            return CheckingAccount(owner, acc_number, balance)
        else:
            print("Unknown account type!")
            return None

    @staticmethod
    def top_by_balance(accounts, top_n=3):
        return sorted(accounts, key=lambda a: a.balance, reverse=True)[:top_n]

    @staticmethod
    def binary_search(accounts, target, lo=0, hi=None):
        if hi is None:
            hi = len(accounts) - 1
        if lo > hi:
            return None
        mid = (lo + hi) // 2
        if accounts[mid].account_number == target:
            return accounts[mid]
        elif accounts[mid].account_number < target:
            return AccountRegistory.binary_search(accounts, target, mid + 1, hi)
        else:
            return AccountRegistory.binary_search(accounts, target, lo, mid - 1)

    @staticmethod
    def find_by_number(accounts, acc_num):
        sorted_accounts = sorted(accounts, key=lambda a: a.account_number)
        return AccountRegistory.binary_search(sorted_accounts, acc_num)

    @staticmethod
    def total_transactions(target, index=0, accounts=None):
        if isinstance(target, str) and accounts is not None:
            acc = AccountRegistory.find_by_number(accounts, target)
            target = acc.transactions if acc else []
        elif isinstance(target, Account):
            target = target.transactions
        if not target or index >= len(target):
            return 0
        return target[index] + AccountRegistory.total_transactions(target, index + 1)

class Notifier(ABC):
    @abstractmethod
    def update(self, account): pass

class SMSNotifier(Notifier):
    def update(self, account):
        print(f"[SMS] {account.owner}'s {account.get_type()} balance: {account.balance} ETB")

class EmailNotifier(Notifier):
    def update(self, account):
        print(f"[EMAIL] Notification sent to {account.owner}")

transactions = []
customer_balances = {}
undo_stack = []
service_queue = deque()

def main():
    print("=== Addis Bank - Day 07 Mini Project (on top of Day 06) ===\n")
    
    config = BankConfig()
    
    acc1 = AccountRegistory.create("savings", "Almaz Bekele", "SAV-001", 800)
    acc2 = AccountRegistory.create("checking", "Dawit Alemu", "CHK-001", 500)
    acc1.attach(SMSNotifier())
    acc2.attach(SMSNotifier())
    
    acc1.deposit(400)
    acc1.withdraw(150)
    acc2.deposit(300)
    acc2.withdraw(100)
    
    transactions.append(400)
    transactions.append(-150)
    transactions.append(300)
    transactions.append(-100)
    print("Transaction History:", transactions)
    
    customer_balances[acc1.owner] = acc1.balance
    customer_balances[acc2.owner] = acc2.balance
    print("Customer Balances:", customer_balances)
    
    undo_stack.append(400)
    print("Stack:", undo_stack)
    last = undo_stack.pop()
    print("Undid last transaction:", last)
    
    service_queue.append("Almaz")
    service_queue.append("Dawit")
    print("Service Queue:", list(service_queue))
    served = service_queue.popleft()
    print("Served customer:", served)
    
    print(f"\nFinal balance for {acc1.owner}: {acc1.balance} {config.currency}")
    print(f"Final balance for {acc2.owner}: {acc2.balance} {config.currency}")

    print("\n=== Top Accounts by Balance ===")
    top_accounts = AccountRegistory.top_by_balance([acc1, acc2])
    for i, acc in enumerate(top_accounts, start=1):
        print(f"{i}. {acc.owner}: {acc.balance} {config.currency}")
        
    print("\n=== Find Account by Number ===")
    accounts = [acc1, acc2]
    acc_num_to_find = "SAV-001"  
    found_account = AccountRegistory.find_by_number(accounts, acc_num_to_find)
    if found_account:
        print(f"Account found: {found_account.owner} ({found_account.account_number})")
    else:
        print("Account not found.")

    print("\n=== Recursive Total Transactions ===")
    print(f"Total transaction sum for {acc1.owner}: {AccountRegistory.total_transactions(acc1)}")
    print(f"Total transaction sum for {acc2.owner}: {AccountRegistory.total_transactions(acc2)}")

    print("\n=== Account Observers ===")
    print(f"Observers for {acc1.owner}: {[type(obs).__name__ for obs in acc1.observers]}")
    print(f"Observers for {acc2.owner}: {[type(obs).__name__ for obs in acc2.observers]}")

if __name__ == "__main__":
    main()
