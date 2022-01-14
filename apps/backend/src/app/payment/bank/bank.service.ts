import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize';
import { BankModel } from '../../models/bank.entity';
import { BankGetRequestDto } from './dto/bank.get.request.dto';

@Injectable()
export class BankService {
  constructor(
    @InjectModel(BankModel)
    private bankRepository: typeof BankModel
  ) {}

  async findOne(options?: FindOptions): Promise<BankModel> {
    return this.bankRepository.findOne(options);
  }

  async findAll(options?: FindOptions): Promise<BankModel[]> {
    return this.bankRepository.findAll(options);
  }

  async findById(bankId: number): Promise<BankModel> {
    return this.bankRepository.findByPk(bankId);
  }

  public async findAllByQuery(query: BankGetRequestDto) {
    const findOptions: FindOptions = {
        include: [],
        order: [['id', 'asc']],
      },
      where: {} = {};

    findOptions.where = where;

    return this.bankRepository.findAll(findOptions);
  }
}
