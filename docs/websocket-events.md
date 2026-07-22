# WebSocket Events Reference

## Connection

```typescript
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const client = new Client({
  webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
  connectHeaders: { Authorization: `Bearer ${token}` },
  reconnectDelay: 3000,
  onConnect: () => console.log('Connected'),
});
client.activate();
```

## Event Flow Diagrams

### Session Join + Start
```
Student                  Server                   Mentor
   |                       |                         |
   |--POST /join---------->|                         |
   |<--SessionDTO----------|                         |
   |                       |--/topic/{id}/status---->|
   |<--/topic/{id}/status--|                         |
   |                       |                         |
   |                       |<---POST /start----------|
   |                       |--/topic/{id}/status---->|
   |<--/topic/{id}/status--|   status=ACTIVE         |
```

### Code Sync (Last-Write-Wins)
```
User A (types)           Server                   User B
   |                       |                         |
   |--/app/code----------->|                         |
   |  {code, senderId:A}   |--/topic/{id}/code------>|
   |                       |  (relay, no persist)    |
   |                       |                         |
   |                       |<---/app/code------------|
   |<--/topic/{id}/code----|   {code, senderId:B}    |
   | (ignored: same user)  |                         |
```

### WebRTC Call Setup
```
Mentor                   Server                   Student
   |                       |                         |
   |--/app/signal--------->|                         |
   |  {type:offer,to:S}    |--/topic/{id}/signal---->|
   |                       |   (relay to student)    |
   |                       |                         |
   |                       |<---/app/signal----------|
   |<--/topic/{id}/signal--|   {type:answer,to:M}    |
   |                       |                         |
   |-- ICE candidates exchanged both directions ------>|
   |<---- RTC peer connection established ------------|
```

## Subscription Topics per Session

| Topic | Trigger | Payload |
|-------|---------|---------|
| `/topic/session/{id}/code` | Any participant sends code | `CodeUpdateRequest` |
| `/topic/session/{id}/chat` | Any participant sends message | `MessageDTO` |
| `/topic/session/{id}/signal` | WebRTC signaling | `SignalMessageDTO` |
| `/topic/session/{id}/status` | Join / Start / End | `SessionDTO` |
