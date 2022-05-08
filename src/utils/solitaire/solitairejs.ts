const win = window,
  doc = document,
  body = doc.body;

/**
 * Default configuration properties
 * @type {Object}
 */
const defaultConfig = {};

/**
 * Object.assign polyfill
 * @param  {Object} target
 * @param  {Object} args
 * @return {Object}
 */
const extend = function (r, t) {
  for (var e = Object(r), n = 1; n < arguments.length; n++) {
    const a = arguments[n];
    if (null != a) for (const o in a) Object.prototype.hasOwnProperty.call(a, o) && (e[o] = a[o]);
  }
  return e;
};

/**
 * Add event listener to target
 * @param  {Object} el
 * @param  {String} e
 * @param  {Function} fn
 */
const on = function (el, e, fn) {
  el.addEventListener(e, fn, false);
};

/**
 * Iterator helper
 * @param  {(Array|Object)}   arr Any object, array or array-like collection.
 * @param  {Function} f   The callback function
 * @param  {Object}   s      Change the value of this
 * @return {Void}
 */
const each = function (arr, fn, s) {
  if ('[object Object]' === Object.prototype.toString.call(arr)) {
    for (const d in arr) {
      if (Object.prototype.hasOwnProperty.call(arr, d)) {
        fn.call(s, d, arr[d]);
      }
    }
  } else {
    for (let e = 0, f = arr.length; e < f; e++) {
      fn.call(s, e, arr[e]);
    }
  }
};

/**
 * Mass assign style properties
 * @param  {Object} t
 * @param  {(String|Object)} e
 * @param  {String|Object}
 */
const style = function (t, e) {
  const i = t && t.style,
    n = '[object Object]' === Object.prototype.toString.call(e);
  if (i) {
    if (!e) return win.getComputedStyle(t);
    n &&
      each(e, function (t, e) {
        t in i || (t = '-webkit-' + t), (i[t] = e + ('string' == typeof e ? '' : 'opacity' === t ? '' : 'px'));
      });
  }
};

/**
 * Get an element's DOMRect relative to the document instead of the viewport.
 * @param  {Object} t   HTMLElement
 * @param  {Boolean} e  Include margins
 * @return {Object}     Formatted DOMRect copy
 */
const rect = function (e) {
  const t = win,
    o = e.getBoundingClientRect(),
    b = doc.documentElement || body.parentNode || body,
    d = void 0 !== t.pageXOffset ? t.pageXOffset : b.scrollLeft,
    n = void 0 !== t.pageYOffset ? t.pageYOffset : b.scrollTop;
  return {
    left: o.left + d,
    top: o.top + n,
    height: Math.round(o.height),
    width: Math.round(o.width),
  };
};

const getRandomInt = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

/* EMITTER */
const Emitter = function () {};
Emitter.prototype = {
  on: function (event, fct) {
    this._events = this._events || {};
    this._events[event] = this._events[event] || [];
    this._events[event].push(fct);
  },
  off: function (event, fct) {
    this._events = this._events || {};
    if (event in this._events === false) return;
    this._events[event].splice(this._events[event].indexOf(fct), 1);
  },
  emit: function (event /* , args... */) {
    this._events = this._events || {};
    if (event in this._events === false) return;
    for (let i = 0; i < this._events[event].length; i++) {
      this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
    }
  },
};

Emitter.mixin = function (obj) {
  const props = ['on', 'off', 'emit'];
  for (let i = 0; i < props.length; i++) {
    if (typeof obj === 'function') {
      obj.prototype[props[i]] = Emitter.prototype[props[i]];
    } else {
      obj[props[i]] = Emitter.prototype[props[i]];
    }
  }
  return obj;
};

// VECTOR
function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype = {
  add: function (v) {
    (this.x += v.x), (this.y += v.y);
  },
};

