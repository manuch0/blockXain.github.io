#Creacion de Aplicacion Web#

from urllib import response
from uuid import uuid4



from flask import Flask, jsonify, request, render_template
from flask_ngrok import run_with_ngrok
from flask_cors import CORS, cross_origin

from bc import Blockchain


app = Flask(__name__)
#run_with_ngrok(app)
CORS(app, support_credentials=True)

app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

nodeAddress = str(uuid4()).replace('-', '')

blockchain = Blockchain()

@app.route('/mine_block', methods=['GET'])
def mineBlock():
    previousBlock = blockchain.getPreviousBlock()
    previousProof = previousBlock['Proof']
    proof = blockchain.proofOfWork(previousProof)
    previousHash = blockchain.hash(previousBlock)
    #blockchain.addTranscation(sender=nodeAddress, vote="Candidate X")
    block = blockchain.createBlock(proof, previousHash)
    response = {
        'Message' : 'Nuevo bloque añadido a la cadena!',
        'Index' : block['Index'],
        'Timestamp' : block['Timestamp'],
        'Proof' : block['Proof'],
        'PreviousHash' : block['PreviousHash'],
        'Transactions' : block['Transactions']
    }

    return jsonify(response), 200

@app.route('/get_chain', methods=['GET'])
def getChain():
    response = {
        'Chain' : blockchain.chain,
        'Length' : len(blockchain.chain)
    }

    return jsonify(response), 200

@app.route('/is_valid', methods=['GET'])
def isValid():
    isValid = blockchain.isValidChain(blockchain.chain)

    if isValid:
        response = {
            'Message' : 'La cadena de bloques es valida.'
        }
    else:
        response = {
            'Message' : 'La cadena de bloques NO es valida.'
        }
    
    return jsonify(response), 200

@app.route('/add_vote', methods=['POST'])
def addTransaction():
    json = request.get_json()
    
    if nodeAddress in blockchain.users:
        response = {
            'Message' : f'El usuario ya ha realizado una votacion'
        } 
    else:
        blockchain.users.append(nodeAddress)

        index = blockchain.addTranscation(nodeAddress, json['Value'])
        response = {
            'Message' : f'La transaccion será añadida al bloque {index}'
        }
    return jsonify(response), 201

@app.route('/connect_node', methods=['POST'])
def connectNode():
    json = request.get_json()
    nodes = json.get('Nodes')

    if nodes is None:
        return 'No hay nodos para añadir', 400
    
    for node in nodes:
        blockchain.addNode(node)
    
    response = {
        'Message' : 'Todos los nodos han sido añadidos a la red! En la Blockchain participan los nodos: ',
        'TotalNodes' : list(blockchain.nodes)
    }

    return jsonify(response), 201

@app.route('/replace_chain', methods=['GET'])
def replaceChain():
    isChainReplaced = blockchain.replaceChain()
    if isChainReplaced:
        response = {
            'message' : 'Los nodos tenian diferentes cadenas, se ha remplazado por la BC mas larga.',
            'New Chain' : blockchain.chain
        }
    else:
        response = {
            'message' : 'Todo correcto, la BC en todos los nodos ya es la mas larga.',
            'New Chain' : blockchain.chain
        }
    
    return jsonify(response), 200


app.run(port=5001)