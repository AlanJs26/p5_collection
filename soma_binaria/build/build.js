var Digit = (function () {
    function Digit(value) {
        this.base = 10;
        this.pos = createVector(0, 0);
        this.carry = [];
        this.new_value = [];
        this.is_cut = false;
        this.color = color('white');
        this.size = 50;
        this.value = value;
    }
    Digit.prototype.toString = function () {
        if (this.value >= 0 && this.value <= 15) {
            return Digit.BASE_MAP[this.value];
        }
        return '';
    };
    Digit.prototype.getValue = function () {
        return this.getDigit().value;
    };
    Digit.prototype.getDigit = function () {
        if (this.new_value.length) {
            return this.new_value[this.new_value.length - 1];
        }
        return this;
    };
    Digit.prototype.sumCarry = function () {
        return this.carry.reduce(function (p, n) { return p + n.getValue(); }, 0);
    };
    Digit.toBase = function (num, base) {
        var digits = [];
        do {
            digits.push(new Digit(num % base));
            num = Math.floor(num / base);
        } while (num >= 1);
        return digits.reverse();
    };
    Digit.prototype.update_value = function (value) {
        this.new_value.push(new Digit(value));
    };
    Digit.prototype.getHeight = function () {
        var prev = textSize();
        textSize(this.size);
        var height = textAscent();
        textSize(prev);
        return height;
    };
    Digit.prototype.getWidth = function () {
        var prev = textSize();
        textSize(this.size);
        var width = textWidth(this.toString());
        textSize(prev);
        return width;
    };
    Digit.prototype.draw = function () {
        textAlign(CENTER, CENTER);
        textSize(this.size);
        fill(this.color);
        noStroke();
        text(this.toString(), this.pos.x, this.pos.y);
        if (this.new_value.length || this.is_cut) {
            stroke('red');
            noFill();
            strokeWeight(5);
            var textheight = textAscent();
            var textwidth = textWidth(this.toString());
            line(this.pos.x - textwidth / 3, this.pos.y - textheight / 3, this.pos.x + textwidth / 3, this.pos.y + textheight / 3);
        }
        var i = 0;
        for (var _i = 0, _a = this.new_value; _i < _a.length; _i++) {
            var new_digit = _a[_i];
            new_digit.size = this.size / 2;
            if (i < this.new_value.length - 1) {
                new_digit.is_cut = true;
            }
            else {
                new_digit.is_cut = false;
            }
            var y_offset = this.getHeight();
            var textheight = new_digit.getHeight();
            new_digit.pos.set(this.pos.x, this.pos.y - y_offset - i * textheight * 1.2);
            new_digit.draw();
            i++;
        }
        i = 0;
        for (var _b = 0, _c = this.carry; _b < _c.length; _b++) {
            var carry_digit = _c[_b];
            carry_digit.size = this.size / 2;
            var y_offset = this.getHeight();
            var textheight = carry_digit.getHeight();
            y_offset += (this.new_value.length) * textheight * 1.2;
            carry_digit.pos.set(this.pos.x, this.pos.y - y_offset - i * textheight * 1.2);
            carry_digit.color = color('gray');
            carry_digit.draw();
            i++;
        }
    };
    Digit.BASE_MAP = {
        0: '0',
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7',
        8: '8',
        9: '9',
        10: 'A',
        11: 'B',
        12: 'C',
        13: 'D',
        14: 'E',
        15: 'F',
        16: 'G',
        17: 'H',
        18: 'I',
        19: 'J',
        20: 'K',
        21: 'L',
        22: 'M',
        23: 'N',
        24: 'O',
        25: 'P',
        26: 'Q',
        27: 'R',
        28: 'S',
        29: 'T',
        30: 'U',
        31: 'V',
        32: 'W',
        33: 'X',
        34: 'Y',
        35: 'Z',
    };
    Digit.REVERSED_BASE_MAP = Object.fromEntries(Object.entries(Digit.BASE_MAP).map(function (_a) {
        var k = _a[0], v = _a[1];
        return [v.toString(), Number(k)];
    }));
    return Digit;
}());
var DigitStack = (function () {
    function DigitStack(pos) {
        this.rows = [[]];
        this.textSize = 50;
        this.pos = pos;
    }
    DigitStack.fromArray = function (pos, list) {
        var stack = new DigitStack(pos);
        stack.rows = [];
        for (var i = 0; i < list.length; i++) {
            var row = [];
            for (var j = 0; j < list[i].length; j++) {
                var element = list[i][j];
                row.push(new Digit(element));
            }
            stack.rows.push(row);
        }
        return stack;
    };
    DigitStack.prototype.transpose = function () {
        var columns = [];
        var max_length = this.rows.reduce(function (p, n) { return max(p, n.length); }, 0);
        for (var i = 0; i < max_length; i++) {
            var column = [];
            for (var _i = 0, _a = this.rows; _i < _a.length; _i++) {
                var row = _a[_i];
                if (i < max_length - row.length)
                    continue;
                column.push(row[i - (max_length - row.length)]);
            }
            columns.push(column);
        }
        return columns;
    };
    DigitStack.prototype.setTextSize = function (new_size) {
        this.textSize = new_size;
        for (var i = 0; i < this.rows.length; i++) {
            for (var j = 0; j < this.rows[i].length; j++) {
                var element = this.rows[i][j];
                element.size = this.textSize;
            }
        }
    };
    DigitStack.prototype.setBase = function (new_base) {
        for (var i = 0; i < this.rows.length; i++) {
            for (var j = 0; j < this.rows[i].length; j++) {
                var element = this.rows[i][j];
                element.base = new_base;
            }
        }
    };
    DigitStack.prototype.draw = function () {
        for (var i = 0; i < this.rows.length; i++) {
            textSize(this.textSize);
            var yoffset = i * textAscent();
            var hoffset = 0;
            for (var j = this.rows[i].length - 1; j >= 0; j--) {
                var element = this.rows[i][j];
                hoffset += element.getWidth();
                element.pos.set(this.pos.x - hoffset, this.pos.y + yoffset);
                element.draw();
            }
        }
    };
    return DigitStack;
}());
var Machine = (function () {
    function Machine(list, base, x, y) {
        if (base === void 0) { base = 10; }
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.selected_column = 0;
        this.selected_row = 0;
        this.center = true;
        this.loop = false;
        this.finished = false;
        this.operatorSymbol = '+';
        this.pos = createVector(x, y);
        this.main_stack = DigitStack.fromArray(this.pos, list.length ? list.map(function (e) { return e.split('').map(Number); }) : [[]]);
        this.base = base;
        this.main_stack.setBase(base);
        this.secondary_stack = new DigitStack(this.pos.copy());
    }
    Machine.prototype.clearCarries = function () {
        for (var _i = 0, _a = this.main_stack.rows; _i < _a.length; _i++) {
            var row = _a[_i];
            for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
                var element = row_1[_b];
                element.carry = [];
                element.new_value = [];
            }
        }
    };
    Machine.prototype.restart = function () {
        this.clearCarries();
        this.selected_column = 0;
        this.selected_row = 0;
        this.finished = false;
        this.secondary_stack.rows = [[]];
    };
    Machine.prototype.clearAll = function () {
        this.clearCarries();
        this.main_stack.rows = [[]];
        this.secondary_stack.rows = [[]];
    };
    Machine.prototype.draw = function () {
        textSize(this.main_stack.textSize);
        var text_height = textAscent();
        textSize(this.main_stack.textSize * 0.8);
        var hoffset = text_height / 5;
        for (var i = 0; i < this.main_stack.rows.length - 1; i++) {
            var yoffset = text_height / 2 + text_height * i;
            text(this.operatorSymbol, this.pos.x + hoffset, this.pos.y + yoffset);
        }
        var max_length = this.main_stack.rows.reduce(function (p, n) { return max(p, n.length); }, 0);
        var main_stack_height = this.main_stack.rows.length * text_height;
        stroke('white');
        line(this.pos.x - max_length * text_height, this.pos.y + main_stack_height, this.pos.x, this.pos.y + main_stack_height);
        var secondary_stack_offset = text_height;
        if (this.center) {
            this.pos.set(windowWidth / 2 + max_length * text_height / 2, windowHeight / 2 - (main_stack_height + secondary_stack_offset) / 2);
        }
        this.secondary_stack.pos.set(this.pos.x, this.pos.y + main_stack_height + secondary_stack_offset);
        this.main_stack.draw();
        this.secondary_stack.draw();
    };
    return Machine;
}());
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MultMachine = (function (_super) {
    __extends(MultMachine, _super);
    function MultMachine(number1, number2, base, x, y) {
        if (base === void 0) { base = 10; }
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var _this = _super.call(this, [], base, x, y) || this;
        _this.selected_column = 0;
        _this.selected_column_below = 0;
        _this.selected_row = 0;
        _this.main_stack = DigitStack.fromArray(_this.pos, [
            number1.split('').map(function (n) { return Digit.REVERSED_BASE_MAP[n]; }),
            number2.split('').map(function (n) { return Digit.REVERSED_BASE_MAP[n]; })
        ]);
        _this.main_stack.setBase(base);
        _this.sum_machine = new SumMachine([], _this.base);
        _this.sum_machine.center = false;
        _this.operatorSymbol = 'x';
        return _this;
    }
    MultMachine.prototype.clearAll = function () {
        this.clearCarries();
        this.sum_machine.clearAll();
    };
    MultMachine.prototype.restart = function () {
        this.clearAll();
        this.sum_machine.restart();
        this.selected_column = 0;
        this.selected_column_below = 0;
        this.selected_row = 0;
    };
    MultMachine.prototype.step = function () {
        var selected_index = this.main_stack.rows[0].length - this.selected_column - 1;
        var selected_index_below = this.main_stack.rows[1].length - this.selected_column_below - 1;
        if (this.sum_machine.finished) {
            this.restart();
            return;
        }
        if (selected_index_below < 0) {
            this.sum_machine.step();
            return;
        }
        if (selected_index < 0) {
            this.clearCarries();
            this.selected_column = 0;
            this.selected_row += 1;
            this.selected_column_below += 1;
            if (this.selected_column_below < this.main_stack.rows[1].length) {
                var new_row = [];
                for (var i_1 = 0; i_1 < this.selected_column_below; i_1++) {
                    new_row.push(new Digit(0));
                }
                this.sum_machine.main_stack.rows.push(new_row);
            }
            else {
                this.step();
            }
            return;
        }
        var selected = this.main_stack.rows[0][selected_index];
        var selected_below = this.main_stack.rows[1][selected_index_below];
        var converted = Digit.toBase(selected.getValue() * selected_below.getValue() + selected.sumCarry(), this.base);
        var digit = converted.pop();
        this.sum_machine.main_stack.rows[this.selected_row].unshift(digit);
        var i = 1;
        while (converted.length) {
            var next_column = this.main_stack.rows[0][selected_index - i];
            if (next_column === undefined) {
                this.sum_machine.main_stack.rows[this.selected_row].unshift(converted.pop());
            }
            else {
                next_column.carry.push(converted.pop());
            }
            i++;
        }
        this.selected_column++;
    };
    MultMachine.prototype.draw = function () {
        textSize(this.main_stack.textSize);
        var text_height = textAscent();
        textSize(this.main_stack.textSize * 0.8);
        var hoffset = text_height / 5;
        for (var i = 0; i < this.main_stack.rows.length - 1; i++) {
            var yoffset = text_height / 2 + text_height * i;
            text(this.operatorSymbol, this.pos.x + hoffset, this.pos.y + yoffset);
        }
        var max_length = this.main_stack.rows.reduce(function (p, n) { return max(p, n.length); }, 0);
        var main_stack_height = this.main_stack.rows.length * text_height;
        stroke('white');
        line(this.pos.x - max_length * text_height, this.pos.y + main_stack_height, this.pos.x, this.pos.y + main_stack_height);
        var secondary_stack_offset = text_height;
        var sum_machine_height = this.sum_machine.main_stack.rows.length * text_height;
        this.pos.set(windowWidth / 2 + max_length * text_height / 2, windowHeight / 2 - (main_stack_height + sum_machine_height + secondary_stack_offset) / 2);
        this.secondary_stack.pos.set(this.pos.x, this.pos.y + main_stack_height + secondary_stack_offset);
        this.sum_machine.pos.set(this.pos.x, this.pos.y + main_stack_height + secondary_stack_offset);
        this.main_stack.draw();
        this.secondary_stack.draw();
        this.sum_machine.draw();
    };
    return MultMachine;
}(Machine));
var SubMachine = (function (_super) {
    __extends(SubMachine, _super);
    function SubMachine(list, base, x, y) {
        if (base === void 0) { base = 10; }
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var _this = _super.call(this, list, base, x, y) || this;
        _this.operatorSymbol = '-';
        return _this;
    }
    SubMachine.prototype.step = function () {
        var transposed = this.main_stack.transpose();
        var column_index = transposed.length - this.selected_column - 1;
        if (column_index < 0) {
            this.finished = true;
            if (!this.loop)
                return;
            this.restart();
            return;
        }
        var column_element = transposed[column_index][0];
        var result = column_element.getValue();
        result += column_element.sumCarry();
        for (var i_2 = 1; i_2 < transposed[column_index].length; i_2++) {
            result -= transposed[column_index][i_2].getValue();
        }
        if (result < 0) {
            var next_column_element = transposed[column_index - 1][0];
            var element_value = next_column_element.getValue();
            next_column_element.update_value(element_value - 1);
            column_element.carry.push(new Digit(this.base));
            return;
        }
        var converted = Digit.toBase(result, this.base);
        var digit = converted.pop();
        this.secondary_stack.rows[this.selected_row].unshift(digit);
        var i = 1;
        while (converted.length) {
            var next_column = transposed[column_index - i];
            if (next_column === undefined) {
                this.secondary_stack.rows[this.selected_row].unshift(converted.pop());
            }
            else {
                transposed[column_index - i][0].carry.push(converted.pop());
            }
            i++;
        }
        this.selected_column++;
    };
    return SubMachine;
}(Machine));
var SumMachine = (function (_super) {
    __extends(SumMachine, _super);
    function SumMachine(list, base, x, y) {
        if (base === void 0) { base = 10; }
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var _this = _super.call(this, list, base, x, y) || this;
        _this.operatorSymbol = '+';
        return _this;
    }
    SumMachine.prototype.step = function () {
        var transposed = this.main_stack.transpose();
        var column_index = transposed.length - this.selected_column - 1;
        if (column_index < 0) {
            this.finished = true;
            if (!this.loop)
                return;
            this.restart();
            return;
        }
        var result = transposed[column_index].reduce(function (p, n) { return p + n.getValue(); }, 0);
        result += transposed[column_index][0].sumCarry();
        var converted = Digit.toBase(result, this.base);
        var digit = converted.pop();
        this.secondary_stack.rows[this.selected_row].unshift(digit);
        var i = 1;
        while (converted.length) {
            var next_column = transposed[column_index - i];
            if (next_column === undefined) {
                this.secondary_stack.rows[this.selected_row].unshift(converted.pop());
            }
            else {
                transposed[column_index - i][0].carry.push(converted.pop());
            }
            i++;
        }
        this.selected_column++;
    };
    return SumMachine;
}(Machine));
var machine;
function setup() {
    console.log("🚀 - Setup initialized - P5 is running");
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER).noFill().frameRate(30);
    machine = new SubMachine([
        '111100101',
        '110101111',
    ], 2);
    machine.loop = true;
}
function mouseClicked() {
    machine.step();
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function draw() {
    background(0);
    machine.draw();
}
//# sourceMappingURL=build.js.map