// CARD
function Card(value, suit) {
  this.value = value;
  this.suit = suit;

  this.flipped = false;
  this.picture = this.value > 10;

  switch (this.suit) {
    case 'hearts':
    case 'diamonds':
      this.color = 'red';
      break;
    case 'clubs':
    case 'spades':
      this.color = 'black';
      break;
  }

  const cards = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];

  const template = [
    "<div class='front'><div class='value'>",
    cards[this.value - 1],
    "</div><div class='value'>",
    cards[this.value - 1],
    "</div><div class='middle'>",
  ];

  if (!this.picture) {
    for (let i = 0; i < this.value; i++) {
      template.push('<span></span>');
    }
  }

  template.push("</div></div><div class='rear'></div>");

  const card = doc.createElement('div');
  card.className = `card ${this.suit} card-${this.picture ? cards[this.value - 1] : this.value}`;
  card.innerHTML = template.join('');

  if (this.picture) {
    card.classList.add('picture');
  }

  card.card = true;

  this.el = card;
}

Card.prototype.flip = function () {
  this.el.classList.toggle('flipped', !this.flipped);
  this.el.draggable = !this.flipped;
  this.flipped = !this.flipped;

  if (!this.flipped) {
    this.el.style.transform = '';
  }
};

// PACK
function Pack() {
  this.cards = [];
  this.suits = ['hearts', 'spades', 'diamonds', 'clubs'];

  let count = 0;
  each(
    this.suits,
    function (i, suit) {
      for (var i = 1; i < 14; i++) {
        const card = new Card(i, suit);
        card.el.idx = count;
        this.cards.push(card);
        count++;
      }
    },
    this,
  );
}

Pack.prototype.shuffle = function () {
  let m = this.cards.length,
    t,
    i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = this.cards[m];
    this.cards[m] = this.cards[i];
    this.cards[i] = t;

    this.cards[i].el.idx = i;
    this.cards[m].el.idx = m;
  }
};

// GAME
export function Game(el, options) {
  if (typeof el === 'string') {
    el = document.querySelector(el);
  }

  this.el = el;

  this.options = extend(defaultConfig, options);

  this.score = 0;

  this.animationInterval = 250;

  this.stackToColumn = false;

  this.history = [];

  this.pack = new Pack();

  this.autoStacking = false;

  Emitter.mixin(this);

  this.render();
}

Game.prototype.render = function () {
  const frag = document.createDocumentFragment();

  this.columns = doc.createElement('div');
  this.columns.className = 'columns';

  this.stacks = doc.createElement('div');
  this.stacks.className = 'stacks';

  /* create stacks */
  for (var i = 0; i < 4; i++) {
    const stack = doc.createElement('div');
    stack.className = 'stack';
    this.stacks.appendChild(stack);
  }

  /* Create columns */
  for (var i = 0; i < 7; i++) {
    const column = doc.createElement('div');
    column.className = 'column';
    this.columns.appendChild(column);
  }

  this.dealer = doc.createElement('div');
  this.dealer.className = 'dealer';

  this.packArea = doc.createElement('div');
  this.packArea.className = 'pack';

  this.dealArea = doc.createElement('div');
  this.dealArea.className = 'dealt';

  this.dealer.appendChild(this.packArea);
  this.dealer.appendChild(this.dealArea);

  frag.appendChild(this.dealer);
  frag.appendChild(this.stacks);
  frag.appendChild(this.columns);

  this.el.appendChild(frag);

  this.mouse = {
    x: 0,
    y: 0,
  };

  const id = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/86186/cards-{t}.png';
  this.images = {
    clubs: id.replace('{t}', 'clubs'),
    spades: id.replace('{t}', 'spades'),
    diamonds: id.replace('{t}', 'diamonds'),
    hearts: id.replace('{t}', 'hearts'),
  };

  each(
    this.images,
    function (i, src) {
      const image = new Image();

      image.crossOrigin = 'anonymous';

      image.onload = function () {
        //
      };

      image.src = src;

      this.images[i] = image;
    },
    this,
  );

  this.events = {
    click: this.click.bind(this),
    mousedown: this.mousedown.bind(this),
    keydown: this.keydown.bind(this),
    mouseup: this.mouseup.bind(this),
    dragstart: this.dragstart.bind(this),
    dragenter: this.dragenter.bind(this),
    dragover: this.dragover.bind(this),
    dragend: this.dragend.bind(this),
  };

  on(this.dealer, 'click', this.events.click);

  on(this.el, 'mousedown', this.events.mousedown);
  on(doc, 'keydown', this.events.keydown);
  on(doc, 'mouseup', this.events.mouseup);

  on(doc, 'dragstart', this.events.dragstart);
  on(doc, 'dragenter', this.events.dragenter);
  on(doc, 'dragover', this.events.dragover);
  on(doc, 'dragend', this.events.dragend);
};

