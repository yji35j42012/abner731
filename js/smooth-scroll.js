/*!
 * jQuery Smooth Scroll - v2.2.0 - 2017-05-05
 * https://github.com/kswedberg/jquery-smooth-scroll
 * Copyright (c) 2017 Karl Swedberg
 * Licensed MIT
 */

!(function (a) {
  "function" == typeof define && define.amd
    ? define(["jquery"], a)
    : a(
        "object" == typeof module && module.exports ? require("jquery") : jQuery
      );
})(function (a) {
  var b = {},
    c = {
      exclude: [],
      excludeWithin: [],
      offset: 0,
      direction: "top",
      delegateSelector: null,
      scrollElement: null,
      scrollTarget: null,
      autoFocus: !1,
      beforeScroll: function () {},
      afterScroll: function () {},
      easing: "swing",
      speed: 400,
      autoCoefficient: 2,
      preventDefault: !0,
    },
    d = function (b) {
      var c = [],
        d = !1,
        e = b.dir && "left" === b.dir ? "scrollLeft" : "scrollTop";
      return (
        this.each(function () {
          var b = a(this);
          if (this !== document && this !== window)
            return !document.scrollingElement ||
              (this !== document.documentElement && this !== document.body)
              ? void (b[e]() > 0
                  ? c.push(this)
                  : (b[e](1), (d = b[e]() > 0), d && c.push(this), b[e](0)))
              : (c.push(document.scrollingElement), !1);
        }),
        c.length ||
          this.each(function () {
            this === document.documentElement &&
              "smooth" === a(this).css("scrollBehavior") &&
              (c = [this]),
              c.length || "BODY" !== this.nodeName || (c = [this]);
          }),
        "first" === b.el && c.length > 1 && (c = [c[0]]),
        c
      );
    },
    e = /^([\-\+]=)(\d+)/;
  a.fn.extend({
    scrollable: function (a) {
      var b = d.call(this, { dir: a });
      return this.pushStack(b);
    },
    firstScrollable: function (a) {
      var b = d.call(this, { el: "first", dir: a });
      return this.pushStack(b);
    },
    smoothScroll: function (b, c) {
      if ("options" === (b = b || {}))
        return c
          ? this.each(function () {
              var b = a(this),
                d = a.extend(b.data("ssOpts") || {}, c);
              a(this).data("ssOpts", d);
            })
          : this.first().data("ssOpts");
      var d = a.extend({}, a.fn.smoothScroll.defaults, b),
        e = function (b) {
          var c = function (a) {
              return a.replace(/(:|\.|\/)/g, "\\$1");
            },
            e = this,
            f = a(this),
            g = a.extend({}, d, f.data("ssOpts") || {}),
            h = d.exclude,
            i = g.excludeWithin,
            j = 0,
            k = 0,
            l = !0,
            m = {},
            n = a.smoothScroll.filterPath(location.pathname),
            o = a.smoothScroll.filterPath(e.pathname),
            p = location.hostname === e.hostname || !e.hostname,
            q = g.scrollTarget || o === n,
            r = c(e.hash);
          if (
            (r && !a(r).length && (l = !1), g.scrollTarget || (p && q && r))
          ) {
            for (; l && j < h.length; ) f.is(c(h[j++])) && (l = !1);
            for (; l && k < i.length; ) f.closest(i[k++]).length && (l = !1);
          } else l = !1;
          l &&
            (g.preventDefault && b.preventDefault(),
            a.extend(m, g, { scrollTarget: g.scrollTarget || r, link: e }),
            a.smoothScroll(m));
        };
      return (
        null !== b.delegateSelector
          ? this.off("click.smoothscroll", b.delegateSelector).on(
              "click.smoothscroll",
              b.delegateSelector,
              e
            )
          : this.off("click.smoothscroll").on("click.smoothscroll", e),
        this
      );
    },
  });
  var f = function (a) {
      var b = { relative: "" },
        c = "string" == typeof a && e.exec(a);
      return (
        "number" == typeof a
          ? (b.px = a)
          : c && ((b.relative = c[1]), (b.px = parseFloat(c[2]) || 0)),
        b
      );
    },
    g = function (b) {
      var c = a(b.scrollTarget);
      b.autoFocus &&
        c.length &&
        (c[0].focus(),
        c.is(document.activeElement) ||
          (c.prop({ tabIndex: -1 }), c[0].focus())),
        b.afterScroll.call(b.link, b);
    };
  (a.smoothScroll = function (c, d) {
    if ("options" === c && "object" == typeof d) return a.extend(b, d);
    var e,
      h,
      i,
      j,
      k = f(c),
      l = {},
      m = 0,
      n = "offset",
      o = "scrollTop",
      p = {},
      q = {};
    k.px
      ? (e = a.extend({ link: null }, a.fn.smoothScroll.defaults, b))
      : ((e = a.extend({ link: null }, a.fn.smoothScroll.defaults, c || {}, b)),
        e.scrollElement &&
          ((n = "position"),
          "static" === e.scrollElement.css("position") &&
            e.scrollElement.css("position", "relative")),
        d && (k = f(d))),
      (o = "left" === e.direction ? "scrollLeft" : o),
      e.scrollElement
        ? ((h = e.scrollElement),
          k.px || /^(?:HTML|BODY)$/.test(h[0].nodeName) || (m = h[o]()))
        : (h = a("html, body").firstScrollable(e.direction)),
      e.beforeScroll.call(h, e),
      (l = k.px
        ? k
        : {
            relative: "",
            px:
              (a(e.scrollTarget)[n]() && a(e.scrollTarget)[n]()[e.direction]) ||
              0,
          }),
      (p[o] = l.relative + (l.px + m + e.offset)),
      (i = e.speed),
      "auto" === i &&
        ((j = Math.abs(p[o] - h[o]())), (i = j / e.autoCoefficient)),
      (q = {
        duration: i,
        easing: e.easing,
        complete: function () {
          g(e);
        },
      }),
      e.step && (q.step = e.step),
      h.length ? h.stop().animate(p, q) : g(e);
  }),
    (a.smoothScroll.version = "2.2.0"),
    (a.smoothScroll.filterPath = function (a) {
      return (
        (a = a || ""),
        a
          .replace(/^\//, "")
          .replace(/(?:index|default).[a-zA-Z]{3,4}$/, "")
          .replace(/\/$/, "")
      );
    }),
    (a.fn.smoothScroll.defaults = c);
});
