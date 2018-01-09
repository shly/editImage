/**
 * @description 提供编辑图片的方法,包括初始化图片，画标记，设置标记类型，清除所有标记，撤销上一次标记，获取所有的标记信息
 */
var DrawImageUtil = {}
~function () {
  var markParams = {
    startX: 0,
    startY: 0,
    width: 1,
    height: 1,
    index: 0,
    strokeWidth: 1,
    color: 'red',
    type: 'rectangle', // ellipse
    layerName: 'ln_'
  }
  var markList = []

  DrawImageUtil = {
    // 初始化预览的图片和标记
    initImage: function (infos, canvas, imageId) {
      // 从DOM中获取图片显示到canvas上
      canvas.drawImage(infos.imageInfo);
      if (infos.markInfos && infos.markInfos.length > 0) {
        for (var i = 0; i < infos.markInfos.length; i++) {
          infos.markInfos[i].name = 'last_' + infos.markInfos[i].name
          canvas.addLayer(infos.markInfos[i]).drawLayers()
        }
      }
    },
    // 开始标记
    drawMark: function (event) {
      return MouseUtil.onMouseDown(event)
    },
    // 设置标记类型
    setMarkType: function (type) {
      markParams.type = type
    },
    // 清除所有标记
    clearAllMarks: function (infos, canvas, imageId) {
      if (markParams.index > 0) {
        canvas.removeLayers().drawLayers();
        this.initImage(infos, canvas, imageId)
        markParams.index = 0
        markList.length = 0
      }
    },
    // 回到上一步操作
    turnToLast: function (canvas) {
      if (markParams.index > 0) {
        canvas.removeLayer(-1).drawLayers();
        markParams.index--
        markList.pop()
      }
    },
    // 返回标记信息
    getMarks() {
      return markList
    }
  }
  var MouseUtil = {
    options: {},
    onMouseDown: function (e) {
      var position = document.querySelector('canvas').getBoundingClientRect()
      markParams.startX = e.pageX - position.x
      markParams.startY = e.pageY - position.y
      width = markParams.width
      height = markParams.height
      $('canvas').on('mousemove', this.onMouseMove)
      $('canvas').on('mouseup', this.onMouseUp)
    },
    onMouseMove: function (e) {
      var position = document.querySelector('canvas').getBoundingClientRect()
      markParams.width = (e.pageX - position.x - markParams.startX) || 1
      markParams.height = (e.pageY - position.y - markParams.startY) || 1
      $('canvas').removeLayer(markParams.layerName + markParams.index);
      this.options = {
        type: markParams.type,
        strokeStyle: markParams.color,
        strokeWidth: markParams.strokeWidth,
        name: markParams.layerName + markParams.index,
        fromCenter: false,
        x: markParams.startX, y: markParams.startY,
        width: markParams.width,
        height: markParams.height
      }
      $('canvas').addLayer(this.options).drawLayers()
    },
    onMouseUp: function () {
      $('canvas').off('mousemove')
      $('canvas').off('mouseup')
      markParams.index++
      markList.push(JSON.parse(JSON.stringify(this.options)))
    }
  }
}()