Game.prototype.click = function (e) {
  const t = e.target;
  if (t.classList.contains('pack')) {
    e.stopImmediatePropagation();
    this.deal();
  }
};

Game.prototype.keydown = function (e) {
  const k = e.key;

  if (e.ctrlKey) {
    switch (k) {
      case 'z':
        this.undo();
        break;
    }
  }
};

Game.prototype.mousedown = function (e) {
  if (this.autoStacking) {
    return false;
  }

  const t = e.target.closest('.card');

  if (t && t.card) {
    this.siblings = [];
    const card = this.pack.cards[t.idx];
    const next = card.el.nextElementSibling;

    card.checked = false;

    card.origin = {
      x: e.pageX,
      y: e.pageY,
    };

    card.el.classList.add('dragging');

    this.activeCard = card;

    this.startParent = card.el.parentNode;

    // grab the cards on top as well
    if (next) {
      const p = next.parentNode;
      const idx = Array.from(p.children).indexOf(next);
      for (let i = idx; i < p.childElementCount; i++) {
        const c = p.children[i];
        c.classList.add('dragging');
        this.siblings.push(c);
      }
    }
  }
};

Game.prototype.dragstart = function (e) {
  e.dataTransfer.effectAllowed = 'copy';
  e.dataTransfer.setData('text/html', '');

  // Create blank image to hide the ghost
  const dragIcon = doc.createElement('img');
  e.dataTransfer.setDragImage(dragIcon, -10, -10);

  this.dragging = true;
};

Game.prototype.dragenter = function (e) {
  const t = e.target;
  const column = t.classList.contains('column');
  const stack = t.classList.contains('stack');
  const canDrop = t.card || column || stack;

  if (this.activeColumn) {
    this.activeColumn.classList.remove('over');
  }

  if (canDrop) {
    if (column || stack) {
      this.activeColumn = t;
    } else {
      this.activeColumn = t.parentNode;
    }

    this.activeColumn.classList.add('over');
  }
};

Game.prototype.dragover = function (e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'over';

  // Physically drag the card instead of using the D&D ghost
  if (this.activeCard && this.dragging) {
    const c = this.activeCard;
    const x = e.pageX - c.origin.x;
    const y = e.pageY - c.origin.y;
    const css =
      'pointer-events: none; transform: scale(1.05, 1.05) rotateX(0deg) translate3d(' + x + 'px, ' + y + 'px, 0px);';

    this.activeCard.el.style.cssText = css;

    if (this.siblings.length) {
      each(
        this.siblings,
        function (i, card) {
          card.style.cssText = css;
        },
        this,
      );
    }
  }
};

