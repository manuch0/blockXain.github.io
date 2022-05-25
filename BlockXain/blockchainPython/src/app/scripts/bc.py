import datetime
import hashlib
import json
from urllib import response
from urllib.parse import urlparse
from collections import OrderedDict
import requests

from flask import request

class Blockchain:
    #Constructor
    def __init__(self):
        #Inicializacion de la cadena y transacciones a 0
        self.chain = []
        self.transactions = []
        self.users = [] #
        self.createBlock(proof = 1, previousHash = '0')
        self.nodes = set()

    #Creacion de un nuevo Bloque
    def createBlock(self, proof, previousHash):
        block = {
            'Index' : len(self.chain)+1,
            'Timestamp' : str(datetime.datetime.now()),
            'Proof' : proof,
            'PreviousHash' : previousHash,
            'Transactions' : self.transactions
        }

        #Lista transacciones = [] porque al minarse un nuevo bloque se vacia la mempool
        self.transactions = []
        self.chain.append(block)
        return block
    
    #Recuperar bloque anterior
    def getPreviousBlock(self):
        return self.chain[-1]

    #Protocolo de consenso
    def proofOfWork(self, previousProof):
        newProof = 1
        checkProof = False
        
        while checkProof is False:
            hasOperation = hashlib.sha256(str(newProof**2 - previousProof**2).encode()).hexdigest()
            if hasOperation[:4] == '0000':
                checkProof = True
            else:
                newProof += 1
        
        return newProof
    
    #Funcion que aplica el Algoritmo de Encriptacion SHA256 
    def hash(self, block):
        encodedBlock = json.dumps(block, sort_keys = True).encode()
        hashBlock = hashlib.sha256(encodedBlock).hexdigest()
        return hashBlock
    
    #Comprobacion de si la Cadena de bloques es Valida
    def isValidChain(self, chain):
        previousBlock = chain[0]
        blockIndex = 1

        while blockIndex < len(chain):
            block = chain[blockIndex]
            if block['PreviousHash'] != self.hash(previousBlock):
                return False
            
            previousProof = previousBlock['Proof']
            proof = block['Proof']
            hashOperation = hashlib.sha256(str(proof**2 - previousProof**2).encode()).hexdigest()

            if hashOperation[:4] != '0000':
                return False
            
            previousBlock = block
            blockIndex += 1

        return True
    
    def addTranscation(self, sender, vote):
        self.transactions.append({
            'UserID' : sender,
            'Value' : vote
        })
        self.users.append(sender)#
        #Averiguamos sobre el bloque que van a ir las transacciones
        previousBlock = self.getPreviousBlock()
        return previousBlock['Index'] + 1
    
    def addNode(self, address):
        parsedURL = urlparse(address)
        self.nodes.add(parsedURL.netloc)

    def replaceChain(self):

        network = self.nodes
        longestChain = None
        maxLength = len(self.chain)

        for node in network:
            response = requests.get(f'http://{node}/get_chain')
            if response.status_code == 200:
                length = response.json()['Length']
                chain = response.json()['Chain']
                if length > maxLength and self.isValidChain(chain):
                    maxLength = length
                    longestChain = chain
        
        if longestChain:
            self.chain = longestChain
            return True
        return False

