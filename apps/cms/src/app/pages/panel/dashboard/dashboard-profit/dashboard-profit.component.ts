import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PROFIT_LINES_DUMMY_DATA } from './profit'

@Component({
  selector: 'cms-dashboard-profit',
  templateUrl: './dashboard-profit.component.html',
  styleUrls: ['./dashboard-profit.component.scss']
})
export class DashboardProfitComponent implements OnInit, AfterViewInit {

  options: any = {};
  echartsIntance: any;
  dummyLinesData: any = PROFIT_LINES_DUMMY_DATA

  constructor() {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.setOptionsForChart(PROFIT_LINES_DUMMY_DATA);
  }

  setOptionsForChart(linesData) {

    this.options = {
      color: [
        "#3366ff",
        "#00d68f",
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      legend: {
        data: ['transactions', 'orders'],
        borderWidth: 0,
        borderRadius: 0,
        itemWidth: 15,
        itemHeight: 15,
        textStyle: {
          color: "#ffffff",
        },
      },
      tooltip: {
        axisPointer: {
          type: 'shadow',
        },
        textStyle: {
          color: "#ffffff",
          fontWeight: "normal",
          fontSize: 16,
        },
        position: 'top',
        backgroundColor: "#222b45",
        borderColor: "#1a2138",
        borderWidth: "1",
        formatter: params => `$ ${ Math.round(parseInt(params.value, 10)) }`,
        extraCssText: "border-radius: 10px; padding: 4px 16px;",
      },
      xAxis: [
        {
          data: linesData.firstLine.map((_, index) => index),
          silent: false,
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#1b1b38",
              opacity: "1",
              width: "1",
            },
          },
        },
      ],
      series: [
        {
          name: 'transactions',
          type: 'bar',
          data: linesData.firstLine,
          animationDelay: idx => idx * 10,
        },
        {
          name: 'orders',
          type: 'bar',
          data: linesData.secondLine,
          animationDelay: idx => idx * 10 + 100,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: idx => idx * 5,
    }
  }

  onChartInit(echarts) {
    this.echartsIntance = echarts;
  }

  resizeChart() {
    if (this.echartsIntance) {
      this.echartsIntance.resize();
    }
  }

}
