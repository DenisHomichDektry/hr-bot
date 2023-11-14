import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { markdownv2 } from 'telegram-format';

import { UserService } from 'src/user/services/user.service';

import { MessageEntity } from './message.entity';
import { IMessageCreate, TFindAllMessages } from './types';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private readonly userService: UserService,
  ) {}
  async create(message: IMessageCreate) {
    const from = await this.userService.findOne(message.from);
    const to = await this.userService.findOne(message.to);
    const messageLength = message.text.length;

    if (!from || !to || messageLength > 4096) {
      return null;
    }

    const messageEntity = this.messageRepository.create({
      text: markdownv2.escape(message.text),
      from,
      to,
    });

    return await this.messageRepository.save(messageEntity);
  }

  async findAll(user: TFindAllMessages) {
    return await this.messageRepository.find({
      relations: ['from', 'to'],
      where: user,
    });
  }

  async remove(id: string) {
    return await this.messageRepository.delete(id);
  }
}
