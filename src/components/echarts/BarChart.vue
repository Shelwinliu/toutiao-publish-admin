<template>
  <div ref="main" style="width: 600px; height: 400px"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "BarChart",
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    var myChart = echarts.init(this.$refs.main);

    // specify chart configuration item and data
    var option = {
      title: {
        text: "ECharts entry example",
      },
      tooltip: {},
      legend: {
        data: ["Sales"],
      },
      xAxis: {
        data: ["shirt", "cardign", "chiffon shirt", "pants", "heels", "socks"],
      },
      yAxis: {},
      series: [
        {
          name: "Sales",
          type: "bar",
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    };

    // use configuration item and data specified to show chart
    myChart.setOption(option);
  },
  methods: {},
};
</script>

<style lang='less' scoped>
</style>
