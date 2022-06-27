<template>
  <div>
    <my-breadcrumb level2="数据统计" level2_link="/" level3="数据报表" level3_link="/admin/report/report"></my-breadcrumb>
    <!-- 用来初始化 Echarts 的区域 -->
    <el-card>
      <div ref="echartsArea" id="card" style="width: 800px; height: 500px;"></div>
    </el-card>
  </div>
</template>

<script>
// npm i --save-dev @types/echarts
// import Vue from 'vue';
import echarts from 'echarts';
// Vue.prototype.$echarts = echarts;
import _ from 'lodash';
// npm i --save-dev @types/zrender

import request from '@/utils/request.js'

export default {
  data() {
    return {
      option: {
        title: {
          text: '用户来源'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ]
      }
    };
  },
  methods: {
    async loadCharts() {
      // const res = await this.$http.get('/reports/type/1');
      const res = await request.get('/reports/type/1');
      const data = res.data;

      this.option = _.merge(this.option, data);

      console.log(this.option);
      // TypeError: Cannot read properties of undefined (reading ‘init‘)
      // 可能下载了最新版的echart就是版本不兼容,将echart原来的目录删掉再安装echart4
      // npm install echarts@4.8.0 --save
      const myChart = echarts.init(this.$refs.echartsArea);
      // const myChart = echarts.init(document.getElementById("card"));
      myChart.showLoading();
      myChart.setOption(this.option);
      myChart.hideLoading();
    }
  },
  mounted() {
    this.loadCharts();
  }
};
</script>

<style>
</style>
