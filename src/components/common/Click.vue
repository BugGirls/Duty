// iphone样式 圆盘时钟

<script>

export default {
  name: 'v-clock',
  props: {
    size: {
      type: Number,
      default: () => 300
    }
  },
  data: () => ({ time: new Date(), isRunning: false }),
  computed: {
    fontSize() {
      const size = this.size / 300 * 16
      return size > 12 ? `${size}px` : '12px'
    },
    scales() {
      const radius = this.size / 2 * 0.8
      const arr = []
      for (let i = 1; i <= 12; i++) {
        const radian = 30 * Math.PI / 180 * i - 0.5 * Math.PI
        const left = radius * Math.cos(radian) + this.size * 0.45
        const top = radius * Math.sin(radian) + this.size * 0.45
        arr.push({
          num: i,
          left: `${left.toFixed(2)}px`,
          top: `${top.toFixed(2)}px`
        })
      }
      return arr
    },
    hourHand() {
      const hourDeg = 30 * (this.time.getHours() % 12)
      const minuteDeg = 0.5 * this.time.getMinutes()
      return `translate(-50%, 0) rotate(${hourDeg + minuteDeg - 180}deg)`
    },
    minuteHand() {
      const minuteDeg = 6 * this.time.getMinutes()
      const secondDeg = 0.1 * this.time.getSeconds()
      return `translate(-50%, 0) rotate(${minuteDeg + secondDeg - 180}deg)`
    },
    secondHand() {
      return `translate(-50%, -10%) rotate(${6 * this.time.getSeconds() - 180}deg)`
    }
  },

  mounted() {
    this.isRunning = true
    const tick = () => {
      if (!this.isRunning) {
        return
      }
      this.time = new Date()
      const timer = setTimeout(() => {
        clearTimeout(timer)
        tick()
      }, 1000)
    }
    tick()
  },
  destroyed() {
    this.isRunning = false
  }
}
</script>

<template>
  <div
    :style="{width:`${size}px`,height:`${size}px`}"
  >
    <div :class="$style['black-dail']">
      <div :class="$style['white-dail']">
        <span
          v-for="v in scales"
          :key="`ds-${v.num}`"
          :class="$style['degree-scale']"
          :style="{left:v.left,top:v.top,fontSize}"
        >{{v.num}}</span>
        <b :class="$style['hour-hand']" :style="{transform:hourHand}"></b>
        <b :class="$style['minute-hand']" :style="{transform:minuteHand}"></b>
        <b :class="$style['second-hand']" :style="{transform:secondHand}"></b>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.black-dail {
  width: 100%;
  height: 100%;
  padding: 5%;
  border-radius: 20%;
  background-color: #eee;
  box-sizing: border-box;
}

.white-dail {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #fff;
}

.degree-scale {
  position: absolute;
  display: block;
  // font-size: 16px;
  width: 2em;
  height: 2em;
  text-align: center;
  line-height: 2;
  transform: translate(-50%, -50%);
}

.hour-hand,
.minute-hand,
.second-hand {
  position: absolute;
  top: 50%;
  left: 50%;
}

.hour-hand {
  width: 2.5%;
  height: 30%;
  background-color: #000;
  transform-origin: 50% 0;
  transform: translate(-50%, 0) rotate(0);
  &::after {
    position: absolute;
    top: 0;
    left: 50%;
    display: block;
    content: '';
    width: 200%;
    padding-top: 200%;
    border-radius: 50%;
    background-color: #000;
    transform: translate(-50%, -50%);
  }
}

.minute-hand {
  width: 2%;
  height: 40%;
  background-color: #000;
  transform-origin: 50% 0;
  transform: translate(-50%, 0) rotate(0);
}

$second-color: rgb(255, 74, 74);
.second-hand {
  width: 1%;
  height: 50%;
  background-color: $second-color;
  transform-origin: 50% 10%;
  transform: translate(-50%, -10%) rotate(0);

  &::after {
    position: absolute;
    top: 10%;
    left: 50%;
    display: block;
    content: '';
    width: 300%;
    padding-top: 300%;
    border-radius: 50%;
    background-color: $second-color;
    transform: translate(-50%, -50%);
  }
}
</style>