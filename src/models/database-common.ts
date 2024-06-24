import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Entities from './entities';
import * as Repositories from './repositories';

const CommonEntities = Object.values(Entities);

const CommonRepositories = Object.values(Repositories);

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(CommonEntities)],
  providers: [...CommonRepositories],
  exports: [TypeOrmModule, ...CommonRepositories],
})
export class DatabaseCommonModule {}