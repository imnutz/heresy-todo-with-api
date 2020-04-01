(function () {
  'use strict';

  function hyphenizer(s,c){return s.replace(/([A-Z])([A-Z][a-z])/g,c='$1'+(c||'-')+'$2').replace(/([a-z])([A-Z])/g,c).toLowerCase()}

  /*! (c) Andrea Giammarchi - ISC */
  var self$1 = null || /* istanbul ignore next */ {};
  try { self$1.Event = new Event('.').constructor; }
  catch (Event) {
    try {
      self$1.Event = new CustomEvent('.').constructor;
    } catch (Event) {
      self$1.Event = function Event(type, init) {
        if (!init)
          init = {};
        var e = document.createEvent('Event');
        var bubbles = !!init.bubbles;
        var cancelable = !!init.cancelable;
        e.initEvent(type, bubbles, cancelable);
        try {
          e.bubbles = bubbles;
          e.cancelable = cancelable;
        } catch (e) {}
        return e;
      };
    }
  }
  var Event$1 = self$1.Event;

  /*! (c) Andrea Giammarchi - ISC */
  var self$2 = null || /* istanbul ignore next */ {};
  try { self$2.WeakSet = WeakSet; }
  catch (WeakSet) {
    // requires a global WeakMap (IE11+)
    (function (WeakMap) {
      var all = new WeakMap;
      var proto = WeakSet.prototype;
      proto.add = function (value) {
        return all.get(this).set(value, 1), this;
      };
      proto.delete = function (value) {
        return all.get(this).delete(value);
      };
      proto.has = function (value) {
        return all.get(this).has(value);
      };
      self$2.WeakSet = WeakSet;
      function WeakSet(iterable) {
        all.set(this, new WeakMap);
        if (iterable)
          iterable.forEach(this.add, this);
      }
    }(WeakMap));
  }
  var WeakSet$1 = self$2.WeakSet;

  var isNoOp = typeof document !== 'object';

  var templateLiteral = function (tl) {
    var RAW = 'raw';
    var isBroken = function (UA) {
      return /(Firefox|Safari)\/(\d+)/.test(UA) &&
            !/(Chrom[eium]+|Android)\/(\d+)/.test(UA);
    };
    var broken = isBroken((document.defaultView.navigator || {}).userAgent);
    var FTS = !(RAW in tl) ||
              tl.propertyIsEnumerable(RAW) ||
              !Object.isFrozen(tl[RAW]);
    if (broken || FTS) {
      var forever = {};
      var foreverCache = function (tl) {
        for (var key = '.', i = 0; i < tl.length; i++)
          key += tl[i].length + '.' + tl[i];
        return forever[key] || (forever[key] = tl);
      };
      // Fallback TypeScript shenanigans
      if (FTS)
        templateLiteral = foreverCache;
      // try fast path for other browsers:
      // store the template as WeakMap key
      // and forever cache it only when it's not there.
      // this way performance is still optimal,
      // penalized only when there are GC issues
      else {
        var wm = new WeakMap;
        var set = function (tl, unique) {
          wm.set(tl, unique);
          return unique;
        };
        templateLiteral = function (tl) {
          return wm.get(tl) || set(tl, foreverCache(tl));
        };
      }
    } else {
      isNoOp = true;
    }
    return TL(tl);
  };

  function TL(tl) {
    return isNoOp ? tl : templateLiteral(tl);
  }

  /*! (c) Andrea Giammarchi - ISC */

  // Custom
  var UID = '-' + Math.random().toFixed(6) + '%';
  //                           Edge issue!

  var UID_IE = false;

  try {
    if (!(function (template, content, tabindex) {
      return content in template && (
        (template.innerHTML = '<p ' + tabindex + '="' + UID + '"></p>'),
        template[content].childNodes[0].getAttribute(tabindex) == UID
      );
    }(document.createElement('template'), 'content', 'tabindex'))) {
      UID = '_dt: ' + UID.slice(1, -1) + ';';
      UID_IE = true;
    }
  } catch(meh) {}

  var UIDC = '<!--' + UID + '-->';

  // DOM
  var COMMENT_NODE = 8;
  var ELEMENT_NODE = 1;
  var TEXT_NODE = 3;

  var SHOULD_USE_TEXT_CONTENT = /^(?:style|textarea)$/i;
  var VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;

  /*! (c) Andrea Giammarchi - ISC */

  function domsanitizer (template) {
    return template.join(UIDC)
            .replace(selfClosing, fullClosing)
            .replace(attrSeeker, attrReplacer);
  }

  var spaces = ' \\f\\n\\r\\t';
  var almostEverything = '[^' + spaces + '\\/>"\'=]+';
  var attrName = '[' + spaces + ']+' + almostEverything;
  var tagName = '<([A-Za-z]+[A-Za-z0-9:._-]*)((?:';
  var attrPartials = '(?:\\s*=\\s*(?:\'[^\']*?\'|"[^"]*?"|<[^>]*?>|' + almostEverything.replace('\\/', '') + '))?)';

  var attrSeeker = new RegExp(tagName + attrName + attrPartials + '+)([' + spaces + ']*/?>)', 'g');
  var selfClosing = new RegExp(tagName + attrName + attrPartials + '*)([' + spaces + ']*/>)', 'g');
  var findAttributes = new RegExp('(' + attrName + '\\s*=\\s*)([\'"]?)' + UIDC + '\\2', 'gi');

  function attrReplacer($0, $1, $2, $3) {
    return '<' + $1 + $2.replace(findAttributes, replaceAttributes) + $3;
  }

  function replaceAttributes($0, $1, $2) {
    return $1 + ($2 || '"') + UID + ($2 || '"');
  }

  function fullClosing($0, $1, $2) {
    return VOID_ELEMENTS.test($1) ? $0 : ('<' + $1 + $2 + '></' + $1 + '>');
  }

  var tta = (...args) => args;

  /*! (c) Andrea Giammarchi - ISC */
  var Wire = (function (slice, proto) {

    proto = Wire.prototype;

    proto.ELEMENT_NODE = 1;
    proto.nodeType = 111;

    proto.remove = function (keepFirst) {
      var childNodes = this.childNodes;
      var first = this.firstChild;
      var last = this.lastChild;
      this._ = null;
      if (keepFirst && childNodes.length === 2) {
        last.parentNode.removeChild(last);
      } else {
        var range = this.ownerDocument.createRange();
        range.setStartBefore(keepFirst ? childNodes[1] : first);
        range.setEndAfter(last);
        range.deleteContents();
      }
      return first;
    };

    proto.valueOf = function (forceAppend) {
      var fragment = this._;
      var noFragment = fragment == null;
      if (noFragment)
        fragment = (this._ = this.ownerDocument.createDocumentFragment());
      if (noFragment || forceAppend) {
        for (var n = this.childNodes, i = 0, l = n.length; i < l; i++)
          fragment.appendChild(n[i]);
      }
      return fragment;
    };

    return Wire;

    function Wire(childNodes) {
      var nodes = (this.childNodes = slice.call(childNodes, 0));
      this.firstChild = nodes[0];
      this.lastChild = nodes[nodes.length - 1];
      this.ownerDocument = nodes[0].ownerDocument;
      this._ = null;
    }

  }([].slice));

  const {isArray} = Array;
  const wireType = Wire.prototype.nodeType;

  Object.freeze(Hole);

  function Hole(type, args) {
    this.type = type;
    this.args = args;
  }

  const svg = 'http://www.w3.org/2000/svg';
  const xhtml = 'http://www.w3.org/1999/xhtml';

  const create = element => document.createElementNS(xhtml, element);

  const createContent = (markup, type) =>
                          (type === 'svg' ? createSVG : createHTML)(markup);

  const createHTML = html => {
    const template = create('template');
    template.innerHTML = html;
    return template.content;
  };

  const createSVG = xml => {
    const {content} = create('template');
    const template = create('div');
    template.innerHTML = '<svg xmlns="' + svg + '">' + xml + '</svg>';
    const {childNodes} = template.firstChild;
    let {length} = childNodes;
    while (length--)
      content.appendChild(childNodes[0]);
    return content;
  };

  const {indexOf, slice} = [];

  const append = (get, parent, children, start, end, before) => {
    const isSelect = 'selectedIndex' in parent;
    let noSelection = isSelect;
    while (start < end) {
      const child = get(children[start], 1);
      parent.insertBefore(child, before);
      if (isSelect && noSelection && child.selected) {
        noSelection = !noSelection;
        let {selectedIndex} = parent;
        parent.selectedIndex = selectedIndex < 0 ?
          start :
          indexOf.call(parent.querySelectorAll('option'), child);
      }
      start++;
    }
  };

  const eqeq = (a, b) => a == b;

  const identity = O => O;

  const indexOf$1 = (
    moreNodes,
    moreStart,
    moreEnd,
    lessNodes,
    lessStart,
    lessEnd,
    compare
  ) => {
    const length = lessEnd - lessStart;
    /* istanbul ignore if */
    if (length < 1)
      return -1;
    while ((moreEnd - moreStart) >= length) {
      let m = moreStart;
      let l = lessStart;
      while (
        m < moreEnd &&
        l < lessEnd &&
        compare(moreNodes[m], lessNodes[l])
      ) {
        m++;
        l++;
      }
      if (l === lessEnd)
        return moreStart;
      moreStart = m + 1;
    }
    return -1;
  };

  const isReversed = (
    futureNodes,
    futureEnd,
    currentNodes,
    currentStart,
    currentEnd,
    compare
  ) => {
    while (
      currentStart < currentEnd &&
      compare(
        currentNodes[currentStart],
        futureNodes[futureEnd - 1]
      )) {
        currentStart++;
        futureEnd--;
      }  return futureEnd === 0;
  };

  const next = (get, list, i, length, before) => i < length ?
                get(list[i], 0) :
                (0 < i ?
                  get(list[i - 1], -0).nextSibling :
                  before);

  const remove = (get, children, start, end) => {
    while (start < end)
      drop(get(children[start++], -1));
  };

  // - - - - - - - - - - - - - - - - - - -
  // diff related constants and utilities
  // - - - - - - - - - - - - - - - - - - -

  const DELETION = -1;
  const INSERTION = 1;
  const SKIP = 0;
  const SKIP_OND = 50;

  const HS = (
    futureNodes,
    futureStart,
    futureEnd,
    futureChanges,
    currentNodes,
    currentStart,
    currentEnd,
    currentChanges
  ) => {

    let k = 0;
    /* istanbul ignore next */
    let minLen = futureChanges < currentChanges ? futureChanges : currentChanges;
    const link = Array(minLen++);
    const tresh = Array(minLen);
    tresh[0] = -1;

    for (let i = 1; i < minLen; i++)
      tresh[i] = currentEnd;

    const nodes = currentNodes.slice(currentStart, currentEnd);

    for (let i = futureStart; i < futureEnd; i++) {
      const index = nodes.indexOf(futureNodes[i]);
      if (-1 < index) {
        const idxInOld = index + currentStart;
        k = findK(tresh, minLen, idxInOld);
        /* istanbul ignore else */
        if (-1 < k) {
          tresh[k] = idxInOld;
          link[k] = {
            newi: i,
            oldi: idxInOld,
            prev: link[k - 1]
          };
        }
      }
    }

    k = --minLen;
    --currentEnd;
    while (tresh[k] > currentEnd) --k;

    minLen = currentChanges + futureChanges - k;
    const diff = Array(minLen);
    let ptr = link[k];
    --futureEnd;
    while (ptr) {
      const {newi, oldi} = ptr;
      while (futureEnd > newi) {
        diff[--minLen] = INSERTION;
        --futureEnd;
      }
      while (currentEnd > oldi) {
        diff[--minLen] = DELETION;
        --currentEnd;
      }
      diff[--minLen] = SKIP;
      --futureEnd;
      --currentEnd;
      ptr = ptr.prev;
    }
    while (futureEnd >= futureStart) {
      diff[--minLen] = INSERTION;
      --futureEnd;
    }
    while (currentEnd >= currentStart) {
      diff[--minLen] = DELETION;
      --currentEnd;
    }
    return diff;
  };

  // this is pretty much the same petit-dom code without the delete map part
  // https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L556-L561
  const OND = (
    futureNodes,
    futureStart,
    rows,
    currentNodes,
    currentStart,
    cols,
    compare
  ) => {
    const length = rows + cols;
    const v = [];
    let d, k, r, c, pv, cv, pd;
    outer: for (d = 0; d <= length; d++) {
      /* istanbul ignore if */
      if (d > SKIP_OND)
        return null;
      pd = d - 1;
      /* istanbul ignore next */
      pv = d ? v[d - 1] : [0, 0];
      cv = v[d] = [];
      for (k = -d; k <= d; k += 2) {
        if (k === -d || (k !== d && pv[pd + k - 1] < pv[pd + k + 1])) {
          c = pv[pd + k + 1];
        } else {
          c = pv[pd + k - 1] + 1;
        }
        r = c - k;
        while (
          c < cols &&
          r < rows &&
          compare(
            currentNodes[currentStart + c],
            futureNodes[futureStart + r]
          )
        ) {
          c++;
          r++;
        }
        if (c === cols && r === rows) {
          break outer;
        }
        cv[d + k] = c;
      }
    }

    const diff = Array(d / 2 + length / 2);
    let diffIdx = diff.length - 1;
    for (d = v.length - 1; d >= 0; d--) {
      while (
        c > 0 &&
        r > 0 &&
        compare(
          currentNodes[currentStart + c - 1],
          futureNodes[futureStart + r - 1]
        )
      ) {
        // diagonal edge = equality
        diff[diffIdx--] = SKIP;
        c--;
        r--;
      }
      if (!d)
        break;
      pd = d - 1;
      /* istanbul ignore next */
      pv = d ? v[d - 1] : [0, 0];
      k = c - r;
      if (k === -d || (k !== d && pv[pd + k - 1] < pv[pd + k + 1])) {
        // vertical edge = insertion
        r--;
        diff[diffIdx--] = INSERTION;
      } else {
        // horizontal edge = deletion
        c--;
        diff[diffIdx--] = DELETION;
      }
    }
    return diff;
  };

  const applyDiff = (
    diff,
    get,
    parentNode,
    futureNodes,
    futureStart,
    currentNodes,
    currentStart,
    currentLength,
    before
  ) => {
    const live = [];
    const length = diff.length;
    let currentIndex = currentStart;
    let i = 0;
    while (i < length) {
      switch (diff[i++]) {
        case SKIP:
          futureStart++;
          currentIndex++;
          break;
        case INSERTION:
          // TODO: bulk appends for sequential nodes
          live.push(futureNodes[futureStart]);
          append(
            get,
            parentNode,
            futureNodes,
            futureStart++,
            futureStart,
            currentIndex < currentLength ?
              get(currentNodes[currentIndex], 0) :
              before
          );
          break;
        case DELETION:
          currentIndex++;
          break;
      }
    }
    i = 0;
    while (i < length) {
      switch (diff[i++]) {
        case SKIP:
          currentStart++;
          break;
        case DELETION:
          // TODO: bulk removes for sequential nodes
          if (-1 < live.indexOf(currentNodes[currentStart]))
            currentStart++;
          else
            remove(
              get,
              currentNodes,
              currentStart++,
              currentStart
            );
          break;
      }
    }
  };

  const findK = (ktr, length, j) => {
    let lo = 1;
    let hi = length;
    while (lo < hi) {
      const mid = ((lo + hi) / 2) >>> 0;
      if (j < ktr[mid])
        hi = mid;
      else
        lo = mid + 1;
    }
    return lo;
  };

  const smartDiff = (
    get,
    parentNode,
    futureNodes,
    futureStart,
    futureEnd,
    futureChanges,
    currentNodes,
    currentStart,
    currentEnd,
    currentChanges,
    currentLength,
    compare,
    before
  ) => {
    applyDiff(
      OND(
        futureNodes,
        futureStart,
        futureChanges,
        currentNodes,
        currentStart,
        currentChanges,
        compare
      ) ||
      HS(
        futureNodes,
        futureStart,
        futureEnd,
        futureChanges,
        currentNodes,
        currentStart,
        currentEnd,
        currentChanges
      ),
      get,
      parentNode,
      futureNodes,
      futureStart,
      currentNodes,
      currentStart,
      currentLength,
      before
    );
  };

  const drop = node => (node.remove || dropChild).call(node);

  function dropChild() {
    const {parentNode} = this;
    /* istanbul ignore else */
    if (parentNode)
      parentNode.removeChild(this);
  }

  /*! (c) 2018 Andrea Giammarchi (ISC) */

  const domdiff = (
    parentNode,     // where changes happen
    currentNodes,   // Array of current items/nodes
    futureNodes,    // Array of future items/nodes
    options         // optional object with one of the following properties
                    //  before: domNode
                    //  compare(generic, generic) => true if same generic
                    //  node(generic) => Node
  ) => {
    if (!options)
      options = {};

    const compare = options.compare || eqeq;
    const get = options.node || identity;
    const before = options.before == null ? null : get(options.before, 0);

    const currentLength = currentNodes.length;
    let currentEnd = currentLength;
    let currentStart = 0;

    let futureEnd = futureNodes.length;
    let futureStart = 0;

    // common prefix
    while (
      currentStart < currentEnd &&
      futureStart < futureEnd &&
      compare(currentNodes[currentStart], futureNodes[futureStart])
    ) {
      currentStart++;
      futureStart++;
    }

    // common suffix
    while (
      currentStart < currentEnd &&
      futureStart < futureEnd &&
      compare(currentNodes[currentEnd - 1], futureNodes[futureEnd - 1])
    ) {
      currentEnd--;
      futureEnd--;
    }

    const currentSame = currentStart === currentEnd;
    const futureSame = futureStart === futureEnd;

    // same list
    if (currentSame && futureSame)
      return futureNodes;

    // only stuff to add
    if (currentSame && futureStart < futureEnd) {
      append(
        get,
        parentNode,
        futureNodes,
        futureStart,
        futureEnd,
        next(get, currentNodes, currentStart, currentLength, before)
      );
      return futureNodes;
    }

    // only stuff to remove
    if (futureSame && currentStart < currentEnd) {
      remove(
        get,
        currentNodes,
        currentStart,
        currentEnd
      );
      return futureNodes;
    }

    const currentChanges = currentEnd - currentStart;
    const futureChanges = futureEnd - futureStart;
    let i = -1;

    // 2 simple indels: the shortest sequence is a subsequence of the longest
    if (currentChanges < futureChanges) {
      i = indexOf$1(
        futureNodes,
        futureStart,
        futureEnd,
        currentNodes,
        currentStart,
        currentEnd,
        compare
      );
      // inner diff
      if (-1 < i) {
        append(
          get,
          parentNode,
          futureNodes,
          futureStart,
          i,
          get(currentNodes[currentStart], 0)
        );
        append(
          get,
          parentNode,
          futureNodes,
          i + currentChanges,
          futureEnd,
          next(get, currentNodes, currentEnd, currentLength, before)
        );
        return futureNodes;
      }
    }
    /* istanbul ignore else */
    else if (futureChanges < currentChanges) {
      i = indexOf$1(
        currentNodes,
        currentStart,
        currentEnd,
        futureNodes,
        futureStart,
        futureEnd,
        compare
      );
      // outer diff
      if (-1 < i) {
        remove(
          get,
          currentNodes,
          currentStart,
          i
        );
        remove(
          get,
          currentNodes,
          i + futureChanges,
          currentEnd
        );
        return futureNodes;
      }
    }

    // common case with one replacement for many nodes
    // or many nodes replaced for a single one
    /* istanbul ignore else */
    if ((currentChanges < 2 || futureChanges < 2)) {
      append(
        get,
        parentNode,
        futureNodes,
        futureStart,
        futureEnd,
        get(currentNodes[currentStart], 0)
      );
      remove(
        get,
        currentNodes,
        currentStart,
        currentEnd
      );
      return futureNodes;
    }

    // the half match diff part has been skipped in petit-dom
    // https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L391-L397
    // accordingly, I think it's safe to skip in here too
    // if one day it'll come out like the speediest thing ever to do
    // then I might add it in here too

    // Extra: before going too fancy, what about reversed lists ?
    //        This should bail out pretty quickly if that's not the case.
    if (
      currentChanges === futureChanges &&
      isReversed(
        futureNodes,
        futureEnd,
        currentNodes,
        currentStart,
        currentEnd,
        compare
      )
    ) {
      append(
        get,
        parentNode,
        futureNodes,
        futureStart,
        futureEnd,
        next(get, currentNodes, currentEnd, currentLength, before)
      );
      return futureNodes;
    }

    // last resort through a smart diff
    smartDiff(
      get,
      parentNode,
      futureNodes,
      futureStart,
      futureEnd,
      futureChanges,
      currentNodes,
      currentStart,
      currentEnd,
      currentChanges,
      currentLength,
      compare,
      before
    );

    return futureNodes;
  };

  var importNode = document.importNode;

  var trim = ''.trim;

  /* istanbul ignore next */
  var normalizeAttributes = UID_IE ?
    function (attributes, parts) {
      var html = parts.join(' ');
      return parts.slice.call(attributes, 0).sort(function (left, right) {
        return html.indexOf(left.name) <= html.indexOf(right.name) ? -1 : 1;
      });
    } :
    function (attributes, parts) {
      return parts.slice.call(attributes, 0);
    }
  ;

  function find(node, path) {
    var length = path.length;
    var i = 0;
    while (i < length)
      node = node.childNodes[path[i++]];
    return node;
  }

  function parse(node, holes, parts, path) {
    var childNodes = node.childNodes;
    var length = childNodes.length;
    var i = 0;
    while (i < length) {
      var child = childNodes[i];
      switch (child.nodeType) {
        case ELEMENT_NODE:
          var childPath = path.concat(i);
          parseAttributes(child, holes, parts, childPath);
          parse(child, holes, parts, childPath);
          break;
        case COMMENT_NODE:
          var textContent = child.textContent;
          if (textContent === UID) {
            parts.shift();
            holes.push(
              // basicHTML or other non standard engines
              // might end up having comments in nodes
              // where they shouldn't, hence this check.
              SHOULD_USE_TEXT_CONTENT.test(node.nodeName) ?
                Text(node, path) :
                Any(child, path.concat(i))
            );
          } else {
            switch (textContent.slice(0, 2)) {
              case '/*':
                if (textContent.slice(-2) !== '*/')
                  break;
              case '\uD83D\uDC7B': // ghost
                node.removeChild(child);
                i--;
                length--;
            }
          }
          break;
        case TEXT_NODE:
          // the following ignore is actually covered by browsers
          // only basicHTML ends up on previous COMMENT_NODE case
          // instead of TEXT_NODE because it knows nothing about
          // special style or textarea behavior
          /* istanbul ignore if */
          if (
            SHOULD_USE_TEXT_CONTENT.test(node.nodeName) &&
            trim.call(child.textContent) === UIDC
          ) {
            parts.shift();
            holes.push(Text(node, path));
          }
          break;
      }
      i++;
    }
  }

  function parseAttributes(node, holes, parts, path) {
    var cache = new Map;
    var attributes = node.attributes;
    var remove = [];
    var array = normalizeAttributes(attributes, parts);
    var length = array.length;
    var i = 0;
    while (i < length) {
      var attribute = array[i++];
      var direct = attribute.value === UID;
      var sparse;
      if (direct || 1 < (sparse = attribute.value.split(UIDC)).length) {
        var name = attribute.name;
        // the following ignore is covered by IE
        // and the IE9 double viewBox test
        /* istanbul ignore else */
        if (!cache.has(name)) {
          var realName = parts.shift().replace(
            direct ?
              /^(?:|[\S\s]*?\s)(\S+?)\s*=\s*('|")?$/ :
              new RegExp(
                '^(?:|[\\S\\s]*?\\s)(' + name + ')\\s*=\\s*(\'|")[\\S\\s]*',
                'i'
              ),
              '$1'
          );
          var value = attributes[realName] ||
                        // the following ignore is covered by browsers
                        // while basicHTML is already case-sensitive
                        /* istanbul ignore next */
                        attributes[realName.toLowerCase()];
          cache.set(name, value);
          if (direct)
            holes.push(Attr(value, path, realName, null));
          else {
            var skip = sparse.length - 2;
            while (skip--)
              parts.shift();
            holes.push(Attr(value, path, realName, sparse));
          }
        }
        remove.push(attribute);
      }
    }
    length = remove.length;
    i = 0;

    /* istanbul ignore next */
    var cleanValue = 0 < length && UID_IE && !('ownerSVGElement' in node);
    while (i < length) {
      // Edge HTML bug #16878726
      var attr = remove[i++];
      // IE/Edge bug lighterhtml#63 - clean the value or it'll persist
      /* istanbul ignore next */
      if (cleanValue)
        attr.value = '';
      // IE/Edge bug lighterhtml#64 - don't use removeAttributeNode
      node.removeAttribute(attr.name);
    }

    // This is a very specific Firefox/Safari issue
    // but since it should be a not so common pattern,
    // it's probably worth patching regardless.
    // Basically, scripts created through strings are death.
    // You need to create fresh new scripts instead.
    // TODO: is there any other node that needs such nonsense?
    var nodeName = node.nodeName;
    if (/^script$/i.test(nodeName)) {
      // this used to be like that
      // var script = createElement(node, nodeName);
      // then Edge arrived and decided that scripts created
      // through template documents aren't worth executing
      // so it became this ... hopefully it won't hurt in the wild
      var script = document.createElement(nodeName);
      length = attributes.length;
      i = 0;
      while (i < length)
        script.setAttributeNode(attributes[i++].cloneNode(true));
      script.textContent = node.textContent;
      node.parentNode.replaceChild(script, node);
    }
  }

  function Any(node, path) {
    return {
      type: 'any',
      node: node,
      path: path
    };
  }

  function Attr(node, path, name, sparse) {
    return {
      type: 'attr',
      node: node,
      path: path,
      name: name,
      sparse: sparse
    };
  }

  function Text(node, path) {
    return {
      type: 'text',
      node: node,
      path: path
    };
  }

  // globals

  var parsed = new WeakMap;
  var referenced = new WeakMap;

  function createInfo(options, template) {
    var markup = (options.convert || domsanitizer)(template);
    var transform = options.transform;
    if (transform)
      markup = transform(markup);
    var content = createContent(markup, options.type);
    cleanContent(content);
    var holes = [];
    parse(content, holes, template.slice(0), []);
    var info = {
      content: content,
      updates: function (content) {
        var updates = [];
        var len = holes.length;
        var i = 0;
        var off = 0;
        while (i < len) {
          var info = holes[i++];
          var node = find(content, info.path);
          switch (info.type) {
            case 'any':
              updates.push({fn: options.any(node, []), sparse: false});
              break;
            case 'attr':
              var sparse = info.sparse;
              var fn = options.attribute(node, info.name, info.node);
              if (sparse === null)
                updates.push({fn: fn, sparse: false});
              else {
                off += sparse.length - 2;
                updates.push({fn: fn, sparse: true, values: sparse});
              }
              break;
            case 'text':
              updates.push({fn: options.text(node), sparse: false});
              node.textContent = '';
              break;
          }
        }
        len += off;
        return function () {
          var length = arguments.length;
          if (len !== (length - 1)) {
            throw new Error(
              (length - 1) + ' values instead of ' + len + '\n' +
              template.join('${value}')
            );
          }
          var i = 1;
          var off = 1;
          while (i < length) {
            var update = updates[i - off];
            if (update.sparse) {
              var values = update.values;
              var value = values[0];
              var j = 1;
              var l = values.length;
              off += l - 2;
              while (j < l)
                value += arguments[i++] + values[j++];
              update.fn(value);
            }
            else
              update.fn(arguments[i++]);
          }
          return content;
        };
      }
    };
    parsed.set(template, info);
    return info;
  }

  function createDetails(options, template) {
    var info = parsed.get(template) || createInfo(options, template);
    var content = importNode.call(document, info.content, true);
    var details = {
      content: content,
      template: template,
      updates: info.updates(content)
    };
    referenced.set(options, details);
    return details;
  }

  function domtagger(options) {
    return function (template) {
      var details = referenced.get(options);
      if (details == null || details.template !== template)
        details = createDetails(options, template);
      details.updates.apply(null, arguments);
      return details.content;
    };
  }

  function cleanContent(fragment) {
    var childNodes = fragment.childNodes;
    var i = childNodes.length;
    while (i--) {
      var child = childNodes[i];
      if (
        child.nodeType !== 1 &&
        trim.call(child.textContent).length === 0
      ) {
        fragment.removeChild(child);
      }
    }
  }

  /*! (c) Andrea Giammarchi - ISC */
  var hyperStyle = (function (){  // from https://github.com/developit/preact/blob/33fc697ac11762a1cb6e71e9847670d047af7ce5/src/varants.js
    var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
    var hyphen = /([^A-Z])([A-Z]+)/g;
    return function hyperStyle(node, original) {
      return 'ownerSVGElement' in node ? svg(node, original) : update(node.style, false);
    };
    function ized($0, $1, $2) {
      return $1 + '-' + $2.toLowerCase();
    }
    function svg(node, original) {
      var style;
      if (original)
        style = original.cloneNode(true);
      else {
        node.setAttribute('style', '--hyper:style;');
        style = node.getAttributeNode('style');
      }
      style.value = '';
      node.setAttributeNode(style);
      return update(style, true);
    }
    function toStyle(object) {
      var key, css = [];
      for (key in object)
        css.push(key.replace(hyphen, ized), ':', object[key], ';');
      return css.join('');
    }
    function update(style, isSVG) {
      var oldType, oldValue;
      return function (newValue) {
        var info, key, styleValue, value;
        switch (typeof newValue) {
          case 'object':
            if (newValue) {
              if (oldType === 'object') {
                if (!isSVG) {
                  if (oldValue !== newValue) {
                    for (key in oldValue) {
                      if (!(key in newValue)) {
                        style[key] = '';
                      }
                    }
                  }
                }
              } else {
                if (isSVG)
                  style.value = '';
                else
                  style.cssText = '';
              }
              info = isSVG ? {} : style;
              for (key in newValue) {
                value = newValue[key];
                styleValue = typeof value === 'number' &&
                                    !IS_NON_DIMENSIONAL.test(key) ?
                                    (value + 'px') : value;
                if (!isSVG && /^--/.test(key))
                  info.setProperty(key, styleValue);
                else
                  info[key] = styleValue;
              }
              oldType = 'object';
              if (isSVG)
                style.value = toStyle((oldValue = info));
              else
                oldValue = newValue;
              break;
            }
          default:
            if (oldValue != newValue) {
              oldType = 'string';
              oldValue = newValue;
              if (isSVG)
                style.value = newValue || '';
              else
                style.cssText = newValue || '';
            }
            break;
        }
      };
    }
  }());

  const OWNER_SVG_ELEMENT = 'ownerSVGElement';

  // returns nodes from wires and components
  const asNode = (item, i) => item.nodeType === wireType ?
    (
      (1 / i) < 0 ?
        (i ? item.remove(true) : item.lastChild) :
        (i ? item.valueOf(true) : item.firstChild)
    ) :
    item
  ;

  // returns true if domdiff can handle the value
  const canDiff = value => 'ELEMENT_NODE' in value;

  // generic attributes helpers
  const hyperAttribute = (node, original) => {
    let oldValue;
    let owner = false;
    const attribute = original.cloneNode(true);
    return newValue => {
      if (oldValue !== newValue) {
        oldValue = newValue;
        if (attribute.value !== newValue) {
          if (newValue == null) {
            if (owner) {
              owner = false;
              node.removeAttributeNode(attribute);
            }
            attribute.value = newValue;
          } else {
            attribute.value = newValue;
            if (!owner) {
              owner = true;
              node.setAttributeNode(attribute);
            }
          }
        }
      }
    };
  };

  // events attributes helpers
  const hyperEvent = (node, name) => {
    let oldValue;
    let type = name.slice(2);
    if (name.toLowerCase() in node)
      type = type.toLowerCase();
    return newValue => {
      if (oldValue !== newValue) {
        if (oldValue)
          node.removeEventListener(type, oldValue, false);
        oldValue = newValue;
        if (newValue)
          node.addEventListener(type, newValue, false);
      }
    };
  };

  // special attributes helpers
  const hyperProperty = (node, name) => {
    let oldValue;
    return newValue => {
      if (oldValue !== newValue) {
        oldValue = newValue;
        if (node[name] !== newValue) {
          if (newValue == null) {
            // cleanup before dropping the attribute to fix IE/Edge gotcha
            node[name] = '';
            node.removeAttribute(name);
          } else
            node[name] = newValue;
        }
      }
    };
  };

  // special hooks helpers
  const hyperRef = node => {
    return ref => {
      ref.current = node;
    };
  };

  const hyperSetter = (node, name, svg) => svg ?
    value => {
      try {
        node[name] = value;
      }
      catch (nope) {
        node.setAttribute(name, value);
      }
    } :
    value => {
      node[name] = value;
    };

  // list of attributes that should not be directly assigned
  const readOnly = /^(?:form|list)$/i;

  // reused every slice time
  const slice$1 = [].slice;

  // simplifies text node creation
  const text = (node, text) => node.ownerDocument.createTextNode(text);

  function Tagger(type) {
    this.type = type;
    return domtagger(this);
  }

  Tagger.prototype = {

    // there are four kind of attributes, and related behavior:
    //  * events, with a name starting with `on`, to add/remove event listeners
    //  * special, with a name present in their inherited prototype, accessed directly
    //  * regular, accessed through get/setAttribute standard DOM methods
    //  * style, the only regular attribute that also accepts an object as value
    //    so that you can style=${{width: 120}}. In this case, the behavior has been
    //    fully inspired by Preact library and its simplicity.
    attribute(node, name, original) {
      switch (name) {
        case 'class':
          if (OWNER_SVG_ELEMENT in node)
            return hyperAttribute(node, original);
          name = 'className';
        case 'data':
        case 'props':
          return hyperProperty(node, name);
        case 'style':
          return hyperStyle(node, original, OWNER_SVG_ELEMENT in node);
        case 'ref':
          return hyperRef(node);
        default:
          if (name.slice(0, 1) === '.')
            return hyperSetter(node, name.slice(1), OWNER_SVG_ELEMENT in node);
          if (name.slice(0, 2) === 'on')
            return hyperEvent(node, name);
          if (name in node && !(
            OWNER_SVG_ELEMENT in node || readOnly.test(name)
          ))
            return hyperProperty(node, name);
          return hyperAttribute(node, original);

      }
    },

    // in a hyper(node)`<div>${content}</div>` case
    // everything could happen:
    //  * it's a JS primitive, stored as text
    //  * it's null or undefined, the node should be cleaned
    //  * it's a promise, update the content once resolved
    //  * it's an explicit intent, perform the desired operation
    //  * it's an Array, resolve all values if Promises and/or
    //    update the node with the resulting list of content
    any(node, childNodes) {
      const diffOptions = {node: asNode, before: node};
      const nodeType = OWNER_SVG_ELEMENT in node ? /* istanbul ignore next */ 'svg' : 'html';
      let fastPath = false;
      let oldValue;
      const anyContent = value => {
        switch (typeof value) {
          case 'string':
          case 'number':
          case 'boolean':
            if (fastPath) {
              if (oldValue !== value) {
                oldValue = value;
                childNodes[0].textContent = value;
              }
            } else {
              fastPath = true;
              oldValue = value;
              childNodes = domdiff(
                node.parentNode,
                childNodes,
                [text(node, value)],
                diffOptions
              );
            }
            break;
          case 'function':
            anyContent(value(node));
            break;
          case 'object':
          case 'undefined':
            if (value == null) {
              fastPath = false;
              childNodes = domdiff(
                node.parentNode,
                childNodes,
                [],
                diffOptions
              );
              break;
            }
          default:
            fastPath = false;
            oldValue = value;
            if (isArray(value)) {
              if (value.length === 0) {
                if (childNodes.length) {
                  childNodes = domdiff(
                    node.parentNode,
                    childNodes,
                    [],
                    diffOptions
                  );
                }
              } else {
                switch (typeof value[0]) {
                  case 'string':
                  case 'number':
                  case 'boolean':
                    anyContent(String(value));
                    break;
                  case 'function':
                    anyContent(value.map(invoke, node));
                    break;
                  case 'object':
                    if (isArray(value[0])) {
                      value = value.concat.apply([], value);
                    }
                  default:
                    childNodes = domdiff(
                      node.parentNode,
                      childNodes,
                      value,
                      diffOptions
                    );
                    break;
                }
              }
            } else if (canDiff(value)) {
              childNodes = domdiff(
                node.parentNode,
                childNodes,
                value.nodeType === 11 ?
                  slice$1.call(value.childNodes) :
                  [value],
                diffOptions
              );
            } else if ('text' in value) {
              anyContent(String(value.text));
            } else if ('any' in value) {
              anyContent(value.any);
            } else if ('html' in value) {
              childNodes = domdiff(
                node.parentNode,
                childNodes,
                slice$1.call(
                  createContent(
                    [].concat(value.html).join(''),
                    nodeType
                  ).childNodes
                ),
                diffOptions
              );
            } else if ('length' in value) {
              anyContent(slice$1.call(value));
            }
            break;
        }
      };
      return anyContent;
    },

    // style or textareas don't accept HTML as content
    // it's pointless to transform or analyze anything
    // different from text there but it's worth checking
    // for possible defined intents.
    text(node) {
      let oldValue;
      const textContent = value => {
        if (oldValue !== value) {
          oldValue = value;
          const type = typeof value;
          if (type === 'object' && value) {
            if ('text' in value) {
              textContent(String(value.text));
            } else if ('any' in value) {
              textContent(value.any);
            } else if ('html' in value) {
              textContent([].concat(value.html).join(''));
            } else if ('length' in value) {
              textContent(slice$1.call(value).join(''));
            }
          } else if (type === 'function') {
            textContent(value(node));
          } else {
            node.textContent = value == null ? '' : value;
          }
        }
      };
      return textContent;
    }
  };

  function invoke(callback) {
    return callback(this);
  }

  const {create: create$1, keys} = Object;
  const wm = new WeakMap;
  const container = new WeakMap;

  const dtPrototype = Tagger.prototype;

  let current = null;

  const lighterhtml = Tagger => {
    const html = outer('html', Tagger);
    const svg = outer('svg', Tagger);
    const inner = {
      html: innerTag('html', Tagger, true),
      svg: innerTag('svg', Tagger, true)
    };
    return {
      html, svg, inner,
      hook: useRef => ({
        html: createHook(useRef, html),
        svg: createHook(useRef, svg),
        inner
      }),
      render(node, callback) {
        const value = update.call(this, node, callback, Tagger);
        if (container.get(node) !== value) {
          container.set(node, value);
          appendClean(node, value);
        }
        return node;
      }
    };
  };

  const custom = overrides => {
    const prototype = create$1(dtPrototype);
    keys(overrides).forEach(key => {
      // assign the method after passing along the previous one
      // `convert` exposes the original domsanitizer while
      // all other unknown methods, including `transform`,
      // fallbacks to generic String
      prototype[key] = overrides[key](
        prototype[key] ||
        (key === 'convert' ? domsanitizer : String)
      );
    });
    Tagger$1.prototype = prototype;
    return lighterhtml(Tagger$1);
    function Tagger$1() {
      return Tagger.apply(this, arguments);
    }
  };

  const {html, svg: svg$1, inner, render, hook} = lighterhtml(Tagger);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function appendClean(node, fragment) {
    node.textContent = '';
    node.appendChild(fragment);
  }

  function asNode$1(result, forceFragment) {
    return result.nodeType === wireType ?
      result.valueOf(forceFragment) :
      result;
  }

  function createHook(useRef, view) {
    return function () {
      const ref = useRef(null);
      if (ref.current === null)
        ref.current = view.for(ref);
      return asNode$1(ref.current.apply(null, arguments), false);
    };
  }

  function innerTag(type, Tagger, hole) {
    return function () {
      const args = tta.apply(null, arguments);
      return hole || current ?
        new Hole(type, args) :
        new Tagger(type).apply(null, args);
    };
  }

  function outer(type, Tagger) {
    const wm = new WeakMap;
    const tag = innerTag(type, Tagger, false);
    tag.for = (identity, id) => {
      const ref = wm.get(identity) || set(identity);
      if (id == null)
        id = '$';
      return ref[id] || create(ref, id);
    };
    return tag;
    function create(ref, id) {
      let args = [];
      let wire = null;
      const tagger = new Tagger(type);
      const callback = () => tagger.apply(null, unrollArray(args, 1, 1, Tagger));
      return (ref[id] = function () {
        args = tta.apply(null, arguments);
        const result = update(tagger, callback, Tagger);
        return wire || (wire = wiredContent(result));
      });
    }
    function set(identity) {
      const ref = {'$': null};
      wm.set(identity, ref);
      return ref;
    }
  }

  function set(node) {
    const info = {
      i: 0, length: 0,
      stack: [],
      update: false
    };
    wm.set(node, info);
    return info;
  }

  function update(reference, callback, Tagger) {
    const prev = current;
    current = wm.get(reference) || set(reference);
    current.i = 0;
    const ret = callback.call(this);
    let value;
    if (ret instanceof Hole) {
      value = asNode$1(unroll(ret, 0, Tagger), current.update);
      const {i, length, stack, update} = current;
      if (i < length)
        stack.splice(current.length = i);
      if (update)
        current.update = false;
    } else {
      value = asNode$1(ret, false);
    }
    current = prev;
    return value;
  }

  function unroll(hole, level, Tagger) {
    const {i, length, stack} = current;
    const {type, args} = hole;
    const stacked = i < length;
    current.i++;
    if (!stacked)
      current.length = stack.push({
        l: level,
        kind: type,
        tag: null,
        tpl: args[0],
        wire: null
      });
    unrollArray(args, 1, level + 1, Tagger);
    const info = stack[i];
    if (stacked) {
      const {l:control, kind, tag, tpl, wire} = info;
      if (control === level && type === kind && tpl === args[0]) {
        tag.apply(null, args);
        return wire;
      }
    }
    const tag = new Tagger(type);
    const wire = wiredContent(tag.apply(null, args));
    info.l = level;
    info.kind = type;
    info.tag = tag;
    info.tpl = args[0];
    info.wire = wire;
    if (i < 1)
      current.update = true;
    return wire;
  }

  function unrollArray(arr, i, level, Tagger) {
    for (const {length} = arr; i < length; i++) {
      const value = arr[i];
      if (typeof value === 'object' && value) {
        if (value instanceof Hole) {
          arr[i] = unroll(value, level - 1, Tagger);
        } else if (isArray(value)) {
          arr[i] = unrollArray(value, 0, level++, Tagger);
        }
      }
    }
    return arr;
  }

  function wiredContent(node) {
    const childNodes = node.childNodes;
    const {length} = childNodes;
    return length === 1 ?
      childNodes[0] :
      (length ? new Wire(childNodes) : node);
  }

  let transpiled = null;
  // the angry koala check @WebReflection/status/1133757401482584064
  try { transpiled = new {o(){}}.o; } catch($) {}

  let extend = Super => class extends Super {};
  if (transpiled) {
    const {getPrototypeOf, setPrototypeOf} = Object;
    const {construct} = typeof Reflect === 'object' ? Reflect : {
      construct(Super, args, Target) {
        const a = [null];
        for (let i = 0; i < args.length; i++)
          a.push(args[i]);
        const Parent = Super.bind.apply(Super, a);
        return setPrototypeOf(new Parent, Target.prototype);
      }
    };
    extend = function (Super, cutTheMiddleMan) {
      function Class() {
        return construct(
          cutTheMiddleMan ?
            getPrototypeOf(Super) :
            Super,
          arguments,
          Class
        );
      }
      setPrototypeOf(Class.prototype, Super.prototype);
      return setPrototypeOf(Class, Super);
    };
  }

  const hash = s => {
    const {length} = s;
    let t = 0;
    let i = 0;
    while (i < length) {
      t = ((t << 5) - t) + s.charCodeAt(i++);
      t = t & t;
    }
    return t.toString(36);
  };

  const registry = {
    map: {},
    re: null
  };

  const regExp = keys => new RegExp(
    `<(/)?(${keys.join('|')})([^A-Za-z0-9:._-])`,
    'g'
  );

  let tmp = null;
  const replace = (markup, info) => {
    const {map, re} = (tmp || info);
    return markup.replace(re, (_, close, name, after) => {
      const {tagName, is, element} = map[name];
      return element ?
        (close ? `</${is}>` : `<${is}${after}`) :
        (close ? `</${tagName}>` : `<${tagName} is="${is}"${after}`);
    });
  };

  const selector = ({tagName, is, element}) =>
                    element ? is : `${tagName}[is="${is}"]`;

  const getInfo = () => tmp;
  const setInfo = info => { tmp = info; };

  const {
    render: lighterRender,
    html: lighterHTML,
    svg: lighterSVG
  } = custom({
    transform: $ => markup => replace(markup, registry)
  });

  const secret = '_\uD83D\uDD25';

  const {defineProperties} = Object;

  const $html = new WeakMap;
  const $svg = new WeakMap;
  const $mappedAttributes = new WeakMap;
  const ws = new WeakSet$1;

  const configurable = true;

  const attributeChangedCallback = 'attributeChangedCallback';
  const connectedCallback = 'connectedCallback';
  const disconnectedCallback = `dis${connectedCallback}`;

  const addInit = (prototype, properties, method) => {
    if (method in prototype) {
      const original = prototype[method];
      properties[method] = {
        configurable,
        value() {
          init.call(this);
          return original.apply(this, arguments);
        }
      };
    }
    else
      properties[method] = {
        configurable,
        value: init
      };
  };

  const augmented = Class => {

    const {prototype} = Class;

    const events = [];
    const properties = {
      html: {
        configurable,
        get: getHTML
      },
      svg: {
        configurable,
        get: getSVG
      }
    };

    properties[secret] = {
      value: {
        events,
        info: null
      }
    };

    if (!('handleEvent' in prototype))
      properties.handleEvent = {
        configurable,
        value: handleEvent
      };

    // setup the init dispatch only if needed
    // ensure render with an init is triggered after
    if ('oninit' in prototype) {
      events.push('init');
      addInit(prototype, properties, 'render');
    }

    // ensure all other callbacks are dispatched too
    addInit(prototype, properties, attributeChangedCallback);
    addInit(prototype, properties, connectedCallback);
    addInit(prototype, properties, disconnectedCallback);

    [
      [
        attributeChangedCallback,
        'onattributechanged',
        onattributechanged
      ],
      [
        connectedCallback,
        'onconnected',
        onconnected
      ],
      [
        disconnectedCallback,
        'ondisconnected',
        ondisconnected
      ],
      [
        connectedCallback,
        'render',
        onconnectedrender
      ]
    ].forEach(([ce, he, value]) => {
      if (!(ce in prototype) && he in prototype) {
        if (he !== 'render')
          events.push(he.slice(2));
        if (ce in properties) {
          const original = properties[ce].value;
          properties[ce] = {
            configurable,
            value() {
              original.apply(this, arguments);
              return value.apply(this, arguments);
            }
          };
        }
        else
          properties[ce] = {configurable, value};
      }
    });

    const booleanAttributes = Class.booleanAttributes || [];
    booleanAttributes.forEach(name => {
      if (!(name in prototype))
        properties[name] = {
          configurable,
          get() { return this.hasAttribute(name); },
          set(value) {
            if (!value || value === 'false')
              this.removeAttribute(name);
            else
              this.setAttribute(name, value);
          }
        };
    });

    const observedAttributes = Class.observedAttributes || [];
    observedAttributes.forEach(name => {
      if (!(name in prototype))
        properties[name] = {
          configurable,
          get() { return this.getAttribute(name); },
          set(value) {
            if (value == null)
              this.removeAttribute(name);
            else
              this.setAttribute(name, value);
          }
        };
    });

    const mappedAttributes = Class.mappedAttributes || [];
    mappedAttributes.forEach(name => {
      const _ = new WeakMap;
      const listening = ('on' + name) in prototype;
      if (listening)
        events.push(name);
      properties[name] = {
        configurable,
        get() { return _.get(this); },
        set(detail) {
          _.set(this, detail);
          if (listening) {
            const e = evt(name);
            e.detail = detail;
            if (ws.has(this))
              this.dispatchEvent(e);
            else {
              if (!$mappedAttributes.has(this))
                $mappedAttributes.set(this, []);
              $mappedAttributes.get(this).push(e);
            }
          }
        }
      };
    });

    defineProperties(prototype, properties);

    const attributes = booleanAttributes.concat(observedAttributes);
    return attributes.length ?
      defineProperties(Class, {
        observedAttributes: {
          configurable,
          get: () => attributes
        }
      }) :
      Class;
  };

  const evt = type => new Event$1(type);

  const html$1 = (...args) => new Hole('html', args);
  html$1.for = lighterHTML.for;

  const svg$2 = (...args) => new Hole('svg', args);
  svg$2.for = lighterSVG.for;

  const render$1 = (where, what) => lighterRender(
    where,
    typeof what === 'function' ? what : () => what
  );

  const setParsed = (wm, template, {info}) => {
    const value = (
      info ?
        replace(template.join(secret), info).split(secret) :
        template
    );
    wm.set(template, value);
    return value;
  };

  const setWrap = (self, type, wm) => {
    const fn = wrap(self, type, new WeakMap);
    wm.set(self, fn);
    return fn;
  };

  const wrap = (self, type, wm) => (tpl, ...values) => {
    const template = TL(tpl);
    const local = wm.get(template) ||
                  setParsed(wm, template, self[secret]);
    return lighterRender(self, () => type(local, ...values));
  };

  function addListener(type) {
    this.addEventListener(type, this);
  }

  function dispatchEvent(event) {
    this.dispatchEvent(event);
  }

  function getHTML() {
    return $html.get(this) || setWrap(this, html$1, $html);
  }

  function getSVG() {
    return $svg.get(this) || setWrap(this, svg$2, $svg);
  }

  function handleEvent(event) {
    this[`on${event.type}`](event);
  }

  function init() {
    if (!ws.has(this)) {
      ws.add(this);
      this[secret].events.forEach(addListener, this);
      this.dispatchEvent(evt('init'));
      const events = $mappedAttributes.get(this);
      if (events) {
        $mappedAttributes.delete(this);
        events.forEach(dispatchEvent, this);
      }
    }
  }

  function onattributechanged(attributeName, oldValue, newValue) {
    const event = evt('attributechanged');
    event.attributeName = attributeName;
    event.oldValue = oldValue;
    event.newValue = newValue;
    this.dispatchEvent(event);
  }

  function onconnected() {
    this.dispatchEvent(evt('connected'));
  }

  function onconnectedrender() {
    this.render();
  }

  function ondisconnected() {
    this.dispatchEvent(evt('disconnected'));
  }

  const {
    create: create$2,
    defineProperty,
    defineProperties: defineProperties$1,
    getOwnPropertyNames,
    getOwnPropertySymbols,
    getOwnPropertyDescriptor,
    keys: keys$1
  } = Object;

  const HTML = {element: HTMLElement};
  const cc = new WeakMap;
  const oc = new WeakMap;

  const info = (tagName, is) => ({tagName, is, element: tagName === 'element'});

  const define = ($, definition) => (
    typeof $ === 'string' ?
      register($, definition, '') :
      register($.name, $, '')
  ).Class;

  const fromClass = constructor => {
    const Class = extend(constructor, false);
    cc.set(constructor, augmented(Class));
    return Class;
  };

  const fromObject = (object, tag) => {
    const {statics, prototype} = grabInfo(object);
    const Class = extend(
      HTML[tag] || (HTML[tag] = document.createElement(tag).constructor),
      false
    );
    defineProperties$1(Class.prototype, prototype);
    defineProperties$1(Class, statics);
    oc.set(object, augmented(Class));
    return Class;
  };

  const grabInfo = object => {
    const statics = create$2(null);
    const prototype = create$2(null);
    const info = {prototype, statics};
    getOwnPropertyNames(object).concat(
      getOwnPropertySymbols(object)
    ).forEach(name => {
      const descriptor = getOwnPropertyDescriptor(object, name);
      descriptor.enumerable = false;
      switch (name) {
        case 'extends':
          name = 'tagName';
        case 'contains':
        case 'includes':
        case 'name':
        case 'booleanAttributes':
        case 'mappedAttributes':
        case 'observedAttributes':
        case 'style':
        case 'tagName':
          statics[name] = descriptor;
          break;
        default:
          prototype[name] = descriptor;
      }
    });
    return info;
  };

  const injectStyle = cssText => {
    if ((cssText || '').length) {
      const style = document.createElement('style');
      style.type = 'text/css';
      if (style.styleSheet)
        style.styleSheet.cssText = cssText;
      else
        style.appendChild(document.createTextNode(cssText));
      const head = document.head || document.querySelector('head');
      head.insertBefore(style, head.lastChild);
    }
  };

  const ref = (self, name) => self ?
    (self[name] || (self[name] = {current: null})) :
    {current: null};

  const register = ($, definition, uid) => {

    if (!/^([A-Z][A-Za-z0-9_]*)(<([A-Za-z0-9:._-]+)>|:([A-Za-z0-9:._-]+))?$/.test($))
      throw 'Invalid name';

    const {$1: name, $3: asTag, $4: asColon} = RegExp;
    let tagName = asTag ||
                  asColon ||
                  definition.tagName ||
                  definition.extends ||
                  "element";

    if (!/^[A-Za-z0-9:._-]+$/.test(tagName))
      throw 'Invalid tag';

    let hyphenizedName = '';
    let suffix = '';
    if (tagName.indexOf('-') < 0) {
      hyphenizedName = hyphenizer(name) + uid;
      if (hyphenizedName.indexOf('-') < 0)
        suffix = '-heresy';
    }
    else {
      hyphenizedName = tagName + uid;
      tagName = 'element';
    }
    const is = hyphenizedName + suffix;

    if (customElements.get(is))
      throw `Duplicated ${is} definition`;

    const Class = extend(
      typeof definition === 'object' ?
        (oc.get(definition) || fromObject(definition, tagName)) :
        (cc.get(definition) || fromClass(definition)),
      true
    );

    const element = tagName === 'element';
    defineProperty(Class, 'new', {
      value: element ?
        () => document.createElement(is) :
        () => document.createElement(tagName, {is})
    });
    defineProperty(Class.prototype, 'is', {value: is});

    // for some reason the class must be fully defined upfront
    // or components upgraded from the DOM won't have all details
    if (uid === '') {
      const id = hash(hyphenizedName.toUpperCase());
      registry.map[name] = setupIncludes(Class, tagName, is, {id, i: 0});
      registry.re = regExp(keys$1(registry.map));
    }

    const args = [is, Class];
    if (!element)
      args.push({extends: tagName});
    customElements.define(...args);

    return {Class, is, name, tagName};
  };

  const setupIncludes = (Class, tagName, is, u) => {
    const {prototype} = Class;
    const details = info(tagName, is);
    const styles = [selector(details)];
    const includes = Class.includes || Class.contains;
    if (includes) {
      const map = {};
      keys$1(includes).forEach($ => {
        const uid = `-${u.id}-${u.i++}`;
        const {Class, is, name, tagName} = register($, includes[$], uid);
        styles.push(selector(map[name] = setupIncludes(Class, tagName, is, u)));
      });
      const re = regExp(keys$1(map));
      const {events} = prototype[secret];
      const value = {
        events,
        info: {map, re}
      };
      defineProperty(prototype, secret, {value});
      if ('render' in prototype) {
        const {render} = prototype;
        const {info} = value;
        defineProperty(prototype, 'render', {
          value() {
            const tmp = getInfo();
            setInfo(info);
            const out = render.apply(this, arguments);
            setInfo(tmp);
            return out;
          }
        });
      }
    }
    if ('style' in Class)
      injectStyle(Class.style(...styles));
    return details;
  };

  var Header = {
    extends: 'header',
    render() {
      this.html`
      <h1>todos</h1>
      <input class="new-todo" placeholder="What needs to be done?" autofocus>
    `;
    }
  };

  var Item = {

    extends: 'li',

    mappedAttributes: ['value'],
    onvalue() { this.render(); },

    onclick(event) {
      event.stopPropagation();
      this.dispatchEvent(new CustomEvent('delete', {bubbles: true, detail: {id: this.value.id}}));
    },

    render() {
      const {completed, title} = this.value;
      this.classList.toggle('completed', completed);
      this.html`
    <div class="view">
      <input
        class="toggle" type="checkbox"
        checked=${completed}
      >
      <label>${title}</label>
      <button class="destroy" onclick=${this}></button>
    </div>`;
    }
  };

  var List = {

    extends: 'ul',
    includes: {Item},

    mappedAttributes: ['items'],
    onitems() { this.render(); },

    render() {
      const {items} = this;
      this.html`${Object.keys(items).map(
      key => html$1`<Item ondelete=${this} .value=${items[key]}/>`
    )}`;
    },

    ondelete(evt) {

    }
  };

  var Main = {
    extends: 'section',
    includes: { List },

    mappedAttributes: ['data'],
    ondata() { this.render(); },

    getActiveItems() {
      const items = this.data.items;
      return Object.keys(items).reduce((result, key) => {
        if (!items[key].completed) {
          result[key] = items[key];
        }

        return result;
      }, {});
    },

    getCompletedItems() {
      const items = this.data.items;
      return Object.keys(items).reduce((result, key) => {
        if (items[key].completed) {
          result[key] = items[key];
        }

        return result;
      }, {});
    },

    isAllDone() {
      return Object.keys(this.getCompletedItems()).length === Object.keys(this.data.items).length;
    },

    render() {
      const { displayActive, displayCompleted, displayAll } = this.data;
      let items = {};
      let shouldCheckAll = this.isAllDone();

      if (displayActive) {
        items = this.getActiveItems();
      } else if (displayCompleted) {
        items = this.getCompletedItems();
      } else if (displayAll) {
        items = this.data.items;
      }

      this.html`
      <input id="toggle-all" class="toggle-all" type="checkbox" checked=${shouldCheckAll}>
      <label for="toggle-all">Mark all as complete</label>
      <List
        class="todo-list"
        ref=${ref(this, 'list')}
        .items=${items}
      />
    `;
    }
  };

  var Footer = {
    extends: 'footer',

    mappedAttributes: ['count'],
    oncount() { this.render(); },

    render() {
      this.html`
      <span class="todo-count">${this.count}</span>
      <ul class="filters">
        <li>
          <a href="#/" class="all selected">All</a>
        </li>
        <li>
          <a href="#/active" class="active">Active</a>
        </li>
        <li>
          <a href="#/completed" class="completed">Completed</a>
        </li>
      </ul>
      <button class="clear-completed">Clear completed</button>
    `;
    }
  };

  var Todo = {

    // declaration + local components + CSS
    extends: 'section',
    includes: {Header, Main, Footer},

    mappedAttributes: ["data"],
    ondata() { this.render(); },

    style: (self /*, Header, Main, Footer*/) => `
    ${self} ul.completed > li:not(.completed),
    ${self} ul.active > li.completed {
      display: none;
    }
  `,

    // lifecycle events
    oninit() {
      this.header = ref();
      this.main = ref();
      this.footer = ref();
    },

    // render view
    render() {
      const tot = getCount(this.data.items);

      this.html`
      <Header class="header" ref=${this.header} onchange=${this} />
      <Main class="main" ref=${this.main} onchange=${this} ondelete=${this} .data=${this.data}/>
      <Footer class="footer" ref=${this.footer} count=${tot} onclick=${this}/>
    `;
    },

    // events handling
    onchange(event) {
      const {currentTarget, target} = event;
      switch (currentTarget) {
        case this.header.current:
          const value = target.value.trim();
          this.intents.createTodo(value);
          target.value = '';
          break;
        case this.main.current:
          if (target.className === 'toggle-all') {
            this.intents.markAllDone(target.checked);
          } else {
            const {value} = target.closest('li');
            this.intents.markDone(value.id, target.checked);
          }
          break;
      }
    },

    ondelete(evt) {
      const { id } = evt.detail;

      this.intents.deleteTodo(id);
    },

    onclick(event) {
      const {currentTarget, target} = event;
      switch (currentTarget) {
        case this.footer.current:
          if (target.className === 'clear-completed')
            this.intents.clearCompleted();
          else if (target.hash && !target.classList.contains('selected')) {
            currentTarget.querySelector('a.selected').classList.remove('selected');
            target.classList.add('selected');

            if (target.classList.contains('active')) {
              this.intents.showActive();
            } else if (target.classList.contains('completed')) {
              this.intents.showCompleted();
            } else if (target.classList.contains('all')) {
              this.intents.showAll();
            }
          }
          break;
      }
    }
  };

  function getCount(items) {
    return Object.keys(items).filter(key => !items[key].completed).length;
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var SAM = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
     module.exports = factory() ;
  }(commonjsGlobal, function () {
    // ISC License (ISC)
    // Copyright 2019 Jean-Jacques Dubray

    // Permission to use, copy, modify, and/or distribute this software for any purpose
    // with or without fee is hereby granted, provided that the above copyright notice
    // and this permission notice appear in all copies.

    // THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    // REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
    // FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT,
    // OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA
    // OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION,
    // ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.


    // Optional chaining implementation
    const O = (val, value = {}) => (val && (typeof val === 'object') ? val : value);
    const A = (val, value = []) => (val && Array.isArray(val) ? val : value);
    const S = (val, value = '') => (val && (typeof val === 'string') ? val : value);
    const N = (val, value = 0) => (Number.isNaN(val) ? value : val);
    const NZ = (val, value = 1) => (val === 0 || Number.isNaN(val) ? value === 0 ? 1 : value : val);
    const F = (f, f0 = () => null) => (f || f0);

    // Util functions often used in SAM implementations
    const first = (arr = []) => arr[0];
    const or = (acc, current) => acc || current;
    const and = (acc, current) => acc && current;
    const match = (conditions, values) => first(conditions.map((condition, index) => (condition ? values[index] : null)).filter(e));
    const step = () => ({});
    const doNotRender = model => () => model.continue() === true;
    const wrap = (s, w) => m => s(w(m));
    const log = f => (...args) => {
      console.log(args);
      f(...args);
    };
    const e = value => (Array.isArray(value)
      ? value.map(e).reduce(and, true)
      : value === true || (value !== null && value !== undefined));

    const i = (value, element) => {
      switch (typeof value) {
        case 'string': return typeof element === 'string' && value.includes(element)
        case 'object': return Array.isArray(value)
          ? value.includes(element)
          : typeof element === 'string' && e(value[element])
      }
      return value === element
    };

    const E = (value, element) => (e(value) && e(element)
      ? i(value, element)
      : e(value));

    const oneOf = (value, f, guard = true) => {
      e(value) && guard && f(value);
      return mon(e(value))
    };

    const on = (value, f, guard = true) => {
      e(value) && guard && f(value);
      return { on }
    };

    const mon = (triggered = true) => ({
      oneOf: triggered ? () => mon() : oneOf
    });

    const clone = (state) => {
      const comps = state.__components;
      delete state.__components;
      const cln = JSON.parse(JSON.stringify(state));
      if (comps) {
        cln.__components = [];
        if (comps.length > 0) {
          comps.forEach((c) => {
            delete c.parent;
            cln.__components.push(Object.assign(clone(c), { parent: cln }));
          });
        }
      }
      return cln
    };

    class History {
      constructor(h = [], options = {}) {
        this.currentIndex = 0;
        this.history = h;
        this.max = options.max;
      }

      snap(state, index) {
        const snapshot = clone(state);
        if (index) {
          this.history[index] = snapshot;
        } else {
          this.history.push(snapshot);
          if (this.max && this.history.length > this.max) {
            this.history.shift();
          }
        }
        return state
      }

      travel(index = 0) {
        this.currentIndex = index;
        return this.history[index]
      }

      next() {
        return this.history[this.currentIndex++]
      }

      hasNext() {
        return E(this.history[this.currentIndex])
      }

      last() {
        this.currentIndex = this.history.length - 1;
        return this.history[this.currentIndex]
      }
    }

    const handlers = {};

    var events = {
      on: (event, handler) => {
        if (!E(handlers[event])) {
          handlers[event] = [];
        }
        handlers[event].push(handler);
      },

      off: (event, handler) => {
        A(handlers[event]).forEach((h, i) => {
          if (h === handler) {
            handlers[event].splice(i, 1);
          }
        });
      },

      emit: (events = [], data) => {
        if (Array.isArray(events)) {
          events.forEach(event => A(handlers[event]).forEach(f => f(data)));
        } else {
          A(handlers[events]).forEach(f => f(data));
        }
      }
    };

    class Model {
      constructor(name) {
        this.__components = {};
        this.__behavior = [];
        this.__name = name;
        this.__lastProposalTimestamp = 0;
        this.__allowedActions = [];
        this.__eventQueue = [];
      }

      localState(name) {
        return E(name) ? this.__components[name] : {}
      }

      hasError() {
        return E(this.__error)
      }

      error() {
        return this.__error || undefined
      }

      errorMessage() {
        return O(this.__error).message
      }

      clearError() {
        return delete this.__error
      }

      allowedActions() {
        return this.__allowedActions
      }

      clearAllowedActions() {
        this.__allowedActions = [];
      }

      addAllowedActions(a) {
        this.__allowedActions.push(a);
      }

      resetBehavior() {
        this.__behavior = [];
      }

      update(snapshot = {}) {
        Object.assign(this, snapshot);
      }

      setComponentState(component) {
        this.__components[component.name] = Object.assign(O(component.localState), { parent: this });
        component.localState = component.localState || this.__components[component.name];
      }

      hasNext(val) {
        if (E(val)) {
          this.__hasNext = val;
        }
        return this.__hasNext
      }

      continue() {
        return this.__continue === true
      }

      renderNextTime() {
        delete this.__continue;
      }

      doNotRender() {
        this.__continue = true;
      }

      setLogger(logger) {
        this.__logger = logger;
      }

      log({
        trace, info, warning, error, fatal
      }) {
        if (this.logger) {
          oneOf(trace, this.logger.trace(trace))
            .oneOf(info, this.logger.info(info))
            .oneOf(warning, this.logger.waring(warning))
            .oneOf(error, this.logger.error(warning))
            .oneOf(fatal, this.logger.fatal(warning));
        }
      }

      prepareEvent(event, data) {
        this.__eventQueue.push([event, data]);
      }

      resetEventQueue() {
        this.__eventQueue = [];
      }

      flush() {
        if (this.continue() === false) {
          A(this.__eventQueue).forEach(([event, data]) => events.emit(event, data));
          this.__eventQueue = [];
        }
      }

      clone(state = this) {
        const comps = state.__components;
        delete state.__components;
        const cln = JSON.parse(JSON.stringify(state));
        if (comps) {
          cln.__components = {};

          Object.keys(comps).forEach((key) => {
            const c = comps[key];
            delete c.parent;
            cln.__components[key] = Object.assign(this.clone(c), { parent: cln });
          });
        }
        return cln
      }

      state(name, clone) {
        const prop = n => (E(this[n]) ? this[n] : (E(this.__components[n]) ? this.__components[n] : this));
        let state;
        if (Array.isArray(name)) {
          state = name.map(n => prop(n));
        } else {
          state = prop(name);
        }
        return clone && state ? this.clone(state) : state
      }
    }

    // ISC License (ISC)

    // This is an implementation of SAM using SAM's own principles
    // - SAM's internal model
    // - SAM's internal acceptors
    // - SAM's present function

    // eslint-disable-next-line arrow-body-style
    const stringify = (s, pretty) => {
      return (pretty ? JSON.stringify(s, null, 4) : JSON.stringify(s))
    };

    const display = (json = {}, pretty = false) => {
      const keys = Object.keys(json);
      return `${keys.map((key) => {
    if (typeof key !== 'string') {
      return ''
    }
    return key.indexOf('__') === 0 ? '' : stringify(json[key], pretty)
  }).filter(val => val !== '').join(', ')
  }`
    };

    const react = r => r();
    const accept = proposal => async a => a(proposal);


    function createInstance (options = {}) {
      const { max } = O(options.timetravel);
      const {
        hasAsyncActions = true,
        instanceName = 'global',
        synchronize = false,
        clone = false,
        requestStateRepresentation
      } = options;
      const { synchronizeInterval = 5 } = O(synchronize);

      // SAM's internal model
      let history;
      const model = new Model(instanceName);
      const mount = (arr = [], elements = [], operand = model) => elements.map(el => arr.push(el(operand)));
      let intents;
      const acceptors = [
        ({ __error }) => {
          if (__error) {
            if (__error.stack.indexOf('AssertionError') < 0) {
              model.__error = __error;
            } else {
              console.log('--------------------------------------');
              console.log(__error);
            }
          }
        }
      ];
      const reactors = [
        () => {
          model.hasNext(history ? history.hasNext() : false);
        }
      ];
      const naps = [];

      // ancillary
      let renderView = m => m.flush();
      let _render = m => m.flush();
      let storeRenderView = _render;

      // State Representation
      const state = () => {
        try {
          // Compute state representation
          reactors.forEach(react);

          // render state representation (gated by nap)
          if (!naps.map(react).reduce(or, false)) {
            renderView(clone ? model.clone() : model);
          }
          model.renderNextTime();
        } catch (err) {
          if (err.stack.indexOf('AssertionError') < 0) {
            setTimeout(() => present({ __error: err }), 0);
          } else {
            throw err
          }
        }
      };

      const storeBehavior = (proposal) => {
        if (E(proposal.__name)) {
          const actionName = proposal.__name;
          delete proposal.__name;
          const behavior = model.__formatBehavior
            ? model.__formatBehavior(actionName, proposal, model)
            : `${actionName}(${display(proposal)}) ==> ${display(model)}`;
          model.__behavior.push(behavior);
        }
      };

      const checkForOutOfOrder = (proposal) => {
        if (proposal.__startTime) {
          if (proposal.__startTime <= model.__lastProposalTimestamp) {
            return false
          }
          proposal.__startTime = model.__lastProposalTimestamp;
        }
        return true
      };

      const queue = {
        _queue: [],
        _rendering: false,
        add(args) {
          this._queue.push(args);
        },

        synchronize(present) {
          const self = this;
          this._interval = setInterval(async () => {
            if (!self._rendering && self._queue.length > 0) {
              self._rendering = true;
              const [proposal] = self._queue.slice(0, 1);
              self._queue.shift();
              proposal.__rendering = self._rendering;
              await present(...proposal);
              self._rendering = false;
            }
          }, synchronizeInterval);

          return (...args) => queue.add(args)
        },

        clear() {
          clearInterval(this._interval);
        }
      };

      let present = synchronize ? async (proposal, resolve) => {
        if (checkForOutOfOrder(proposal)) {
          model.resetEventQueue();
          // accept proposal
          await Promise.all(acceptors.map(await accept(proposal)));

          storeBehavior(proposal);

          // Continue to state representation
          state();
          resolve && resolve();
        }
      } : (proposal, resolve) => {
        if (checkForOutOfOrder(proposal)) {
          // accept proposal
          acceptors.forEach(accept(proposal));

          storeBehavior(proposal);

          // Continue to state representation
          state();
          resolve && resolve();
        }
      };

      if (synchronize) {
        present = queue.synchronize(present);
      }

      // SAM's internal acceptors
      const addInitialState = (initialState = {}) => {
        model.update(initialState);
        if (history) {
          history.snap(model, 0);
        }
        model.resetBehavior();
      };

      // eslint-disable-next-line no-shadow
      const rollback = (conditions = []) => conditions.map(condition => model => () => {
        const isNotSafe = condition.expression(model);
        if (isNotSafe) {
          model.log({ error: { name: condition.name, model } });
          // rollback if history is present
          if (history) {
            model.update(history.last());
            renderView(model);
          }
          return true
        }
        return false
      });

      const isAllowed = action => model.allowedActions().length === 0
                               || model.allowedActions().map(a => a === action).reduce(or, false);
      const acceptLocalState = (component) => {
        if (E(component.name)) {
          model.setComponentState(component);
        }
      };

      // add one component at a time, returns array of intents from actions
      const addComponent = (component = {}) => {
        const { ignoreOutdatedProposals = false, debounce = 0, retry } = component.options || {};

        if (retry) {
          retry.max = NZ(retry.max);
          retry.delay = N(retry.delay);
        }

        const debounceDelay = debounce;

        // Add component's private state
        acceptLocalState(component);

        // Decorate actions to present proposal to the model
        if (hasAsyncActions) {
          intents = A(component.actions).map((action) => {
            let needsDebounce = false;
            let retryCount = 0;

            const intent = async (...args) => {
              const startTime = new Date().getTime();

              if (isAllowed(action)) {
                if (debounceDelay > 0 && needsDebounce) {
                  needsDebounce = !O(args[0]).__resetDebounce;
                  return
                }

                let proposal = {};
                try {
                  proposal = await action(...args);
                } catch (err) {
                  if (retry) {
                    retryCount += 1;
                    if (retryCount < retry.max) {
                      setTimeout(() => intent(...args), retry.delay);
                    }
                    return
                  }
                  if (err.stack.indexOf('AssertionError') < 0) {
                    proposal.__error = err;
                  } else {
                    throw err
                  }
                }

                if (ignoreOutdatedProposals) {
                  proposal.__startTime = startTime;
                }

                try {
                  present(proposal);
                  retryCount = 0;
                } catch (err) {
                  // uncaught exception in an acceptor
                  if (err.stack.indexOf('AssertionError') < 0) {
                    present({ __error: err });
                  } else {
                    throw err
                  }
                }

                if (debounceDelay > 0) {
                  needsDebounce = true;
                  setTimeout(() => intent({ __resetDebounce: true }), debounceDelay);
                }
              }
            };
            return intent
          });
        } else {
          intents = A(component.actions).map(action => (...args) => {
            try {
              const proposal = action(...args);
              present(proposal);
            } catch (err) {
              if (err.stack.indexOf('AssertionError') < 0) {
                present({ __error: err });
              } else {
                throw err
              }
            }
          });
        }

        // Add component's acceptors,  reactors, naps and safety condition to SAM instance
        mount(acceptors, component.acceptors, component.localState);
        mount(reactors, component.reactors, component.localState);
        mount(naps, rollback(component.safety), component.localState);
        mount(naps, component.naps, component.localState);
      };

      const setRender = (render) => {
        const flushEventsAndRender = (m) => {
          m.flush && m.flush();
          render && render(m);
        };
        renderView = history ? wrap(flushEventsAndRender, s => (history ? history.snap(s) : s)) : flushEventsAndRender;
        _render = render;
      };

      const setLogger = (l) => {
        model.setLogger(l);
      };

      const setHistory = (h) => {
        history = new History(h, { max });
        model.hasNext(history.hasNext());
        model.resetBehavior();
        renderView = wrap(_render, s => (history ? history.snap(s) : s));
      };

      const timetravel = (travel = {}) => {
        let travelTo = {};
        if (E(history)) {
          if (travel.reset) {
            travel.index = 0;
            model.__behavior = [];
          }
          if (travel.next) {
            travelTo = history.next();
          } else if (travel.endOfTime) {
            travelTo = history.last();
          } else {
            travelTo = history.travel(travel.index);
          }
        }
        renderView(Object.assign(model, travelTo));
      };

      const setCheck = ({ begin = {}, end }) => {
        const { render } = begin;
        if (E(render)) {
          storeRenderView = renderView;
          renderView = render;
        }

        if (E(end)) {
          renderView = storeRenderView;
        }
      };

      const allowedActions = ({ actions = [], clear = false }) => {
        if (actions.length > 0) {
          model.addAllowedActions(actions);
        } else if (clear) {
          model.clearAllowedActions();
        }
        return model.allowedActions()
      };

      const addEventHandler = ([event, handler]) => events.on(event, handler);

      // SAM's internal present function
      return ({
        // eslint-disable-next-line no-shadow
        initialState, component, render, history, travel, logger, check, allowed, clearInterval, event
      }) => {
        intents = [];

        on(history, setHistory)
          .on(initialState, addInitialState)
          .on(component, addComponent)
          .on(render, setRender)
          .on(travel, timetravel)
          .on(logger, setLogger)
          .on(check, setCheck)
          .on(allowed, allowedActions)
          .on(clearInterval, () => queue.clear())
          .on(event, addEventHandler);

        return {
          hasNext: model.hasNext(),
          hasError: model.hasError(),
          errorMessage: model.errorMessage(),
          error: model.error(),
          intents,
          state: name => model.state(name, clone)
        }
      }
    }

    // ISC License (ISC)

    const SAM = createInstance();

    // ISC License (ISC)

    // A set of methods to use the SAM pattern
    var api = (SAM$1 = SAM) => ({
      // Core SAM API
      addInitialState: initialState => SAM$1({ initialState }),
      addComponent: component => SAM$1({ component }),
      setRender: (render) => {
        if (Array.isArray(render)) {
          const [display, representation] = render;
          render = state => display(typeof representation === 'function' ? representation(state) : state);
        }
        SAM$1({ render: F(render) });
      },
      addHandler: (event, handler) => SAM$1({ event: [event, handler] }),
      getIntents: actions => SAM$1({ component: { actions } }),
      addAcceptors: (acceptors, privateModel) => SAM$1({ component: { acceptors, privateModel } }),
      addReactors: (reactors, privateModel) => SAM$1({ component: { reactors, privateModel } }),
      addNAPs: (naps, privateModel) => SAM$1({ component: { naps, privateModel } }),
      addSafetyConditions: (safety, privateModel) => SAM$1({ component: { safety, privateModel } }),
      hasError: () => SAM$1({}).hasError,
      allow: actions => SAM$1({ allowed: { actions } }),
      clearAllowedActions: () => SAM$1({ allowed: { clear: true } }),
      allowedActions: () => SAM$1({ allowed: {} }),

      // Time Travel
      addTimeTraveler: (history = []) => SAM$1({ history }),
      travel: (index = 0) => SAM$1({ travel: { index } }),
      next: () => SAM$1({ travel: { next: true } }),
      last: () => SAM$1({ travel: { endOfTime: true } }),
      hasNext: () => SAM$1({}).hasNext,
      reset: initialState => (initialState ? SAM$1({ initialState }) : SAM$1({ travel: { reset: true } })),

      // Checker
      beginCheck: render => SAM$1({ check: { begin: { render } } }),
      endCheck: () => SAM$1({ check: { end: true } })
    });

    const permutations = (arr, perms, currentDepth, depthMax, noDuplicateAction, doNotStartWith) => {
      const nextLevel = [];
      if (perms.length === 0) {
        arr.forEach((i) => {
          if (doNotStartWith.length > 0) {
            const canAdd = doNotStartWith.map(name => i.name !== name).reduce(and, true);
            canAdd && nextLevel.push([i]);
          } else {
            nextLevel.push([i]);
          }
        });
      } else {
        perms.forEach(p => arr.forEach((i) => {
          const col = p.concat([i]);
          if (noDuplicateAction) {
            if (p[p.length - 1] !== i) {
              nextLevel.push(col);
            }
          } else {
            nextLevel.push(col);
          }
        }));
      }
      currentDepth++;
      if (currentDepth < depthMax) {
        return permutations(arr, nextLevel, currentDepth, depthMax, noDuplicateAction, doNotStartWith)
      }
      return nextLevel.filter(run => run.length === depthMax)
    };

    const prepareValuePermutations = (permutation) => {
      const indexMax = permutation.map(intent => A(O(intent).values).length);

      const modMax = indexMax.map((val, index) => {
        let out = 1;
        for (let j = index; j < indexMax.length; j++) {
          out *= indexMax[j];
        }
        return out
      });

      const increment = currentIndex => modMax.map(
        (m, index) => {
          if (index === modMax.length - 1) {
            return currentIndex % indexMax[index]
          }
          return Math.floor(currentIndex / modMax[index + 1]) % indexMax[index]
        }
      );

      const kmax = indexMax.reduce((acc, val) => acc * val, 1);
      if (kmax === 0) {
        throw new Error(['Checker: invalid dataset, one of the intents values has no value.',
          'If an intent has no parameter, add an empty array to its values'].join('\n'))
      }

      return { increment, kmax }
    };

    const apply = (perms = [], resetState, setBehavior) => {
      perms.forEach((permutation) => {
        let k = 0;
        const { increment, kmax } = prepareValuePermutations(permutation);
        do {
          // Process a permutation for all possible values
          const currentValueIndex = increment(k++);
          const currentValues = permutation.map((i, forIntent) => i.values[currentValueIndex[forIntent]]);
          // return to initial state
          resetState();
          setBehavior([]);

          // apply behavior (intent(...values))
          permutation.forEach((i, forIntent) => i.intent(...currentValues[forIntent]));
        } while (k < kmax)
      });
    };


    const checker = ({
      instance, initialState = {}, intents = [], reset, liveness, safety, options
    }, success = () => null, err = () => null) => {
      const { beginCheck, endCheck } = api(instance);
      const {
        depthMax = 5, noDuplicateAction = false, doNotStartWith = [], format
      } = options;

      const [behaviorIntent, formatIntent] = instance({
        component: {
          actions: [
            __behavior => ({ __behavior }),
            __setFormatBehavior => ({ __setFormatBehavior })
          ],
          acceptors: [
            model => ({ __behavior }) => {
              if (E(__behavior)) {
                model.__behavior = __behavior;
              }
            },
            model => ({ __setFormatBehavior }) => {
              if (E(__setFormatBehavior)) {
                model.__formatBehavior = __setFormatBehavior;
              }
            }
          ]
        }
      }).intents;

      formatIntent(format);

      const behavior = [];

      beginCheck((state) => {
        if (liveness && liveness(state)) {
          // console.log('check check', state)
          behavior.push({ liveness: state.__behavior });
          success(state.__behavior);
        }
        if (safety && safety(state)) {
          behavior.push({ safety: state.__behavior });
          err(state.__behavior);
        }
      });
      apply(
        permutations(intents, [], 0, depthMax, noDuplicateAction, doNotStartWith),
        () => reset(initialState),
        behaviorIntent);
      endCheck();
      return behavior
    };

    // ISC License (ISC)

    const {
      addInitialState, addComponent, setRender, addSafetyConditions,
      getIntents, addAcceptors, addReactors, addNAPs
    } = api();

    var index = {
      // Constructors
      SAM,
      createInstance,
      api,

      // SAM Core
      addInitialState,
      addComponent,
      addAcceptors,
      addReactors,
      addNAPs,
      addSafetyConditions,
      getIntents,
      setRender,

      // Utils
      step,
      doNotRender,
      first,
      match,
      on,
      oneOf,
      utils: {
        O, A, N, NZ, S, F, E, or, and, log
      },
      events: {
        on: events.on,
        off: events.off,
        emit: events.emit
      },
      checker
    };

    return index;

  }));
  });
  var SAM_1 = SAM.createInstance;
  var SAM_2 = SAM.api;
  var SAM_3 = SAM.doNotRender;
  var SAM_4 = SAM.addInitialState;
  var SAM_5 = SAM.addComponent;
  var SAM_6 = SAM.setRender;
  var SAM_7 = SAM.SAM;

  var initialState = {
    items: [],
    displayActive: false,
    displayCompleted: false,
    displayAll: true,

    getItems: function getItems() {
      return this.items;
    }
  };

  var header = {
    acceptors: [
      model => (proposal) => {
        if (proposal.todo) {
          model.creatingTodo = true;
          model.newTodo = {
            title: proposal.todo,
            completed: false
          };
        } else if (proposal.todoCreated) {
          const { id, title, completed } = proposal;
          model.items[id] = {
            id,
            title,
            completed
          };
          model.creatingTodo = false;
          model.newTodo = null;
        }

        return model;
      }
    ]
  };

  const ENDPOINT = "http://localhost:3000";

  var API = {
    getTodos() {
      return fetch(`${ENDPOINT}/todos`).then(response => response.json()).catch(e => console.error(e));
    },

    createTodo(todo) {
      return fetch(`${ENDPOINT}/todos`, {
        method: "POST",
        body: JSON.stringify(todo),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then(response => response.json());
    },

    updateTodo(todo) {
      return fetch(`${ENDPOINT}/todos/${todo.id}`, {
        method: "PUT",
        body: JSON.stringify(todo),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then(response => response.json());
    },

    deleteTodo(todo) {
      return fetch(`${ENDPOINT}/todos/${todo.id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then(response => response.json());
    }
  };

  var init$1 = {
    acceptors: [
      (model) => (proposal) => {
        if (proposal.apiItems) {
          model.items = proposal.apiItems;
        }

        return model;
      }
    ]
  };

  var main = {
    acceptors: [
      model => (proposal) => {
        let items = model.getItems();

        const {
          id,
          checked,
          markOne,
          markAll,
          deleteTodo,
          markingOneDone,
          markingAllDone,
          deletingTodoDone
        } = proposal;
        if (markOne && id && items[id]) {
          items[id].completed = checked;

          model.markingOne = true;
          model.markedTodo = items[id];
        }

        if (markingOneDone) {
          model.markingOne = false;
          model.markedTodo = null;
        }

        if (markAll) {
          Object.keys(items).forEach(key => {
            items[key].completed = checked;
          });

          model.markingAll = true;
        }

        if (markingAllDone) {
          model.markingAll = false;
        }

        if (id && deleteTodo) {
          Object.keys(items).forEach(key => {
            if (items[key].id === id) {
              model.deletingTodo = true;
              model.deletedTodo = items[key];
              delete items[key];
            }
          });
        }

        if (deletingTodoDone) {
          model.deletingTodo = false;
          model.deletedTodo = null;
        }

        return model;
      }
    ]
  };

  var footer = {
    acceptors: [
      model => proposal => {
        const {
          clearCompleted,
          showActive,
          showCompleted,
          showAll,
          deletingTodosDone
        } = proposal;

        let items = model.getItems();

        if (clearCompleted) {
          let deletedTodos = [];
          Object.keys(items).forEach(key => {
            if (items[key].completed) {
              deletedTodos.push(items[key]);
            }
          });

          model.deletingTodos = true;
          model.deletedTodos = deletedTodos;
        }

        if (showActive) {
          model.displayActive = true;
          model.displayCompleted = false;
          model.displayAll = false;
        }

        if (showCompleted) {
          model.displayActive = false;
          model.displayCompleted = true;
          model.displayAll = false;
        }

        if (showAll) {
          model.displayAll = true;
          model.displayActive = false;
          model.displayCompleted = false;
        }

        if (deletingTodosDone) {
          Object.keys(items).forEach(key => {
            if (items[key].completed) {
              delete items[key];
            }
          });

          model.deletingTodos = false;
          model.deletedItems = null;
        }

        return model;
      }
    ]
  };

  const getAllTodosAction = () => {
    return API.getTodos().then(todos => {
      const transformedTodos = todos.reduce((hash, todo) => {
        hash[todo.id] = todo;

        return hash;
      }, {});

      return {
        apiItems: transformedTodos
      };
    });
  };

  const createTodoAction = (value) => {
    return {
      todo: value
    };
  };

  const saveTodoAction = todo => {
    return API.createTodo(todo).then(newTodo => {
      return {
        todoCreated: true,
        ...newTodo
      };
    });
  };

  const markTodoAction = todo => {
    return API.updateTodo(todo).then(updatedTodo => {
      return {
        markingOneDone: true,
        ...updatedTodo
      };
    });
  };

  const markAllTodosAction = (todos) => {
    const promises = Object.keys(todos).map(key => {
      return markTodoAction(todos[key]);
    });

    return Promise.all(promises).then(res => ({ markingAllDone: true }));
  };

  const apiDeleteTodoAction = (todo) => {
    return API.deleteTodo(todo).then(() => ({ deletingTodoDone: true }));
  };

  const apiDeleteTodosAction = (todos) => {
    const promises = todos.map(apiDeleteTodoAction);

    return Promise.all(promises).then(() => ({ deletingTodosDone: true }));
  };

  const markDoneAction = (id, checked) => ({ markOne: true, id, checked });
  const markAllDoneAction = (checked) => ({ markAll: true, checked });
  const deleteTodoAction = (id) => ({ deleteTodo: true, id });

  const clearCompletedAction = () => ({ clearCompleted: true });
  const showActiveAction = () => ({ showActive: true });
  const showCompletedAction = () => ({ showCompleted: true });
  const showAllAction = () => ({ showAll: true });

  var setupAction = (sam) => {
    const nap = (model) => () => {
      if (model.creatingTodo) {
        saveTodo(model.newTodo);
        return true;
      } else if (model.markingOne) {
        markTodo(model.markedTodo);
        return true;
      } else if (model.markingAll) {
        markAllTodos(model.items);
        return true;
      } else if (model.deletingTodo) {
        apiDeleteTodo(model.deletedTodo);
        return true;
      } else if (model.deletingTodos) {
        apiDeleteTodos(model.deletedTodos);
        return true;
      }

      return false;
    };
    sam.addNAPs([nap]);

    const { intents } = sam.getIntents([
      getAllTodosAction,
      createTodoAction,
      saveTodoAction,
      markDoneAction,
      markAllDoneAction,
      deleteTodoAction,
      clearCompletedAction,
      showActiveAction,
      showCompletedAction,
      showAllAction,
      markTodoAction,
      markAllTodosAction,
      apiDeleteTodoAction,
      apiDeleteTodosAction
    ]);

    const [
      getAllTodos,
      createTodo,
      saveTodo,
      markDone,
      markAllDone,
      deleteTodo,
      clearCompleted,
      showActive,
      showCompleted,
      showAll,
      markTodo,
      markAllTodos,
      apiDeleteTodo,
      apiDeleteTodos
    ] = intents;

    return {
      getAllTodos,
      createTodo,
      markDone,
      markAllDone,
      deleteTodo,
      clearCompleted,
      showActive,
      showCompleted,
      showAll
    };
  };

  const todoSam = SAM_2(SAM_7);

  const samWrapper = {
    header,
    init: init$1,
    main,
    footer,
    samApi: todoSam,

    setup() {
      // setup Model
      this.samApi.addInitialState(initialState);

      this.intents = setupAction(this.samApi);

      this.samApi.addComponent(this.header);
      this.samApi.addComponent(this.main);
      this.samApi.addComponent(this.init);
      this.samApi.addComponent(this.footer);

      // this.intents = {
      //   ...actions,
      //   clearCompleted,
      //   showActive,
      //   showCompleted,
      //   showAll,
      // };
    },

    setRenderer(renderer) {
      this.samApi.setRender(renderer);
    },

    start() {
      this.intents.getAllTodos();
    }
  };

  samWrapper.setup();

  define('Todo', Todo);

  const renderer = (state) => {
    const appEl = document.querySelector("#todo-app");
    render$1(appEl, html$1`<Todo .data=${state} .intents=${samWrapper.intents} />`);
  };


  samWrapper.setRenderer(renderer);
  samWrapper.start();

}());
