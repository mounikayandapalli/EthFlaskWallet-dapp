from flask import Flask, jsonify, request, render_template, redirect, url_for, session
from blockchain import Blockchain

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Needed for session
blockchain = Blockchain()

# Hardcoded credentials (for simplicity)
USERS = {
    "admin": "password123",
    "user1": "pass1"
}

@app.route('/')
def home():
    if 'username' in session:
        return render_template('index.html')
    else:
        return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        if username in USERS and USERS[username] == password:
            session['username'] = username
            return redirect(url_for('home'))
        else:
            error = "Invalid username or password!"
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

# --- Existing Blockchain routes ---
@app.route('/mine', methods=['GET'])
def mine():
    if 'username' not in session:
        return redirect(url_for('login'))
    last_block = blockchain.last_block
    proof = blockchain.proof_of_work(last_block['proof'])
    blockchain.new_transaction(sender="0", recipient="miner_address", amount=1)
    block = blockchain.new_block(proof)
    response = {
        'message': "New Block Mined",
        'index': block['index'],
        'transactions': block['transactions'],
        'proof': block['proof'],
        'previous_hash': block['previous_hash']
    }
    return jsonify(response), 200

@app.route('/transactions/new', methods=['POST'])
def new_transaction():
    if 'username' not in session:
        return redirect(url_for('login'))
    values = request.get_json()
    required = ['sender', 'recipient', 'amount']
    if not all(k in values for k in required):
        return 'Missing values', 400
    index = blockchain.new_transaction(values['sender'], values['recipient'], values['amount'])
    return jsonify({'message': f'Transaction will be added to Block {index}'}), 201

@app.route('/chain', methods=['GET'])
def full_chain():
    if 'username' not in session:
        return redirect(url_for('login'))
    response = {
        'chain': blockchain.chain,
        'length': len(blockchain.chain)
    }
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)