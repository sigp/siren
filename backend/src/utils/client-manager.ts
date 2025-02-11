import { Response } from 'express';

export class ClientManager {
  private clients: Response[] = [];

  public addClient(client: Response): void {
    this.clients.push(client);
  }

  public removeClient(client: Response): void {
    this.clients = this.clients.filter((c) => c !== client);
  }

  public sendMessageToClients(data: any): void {
    const message = `data: ${JSON.stringify(data)}\n\n`;
    this.clients.forEach((client) => client.write(message));
  }
}
