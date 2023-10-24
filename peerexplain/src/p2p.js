import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:4000", {
  withCredentials: true, // se você quer enviar cookies ou outros cabeçalhos
  extraHeaders: {
    "my-custom-header": "abcd" // se você quer adicionar algum cabeçalho personalizado
  }
});

const P2P = () => {
    const [peers, setPeers] = useState([]);

    useEffect(() => {
        const peerConnections = {};

        const addPeer = (peerId, shouldCreateOffer = false) => {
            const peerConnection = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: 'stun:stun.l.google.com:19302',
                    },
                ],
            });
            peerConnections[peerId] = peerConnection;

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('ice-candidate', {
                        target: peerId,
                        candidate: event.candidate,
                    });
                }
            };

            peerConnection.ontrack = (event) => {
                console.log('Incoming media stream received');
            };

            if (shouldCreateOffer) {
                peerConnection.createOffer().then((offer) => {
                    return peerConnection.setLocalDescription(offer);
                }).then(() => {
                    console.log('Sending offer to peer', peerId);
                    socket.emit('sdp', {
                        target: peerId,
                        sdp: peerConnection.localDescription,
                    });
                });
            }

            socket.on('connect', () => {
                console.log('Connected to signaling server');
                socket.emit('join-room', 'my-room');
            });

            socket.on('user-connected', (userId) => {
                console.log('User connected:', userId);
                addPeer(userId, true);
            });

            socket.on('user-disconnected', (userId) => {
                console.log('User disconnected:', userId);
                peerConnections[userId].close();
                delete peerConnections[userId];
                setPeers((prevPeers) => prevPeers.filter((peer) => peer !== userId));
            });

            socket.on('ice-candidate', ({ candidate, source }) => {
                console.log('Received ICE candidate from peer', source);
                const peerConnection = peerConnections[source] || addPeer(source);
                const iceCandidate = new RTCIceCandidate(candidate);
                peerConnection.addIceCandidate(iceCandidate);
            });

            socket.on('sdp', ({ sdp, source }) => {
                console.log('Received SDP from peer', source);
                const peerConnection = peerConnections[source] || addPeer(source);
                const remoteDescription = new RTCSessionDescription(sdp);
                peerConnection.setRemoteDescription(remoteDescription).then(() => {
                    if (remoteDescription.type === 'offer') {
                        return peerConnection.createAnswer();
                    }
                }).then((answer) => {
                    return peerConnection.setLocalDescription(answer);
                }).then(() => {
                    console.log('Sending answer to peer', source);
                    socket.emit('sdp', {
                        target: source,
                        sdp: peerConnection.localDescription,
                    });
                });
            });

            return () => {
                socket.emit('leave-room', 'my-room');
                Object.values(peerConnections).forEach((peerConnection) => {
                    peerConnection.close();
                });
            };
        }
        addPeer(socket.id);
    }, []);

    return (
        <div>
            <p> Peers: </p>
            {peers.map((peer) => (
                <div key={peer}>{peer}</div>
            ))}
        </div>
    );
};

export default P2P;
