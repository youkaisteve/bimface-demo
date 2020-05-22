<template>
  <div class="container">
    <div
      id="bim"
      class="left"
      :style="{width:modelWidth === '100%' ? modelWidth : modelWidth + 'px'}"
    ></div>
    <div class="right">
      <div class="right-top">
        <div>
          <input type="button" v-on:click="load3D" value="3D模型" />
          <input type="button" v-on:click="load2D" value="2D图纸" />
        </div>
        <div v-if="mode === '3D'">
          <input type="button" v-on:click="changeWidth1" value="变宽" />
          <input type="button" v-on:click="changeWidth2" value="变窄" />
          <input type="button" v-on:click="getFloors" value="获取楼层" />
          <input type="button" v-on:click="clearIsolation" value="清除隔离" />
          <input type="button" v-on:click="marker3D" value="3D锚点" />
          <input type="button" v-on:click="clearMarker3D" value="清空锚点" />
          <input type="button" v-on:click="getViewPoint" value="获取视点" />
          <input type="button" v-if="viewPoint" v-on:click="setViewPoint" value="设置视点" />
          <input type="button" v-on:click="explosionFloor" value="楼层爆炸" />
        </div>
        <div v-if="mode==='2D'">
          <input type="button" v-on:click="setDisplayMode(1)" value="白底模式" />
          <input type="button" v-on:click="setDisplayMode(2)" value="黑白模式" />
          <input type="button" v-on:click="setDisplayMode(0)" value="普通模式" />
          <input type="button" v-on:click="setDisplayMode(3)" value="自定义模式" />
        </div>
      </div>
      <div class="right-bottom">
        <div ref="rb"></div>
        <div>
          <ul>
            <li v-for="(floor,index) in floors" :key="index">
              {{floor.name}} -
              <input type="button" v-on:click="isolateFloor(floor)" value="隔离" />
              <input type="button" v-on:click="blink(floor)" value="闪烁构件" />
              <input type="button" v-on:click="cancelBlink(floor)" value="取消闪烁构件" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getProvider, { ProviderType, IsolateOption } from '@yzw/bim-operator'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      mode: '3D',
      viewPoint: null,
      floors: [],
      modelWidth: 800
    }
  },
  created() {
    const provider = getProvider(ProviderType.BIMFACE, { debugOn: true })
    // 获取3D模型操作对象
    this.bim3DModel = provider.bim3DModel
    // 获取3D模型操作对象
    this.bimDrawing = provider.bimDrawing
  },
  async mounted() {
    this.load3D()
  },
  methods: {
    async load3D() {
      this.mode = '3D'
      await this.bim3DModel.load({
        viewToken: '1002cc76a8d443b898f3c00deafb59f7',
        domId: 'bim',
        unsafe: true,
        appConfig: {},
        viewConfig: {
          enableHover: true,
          enableToggleContextMenuDisplay: true,
          enableExplosion: true
        }
      })
      this.bim3DModel.addCustomButtons([
        {
          className: 'bf-button gld-bf-map',
          toggleClassName: 'bf-button gld-bf-properties',
          clickEvent: this.explosionFloor
        }
      ])
    },
    async load2D() {
      this.mode = '2D'
      await this.bimDrawing.load({
        viewToken: '352b7a5824e24fbeb66b5554cf043c56',
        domId: 'bim'
      })
    },
    changeWidth1() {
      this.modelWidth = 1300
      this.bim3DModel.resize(1300)
    },
    changeWidth2() {
      this.modelWidth = 800
      this.bim3DModel.resize(800)
      this.bim3DModel.render()
    },
    async getFloors() {
      this.floors = await this.bim3DModel.getFloors()
    },
    clearIsolation() {
      this.bim3DModel.clearIsolation()
    },
    async isolateFloor(floor) {
      this.bim3DModel.isolateComponentByCondition(
        [
          {
            levelName: floor.name
          }
        ],
        IsolateOption.HideOthers
      )
    },
    async marker3D() {
      const marker3D = {
        id: 99,
        src:
          'http://static.bimface.com/resources/3DMarker/warner/warner_red.png',
        worldPosition: {
          x: -9752.023568420416,
          y: -929.6956396779448,
          z: 13348.985568386792
        },
        tooltip: '这是撒大声地撒旦阿斯顿',
        onClick: function(item) {
          console.log(item)
        }
      }
      this.bim3DModel.marker.add3dMarker(marker3D)
    },
    clearMarker3D() {
      this.bim3DModel.marker.clear3dMarker()
    },
    async getViewPoint() {
      const self = this
      const viewPoint = await this.bim3DModel.getViewPoint({
        color: '#EE799F',
        opacity: 1
      })
      var pic2 = new Image()
      pic2.src = viewPoint.thumbnail
      pic2.height = 60
      pic2.width = 80
      pic2.onclick = function() {
        // pic2.remove();
        self.setViewPoint(viewPoint)
      }
      this.$refs.rb.appendChild(pic2)
    },
    async setViewPoint(viewPoint) {
      if (viewPoint) this.bim3DModel.setViewPoint(viewPoint)
    },
    async explosionFloor() {
      if (this.floors.length === 0) {
        await this.getFloors()
      }

      const floorIds = this.floors.map(x => x.id)
      this.bim3DModel.explosionFloor(floorIds, 3)
    },
    async blink(floor) {
      // highlightComponents
      await this.bim3DModel.multi(async $ins => {
        $ins.clearHighlightComponents()
        $ins.selectComponentsByCondition([
          {
            levelName: floor.name
          }
        ])
        $ins.highlightComponents($ins.getSelectedComponents(), {
          color: '#FF0000',
          opacity: 0.5,
          intervalTime: 500
        })
        $ins.clearSelectedComponents()
      })
    },
    async cancelBlink(floor) {
      this.bim3DModel.selectComponentsByCondition([
        {
          levelName: floor.name
        }
      ])
      this.bim3DModel.clearHighlightComponents(
        this.bim3DModel.getSelectedComponents()
      )
      this.bim3DModel.clearSelectedComponents()
    },
    setDisplayMode(mode) {
      if (mode === 3) {
        this.bimDrawing.setDisplayMode(mode, {
          color: '#FF0000',
          opacity: 0.7
        })
      } else {
        this.bimDrawing.setDisplayMode(mode)
      }
    }
  }
}
</script>

<style scoped lang="less">
.container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  .left {
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
