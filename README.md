# EthFlaskWallet

A simple **blockchain web application** built with **Flask** and integrated with **MetaMask**.  
This app allows users to connect their MetaMask wallet, select a sender account, and send ETH transactions. It also includes a simple Python blockchain backend to track transactions in blocks.

## **Features**

- Connect MetaMask wallet to the web app  
- Select any active MetaMask account (including imported accounts)  
- Send ETH transactions on a local test network (Ganache)  
- Simple blockchain backend to store blocks and transactions  
- Responsive UI with real-time status updates  

## **Requirements**

- Python 3.8+  
- Flask  
- MetaMask browser extension  
- Ganache (local Ethereum test network)  

```bash
pip install -r requirements.txt
python app.py
http://127.0.0.1:5000