Game.prototype.dragend = function (e) {
  if (this.activeCard && this.dragging) {
    const c = this.activeCard;
    c.el.classList.remove('dragging');

    const x = e.pageX - c.origin.x;
    const y = e.pageY - c.origin.y;

    c.el.style.cssText = '';

    if (this.siblings.length) {
      each(
        this.siblings,
        function (i, card) {
          card.classList.remove('dragging');
          card.style.cssText = '';
        },
        this,
      );
    }

    if (this.activeColumn) {
      this.activeColumn.classList.remove('over');
    }

    if (this.isLegalMove()) {
      const prev = c.el.previousElementSibling;

      // Flip the last card
      if (prev) {
        const card = this.pack.cards[prev.idx];

        if (!card.flipped) {
          card.prevState = card.flipped;
          card.flip();
          this.score += 5;
        }
      }

      this.stackToColumn = c.el.parentNode.classList.contains('stack');

      this.pickCount = c.el.parentNode.childElementCount;
      this.dropCount = this.activeColumn.childElementCount;

      this.activeColumn.appendChild(c.el);

      this.updateScore();

      if (this.siblings.length) {
        each(
          this.siblings,
          function (i, card) {
            if (
              this.activeCard.value === 13 &&
              this.dropCount === 0 &&
              !this.startParent.classList.contains('dealt') &&
              c.el.parentNode.firstElementChild === c.el
            ) {
            } else {
              this.score += 5;
            }
            c.el.parentNode.appendChild(card);
            card.classList.remove('dragging');
          },
          this,
        );
      }

      this.updateHistory();

      this.startParent.classList.toggle('empty', !this.startParent.childElementCount);
      this.activeColumn.classList.toggle('empty', !this.activeColumn.childElementCount);

      this.emit('change');
    }
  }

  if (!this.stackToColumn) {
    this.check();
  }
};

Game.prototype.mouseup = function (e) {
  if (this.activeCard) {
    this.activeCard.el.classList.remove('dragging');
    this.activeCard = false;

    if (this.siblings.length) {
      each(
        this.siblings,
        function (i, card) {
          card.classList.remove('dragging');
        },
        this,
      );
    }
  }
  this.hinted = false;

  this.emit('change');
};

Game.prototype.updateHistory = function (card, start, end, siblings) {
  let obj = {};

  if (Array.isArray(card)) {
    obj.deal = true;
  } else {
    card = card || this.activeCard;
    start = start || this.startParent;
    end = end || this.activeColumn;
    siblings = siblings || this.siblings;

    // Max moves to store
    var max = 10;

    const cards = this.pack.cards;
    const prev = card.el.previousElementSibling;

    obj = {
      card: card, // the card that was moved
      start: start, // the original column
      end: end, // the column the card was dropped in
      siblings: siblings, // any siblings
    };

    if (prev) {
      obj.prevSibling = {
        card: cards[prev.idx],
        flipped: cards[prev.idx].flipped, // was it hidden?
      };
    }
  }

  // Add the move to the history
  this.history.push(obj);

  // If the number of stored moves exceeds the max allowed
  // remove the oldest moves until we're at the max allowed
  if (this.history.length > max) {
    this.history.splice(0, this.history.length - max);
  }
};

Game.prototype.updateScore = function (start, stop) {
  start = start || this.startParent;
  stop = stop || this.activeColumn;

  // Moving Kings from empty column to empty column
  if (
    this.dropCount === 0 &&
    this.activeCard.value === 13 &&
    !start.classList.contains('dealt') &&
    this.activeCard.el.parentNode.firstElementChild === this.activeCard.el
  ) {
    return false;
  }

  // Moving from deck to column
  if (start.classList.contains('dealt')) {
    if (stop.classList.contains('column')) {
      this.score += 5;
    }
    // Moving from column to column
  } else if (start.classList.contains('column')) {
    if (stop.classList.contains('column')) {
      this.score += 3;
    }
  }

  // Moving to suit stack
  if (stop.classList.contains('stack')) {
    this.score += 10;
  }

  // Moving from stacks to columns
  if (start.classList.contains('stack') && stop.classList.contains('column')) {
    this.score -= 10;
  }
};

