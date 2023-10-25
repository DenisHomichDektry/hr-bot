import { Module } from '@nestjs/common';

import { AdminService } from './admin.service';
import { AdminScene } from './admin.scene';

@Module({
  providers: [AdminService, AdminScene],
})
export class AdminModule {}
