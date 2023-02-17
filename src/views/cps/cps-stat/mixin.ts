export default function mixin() {
  const chartsOptions = {
    legend: {
      data: []
    },
    tooltip: {
      show: true, // 是否显示
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: {
      name: '',
      data: [],
      type: 'line',
      markLine: {
        data: [
          {
            type: 'average',
            name: '平均值',
            lineStyle: { color: '#FBDB0F' },
            label: {
              formatter: '平均值:{c}',
              position: 'insideEndBottom'
            }
          },
          {
            type: 'max',
            name: '最大值',
            lineStyle: { color: '#AA069F' },
            label: {
              formatter: '最大值:{c}',
              position: 'insideEndBottom'
            }
          },
          {
            type: 'min',
            name: '最小值',
            lineStyle: { color: '#FD0100' },
            label: {
              formatter: '最小值:{c}',
              position: 'insideEndBottom'
            }
          }
        ]
      }
    }
  };

  function saveChartData(state: any, res: any) {
    state.chartsObj.sumActive = {
      title: '总活跃',
      prop: 'sumActive',
      total: res.data.sumActive,
      byDay: res.data.activeByDay
    };
    state.chartsObj.sumNew = {
      title: '总新增',
      prop: 'sumNew',
      total: res.data.sumNew,
      byDay: res.data.newByDay
    };
    state.chartsObj.sumIncome = {
      title: '总收入',
      prop: 'sumIncome',
      total: res.data.sumIncome,
      byDay: res.data.incomeByDay
    };
  }

  function preview(prop: any, state: any) {
    const currentObj = state.chartsObj[prop];
    state.chartsObj.chartsOptions.legend.data = [currentObj.title];
    state.chartsObj.chartsOptions.series.data = Object.values(currentObj.byDay);
    state.chartsObj.chartsOptions.series.name = currentObj.title;
    state.chartsObj.chartsOptions.xAxis.data = Object.keys(currentObj.byDay);
    state.dialog.visible = true;
    console.log(state.chartsObj);
  }
  return {
    saveChartData,
    preview,
    chartsOptions
  };
}
