import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { html } from 'telegram-format';

import { UserService } from 'src/user/services/user.service';
import { NotificationService } from 'src/notification/notification.service';
import { Actions } from 'src/constants';
import { OnboardingProgressService } from 'src/onboarding/services';

import { MessageEntity } from './message.entity';
import { IMessageCreate, TFindAllMessages } from './types';
import * as Keyboards from './keyboards';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly onboardingProgressService: OnboardingProgressService,
  ) {}
  async create(message: IMessageCreate) {
    const from = await this.userService.findOne(message.from);
    const to = await this.userService.findOne(message.to);
    const messageLength = message.text.length;

    if (!from || !to || messageLength > 4096) {
      return null;
    }

    const messageEntity = this.messageRepository.create({
      text: html.escape(message.text),
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

  async sendAssistanceMessage(
    text: string,
    fromTelegramId: number,
  ): Promise<MessageEntity | null> {
    const from = await this.userService.findOne({ telegramId: fromTelegramId });

    if (!from) return null;

    const { step } =
      await this.onboardingProgressService.getLatestOnboardingStep(
        fromTelegramId,
      );

    if (!step) return null;

    const to = await this.userService.findOne({
      id: step.reportTo.id,
    });

    if (!to) return null;

    const messageEntity = this.create({
      text: html.escape(text),
      from: {
        telegramId: fromTelegramId,
      },
      to,
    });

    if (!messageEntity) return null;

    const notificationText = `User ${html.bold(
      html.escape(from.firstName),
    )} ${html.bold(
      html.escape(from.lastName),
    )} requested help with onboarding step "${
      step.title
    }".\n\nMessage:\n\n${html.escape(text)}`;

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
      text: html.escape(text),
      from,
      to,
    });

    if (!messageEntity) return null;

    const notificationText = 'Admin reply:\n\n' + html.escape(text);

    await this.notificationService.sendNotification(
      to.telegramId,
      notificationText,
    );

    return messageEntity;
  }
}
