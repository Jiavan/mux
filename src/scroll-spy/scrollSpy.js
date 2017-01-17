/**
 * 滚动监听，自动切换tab
 * @author Jiavan, jiavan.com@gmail.com
 * @date 2017-01-17 15:36
 * @type AMD Module
 *
 * Usage:
 * ScrollSpy.init([options])
 */

define(['zepto'], function ($) {
  var spy; // 导航dom节点
  var spyItem; // 导航section节点
  var spyChildren; // 导航dom子节点
  var tickTime; // 一次scroll callback触发时间间隔，默认50ms
  var bindClick; // 是否绑定导航子节点点击事件
  var offset; // 监听偏移大小

  function init(options) {
    if (!arguments.length || typeof options !== 'object') {
      options = {};
    }
    spy = options.spy || '.scroll-spy';
    spyChildren = options.spyChildren || '.scroll-spy li';
    spyItem = options.spyItem || '.scroll-spy-item';
    tickTime = options.tickTime || 50;
    bindClick = options.bindClick === false ? false : true;
    offset = options.offset === undefined ? 0 : options.offset;

    var $scrollSpy = $(spy);
    var scrollSpyOffsetTop = $scrollSpy.offset().top;
    var scrollSpyHeight = $scrollSpy.height();
    var $scrollSpyItems = $(spyItem);

    // 记录每一个被监听section在文档中的位置
    var scrollSpyItemsPosition = $scrollSpyItems.map(function (idx, item) {
      var $item = $(item);
      return $item.offset().top + $item.height();
    });
    var timer = false;

    $(window).scroll(function () {
      if (!timer) {
        var scrollTop = document.body.scrollTop;
        var currentPosition = scrollSpyItemsPosition.map(function(idx, item) {
          if (scrollTop < item - scrollSpyHeight - offset) {
            return idx;
          }
        })[0];

        scrollTop >= scrollSpyOffsetTop ? $scrollSpy.addClass('fixed').next().css('paddingTop', scrollSpyHeight) : $scrollSpy.removeClass('fixed').next().css('paddingTop', 0);
        $($scrollSpy.children()[currentPosition]).addClass('active').siblings().removeClass('active');

        timer = !timer;
        window.setTimeout(function () {
          timer = !timer;
        }, tickTime);
      }
    });

    if (bindClick) {
      $('body').on('click', spyChildren, function () {
        var $this = $(this);
        var idx = $scrollSpy.children().indexOf($this[0]);
        var position = 0;
        position = $($(spyItem)[idx]).offset().top - scrollSpyHeight;
        if (idx === 0 && $scrollSpy.hasClass('fixed')) {
          position += scrollSpyHeight;
        }
        $this.addClass('active').siblings().removeClass('active');
        window.scroll(0, position);
      });
    }
  }

  /**
   * 获取配置的options
   * @return object
   */
  function getOptions() {
    var options = {
      spy: spy,
      spyItem: spyItem,
      spyChildren: spyChildren
    };
    /* eslint-disable */
    console.info('Spy Info', options);
    /* eslint-enable */
    return options;
  }

  return {
    init: init,
    getOptions: getOptions
  };
});
