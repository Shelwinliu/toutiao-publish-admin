<template>
  <div ref="main" style="width: 600px; height: 600px"></div>
</template>

<script>
import * as echarts from "echarts";
import $ from "jquery";

// 如果使用依赖百度地图的图表，则必须
//  1、加载百度地图的 JavaScript SDK 脚本文件
//  2、加载 echarts 百度地图的扩展
import "echarts/extension/bmap/bmap";

import loadBMap from "@/utils/map.js";

export default {
  name: "BaiduMap",
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    var ROOT_PATH =
      "https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples";

    var chartDom = this.$refs.main;

    var myChart = echarts.init(chartDom);
    var option;

    $.get(ROOT_PATH + "/data/asset/data/hangzhou-tracks.json", function (data) {
      var lines = data.map(function (track) {
        return {
          coords: track.map(function (seg, idx) {
            return seg.coord;
          }),
        };
      });
      loadBMap("B3m1vbGTeiEcKtsrKHQEHXZIznvCzhr4").then(() => {
        myChart.setOption(
          (option = {
            bmap: {
              center: [120.13066322374, 30.240018034923],
              zoom: 14,
              roam: true,
              mapStyle: {
                styleJson: [
                  {
                    featureType: "water",
                    elementType: "all",
                    stylers: {
                      color: "#d1d1d1",
                    },
                  },
                  {
                    featureType: "land",
                    elementType: "all",
                    stylers: {
                      color: "#f3f3f3",
                    },
                  },
                  {
                    featureType: "railway",
                    elementType: "all",
                    stylers: {
                      visibility: "off",
                    },
                  },
                  {
                    featureType: "highway",
                    elementType: "all",
                    stylers: {
                      color: "#fdfdfd",
                    },
                  },
                  {
                    featureType: "highway",
                    elementType: "labels",
                    stylers: {
                      visibility: "off",
                    },
                  },
                  {
                    featureType: "arterial",
                    elementType: "geometry",
                    stylers: {
                      color: "#fefefe",
                    },
                  },
                  {
                    featureType: "arterial",
                    elementType: "geometry.fill",
                    stylers: {
                      color: "#fefefe",
                    },
                  },
                  {
                    featureType: "poi",
                    elementType: "all",
                    stylers: {
                      visibility: "off",
                    },
                  },
                  {
                    featureType: "green",
                    elementType: "all",
                    stylers: {
                      visibility: "off",
                    },
                  },
                  {
                    featureType: "subway",
                    elementType: "all",
                    stylers: {
                      visibility: "off",
                    },
                  },
                  {
                    featureType: "manmade",
                    elementType: "all",
                    stylers: {
                      color: "#d1d1d1",
                    },
                  },
                  {
                    featureType: "local",
                    elementType: "all",
                    stylers: {
                      color: "#d1d1d1",
                    },
                  },
                  {
                    featureType: "arterial",
                    elementType: "labels",
                    stylers: {
                      visibility: "off",
                    },
                  },
                  {
                    featureType: "boundary",
                    elementType: "all",
                    stylers: {
                      color: "#fefefe",
                    },
                  },
                  {
                    featureType: "building",
                    elementType: "all",
                    stylers: {
                      color: "#d1d1d1",
                    },
                  },
                  {
                    featureType: "label",
                    elementType: "labels.text.fill",
                    stylers: {
                      color: "#999999",
                    },
                  },
                ],
              },
            },
            series: [
              {
                type: "lines",
                coordinateSystem: "bmap",
                data: lines,
                polyline: true,
                lineStyle: {
                  color: "purple",
                  opacity: 0.6,
                  width: 1,
                },
              },
            ],
          })
        );
      });
    });

    option && myChart.setOption(option);
  },
  methods: {},
};
</script>

<style lang='less' scoped>
</style>
