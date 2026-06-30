import { Global, Module } from '@nestjs/common';
import { NOTIFICATION_SERVICE } from './notification.service';
import { NodemailerNotificationService } from './nodemailer.notification.service';

@Global()
@Module({
  providers: [
    NodemailerNotificationService,
    {
      provide: NOTIFICATION_SERVICE,
      useExisting: NodemailerNotificationService,
    },
  ],
  exports: [NOTIFICATION_SERVICE],
})
export class NotificationsModule {}
