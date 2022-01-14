import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SportsEnum } from '@workspace/enums';
import { Queue, Job } from 'bull';
import { KSportRequestDto } from './dto/ksport.request.dto';
import { KSportResultItemDto } from './dto/ksport.result.item.dto';

export class KSportFetchOpenInfo {
  fetchHandle: string;
  fetchData: KSportResultItemDto[];
}

class KSportFetchNode {
  refCount: number;
  data: {
    sports: {};
    kSportIds: string[];
  };
}

@Injectable()
@Processor('fetch-ksport')
export class KSportFetchService {
  private currentHandle: string;
  private nodeMap: {};
  private fetchJob: Job;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    @InjectQueue('fetch-ksport') private fetchKSportQueue: Queue
  ) {
    this.nodeMap = {};
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Open KSport Data
  ///////////////////////////////////////////////////////////////////////////////
  public async openData(sport: SportsEnum): Promise<KSportFetchOpenInfo> {
    const openInfo = new KSportFetchOpenInfo();

    let node: KSportFetchNode = null;

    if (!this.currentHandle) {
      node = await this.getNodeWithFetch();
    } else {
      node = this.nodeMap[this.currentHandle];
    }

    if (!node) {
      console.log('FETCH ERROR');
      return null;
    }

    node.refCount++;

    openInfo.fetchHandle = this.currentHandle;
    openInfo.fetchData = node.data.sports[sport];

    return openInfo;
  }

  public async getKSportIds(): Promise<string[]> {
    let node: KSportFetchNode = null;

    if (!this.currentHandle) {
      node = await this.getNodeWithFetch();
    } else {
      node = this.nodeMap[this.currentHandle];
    }

    if (!node) {
      console.log('FETCH ERROR');
      return null;
    }

    return node.data.kSportIds;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Close KSport Data
  ///////////////////////////////////////////////////////////////////////////////
  public closeData(handle: string): boolean {
    const node: KSportFetchNode = this.nodeMap[handle];
    if (!node) {
      return false;
    }

    node.refCount--;

    if (node.refCount > 0) {
      return true;
    }

    if (this.currentHandle === handle) {
      return true;
    }

    delete this.nodeMap[handle];

    return true;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Update KSport Data
  ///////////////////////////////////////////////////////////////////////////////
  public async fetchUpdated(force?: boolean): Promise<boolean> {
    if (this.fetchJob && !force) {
      return false;
    }

    let nodeData: {
      sports: {};
      kSportIds: string[];
    } = null;

    try {
      if (this.fetchJob) {
        await this.fetchJob.finished();
      }

      this.fetchJob = await this.fetchKSportQueue.add(
        'fetch-ksport-job',
        {},
        { timeout: 45000 }
      );

      nodeData = await this.fetchJob.finished();

      this.fetchJob = null;
      if (!nodeData) {
        return false;
      }
    } catch (error) {
      this.fetchJob = null;
      return false;
    }

    if (this.currentHandle) {
      const nodeCurrent = <KSportFetchNode>this.nodeMap[this.currentHandle];
      if (nodeCurrent /* && nodeCurrent.refCount < 1 */) {
        delete this.nodeMap[this.currentHandle];
      }
    }

    const node = new KSportFetchNode();

    node.data = nodeData;
    node.refCount = 0;

    const fetchHandle = this.generateNewFetchHandle();

    this.nodeMap[fetchHandle] = node;
    this.currentHandle = fetchHandle;

    return true;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Open Data With Fetch
  ///////////////////////////////////////////////////////////////////////////////
  protected async getNodeWithFetch(): Promise<KSportFetchNode> {
    let node: KSportFetchNode = null;
    let nodeData: { sports: {}; kSportIds: string[] } = null;

    if (!this.fetchJob) {
      this.fetchJob = await this.fetchKSportQueue.add(
        'fetch-ksport-job',
        {},
        { timeout: 45000, attempts: 1 }
      );
    }

    try {
      nodeData = await this.fetchJob.finished();
    } catch (error) {}
    this.fetchJob = null;

    if (!nodeData) {
      return null;
    }

    // Configure fetchHandle
    if (!this.currentHandle) {
      const fetchHandle = this.generateNewFetchHandle();
      this.currentHandle = fetchHandle;

      // Configure fetchNode
      node = new KSportFetchNode();

      node.data = nodeData;
      node.refCount = 0;

      // Set fetchNode
      this.nodeMap[fetchHandle] = node;
    } else {
      node = this.nodeMap[this.currentHandle];
    }

    node.refCount++;

    // Configure fetchOpenInfo
    // openInfo.fetchData = node.data.sports[sport];
    // openInfo.fetchHandle = this.currentHandle;

    return node;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Fetch KSport Job Consumer Processing
  ///////////////////////////////////////////////////////////////////////////////
  @Process('fetch-ksport-job')
  private async fetchKsportProcess(job: Job) {
    let nodeData: {} = null;

    const ksportRequest = KSportRequestDto.sportFactory();
    const host = this.configService.get<string>('KSPORT_HOST');
    const api = this.configService.get<string>('KSPORT_API');

    console.log('fetch-ksport-job consummer is starting...');

    try {
      const response = await this.httpService
        .get(`http://${host}${api}`, {
          params: ksportRequest,
        })
        .toPromise();

      const data: KSportResultItemDto[] = response.data;

      if (!data) {
        return null;
      }

      nodeData = this.buildNodeData(data);
    } catch (error) {
      return null;
    }

    console.log('fetch-ksport-job consumming end with success.....');

    return nodeData;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Generate New Fetch Handle
  ///////////////////////////////////////////////////////////////////////////////
  private generateNewFetchHandle() {
    let fetchHandle = null;
    while (!fetchHandle || this.nodeMap[fetchHandle]) {
      fetchHandle = Math.random().toString(36).substring(2, 12);
    }

    return fetchHandle;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Build Node Data
  ///////////////////////////////////////////////////////////////////////////////
  private buildNodeData(data: KSportResultItemDto[]): {} {
    const nodeData = {
      sports: {},
      kSportIds: [],
    };

    const sportsIds = Object.values(SportsEnum).filter(
      (_sport_id) => typeof _sport_id === 'number'
    );

    sportsIds.forEach((sportId) => {
      nodeData.sports[sportId] = [];
    });

    const kSportIds: string[] = [];

    data.forEach((kSportResultItem) => {
      const sportId = kSportResultItem.SportId;

      if (sportsIds.includes(sportId)) {
        nodeData.sports[sportId].push(kSportResultItem);
      } else {
        nodeData.sports[SportsEnum.other].push(kSportResultItem);
      }

      // strIDs += `${strIDs.length > 0 ? ',' : ''}${kSportResultItem.vid}`;
      kSportIds.push(kSportResultItem.vid);
    });

    nodeData.kSportIds = kSportIds;

    return nodeData;
  }
}
