import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsdtProtocolModel } from '../../models/usdtProtocol';
import { UsdtProtoController } from './usdt.proto.controller';
import { UsdtProtoService } from './usdt.proto.service';

@Module({
  imports: [SequelizeModule.forFeature([UsdtProtocolModel])],
  providers: [UsdtProtoService],
  controllers: [UsdtProtoController],
  exports: [UsdtProtoService],
})
export class UsdtProtoModule {}
