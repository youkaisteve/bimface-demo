<template>
  <div class="container">
    <div id="bim" class="left"></div>
    <div class="right">
      <input type="button" v-on:click="getFloors" value="获取楼层" />
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import getProvider, { ProviderType } from 'bim-operator';

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  created() {
    this.bimface = getProvider(ProviderType.BIMFACE);
  },
  async mounted() {
    await this.bimface.loadModel({
      viewToken: '7478da5a8c4a4d259540e3daec0fb45b',
      url: 'https://static.bimface.com/api/BimfaceSDKLoader/BimfaceSDKLoader@latest-release.js',
      domId: 'bim'
    });
    // eslint-disable-next-line no-console
    console.log('finish');
  },
  methods: {
    async getFloors() {
      const floors = await this.bimface.getFloors();
      console.log(floors);
      console.log(await this.bimface.getComponentByCondition({ fileId: 1771124467418944, floor: floors[0].name }));
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
    width: 800px;
    height: 600px;
  }
  .right {
    flex: 1;
  }
}
</style>
