from bank_model import Branch, AccountRegistry, bfs

def practice_branch_tree():
    head = Branch("Head Office")
    reg1 = Branch("Region North")
    reg2 = Branch("Region South")
    b1 = Branch("Branch A")
    b2 = Branch("Branch B")
    b3 = Branch("Branch C")

    head.add_child(reg1)
    head.add_child(reg2)
    reg1.add_child(b1)
    reg1.add_child(b2)
    reg2.add_child(b3)

    acc1 = AccountRegistry.create("savings", "Alice", "ACC-101", 1000)
    acc2 = AccountRegistry.create("checking", "Bob", "ACC-102", 2000)
    acc3 = AccountRegistry.create("savings", "Charlie", "ACC-103", 3000)

    b1.add_account(acc1)
    b2.add_account(acc2)
    b3.add_account(acc3)

    assert head.total_balance() == 6000
    assert reg1.total_balance() == 3000
    assert reg2.total_balance() == 3000

def practice_bfs_graph():
    transfers = {
        "A": ["B", "C"],
        "B": ["D"],
        "C": ["E"],
        "D": ["E"],
        "E": []
    }
    reachable = bfs(transfers, "A")
    assert reachable == ["A", "B", "C", "D", "E"]

if __name__ == "__main__":
    practice_branch_tree()
    practice_bfs_graph()
    print("All practice assertions passed successfully!")