Game.prototype.isLegalMove = function (active, column) {
  active = active || this.activeCard;
  column = column || this.activeColumn;

  let last = false;
  let legalMove = false;

  const lastEl = column.lastElementChild;
  const isColumn = column.classList.contains('column');
  const isPlaceholder = column.classList.contains('stack');

  if (lastEl) {
    last = this.pack.cards[lastEl.idx];
  }

  if (isColumn) {
    if (!column.childElementCount) {
      legalMove = active.value === 13;
    } else {
      legalMove = active.color !== last.color && active.value === last.value - 1;
    }
  } else if (isPlaceholder) {
    if (!column.childElementCount) {
      legalMove = active.value === 1;
    } else {
      legalMove = active.color === last.color && active.suit === last.suit && active.value === last.value + 1;
    }
  }

  return legalMove;
};

Game.prototype.undo = function () {
  const index = this.history.length - 1;

  if (index > -1) {
    const obj = this.history[index];

    if (obj.deal) {
      // Last move was a deal
      const cards = [].slice.call(this.dealArea.children);
      const diff = this.dealArea.childElementCount - this.dealCount;

      var last = cards.splice(diff, this.dealCount);

      last.forEach(function (el) {
        const card = this.pack.cards[el.idx];
        if (card.flipped) {
          card.flip();
          this.startParent.classList.toggle('empty', !this.startParent.childElementCount);
        }

        this.packArea.appendChild(el);
      }, this);
    } else {
      const card = obj.card;
      var last = obj.start.lastElementChild;

      // Hide the last card if it was flipped by moving the subsequent card
      if (last) {
        const lastCard = this.pack.cards[last.idx];

        if (obj.prevSibling) {
          if (!obj.prevSibling.prevState && lastCard.flipped) {
            lastCard.flip();
          }
        }
      }

      // Move the card back to it's original column...
      obj.start.appendChild(card.el);

      // .. as well as it's siblings
      if (obj.siblings.length) {
        obj.siblings.forEach(function (el) {
          obj.start.appendChild(el);
        }, this);
      }

      card.checked = false;

      obj.start.classList.toggle('empty', !obj.start.childElementCount);
      obj.end.classList.toggle('empty', !obj.end.childElementCount);
    }

    // Remove the move from the history
    this.history.splice(index, 1);
  }
};

Game.prototype.deal = function () {
  const frag = document.createDocumentFragment();
  const pack = [].slice.call(this.packArea.children);
  const count = pack.length;

  if (!count) {
    while (this.dealArea.childElementCount) {
      const card = this.pack.cards[this.dealArea.lastElementChild.idx];
      card.flip();
      frag.appendChild(card.el);
    }

    this.packArea.appendChild(frag);

    return false;
  }

  this.dealer.classList.add('dealing');
  this.startParent = this.packArea;
  let items;
  if (count > 3) {
    items = pack.slice(Math.max(count - 3, 1));
  } else {
    items = pack;
  }

  this.dealCount = items.length;

  items.forEach((card, i) => {
    if (card) {
      card = this.pack.cards[card.idx];

      const crect = rect(card.el);
      const prect = rect(this.dealArea);

      const x = crect.left - prect.left;
      const y = crect.top - prect.top;

      this.dealArea.appendChild(card.el);

      card.el.style.cssText = `transform: translate3d(${x}px,${y}px,0px) rotateY(180deg);`;

      setTimeout(() => {
        card.el.style.cssText = `transform-origin: 50% 50%;transform: translate3d(0px,0px,0px) rotateY(0deg); transition: transform ${this.animationInterval}ms;`;

        card.flip();

        card.el.style.cssText = '';

        if (i === items.length - 1) {
          setTimeout(() => {
            this.dealer.classList.remove('dealing');
          }, 250);
        }
      }, this.animationInterval * i);
    }
  }, this);

  this.updateHistory([]);
};

