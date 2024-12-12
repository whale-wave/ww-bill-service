import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(3002)
export class SocketGateway {
  @SubscribeMessage('createSocket')
  create(@MessageBody() createSocketDto: any) {
    console.info(createSocketDto);
    // return this.socketService.create(createSocketDto);
  }

  @SubscribeMessage('findAllSocket')
  findAll() {
    // return this.socketService.findAll();
  }

  @SubscribeMessage('findOneSocket')
  findOne(@MessageBody() id: number) {
    console.info(id);
    // return this.socketService.findOne(id);
  }

  @SubscribeMessage('updateSocket')
  update(@MessageBody() updateSocketDto: any) {
    console.info(updateSocketDto);
    // return this.socketService.update(updateSocketDto.id, updateSocketDto);
  }

  @SubscribeMessage('removeSocket')
  remove(@MessageBody() id: number) {
    console.info(id);
    // return this.socketService.remove(id);
  }
}
