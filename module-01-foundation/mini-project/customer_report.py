def get_customer_data():
    customers = {}
    ##  Catchig invalid amount inputs
    while True:
        try: 
            amount = int(input('Number of clients to check: '))
            break
        except:
            print('Invalid input! Exiting')
    for i in range(amount):
        name = input(f"Name of client #{i + 1}: ")

    ##  Catching invalid balance inputs right when they happen
        while True:
            try:
                balance = float(input(f'Balance of cleint #{i + 1}: '))
                break
            except ValueError:
                print("Invalid Input! Try again.")
        
        customers[name] = balance
    return customers
        
def customer_tier(customers):
    ## Handles customer data dynamically]
    if not customers:
        print("No customer data available")
        return
    
    ## Lists client names with thier respective tier and balance
    print("\n ---Clinet Tiers list--- ")
    pr_count = 0
    std_count = 0
    bsc_count = 0
    for name, balance in customers.items():
            if balance >= 1000:
                print(f"{name}: premium {balance} ETB")
                pr_count += 1
            elif balance >= 500:
                print(f"{name}: standard {balance} ETB")
                std_count += 1
            else:
                print(f"{name}: basic {balance} ETB")
                bsc_count += 1
    ## Prints the number of cliets in each tier
    print("\n---Number of clients in each tier---")
    print(f"There are {pr_count} premium Customers\nThere are {std_count} standard Customers\nThere are {bsc_count} basic Customers")

## Intiates the program  
customers = get_customer_data()
customer_tier(customers )
