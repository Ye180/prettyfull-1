import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { NotificationsProcessor } from './notifications.processor';
import { NotificationsProducerService } from './notifications.producer.service';

/**
 * Module de notifications asynchrones avec Bull/Redis
 * - Producer: ajoute des jobs dans la queue
 * - Processor: consomme les jobs et envoie les notifications
 */
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
  ],
  providers: [NotificationsProducerService, NotificationsProcessor],
  exports: [NotificationsProducerService],
})
export class NotificationsModule {}
