import { Global, Module } from '@nestjs/common';
import { NOTIFICATION_SERVICE } from './notification.service';
import { SmtpMockNotificationService } from './smtp-mock.notification.service';

@Global()
@Module({
  providers: [
    SmtpMockNotificationService,
    {
      provide: NOTIFICATION_SERVICE,
      useExisting: SmtpMockNotificationService,
    },
  ],
  exports: [NOTIFICATION_SERVICE],
})
export class NotificationsModule {}
