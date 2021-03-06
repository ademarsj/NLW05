import { getCustomRepository, Repository } from "typeorm";
import { MessagesRepository } from "../repositories/MessagesRepository";
import { Message } from "../entities/Message";

class MessagesService {

  private messagesRepository : Repository<Message>;

  async Create({ admin_id = null, user_id, text }) {
    const message = this.messagesRepository.create({ admin_id, user_id, text}); 

    await this.messagesRepository.save(message);
    
    return message;
  }

  async listByUser( user_id  : string) {
    //Trazendo também informações do usuário
    const list = await this.messagesRepository.find({
      where: { user_id },
      relations: ['user'],
    });

    return list;
  }

  constructor(){
    if (!this.messagesRepository){
      this.messagesRepository = getCustomRepository(MessagesRepository);
    }
  }
}

export { MessagesService }