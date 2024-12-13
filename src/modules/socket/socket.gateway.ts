import { MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { logger } from '../../utils';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    server.emit('ping', { payload: 'ping', form: 'server' });
    logger.daily.info('Socket server initialized');
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    client.emit('message', { payload, form: 'server', action: 'message' });
    logger.daily.info({ payload, form: 'server', action: 'message' });
  }

  @SubscribeMessage('update')
  handleUpdate(@MessageBody() payload: any): void {
    this.server.emit('update', { payload, form: 'server', action: 'update' });
    logger.daily.info({ payload, form: 'server', action: 'update' });
  }
}
