var Context = /** @class */ (function () {
    function Context(gl, program) {
        this.gl = gl;
        this.program = program;
        this.pointers = {};
        this.atributes = {};
        this.buffers = {};
    }
    ;
    Context.prototype.getUniform = function (uniform) {
        if (!this.pointers[uniform]) {
            this.pointers[uniform] = this.gl.getUniformLocation(this.program, uniform);
        }
        return this.pointers[uniform];
    };
    Context.prototype.getAttribute = function (atribute) {
        if (!this.atributes[atribute]) {
            this.atributes[atribute] = this.gl.getAttribLocation(this.program, atribute);
        }
        return this.atributes[atribute];
    };
    Context.prototype.createBuffer = function (bufferName) {
        this.buffers[bufferName] = this.gl.createBuffer();
        return this.buffers[bufferName];
    };
    Context.prototype.getBuffer = function (bufferName) {
        return this.buffers[bufferName];
    };
    return Context;
}());
export { Context };
