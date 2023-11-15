import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { markdownv2 } from 'telegram-format';

import { UserService } from 'src/user/services/user.service';
import { NotificationService } from 'src/notification/notification.service';
import { OnboardingEntity } from 'src/onboarding/onboarding.entity';
import { Actions } from 'src/constants';

import { MessageEntity } from './message.entity';
import { IMessageCreate, TFindAllMessages } from './types';
import * as Keyboards from './keyboards';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(OnboardingEntity)
    private readonly onboardingRepository: Repository<OnboardingEntity>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
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

  async sendAssistanceMessage(text: string, fromTelegramId: number) {
    const from = await this.userService.findOne({ telegramId: fromTelegramId });
    const onboardingStep = await this.onboardingRepository.findOne({
      where: {
        order: from.onboardingStep,
      },
      relations: ['reportTo'],
    });
    const to = await this.userService.findOne({
      id: onboardingStep.reportTo.id,
    });

    const messageEntity = this.create({
      text: markdownv2.escape(text),
      from: {
        telegramId: fromTelegramId,
      },
      to,
    });

    if (!messageEntity) return null;

    const notificationText = `User ${markdownv2.bold(
      markdownv2.escape(from.firstName),
    )} ${markdownv2.bold(
      markdownv2.escape(from.lastName),
    )} requested help with onboarding step "${markdownv2.escape(
      onboardingStep.title,
    )}"\\.\n\nMessage:\n\n${markdownv2.escape(text)}`;

    await this.notificationService.sendNotification(
      to.telegramId,
      notificationText,
      {
        inline_keyboard: Keyboards.responseToAssistance.map((keyboardRow) =>
          keyboardRow.map((button) => ({
            ...button,
            callback_data: Actions.Reply + from.telegramId,
          })),
        ),
      },
    );

    return messageEntity;
  }

  async sendReplyMessage(
    text: string,
    fromTelegramId: number,
    toTelegramId: number,
  ) {
    const from = await this.userService.findOne({ telegramId: fromTelegramId });

    const to = await this.userService.findOne({
      telegramId: toTelegramId,
    });

    const messageEntity = this.create({
      text: markdownv2.escape(text),
      from,
      to,
    });

    if (!messageEntity) return null;

    const notificationText = 'Admin reply:\n\n' + markdownv2.escape(text);

    await this.notificationService.sendNotification(
      to.telegramId,
      notificationText,
    );

    return messageEntity;
  }
}