Game.prototype.check = function () {
  this.autoStacking = false;
  this.checked = false;
  const columns = [].slice.call(this.columns.children);
  const holders = this.stacks.children;

  columns.push(this.dealArea);

  columns.forEach((column, i) => {
    const c = column.lastElementChild;
    if (c) {
      const card = this.pack.cards[c.idx];
      const start = card.el.parentNode;

      each(
        holders,
        function (i, holder) {
          if (this.isLegalMove(card, holder) && !card.checked) {
            this.autoStacking = true;
            this.checked = true;
            card.checked = true;
            const prev = card.el.previousElementSibling;

            if (prev) {
              const prevCard = this.pack.cards[prev.idx];
              if (!prevCard.flipped) {
                prevCard.flip();
                this.score += 5;
              }
            }

            this.updateHistory(card, card.el.parentNode, holder);

            const crect = rect(card.el);
            const prect = rect(holder);

            const x = crect.left - prect.left;
            const y = crect.top - prect.top;

            this.updateScore(card.el.parentNode, holder);

            holder.appendChild(card.el);
            start.classList.toggle('empty', !start.childElementCount);

            card.el.style.cssText = 'transform: translate3d(' + x + 'px,' + y + 'px,0px);';

            // Repaint
            card.el.offsetTop;

            card.el.style.cssText =
              'transform: translate3d(0px,0px,0px); transition: transform ' + this.animationInterval + 'ms;';

            setTimeout(() => {
              card.el.style.transform = '';
            }, this.animationInterval);

            this.emit('change');
          }
        },
        this,
      );
    }
  }, this);

  let count = 0;
  each(this.stacks.children, function (i, stack) {
    count += stack.childElementCount;
  });

  this.won = false;
  if (count === 52) {
    setTimeout(() => {
      this.win();
    }, this.animationInterval);
    return false;
  }

  if (this.checked) {
    setTimeout(() => {
      this.check();
    }, this.animationInterval);
  }
};

Game.prototype.start = function () {
  var columns = 7;
  let current = 0;
  let start = 0;

  // Minimize DOM changes
  var columns = this.columns;
  const pack = this.packArea;

  this.reset();

  // Shuffle
  this.pack.shuffle();

  for (var i = 0; i < 28; i++) {
    const card = this.pack.cards[i];

    /* append the card to the column */
    columns.children[current].appendChild(card.el);

    /* flip the card if it is the first one */
    if (start === current) {
      card.flip();
    }

    /* increment the column we're dropping the card in to */
    current++;

    /* increment start position */
    if (current === 7) {
      start++;
      current = start;
    }
  }

  for (var i = 28; i < 52; i++) {
    pack.appendChild(this.pack.cards[i].el);
  }

  this.packArea.parentNode.replaceChild(pack, this.packArea);
  this.columns.parentNode.replaceChild(columns, this.columns);

  this.packArea = pack;
  this.columns = columns;

  this.emit('start');
};

Game.prototype.hint = function () {
  this.hinted = false;
  const columns = [].slice.call(this.columns.children);

  columns.push(this.dealArea);

  each(this.stacks, function (i, stack) {
    columns.push(stack);
  });

  each(
    columns,
    function (i, column) {
      let c;
      if (column === this.dealArea) {
        c = column.lastElementChild;
      } else {
        c = column.getElementsByClassName('flipped')[0];
      }

      if (c) {
        const card = this.pack.cards[c.idx];
        let isLast,
          siblings = [];
        const nodeIndex = [].slice.call(card.el.parentNode.children).indexOf(card.el);

        if (card.el.previousElementSibling) {
          if (card.el.parentNode === this.dealArea) {
            isLast = true;
          } else {
            isLast = !card.el.previousElementSibling.classList.contains('flipped');
          }
        }

        if (card.value === 1 || card.el.parentNode.childElementCount === 1) {
          isLast = true;
        }

        if (
          card.value === 13 &&
          card.el.parentNode.classList.contains('column') &&
          card.el.parentNode.childElementCount === 1
        ) {
          return false;
        }

        each(card.el.parentNode.children, function (i, node) {
          if (i > nodeIndex) {
            siblings.push(node);
          }
        });

        each(
          columns,
          function (idx, col) {
            if (this.isLegalMove(card, col) && isLast && !this.hinted) {
              let lastCard,
                last = col.lastElementChild;
              if (last) {
                lastCard = this.pack.cards[last.idx].el;
              } else {
                if (card.value === 13) {
                  lastCard = col;
                }
              }

              card.el.classList.add('hint');

              if (siblings.length) {
                each(siblings, function (i, node) {
                  node.classList.add('hint');
                });
              }

              setTimeout(function () {
                card.el.classList.remove('hint');

                if (siblings.length) {
                  each(siblings, function (i, node) {
                    node.classList.remove('hint');
                  });
                }

                lastCard.classList.add('hint');

                setTimeout(function () {
                  lastCard.classList.remove('hint');
                }, 500);
              }, 500);

              this.hinted = true;
              // this.score -= 20;
            }
          },
          this,
        );
      }
    },
    this,
  );
};

