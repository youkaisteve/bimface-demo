<template>
  <div class="container">
    <div id="bim" class="left"></div>
    <div class="right">
      <div class="right-top">
        <input type="button" v-on:click="getFloors" value="获取楼层" />
        <input type="button" v-on:click="marker3D" value="3D锚点" />
        <input type="button" v-on:click="getViewPoint" value="获取视点" />
        <input type="button" v-if="viewPoint" v-on:click="setViewPoint" value="设置视点" />
      </div>
      <div class="right-bottom" ref="rb"></div>
    </div>
  </div>
</template>

<script>
import getProvider, { ProviderType } from "bim-operator";

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      viewPoint: null
    };
  },
  created() {
    this.bimface = getProvider(ProviderType.BIMFACE);
  },
  async mounted() {
    await this.bimface.loadModel({
      viewToken: "0bbd210fca5c442eab345924d244d650",
      url:
        "https://static.bimface.com/api/BimfaceSDKLoader/BimfaceSDKLoader@latest-release.js",
      domId: "bim",
      viewConfig: {
        enableHover: true
      }
    });
    console.log("finish");
  },
  methods: {
    async getFloors() {
      const floors = await this.bimface.getFloors();
      console.log(floors);
      console.log(
        await this.bimface.getComponentByCondition({
          fileId: 1771874174404448,
          floor: floors[0].name
        })
      );
    },
    async marker3D() {
      const marker3D = {
        id: 99,
        src:
          "http://static.bimface.com/resources/3DMarker/warner/warner_red.png",
        // size: 100,
        worldPosition: {
          x: -9752.023568420416,
          y: -929.6956396779448,
          z: 13348.985568386792
        },
        tooltip: "这是撒大声地撒旦阿斯顿",
        onClick: function(item) {
          console.log(item);
        }
      };
      const id = this.bimface.add3dMarker(marker3D);
      console.log(`id is ${id}`);
    },
    async getViewPoint() {
      this.viewPoint = await this.bimface.getViewPoint();
      var pic2 = new Image();
      pic2.src = this.viewPoint.thumbnail;
      pic2.height = 60;
      pic2.width = 80;
      this.$refs.rb.appendChild(pic2);
    },
    async setViewPoint() {
      if (this.viewPoint) this.bimface.setViewPoint(this.viewPoint);
    }
  }
};
</script>

<style scoped lang="less">
.container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  .left {
    width: 1200px;
    height: 800px;
  }
  .right {
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    .right-top {
      flex: 1;
    }
    .right-bottom {
      flex: 1;
      border: 1px solid;
    }
  }
}
</style>
