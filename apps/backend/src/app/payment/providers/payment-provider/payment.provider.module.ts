import { HttpModule, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BankModel } from '../../../models/bank.entity';
import { OptionsModel } from '../../../models/options.model';
import { TestModel } from '../../../models/test.entity';
import { OptionsService } from '../../../options/options.service';
import { BankModule } from '../../bank/bank.module';
import { BetConstructModule } from '../../betContruct/betConsturct.module';
import { ChannelModule } from '../../channel/channel.module';
import { DepositOrderModule } from '../../order/deposit-order/deposit.order.module';
import { DepositPendingOrderModule } from '../../order/deposit-pending-order/deposit.pending.order.module';
import { DepositOrderAllModule } from '../../order/deposit/deposit.order.all.module';
import { WithdrawOrderModule } from '../../order/withdraw-order/withdraw.order.module';
import { WithdrawPendingOrderModule } from '../../order/withdraw-pending-order/withdraw.pending.order.module';
import { WithdrawOrderAllModule } from '../../order/withdraw/withdraw.order.all.module';
import { PaymentProviderBankModule } from '../payment-provider-bank/payment.provider.bank.module';
import { PaymentProviderCardModule } from '../payment-provider-card/payment.provider.card.module';
import { PaymentProviderChannelModule } from '../payment-provider-channel/payment.provider.channel.module';
import { PaymentProviderEntityModule } from '../payment-provider-entity/payment.provider.entity.module';
import { PaymentProviderSharedModule } from '../payment-provider-shared/payment.provider.shared.module';
import { PaymentProviderUsdtProtoModule } from '../payment-provider-usdt-protocol/payment.provider.usdt.proto.module';
import { BisaPaymentProviderController } from './bisa/bisa.payment.provider.controller';
import { BisaPaymentProviderService } from './bisa/bisa.payment.provider.service';
import { CardPaymentProviderService } from './card.payment.provider.service';
import { D1FPaymentProviderController } from './d1f/d1f.payment.provider.controller';
import { D1FPaymentProviderService } from './d1f/d1f.payment.provider.service';
import { DBPayPaymentProviderService } from './dbpay/dbpay.payment.provider.service';
import { HengXinPaymentProviderController } from './hengxin/hengxin.payment.provider.controller';
import { HengXinPaymentProviderService } from './hengxin/hengxin.payment.provider.service';
import { JBPPaymentProviderController } from './jbp/jbp.payment.provider.controller';
import { JBPPaymentProviderService } from './jbp/jbp.payment.provider.service';
import { MSZFPaymentCallbackController } from './mszf/mszf.payment.provder.controller';
import { MSZFPaymentProviderService } from './mszf/mszf.payment.provider.service';
import { PaymentProviderController } from './payment.provider.controller';
import { SXCPaymentProviderController } from './sxc/sxc.payment.provider.controller';
import { SXCPaymentProviderService } from './sxc/sxc.payment.provider.service';
// import { SDDPaymentProviderController } from './sdd/sdd.payment.provider.controller';
// import { SDDPaymentProviderService } from './sdd/sdd.payment.provider.service';
import { UzPAYPaymentProviderController } from './uzpay/uzpay.payment.provider.controller';
import { UzPAYPaymentProviderService } from './uzpay/uzpay.payment.provider.service';
import { XingChenPaymentProviderController } from './xingchen/xingchen.payment.provider.controller';
import { XingChenPaymentProviderService } from './xingchen/xingchen.payment.provider.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 45000,
      maxRedirects: 5,
    }),
    SequelizeModule.forFeature([BankModel, TestModel, OptionsModel]),
    ChannelModule,
    BankModule,
    DepositPendingOrderModule,
    DepositOrderModule,
    WithdrawPendingOrderModule,
    WithdrawOrderModule,
    DepositOrderAllModule,
    WithdrawOrderAllModule,
    PaymentProviderBankModule,
    PaymentProviderChannelModule,
    BetConstructModule,
    PaymentProviderCardModule,
    PaymentProviderEntityModule,
    PaymentProviderSharedModule,
    PaymentProviderUsdtProtoModule,
  ],
  controllers: [
    PaymentProviderController,
    MSZFPaymentCallbackController,
    D1FPaymentProviderController,
    XingChenPaymentProviderController,
    UzPAYPaymentProviderController,
    //SDDPaymentProviderController,
    HengXinPaymentProviderController,
    JBPPaymentProviderController,
    SXCPaymentProviderController,
    BisaPaymentProviderController,
  ],
  providers: [
    OptionsService,
    MSZFPaymentProviderService,
    D1FPaymentProviderService,
    XingChenPaymentProviderService,
    UzPAYPaymentProviderService,
    //SDDPaymentProviderService,
    HengXinPaymentProviderService,
    JBPPaymentProviderService,
    CardPaymentProviderService,
    SXCPaymentProviderService,
    DBPayPaymentProviderService,
    BisaPaymentProviderService,
  ],
  exports: [
    MSZFPaymentProviderService,
    D1FPaymentProviderService,
    XingChenPaymentProviderService,
    UzPAYPaymentProviderService,
    //SDDPaymentProviderService,
    HengXinPaymentProviderService,
    JBPPaymentProviderService,
    CardPaymentProviderService,
    SXCPaymentProviderService,
    DBPayPaymentProviderService,
    BisaPaymentProviderService,
  ],
})
export class PaymentProviderModule {}
