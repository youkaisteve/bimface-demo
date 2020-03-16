<template>
  <div class="container">
    <div id="bim" class="left"></div>
    <div class="right">
      <input type="button" v-on:click="getFloors" value="获取楼层" />
      <input type="button" v-on:click="marker3D" value="3D锚点" />
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import getProvider, { ProviderType } from "bim-operator";

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  created() {
    this.bimface = getProvider(ProviderType.BIMFACE);
  },
  async mounted() {
    await this.bimface.loadModel({
      viewToken: "f854308b4b1540f3b2be96337a372544",
      url:
        "https://static.bimface.com/api/BimfaceSDKLoader/BimfaceSDKLoader@latest-release.js",
      domId: "bim"
    });
    // eslint-disable-next-line no-console
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
  }
}
</style>