Game.prototype.reset = function () {
  this.score = 0;
  this.history = [];

  if (this.won) {
    // cancel win animation
    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }
    this.won = false;
    document.body.removeChild(this.canvas);
  }

  this.pack.cards.forEach(function (card) {
    if (card.flipped) {
      card.flip();
    }
    card.checked = false;
  });

  Array.from(this.columns.children).forEach(function (column) {
    column.classList.remove('empty');
  });

  Array.from(this.stacks.children).forEach(function (stack) {
    stack.classList.remove('empty');
  });
};

Game.prototype.win = function () {
  if (this.won) {
    return false;
  }

  this.won = true;

  const rects = [];
  const suits = [];

  this.pack.cards.forEach(function (card) {
    card.el.style.transform = '';
  });

  each(
    this.stacks.children,
    function (i, stack) {
      rects.push(rect(stack));

      const last = stack.lastElementChild;
      const card = this.pack.cards[last.idx];

      suits.push(card.suit);
    },
    this,
  );

  this.canvas = document.createElement('canvas');
  const that = this;
  const ctx = this.canvas.getContext('2d');
  const w = (this.canvas.width = window.innerWidth);
  const h = (this.canvas.height = window.innerHeight);
  let gravity, wind;
  let pos = new Vector(rects[0].left, rects[0].top);
  let vel = new Vector(0, -getRandomInt(25, 30));

  const sWidth = 125;
  const sHeight = 188;

  this.frame = null;
  let x = 0;
  let sx = sWidth * 12;
  const sy = 0;
  let count = 0;

  const init = function () {
    document.body.appendChild(that.canvas);
    setGravity();
    setWind();
    draw();
  };

  var setGravity = function () {
    gravity = new Vector(0, getRandomInt(1, 9));
  };

  var setWind = function () {
    const a = [-1, 1];
    const r = a[Math.floor(Math.random() * a.length)];
    const w = getRandomInt(5, 15);
    wind = new Vector(w * r, 0);
  };

  const outline = function (p, w, h) {
    const r = 5;

    const points = [
      [p.x + r, p.y],
      [p.x + w - r, p.y],
      [p.x + w, p.y + r],
      [p.x + w, p.y + h - r],
      [p.x + w - r, p.y + h],
      [p.x + r, p.y + h],
      [p.x, p.y + h - r],
      [p.x, p.y + r],
    ];

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#333';

    // Top
    ctx.moveTo(points[0][0], points[0][1]);
    ctx.lineTo(points[1][0], points[1][1]);

    // Top right corner
    ctx.arc(points[1][0], points[2][1], r, 1.5 * Math.PI, 2 * Math.PI);

    // Right side
    ctx.moveTo(points[2][0], points[2][1]);
    ctx.lineTo(points[3][0], points[3][1]);

    // Bottom right corner
    ctx.arc(points[4][0], points[3][1], r, 2 * Math.PI, 2.5 * Math.PI);

    // Bottom
    ctx.moveTo(points[4][0], points[4][1]);
    ctx.lineTo(points[5][0], points[5][1]);

    // Bottom left corner
    ctx.arc(p.x + r, p.y + h - r, r, 2.5 * Math.PI, 3 * Math.PI);

    // Left side
    ctx.moveTo(points[6][0], points[6][1]);
    ctx.lineTo(points[7][0], points[7][1]);

    // Top left
    ctx.arc(points[5][0], points[7][1], r, 3 * Math.PI, 3.5 * Math.PI);

    ctx.stroke();
  };

  var draw = function () {
    that.frame = requestAnimationFrame(draw);

    const img = that.images[suits[x]];

    const dWidth = sWidth;
    const dHeight = sHeight;

    vel.add(gravity);

    pos.add(vel);
    pos.add(wind);

    if (pos.y >= h - sHeight) {
      pos.y = h - sHeight;
      vel.y = -vel.y;
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.drawImage(img, sx, sy, sWidth, sHeight, pos.x, pos.y, dWidth, dHeight);

    outline(pos, sWidth, sHeight);

    if (pos.x < 0 - sWidth || pos.x > w) {
      if (x < 3) {
        x++;
      } else {
        x = 0;
        sx -= sWidth;
      }

      if (sx > 0 - sWidth) {
        pos = new Vector(rects[x].left, rects[x].top);
        vel = new Vector(0, -getRandomInt(25, 50));
        setGravity();
        setWind();
        count++;

        if (count === 51) {
          let newGame = false;
          if (isFilled(ctx, 0, 0, that.canvas.width, that.canvas.height)) {
            newGame = confirm('Congrats! You filled the canvas with cards!!!!\n\nStart a new game?');
          } else {
            newGame = confirm('Congrats!\n\nStart a new game?');
          }

          if (newGame) {
            that.start();
          }
        }
      }
    }
  };

  init();
  setGravity();
  setWind();
};

Game.prototype.cheat = function () {
  const that = this;
  this.checked = false;
  const columns = [].slice.call(this.columns.children);
  const holders = this.stacks.children;

  columns.push(this.dealArea);

  each(
    this.pack.suits,
    function (i, suit) {
      let el, card, s;

      for (let n = 1; n < 14; n++) {
        s = n;

        if (n > 10) {
          switch (n) {
            case 11:
              s = 'J';
              break;
            case 12:
              s = 'Q';
              break;
            case 13:
              s = 'K';
              break;
          }
        }

        el = document.querySelector(`.card.${suit}.card-${s}`);

        card = this.pack.cards[el.idx];

        const prev = card.el.previousElementSibling;

        if (!card.flipped && card.el.parentNode !== this.packArea) {
          card.flip();
        }

        if (prev && card.el.parentNode !== this.packArea) {
          const prevCard = this.pack.cards[prev.idx];
          if (!prevCard.flipped) {
            prevCard.flip();
            this.score += 5;
          }
        }

        const crect = rect(card.el);
        const prect = rect(holders[i]);

        const x = crect.left - prect.left;
        const y = crect.top - prect.top;

        holders[i].appendChild(card.el);

        card.el.style.cssText = 'transform: translate3d(' + x + 'px,' + y + 'px,0px);';

        // Repaint
        card.el.offsetTop;

        card.el.style.cssText =
          'transform: translate3d(0px,0px,0px); transition: transform ' + this.animationInterval + 'ms;';

        setTimeout(function () {
          card.el.style.transform = '';
        }, this.animationInterval);
      }
    },
    this,
  );

  setTimeout(function () {
    that.win();
  }, this.animationInterval);
};

function isFilled(ctx, x, y, w, h) {
  let idata = ctx.getImageData(x, y, w, h),
    u32 = new Uint32Array(idata.data.buffer),
    i = 0,
    len = u32.length;

  while (i < len) if (!u32[i++]) return false;
  return true;
}
