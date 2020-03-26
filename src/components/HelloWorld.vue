<template>
  <div class="container">
    <div id="bim" class="left"></div>
    <div class="right">
      <div class="right-top">
        <input type="button" v-on:click="getFloors" value="获取楼层" />
        <input type="button" v-on:click="clearIsolation" value="清除隔离" />
        <input type="button" v-on:click="marker3D" value="3D锚点" />
        <input type="button" v-on:click="clearMarker3D" value="清空锚点" />
        <input type="button" v-on:click="getViewPoint" value="获取视点" />
        <input type="button" v-if="viewPoint" v-on:click="setViewPoint" value="设置视点" />
      </div>
      <div class="right-bottom">
        <div ref="rb"></div>
        <div>
          <ul>
            <li v-for="(floor,index) in floors" :key="index">
              {{floor.name}} -
              <input type="button" v-on:click="isolateFloor(floor)" value="隔离" />
              <input type="button" v-on:click="blink(floor)" value="闪烁构件" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getProvider, { ProviderType, IsolateOption } from "bim-operator";

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      fileId: 1826280869775328,
      viewPoint: null,
      floors: []
    };
  },
  created() {
    this.bimface = getProvider(ProviderType.BIMFACE);
  },
  async mounted() {
    await this.bimface.loadModel({
      viewToken: "165a46bfb3194c3f839b0f16046e5cef",
      url:
        "https://static.bimface.com/api/BimfaceSDKLoader/BimfaceSDKLoader@latest-release.js",
      domId: "bim",
      viewConfig: {
        enableHover: true
      }
    });
  },
  methods: {
    async getFloors() {
      this.floors = await this.bimface.getFloors();
    },
    clearIsolation() {
      this.bimface.clearIsolation();
    },
    async isolateFloor(floor) {
      this.bimface.isolateComponentByCondition(
        [
          {
            levelName: floor.name
          }
        ],
        IsolateOption.HideOthers
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
      this.bimface.add3dMarker(marker3D);
    },
    clearMarker3D() {
      this.bimface.clear3dMarker();
    },
    async getViewPoint() {
      const self = this;
      const viewPoint = await this.bimface.getViewPoint({
        color: "#EE799F",
        opacity: 1
      });
      var pic2 = new Image();
      pic2.src = viewPoint.thumbnail;
      pic2.height = 60;
      pic2.width = 80;
      pic2.onclick = function() {
        // pic2.remove();
        self.setViewPoint(viewPoint);
      };
      this.$refs.rb.appendChild(pic2);
    },
    async setViewPoint(viewPoint) {
      if (viewPoint) this.bimface.setViewPoint(viewPoint);
    },
    async blink(floor) {
      // highlightComponents
      this.bimface.clearHighlightComponents();
      this.bimface.selectComponentsByCondition([
        {
          levelName: floor.name
        }
      ]);
      this.bimface.highlightComponents(this.bimface.getSelectedComponents(), {
        color: "#FF0000",
        opacity: 0.5,
        intervalTime: 500
      });
      this.bimface.clearSelectedComponents();
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
