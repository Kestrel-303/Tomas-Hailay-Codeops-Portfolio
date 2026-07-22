from abc import ABC, abstractmethod

# 1. Singleton Pattern - One config for the whole bank
class BankConfig:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.currency = "ETB"
            cls._instance.min_balance = 100
        return cls._instance

# 2. Base Account Class
class Account(ABC):
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
        self.observers = []   # For Observer Pattern
    
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
            self.notify()   # Tell observers about change
            print(f"Deposited {amount} {BankConfig().currency}")
    
    def withdraw(self, amount):
        if amount > 0 and self.balance >= amount + BankConfig().min_balance:
            self.balance -= amount
            self.notify()
            print(f"Withdrawn {amount} {BankConfig().currency}")
        else:
            print("Not enough balance or below minimum!")

# 3. Different Account Types (using Inheritance)
class SavingsAccount(Account):
    def get_type(self):
        return "Savings Account"

class CheckingAccount(Account):
    def get_type(self):
        return "Checking Account"

# Factory Pattern - Easy way to create accounts
class AccountFactory:
    @staticmethod
    def create(type_name, owner, balance=0):
        if type_name == "savings":
            return SavingsAccount(owner, balance)
        elif type_name == "checking":
            return CheckingAccount(owner, balance)
        else:
            print("Unknown account type!")
            return None

# Observer Pattern - Notifications
class SMSNotifier:
    def update(self, account):
        print(f"[SMS] Dear {account.owner}, your {account.get_type()} balance is now: {account.balance}")

# Main Program
def main():
    print("=== Addis Bank - Day 06 Mini Project ===\n")
    
    config = BankConfig()
    
    # Create accounts using Factory
    acc1 = AccountFactory.create("savings", "Almaz Bekele", 800)
    acc2 = AccountFactory.create("checking", "Dawit Tesfaye", 300)
    
    # Add observer
    acc1.attach(SMSNotifier())
    
    # Test operations
    acc1.deposit(400)
    acc1.withdraw(150)
    
    print(f"\nFinal balance for {acc1.owner}: {acc1.balance} {config.currency}")

if __name__ == "__main__":
    main()