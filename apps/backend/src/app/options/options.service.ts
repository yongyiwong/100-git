import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import * as numeral from 'numeral';
import { InjectModel } from '@nestjs/sequelize';
import { OptionsModel } from '../models/options.model';
import { FindOptions, Op } from 'sequelize';
import { OptionsUpdateResponseDto } from './dto/options.update.response.dto';
import { OptionsUpdateRequestDto } from './dto/options.update.request.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

export enum OptionsKeyGeneralEnum {
  EuroCupAmount = 'euroCupAmount',
  WithdrawDefaultMinAmount = 'withdrawDefaultMinAmount',
  WithdrawDefaultMaxAmount = 'withdrawDefaultMaxAmount',
  DailyMaxNumWithdraw = 'dailyMaxNumWithdraw',
  DailyMaxAmountWithdraw = 'dailyMaxAmountWithdraw',
}

@Injectable()
export class OptionsService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(OptionsModel) private optionsRepository: typeof OptionsModel
  ) {}

  async findOne(options?: FindOptions): Promise<OptionsModel> {
    return this.optionsRepository.findOne(options);
  }

  async findAll(options?: FindOptions): Promise<OptionsModel[]> {
    return this.optionsRepository.findAll(options);
  }

  async findById(bankId: number): Promise<OptionsModel> {
    return this.optionsRepository.findByPk(bankId);
  }

  async findAllGeneral() {
    const euroCupAmountValue = await this.optionsRepository.findOne({
      where: { optName: OptionsKeyGeneralEnum.EuroCupAmount },
    });

    const dailyMaxAmountWithdrawValue = await this.optionsRepository.findOne({
      where: { optName: OptionsKeyGeneralEnum.DailyMaxAmountWithdraw },
    });

    const dailyMaxNumWithdrawValue = await this.optionsRepository.findOne({
      where: { optName: OptionsKeyGeneralEnum.DailyMaxNumWithdraw },
    });

    const withdrawDefaultMaxAmountValue = await this.optionsRepository.findOne({
      where: { optName: OptionsKeyGeneralEnum.WithdrawDefaultMaxAmount },
    });

    const withdrawDefaultMinAmountValue = await this.optionsRepository.findOne({
      where: { optName: OptionsKeyGeneralEnum.WithdrawDefaultMinAmount },
    });

    return {
      euroCupAmount: numeral(
        euroCupAmountValue.optValue.toString('utf8')
      ).value(),
      dailyMaxAmountWithdraw: numeral(
        dailyMaxAmountWithdrawValue.optValue.toString('utf8')
      ).value(),
      dailyMaxNumWithdraw: numeral(
        dailyMaxNumWithdrawValue.optValue.toString('utf8')
      ).value(),
      withdrawDefaultMaxAmount: numeral(
        withdrawDefaultMaxAmountValue.optValue.toString('utf8')
      ).value(),
      withdrawDefaultMinAmount: numeral(
        withdrawDefaultMinAmountValue.optValue.toString('utf8')
      ).value(),
    };
  }

  async updateByRequest(
    updateRequest: OptionsUpdateRequestDto
  ): Promise<OptionsUpdateResponseDto> {
    const response = new OptionsUpdateResponseDto();

    for (let i = 0; i < updateRequest.options.length; i++) {
      const requestItem = updateRequest.options[i];

      const option = await this.optionsRepository.findOne({
        where: { optName: requestItem.optName },
      });

      if (!option) {
        continue;
      }

      const optionUpdated = UpdateOptionDto.updateRequestFactory(
        option,
        requestItem
      );

      await optionUpdated.save();
    }

    response.result = true;
    return response;
  }
}
