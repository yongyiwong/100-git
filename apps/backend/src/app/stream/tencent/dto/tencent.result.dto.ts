import {
  getTencentStreamState,
  TencentStreamStateEnum,
} from '../enums/tencent.stream.state.enum';
import { DescribeLiveStreamStateResponse } from 'tencentcloud-sdk-nodejs/tencentcloud/services/live/v20180801/live_models';

export class TencentResultDto {
  RequestId: string;
  StreamState: TencentStreamStateEnum;

  public static responseFactory(
    data: DescribeLiveStreamStateResponse
  ): TencentResultDto {
    const tencentResult = new TencentResultDto();

    const { RequestId, StreamState } = data;

    tencentResult.RequestId = RequestId || null;
    tencentResult.StreamState = getTencentStreamState(StreamState) || null;

    return tencentResult;
  }
}
