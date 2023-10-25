import React, { useState, useEffect, useRef } from 'react';
import { Peer } from 'peerjs';
import { useLocation } from 'react-router-dom';

function P2P ()  {
  const [targetId, setTargetId] = useState('');
  const [myID, setMyId] = useState('');
  const [message, setMessage] = useState('');
  const [allPeers, setAllPeers] = useState([]);
  const peerRef = useRef(null);

  useEffect(() => {
    console.log('P2P component mounted');
    const newPeer = new Peer({
      host: 'localhost',
      port: 9000,
      path: '/myapp',
    });

    newPeer.on('open', () => {
      console.log('My peer ID is: ' + newPeer.id);
      setMyId(newPeer.id); // Atualiza o estado

      newPeer.listAllPeers((peers) => {
        console.log('Peers conectados: ' + peers);
        setAllPeers(peers); // Atualiza o estado
      });

      newPeer.on('connection', (conn) => {
        conn.on('data', (data) => {
          console.log('Recebi uma mensagem:', data);
        });
      });

      peerRef.current = newPeer;
    });

    return () => {
      // Encerrar a conexão ao desmontar o componente, se necessário
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, []);

  const handleSendMessage = () => {
    const conn = peerRef.current.connect(targetId);

    const messageToSend = {
      id_remetente: myID,
      id_destinatario: targetId,
      type: "DIRECT", 
      message: message
    };
  
    if (conn) {
      conn.on('open', () => {
        console.log('Connection established');
        conn.send(messageToSend);
      });
  
      conn.on('error', (err) => {
        console.log('Failed to connect: ' + err);
      });
    } else {
      console.log('Connection not established. Check peer availability.');
    }
  };

  const sendBroadCast = () => { 
    allPeers.forEach((peer) => {

      if (peer != myID) {
        console.log(peer)
        const conn = peerRef.current.connect(peer);


  
        if (conn) {
          conn.on('open', () => {
            const messageToSend = {
              id_remetente: myID,
              id_destinatario: peer,
              type: "BROADCAST", 
              message: message
            };
            
            console.log('Connection established');
            conn.send(messageToSend);
          });
    
          conn.on('error', (err) => {
            console.log('Failed to connect: ' + err);
          });
        } else {
          console.log('Connection not established. Check peer availability.');
        }
      }
    });
  }

 
  return (
    <div>
      <div>
        <label htmlFor="targetId">ID do peer de destino:</label>
        <input
          type="text"
          id="targetId"
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="message">Mensagem:</label>
        <input
          type="text"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button onClick={handleSendMessage}>Enviar Mensagem</button>
      <button onClick={sendBroadCast}>Enviar Broadcast</button>
    </div>
  );
};

export default P2P;