var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WebGeolocation = /** @class */ (function (_super) {
            __extends(WebGeolocation, _super);
            /**
             * @private
             */
            function WebGeolocation(option) {
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.onUpdate = function (position) {
                    var event = new egret.GeolocationEvent(egret.Event.CHANGE);
                    var coords = position.coords;
                    event.altitude = coords.altitude;
                    event.heading = coords.heading;
                    event.accuracy = coords.accuracy;
                    event.latitude = coords.latitude;
                    event.longitude = coords.longitude;
                    event.speed = coords.speed;
                    event.altitudeAccuracy = coords.altitudeAccuracy;
                    _this.dispatchEvent(event);
                };
                /**
                 * @private
                 */
                _this.onError = function (error) {
                    var errorType = egret.GeolocationEvent.UNAVAILABLE;
                    if (error.code == error.PERMISSION_DENIED)
                        errorType = egret.GeolocationEvent.PERMISSION_DENIED;
                    var event = new egret.GeolocationEvent(egret.IOErrorEvent.IO_ERROR);
                    event.errorType = errorType;
                    event.errorMessage = error.message;
                    _this.dispatchEvent(event);
                };
                _this.geolocation = navigator.geolocation;
                return _this;
            }
            /**
             * @private
             *
             */
            WebGeolocation.prototype.start = function () {
                var geo = this.geolocation;
                if (geo)
                    this.watchId = geo.watchPosition(this.onUpdate, this.onError);
                else
                    this.onError({
                        code: 2,
                        message: egret.sys.tr(3004),
                        PERMISSION_DENIED: 1,
                        POSITION_UNAVAILABLE: 2
                    });
            };
            /**
             * @private
             *
             */
            WebGeolocation.prototype.stop = function () {
                var geo = this.geolocation;
                geo.clearWatch(this.watchId);
            };
            return WebGeolocation;
        }(egret.EventDispatcher));
        web.WebGeolocation = WebGeolocation;
        __reflect(WebGeolocation.prototype, "egret.web.WebGeolocation", ["egret.Geolocation"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WebMotion = /** @class */ (function (_super) {
            __extends(WebMotion, _super);
            function WebMotion() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                /**
                 * @private
                 */
                _this.onChange = function (e) {
                    var event = new egret.MotionEvent(egret.Event.CHANGE);
                    var acceleration = {
                        x: e.acceleration.x,
                        y: e.acceleration.y,
                        z: e.acceleration.z
                    };
                    var accelerationIncludingGravity = {
                        x: e.accelerationIncludingGravity.x,
                        y: e.accelerationIncludingGravity.y,
                        z: e.accelerationIncludingGravity.z
                    };
                    var rotation = {
                        alpha: e.rotationRate.alpha,
                        beta: e.rotationRate.beta,
                        gamma: e.rotationRate.gamma
                    };
                    event.acceleration = acceleration;
                    event.accelerationIncludingGravity = accelerationIncludingGravity;
                    event.rotationRate = rotation;
                    _this.dispatchEvent(event);
                };
                return _this;
            }
            /**
             * @private
             *
             */
            WebMotion.prototype.start = function () {
                window.addEventListener("devicemotion", this.onChange);
            };
            /**
             * @private
             *
             */
            WebMotion.prototype.stop = function () {
                window.removeEventListener("devicemotion", this.onChange);
            };
            return WebMotion;
        }(egret.EventDispatcher));
        web.WebMotion = WebMotion;
        __reflect(WebMotion.prototype, "egret.web.WebMotion", ["egret.Motion"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * 顶点数组管理对象
         * 用来维护顶点数组
         */
        var WebGLVertexArrayObject = /** @class */ (function () {
            function WebGLVertexArrayObject() {
                /*定义顶点格式
                * (x: 8 * 4 = 32) + (y: 8 * 4 = 32) + (u: 8 * 4 = 32) + (v: 8 * 4 = 32) + (tintcolor: 8 * 4 = 32) = (8 * 4 = 32) * (x + y + u + v + tintcolor: 5);
                */
                this.vertSize = 5;
                this.vertByteSize = this.vertSize * 4;
                /*
                *最多单次提交maxQuadsCount这么多quad
                */
                this.maxQuadsCount = 2048;
                /*
                *quad = 4个Vertex
                */
                this.maxVertexCount = this.maxQuadsCount * 4;
                /*
                *配套的Indices = quad * 6.
                */
                this.maxIndicesCount = this.maxQuadsCount * 6;
                this.vertices = null;
                this.indices = null;
                this.indicesForMesh = null;
                this.vertexIndex = 0;
                this.indexIndex = 0;
                this.hasMesh = false;
                /*
                * refactor:
                */
                this._vertices = null;
                this._verticesFloat32View = null;
                this._verticesUint32View = null;
                //old
                // const numVerts = this.maxVertexCount * this.vertSize;
                // this.vertices = new Float32Array(numVerts);
                ///
                this._vertices = new ArrayBuffer(this.maxVertexCount * this.vertByteSize);
                this._verticesFloat32View = new Float32Array(this._vertices);
                this._verticesUint32View = new Uint32Array(this._vertices);
                this.vertices = this._verticesFloat32View;
                //索引缓冲，最大索引数
                /*
                0-------1
                |       |
                |       |
                3-------2
                0->1->2
                0->2->3
                两个三角形
                */
                var maxIndicesCount = this.maxIndicesCount;
                this.indices = new Uint16Array(maxIndicesCount);
                this.indicesForMesh = new Uint16Array(maxIndicesCount);
                for (var i = 0, j = 0; i < maxIndicesCount; i += 6, j += 4) {
                    this.indices[i + 0] = j + 0;
                    this.indices[i + 1] = j + 1;
                    this.indices[i + 2] = j + 2;
                    this.indices[i + 3] = j + 0;
                    this.indices[i + 4] = j + 2;
                    this.indices[i + 5] = j + 3;
                }
            }
            /**
             * 是否达到最大缓存数量
             */
            WebGLVertexArrayObject.prototype.reachMaxSize = function (vertexCount, indexCount) {
                if (vertexCount === void 0) { vertexCount = 4; }
                if (indexCount === void 0) { indexCount = 6; }
                return this.vertexIndex > this.maxVertexCount - vertexCount || this.indexIndex > this.maxIndicesCount - indexCount;
            };
            /**
             * 获取缓存完成的顶点数组
             */
            WebGLVertexArrayObject.prototype.getVertices = function () {
                var view = this.vertices.subarray(0, this.vertexIndex * this.vertSize);
                return view;
            };
            /**
             * 获取缓存完成的索引数组
             */
            WebGLVertexArrayObject.prototype.getIndices = function () {
                return this.indices;
            };
            /**
             * 获取缓存完成的mesh索引数组
             */
            WebGLVertexArrayObject.prototype.getMeshIndices = function () {
                return this.indicesForMesh;
            };
            /**
             * 切换成mesh索引缓存方式
             */
            WebGLVertexArrayObject.prototype.changeToMeshIndices = function () {
                if (!this.hasMesh) {
                    // 拷贝默认index信息到for mesh中
                    for (var i = 0, l = this.indexIndex; i < l; ++i) {
                        this.indicesForMesh[i] = this.indices[i];
                    }
                    this.hasMesh = true;
                }
            };
            WebGLVertexArrayObject.prototype.isMesh = function () {
                return this.hasMesh;
            };
            /**
             * 默认构成矩形
             */
            // private defaultMeshVertices = [0, 0, 1, 0, 1, 1, 0, 1];
            // private defaultMeshUvs = [
            //     0, 0,
            //     1, 0,
            //     1, 1,
            //     0, 1
            // ];
            // private defaultMeshIndices = [0, 1, 2, 0, 2, 3];
            /**
             * 缓存一组顶点
             */
            WebGLVertexArrayObject.prototype.cacheArrays = function (buffer, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureSourceWidth, textureSourceHeight, meshUVs, meshVertices, meshIndices, rotated) {
                var alpha = buffer.globalAlpha;
                /*
                * 混入tintcolor => alpha
                */
                alpha = Math.min(alpha, 1.0);
                var globalTintColor = buffer.globalTintColor;
                var currentTexture = buffer.currentTexture;
                alpha = ((alpha < 1.0 && currentTexture && currentTexture[egret.UNPACK_PREMULTIPLY_ALPHA_WEBGL]) ?
                    egret.WebGLUtils.premultiplyTint(globalTintColor, alpha)
                    : globalTintColor + (alpha * 255 << 24));
                /*
                临时测试
                */
                //计算出绘制矩阵，之后把矩阵还原回之前的
                var locWorldTransform = buffer.globalMatrix;
                var a = locWorldTransform.a;
                var b = locWorldTransform.b;
                var c = locWorldTransform.c;
                var d = locWorldTransform.d;
                var tx = locWorldTransform.tx;
                var ty = locWorldTransform.ty;
                var offsetX = buffer.$offsetX;
                var offsetY = buffer.$offsetY;
                if (offsetX != 0 || offsetY != 0) {
                    tx = offsetX * a + offsetY * c + tx;
                    ty = offsetX * b + offsetY * d + ty;
                }
                if (!meshVertices) {
                    if (destX != 0 || destY != 0) {
                        tx = destX * a + destY * c + tx;
                        ty = destX * b + destY * d + ty;
                    }
                    var a1 = destWidth / sourceWidth;
                    if (a1 != 1) {
                        a = a1 * a;
                        b = a1 * b;
                    }
                    var d1 = destHeight / sourceHeight;
                    if (d1 != 1) {
                        c = d1 * c;
                        d = d1 * d;
                    }
                }
                if (meshVertices) {
                    if (web.isIOS14Device()) {
                        var vertData = [];
                        // 计算索引位置与赋值
                        var vertices = this.vertices;
                        var verticesUint32View = this._verticesUint32View;
                        var index = this.vertexIndex * this.vertSize;
                        // 缓存顶点数组
                        var i = 0, iD = 0, l = 0;
                        var u = 0, v = 0, x = 0, y = 0;
                        for (i = 0, l = meshUVs.length; i < l; i += 2) {
                            iD = index + i * 5 / 2;
                            x = meshVertices[i];
                            y = meshVertices[i + 1];
                            u = meshUVs[i];
                            v = meshUVs[i + 1];
                            if (rotated) {
                                vertData.push([
                                    a * x + c * y + tx,
                                    b * x + d * y + ty,
                                    (sourceX + (1.0 - v) * sourceHeight) / textureSourceWidth,
                                    (sourceY + u * sourceWidth) / textureSourceHeight,
                                ]);
                            }
                            else {
                                vertData.push([
                                    a * x + c * y + tx,
                                    b * x + d * y + ty,
                                    (sourceX + u * sourceWidth) / textureSourceWidth,
                                    (sourceY + v * sourceHeight) / textureSourceHeight,
                                ]);
                            }
                            verticesUint32View[iD + 4] = alpha;
                        }
                        for (var i_1 = 0; i_1 < meshIndices.length; i_1 += 3) {
                            var data0 = vertData[meshIndices[i_1]];
                            vertices[index++] = data0[0];
                            vertices[index++] = data0[1];
                            vertices[index++] = data0[2];
                            vertices[index++] = data0[3];
                            verticesUint32View[index++] = alpha;
                            var data1 = vertData[meshIndices[i_1 + 1]];
                            vertices[index++] = data1[0];
                            vertices[index++] = data1[1];
                            vertices[index++] = data1[2];
                            vertices[index++] = data1[3];
                            verticesUint32View[index++] = alpha;
                            var data2 = vertData[meshIndices[i_1 + 2]];
                            vertices[index++] = data2[0];
                            vertices[index++] = data2[1];
                            vertices[index++] = data2[2];
                            vertices[index++] = data2[3];
                            verticesUint32View[index++] = alpha;
                            // 填充数据
                            vertices[index++] = data2[0];
                            vertices[index++] = data2[1];
                            vertices[index++] = data2[2];
                            vertices[index++] = data2[3];
                            verticesUint32View[index++] = alpha;
                        }
                        var meshNum = meshIndices.length / 3;
                        this.vertexIndex += 4 * meshNum;
                        this.indexIndex += 6 * meshNum;
                    }
                    else {
                        // 计算索引位置与赋值
                        var vertices = this.vertices;
                        var verticesUint32View = this._verticesUint32View;
                        var index = this.vertexIndex * this.vertSize;
                        // 缓存顶点数组
                        var i = 0, iD = 0, l = 0;
                        var u = 0, v = 0, x = 0, y = 0;
                        for (i = 0, l = meshUVs.length; i < l; i += 2) {
                            iD = index + i * 5 / 2;
                            x = meshVertices[i];
                            y = meshVertices[i + 1];
                            u = meshUVs[i];
                            v = meshUVs[i + 1];
                            // xy
                            vertices[iD + 0] = a * x + c * y + tx;
                            vertices[iD + 1] = b * x + d * y + ty;
                            // uv
                            if (rotated) {
                                vertices[iD + 2] = (sourceX + (1.0 - v) * sourceHeight) / textureSourceWidth;
                                vertices[iD + 3] = (sourceY + u * sourceWidth) / textureSourceHeight;
                            }
                            else {
                                vertices[iD + 2] = (sourceX + u * sourceWidth) / textureSourceWidth;
                                vertices[iD + 3] = (sourceY + v * sourceHeight) / textureSourceHeight;
                            }
                            // alpha
                            verticesUint32View[iD + 4] = alpha;
                        }
                        // 缓存索引数组
                        if (this.hasMesh) {
                            for (var i_2 = 0, l_1 = meshIndices.length; i_2 < l_1; ++i_2) {
                                this.indicesForMesh[this.indexIndex + i_2] = meshIndices[i_2] + this.vertexIndex;
                            }
                        }
                        this.vertexIndex += meshUVs.length / 2;
                        this.indexIndex += meshIndices.length;
                    }
                }
                else {
                    var width = textureSourceWidth;
                    var height = textureSourceHeight;
                    var w = sourceWidth;
                    var h = sourceHeight;
                    sourceX = sourceX / width;
                    sourceY = sourceY / height;
                    var vertices = this.vertices;
                    var verticesUint32View = this._verticesUint32View;
                    var index = this.vertexIndex * this.vertSize;
                    if (rotated) {
                        var temp = sourceWidth;
                        sourceWidth = sourceHeight / width;
                        sourceHeight = temp / height;
                        // xy
                        vertices[index++] = tx;
                        vertices[index++] = ty;
                        // uv
                        vertices[index++] = sourceWidth + sourceX;
                        vertices[index++] = sourceY;
                        // alpha
                        verticesUint32View[index++] = alpha;
                        // xy
                        vertices[index++] = a * w + tx;
                        vertices[index++] = b * w + ty;
                        // uv
                        vertices[index++] = sourceWidth + sourceX;
                        vertices[index++] = sourceHeight + sourceY;
                        // alpha
                        verticesUint32View[index++] = alpha;
                        // xy
                        vertices[index++] = a * w + c * h + tx;
                        vertices[index++] = d * h + b * w + ty;
                        // uv
                        vertices[index++] = sourceX;
                        vertices[index++] = sourceHeight + sourceY;
                        // alpha
                        verticesUint32View[index++] = alpha;
                        // xy
                        vertices[index++] = c * h + tx;
                        vertices[index++] = d * h + ty;
                        // uv
                        vertices[index++] = sourceX;
                        vertices[index++] = sourceY;
                        // alpha
                        verticesUint32View[index++] = alpha;
                    }
                    else {
                        sourceWidth = sourceWidth / width;
                        sourceHeight = sourceHeight / height;
                        // xy
                        vertices[index++] = tx;
                        vertices[index++] = ty;
                        // uv
                        vertices[index++] = sourceX;
                        vertices[index++] = sourceY;
                        // alpha
                        verticesUint32View[index++] = alpha;
                        // xy
                        vertices[index++] = a * w + tx;
                        vertices[index++] = b * w + ty;
                        // uv
                        vertices[index++] = sourceWidth + sourceX;
                        vertices[index++] = sourceY;
                        // alpha
                        verticesUint32View[index++] = alpha;
                        // xy
                        vertices[index++] = a * w + c * h + tx;
                        vertices[index++] = d * h + b * w + ty;
                        // uv
                        vertices[index++] = sourceWidth + sourceX;
                        vertices[index++] = sourceHeight + sourceY;
                        // alpha
                        verticesUint32View[index++] = alpha;
                        // xy
                        vertices[index++] = c * h + tx;
                        vertices[index++] = d * h + ty;
                        // uv
                        vertices[index++] = sourceX;
                        vertices[index++] = sourceHeight + sourceY;
                        // alpha
                        verticesUint32View[index++] = alpha;
                    }
                    // 缓存索引数组
                    if (this.hasMesh) {
                        var indicesForMesh = this.indicesForMesh;
                        indicesForMesh[this.indexIndex + 0] = 0 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 1] = 1 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 2] = 2 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 3] = 0 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 4] = 2 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 5] = 3 + this.vertexIndex;
                    }
                    this.vertexIndex += 4;
                    this.indexIndex += 6;
                }
            };
            WebGLVertexArrayObject.prototype.clear = function () {
                this.hasMesh = false;
                this.vertexIndex = 0;
                this.indexIndex = 0;
            };
            return WebGLVertexArrayObject;
        }());
        web.WebGLVertexArrayObject = WebGLVertexArrayObject;
        __reflect(WebGLVertexArrayObject.prototype, "egret.web.WebGLVertexArrayObject");
        web.isIOS14Device = function () {
            return false;
        };
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WebExternalInterface = /** @class */ (function () {
            function WebExternalInterface() {
            }
            /**
             * @private
             * @param functionName
             * @param value
             */
            WebExternalInterface.call = function (functionName, value) {
            };
            /**
             * @private
             * @param functionName
             * @param listener
             */
            WebExternalInterface.addCallback = function (functionName, listener) {
            };
            return WebExternalInterface;
        }());
        web.WebExternalInterface = WebExternalInterface;
        __reflect(WebExternalInterface.prototype, "egret.web.WebExternalInterface", ["egret.ExternalInterface"]);
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("egretnative") < 0) {
            egret.ExternalInterface = WebExternalInterface;
        }
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
(function (egret) {
    var web;
    (function (web) {
        var callBackDic = {};
        /**
         * @private
         */
        var NativeExternalInterface = /** @class */ (function () {
            function NativeExternalInterface() {
            }
            NativeExternalInterface.call = function (functionName, value) {
                var data = {};
                data.functionName = functionName;
                data.value = value;
                egret_native.sendInfoToPlugin(JSON.stringify(data));
            };
            NativeExternalInterface.addCallback = function (functionName, listener) {
                callBackDic[functionName] = listener;
            };
            return NativeExternalInterface;
        }());
        web.NativeExternalInterface = NativeExternalInterface;
        __reflect(NativeExternalInterface.prototype, "egret.web.NativeExternalInterface", ["egret.ExternalInterface"]);
        /**
         * @private
         * @param info
         */
        function onReceivedPluginInfo(info) {
            var data = JSON.parse(info);
            var functionName = data.functionName;
            var listener = callBackDic[functionName];
            if (listener) {
                var value = data.value;
                listener.call(null, value);
            }
            else {
                egret.$warn(1050, functionName);
            }
        }
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("egretnative") >= 0) {
            egret.ExternalInterface = NativeExternalInterface;
            egret_native.receivedPluginInfo = onReceivedPluginInfo;
        }
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
(function (egret) {
    var web;
    (function (web) {
        var callBackDic = {};
        /**
         * @private
         */
        var WebViewExternalInterface = /** @class */ (function () {
            function WebViewExternalInterface() {
            }
            WebViewExternalInterface.call = function (functionName, value) {
                __global.ExternalInterface.call(functionName, value);
            };
            WebViewExternalInterface.addCallback = function (functionName, listener) {
                callBackDic[functionName] = listener;
            };
            WebViewExternalInterface.invokeCallback = function (functionName, value) {
                var listener = callBackDic[functionName];
                if (listener) {
                    listener.call(null, value);
                }
                else {
                    egret.$warn(1050, functionName);
                }
            };
            return WebViewExternalInterface;
        }());
        web.WebViewExternalInterface = WebViewExternalInterface;
        __reflect(WebViewExternalInterface.prototype, "egret.web.WebViewExternalInterface", ["egret.ExternalInterface"]);
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("egretwebview") >= 0) {
            egret.ExternalInterface = WebViewExternalInterface;
        }
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var localStorage;
    (function (localStorage) {
        var web;
        (function (web) {
            /**
             * @private
             *
             * @param key
             * @returns
             */
            function getItem(key) {
                return window.localStorage.getItem(key);
            }
            /**
             * @private
             *
             * @param key
             * @param value
             * @returns
             */
            function setItem(key, value) {
                try {
                    window.localStorage.setItem(key, value);
                    return true;
                }
                catch (e) {
                    egret.$warn(1047, key, value);
                    return false;
                }
            }
            /**
             * @private
             *
             * @param key
             */
            function removeItem(key) {
                window.localStorage.removeItem(key);
            }
            /**
             * @private
             *
             */
            function clear() {
                window.localStorage.clear();
            }
            localStorage.getItem = getItem;
            localStorage.setItem = setItem;
            localStorage.removeItem = removeItem;
            localStorage.clear = clear;
        })(web = localStorage.web || (localStorage.web = {}));
    })(localStorage = egret.localStorage || (egret.localStorage = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * @inheritDoc
         */
        var HtmlSound = /** @class */ (function (_super) {
            __extends(HtmlSound, _super);
            /**
             * @private
             * @inheritDoc
             */
            function HtmlSound() {
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.loaded = false;
                return _this;
            }
            Object.defineProperty(HtmlSound.prototype, "length", {
                get: function () {
                    if (this.originAudio) {
                        return this.originAudio.duration;
                    }
                    throw new Error("sound not loaded!");
                    //return 0;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @inheritDoc
             */
            HtmlSound.prototype.load = function (url) {
                var self = this;
                this.url = url;
                if (true && !url) {
                    egret.$error(3002);
                }
                var audio = new Audio(url);
                audio.addEventListener("canplaythrough", onAudioLoaded);
                audio.addEventListener("error", onAudioError);
                var ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf("firefox") >= 0) { //火狐兼容
                    audio.autoplay = !0;
                    audio.muted = true;
                }
                //edge and ie11
                var ie = ua.indexOf("edge") >= 0 || ua.indexOf("trident") >= 0;
                if (ie) {
                    document.body.appendChild(audio);
                }
                audio.load();
                HtmlSound.loadingSoundMap[url] = audio;
                this.originAudio = audio;
                if (HtmlSound.clearAudios[this.url]) {
                    delete HtmlSound.clearAudios[this.url];
                }
                function onAudioLoaded() {
                    delete HtmlSound.loadingSoundMap[url];
                    HtmlSound.$recycle(self.url, audio);
                    removeListeners();
                    if (ua.indexOf("firefox") >= 0) { //火狐兼容
                        audio.pause();
                        audio.muted = false;
                    }
                    if (ie) {
                        document.body.appendChild(audio);
                    }
                    self.loaded = true;
                    self.dispatchEventWith(egret.Event.COMPLETE);
                }
                function onAudioError() {
                    removeListeners();
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                }
                function removeListeners() {
                    audio.removeEventListener("canplaythrough", onAudioLoaded);
                    audio.removeEventListener("error", onAudioError);
                    if (ie) {
                        document.body.removeChild(audio);
                    }
                }
            };
            /**
             * @inheritDoc
             */
            HtmlSound.prototype.play = function (startTime, loops) {
                startTime = +startTime || 0;
                loops = +loops || 0;
                if (true && this.loaded == false) {
                    egret.$error(1049);
                }
                var audio = HtmlSound.$pop(this.url);
                if (audio == null) {
                    audio = this.originAudio.cloneNode();
                }
                else {
                    //audio.load();
                }
                audio.autoplay = true;
                var channel = new web.HtmlSoundChannel(audio);
                channel.$url = this.url;
                channel.$loops = loops;
                channel.$startTime = startTime;
                channel.$play();
                egret.sys.$pushSoundChannel(channel);
                return channel;
            };
            /**
             * @inheritDoc
             */
            HtmlSound.prototype.close = function () {
                if (this.loaded && this.originAudio) {
                    this.originAudio.src = "";
                }
                if (this.originAudio)
                    this.originAudio = null;
                HtmlSound.$clear(this.url);
                this.loaded = false;
            };
            HtmlSound.$clear = function (url) {
                HtmlSound.clearAudios[url] = true;
                var array = HtmlSound.audios[url];
                if (array) {
                    array.length = 0;
                }
            };
            HtmlSound.$pop = function (url) {
                var array = HtmlSound.audios[url];
                if (array && array.length > 0) {
                    return array.pop();
                }
                return null;
            };
            HtmlSound.$recycle = function (url, audio) {
                if (HtmlSound.clearAudios[url]) {
                    return;
                }
                var array = HtmlSound.audios[url];
                if (HtmlSound.audios[url] == null) {
                    array = HtmlSound.audios[url] = [];
                }
                array.push(audio);
            };
            /**
             * Background music
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 背景音乐
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            HtmlSound.MUSIC = "music";
            /**
             * EFFECT
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 音效
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            HtmlSound.EFFECT = "effect";
            HtmlSound.loadingSoundMap = {};
            /**
             * @private
             */
            HtmlSound.audios = {};
            HtmlSound.clearAudios = {};
            return HtmlSound;
        }(egret.EventDispatcher));
        web.HtmlSound = HtmlSound;
        __reflect(HtmlSound.prototype, "egret.web.HtmlSound", ["egret.Sound"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * @inheritDoc
         */
        var HtmlSoundChannel = /** @class */ (function (_super) {
            __extends(HtmlSoundChannel, _super);
            /**
             * @private
             */
            function HtmlSoundChannel(audio) {
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.$startTime = 0;
                /**
                 * @private
                 */
                _this.audio = null;
                //声音是否已经播放完成
                _this.isStopped = false;
                _this.canPlay = function () {
                    _this.audio.removeEventListener("canplay", _this.canPlay);
                    try {
                        _this.audio.currentTime = _this.$startTime;
                    }
                    catch (e) {
                    }
                    finally {
                        _this.audio.play();
                    }
                };
                /**
                 * @private
                 */
                _this.onPlayEnd = function () {
                    if (_this.$loops == 1) {
                        _this.stop();
                        _this.dispatchEventWith(egret.Event.SOUND_COMPLETE);
                        return;
                    }
                    if (_this.$loops > 0) {
                        _this.$loops--;
                    }
                    /////////////
                    //this.audio.load();
                    _this.$play();
                };
                /**
                 * @private
                 */
                _this._volume = 1;
                audio.addEventListener("ended", _this.onPlayEnd);
                _this.audio = audio;
                return _this;
            }
            HtmlSoundChannel.prototype.$play = function () {
                if (this.isStopped) {
                    egret.$error(1036);
                    return;
                }
                try {
                    //this.audio.pause();
                    this.audio.volume = this._volume;
                    this.audio.currentTime = this.$startTime;
                }
                catch (e) {
                    this.audio.addEventListener("canplay", this.canPlay);
                    return;
                }
                this.audio.play();
            };
            /**
             * @private
             * @inheritDoc
             */
            HtmlSoundChannel.prototype.stop = function () {
                if (!this.audio)
                    return;
                if (!this.isStopped) {
                    egret.sys.$popSoundChannel(this);
                }
                this.isStopped = true;
                var audio = this.audio;
                audio.removeEventListener("ended", this.onPlayEnd);
                audio.removeEventListener("canplay", this.canPlay);
                audio.volume = 0;
                this._volume = 0;
                this.audio = null;
                var url = this.$url;
                //延迟一定时间再停止，规避chrome报错
                audio.pause();
                web.HtmlSound.$recycle(url, audio);
            };
            Object.defineProperty(HtmlSoundChannel.prototype, "volume", {
                /**
                 * @private
                 * @inheritDoc
                 */
                get: function () {
                    return this._volume;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    if (this.isStopped) {
                        egret.$error(1036);
                        return;
                    }
                    this._volume = value;
                    if (!this.audio)
                        return;
                    this.audio.volume = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HtmlSoundChannel.prototype, "position", {
                /**
                 * @private
                 * @inheritDoc
                 */
                get: function () {
                    if (!this.audio)
                        return 0;
                    return this.audio.currentTime;
                },
                enumerable: true,
                configurable: true
            });
            return HtmlSoundChannel;
        }(egret.EventDispatcher));
        web.HtmlSoundChannel = HtmlSoundChannel;
        __reflect(HtmlSoundChannel.prototype, "egret.web.HtmlSoundChannel", ["egret.SoundChannel", "egret.IEventDispatcher"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WebAudioDecode = /** @class */ (function () {
            function WebAudioDecode() {
            }
            /**
             * @private
             *
             */
            WebAudioDecode.decodeAudios = function () {
                if (WebAudioDecode.decodeArr.length <= 0) {
                    return;
                }
                if (WebAudioDecode.isDecoding) {
                    return;
                }
                WebAudioDecode.isDecoding = true;
                var decodeInfo = WebAudioDecode.decodeArr.shift();
                WebAudioDecode.ctx.decodeAudioData(decodeInfo["buffer"], function (audioBuffer) {
                    decodeInfo["self"].audioBuffer = audioBuffer;
                    if (decodeInfo["success"]) {
                        decodeInfo["success"]();
                    }
                    WebAudioDecode.isDecoding = false;
                    WebAudioDecode.decodeAudios();
                }, function () {
                    egret.log('sound decode error');
                    if (decodeInfo["fail"]) {
                        decodeInfo["fail"]();
                    }
                    WebAudioDecode.isDecoding = false;
                    WebAudioDecode.decodeAudios();
                });
            };
            /**
             * @private
             */
            WebAudioDecode.decodeArr = [];
            /**
             * @private
             */
            WebAudioDecode.isDecoding = false;
            return WebAudioDecode;
        }());
        web.WebAudioDecode = WebAudioDecode;
        __reflect(WebAudioDecode.prototype, "egret.web.WebAudioDecode");
        /**
         * @private
         * @inheritDoc
         */
        var WebAudioSound = /** @class */ (function (_super) {
            __extends(WebAudioSound, _super);
            /**
             * @private
             * @inheritDoc
             */
            function WebAudioSound() {
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.loaded = false;
                return _this;
            }
            Object.defineProperty(WebAudioSound.prototype, "length", {
                get: function () {
                    if (this.audioBuffer) {
                        return this.audioBuffer.duration;
                    }
                    throw new Error("sound not loaded!");
                    //return 0;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @inheritDoc
             */
            WebAudioSound.prototype.load = function (url) {
                var self = this;
                this.url = url;
                if (true && !url) {
                    egret.$error(3002);
                }
                var request = new XMLHttpRequest();
                request.open("GET", url, true);
                request.responseType = "arraybuffer";
                request.addEventListener("load", function () {
                    var ioError = (request.status >= 400);
                    if (ioError) {
                        self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                    }
                    else {
                        WebAudioDecode.decodeArr.push({
                            "buffer": request.response,
                            "success": onAudioLoaded,
                            "fail": onAudioError,
                            "self": self,
                            "url": self.url
                        });
                        WebAudioDecode.decodeAudios();
                    }
                });
                request.addEventListener("error", function () {
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                });
                request.send();
                function onAudioLoaded() {
                    self.loaded = true;
                    self.dispatchEventWith(egret.Event.COMPLETE);
                }
                function onAudioError() {
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                }
            };
            /**
             * @inheritDoc
             */
            WebAudioSound.prototype.play = function (startTime, loops) {
                startTime = +startTime || 0;
                loops = +loops || 0;
                if (true && this.loaded == false) {
                    egret.$error(1049);
                }
                var channel = new web.WebAudioSoundChannel();
                channel.$url = this.url;
                channel.$loops = loops;
                channel.$audioBuffer = this.audioBuffer;
                channel.$startTime = startTime;
                channel.$play();
                egret.sys.$pushSoundChannel(channel);
                return channel;
            };
            /**
             * @inheritDoc
             */
            WebAudioSound.prototype.close = function () {
            };
            /**
             * Background music
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 背景音乐
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            WebAudioSound.MUSIC = "music";
            /**
             * EFFECT
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 音效
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            WebAudioSound.EFFECT = "effect";
            return WebAudioSound;
        }(egret.EventDispatcher));
        web.WebAudioSound = WebAudioSound;
        __reflect(WebAudioSound.prototype, "egret.web.WebAudioSound", ["egret.Sound"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * @inheritDoc
         */
        var WebAudioSoundChannel = /** @class */ (function (_super) {
            __extends(WebAudioSoundChannel, _super);
            /**
             * @private
             */
            function WebAudioSoundChannel() {
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.$startTime = 0;
                /**
                 * @private
                 */
                _this.bufferSource = null;
                /**
                 * @private
                 */
                _this.context = web.WebAudioDecode.ctx;
                //声音是否已经播放完成
                _this.isStopped = false;
                /**
                 * @private
                 */
                _this._currentTime = 0;
                /**
                 * @private
                 */
                _this._volume = 1;
                /**
                 * @private
                 */
                _this.onPlayEnd = function () {
                    if (_this.$loops == 1) {
                        _this.stop();
                        _this.dispatchEventWith(egret.Event.SOUND_COMPLETE);
                        return;
                    }
                    if (_this.$loops > 0) {
                        _this.$loops--;
                    }
                    /////////////
                    _this.$play();
                };
                /**
                 * @private
                 */
                _this._startTime = 0;
                _this.initGain();
                return _this;
            }
            WebAudioSoundChannel.prototype.initGain = function () {
                this.gain = null;
                if (this.context["createGain"]) {
                    this.gain = this.context["createGain"]();
                }
                else {
                    this.gain = this.context["createGainNode"]();
                }
            };
            WebAudioSoundChannel.prototype.$play = function () {
                if (this.isStopped) {
                    egret.$error(1036);
                    return;
                }
                if (this.bufferSource) {
                    this.bufferSource.onended = null;
                    this.bufferSource = null;
                }
                var context = this.context;
                var gain = this.gain;
                var bufferSource = context.createBufferSource();
                this.bufferSource = bufferSource;
                bufferSource.buffer = this.$audioBuffer;
                bufferSource.connect(gain);
                gain.connect(context.destination);
                bufferSource.onended = this.onPlayEnd;
                this._startTime = Date.now();
                this.gain.gain.value = this._volume;
                bufferSource.start(0, this.$startTime);
                this._currentTime = 0;
            };
            WebAudioSoundChannel.prototype.stop = function () {
                if (this.bufferSource) {
                    var sourceNode = this.bufferSource;
                    if (sourceNode.stop) {
                        sourceNode.stop(0);
                    }
                    else {
                        sourceNode.noteOff(0);
                    }
                    sourceNode.onended = null;
                    sourceNode.disconnect();
                    this.bufferSource = null;
                    this.$audioBuffer = null;
                }
                if (!this.isStopped) {
                    egret.sys.$popSoundChannel(this);
                }
                this.isStopped = true;
            };
            Object.defineProperty(WebAudioSoundChannel.prototype, "volume", {
                /**
                 * @private
                 * @inheritDoc
                 */
                get: function () {
                    return this._volume;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    if (this.isStopped) {
                        egret.$error(1036);
                        return;
                    }
                    this._volume = value;
                    this.gain.gain.value = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebAudioSoundChannel.prototype, "position", {
                /**
                 * @private
                 * @inheritDoc
                 */
                get: function () {
                    if (this.bufferSource) {
                        return (Date.now() - this._startTime) / 1000 + this.$startTime;
                    }
                    return 0;
                },
                enumerable: true,
                configurable: true
            });
            return WebAudioSoundChannel;
        }(egret.EventDispatcher));
        web.WebAudioSoundChannel = WebAudioSoundChannel;
        __reflect(WebAudioSoundChannel.prototype, "egret.web.WebAudioSoundChannel", ["egret.SoundChannel", "egret.IEventDispatcher"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * @inheritDoc
         */
        var WebVideo = /** @class */ (function (_super) {
            __extends(WebVideo, _super);
            /**
             * @inheritDoc
             */
            function WebVideo(url, cache) {
                if (cache === void 0) { cache = true; }
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.loaded = false;
                /**
                 * @private
                 */
                _this.closed = false;
                /**
                 * @private
                 */
                _this.heightSet = NaN;
                /**
                 * @private
                 */
                _this.widthSet = NaN;
                /**
                 * @private
                 * pc上视频卡住的时候不能暂停
                 */
                _this.waiting = false;
                /**
                 * @private
                 * 用户是否设置了 pause
                 */
                _this.userPause = false;
                /**
                 * @private
                 * 用户是否设置了 play
                 */
                _this.userPlay = false;
                _this.isPlayed = false;
                _this.screenChanged = function (e) {
                    var isfullscreen = document.fullscreenEnabled || document.webkitIsFullScreen;
                    if (!isfullscreen) {
                        _this.checkFullScreen(false);
                        if (!egret.Capabilities.isMobile) {
                            _this._fullscreen = isfullscreen;
                        }
                    }
                };
                _this._fullscreen = true;
                /**
                 * @private
                 *
                 */
                _this.onVideoLoaded = function () {
                    _this.video.removeEventListener("canplay", _this.onVideoLoaded);
                    var video = _this.video;
                    _this.loaded = true;
                    //video.pause();
                    if (_this.posterData) {
                        _this.posterData.width = _this.getPlayWidth();
                        _this.posterData.height = _this.getPlayHeight();
                    }
                    video.width = video.videoWidth;
                    video.height = video.videoHeight;
                    window.setTimeout(function () {
                        _this.dispatchEventWith(egret.Event.COMPLETE);
                    }, 200);
                };
                _this.$renderNode = new egret.sys.BitmapNode();
                _this.src = url;
                _this.once(egret.Event.ADDED_TO_STAGE, _this.loadPoster, _this);
                if (url) {
                    _this.load();
                }
                return _this;
            }
            WebVideo.prototype.createNativeDisplayObject = function () {
                this.$nativeDisplayObject = new egret_native.NativeDisplayObject(1 /* BITMAP */);
            };
            /**
             * @inheritDoc
             */
            WebVideo.prototype.load = function (url, cache) {
                var _this = this;
                if (cache === void 0) { cache = true; }
                url = url || this.src;
                this.src = url;
                if (true && !url) {
                    egret.$error(3002);
                }
                if (this.video && this.video.src == url) {
                    return;
                }
                var video;
                if (!this.video || egret.Capabilities.isMobile) {
                    video = document.createElement("video");
                    this.video = video;
                    video.controls = null;
                }
                else {
                    video = this.video;
                }
                if (url.indexOf("http://") != -1 || url.indexOf("HTTP://") != -1 || url.indexOf("https://") != -1 || url.indexOf("HTTPS://") != -1) {
                    video.crossOrigin = "anonymous";
                }
                video.src = url;
                video.setAttribute("autoplay", "autoplay");
                video.setAttribute("webkit-playsinline", "true");
                video.setAttribute("playsinline", "true");
                video.setAttribute("x5-video-player-type", "h5-page");
                video.addEventListener("canplay", this.onVideoLoaded);
                video.addEventListener("error", function () { return _this.onVideoError(); });
                video.addEventListener("ended", function () { return _this.onVideoEnded(); });
                var firstPause = false;
                video.addEventListener("canplay", function () {
                    _this.waiting = false;
                    if (!firstPause) {
                        firstPause = true;
                        video.pause();
                    }
                    else {
                        if (_this.userPause) {
                            _this.pause();
                        }
                        else if (_this.userPlay) {
                            _this.play();
                        }
                    }
                });
                video.addEventListener("waiting", function () {
                    _this.waiting = true;
                });
                video.load();
                this.videoPlay();
                video.style.position = "absolute";
                video.style.top = "0px";
                video.style.zIndex = "-88888";
                video.style.left = "0px";
                video.height = 1;
                video.width = 1;
            };
            /**
             * @inheritDoc
             */
            WebVideo.prototype.play = function (startTime, loop) {
                var _this = this;
                if (loop === void 0) { loop = false; }
                if (this.loaded == false) {
                    this.load(this.src);
                    this.once(egret.Event.COMPLETE, function (e) { return _this.play(startTime, loop); }, this);
                    return;
                }
                this.isPlayed = true;
                var video = this.video;
                if (startTime != undefined) {
                    video.currentTime = +startTime || 0;
                }
                video.loop = !!loop;
                if (egret.Capabilities.isMobile) {
                    video.style.zIndex = "-88888"; //移动端，就算设置成最小，只要全屏，都会在最上层，而且在自动退出去后，不担心挡住canvas
                }
                else {
                    video.style.zIndex = "9999";
                }
                video.style.position = "absolute";
                video.style.top = "0px";
                video.style.left = "0px";
                video.height = video.videoHeight;
                video.width = video.videoWidth;
                if (egret.Capabilities.os != "Windows PC" && egret.Capabilities.os != "Mac OS") {
                    window.setTimeout(function () {
                        video.width = 0;
                    }, 1000);
                }
                this.checkFullScreen(this._fullscreen);
            };
            WebVideo.prototype.videoPlay = function () {
                this.userPause = false;
                if (this.waiting) {
                    this.userPlay = true;
                    return;
                }
                this.userPlay = false;
                this.video.play();
            };
            WebVideo.prototype.checkFullScreen = function (playFullScreen) {
                var video = this.video;
                if (playFullScreen) {
                    if (video.parentElement == null) {
                        video.removeAttribute("webkit-playsinline");
                        video.removeAttribute("playsinline");
                        document.body.appendChild(video);
                    }
                    egret.stopTick(this.markDirty, this);
                    this.goFullscreen();
                }
                else {
                    if (video.parentElement != null) {
                        video.parentElement.removeChild(video);
                    }
                    video.setAttribute("webkit-playsinline", "true");
                    video.setAttribute("playsinline", "true");
                    this.setFullScreenMonitor(false);
                    egret.startTick(this.markDirty, this);
                    if (egret.Capabilities.isMobile) {
                        this.video.currentTime = 0;
                        this.onVideoEnded();
                        return;
                    }
                }
                this.videoPlay();
            };
            WebVideo.prototype.goFullscreen = function () {
                var video = this.video;
                var fullscreenType;
                fullscreenType = egret.web.getPrefixStyleName('requestFullscreen', video);
                if (!video[fullscreenType]) {
                    fullscreenType = egret.web.getPrefixStyleName('requestFullScreen', video);
                    if (!video[fullscreenType]) {
                        return true;
                    }
                }
                video.removeAttribute("webkit-playsinline");
                video[fullscreenType]();
                this.setFullScreenMonitor(true);
                return true;
            };
            WebVideo.prototype.setFullScreenMonitor = function (use) {
                var video = this.video;
                if (use) {
                    video.addEventListener("mozfullscreenchange", this.screenChanged);
                    video.addEventListener("webkitfullscreenchange", this.screenChanged);
                    video.addEventListener("mozfullscreenerror", this.screenError);
                    video.addEventListener("webkitfullscreenerror", this.screenError);
                }
                else {
                    video.removeEventListener("mozfullscreenchange", this.screenChanged);
                    video.removeEventListener("webkitfullscreenchange", this.screenChanged);
                    video.removeEventListener("mozfullscreenerror", this.screenError);
                    video.removeEventListener("webkitfullscreenerror", this.screenError);
                }
            };
            WebVideo.prototype.screenError = function () {
                egret.$error(3014);
            };
            WebVideo.prototype.exitFullscreen = function () {
                //退出全屏
                if (document['exitFullscreen']) {
                    document['exitFullscreen']();
                }
                else if (document['msExitFullscreen']) {
                    document['msExitFullscreen']();
                }
                else if (document['mozCancelFullScreen']) {
                    document['mozCancelFullScreen']();
                }
                else if (document['oCancelFullScreen']) {
                    document['oCancelFullScreen']();
                }
                else if (document['webkitExitFullscreen']) {
                    document['webkitExitFullscreen']();
                }
                else {
                    this.video.style.display = "none";
                }
                if (this.video && this.video.parentElement) {
                    this.video.parentElement.removeChild(this.video);
                }
            };
            /**
             * @private
             *
             */
            WebVideo.prototype.onVideoEnded = function () {
                this.pause();
                this.isPlayed = false;
                if (this._fullscreen) {
                    this.exitFullscreen();
                }
                this.dispatchEventWith(egret.Event.ENDED);
            };
            /**
             * @private
             *
             */
            WebVideo.prototype.onVideoError = function () {
                console.error("video errorCode:", this.video.error.code);
                this.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
            };
            /**
             * @inheritDoc
             */
            WebVideo.prototype.close = function () {
                var _this = this;
                this.closed = true;
                this.video.removeEventListener("canplay", this.onVideoLoaded);
                this.video.removeEventListener("error", function () { return _this.onVideoError(); });
                this.video.removeEventListener("ended", function () { return _this.onVideoEnded(); });
                this.pause();
                if (this.loaded == false && this.video)
                    this.video.src = "";
                if (this.video && this.video.parentElement) {
                    this.video.parentElement.removeChild(this.video);
                    this.video = null;
                }
                this.loaded = false;
            };
            /**
             * @inheritDoc
             */
            WebVideo.prototype.pause = function () {
                this.userPlay = false;
                if (this.waiting) {
                    this.userPause = true;
                    return;
                }
                this.userPause = false;
                this.video.pause();
                egret.stopTick(this.markDirty, this);
            };
            Object.defineProperty(WebVideo.prototype, "volume", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    if (!this.video)
                        return 1;
                    return this.video.volume;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    if (!this.video)
                        return;
                    this.video.volume = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebVideo.prototype, "position", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    if (!this.video)
                        return 0;
                    return this.video.currentTime;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    if (!this.video)
                        return;
                    this.video.currentTime = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebVideo.prototype, "fullscreen", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    return this._fullscreen;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    if (egret.Capabilities.isMobile) {
                        return;
                    }
                    this._fullscreen = !!value;
                    if (this.video && this.video.paused == false) {
                        this.checkFullScreen(this._fullscreen);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebVideo.prototype, "bitmapData", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    if (!this.video || !this.loaded)
                        return null;
                    if (!this._bitmapData) {
                        this.video.width = this.video.videoWidth;
                        this.video.height = this.video.videoHeight;
                        this._bitmapData = new egret.BitmapData(this.video);
                        this._bitmapData.$deleteSource = false;
                    }
                    return this._bitmapData;
                },
                enumerable: true,
                configurable: true
            });
            WebVideo.prototype.loadPoster = function () {
                var _this = this;
                var poster = this.poster;
                if (!poster)
                    return;
                var imageLoader = new egret.ImageLoader();
                imageLoader.once(egret.Event.COMPLETE, function (e) {
                    var posterData = imageLoader.data;
                    _this.posterData = imageLoader.data;
                    _this.$renderDirty = true;
                    _this.posterData.width = _this.getPlayWidth();
                    _this.posterData.height = _this.getPlayHeight();
                    if (egret.nativeRender) {
                        var texture = new egret.Texture();
                        texture._setBitmapData(_this.posterData);
                        _this.$nativeDisplayObject.setTexture(texture);
                    }
                }, this);
                imageLoader.load(poster);
            };
            /**
             * @private
             */
            WebVideo.prototype.$measureContentBounds = function (bounds) {
                var bitmapData = this.bitmapData;
                var posterData = this.posterData;
                if (bitmapData) {
                    bounds.setTo(0, 0, this.getPlayWidth(), this.getPlayHeight());
                }
                else if (posterData) {
                    bounds.setTo(0, 0, this.getPlayWidth(), this.getPlayHeight());
                }
                else {
                    bounds.setEmpty();
                }
            };
            WebVideo.prototype.getPlayWidth = function () {
                if (!isNaN(this.widthSet)) {
                    return this.widthSet;
                }
                if (this.bitmapData) {
                    return this.bitmapData.width;
                }
                if (this.posterData) {
                    return this.posterData.width;
                }
                return NaN;
            };
            WebVideo.prototype.getPlayHeight = function () {
                if (!isNaN(this.heightSet)) {
                    return this.heightSet;
                }
                if (this.bitmapData) {
                    return this.bitmapData.height;
                }
                if (this.posterData) {
                    return this.posterData.height;
                }
                return NaN;
            };
            /**
             * @private
             */
            WebVideo.prototype.$updateRenderNode = function () {
                var node = this.$renderNode;
                var bitmapData = this.bitmapData;
                var posterData = this.posterData;
                var width = this.getPlayWidth();
                var height = this.getPlayHeight();
                if ((!this.isPlayed || egret.Capabilities.isMobile) && posterData) {
                    node.image = posterData;
                    node.imageWidth = width;
                    node.imageHeight = height;
                    node.drawImage(0, 0, posterData.width, posterData.height, 0, 0, width, height);
                }
                else if (this.isPlayed && bitmapData) {
                    node.image = bitmapData;
                    node.imageWidth = bitmapData.width;
                    node.imageHeight = bitmapData.height;
                    if (egret.Capabilities.renderMode == "webgpu") {
                        var gpuTex = bitmapData["gpuTexture"];
                        if (gpuTex && gpuTex.destroy) {
                            try {
                                gpuTex.destroy();
                            }
                            catch (e) { }
                        }
                        bitmapData["gpuTexture"] = null;
                    }
                    else {
                        egret.WebGLUtils.deleteWebGLTexture(bitmapData.webGLTexture);
                        bitmapData.webGLTexture = null;
                    }
                    node.drawImage(0, 0, bitmapData.width, bitmapData.height, 0, 0, width, height);
                }
            };
            WebVideo.prototype.markDirty = function () {
                this.$renderDirty = true;
                return true;
            };
            /**
             * @private
             * 设置显示高度
             */
            WebVideo.prototype.$setHeight = function (value) {
                this.heightSet = value;
                if (this.paused) { // 在暂停和播放结束后，修改视频大小时，没有重绘导致的bug
                    var self_1 = this;
                    this.$renderDirty = true;
                    window.setTimeout(function () {
                        self_1.$renderDirty = false;
                    }, 200);
                }
                _super.prototype.$setHeight.call(this, value);
            };
            /**
             * @private
             * 设置显示宽度
             */
            WebVideo.prototype.$setWidth = function (value) {
                this.widthSet = value;
                if (this.paused) { // 在暂停和播放结束后，修改视频大小时，没有重绘导致的bug
                    var self_2 = this;
                    this.$renderDirty = true;
                    window.setTimeout(function () {
                        self_2.$renderDirty = false;
                    }, 200);
                }
                _super.prototype.$setWidth.call(this, value);
            };
            Object.defineProperty(WebVideo.prototype, "paused", {
                get: function () {
                    if (this.video) {
                        return this.video.paused;
                    }
                    return true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebVideo.prototype, "length", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    if (this.video) {
                        return this.video.duration;
                    }
                    throw new Error("Video not loaded!");
                },
                enumerable: true,
                configurable: true
            });
            return WebVideo;
        }(egret.DisplayObject));
        web.WebVideo = WebVideo;
        __reflect(WebVideo.prototype, "egret.web.WebVideo", ["egret.Video", "egret.DisplayObject"]);
        egret.Video = WebVideo;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WebHttpRequest = /** @class */ (function (_super) {
            __extends(WebHttpRequest, _super);
            /**
             * @private
             */
            function WebHttpRequest() {
                var _this = _super.call(this) || this;
                /**
                 *
                 */
                _this.timeout = 0;
                /**
                 * @private
                 */
                _this._url = "";
                _this._method = "";
                return _this;
            }
            Object.defineProperty(WebHttpRequest.prototype, "response", {
                /**
                 * @private
                 * 本次请求返回的数据，数据类型根据responseType设置的值确定。
                 */
                get: function () {
                    if (!this._xhr) {
                        return null;
                    }
                    if (this._xhr.response != undefined) {
                        return this._xhr.response;
                    }
                    if (this._responseType == "text") {
                        return this._xhr.responseText;
                    }
                    if (this._responseType == "arraybuffer" && /msie 9.0/i.test(navigator.userAgent)) {
                        var w = window;
                        return w.convertResponseBodyToText(this._xhr["responseBody"]);
                    }
                    if (this._responseType == "document") {
                        return this._xhr.responseXML;
                    }
                    /*if (this._xhr.responseXML) {
                        return this._xhr.responseXML;
                    }
                    if (this._xhr.responseText != undefined) {
                        return this._xhr.responseText;
                    }*/
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebHttpRequest.prototype, "responseType", {
                /**
                 * @private
                 * 设置返回的数据格式，请使用 HttpResponseType 里定义的枚举值。设置非法的值或不设置，都将使用HttpResponseType.TEXT。
                 */
                get: function () {
                    return this._responseType;
                },
                set: function (value) {
                    this._responseType = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebHttpRequest.prototype, "withCredentials", {
                /**
                 * @private
                 * 表明在进行跨站(cross-site)的访问控制(Access-Control)请求时，是否使用认证信息(例如cookie或授权的header)。 默认为 false。(这个标志不会影响同站的请求)
                 */
                get: function () {
                    return this._withCredentials;
                },
                set: function (value) {
                    this._withCredentials = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @private
             *
             * @returns
             */
            WebHttpRequest.prototype.getXHR = function () {
                if (window["XMLHttpRequest"]) {
                    return new window["XMLHttpRequest"]();
                }
                else {
                    return new ActiveXObject("MSXML2.XMLHTTP");
                }
            };
            /**
             * @private
             * 初始化一个请求.注意，若在已经发出请求的对象上调用此方法，相当于立即调用abort().
             * @param url 该请求所要访问的URL该请求所要访问的URL
             * @param method 请求所使用的HTTP方法， 请使用 HttpMethod 定义的枚举值.
             */
            WebHttpRequest.prototype.open = function (url, method) {
                if (method === void 0) { method = "GET"; }
                this._url = url;
                this._method = method;
                if (this._xhr) {
                    this._xhr.abort();
                    this._xhr = null;
                }
                var xhr = this.getXHR(); //new XMLHttpRequest();
                if (window["XMLHttpRequest"]) {
                    xhr.addEventListener("load", this.onload.bind(this));
                    xhr.addEventListener("error", this.onerror.bind(this));
                }
                else {
                    xhr.onreadystatechange = this.onReadyStateChange.bind(this);
                }
                xhr.onprogress = this.updateProgress.bind(this);
                xhr.ontimeout = this.onTimeout.bind(this);
                xhr.open(this._method, this._url, true);
                this._xhr = xhr;
            };
            /**
             * @private
             * 发送请求.
             * @param data 需要发送的数据
             */
            WebHttpRequest.prototype.send = function (data) {
                if (this._responseType != null) {
                    this._xhr.responseType = this._responseType;
                }
                if (this._withCredentials != null) {
                    this._xhr.withCredentials = this._withCredentials;
                }
                if (this.headerObj) {
                    for (var key in this.headerObj) {
                        this._xhr.setRequestHeader(key, this.headerObj[key]);
                    }
                }
                this._xhr.timeout = this.timeout;
                this._xhr.send(data);
            };
            /**
             * @private
             * 如果请求已经被发送,则立刻中止请求.
             */
            WebHttpRequest.prototype.abort = function () {
                if (this._xhr) {
                    this._xhr.abort();
                }
            };
            /**
             * @private
             * 返回所有响应头信息(响应头名和值), 如果响应头还没接受,则返回"".
             */
            WebHttpRequest.prototype.getAllResponseHeaders = function () {
                if (!this._xhr) {
                    return null;
                }
                var result = this._xhr.getAllResponseHeaders();
                return result ? result : "";
            };
            /**
             * @private
             * 给指定的HTTP请求头赋值.在这之前,您必须确认已经调用 open() 方法打开了一个url.
             * @param header 将要被赋值的请求头名称.
             * @param value 给指定的请求头赋的值.
             */
            WebHttpRequest.prototype.setRequestHeader = function (header, value) {
                if (!this.headerObj) {
                    this.headerObj = {};
                }
                this.headerObj[header] = value;
            };
            /**
             * @private
             * 返回指定的响应头的值, 如果响应头还没被接受,或该响应头不存在,则返回"".
             * @param header 要返回的响应头名称
             */
            WebHttpRequest.prototype.getResponseHeader = function (header) {
                if (!this._xhr) {
                    return null;
                }
                var result = this._xhr.getResponseHeader(header);
                return result ? result : "";
            };
            /**
             * @private
             */
            WebHttpRequest.prototype.onTimeout = function () {
                if (true) {
                    egret.$warn(1052, this._url);
                }
                this.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
            };
            /**
             * @private
             */
            WebHttpRequest.prototype.onReadyStateChange = function () {
                var xhr = this._xhr;
                if (xhr.readyState == 4) { // 4 = "loaded"
                    var ioError_1 = (xhr.status >= 400 || xhr.status == 0);
                    var url_1 = this._url;
                    var self_3 = this;
                    window.setTimeout(function () {
                        if (ioError_1) { //请求错误
                            if (true && !self_3.hasEventListener(egret.IOErrorEvent.IO_ERROR)) {
                                egret.$error(1011, url_1);
                            }
                            self_3.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                        }
                        else {
                            self_3.dispatchEventWith(egret.Event.COMPLETE);
                        }
                    }, 0);
                }
            };
            /**
             * @private
             */
            WebHttpRequest.prototype.updateProgress = function (event) {
                if (event.lengthComputable) {
                    egret.ProgressEvent.dispatchProgressEvent(this, egret.ProgressEvent.PROGRESS, event.loaded, event.total);
                }
            };
            /**
             * @private
             */
            WebHttpRequest.prototype.onload = function () {
                var self = this;
                var xhr = this._xhr;
                var url = this._url;
                var ioError = (xhr.status >= 400);
                window.setTimeout(function () {
                    if (ioError) { //请求错误
                        if (true && !self.hasEventListener(egret.IOErrorEvent.IO_ERROR)) {
                            egret.$error(1011, url);
                        }
                        self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                    }
                    else {
                        self.dispatchEventWith(egret.Event.COMPLETE);
                    }
                }, 0);
            };
            /**
             * @private
             */
            WebHttpRequest.prototype.onerror = function () {
                var url = this._url;
                var self = this;
                window.setTimeout(function () {
                    if (true && !self.hasEventListener(egret.IOErrorEvent.IO_ERROR)) {
                        egret.$error(1011, url);
                    }
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                }, 0);
            };
            return WebHttpRequest;
        }(egret.EventDispatcher));
        web.WebHttpRequest = WebHttpRequest;
        __reflect(WebHttpRequest.prototype, "egret.web.WebHttpRequest", ["egret.HttpRequest"]);
        egret.HttpRequest = WebHttpRequest;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        var winURL = window["URL"] || window["webkitURL"];
        /**
         * @private
         * ImageLoader 类可用于加载图像（JPG、PNG 或 GIF）文件。使用 load() 方法来启动加载。被加载的图像对象数据将存储在 ImageLoader.data 属性上 。
         */
        var WebImageLoader = /** @class */ (function (_super) {
            __extends(WebImageLoader, _super);
            function WebImageLoader() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                /**
                 * @private
                 * 使用 load() 方法加载成功的 BitmapData 图像数据。
                 */
                _this.data = null;
                /**
                 * @private
                 * 当从其他站点加载一个图片时，指定是否启用跨域资源共享(CORS)，默认值为null。
                 * 可以设置为"anonymous","use-credentials"或null,设置为其他值将等同于"anonymous"。
                 */
                _this._crossOrigin = null;
                /**
                 * @private
                 * 标记crossOrigin有没有被设置过,设置过之后使用设置的属性
                 */
                _this._hasCrossOriginSet = false;
                /**
                 * @private
                 */
                _this.currentImage = null;
                /**
                 * @private
                 */
                _this.request = null;
                return _this;
            }
            Object.defineProperty(WebImageLoader.prototype, "crossOrigin", {
                get: function () {
                    return this._crossOrigin;
                },
                set: function (value) {
                    this._hasCrossOriginSet = true;
                    this._crossOrigin = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @private
             * 启动一次图像加载。注意：若之前已经调用过加载请求，重新调用 load() 将终止先前的请求，并开始新的加载。
             * @param url 要加载的图像文件的地址。
             */
            WebImageLoader.prototype.load = function (url) {
                if (web.Html5Capatibility._canUseBlob
                    && url.indexOf("wxLocalResource:") != 0 //微信专用不能使用 blob
                    && url.indexOf("data:") != 0
                    && url.indexOf("http:") != 0
                    && url.indexOf("https:") != 0) { //如果是base64编码或跨域访问的图片，直接使用Image.src解析。
                    var request = this.request;
                    if (!request) {
                        request = this.request = new egret.web.WebHttpRequest();
                        request.addEventListener(egret.Event.COMPLETE, this.onBlobLoaded, this);
                        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onBlobError, this);
                        request.responseType = "blob";
                    }
                    if (true) {
                        this.currentURL = url;
                    }
                    request.open(url);
                    request.send();
                }
                else {
                    this.loadImage(url);
                }
            };
            /**
             * @private
             */
            WebImageLoader.prototype.onBlobLoaded = function (event) {
                var blob = this.request.response;
                this.request = undefined;
                this.loadImage(winURL.createObjectURL(blob));
            };
            /**
             * @private
             */
            WebImageLoader.prototype.onBlobError = function (event) {
                this.dispatchIOError(this.currentURL);
                this.request = undefined;
            };
            /**
             * @private
             */
            WebImageLoader.prototype.loadImage = function (src) {
                var image = new Image();
                this.data = null;
                this.currentImage = image;
                if (this._hasCrossOriginSet) {
                    if (this._crossOrigin) {
                        image.crossOrigin = this._crossOrigin;
                    }
                }
                else {
                    if (WebImageLoader.crossOrigin) {
                        image.crossOrigin = WebImageLoader.crossOrigin;
                    }
                }
                /*else {
                    if (image.hasAttribute("crossOrigin")) {//兼容猎豹
                        image.removeAttribute("crossOrigin");
                    }
                }*/
                image.onload = this.onImageComplete.bind(this);
                image.onerror = this.onLoadError.bind(this);
                image.src = src;
            };
            /**
             * @private
             */
            WebImageLoader.prototype.onImageComplete = function (event) {
                var image = this.getImage(event);
                if (!image) {
                    return;
                }
                this.data = new egret.BitmapData(image);
                var self = this;
                window.setTimeout(function () {
                    self.dispatchEventWith(egret.Event.COMPLETE);
                }, 0);
            };
            /**
             * @private
             */
            WebImageLoader.prototype.onLoadError = function (event) {
                var image = this.getImage(event);
                if (!image) {
                    return;
                }
                this.dispatchIOError(image.src);
            };
            WebImageLoader.prototype.dispatchIOError = function (url) {
                var self = this;
                window.setTimeout(function () {
                    if (true && !self.hasEventListener(egret.IOErrorEvent.IO_ERROR)) {
                        egret.$error(1011, url);
                    }
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                }, 0);
            };
            /**
             * @private
             */
            WebImageLoader.prototype.getImage = function (event) {
                var image = event.target;
                var url = image.src;
                if (url.indexOf("blob:") == 0) {
                    try {
                        winURL.revokeObjectURL(image.src);
                    }
                    catch (e) {
                        egret.$warn(1037);
                    }
                }
                image.onerror = null;
                image.onload = null;
                if (this.currentImage !== image) {
                    return null;
                }
                this.currentImage = null;
                return image;
            };
            /**
             * @private
             * 指定是否启用跨域资源共享,如果ImageLoader实例有设置过crossOrigin属性将使用设置的属性
             */
            WebImageLoader.crossOrigin = null;
            return WebImageLoader;
        }(egret.EventDispatcher));
        web.WebImageLoader = WebImageLoader;
        __reflect(WebImageLoader.prototype, "egret.web.WebImageLoader", ["egret.ImageLoader"]);
        egret.ImageLoader = WebImageLoader;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @classdesc
         * @extends egret.StageText
         * @private
         */
        var HTML5StageText = /** @class */ (function (_super) {
            __extends(HTML5StageText, _super);
            /**
             * @private
             */
            function HTML5StageText() {
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this._isNeedShow = false;
                /**
                 * @private
                 */
                _this.inputElement = null;
                /**
                 * @private
                 */
                _this.inputDiv = null;
                /**
                 * @private
                 */
                _this._gscaleX = 0;
                /**
                 * @private
                 */
                _this._gscaleY = 0;
                /**
                 * @private
                 */
                _this.textValue = "";
                /**
                 * @private
                 */
                _this.colorValue = 0xffffff;
                /**
                 * @private
                 */
                _this._styleInfoes = {};
                return _this;
            }
            /**
             * @private
             *
             * @param textfield
             */
            HTML5StageText.prototype.$setTextField = function (textfield) {
                this.$textfield = textfield;
                return true;
            };
            /**
             * @private
             *
             */
            HTML5StageText.prototype.$addToStage = function () {
                this.htmlInput = egret.web.$getTextAdapter(this.$textfield);
            };
            /**
             * @private
             *
             */
            HTML5StageText.prototype._initElement = function () {
                var point = this.$textfield.localToGlobal(0, 0);
                var x = point.x;
                var y = point.y;
                // let m = this.$textfield.$renderNode.renderMatrix;
                // let cX = m.a;
                // let cY = m.d;
                var scaleX = this.htmlInput.$scaleX;
                var scaleY = this.htmlInput.$scaleY;
                this.inputDiv.style.left = x * scaleX + "px";
                this.inputDiv.style.top = y * scaleY + "px";
                if (this.$textfield.multiline && this.$textfield.height > this.$textfield.size) {
                    this.inputDiv.style.top = (y) * scaleY + "px";
                    this.inputElement.style.top = (-this.$textfield.lineSpacing / 2) * scaleY + "px";
                }
                else {
                    this.inputDiv.style.top = y * scaleY + "px";
                    this.inputElement.style.top = 0 + "px";
                }
                var node = this.$textfield;
                var cX = 1;
                var cY = 1;
                var rotation = 0;
                while (node.parent) {
                    cX *= node.scaleX;
                    cY *= node.scaleY;
                    rotation += node.rotation;
                    node = node.parent;
                }
                var transformKey = egret.web.getPrefixStyleName("transform");
                this.inputDiv.style[transformKey] = "rotate(" + rotation + "deg)";
                this._gscaleX = scaleX * cX;
                this._gscaleY = scaleY * cY;
            };
            /**
             * @private
             *
             */
            HTML5StageText.prototype.$show = function (active) {
                if (active === void 0) { active = true; }
                if (!this.htmlInput.isCurrentStageText(this)) {
                    this.inputElement = this.htmlInput.getInputElement(this);
                    if (!this.$textfield.multiline) {
                        if (this.inputElement.type == "password" && this.$textfield.inputType != "password") {
                            //解决安卓手机切换到安全键盘后无法切换回普通键盘的问题
                            this.htmlInput.initInputElement(false);
                            this.inputElement = this.htmlInput.getInputElement(this);
                        }
                        this.inputElement.type = this.$textfield.inputType;
                    }
                    else {
                        this.inputElement.type = "text";
                    }
                    this.inputDiv = this.htmlInput._inputDIV;
                }
                else {
                    this.inputElement.onblur = null;
                }
                this.htmlInput._needShow = true;
                //标记当前文本被选中
                this._isNeedShow = true;
                this._initElement();
                if (active) {
                    this.activeShowKeyboard();
                }
            };
            HTML5StageText.prototype.activeShowKeyboard = function () {
                if (this.htmlInput._needShow) {
                    // this.htmlInput._needShow = false;
                    this._isNeedShow = false;
                    this.dispatchEvent(new egret.Event("focus"));
                    this.executeShow();
                    this.htmlInput.show();
                }
                else {
                    this.htmlInput.blurInputElement();
                    this.htmlInput.disposeInputElement();
                }
            };
            /**
             * @private
             *
             */
            HTML5StageText.prototype.onBlurHandler = function () {
                this.htmlInput.clearInputElement();
                window.scrollTo(0, 0);
            };
            /**
             * @private
             *
             */
            HTML5StageText.prototype.onFocusHandler = function () {
                //the soft keyboard will cover the input box in some cases
                var self = this;
                window.setTimeout(function () {
                    if (self.inputElement) {
                        self.inputElement.scrollIntoView();
                    }
                }, 200);
            };
            /**
             * @private
             *
             */
            HTML5StageText.prototype.executeShow = function () {
                //打开
                if (this.inputElement.value !== this.$getText()) {
                    this.inputElement.value = this.$getText();
                }
                if (this.inputElement.onblur == null) {
                    this.inputElement.onblur = this.onBlurHandler.bind(this);
                }
                if (this.inputElement.onfocus == null) {
                    this.inputElement.onfocus = this.onFocusHandler.bind(this);
                }
                this.$resetStageText();
                if (this.$textfield.maxChars > 0) {
                    this.inputElement.setAttribute("maxlength", this.$textfield.maxChars + "");
                }
                else {
                    this.inputElement.removeAttribute("maxlength");
                }
                this.inputElement.selectionStart = this.inputElement.value.length;
                this.inputElement.selectionEnd = this.inputElement.value.length;
                this.inputElement.focus();
            };
            /**
             * @private
             */
            HTML5StageText.prototype.$hide = function () {
                if (this.htmlInput) {
                    this.htmlInput.disconnectStageText(this);
                }
            };
            /**
             * @private
             *
             * @returns
             */
            HTML5StageText.prototype.$getText = function () {
                if (!this.textValue) {
                    this.textValue = "";
                }
                return this.textValue;
            };
            /**
             * @private
             *
             * @param value
             */
            HTML5StageText.prototype.$setText = function (value) {
                this.textValue = value;
                this.resetText();
                return true;
            };
            /**
             * @private
             *
             */
            HTML5StageText.prototype.resetText = function () {
                if (this.inputElement) {
                    this.inputElement.value = this.textValue;
                }
            };
            HTML5StageText.prototype.$setColor = function (value) {
                this.colorValue = value;
                this.resetColor();
                return true;
            };
            /**
             * @private
             *
             */
            HTML5StageText.prototype.resetColor = function () {
                if (this.inputElement) {
                    this.setElementStyle("color", egret.toColorString(this.colorValue));
                }
            };
            HTML5StageText.prototype.$onBlur = function () {
            };
            /**
             * @private
             *
             */
            HTML5StageText.prototype._onInput = function () {
                var self = this;
                window.setTimeout(function () {
                    if (self.inputElement && self.inputElement.selectionStart == self.inputElement.selectionEnd) {
                        self.textValue = self.inputElement.value;
                        egret.Event.dispatchEvent(self, "updateText", false);
                    }
                }, 0);
            };
            HTML5StageText.prototype.setAreaHeight = function () {
                var textfield = this.$textfield;
                if (textfield.multiline) {
                    var textheight = egret.TextFieldUtils.$getTextHeight(textfield);
                    if (textfield.height <= textfield.size) {
                        this.setElementStyle("height", (textfield.size) * this._gscaleY + "px");
                        this.setElementStyle("padding", "0px");
                        this.setElementStyle("lineHeight", (textfield.size) * this._gscaleY + "px");
                    }
                    else if (textfield.height < textheight) {
                        this.setElementStyle("height", (textfield.height) * this._gscaleY + "px");
                        this.setElementStyle("padding", "0px");
                        this.setElementStyle("lineHeight", (textfield.size + textfield.lineSpacing) * this._gscaleY + "px");
                    }
                    else {
                        this.setElementStyle("height", (textheight + textfield.lineSpacing) * this._gscaleY + "px");
                        var rap = (textfield.height - textheight) * this._gscaleY;
                        var valign = egret.TextFieldUtils.$getValign(textfield);
                        var top_1 = rap * valign;
                        var bottom = rap - top_1;
                        this.setElementStyle("padding", top_1 + "px 0px " + bottom + "px 0px");
                        this.setElementStyle("lineHeight", (textfield.size + textfield.lineSpacing) * this._gscaleY + "px");
                    }
                }
            };
            /**
             * @private
             *
             * @param e
             */
            HTML5StageText.prototype._onClickHandler = function (e) {
                if (this._isNeedShow) {
                    e.stopImmediatePropagation();
                    //e.preventDefault();
                    this._isNeedShow = false;
                    this.dispatchEvent(new egret.Event("focus"));
                    this.executeShow();
                }
            };
            /**
             * @private
             *
             */
            HTML5StageText.prototype._onDisconnect = function () {
                this.inputElement = null;
                this.dispatchEvent(new egret.Event("blur"));
            };
            /**
             * @private
             *
             * @param style
             * @param value
             */
            HTML5StageText.prototype.setElementStyle = function (style, value) {
                if (this.inputElement) {
                    if (this._styleInfoes[style] != value) {
                        this.inputElement.style[style] = value;
                        //this._styleInfoes[style] = value;
                    }
                }
            };
            /**
             * @private
             *
             */
            HTML5StageText.prototype.$removeFromStage = function () {
                if (this.inputElement) {
                    this.htmlInput.disconnectStageText(this);
                }
            };
            /**
             * 修改位置
             * @private
             */
            HTML5StageText.prototype.$resetStageText = function () {
                if (this.inputElement) {
                    var textfield = this.$textfield;
                    this.setElementStyle("fontFamily", textfield.fontFamily);
                    this.setElementStyle("fontStyle", textfield.italic ? "italic" : "normal");
                    this.setElementStyle("fontWeight", textfield.bold ? "bold" : "normal");
                    this.setElementStyle("textAlign", textfield.textAlign);
                    this.setElementStyle("fontSize", textfield.size * this._gscaleY + "px");
                    this.setElementStyle("color", egret.toColorString(textfield.textColor));
                    var tw = void 0;
                    if (textfield.stage) {
                        tw = textfield.localToGlobal(0, 0).x;
                        tw = Math.min(textfield.width, textfield.stage.stageWidth - tw);
                    }
                    else {
                        tw = textfield.width;
                    }
                    var inputWidth = tw * this._gscaleX;
                    var scale = (textfield.scaleX * egret.sys.DisplayList.$canvasScaleX) / (textfield.scaleY * egret.sys.DisplayList.$canvasScaleY);
                    this.setElementStyle("width", inputWidth / scale + "px");
                    this.setElementStyle("transform", "scale(" + scale + ",  1)");
                    this.setElementStyle("left", (scale - 1) * inputWidth / scale / 2 + "px");
                    this.setElementStyle("verticalAlign", textfield.verticalAlign);
                    if (textfield.multiline) {
                        this.setAreaHeight();
                    }
                    else {
                        this.setElementStyle("lineHeight", (textfield.size) * this._gscaleY + "px");
                        if (textfield.height < textfield.size) {
                            this.setElementStyle("height", (textfield.size) * this._gscaleY + "px");
                            var bottom = (textfield.size / 2) * this._gscaleY;
                            this.setElementStyle("padding", "0px 0px " + bottom + "px 0px");
                        }
                        else {
                            this.setElementStyle("height", (textfield.size) * this._gscaleY + "px");
                            var rap = (textfield.height - textfield.size) * this._gscaleY;
                            var valign = egret.TextFieldUtils.$getValign(textfield);
                            var top_2 = rap * valign;
                            var bottom = rap - top_2;
                            if (bottom < textfield.size / 2 * this._gscaleY) {
                                bottom = textfield.size / 2 * this._gscaleY;
                            }
                            this.setElementStyle("padding", top_2 + "px 0px " + bottom + "px 0px");
                        }
                    }
                    this.inputDiv.style.clip = "rect(0px " + (textfield.width * this._gscaleX) + "px " + (textfield.height * this._gscaleY) + "px 0px)";
                    this.inputDiv.style.height = textfield.height * this._gscaleY + "px";
                    this.inputDiv.style.width = tw * this._gscaleX + "px";
                }
            };
            return HTML5StageText;
        }(egret.EventDispatcher));
        web.HTML5StageText = HTML5StageText;
        __reflect(HTML5StageText.prototype, "egret.web.HTML5StageText", ["egret.StageText"]);
        egret.StageText = HTML5StageText;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var HTMLInput = /** @class */ (function () {
            function HTMLInput() {
                var _this = this;
                /**
                 * @private
                 */
                this._needShow = false;
                /**
                 * @private
                 */
                this.$scaleX = 1;
                /**
                 * @private
                 */
                this.$scaleY = 1;
                this.stageTextClickHandler = function (e) {
                    if (_this._needShow) {
                        _this._needShow = false;
                        _this._stageText._onClickHandler(e);
                        _this.show();
                    }
                    else {
                        _this.blurInputElement();
                        _this.disposeInputElement();
                    }
                };
            }
            /**
             * @private
             *
             * @returns
             */
            HTMLInput.prototype.isInputOn = function () {
                return this._stageText != null;
            };
            /**
             * @private
             *
             * @param stageText
             * @returns
             */
            HTMLInput.prototype.isCurrentStageText = function (stageText) {
                return this._stageText == stageText;
            };
            /**
             * @private
             *
             * @param dom
             */
            HTMLInput.prototype.initValue = function (dom) {
                dom.style.position = "absolute";
                dom.style.left = "0px";
                dom.style.top = "0px";
                dom.style.border = "none";
                dom.style.padding = "0";
                dom.ontouchmove = function (e) {
                    e.preventDefault();
                };
            };
            /**
             * @private
             *
             */
            HTMLInput.prototype.$updateSize = function () {
                if (!this.canvas) {
                    return;
                }
                this.$scaleX = egret.sys.DisplayList.$canvasScaleX;
                this.$scaleY = egret.sys.DisplayList.$canvasScaleY;
                this.StageDelegateDiv.style.left = this.canvas.style.left;
                this.StageDelegateDiv.style.top = this.canvas.style.top;
                var transformKey = egret.web.getPrefixStyleName("transform");
                this.StageDelegateDiv.style[transformKey] = this.canvas.style[transformKey];
                this.StageDelegateDiv.style[egret.web.getPrefixStyleName("transformOrigin")] = "0% 0% 0px";
            };
            /**
             * @private
             *
             * @param container
             * @param canvas
             * @returns
             */
            HTMLInput.prototype._initStageDelegateDiv = function (container, canvas) {
                this.canvas = canvas;
                var self = this;
                var stageDelegateDiv;
                if (!stageDelegateDiv) {
                    stageDelegateDiv = document.createElement("div");
                    this.StageDelegateDiv = stageDelegateDiv;
                    stageDelegateDiv.id = "StageDelegateDiv";
                    container.appendChild(stageDelegateDiv);
                    self.initValue(stageDelegateDiv);
                    self._inputDIV = document.createElement("div");
                    self.initValue(self._inputDIV);
                    self._inputDIV.style.width = "0px";
                    self._inputDIV.style.height = "0px";
                    self._inputDIV.style.left = 0 + "px";
                    self._inputDIV.style.top = "-100px";
                    self._inputDIV.style[egret.web.getPrefixStyleName("transformOrigin")] = "0% 0% 0px";
                    stageDelegateDiv.appendChild(self._inputDIV);
                    // if (egret.Capabilities.isMobile) {
                    //     let downTime = 0;
                    //     let screenX: number, screenY: number;
                    //     this.canvas.addEventListener("touchstart", (e) => {
                    //         downTime = egret.getTimer();
                    //         for (let touch of e.touches) {
                    //             screenX = touch.screenX;
                    //             screenY = touch.screenY;
                    //         }
                    //     });
                    //     this.canvas.addEventListener("touchend", (e) => {
                    //         const upTime = egret.getTimer();
                    //         const timeDelay = upTime - downTime;
                    //         for (let touch of e.changedTouches) {
                    //             const offset = Math.sqrt(Math.pow(touch.screenX - screenX, 2) + Math.pow(touch.screenY - screenY, 2))
                    //             if (timeDelay < 300 && offset < 3) {
                    //                 this.stageTextClickHandler(e);
                    //             }
                    //         }
                    //         downTime = 0;
                    //         screenX = screenY = 0;
                    //     });
                    // } else {
                    this.canvas.addEventListener("click", this.stageTextClickHandler);
                    // }
                    self.initInputElement(true);
                    self.initInputElement(false);
                }
            };
            //初始化输入框
            HTMLInput.prototype.initInputElement = function (multiline) {
                var self = this;
                //增加1个空的textarea
                var inputElement;
                if (multiline) {
                    inputElement = document.getElementById("egretTextarea");
                    if (inputElement && inputElement.parentNode) {
                        inputElement.parentNode.removeChild(inputElement);
                    }
                    inputElement = document.createElement("textarea");
                    inputElement.style["resize"] = "none";
                    self._multiElement = inputElement;
                    inputElement.id = "egretTextarea";
                }
                else {
                    inputElement = document.getElementById("egretInput");
                    if (inputElement && inputElement.parentNode) {
                        inputElement.parentNode.removeChild(inputElement);
                    }
                    inputElement = document.createElement("input");
                    self._simpleElement = inputElement;
                    inputElement.id = "egretInput";
                }
                inputElement.type = "text";
                self._inputDIV.appendChild(inputElement);
                inputElement.setAttribute("tabindex", "-1");
                inputElement.style.width = "1px";
                inputElement.style.height = "12px";
                self.initValue(inputElement);
                inputElement.style.outline = "thin";
                inputElement.style.background = "none";
                inputElement.style.overflow = "hidden";
                inputElement.style.wordBreak = "break-all";
                //隐藏输入框
                inputElement.style.opacity = "0";
                var inputLock = false;
                inputElement.oninput = function () {
                    if (self._stageText && !inputLock) {
                        self._stageText._onInput();
                    }
                };
                // 防止win10自带输入法多次触发oninput方法
                inputElement.addEventListener('compositionstart', function () {
                    inputLock = true;
                });
                inputElement.addEventListener('compositionend', function () {
                    inputLock = false;
                    if (self._stageText && !inputLock) {
                        self._stageText._onInput();
                    }
                });
            };
            /**
             * @private
             *
             */
            HTMLInput.prototype.show = function () {
                var self = this;
                var inputElement = self._inputElement;
                //隐藏输入框
                egret.$callAsync(function () {
                    inputElement.style.opacity = "1";
                }, self);
            };
            /**
             * @private
             *
             * @param stageText
             */
            HTMLInput.prototype.disconnectStageText = function (stageText) {
                if (this._stageText == null || this._stageText == stageText) {
                    if (this._inputElement) {
                        this._inputElement.blur();
                    }
                    this.clearInputElement();
                    if (this._inputElement && this._inputDIV.contains(this._inputElement)) {
                        this._inputDIV.removeChild(this._inputElement);
                    }
                    this._needShow = false;
                }
            };
            /**
             * @private
             *
             */
            HTMLInput.prototype.clearInputElement = function () {
                var self = this;
                if (self._inputElement) {
                    self._inputElement.value = "";
                    self._inputElement.onblur = null;
                    self._inputElement.onfocus = null;
                    self._inputElement.style.width = "1px";
                    self._inputElement.style.height = "12px";
                    self._inputElement.style.left = "0px";
                    self._inputElement.style.top = "0px";
                    self._inputElement.style.opacity = "0";
                    var otherElement = void 0;
                    if (self._simpleElement == self._inputElement) {
                        otherElement = self._multiElement;
                    }
                    else {
                        otherElement = self._simpleElement;
                    }
                    otherElement.style.display = "block";
                    self._inputDIV.style.left = 0 + "px";
                    self._inputDIV.style.top = "-100px";
                    self._inputDIV.style.height = 0 + "px";
                    self._inputDIV.style.width = 0 + "px";
                    self._inputElement.blur();
                }
                if (self._stageText) {
                    self._stageText._onDisconnect();
                    self._stageText = null;
                    this.canvas['userTyping'] = false;
                    if (this.finishUserTyping) {
                        this.finishUserTyping();
                    }
                }
            };
            /**
             * @private
             *
             * @param stageText
             * @returns
             */
            HTMLInput.prototype.getInputElement = function (stageText) {
                var self = this;
                self.clearInputElement();
                self._stageText = stageText;
                this.canvas['userTyping'] = true;
                if (self._stageText.$textfield.multiline) {
                    self._inputElement = self._multiElement;
                }
                else {
                    self._inputElement = self._simpleElement;
                }
                var otherElement;
                if (self._simpleElement == self._inputElement) {
                    otherElement = self._multiElement;
                }
                else {
                    otherElement = self._simpleElement;
                }
                otherElement.style.display = "none";
                if (this._inputElement && !this._inputDIV.contains(this._inputElement)) {
                    this._inputDIV.appendChild(this._inputElement);
                }
                return self._inputElement;
            };
            /**
             * @private
             */
            HTMLInput.prototype.blurInputElement = function () {
                if (this._inputElement) {
                    this.clearInputElement();
                    this._inputElement.blur();
                }
            };
            /**
             * @private
             */
            HTMLInput.prototype.disposeInputElement = function () {
                this._inputElement = null;
            };
            return HTMLInput;
        }());
        web.HTMLInput = HTMLInput;
        __reflect(HTMLInput.prototype, "egret.web.HTMLInput");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
(function (egret) {
    var web;
    (function (web) {
        var stageToTextLayerMap = {};
        var stageToCanvasMap = {};
        var stageToContainerMap = {};
        /**
         * @private
         * 获取
         */
        function $getTextAdapter(textfield) {
            var stageHash = textfield.stage ? textfield.stage.$hashCode : 0;
            var adapter = stageToTextLayerMap[stageHash];
            var canvas = stageToCanvasMap[stageHash];
            var container = stageToContainerMap[stageHash];
            if (canvas && container) {
                //adapter._initStageDelegateDiv(container, canvas);
                //adapter.$updateSize();
                delete stageToCanvasMap[stageHash];
                delete stageToContainerMap[stageHash];
            }
            return adapter;
        }
        web.$getTextAdapter = $getTextAdapter;
        /**
         * @private
         */
        function $cacheTextAdapter(adapter, stage, container, canvas) {
            adapter._initStageDelegateDiv(container, canvas);
            stageToTextLayerMap[stage.$hashCode] = adapter;
            stageToCanvasMap[stage.$hashCode] = canvas;
            stageToContainerMap[stage.$hashCode] = container;
        }
        web.$cacheTextAdapter = $cacheTextAdapter;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var context = null;
        /**
         * @private
         */
        var fontCache = {};
        /**
         * 测量文本在指定样式下的宽度。
         * @param text 要测量的文本内容。
         * @param fontFamily 字体名称
         * @param fontSize 字体大小
         * @param bold 是否粗体
         * @param italic 是否斜体
         */
        function measureText(text, fontFamily, fontSize, bold, italic) {
            if (!context) {
                createContext();
            }
            var font = "";
            if (italic)
                font += "italic ";
            if (bold)
                font += "bold ";
            font += ((typeof fontSize == "number" && fontSize >= 0) ? fontSize : 12) + "px ";
            font += ((typeof fontFamily == "string" && fontFamily != "") ? fontFamily : "Arial");
            context.font = font;
            return egret.sys.measureTextWith(context, text);
        }
        /**
         * @private
         */
        function createContext() {
            context = egret.sys.canvasHitTestBuffer.context;
            context.textAlign = "left";
            context.textBaseline = "middle";
        }
        egret.sys.measureText = measureText;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * 创建一个canvas。
         */
        function __createCanvas__(width, height) {
            var canvas = egret.sys.createCanvas(width, height);
            var context = canvas.getContext("2d");
            if (context["imageSmoothingEnabled"] === undefined) {
                var keys = ["webkitImageSmoothingEnabled", "mozImageSmoothingEnabled", "msImageSmoothingEnabled"];
                var key_1;
                for (var i = keys.length - 1; i >= 0; i--) {
                    key_1 = keys[i];
                    if (context[key_1] !== void 0) {
                        break;
                    }
                }
                try {
                    Object.defineProperty(context, "imageSmoothingEnabled", {
                        get: function () {
                            return this[key_1];
                        },
                        set: function (value) {
                            this[key_1] = value;
                        }
                    });
                }
                catch (e) {
                    context["imageSmoothingEnabled"] = context[key_1];
                }
            }
            return canvas;
        }
        var sharedCanvas;
        /**
         * @private
         * Canvas2D渲染缓冲
         */
        var CanvasRenderBuffer = /** @class */ (function () {
            function CanvasRenderBuffer(width, height, root) {
                this.surface = egret.sys.createCanvasRenderBufferSurface(__createCanvas__, width, height, root);
                this.context = this.surface.getContext("2d");
                if (this.context) {
                    this.context.$offsetX = 0;
                    this.context.$offsetY = 0;
                }
                this.resize(width, height);
            }
            Object.defineProperty(CanvasRenderBuffer.prototype, "width", {
                /**
                 * 渲染缓冲的宽度，以像素为单位。
                 * @readOnly
                 */
                get: function () {
                    return this.surface.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CanvasRenderBuffer.prototype, "height", {
                /**
                 * 渲染缓冲的高度，以像素为单位。
                 * @readOnly
                 */
                get: function () {
                    return this.surface.height;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 改变渲染缓冲的大小并清空缓冲区
             * @param width 改变后的宽
             * @param height 改变后的高
             * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
             */
            CanvasRenderBuffer.prototype.resize = function (width, height, useMaxSize) {
                egret.sys.resizeCanvasRenderBuffer(this, width, height, useMaxSize);
            };
            /**
             * 获取指定区域的像素
             */
            CanvasRenderBuffer.prototype.getPixels = function (x, y, width, height) {
                if (width === void 0) { width = 1; }
                if (height === void 0) { height = 1; }
                return this.context.getImageData(x, y, width, height).data;
            };
            /**
             * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
             * @param type 转换的类型，如: "image/png","image/jpeg"
             */
            CanvasRenderBuffer.prototype.toDataURL = function (type, encoderOptions) {
                return this.surface.toDataURL(type, encoderOptions);
            };
            /**
             * 清空缓冲区数据
             */
            CanvasRenderBuffer.prototype.clear = function () {
                this.context.setTransform(1, 0, 0, 1, 0, 0);
                this.context.clearRect(0, 0, this.surface.width, this.surface.height);
            };
            /**
             * 销毁绘制对象
             */
            CanvasRenderBuffer.prototype.destroy = function () {
                this.surface.width = this.surface.height = 0;
            };
            return CanvasRenderBuffer;
        }());
        web.CanvasRenderBuffer = CanvasRenderBuffer;
        __reflect(CanvasRenderBuffer.prototype, "egret.web.CanvasRenderBuffer", ["egret.sys.RenderBuffer"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided this the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WebTouchHandler = /** @class */ (function (_super) {
            __extends(WebTouchHandler, _super);
            /**
             * @private
             */
            function WebTouchHandler(stage, canvas) {
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.onTouchBegin = function (event) {
                    var location = _this.getLocation(event);
                    _this.touch.onTouchBegin(location.x, location.y, event.identifier);
                };
                _this.onMouseMove = function (event) {
                    if (event.buttons == 0) { //在外面松开按键
                        _this.onTouchEnd(event);
                    }
                    else {
                        _this.onTouchMove(event);
                    }
                };
                /**
                 * @private
                 */
                _this.onTouchMove = function (event) {
                    var location = _this.getLocation(event);
                    _this.touch.onTouchMove(location.x, location.y, event.identifier);
                };
                /**
                 * @private
                 */
                _this.onTouchEnd = function (event) {
                    var location = _this.getLocation(event);
                    _this.touch.onTouchEnd(location.x, location.y, event.identifier);
                };
                /**
                 * @private
                 */
                _this.scaleX = 1;
                /**
                 * @private
                 */
                _this.scaleY = 1;
                /**
                 * @private
                 */
                _this.rotation = 0;
                _this.canvas = canvas;
                _this.touch = new egret.sys.TouchHandler(stage);
                _this.addListeners();
                return _this;
            }
            /**
             * @private
             * 添加事件监听
             */
            WebTouchHandler.prototype.addListeners = function () {
                var _this = this;
                if (window.navigator.msPointerEnabled) {
                    this.canvas.addEventListener("MSPointerDown", function (event) {
                        event.identifier = event.pointerId;
                        _this.onTouchBegin(event);
                        _this.prevent(event);
                    }, false);
                    this.canvas.addEventListener("MSPointerMove", function (event) {
                        event.identifier = event.pointerId;
                        _this.onTouchMove(event);
                        _this.prevent(event);
                    }, false);
                    this.canvas.addEventListener("MSPointerUp", function (event) {
                        event.identifier = event.pointerId;
                        _this.onTouchEnd(event);
                        _this.prevent(event);
                    }, false);
                }
                else {
                    if (!egret.Capabilities.isMobile) {
                        this.addMouseListener();
                    }
                    this.addTouchListener();
                }
            };
            /**
             * @private
             *
             */
            WebTouchHandler.prototype.addMouseListener = function () {
                this.canvas.addEventListener("mousedown", this.onTouchBegin);
                this.canvas.addEventListener("mousemove", this.onMouseMove);
                this.canvas.addEventListener("mouseup", this.onTouchEnd);
            };
            /**
             * @private
             *
             */
            WebTouchHandler.prototype.addTouchListener = function () {
                var _this = this;
                this.canvas.addEventListener("touchstart", function (event) {
                    var l = event.changedTouches.length;
                    for (var i = 0; i < l; i++) {
                        _this.onTouchBegin(event.changedTouches[i]);
                    }
                    _this.prevent(event);
                }, false);
                this.canvas.addEventListener("touchmove", function (event) {
                    var l = event.changedTouches.length;
                    for (var i = 0; i < l; i++) {
                        _this.onTouchMove(event.changedTouches[i]);
                    }
                    _this.prevent(event);
                }, false);
                this.canvas.addEventListener("touchend", function (event) {
                    var l = event.changedTouches.length;
                    for (var i = 0; i < l; i++) {
                        _this.onTouchEnd(event.changedTouches[i]);
                    }
                    _this.prevent(event);
                }, false);
                this.canvas.addEventListener("touchcancel", function (event) {
                    var l = event.changedTouches.length;
                    for (var i = 0; i < l; i++) {
                        _this.onTouchEnd(event.changedTouches[i]);
                    }
                    _this.prevent(event);
                }, false);
            };
            /**
             * @private
             */
            WebTouchHandler.prototype.prevent = function (event) {
                event.stopPropagation();
                if (event["isScroll"] != true && !this.canvas['userTyping']) {
                    event.preventDefault();
                }
            };
            /**
             * @private
             */
            WebTouchHandler.prototype.getLocation = function (event) {
                event.identifier = +event.identifier || 0;
                var doc = document.documentElement;
                var box = this.canvas.getBoundingClientRect();
                var left = box.left + window.pageXOffset - doc.clientLeft;
                var top = box.top + window.pageYOffset - doc.clientTop;
                var x = event.pageX - left, newx = x;
                var y = event.pageY - top, newy = y;
                if (this.rotation == 90) {
                    newx = y;
                    newy = box.width - x;
                }
                else if (this.rotation == -90) {
                    newx = box.height - y;
                    newy = x;
                }
                newx = newx / this.scaleX;
                newy = newy / this.scaleY;
                return egret.$TempPoint.setTo(Math.round(newx), Math.round(newy));
            };
            /**
             * @private
             * 更新屏幕当前的缩放比例，用于计算准确的点击位置。
             * @param scaleX 水平方向的缩放比例。
             * @param scaleY 垂直方向的缩放比例。
             */
            WebTouchHandler.prototype.updateScaleMode = function (scaleX, scaleY, rotation) {
                this.scaleX = scaleX;
                this.scaleY = scaleY;
                this.rotation = rotation;
            };
            /**
             * @private
             * 更新同时触摸点的数量
             */
            WebTouchHandler.prototype.$updateMaxTouches = function () {
                this.touch.$initMaxTouches();
            };
            return WebTouchHandler;
        }(egret.HashObject));
        web.WebTouchHandler = WebTouchHandler;
        __reflect(WebTouchHandler.prototype, "egret.web.WebTouchHandler");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        web.WebLifeCycleHandler = function (context) {
            var resume = function () {
                context.resume();
                /** 解决 ios13 页面切到后台再拉起，声音无法播放 */
                if (web.Html5Capatibility._audioType == web.AudioType.WEB_AUDIO && web.WebAudioDecode.initAudioContext) {
                    web.WebAudioDecode.initAudioContext();
                }
            };
            var pause = function () {
                context.pause();
            };
            var handleVisibilityChange = function () {
                if (!document[hidden]) {
                    resume();
                }
                else {
                    pause();
                }
            };
            window.addEventListener("focus", resume, false);
            window.addEventListener("blur", pause, false);
            var hidden, visibilityChange;
            if (typeof document.hidden !== "undefined") {
                hidden = "hidden";
                visibilityChange = "visibilitychange";
            }
            else if (typeof document["mozHidden"] !== "undefined") {
                hidden = "mozHidden";
                visibilityChange = "mozvisibilitychange";
            }
            else if (typeof document["msHidden"] !== "undefined") {
                hidden = "msHidden";
                visibilityChange = "msvisibilitychange";
            }
            else if (typeof document["webkitHidden"] !== "undefined") {
                hidden = "webkitHidden";
                visibilityChange = "webkitvisibilitychange";
            }
            else if (typeof document["oHidden"] !== "undefined") {
                hidden = "oHidden";
                visibilityChange = "ovisibilitychange";
            }
            if ("onpageshow" in window && "onpagehide" in window) {
                window.addEventListener("pageshow", resume, false);
                window.addEventListener("pagehide", pause, false);
            }
            if (hidden && visibilityChange) {
                document.addEventListener(visibilityChange, handleVisibilityChange, false);
            }
            var ua = navigator.userAgent;
            var isWX = /micromessenger/gi.test(ua);
            var isQQBrowser = /mqq/ig.test(ua);
            var isQQ = /mobile.*qq/gi.test(ua);
            if (isQQ || isWX) {
                isQQBrowser = false;
            }
            if (isQQBrowser) {
                var browser = window["browser"] || {};
                browser.execWebFn = browser.execWebFn || {};
                browser.execWebFn.postX5GamePlayerMessage = function (event) {
                    var eventType = event.type;
                    if (eventType == "app_enter_background") {
                        pause();
                    }
                    else if (eventType == "app_enter_foreground") {
                        resume();
                    }
                };
                window["browser"] = browser;
            }
        };
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var AudioType = /** @class */ (function () {
            function AudioType() {
            }
            /**
             * @private
             */
            AudioType.WEB_AUDIO = 2;
            /**
             * @private
             */
            AudioType.HTML5_AUDIO = 3;
            return AudioType;
        }());
        web.AudioType = AudioType;
        __reflect(AudioType.prototype, "egret.web.AudioType");
        /**
         * html5兼容性配置
         * @private
         */
        var Html5Capatibility = /** @class */ (function (_super) {
            __extends(Html5Capatibility, _super);
            /**
             * @private
             */
            function Html5Capatibility() {
                return _super.call(this) || this;
            }
            /**
             * @private
             *
             */
            Html5Capatibility.$init = function () {
                var ua = navigator.userAgent.toLowerCase();
                Html5Capatibility.ua = ua;
                Html5Capatibility._canUseBlob = false;
                var canUseWebAudio = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"];
                var isIos = ua.indexOf("iphone") >= 0 || ua.indexOf("ipad") >= 0 || ua.indexOf("ipod") >= 0;
                if (canUseWebAudio) {
                    try {
                        //防止某些chrome版本创建异常问题
                        web.WebAudioDecode.initAudioContext = function () {
                            if (web.WebAudioDecode.ctx) {
                                try {
                                    web.WebAudioDecode.ctx.close();
                                }
                                catch (e) {
                                }
                            }
                            web.WebAudioDecode.ctx = new (window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"])();
                            var useingChannel = egret.sys.usingChannel;
                            for (var _i = 0, useingChannel_1 = useingChannel; _i < useingChannel_1.length; _i++) {
                                var channel = useingChannel_1[_i];
                                var webSoundChannel = channel;
                                webSoundChannel.context = web.WebAudioDecode.ctx;
                                webSoundChannel.initGain();
                                webSoundChannel.$startTime = webSoundChannel.position;
                                webSoundChannel.$play();
                            }
                        };
                        web.WebAudioDecode.initAudioContext();
                    }
                    catch (e) {
                        canUseWebAudio = false;
                    }
                }
                var audioType = Html5Capatibility._audioType;
                var checkAudioType;
                if ((audioType == AudioType.WEB_AUDIO && canUseWebAudio) || audioType == AudioType.HTML5_AUDIO) {
                    checkAudioType = false;
                    Html5Capatibility.setAudioType(audioType);
                }
                else if (!isIos && ua.indexOf("safari") >= 0 && ua.indexOf("chrome") === -1) {
                    // In Safari browser on Mac,use web audio
                    checkAudioType = false;
                    Html5Capatibility.setAudioType(AudioType.WEB_AUDIO);
                }
                else {
                    checkAudioType = true;
                    Html5Capatibility.setAudioType(AudioType.HTML5_AUDIO);
                }
                if (ua.indexOf("android") >= 0) { //android
                    if (checkAudioType && canUseWebAudio) {
                        Html5Capatibility.setAudioType(AudioType.WEB_AUDIO);
                    }
                }
                else if (isIos) { //ios
                    if (Html5Capatibility.getIOSVersion() >= 7) {
                        Html5Capatibility._canUseBlob = true;
                        if (checkAudioType && canUseWebAudio) {
                            Html5Capatibility.setAudioType(AudioType.WEB_AUDIO);
                        }
                    }
                }
                var winURL = window["URL"] || window["webkitURL"];
                if (!winURL) {
                    Html5Capatibility._canUseBlob = false;
                }
                if (ua.indexOf("egretnative") >= 0) { // Egret Native
                    Html5Capatibility.setAudioType(AudioType.HTML5_AUDIO);
                    Html5Capatibility._canUseBlob = true;
                }
                egret.Sound = Html5Capatibility._AudioClass;
            };
            Html5Capatibility.setAudioType = function (type) {
                Html5Capatibility._audioType = type;
                switch (type) {
                    case AudioType.WEB_AUDIO:
                        Html5Capatibility._AudioClass = egret.web.WebAudioSound;
                        break;
                    case AudioType.HTML5_AUDIO:
                        Html5Capatibility._AudioClass = egret.web.HtmlSound;
                        break;
                }
            };
            /**
             * @private
             * 获取ios版本
             * @returns {string}
             */
            Html5Capatibility.getIOSVersion = function () {
                var matches = Html5Capatibility.ua.toLowerCase().match(/cpu [^\d]*\d.*like mac os x/);
                if (!matches || matches.length == 0) {
                    return 0;
                }
                var value = matches[0];
                return parseInt(value.match(/\d+(_\d)*/)[0]) || 0;
            };
            //当前浏览器版本是否支持blob
            Html5Capatibility._canUseBlob = false;
            //当前浏览器版本是否支持webaudio
            Html5Capatibility._audioType = 0;
            /**
             * @private
             */
            Html5Capatibility.ua = "";
            return Html5Capatibility;
        }(egret.HashObject));
        web.Html5Capatibility = Html5Capatibility;
        __reflect(Html5Capatibility.prototype, "egret.web.Html5Capatibility");
        /**
         * @private
         */
        var currentPrefix = null;
        /**
         * @private
         */
        function getPrefixStyleName(name, element) {
            var header = "";
            if (element != null) {
                header = getPrefix(name, element);
            }
            else {
                if (currentPrefix == null) {
                    var tempStyle = document.createElement('div').style;
                    currentPrefix = getPrefix("transform", tempStyle);
                }
                header = currentPrefix;
            }
            if (header == "") {
                return name;
            }
            return header + name.charAt(0).toUpperCase() + name.substring(1, name.length);
        }
        web.getPrefixStyleName = getPrefixStyleName;
        /**
         * @private
         */
        function getPrefix(name, element) {
            if (name in element) {
                return "";
            }
            name = name.charAt(0).toUpperCase() + name.substring(1, name.length);
            var transArr = ["webkit", "ms", "Moz", "O"];
            for (var i = 0; i < transArr.length; i++) {
                var tempStyle = transArr[i] + name;
                if (tempStyle in element) {
                    return transArr[i];
                }
            }
            return "";
        }
        web.getPrefix = getPrefix;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * 创建一个canvas。
         */
        function mainCanvas(width, height) {
            var canvas = createCanvas(width, height);
            if (egret.pro.egret2dDriveMode) {
                egret.pro.mainCanvas = canvas;
            }
            return canvas;
        }
        egret.sys.mainCanvas = mainCanvas;
        function createCanvas(width, height) {
            var canvas = document.createElement("canvas");
            if (!isNaN(width) && !isNaN(height)) {
                canvas.width = width;
                canvas.height = height;
            }
            return canvas;
        }
        egret.sys.createCanvas = createCanvas;
        /**
         * sys.resizeContext。
         */
        function resizeContext(renderContext, width, height, useMaxSize) {
            if (!renderContext) {
                return;
            }
            var surface = renderContext.surface;
            if (!surface) {
                return;
            }
            if (useMaxSize) {
                if (surface.width < width) {
                    surface.width = width;
                }
                if (surface.height < height) {
                    surface.height = height;
                }
            }
            else {
                if (surface.width !== width) {
                    surface.width = width;
                }
                if (surface.height !== height) {
                    surface.height = height;
                }
            }
            var onResize = renderContext.onResize;
            if (onResize) {
                onResize.call(renderContext);
            }
        }
        web.resizeContext = resizeContext;
        egret.sys.resizeContext = resizeContext;
        /**
         * sys.getContextWebGL
         */
        function getContextWebGL(surface) {
            var options = {
                antialias: web.WebGLRenderContext.antialias,
                stencil: true //设置可以使用模板（用于不规则遮罩）
            };
            var gl = null;
            //todo 是否使用chrome源码names
            //let contextNames = ["moz-webgl", "webkit-3d", "experimental-webgl", "webgl", "3d"];
            var names = ["webgl", "experimental-webgl"];
            for (var i = 0; i < names.length; ++i) {
                try {
                    gl = surface.getContext(names[i], options);
                }
                catch (e) {
                }
                if (gl) {
                    break;
                }
            }
            if (!gl) {
                egret.$error(1021);
            }
            return gl;
        }
        egret.sys.getContextWebGL = getContextWebGL;
        /**
         * sys.getContext2d
         */
        function getContext2d(surface) {
            return surface ? surface.getContext('2d') : null;
        }
        web.getContext2d = getContext2d;
        egret.sys.getContext2d = getContext2d;
        /**
         * 创建一个WebGLTexture
         */
        function createTexture(renderContext, bitmapData) {
            var webglrendercontext = renderContext;
            var gl = webglrendercontext.context;
            var texture = gl.createTexture();
            if (!texture) {
                //先创建texture失败,然后lost事件才发出来..
                webglrendercontext.contextLost = true;
                return;
            }
            texture[egret.glContext] = gl;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            texture[egret.UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            return texture;
        }
        egret.sys.createTexture = createTexture;
        /**
         * 创建一个WebGLTexture
         */
        function _createTexture(renderContext, width, height, data) {
            var webglrendercontext = renderContext;
            var gl = webglrendercontext.context;
            var texture = gl.createTexture();
            if (!texture) {
                //先创建texture失败,然后lost事件才发出来..
                webglrendercontext.contextLost = true;
                return null;
            }
            //
            texture[egret.glContext] = gl;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            texture[egret.UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            return texture;
        }
        egret.sys._createTexture = _createTexture;
        /**
         * 画texture
         **/
        function drawTextureElements(renderContext, data, offset) {
            var webglrendercontext = renderContext;
            var gl = webglrendercontext.context;
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, data.texture);
            var size = data.count * 3;
            gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
            return size;
        }
        egret.sys.drawTextureElements = drawTextureElements;
        /**
         * 测量文本的宽度
         * @param context
         * @param text
         */
        function measureTextWith(context, text) {
            return context.measureText(text).width;
        }
        egret.sys.measureTextWith = measureTextWith;
        /**
         * 为CanvasRenderBuffer创建一个HTMLCanvasElement
         * @param defaultFunc
         * @param width
         * @param height
         * @param root
         */
        function createCanvasRenderBufferSurface(defaultFunc, width, height, root) {
            return defaultFunc(width, height);
        }
        egret.sys.createCanvasRenderBufferSurface = createCanvasRenderBufferSurface;
        /**
         * 改变渲染缓冲的大小并清空缓冲区
         * @param renderContext
         * @param width
         * @param height
         * @param useMaxSize
         */
        function resizeCanvasRenderBuffer(renderContext, width, height, useMaxSize) {
            var canvasRenderBuffer = renderContext;
            var surface = canvasRenderBuffer.surface;
            if (useMaxSize) {
                var change = false;
                if (surface.width < width) {
                    surface.width = width;
                    change = true;
                }
                if (surface.height < height) {
                    surface.height = height;
                    change = true;
                }
                //尺寸没有变化时,将绘制属性重置
                if (!change) {
                    canvasRenderBuffer.context.globalCompositeOperation = "source-over";
                    canvasRenderBuffer.context.setTransform(1, 0, 0, 1, 0, 0);
                    canvasRenderBuffer.context.globalAlpha = 1;
                }
            }
            else {
                if (surface.width != width) {
                    surface.width = width;
                }
                if (surface.height != height) {
                    surface.height = height;
                }
            }
            canvasRenderBuffer.clear();
        }
        egret.sys.resizeCanvasRenderBuffer = resizeCanvasRenderBuffer;
        egret.Geolocation = egret.web.WebGeolocation;
        egret.Motion = egret.web.WebMotion;
        /**
         *
         * @param name
         * @param path
         */
        function registerFontMapping(name, path) {
            if (window.FontFace) {
                return loadFontByFontFace(name, path);
            }
            else {
                return loadFontByWebStyle(name, path);
            }
        }
        egret.sys.registerFontMapping = registerFontMapping;
        function loadFontByFontFace(name, path) {
            var fontResCache = egret.sys.fontResourceCache;
            if (!fontResCache || !fontResCache[path]) {
                console.warn("registerFontMapping_WARN: Can not find TTF file:" + path + ", please load file first.");
                return;
            }
            var resCache = fontResCache[path];
            var fontFace = new window.FontFace(name, resCache);
            document.fonts.add(fontFace);
            fontFace.load().catch(function (err) {
                console.error("loadFontError:", err);
            });
        }
        ;
        function loadFontByWebStyle(name, path) {
            var styleElement = document.createElement("style");
            styleElement.type = "text/css";
            styleElement.textContent = "\n            @font-face\n            {\n                font-family:\"" + name + "\";\n                src:url(\"" + path + "\");\n            }";
            styleElement.onerror = function (err) {
                console.error("loadFontError:", err);
            };
            document.body.appendChild(styleElement);
        }
        web.isIOS14Device = function () {
            return egret.Capabilities.runtimeType == egret.RuntimeType.WEB
                && egret.Capabilities.os == "iOS"
                && egret.Capabilities.isMobile
                && /iPhone OS 14/.test(window.navigator.userAgent);
        };
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * 刷新所有Egret播放器的显示区域尺寸。仅当使用外部JavaScript代码动态修改了Egret容器大小时，需要手动调用此方法刷新显示区域。
         * 当网页尺寸发生改变时此方法会自动被调用。
         */
        function updateAllScreens() {
            if (!isRunning) {
                return;
            }
            var containerList = document.querySelectorAll(".egret-player");
            var length = containerList.length;
            for (var i = 0; i < length; i++) {
                var container = containerList[i];
                var player = container["egret-player"];
                player.updateScreenSize();
            }
        }
        var isRunning = false;
        /**
         * @private
         * 网页加载完成，实例化页面中定义的Egret标签
         */
        function runEgret(options) {
            if (isRunning) {
                return;
            }
            isRunning = true;
            if (!options) {
                options = {};
            }
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("egretnative") >= 0 && ua.indexOf("egretwebview") == -1) {
                egret.Capabilities["runtimeType" + ""] = egret.RuntimeType.RUNTIME2;
            }
            // 是否启动3d环境
            if (options.pro) {
                egret.pro.egret2dDriveMode = true;
                try {
                    if (window['startup']) {
                        window['startup']();
                    }
                    else {
                        console.error("EgretPro.js don't has function:window.startup");
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }
            if (ua.indexOf("egretnative") >= 0 && egret.nativeRender) { // Egret Native
                egret_native.addModuleCallback(function () {
                    web.Html5Capatibility.$init();
                    // WebGL上下文参数自定义
                    if (options.renderMode == "webgl") {
                        // WebGL抗锯齿默认关闭，提升PC及某些平台性能
                        var antialias = options.antialias;
                        web.WebGLRenderContext.antialias = !!antialias;
                    }
                    egret.sys.CanvasRenderBuffer = web.CanvasRenderBuffer;
                    setRenderMode(options.renderMode);
                    egret_native.nrSetRenderMode(2);
                    var canvasScaleFactor;
                    if (options.canvasScaleFactor) {
                        canvasScaleFactor = options.canvasScaleFactor;
                    }
                    else if (options.calculateCanvasScaleFactor) {
                        canvasScaleFactor = options.calculateCanvasScaleFactor(egret.sys.canvasHitTestBuffer.context);
                    }
                    else {
                        canvasScaleFactor = window.devicePixelRatio;
                    }
                    egret.sys.DisplayList.$canvasScaleFactor = canvasScaleFactor;
                    var ticker = egret.ticker;
                    startTicker(ticker);
                    if (options.screenAdapter) {
                        egret.sys.screenAdapter = options.screenAdapter;
                    }
                    else if (!egret.sys.screenAdapter) {
                        egret.sys.screenAdapter = new egret.sys.DefaultScreenAdapter();
                    }
                    var list = document.querySelectorAll(".egret-player");
                    var length = list.length;
                    for (var i = 0; i < length; i++) {
                        var container = list[i];
                        var player = new web.WebPlayer(container, options);
                        container["egret-player"] = player;
                    }
                    window.addEventListener("resize", function () {
                        if (isNaN(resizeTimer)) {
                            resizeTimer = window.setTimeout(doResize, 300);
                        }
                    });
                }, null);
                egret_native.initNativeRender();
            }
            else {
                web.Html5Capatibility._audioType = options.audioType;
                web.Html5Capatibility.$init();
                var renderMode = options.renderMode;
                // WebGL上下文参数自定义
                if (renderMode == "webgl") {
                    // WebGL抗锯齿默认关闭，提升PC及某些平台性能
                    var antialias = options.antialias;
                    web.WebGLRenderContext.antialias = !!antialias;
                    // WebGLRenderContext.antialias = (typeof antialias == undefined) ? true : antialias;
                }
                egret.sys.CanvasRenderBuffer = web.CanvasRenderBuffer;
                if (ua.indexOf("egretnative") >= 0 && renderMode != "webgl") {
                    egret.$warn(1051);
                    renderMode = "webgl";
                }
                setRenderMode(renderMode);
                var canvasScaleFactor = void 0;
                if (options.canvasScaleFactor) {
                    canvasScaleFactor = options.canvasScaleFactor;
                }
                else if (options.calculateCanvasScaleFactor) {
                    canvasScaleFactor = options.calculateCanvasScaleFactor(egret.sys.canvasHitTestBuffer.context);
                }
                else {
                    //based on : https://github.com/jondavidjohn/hidpi-canvas-polyfill
                    var context = egret.sys.canvasHitTestBuffer.context;
                    var backingStore = context.backingStorePixelRatio ||
                        context.webkitBackingStorePixelRatio ||
                        context.mozBackingStorePixelRatio ||
                        context.msBackingStorePixelRatio ||
                        context.oBackingStorePixelRatio ||
                        context.backingStorePixelRatio || 1;
                    canvasScaleFactor = (window.devicePixelRatio || 1) / backingStore;
                }
                egret.sys.DisplayList.$canvasScaleFactor = canvasScaleFactor;
                var ticker_1 = egret.ticker;
                startTicker(ticker_1);
                if (options.screenAdapter) {
                    egret.sys.screenAdapter = options.screenAdapter;
                }
                else if (!egret.sys.screenAdapter) {
                    egret.sys.screenAdapter = new egret.sys.DefaultScreenAdapter();
                }
                var list = document.querySelectorAll(".egret-player");
                var length_1 = list.length;
                for (var i = 0; i < length_1; i++) {
                    var container = list[i];
                    var player = new web.WebPlayer(container, options);
                    container["egret-player"] = player;
                }
                window.addEventListener("resize", function () {
                    if (isNaN(resizeTimer)) {
                        resizeTimer = window.setTimeout(doResize, 300);
                    }
                });
            }
        }
        /**
         * 设置渲染模式。"auto","webgl","canvas"
         * @param renderMode
         */
        function setRenderMode(renderMode) {
            if (renderMode == "webgpu" && web.WebGPUUtils.checkCanUseWebGPU()) {
                // 使用WebGPU渲染
                egret.sys.RenderBuffer = web.WebGPURenderBuffer;
                egret.sys.systemRenderer = new web.WebGPURenderer();
                egret.sys.canvasRenderer = new egret.CanvasRenderer();
                egret.sys.customHitTestBuffer = new web.WebGPURenderBuffer(3, 3);
                egret.sys.canvasHitTestBuffer = new web.CanvasRenderBuffer(3, 3);
                egret.Capabilities["renderMode" + ""] = "webgpu";
            }
            else if (renderMode == "webgl" && egret.WebGLUtils.checkCanUseWebGL()) {
                egret.sys.RenderBuffer = web.WebGLRenderBuffer;
                egret.sys.systemRenderer = new web.WebGLRenderer();
                egret.sys.canvasRenderer = new egret.CanvasRenderer();
                egret.sys.customHitTestBuffer = new web.WebGLRenderBuffer(3, 3);
                egret.sys.canvasHitTestBuffer = new web.CanvasRenderBuffer(3, 3);
                egret.Capabilities["renderMode" + ""] = "webgl";
            }
            else {
                egret.sys.RenderBuffer = web.CanvasRenderBuffer;
                egret.sys.systemRenderer = new egret.CanvasRenderer();
                egret.sys.canvasRenderer = egret.sys.systemRenderer;
                egret.sys.customHitTestBuffer = new web.CanvasRenderBuffer(3, 3);
                egret.sys.canvasHitTestBuffer = egret.sys.customHitTestBuffer;
                egret.Capabilities["renderMode" + ""] = "canvas";
            }
        }
        egret.sys.setRenderMode = setRenderMode;
        /**
         * @private
         * 启动心跳计时器。
         */
        function startTicker(ticker) {
            var requestAnimationFrame = window["requestAnimationFrame"] ||
                window["webkitRequestAnimationFrame"] ||
                window["mozRequestAnimationFrame"] ||
                window["oRequestAnimationFrame"] ||
                window["msRequestAnimationFrame"];
            if (!requestAnimationFrame) {
                requestAnimationFrame = function (callback) {
                    return window.setTimeout(callback, 1000 / 60);
                };
            }
            requestAnimationFrame(onTick);
            function onTick() {
                requestAnimationFrame(onTick);
                ticker.update();
            }
        }
        //覆盖原生的isNaN()方法实现，在不同浏览器上有2~10倍性能提升。
        window["isNaN"] = function (value) {
            value = +value;
            return value !== value;
        };
        egret.runEgret = runEgret;
        egret.updateAllScreens = updateAllScreens;
        var resizeTimer = NaN;
        function doResize() {
            resizeTimer = NaN;
            egret.updateAllScreens();
        }
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
if (true) {
    var language = navigator.language || navigator["browserLanguage"] || "en_US";
    language = language.replace("-", "_");
    if (language in egret.$locale_strings)
        egret.$language = language;
}
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WebCapability = /** @class */ (function () {
            function WebCapability() {
            }
            /**
             * @private
             * 检测系统属性
             */
            WebCapability.detect = function () {
                var capabilities = egret.Capabilities;
                var ua = navigator.userAgent.toLowerCase();
                capabilities["isMobile" + ""] = (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
                if (capabilities.isMobile) {
                    if (ua.indexOf("windows") < 0 && (ua.indexOf("iphone") != -1 || ua.indexOf("ipad") != -1 || ua.indexOf("ipod") != -1)) {
                        capabilities["os" + ""] = "iOS";
                    }
                    else if (ua.indexOf("android") != -1 && ua.indexOf("linux") != -1) {
                        capabilities["os" + ""] = "Android";
                    }
                    else if (ua.indexOf("harmony") != -1) {
                        capabilities["os" + ""] = "ohos";
                    }
                    else if (ua.indexOf("windows") != -1) {
                        capabilities["os" + ""] = "Windows Phone";
                    }
                }
                else {
                    if (ua.indexOf("windows nt") != -1) {
                        capabilities["os" + ""] = "Windows PC";
                    }
                    else if (navigator.platform == "MacIntel" && navigator.maxTouchPoints > 1) { //ios 13 Request Desktop Website
                        capabilities["os" + ""] = "iOS";
                        capabilities["isMobile" + ""] = true;
                    }
                    else if (ua.indexOf("mac os") != -1) {
                        capabilities["os" + ""] = "Mac OS";
                    }
                }
                var language = (navigator.language || navigator["browserLanguage"]).toLowerCase();
                var strings = language.split("-");
                if (strings.length > 1) {
                    strings[1] = strings[1].toUpperCase();
                }
                capabilities["language" + ""] = strings.join("-");
                WebCapability.injectUIntFixOnIE9();
            };
            WebCapability.injectUIntFixOnIE9 = function () {
                if (/msie 9.0/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
                    var IEBinaryToArray_ByteStr_Script = "<!-- IEBinaryToArray_ByteStr -->\r\n" +
                        "<script type='text/vbscript' language='VBScript'>\r\n" +
                        "Function IEBinaryToArray_ByteStr(Binary)\r\n" +
                        "   IEBinaryToArray_ByteStr = CStr(Binary)\r\n" +
                        "End Function\r\n" +
                        "Function IEBinaryToArray_ByteStr_Last(Binary)\r\n" +
                        "   Dim lastIndex\r\n" +
                        "   lastIndex = LenB(Binary)\r\n" +
                        "   if lastIndex mod 2 Then\r\n" +
                        "       IEBinaryToArray_ByteStr_Last = Chr( AscB( MidB( Binary, lastIndex, 1 ) ) )\r\n" +
                        "   Else\r\n" +
                        "       IEBinaryToArray_ByteStr_Last = " + '""' + "\r\n" +
                        "   End If\r\n" +
                        "End Function\r\n" + "<\/script>\r\n" +
                        "<!-- convertResponseBodyToText -->\r\n" +
                        "<script>\r\n" +
                        "let convertResponseBodyToText = function (binary) {\r\n" +
                        "   let byteMapping = {};\r\n" +
                        "   for ( let i = 0; i < 256; i++ ) {\r\n" +
                        "       for ( let j = 0; j < 256; j++ ) {\r\n" +
                        "           byteMapping[ String.fromCharCode( i + j * 256 ) ] =\r\n" +
                        "           String.fromCharCode(i) + String.fromCharCode(j);\r\n" +
                        "       }\r\n" +
                        "   }\r\n" +
                        "   let rawBytes = IEBinaryToArray_ByteStr(binary);\r\n" +
                        "   let lastChr = IEBinaryToArray_ByteStr_Last(binary);\r\n" +
                        "   return rawBytes.replace(/[\\s\\S]/g," +
                        "                           function( match ) { return byteMapping[match]; }) + lastChr;\r\n" +
                        "};\r\n" +
                        "<\/script>\r\n";
                    document.write(IEBinaryToArray_ByteStr_Script);
                }
            };
            return WebCapability;
        }());
        web.WebCapability = WebCapability;
        __reflect(WebCapability.prototype, "egret.web.WebCapability");
        WebCapability.detect();
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WebFps = /** @class */ (function () {
            function WebFps(stage, showFPS, showLog, logFilter, styles) {
                this.showPanle = true;
                this.fpsHeight = 0;
                this.WIDTH = 101;
                this.HEIGHT = 20;
                this.bgCanvasColor = "#18304b";
                this.fpsFrontColor = "#18fefe";
                this.WIDTH_COST = 50;
                this.cost1Color = "#18fefe";
                // private cost2Color = "#ffff00";
                this.cost3Color = "#ff0000";
                this.arrFps = [];
                this.arrCost = [];
                this.arrLog = [];
                if (showFPS || showLog) {
                    if (egret.Capabilities.renderMode == 'canvas') {
                        this.renderMode = "Canvas";
                    }
                    else {
                        this.renderMode = "WebGL";
                    }
                    this.panelX = styles["x"] === undefined ? 0 : parseInt(styles['x']);
                    this.panelY = styles["y"] === undefined ? 0 : parseInt(styles['y']);
                    this.fontColor = styles["textColor"] === undefined ? '#ffffff' : styles['textColor'].replace("0x", "#");
                    this.fontSize = styles["size"] === undefined ? 12 : parseInt(styles['size']);
                    if (egret.Capabilities.isMobile) {
                        this.fontSize -= 2;
                    }
                    var all = document.createElement('div');
                    all.style.position = 'absolute';
                    all.style.background = "rgba(0,0,0," + styles['bgAlpha'] + ")";
                    all.style.left = this.panelX + 'px';
                    all.style.top = this.panelY + 'px';
                    all.style.pointerEvents = 'none';
                    all.id = 'egret-fps-panel';
                    document.body.appendChild(all);
                    var container = document.createElement('div');
                    container.style.color = this.fontColor;
                    container.style.fontSize = this.fontSize + 'px';
                    container.style.lineHeight = this.fontSize + 'px';
                    container.style.margin = '4px 4px 4px 4px';
                    this.container = container;
                    all.appendChild(container);
                    if (showFPS)
                        this.addFps();
                    if (showLog)
                        this.addLog();
                }
            }
            WebFps.prototype.addFps = function () {
                var div = document.createElement('div');
                div.style.display = 'inline-block';
                this.containerFps = div;
                this.container.appendChild(div);
                var fps = document.createElement('div');
                fps.style.paddingBottom = '2px';
                this.fps = fps;
                this.containerFps.appendChild(fps);
                fps.innerHTML = "0 FPS " + this.renderMode + "<br/>min0 max0 avg0";
                var canvas = document.createElement('canvas');
                this.containerFps.appendChild(canvas);
                canvas.width = this.WIDTH;
                canvas.height = this.HEIGHT;
                this.canvasFps = canvas;
                var context = canvas.getContext('2d');
                this.contextFps = context;
                context.fillStyle = this.bgCanvasColor;
                context.fillRect(0, 0, this.WIDTH, this.HEIGHT);
                var divDatas = document.createElement('div');
                this.divDatas = divDatas;
                this.containerFps.appendChild(divDatas);
                var left = document.createElement('div');
                left.style['float'] = 'left';
                left.innerHTML = "Draw<br/>Cost";
                divDatas.appendChild(left);
                var right = document.createElement('div');
                right.style.paddingLeft = left.offsetWidth + 20 + "px";
                divDatas.appendChild(right);
                var draw = document.createElement('div');
                this.divDraw = draw;
                draw.innerHTML = "0<br/>";
                right.appendChild(draw);
                var cost = document.createElement('div');
                this.divCost = cost;
                cost.innerHTML = "<font  style=\"color:" + this.cost1Color + "\">0<font/> <font  style=\"color:" + this.cost3Color + "\">0<font/>";
                right.appendChild(cost);
                canvas = document.createElement('canvas');
                this.canvasCost = canvas;
                this.containerFps.appendChild(canvas);
                canvas.width = this.WIDTH;
                canvas.height = this.HEIGHT;
                context = canvas.getContext('2d');
                this.contextCost = context;
                context.fillStyle = this.bgCanvasColor;
                context.fillRect(0, 0, this.WIDTH, this.HEIGHT);
                context.fillStyle = "#000000";
                context.fillRect(this.WIDTH_COST, 0, 1, this.HEIGHT);
                this.fpsHeight = this.container.offsetHeight;
            };
            WebFps.prototype.addLog = function () {
                var log = document.createElement('div');
                log.style.maxWidth = document.body.clientWidth - 8 - this.panelX + 'px';
                log.style.wordWrap = "break-word";
                this.log = log;
                this.container.appendChild(log);
            };
            WebFps.prototype.update = function (datas, showLastData) {
                if (showLastData === void 0) { showLastData = false; }
                var numFps;
                var numCostTicker;
                var numCostRender;
                if (!showLastData) {
                    numFps = datas.fps;
                    numCostTicker = datas.costTicker;
                    numCostRender = datas.costRender;
                    this.lastNumDraw = datas.draw;
                    this.arrFps.push(numFps);
                    this.arrCost.push([numCostTicker, numCostRender]);
                }
                else {
                    numFps = this.arrFps[this.arrFps.length - 1];
                    numCostTicker = this.arrCost[this.arrCost.length - 1][0];
                    numCostRender = this.arrCost[this.arrCost.length - 1][1];
                }
                var fpsTotal = 0;
                var lenFps = this.arrFps.length;
                if (lenFps > 101) {
                    lenFps = 101;
                    this.arrFps.shift();
                    this.arrCost.shift();
                }
                var fpsMin = this.arrFps[0];
                var fpsMax = this.arrFps[0];
                for (var i = 0; i < lenFps; i++) {
                    var num = this.arrFps[i];
                    fpsTotal += num;
                    if (num < fpsMin)
                        fpsMin = num;
                    else if (num > fpsMax)
                        fpsMax = num;
                }
                var WIDTH = this.WIDTH;
                var HEIGHT = this.HEIGHT;
                var context = this.contextFps;
                context.drawImage(this.canvasFps, 1, 0, WIDTH - 1, HEIGHT, 0, 0, WIDTH - 1, HEIGHT);
                context.fillStyle = this.bgCanvasColor;
                context.fillRect(WIDTH - 1, 0, 1, HEIGHT);
                var lastHeight = Math.floor(numFps / 60 * 20);
                if (lastHeight < 1)
                    lastHeight = 1;
                context.fillStyle = this.fpsFrontColor;
                context.fillRect(WIDTH - 1, 20 - lastHeight, 1, lastHeight);
                var WIDTH_COST = this.WIDTH_COST;
                context = this.contextCost;
                context.drawImage(this.canvasCost, 1, 0, WIDTH_COST - 1, HEIGHT, 0, 0, WIDTH_COST - 1, HEIGHT);
                context.drawImage(this.canvasCost, WIDTH_COST + 2, 0, WIDTH_COST - 1, HEIGHT, WIDTH_COST + 1, 0, WIDTH_COST - 1, HEIGHT);
                var c1Height = Math.floor(numCostTicker / 2);
                if (c1Height < 1)
                    c1Height = 1;
                else if (c1Height > 20)
                    c1Height = 20;
                //todo lcj
                var c2Height = Math.floor(numCostRender / 2);
                if (c2Height < 1)
                    c2Height = 1;
                else if (c2Height > 20)
                    c2Height = 20;
                context.fillStyle = this.bgCanvasColor;
                context.fillRect(WIDTH_COST - 1, 0, 1, HEIGHT);
                context.fillRect(WIDTH_COST * 2, 0, 1, HEIGHT);
                context.fillRect(WIDTH_COST * 3 + 1, 0, 1, HEIGHT);
                context.fillStyle = this.cost1Color;
                context.fillRect(WIDTH_COST - 1, 20 - c1Height, 1, c1Height);
                context.fillStyle = this.cost3Color;
                context.fillRect(WIDTH_COST * 2, 20 - c2Height, 1, c2Height);
                var fpsAvg = Math.floor(fpsTotal / lenFps);
                var fpsOutput = numFps + " FPS " + this.renderMode;
                if (this.showPanle) {
                    fpsOutput += "<br/>min" + fpsMin + " max" + fpsMax + " avg" + fpsAvg;
                    this.divDraw.innerHTML = this.lastNumDraw + "<br/>";
                    this.divCost.innerHTML = "<font  style=\"color:#18fefe\">" + numCostTicker + "<font/> <font  style=\"color:#ff0000\">" + numCostRender + "<font/>";
                }
                this.fps.innerHTML = fpsOutput;
            };
            ;
            WebFps.prototype.updateInfo = function (info) {
                this.arrLog.push(info);
                this.updateLogLayout();
            };
            WebFps.prototype.updateWarn = function (info) {
                this.arrLog.push("[Warning]" + info);
                this.updateLogLayout();
            };
            WebFps.prototype.updateError = function (info) {
                this.arrLog.push("[Error]" + info);
                this.updateLogLayout();
            };
            WebFps.prototype.updateLogLayout = function () {
                this.log.innerHTML = this.arrLog.join('<br/>');
                while (document.body.clientHeight < (this.log.offsetHeight + this.fpsHeight + this.panelY + this.fontSize * 2)) {
                    this.arrLog.shift();
                    this.log.innerHTML = this.arrLog.join('<br/>');
                }
            };
            return WebFps;
        }());
        web.WebFps = WebFps;
        __reflect(WebFps.prototype, "egret.web.WebFps", ["egret.FPSDisplay"]);
        egret.FPSDisplay = WebFps;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        function getOption(key) {
            if (window.location) {
                var search = location.search;
                if (search == "") {
                    return "";
                }
                search = search.slice(1);
                var searchArr = search.split("&");
                var length_2 = searchArr.length;
                for (var i = 0; i < length_2; i++) {
                    var str = searchArr[i];
                    var arr = str.split("=");
                    if (arr[0] == key) {
                        return arr[1];
                    }
                }
            }
            return "";
        }
        web.getOption = getOption;
        egret.getOption = getOption;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WebPlayer = /** @class */ (function (_super) {
            __extends(WebPlayer, _super);
            function WebPlayer(container, options) {
                var _this = _super.call(this) || this;
                _this.updateAfterTyping = false;
                _this.init(container, options);
                _this.initOrientation();
                return _this;
            }
            WebPlayer.prototype.init = function (container, options) {
                var _this = this;
                console.log("Egret Engine Version:", egret.Capabilities.engineVersion);
                var option = this.readOption(container, options);
                var stage = new egret.Stage();
                stage.$screen = this;
                stage.$scaleMode = option.scaleMode;
                stage.$orientation = option.orientation;
                stage.$maxTouches = option.maxTouches;
                stage.frameRate = option.frameRate;
                stage.textureScaleFactor = option.textureScaleFactor;
                var buffer = new egret.sys.RenderBuffer(undefined, undefined, true);
                var canvas = buffer.surface;
                this.attachCanvas(container, canvas);
                var webTouch = new web.WebTouchHandler(stage, canvas);
                var player = new egret.sys.Player(buffer, stage, option.entryClassName);
                egret.lifecycle.stage = stage;
                egret.lifecycle.addLifecycleListener(web.WebLifeCycleHandler);
                var webInput = new web.HTMLInput();
                if (option.showFPS || option.showLog) {
                    if (!egret.nativeRender) {
                        player.displayFPS(option.showFPS, option.showLog, option.logFilter, option.fpsStyles);
                    }
                }
                this.playerOption = option;
                this.container = container;
                this.canvas = canvas;
                this.stage = stage;
                this.player = player;
                this.webTouchHandler = webTouch;
                this.webInput = webInput;
                webInput.finishUserTyping = function () {
                    if (_this.updateAfterTyping) {
                        setTimeout(function () {
                            _this.updateScreenSize();
                            _this.updateAfterTyping = false;
                        }, 300);
                    }
                };
                egret.web.$cacheTextAdapter(webInput, stage, container, canvas);
                this.updateScreenSize();
                this.updateMaxTouches();
                player.start();
            };
            WebPlayer.prototype.initOrientation = function () {
                var self = this;
                window.addEventListener("orientationchange", function () {
                    window.setTimeout(function () {
                        egret.StageOrientationEvent.dispatchStageOrientationEvent(self.stage, egret.StageOrientationEvent.ORIENTATION_CHANGE);
                    }, 350);
                });
            };
            /**
             * 读取初始化参数
             */
            WebPlayer.prototype.readOption = function (container, options) {
                var option = {};
                option.entryClassName = container.getAttribute("data-entry-class");
                option.scaleMode = container.getAttribute("data-scale-mode") || egret.StageScaleMode.NO_SCALE;
                option.frameRate = +container.getAttribute("data-frame-rate") || 30;
                option.contentWidth = +container.getAttribute("data-content-width") || 480;
                option.contentHeight = +container.getAttribute("data-content-height") || 800;
                option.orientation = container.getAttribute("data-orientation") || egret.OrientationMode.AUTO;
                option.maxTouches = +container.getAttribute("data-multi-fingered") || 2;
                option.textureScaleFactor = +container.getAttribute("texture-scale-factor") || 1;
                option.showFPS = container.getAttribute("data-show-fps") == "true";
                var styleStr = container.getAttribute("data-show-fps-style") || "";
                var stylesArr = styleStr.split(",");
                var styles = {};
                for (var i = 0; i < stylesArr.length; i++) {
                    var tempStyleArr = stylesArr[i].split(":");
                    styles[tempStyleArr[0]] = tempStyleArr[1];
                }
                option.fpsStyles = styles;
                option.showLog = container.getAttribute("data-show-log") == "true";
                option.logFilter = container.getAttribute("data-log-filter");
                return option;
            };
            /**
             * @private
             * 添加canvas到container。
             */
            WebPlayer.prototype.attachCanvas = function (container, canvas) {
                var style = canvas.style;
                style.cursor = "inherit";
                style.position = "absolute";
                style.top = "0";
                style.bottom = "0";
                style.left = "0";
                style.right = "0";
                container.appendChild(canvas);
                style = container.style;
                style.overflow = "hidden";
                style.position = "absolute";
            };
            /**
             * @private
             * 更新播放器视口尺寸
             */
            WebPlayer.prototype.updateScreenSize = function () {
                var canvas = this.canvas;
                if (canvas['userTyping']) {
                    this.updateAfterTyping = true;
                    return;
                }
                var option = this.playerOption;
                var screenRect = this.container.getBoundingClientRect();
                var top = 0;
                var boundingClientWidth = screenRect.width;
                var boundingClientHeight = screenRect.height;
                if (boundingClientWidth == 0 || boundingClientHeight == 0) {
                    return;
                }
                if (screenRect.top < 0) {
                    boundingClientHeight += screenRect.top;
                    top = -screenRect.top;
                }
                var shouldRotate = false;
                var orientation = this.stage.$orientation;
                if (orientation != egret.OrientationMode.AUTO) {
                    shouldRotate = orientation != egret.OrientationMode.PORTRAIT && boundingClientHeight > boundingClientWidth
                        || orientation == egret.OrientationMode.PORTRAIT && boundingClientWidth > boundingClientHeight;
                }
                var screenWidth = shouldRotate ? boundingClientHeight : boundingClientWidth;
                var screenHeight = shouldRotate ? boundingClientWidth : boundingClientHeight;
                egret.Capabilities["boundingClientWidth" + ""] = screenWidth;
                egret.Capabilities["boundingClientHeight" + ""] = screenHeight;
                var stageSize = egret.sys.screenAdapter.calculateStageSize(this.stage.$scaleMode, screenWidth, screenHeight, option.contentWidth, option.contentHeight);
                var stageWidth = stageSize.stageWidth;
                var stageHeight = stageSize.stageHeight;
                var displayWidth = stageSize.displayWidth;
                var displayHeight = stageSize.displayHeight;
                canvas.style[egret.web.getPrefixStyleName("transformOrigin")] = "0% 0% 0px";
                if (canvas.width != stageWidth) {
                    canvas.width = stageWidth;
                }
                if (canvas.height != stageHeight) {
                    canvas.height = stageHeight;
                }
                var rotation = 0;
                if (shouldRotate) {
                    if (orientation == egret.OrientationMode.LANDSCAPE) { //
                        rotation = 90;
                        canvas.style.top = top + (boundingClientHeight - displayWidth) / 2 + "px";
                        canvas.style.left = (boundingClientWidth + displayHeight) / 2 + "px";
                    }
                    else {
                        rotation = -90;
                        canvas.style.top = top + (boundingClientHeight + displayWidth) / 2 + "px";
                        canvas.style.left = (boundingClientWidth - displayHeight) / 2 + "px";
                    }
                }
                else {
                    canvas.style.top = top + (boundingClientHeight - displayHeight) / 2 + "px";
                    canvas.style.left = (boundingClientWidth - displayWidth) / 2 + "px";
                }
                var scalex = displayWidth / stageWidth, scaley = displayHeight / stageHeight;
                var canvasScaleX = scalex * egret.sys.DisplayList.$canvasScaleFactor;
                var canvasScaleY = scaley * egret.sys.DisplayList.$canvasScaleFactor;
                // if (egret.Capabilities.renderMode == "canvas") {
                canvasScaleX = Math.ceil(canvasScaleX);
                canvasScaleY = Math.ceil(canvasScaleY);
                // }
                var m = egret.Matrix.create();
                m.identity();
                m.scale(scalex / canvasScaleX, scaley / canvasScaleY);
                m.rotate(rotation * Math.PI / 180);
                var transform = "matrix(" + m.a + "," + m.b + "," + m.c + "," + m.d + "," + m.tx + "," + m.ty + ")";
                egret.Matrix.release(m);
                canvas.style[egret.web.getPrefixStyleName("transform")] = transform;
                egret.sys.DisplayList.$setCanvasScale(canvasScaleX, canvasScaleY);
                this.webTouchHandler.updateScaleMode(scalex, scaley, rotation);
                this.webInput.$updateSize();
                this.player.updateStageSize(stageWidth, stageHeight); //不要在这个方法后面修改属性
                // todo
                if (egret.nativeRender) {
                    canvas.width = stageWidth * canvasScaleX;
                    canvas.height = stageHeight * canvasScaleY;
                }
            };
            WebPlayer.prototype.setContentSize = function (width, height) {
                var option = this.playerOption;
                option.contentWidth = width;
                option.contentHeight = height;
                this.updateScreenSize();
            };
            /**
             * @private
             * 更新触摸数量
             */
            WebPlayer.prototype.updateMaxTouches = function () {
                this.webTouchHandler.$updateMaxTouches();
            };
            return WebPlayer;
        }(egret.HashObject));
        web.WebPlayer = WebPlayer;
        __reflect(WebPlayer.prototype, "egret.web.WebPlayer", ["egret.sys.Screen"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        var sharedCanvas;
        var sharedContext;
        /**
         * @private
         */
        function convertImageToCanvas(texture, rect) {
            if (!sharedCanvas) {
                sharedCanvas = egret.sys.createCanvas();
                sharedContext = sharedCanvas.getContext("2d");
            }
            var w = texture.$getTextureWidth();
            var h = texture.$getTextureHeight();
            if (rect == null) {
                rect = egret.$TempRectangle;
                rect.x = 0;
                rect.y = 0;
                rect.width = w;
                rect.height = h;
            }
            rect.x = Math.min(rect.x, w - 1);
            rect.y = Math.min(rect.y, h - 1);
            rect.width = Math.min(rect.width, w - rect.x);
            rect.height = Math.min(rect.height, h - rect.y);
            var iWidth = rect.width;
            var iHeight = rect.height;
            var surface = sharedCanvas;
            surface["style"]["width"] = iWidth + "px";
            surface["style"]["height"] = iHeight + "px";
            sharedCanvas.width = iWidth;
            sharedCanvas.height = iHeight;
            if (egret.Capabilities.renderMode == "webgl") {
                var renderTexture = void 0;
                //webgl下非RenderTexture纹理先画到RenderTexture
                if (!texture.$renderBuffer) {
                    if (egret.sys.systemRenderer.renderClear) {
                        egret.sys.systemRenderer.renderClear();
                    }
                    renderTexture = new egret.RenderTexture();
                    renderTexture.drawToTexture(new egret.Bitmap(texture));
                }
                else {
                    renderTexture = texture;
                }
                //从RenderTexture中读取像素数据，填入canvas
                var pixels = renderTexture.$renderBuffer.getPixels(rect.x, rect.y, iWidth, iHeight);
                var imageData = new ImageData(iWidth, iHeight);
                for (var i = 0; i < pixels.length; i++) {
                    imageData.data[i] = pixels[i];
                }
                sharedContext.putImageData(imageData, 0, 0);
                if (!texture.$renderBuffer) {
                    renderTexture.dispose();
                }
                return surface;
            }
            else {
                var bitmapData = texture;
                var offsetX = Math.round(bitmapData.$offsetX);
                var offsetY = Math.round(bitmapData.$offsetY);
                var bitmapWidth = bitmapData.$bitmapWidth;
                var bitmapHeight = bitmapData.$bitmapHeight;
                sharedContext.drawImage(bitmapData.$bitmapData.source, bitmapData.$bitmapX + rect.x / egret.$TextureScaleFactor, bitmapData.$bitmapY + rect.y / egret.$TextureScaleFactor, bitmapWidth * rect.width / w, bitmapHeight * rect.height / h, offsetX, offsetY, rect.width, rect.height);
                return surface;
            }
        }
        /**
         * @private
         */
        function toDataURL(type, rect, encoderOptions) {
            try {
                var surface = convertImageToCanvas(this, rect);
                var result = surface.toDataURL(type, encoderOptions);
                return result;
            }
            catch (e) {
                egret.$error(1033);
            }
            return null;
        }
        /**
         * 有些杀毒软件认为 saveToFile 可能是一个病毒文件
         */
        function eliFoTevas(type, filePath, rect, encoderOptions) {
            var base64 = toDataURL.call(this, type, rect, encoderOptions);
            if (base64 == null) {
                return;
            }
            var href = base64.replace(/^data:image[^;]*/, "data:image/octet-stream");
            var aLink = document.createElement('a');
            aLink['download'] = filePath;
            aLink.href = href;
            var evt = document.createEvent('MouseEvents');
            evt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            aLink.dispatchEvent(evt);
        }
        function getPixel32(x, y) {
            egret.$warn(1041, "getPixel32", "getPixels");
            return this.getPixels(x, y);
        }
        function getPixels(x, y, width, height) {
            if (width === void 0) { width = 1; }
            if (height === void 0) { height = 1; }
            //webgl环境下不需要转换成canvas获取像素信息
            if (egret.Capabilities.renderMode == "webgl") {
                var renderTexture = void 0;
                //webgl下非RenderTexture纹理先画到RenderTexture
                if (!this.$renderBuffer) {
                    renderTexture = new egret.RenderTexture();
                    renderTexture.drawToTexture(new egret.Bitmap(this));
                }
                else {
                    renderTexture = this;
                }
                //从RenderTexture中读取像素数据
                var pixels = renderTexture.$renderBuffer.getPixels(x, y, width, height);
                return pixels;
            }
            try {
                var surface = convertImageToCanvas(this);
                var result = sharedContext.getImageData(x, y, width, height).data;
                return result;
            }
            catch (e) {
                egret.$error(1039);
            }
        }
        egret.Texture.prototype.toDataURL = toDataURL;
        egret.Texture.prototype.saveToFile = eliFoTevas;
        egret.Texture.prototype.getPixel32 = getPixel32;
        egret.Texture.prototype.getPixels = getPixels;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * XML节点基类
         */
        var XMLNode = /** @class */ (function () {
            /**
             * @private
             */
            function XMLNode(nodeType, parent) {
                this.nodeType = nodeType;
                this.parent = parent;
            }
            return XMLNode;
        }());
        web.XMLNode = XMLNode;
        __reflect(XMLNode.prototype, "egret.web.XMLNode");
        /**
         * @private
         * XML节点对象
         */
        var XML = /** @class */ (function (_super) {
            __extends(XML, _super);
            /**
             * @private
             */
            function XML(localName, parent, prefix, namespace, name) {
                var _this = _super.call(this, 1, parent) || this;
                /**
                 * @private
                 * 当前节点上的属性列表
                 */
                _this.attributes = {};
                /**
                 * @private
                 * 当前节点的子节点列表
                 */
                _this.children = [];
                _this.localName = localName;
                _this.prefix = prefix;
                _this.namespace = namespace;
                _this.name = name;
                return _this;
            }
            return XML;
        }(XMLNode));
        web.XML = XML;
        __reflect(XML.prototype, "egret.web.XML");
        /**
         * @private
         * XML文本节点
         */
        var XMLText = /** @class */ (function (_super) {
            __extends(XMLText, _super);
            /**
             * @private
             */
            function XMLText(text, parent) {
                var _this = _super.call(this, 3, parent) || this;
                _this.text = text;
                return _this;
            }
            return XMLText;
        }(XMLNode));
        web.XMLText = XMLText;
        __reflect(XMLText.prototype, "egret.web.XMLText");
        var parser = new DOMParser();
        /**
         * @private
         * 解析字符串为XML对象
         * @param text 要解析的字符串
         */
        function parse(text) {
            var xmlDoc = parser.parseFromString(text, "text/xml");
            var length = xmlDoc.childNodes.length;
            for (var i = 0; i < length; i++) {
                var node = xmlDoc.childNodes[i];
                if (node.nodeType == 1) {
                    return parseNode(node, null);
                }
            }
            return null;
        }
        /**
         * @private
         * 解析一个节点
         */
        function parseNode(node, parent) {
            var element = node;
            if (element.localName == "parsererror") {
                throw new Error(node.textContent);
            }
            var xml = new XML(element.localName, parent, element["prefix"], element.namespaceURI, node.nodeName);
            var nodeAttributes = element.attributes;
            var attributes = xml.attributes;
            var length = nodeAttributes.length;
            for (var i = 0; i < length; i++) {
                var attributeNode = nodeAttributes[i];
                var name_1 = attributeNode.name;
                if (name_1.indexOf("xmlns:") == 0) {
                    continue;
                }
                attributes[name_1] = attributeNode.value;
                xml["$" + name_1] = attributeNode.value;
            }
            var childNodes = node.childNodes;
            length = childNodes.length;
            var children = xml.children;
            for (var i = 0; i < length; i++) {
                var childNode = childNodes[i];
                var nodeType = childNode.nodeType;
                var childXML = null;
                if (nodeType == 1) {
                    childXML = parseNode(childNode, xml);
                }
                else if (nodeType == 3) {
                    var text = childNode.textContent.trim();
                    if (text) {
                        childXML = new XMLText(text, xml);
                    }
                }
                if (childXML) {
                    children.push(childXML);
                }
            }
            return xml;
        }
        egret.XML = { parse: parse };
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WebDeviceOrientation = /** @class */ (function (_super) {
            __extends(WebDeviceOrientation, _super);
            function WebDeviceOrientation() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                /**
                 * @private
                 */
                _this.onChange = function (e) {
                    var event = new egret.OrientationEvent(egret.Event.CHANGE);
                    event.beta = e.beta;
                    event.gamma = e.gamma;
                    event.alpha = e.alpha;
                    _this.dispatchEvent(event);
                };
                return _this;
            }
            /**
             * @private
             *
             */
            WebDeviceOrientation.prototype.start = function () {
                window.addEventListener("deviceorientation", this.onChange);
            };
            /**
             * @private
             *
             */
            WebDeviceOrientation.prototype.stop = function () {
                window.removeEventListener("deviceorientation", this.onChange);
            };
            return WebDeviceOrientation;
        }(egret.EventDispatcher));
        web.WebDeviceOrientation = WebDeviceOrientation;
        __reflect(WebDeviceOrientation.prototype, "egret.web.WebDeviceOrientation", ["egret.DeviceOrientation"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
egret.DeviceOrientation = egret.web.WebDeviceOrientation;
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        if (true) {
            var logFuncs_1;
            function setLogLevel(logType) {
                if (logFuncs_1 == null) {
                    logFuncs_1 = {
                        "error": console.error,
                        "debug": console.debug,
                        "warn": console.warn,
                        "info": console.info,
                        "log": console.log
                    };
                }
                switch (logType) {
                    case egret.Logger.OFF:
                        console.error = function () {
                        };
                    case egret.Logger.ERROR:
                        console.warn = function () {
                        };
                    case egret.Logger.WARN:
                        console.info = function () {
                        };
                        console.log = function () {
                        };
                    case egret.Logger.INFO:
                        console.debug = function () {
                        };
                    default:
                        break;
                }
                switch (logType) {
                    case egret.Logger.ALL:
                    case egret.Logger.DEBUG:
                        console.debug = logFuncs_1["debug"];
                    case egret.Logger.INFO:
                        console.log = logFuncs_1["log"];
                        console.info = logFuncs_1["info"];
                    case egret.Logger.WARN:
                        console.warn = logFuncs_1["warn"];
                    case egret.Logger.ERROR:
                        console.error = logFuncs_1["error"];
                    default:
                        break;
                }
            }
            Object.defineProperty(egret.Logger, "logLevel", {
                set: setLogLevel,
                enumerable: true,
                configurable: true
            });
        }
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * 绘制指令管理器
         * 用来维护drawData数组
         */
        var WebGLDrawCmdManager = /** @class */ (function () {
            function WebGLDrawCmdManager() {
                /**
                 * 用于缓存绘制命令的数组
                 */
                this.drawData = [];
                this.drawDataLen = 0;
            }
            /**
             * 压入绘制矩形指令
             */
            WebGLDrawCmdManager.prototype.pushDrawRect = function () {
                if (this.drawDataLen == 0 || this.drawData[this.drawDataLen - 1].type != 1 /* RECT */) {
                    var data = this.drawData[this.drawDataLen] || {};
                    data.type = 1 /* RECT */;
                    data.count = 0;
                    this.drawData[this.drawDataLen] = data;
                    this.drawDataLen++;
                }
                this.drawData[this.drawDataLen - 1].count += 2;
            };
            /**
             * 压入绘制texture指令
             */
            WebGLDrawCmdManager.prototype.pushDrawTexture = function (texture, count, filter, textureWidth, textureHeight) {
                if (count === void 0) { count = 2; }
                if (filter) {
                    // 目前有滤镜的情况下不会合并绘制
                    var data = this.drawData[this.drawDataLen] || {};
                    data.type = 0 /* TEXTURE */;
                    data.texture = texture;
                    data.filter = filter;
                    data.count = count;
                    data.textureWidth = textureWidth;
                    data.textureHeight = textureHeight;
                    this.drawData[this.drawDataLen] = data;
                    this.drawDataLen++;
                }
                else {
                    if (this.drawDataLen == 0 || this.drawData[this.drawDataLen - 1].type != 0 /* TEXTURE */ || texture != this.drawData[this.drawDataLen - 1].texture || this.drawData[this.drawDataLen - 1].filter) {
                        var data = this.drawData[this.drawDataLen] || {};
                        data.type = 0 /* TEXTURE */;
                        data.texture = texture;
                        data.count = 0;
                        this.drawData[this.drawDataLen] = data;
                        this.drawDataLen++;
                    }
                    this.drawData[this.drawDataLen - 1].count += count;
                }
            };
            WebGLDrawCmdManager.prototype.pushChangeSmoothing = function (texture, smoothing) {
                texture["smoothing"] = smoothing;
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 10 /* SMOOTHING */;
                data.texture = texture;
                data.smoothing = smoothing;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 压入pushMask指令
             */
            WebGLDrawCmdManager.prototype.pushPushMask = function (count) {
                if (count === void 0) { count = 1; }
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 2 /* PUSH_MASK */;
                data.count = count * 2;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 压入popMask指令
             */
            WebGLDrawCmdManager.prototype.pushPopMask = function (count) {
                if (count === void 0) { count = 1; }
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 3 /* POP_MASK */;
                data.count = count * 2;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 压入混色指令
             */
            WebGLDrawCmdManager.prototype.pushSetBlend = function (value) {
                var len = this.drawDataLen;
                // 有无遍历到有效绘图操作
                var drawState = false;
                for (var i = len - 1; i >= 0; i--) {
                    var data = this.drawData[i];
                    if (data) {
                        if (data.type == 0 /* TEXTURE */ || data.type == 1 /* RECT */) {
                            drawState = true;
                        }
                        // 如果与上一次blend操作之间无有效绘图，上一次操作无效
                        if (!drawState && data.type == 4 /* BLEND */) {
                            this.drawData.splice(i, 1);
                            this.drawDataLen--;
                            continue;
                        }
                        // 如果与上一次blend操作重复，本次操作无效
                        if (data.type == 4 /* BLEND */) {
                            if (data.value == value) {
                                return;
                            }
                            else {
                                break;
                            }
                        }
                    }
                }
                var _data = this.drawData[this.drawDataLen] || {};
                _data.type = 4 /* BLEND */;
                _data.value = value;
                this.drawData[this.drawDataLen] = _data;
                this.drawDataLen++;
            };
            /*
             * 压入resize render target命令
             */
            WebGLDrawCmdManager.prototype.pushResize = function (buffer, width, height) {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 5 /* RESIZE_TARGET */;
                data.buffer = buffer;
                data.width = width;
                data.height = height;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /*
             * 压入clear color命令
             */
            WebGLDrawCmdManager.prototype.pushClearColor = function () {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 6 /* CLEAR_COLOR */;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 压入激活buffer命令
             */
            WebGLDrawCmdManager.prototype.pushActivateBuffer = function (buffer) {
                var len = this.drawDataLen;
                // 有无遍历到有效绘图操作
                var drawState = false;
                for (var i = len - 1; i >= 0; i--) {
                    var data = this.drawData[i];
                    if (data) {
                        if (data.type != 4 /* BLEND */ && data.type != 7 /* ACT_BUFFER */) {
                            drawState = true;
                        }
                        // 如果与上一次buffer操作之间无有效绘图，上一次操作无效
                        if (!drawState && data.type == 7 /* ACT_BUFFER */) {
                            this.drawData.splice(i, 1);
                            this.drawDataLen--;
                            continue;
                        }
                        // 如果与上一次buffer操作重复，本次操作无效
                        // if(data.type == DRAWABLE_TYPE.ACT_BUFFER) {
                        //     if(data.buffer == buffer) {
                        //         return;
                        //     } else {
                        //         break;
                        //     }
                        // }
                    }
                }
                var _data = this.drawData[this.drawDataLen] || {};
                _data.type = 7 /* ACT_BUFFER */;
                _data.buffer = buffer;
                _data.width = buffer.rootRenderTarget.width;
                _data.height = buffer.rootRenderTarget.height;
                this.drawData[this.drawDataLen] = _data;
                this.drawDataLen++;
            };
            /*
             * 压入enabel scissor命令
             */
            WebGLDrawCmdManager.prototype.pushEnableScissor = function (x, y, width, height) {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 8 /* ENABLE_SCISSOR */;
                data.x = x;
                data.y = y;
                data.width = width;
                data.height = height;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /*
             * 压入disable scissor命令
             */
            WebGLDrawCmdManager.prototype.pushDisableScissor = function () {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 9 /* DISABLE_SCISSOR */;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 清空命令数组
             */
            WebGLDrawCmdManager.prototype.clear = function () {
                for (var i = 0; i < this.drawDataLen; i++) {
                    var data = this.drawData[i];
                    data.type = 0;
                    data.count = 0;
                    data.texture = null;
                    data.filter = null;
                    //data.uv = null;
                    data.value = "";
                    data.buffer = null;
                    data.width = 0;
                    data.height = 0;
                    data.textureWidth = 0;
                    data.textureHeight = 0;
                    data.smoothing = false;
                    data.x = 0;
                    data.y = 0;
                }
                this.drawDataLen = 0;
            };
            return WebGLDrawCmdManager;
        }());
        web.WebGLDrawCmdManager = WebGLDrawCmdManager;
        __reflect(WebGLDrawCmdManager.prototype, "egret.web.WebGLDrawCmdManager");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * WebGLRenderTarget
         * A WebGL render target with a frame buffer and texture
         */
        var WebGLRenderTarget = /** @class */ (function (_super) {
            __extends(WebGLRenderTarget, _super);
            function WebGLRenderTarget(gl, width, height) {
                var _this = _super.call(this) || this;
                _this.clearColor = [0, 0, 0, 0];
                /**
                 * If frame buffer is enabled, the default is true
                 */
                _this.useFrameBuffer = true;
                _this.gl = gl;
                _this._resize(width, height);
                return _this;
            }
            WebGLRenderTarget.prototype._resize = function (width, height) {
                // Chrome alerts if the size is 0
                width = width || 1;
                height = height || 1;
                if (width < 1) {
                    if (true) {
                        egret.warn('WebGLRenderTarget _resize width = ' + width);
                    }
                    width = 1;
                }
                if (height < 1) {
                    if (true) {
                        egret.warn('WebGLRenderTarget _resize height = ' + height);
                    }
                    height = 1;
                }
                this.width = width;
                this.height = height;
            };
            WebGLRenderTarget.prototype.resize = function (width, height) {
                this._resize(width, height);
                var gl = this.gl;
                if (this.frameBuffer) {
                    gl.bindTexture(gl.TEXTURE_2D, this.texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                    // gl.bindTexture(gl.TEXTURE_2D, null);
                }
                if (this.stencilBuffer) {
                    gl.deleteRenderbuffer(this.stencilBuffer);
                    this.stencilBuffer = null;
                }
            };
            WebGLRenderTarget.prototype.activate = function () {
                var gl = this.gl;
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.getFrameBuffer());
            };
            WebGLRenderTarget.prototype.getFrameBuffer = function () {
                if (!this.useFrameBuffer) {
                    return null;
                }
                return this.frameBuffer;
            };
            WebGLRenderTarget.prototype.initFrameBuffer = function () {
                if (!this.frameBuffer) {
                    var gl = this.gl;
                    this.texture = this.createTexture();
                    this.frameBuffer = gl.createFramebuffer();
                    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
                }
            };
            WebGLRenderTarget.prototype.createTexture = function () {
                //就是创建空的纹理
                var webglrendercontext = web.WebGLRenderContext.getInstance(0, 0);
                return egret.sys._createTexture(webglrendercontext, this.width, this.height, null);
                /*
                const gl = this.gl;
                const texture: WebGLTexture = gl.createTexture();
                texture[glContext] = gl;
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                return texture;
                */
            };
            WebGLRenderTarget.prototype.clear = function (bind) {
                var gl = this.gl;
                if (bind) {
                    this.activate();
                }
                gl.colorMask(true, true, true, true);
                gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
                gl.clear(gl.COLOR_BUFFER_BIT);
            };
            WebGLRenderTarget.prototype.enabledStencil = function () {
                if (!this.frameBuffer || this.stencilBuffer) {
                    return;
                }
                var gl = this.gl;
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
                this.stencilBuffer = gl.createRenderbuffer();
                gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencilBuffer);
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.stencilBuffer);
                // Is unbundling a bug here?
                // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            };
            WebGLRenderTarget.prototype.dispose = function () {
                egret.WebGLUtils.deleteWebGLTexture(this.texture);
            };
            return WebGLRenderTarget;
        }(egret.HashObject));
        web.WebGLRenderTarget = WebGLRenderTarget;
        __reflect(WebGLRenderTarget.prototype, "egret.web.WebGLRenderTarget");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        //TO DO
        var debugLogCompressedTextureNotSupported = {};
        /**
         * @private
         * WebGL上下文对象，提供简单的绘图接口
         * 抽象出此类，以实现共用一个context
         */
        var WebGLRenderContext = /** @class */ (function () {
            //for 3D&2D
            function WebGLRenderContext(width, height, context) {
                //
                this._defaultEmptyTexture = null;
                this.glID = null;
                this.projectionX = NaN;
                this.projectionY = NaN;
                this.contextLost = false;
                //refactor
                this._supportedCompressedTextureInfo = [];
                this.$scissorState = false;
                this.vertexCountPerTriangle = 3;
                this.triangleCountPerQuad = 2;
                this.dataCountPerVertex = 5;
                this.vertSize = 5;
                //for 3D&2D
                /**
                 * @private
                 */
                this.$beforeRender = function () {
                    var gl = this.context;
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                    gl.disable(gl.DEPTH_TEST);
                    gl.disable(gl.CULL_FACE);
                    gl.enable(gl.BLEND);
                    gl.disable(gl.STENCIL_TEST);
                    gl.colorMask(true, true, true, true);
                    this.setBlendMode("source-over");
                    // 目前只使用0号材质单元，默认开启
                    gl.activeTexture(gl.TEXTURE0);
                    this.currentProgram = null;
                };
                this.surface = egret.sys.mainCanvas(width, height);
                if (egret.nativeRender) {
                    return;
                }
                //for 3D&2D
                this.initWebGL(context);
                this.getSupportedCompressedTexture();
                this.$bufferStack = [];
                var gl = this.context;
                this.vertexBuffer = gl.createBuffer();
                this.indexBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                this.drawCmdManager = new web.WebGLDrawCmdManager();
                this.vao = new web.WebGLVertexArrayObject();
                this.setGlobalCompositeOperation("source-over");
            }
            //for 3D&2D
            WebGLRenderContext.getInstance = function (width, height, context) {
                if (this.instance) {
                    return this.instance;
                }
                //for 3D&2D
                this.instance = new WebGLRenderContext(width, height, context);
                return this.instance;
            };
            /**
             * 推入一个RenderBuffer并绑定
             */
            WebGLRenderContext.prototype.pushBuffer = function (buffer) {
                this.$bufferStack.push(buffer);
                if (buffer != this.currentBuffer) {
                    if (this.currentBuffer) {
                        // this.$drawWebGL();
                    }
                    this.drawCmdManager.pushActivateBuffer(buffer);
                }
                this.currentBuffer = buffer;
            };
            /**
             * 推出一个RenderBuffer并绑定上一个RenderBuffer
             */
            WebGLRenderContext.prototype.popBuffer = function () {
                // 如果只剩下一个buffer，则不执行pop操作
                // 保证舞台buffer永远在最开始
                if (this.$bufferStack.length <= 1) {
                    return;
                }
                var buffer = this.$bufferStack.pop();
                var lastBuffer = this.$bufferStack[this.$bufferStack.length - 1];
                // 重新绑定
                if (buffer != lastBuffer) {
                    // this.$drawWebGL();
                    this.drawCmdManager.pushActivateBuffer(lastBuffer);
                }
                this.currentBuffer = lastBuffer;
            };
            /**
             * 启用RenderBuffer
             */
            WebGLRenderContext.prototype.activateBuffer = function (buffer, width, height) {
                buffer.rootRenderTarget.activate();
                if (!this.bindIndices) {
                    this.uploadIndicesArray(this.vao.getIndices());
                }
                buffer.restoreStencil();
                buffer.restoreScissor();
                this.onResize(width, height);
            };
            /**
             * 上传顶点数据
             */
            WebGLRenderContext.prototype.uploadVerticesArray = function (array) {
                var gl = this.context;
                gl.bufferData(gl.ARRAY_BUFFER, array, gl.STREAM_DRAW);
                // gl.bufferSubData(gl.ARRAY_BUFFER, 0, array);
            };
            /**
             * 上传索引数据
             */
            WebGLRenderContext.prototype.uploadIndicesArray = function (array) {
                var gl = this.context;
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW);
                this.bindIndices = true;
            };
            /**
             * 销毁绘制对象
             */
            WebGLRenderContext.prototype.destroy = function () {
                this.surface.width = this.surface.height = 0;
            };
            WebGLRenderContext.prototype.onResize = function (width, height) {
                width = width || this.surface.width;
                height = height || this.surface.height;
                this.projectionX = width / 2;
                this.projectionY = -height / 2;
                if (this.context) {
                    this.context.viewport(0, 0, width, height);
                }
            };
            /**
             * 改变渲染缓冲的大小并清空缓冲区
             * @param width 改变后的宽
             * @param height 改变后的高
             * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
             */
            WebGLRenderContext.prototype.resize = function (width, height, useMaxSize) {
                egret.sys.resizeContext(this, width, height, useMaxSize);
                /*
                let surface = this.surface;
                if (useMaxSize) {
                    if (surface.width < width) {
                        surface.width = width;
                    }
                    if (surface.height < height) {
                        surface.height = height;
                    }
                }
                else {
                    if (surface.width != width) {
                        surface.width = width;
                    }
                    if (surface.height != height) {
                        surface.height = height;
                    }
                }
    
                this.onResize();
                */
            };
            WebGLRenderContext.prototype._buildSupportedCompressedTextureInfo = function (/*gl: WebGLRenderingContext, compressedTextureExNames: string[],*/ extensions) {
                // if (compressedTextureExNames.length === 0) {
                //     return [];
                // }
                var returnValue = [];
                // for (const exName of compressedTextureExNames) {
                //     const extension = gl.getExtension(exName);
                for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
                    var extension = extensions_1[_i];
                    if (!extension) {
                        continue;
                    }
                    var info = {
                        extensionName: extension.name,
                        supportedFormats: []
                    };
                    //
                    for (var key in extension) {
                        info.supportedFormats.push([key, extension[key]]);
                    }
                    //
                    if (true) {
                        if (info.supportedFormats.length === 0) {
                            console.error('buildSupportedCompressedTextureInfo failed = ' + extension.name);
                        }
                        else {
                            egret.log('support: ' + extension.name);
                            for (var key in extension) {
                                egret.log(key, extension[key], '0x' + extension[key].toString(16));
                            }
                        }
                    }
                    returnValue.push(info);
                }
                return returnValue;
            };
            //for 3D&2D
            WebGLRenderContext.prototype.initWebGL = function (context) {
                this.onResize();
                this.surface.addEventListener("webglcontextlost", this.handleContextLost.bind(this), false);
                this.surface.addEventListener("webglcontextrestored", this.handleContextRestored.bind(this), false);
                context ? this.setContext(context) : this.getWebGLContext();
                var gl = this.context;
                this.$maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
                //refactor
                // this._caps.astc = this._gl.getExtension('WEBGL_compressed_texture_astc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_astc');
                // this._caps.s3tc = this._gl.getExtension('WEBGL_compressed_texture_s3tc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc');
                // this._caps.pvrtc = this._gl.getExtension('WEBGL_compressed_texture_pvrtc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc');
                // this._caps.etc1 = this._gl.getExtension('WEBGL_compressed_texture_etc1') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_etc1');
                // this._caps.etc2 = this._gl.getExtension('WEBGL_compressed_texture_etc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_etc') ||
                //     this._gl.getExtension('WEBGL_compressed_texture_es3_0'); // also a requirement of OpenGL ES 3
                // const compressedTextureExNames = [
                //     'WEBGL_compressed_texture_pvrtc', 'WEBKIT_WEBGL_compressed_texture_pvrtc',
                //     'WEBGL_compressed_texture_etc1', 'WEBKIT_WEBGL_compressed_texture_etc1',
                //     'WEBGL_compressed_texture_etc', 'WEBKIT_WEBGL_compressed_texture_etc',
                //     'WEBGL_compressed_texture_astc', 'WEBKIT_WEBGL_compressed_texture_astc',
                //     'WEBGL_compressed_texture_s3tc', 'WEBKIT_WEBGL_compressed_texture_s3tc',
                //     'WEBGL_compressed_texture_es3_0'];
                //
            };
            WebGLRenderContext.prototype.getSupportedCompressedTexture = function () {
                var gl = this.context ? this.context : egret.sys.getContextWebGL(this.surface);
                this.pvrtc = gl.getExtension('WEBGL_compressed_texture_pvrtc') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc');
                if (this.pvrtc) {
                    this.pvrtc.name = 'WEBGL_compressed_texture_pvrtc';
                }
                this.astc = gl.getExtension('WEBGL_compressed_texture_astc') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_astc');
                if (this.pvrtc) {
                    this.pvrtc.name = 'WEBGL_compressed_texture_astc';
                }
                //
                this.etc1 = gl.getExtension('WEBGL_compressed_texture_etc1') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_etc1');
                if (this.etc1) {
                    this.etc1.name = 'WEBGL_compressed_texture_etc1';
                }
                //
                if (egret.Capabilities._supportedCompressedTexture) {
                    egret.Capabilities._supportedCompressedTexture = egret.Capabilities._supportedCompressedTexture || {};
                    egret.Capabilities._supportedCompressedTexture.pvrtc = !!this.pvrtc;
                    egret.Capabilities._supportedCompressedTexture.astc = !!this.astc;
                    egret.Capabilities._supportedCompressedTexture.etc1 = !!this.etc1;
                }
                else {
                    egret.Capabilities['supportedCompressedTexture'] = egret.Capabilities._supportedCompressedTexture || {};
                    egret.Capabilities['supportedCompressedTexture'].pvrtc = !!this.pvrtc;
                    egret.Capabilities['supportedCompressedTexture'].astc = !!this.astc;
                    egret.Capabilities['supportedCompressedTexture'].etc1 = !!this.etc1;
                }
                //
                this._supportedCompressedTextureInfo = this._buildSupportedCompressedTextureInfo(/*this.context, compressedTextureExNames,*/ [this.etc1, this.astc, this.pvrtc]);
            };
            WebGLRenderContext.prototype.handleContextLost = function () {
                this.contextLost = true;
            };
            WebGLRenderContext.prototype.handleContextRestored = function () {
                this.initWebGL();
                this.contextLost = false;
            };
            WebGLRenderContext.prototype.getWebGLContext = function () {
                /*
                let options = {
                    antialias: WebGLRenderContext.antialias,
                    stencil: true//设置可以使用模板（用于不规则遮罩）
                };
                let gl: any;
                //todo 是否使用chrome源码names
                //let contextNames = ["moz-webgl", "webkit-3d", "experimental-webgl", "webgl", "3d"];
                let names = ["webgl", "experimental-webgl"];
                for (let i = 0; i < names.length; i++) {
                    try {
                        gl = this.surface.getContext(names[i], options);
                    } catch (e) {
                    }
                    if (gl) {
                        break;
                    }
                }
                if (!gl) {
                    $error(1021);
                }
                */
                var gl = egret.sys.getContextWebGL(this.surface);
                this.setContext(gl);
                return gl;
            };
            WebGLRenderContext.prototype.setContext = function (gl) {
                this.context = gl;
                gl.id = WebGLRenderContext.glContextId++;
                this.glID = gl.id;
                gl.disable(gl.DEPTH_TEST);
                gl.disable(gl.CULL_FACE);
                gl.enable(gl.BLEND);
                gl.colorMask(true, true, true, true);
                // 目前只使用0号材质单元，默认开启
                gl.activeTexture(gl.TEXTURE0);
            };
            /**
             * 开启模版检测
             */
            WebGLRenderContext.prototype.enableStencilTest = function () {
                var gl = this.context;
                gl.enable(gl.STENCIL_TEST);
            };
            /**
             * 关闭模版检测
             */
            WebGLRenderContext.prototype.disableStencilTest = function () {
                var gl = this.context;
                gl.disable(gl.STENCIL_TEST);
            };
            /**
             * 开启scissor检测
             */
            WebGLRenderContext.prototype.enableScissorTest = function (rect) {
                var gl = this.context;
                gl.enable(gl.SCISSOR_TEST);
                gl.scissor(rect.x, rect.y, rect.width, rect.height);
            };
            /**
             * 关闭scissor检测
             */
            WebGLRenderContext.prototype.disableScissorTest = function () {
                var gl = this.context;
                gl.disable(gl.SCISSOR_TEST);
            };
            /**
             * 获取像素信息
             */
            WebGLRenderContext.prototype.getPixels = function (x, y, width, height, pixels) {
                var gl = this.context;
                gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            };
            /**
             * 创建一个WebGLTexture
             */
            WebGLRenderContext.prototype.createTexture = function (bitmapData) {
                return egret.sys.createTexture(this, bitmapData);
            };
            /*
            * TO DO
            */
            WebGLRenderContext.prototype.checkCompressedTextureInternalFormat = function (supportedCompressedTextureInfo, internalFormat) {
                //width: number, height: number max ?
                for (var i = 0, length_3 = supportedCompressedTextureInfo.length; i < length_3; ++i) {
                    var ss = supportedCompressedTextureInfo[i];
                    // const formats = ss._COMPRESSED_TEXTURE_FORMATS_;
                    // for (let j = 0, length = formats.length; j < length; ++j) {
                    //     if (formats[j] === internalFormat) {
                    //         return true;
                    //     }
                    // }
                    var supportedFormats = ss.supportedFormats;
                    for (var j = 0, length_4 = supportedFormats.length; j < length_4; ++j) {
                        if (supportedFormats[j][1] === internalFormat) {
                            return true;
                        }
                    }
                }
                return false;
            };
            /*
            * TO DO
            */
            WebGLRenderContext.prototype.$debugLogCompressedTextureNotSupported = function (supportedCompressedTextureInfo, internalFormat) {
                if (!debugLogCompressedTextureNotSupported[internalFormat]) {
                    debugLogCompressedTextureNotSupported[internalFormat] = true;
                    egret.log('internalFormat = ' + internalFormat + ':' + ('0x' + internalFormat.toString(16)) + ', the current hardware does not support the corresponding compression format.');
                    for (var i = 0, length_5 = supportedCompressedTextureInfo.length; i < length_5; ++i) {
                        var ss = supportedCompressedTextureInfo[i];
                        if (ss.supportedFormats.length > 0) {
                            egret.log('support = ' + ss.extensionName);
                            for (var j = 0, length_6 = ss.supportedFormats.length; j < length_6; ++j) {
                                var tp = ss.supportedFormats[j];
                                egret.log(tp[0] + ' : ' + tp[1] + ' : ' + ('0x' + tp[1].toString(16)));
                            }
                        }
                    }
                }
            };
            //
            WebGLRenderContext.prototype.createCompressedTexture = function (data, width, height, levels, internalFormat) {
                var checkSupported = this.checkCompressedTextureInternalFormat(this._supportedCompressedTextureInfo, internalFormat);
                if (!checkSupported) {
                    this.$debugLogCompressedTextureNotSupported(this._supportedCompressedTextureInfo, internalFormat);
                    return this.defaultEmptyTexture;
                }
                ///
                var gl = this.context;
                var texture = gl.createTexture();
                if (!texture) {
                    this.contextLost = true;
                    return;
                }
                texture[egret.glContext] = gl;
                texture[egret.is_compressed_texture] = true;
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
                texture[egret.UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
                gl.compressedTexImage2D(gl.TEXTURE_2D, levels, internalFormat, width, height, 0, data);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
                return texture;
            };
            /**
             * 更新材质的bitmapData
             */
            WebGLRenderContext.prototype.updateTexture = function (texture, bitmapData) {
                var gl = this.context;
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
            };
            Object.defineProperty(WebGLRenderContext.prototype, "defaultEmptyTexture", {
                get: function () {
                    if (!this._defaultEmptyTexture) {
                        var size = 16;
                        var canvas = egret.sys.createCanvas(size, size);
                        var context = egret.sys.getContext2d(canvas); //canvas.getContext('2d');
                        context.fillStyle = 'white';
                        context.fillRect(0, 0, size, size);
                        this._defaultEmptyTexture = this.createTexture(canvas);
                        this._defaultEmptyTexture[egret.engine_default_empty_texture] = true;
                    }
                    return this._defaultEmptyTexture;
                },
                enumerable: true,
                configurable: true
            });
            WebGLRenderContext.prototype.getWebGLTexture = function (bitmapData) {
                if (!bitmapData.webGLTexture) {
                    if (bitmapData.format == "image" && !bitmapData.hasCompressed2d()) {
                        bitmapData.webGLTexture = this.createTexture(bitmapData.source);
                    }
                    else if (bitmapData.hasCompressed2d()) {
                        var compressedData = bitmapData.getCompressed2dTextureData();
                        bitmapData.webGLTexture = this.createCompressedTexture(compressedData.byteArray, compressedData.width, compressedData.height, compressedData.level, compressedData.glInternalFormat);
                        ///
                        var etcAlphaMask = bitmapData.etcAlphaMask;
                        if (etcAlphaMask) {
                            var maskTexture = this.getWebGLTexture(etcAlphaMask);
                            if (maskTexture) {
                                bitmapData.webGLTexture[egret.etc_alpha_mask] = maskTexture;
                            }
                        }
                    }
                    if (bitmapData.$deleteSource && bitmapData.webGLTexture) {
                        if (bitmapData.source) {
                            // WeChat Memory leakage bug
                            bitmapData.source.src = '';
                            bitmapData.source = null;
                        }
                        bitmapData.clearCompressedTextureData();
                    }
                    if (bitmapData.webGLTexture) {
                        //todo 默认值
                        bitmapData.webGLTexture["smoothing"] = true;
                    }
                }
                return bitmapData.webGLTexture;
            };
            /**
             * 清除矩形区域
             */
            WebGLRenderContext.prototype.clearRect = function (x, y, width, height) {
                if (x != 0 || y != 0 || width != this.surface.width || height != this.surface.height) {
                    var buffer = this.currentBuffer;
                    if (buffer.$hasScissor) {
                        this.setGlobalCompositeOperation("destination-out");
                        this.drawRect(x, y, width, height);
                        this.setGlobalCompositeOperation("source-over");
                    }
                    else {
                        var m = buffer.globalMatrix;
                        if (m.b == 0 && m.c == 0) {
                            x = x * m.a + m.tx;
                            y = y * m.d + m.ty;
                            width = width * m.a;
                            height = height * m.d;
                            this.enableScissor(x, -y - height + buffer.height, width, height);
                            this.clear();
                            this.disableScissor();
                        }
                        else {
                            this.setGlobalCompositeOperation("destination-out");
                            this.drawRect(x, y, width, height);
                            this.setGlobalCompositeOperation("source-over");
                        }
                    }
                }
                else {
                    this.clear();
                }
            };
            /**
             * 设置混色
             */
            WebGLRenderContext.prototype.setGlobalCompositeOperation = function (value) {
                this.drawCmdManager.pushSetBlend(value);
            };
            /**
             * 绘制图片，image参数可以是BitmapData或者renderTarget
             */
            WebGLRenderContext.prototype.drawImage = function (image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, rotated, smoothing) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !image || !buffer) {
                    return;
                }
                var texture;
                var offsetX;
                var offsetY;
                if (image["texture"] || (image.source && image.source["texture"])) {
                    // 如果是render target
                    texture = image["texture"] || image.source["texture"];
                    buffer.saveTransform();
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(1, 0, 0, -1, 0, destHeight + destY * 2); // 翻转
                }
                else if (!image.source && !image.webGLTexture) {
                    return;
                }
                else {
                    texture = this.getWebGLTexture(image);
                }
                if (!texture) {
                    return;
                }
                this.drawTexture(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, undefined, undefined, undefined, undefined, rotated, smoothing);
                if (image.source && image.source["texture"]) {
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    buffer.restoreTransform();
                }
            };
            /**
             * 绘制Mesh
             */
            WebGLRenderContext.prototype.drawMesh = function (image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, meshUVs, meshVertices, meshIndices, bounds, rotated, smoothing) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !image || !buffer) {
                    return;
                }
                var texture;
                var offsetX;
                var offsetY;
                if (image["texture"] || (image.source && image.source["texture"])) {
                    // 如果是render target
                    texture = image["texture"] || image.source["texture"];
                    buffer.saveTransform();
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(1, 0, 0, -1, 0, destHeight + destY * 2); // 翻转
                }
                else if (!image.source && !image.webGLTexture) {
                    return;
                }
                else {
                    texture = this.getWebGLTexture(image);
                }
                if (!texture) {
                    return;
                }
                this.drawTexture(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, meshUVs, meshVertices, meshIndices, bounds, rotated, smoothing);
                if (image["texture"] || (image.source && image.source["texture"])) {
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    buffer.restoreTransform();
                }
            };
            /**
             * 绘制材质
             */
            WebGLRenderContext.prototype.drawTexture = function (texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight, meshUVs, meshVertices, meshIndices, bounds, rotated, smoothing) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !texture || !buffer) {
                    return;
                }
                var count;
                if (web.isIOS14Device()) {
                    var meshNum = meshIndices && (meshIndices.length / 3) || 0;
                    if (meshIndices) {
                        if (this.vao.reachMaxSize(meshNum * 4, meshNum * 6)) {
                            this.$drawWebGL();
                        }
                    }
                    else {
                        if (this.vao.reachMaxSize()) {
                            this.$drawWebGL();
                        }
                    }
                    if (smoothing != undefined && texture["smoothing"] != smoothing) {
                        this.drawCmdManager.pushChangeSmoothing(texture, smoothing);
                    }
                    count = meshIndices ? meshNum * 2 : 2;
                }
                else {
                    if (meshVertices && meshIndices) {
                        if (this.vao.reachMaxSize(meshVertices.length / 2, meshIndices.length)) {
                            this.$drawWebGL();
                        }
                    }
                    else {
                        if (this.vao.reachMaxSize()) {
                            this.$drawWebGL();
                        }
                    }
                    if (smoothing != undefined && texture["smoothing"] != smoothing) {
                        this.drawCmdManager.pushChangeSmoothing(texture, smoothing);
                    }
                    if (meshUVs) {
                        this.vao.changeToMeshIndices();
                    }
                    count = meshIndices ? meshIndices.length / 3 : 2;
                }
                // 应用$filter，因为只可能是colorMatrixFilter，最后两个参数可不传
                this.drawCmdManager.pushDrawTexture(texture, count, this.$filter, textureWidth, textureHeight);
                buffer.currentTexture = texture;
                this.vao.cacheArrays(buffer, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight, meshUVs, meshVertices, meshIndices, rotated);
            };
            /**
             * 绘制矩形（仅用于遮罩擦除等）
             */
            WebGLRenderContext.prototype.drawRect = function (x, y, width, height) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !buffer) {
                    return;
                }
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
                this.drawCmdManager.pushDrawRect();
                buffer.currentTexture = null;
                this.vao.cacheArrays(buffer, 0, 0, width, height, x, y, width, height, width, height);
            };
            /**
             * 绘制遮罩
             */
            WebGLRenderContext.prototype.pushMask = function (x, y, width, height) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !buffer) {
                    return;
                }
                buffer.$stencilList.push({ x: x, y: y, width: width, height: height });
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
                this.drawCmdManager.pushPushMask();
                buffer.currentTexture = null;
                this.vao.cacheArrays(buffer, 0, 0, width, height, x, y, width, height, width, height);
            };
            /**
             * 恢复遮罩
             */
            WebGLRenderContext.prototype.popMask = function () {
                var buffer = this.currentBuffer;
                if (this.contextLost || !buffer) {
                    return;
                }
                var mask = buffer.$stencilList.pop();
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
                this.drawCmdManager.pushPopMask();
                buffer.currentTexture = null;
                this.vao.cacheArrays(buffer, 0, 0, mask.width, mask.height, mask.x, mask.y, mask.width, mask.height, mask.width, mask.height);
            };
            /**
             * 清除颜色缓存
             */
            WebGLRenderContext.prototype.clear = function () {
                this.drawCmdManager.pushClearColor();
            };
            /**
             * 开启scissor test
             */
            WebGLRenderContext.prototype.enableScissor = function (x, y, width, height) {
                var buffer = this.currentBuffer;
                this.drawCmdManager.pushEnableScissor(x, y, width, height);
                buffer.$hasScissor = true;
            };
            /**
             * 关闭scissor test
             */
            WebGLRenderContext.prototype.disableScissor = function () {
                var buffer = this.currentBuffer;
                this.drawCmdManager.pushDisableScissor();
                buffer.$hasScissor = false;
            };
            WebGLRenderContext.prototype.$drawWebGL = function () {
                if (this.drawCmdManager.drawDataLen == 0 || this.contextLost) {
                    return;
                }
                var indices = this.vao.getIndices();
                var vertices = this.vao.getVertices();
                if (!web.isIOS14Device()) {
                    this.uploadVerticesArray(vertices);
                }
                // 有mesh，则使用indicesForMesh
                if (this.vao.isMesh()) {
                    this.uploadIndicesArray(this.vao.getMeshIndices());
                }
                var length = this.drawCmdManager.drawDataLen;
                var offset = 0;
                for (var i = 0; i < length; i++) {
                    var data = this.drawCmdManager.drawData[i];
                    var isDrawCall = data.type == 0 /* TEXTURE */ || data.type == 1 /* RECT */ || data.type == 2 /* PUSH_MASK */ || data.type == 3 /* POP_MASK */;
                    if (web.isIOS14Device() && !this.vao.isMesh() && isDrawCall) {
                        this.uploadIndicesArray(indices.subarray(0, data.count * this.vertexCountPerTriangle));
                        this.uploadVerticesArray(this.vao.vertices.subarray(offset / this.vertexCountPerTriangle * this.triangleCountPerQuad * this.dataCountPerVertex, (offset + data.count * this.vertexCountPerTriangle) / this.vertexCountPerTriangle * this.triangleCountPerQuad * this.dataCountPerVertex));
                        this.drawData(data, 0);
                        offset += data.count * this.vertexCountPerTriangle;
                    }
                    else {
                        offset = this.drawData(data, offset);
                    }
                    // 计算draw call
                    if (data.type == 7 /* ACT_BUFFER */) {
                        this.activatedBuffer = data.buffer;
                    }
                    if (isDrawCall) {
                        if (this.activatedBuffer && this.activatedBuffer.$computeDrawCall) {
                            this.activatedBuffer.$drawCalls++;
                        }
                    }
                }
                // 切换回默认indices
                if (this.vao.isMesh()) {
                    this.uploadIndicesArray(this.vao.getIndices());
                }
                // 清空数据
                this.drawCmdManager.clear();
                this.vao.clear();
            };
            /**
             * 执行绘制命令
             */
            WebGLRenderContext.prototype.drawData = function (data, offset) {
                if (!data) {
                    return;
                }
                var gl = this.context;
                var program;
                var filter = data.filter;
                switch (data.type) {
                    case 0 /* TEXTURE */:
                        //这段的切换可以优化
                        if (filter) {
                            if (filter.type === "custom") {
                                program = web.EgretWebGLProgram.getProgram(gl, filter.$vertexSrc, filter.$fragmentSrc, filter.$shaderKey);
                            }
                            else if (filter.type === "colorTransform") {
                                if (data.texture[egret.etc_alpha_mask]) {
                                    gl.activeTexture(gl.TEXTURE1);
                                    gl.bindTexture(gl.TEXTURE_2D, data.texture[egret.etc_alpha_mask]);
                                    program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.colorTransform_frag_etc_alphamask_frag, "colorTransform_frag_etc_alphamask_frag");
                                }
                                else {
                                    program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.colorTransform_frag, "colorTransform");
                                }
                            }
                            else if (filter.type === "blurX") {
                                program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.blur_frag, "blur");
                            }
                            else if (filter.type === "blurY") {
                                program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.blur_frag, "blur");
                            }
                            else if (filter.type === "glow") {
                                program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.glow_frag, "glow");
                            }
                        }
                        else {
                            if (data.texture[egret.etc_alpha_mask]) {
                                program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.texture_etc_alphamask_frag, egret.etc_alpha_mask);
                                ///need refactor
                                gl.activeTexture(gl.TEXTURE1);
                                gl.bindTexture(gl.TEXTURE_2D, data.texture[egret.etc_alpha_mask]);
                            }
                            else {
                                program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.texture_frag, "texture");
                            }
                        }
                        this.activeProgram(gl, program);
                        this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);
                        offset += this.drawTextureElements(data, offset);
                        break;
                    case 1 /* RECT */:
                        program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.primitive_frag, "primitive");
                        this.activeProgram(gl, program);
                        this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);
                        offset += this.drawRectElements(data, offset);
                        break;
                    case 2 /* PUSH_MASK */:
                        program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.primitive_frag, "primitive");
                        this.activeProgram(gl, program);
                        this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);
                        offset += this.drawPushMaskElements(data, offset);
                        break;
                    case 3 /* POP_MASK */:
                        program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.primitive_frag, "primitive");
                        this.activeProgram(gl, program);
                        this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);
                        offset += this.drawPopMaskElements(data, offset);
                        break;
                    case 4 /* BLEND */:
                        this.setBlendMode(data.value);
                        break;
                    case 5 /* RESIZE_TARGET */:
                        data.buffer.rootRenderTarget.resize(data.width, data.height);
                        this.onResize(data.width, data.height);
                        break;
                    case 6 /* CLEAR_COLOR */:
                        if (this.activatedBuffer) {
                            var target = this.activatedBuffer.rootRenderTarget;
                            if (target.width != 0 || target.height != 0) {
                                target.clear(true);
                            }
                        }
                        break;
                    case 7 /* ACT_BUFFER */:
                        this.activateBuffer(data.buffer, data.width, data.height);
                        break;
                    case 8 /* ENABLE_SCISSOR */:
                        var buffer = this.activatedBuffer;
                        if (buffer) {
                            if (buffer.rootRenderTarget) {
                                buffer.rootRenderTarget.enabledStencil();
                            }
                            buffer.enableScissor(data.x, data.y, data.width, data.height);
                        }
                        break;
                    case 9 /* DISABLE_SCISSOR */:
                        buffer = this.activatedBuffer;
                        if (buffer) {
                            buffer.disableScissor();
                        }
                        break;
                    case 10 /* SMOOTHING */:
                        gl.bindTexture(gl.TEXTURE_2D, data.texture);
                        if (data.smoothing) {
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                        }
                        else {
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                        }
                        break;
                    default:
                        break;
                }
                return offset;
            };
            WebGLRenderContext.prototype.activeProgram = function (gl, program) {
                if (egret.pro.egret2dDriveMode || program != this.currentProgram) {
                    gl.useProgram(program.id);
                    // 目前所有attribute buffer的绑定方法都是一致的
                    var attribute = program.attributes;
                    for (var key in attribute) {
                        if (key === "aVertexPosition") {
                            gl.vertexAttribPointer(attribute["aVertexPosition"].location, 2, gl.FLOAT, false, 5 * 4, 0);
                            gl.enableVertexAttribArray(attribute["aVertexPosition"].location);
                        }
                        else if (key === "aTextureCoord") {
                            gl.vertexAttribPointer(attribute["aTextureCoord"].location, 2, gl.FLOAT, false, 5 * 4, 2 * 4);
                            gl.enableVertexAttribArray(attribute["aTextureCoord"].location);
                        }
                        else if (key === "aColor") {
                            gl.vertexAttribPointer(attribute["aColor"].location, 4, gl.UNSIGNED_BYTE, true, 5 * 4, 4 * 4);
                            gl.enableVertexAttribArray(attribute["aColor"].location);
                        }
                    }
                    this.currentProgram = program;
                }
            };
            WebGLRenderContext.prototype.syncUniforms = function (program, filter, textureWidth, textureHeight) {
                var uniforms = program.uniforms;
                var isCustomFilter = filter && filter.type === "custom";
                for (var key in uniforms) {
                    if (key == "$filterScale") { // 用于滤镜buffer缩放，忽略
                        continue;
                    }
                    if (key === "projectionVector") {
                        uniforms[key].setValue({ x: this.projectionX, y: this.projectionY });
                    }
                    else if (key === "uTextureSize") {
                        uniforms[key].setValue({ x: textureWidth, y: textureHeight });
                    }
                    else if (key === "uSampler") {
                        uniforms[key].setValue(0);
                    }
                    else if (key === "uSamplerAlphaMask") {
                        uniforms[key].setValue(1);
                    }
                    else {
                        var value = filter.$uniforms[key];
                        if (value !== undefined) {
                            if ((filter.type == "glow" || filter.type.indexOf("blur") == 0)) {
                                if ((key == "blurX" || key == "blurY" || key == "dist")) {
                                    value = value * (filter.$uniforms.$filterScale || 1);
                                }
                                else if (key == "blur" && value.x != undefined && value.y != undefined) {
                                    var newValue = { x: 0, y: 0 };
                                    newValue.x = value.x * (filter.$uniforms.$filterScale != undefined ? filter.$uniforms.$filterScale : 1);
                                    newValue.y = value.y * (filter.$uniforms.$filterScale != undefined ? filter.$uniforms.$filterScale : 1);
                                    uniforms[key].setValue(newValue);
                                    continue;
                                }
                            }
                            uniforms[key].setValue(value);
                        }
                        else {
                            // egret.warn("filter custom: uniform " + key + " not defined!");
                        }
                    }
                }
            };
            /**
             * 画texture
             **/
            WebGLRenderContext.prototype.drawTextureElements = function (data, offset) {
                return egret.sys.drawTextureElements(this, data, offset);
                /*
                let gl: any = this.context;
                gl.activeTexture(gl.TEXTURE0); ///refactor
                gl.bindTexture(gl.TEXTURE_2D, data.texture);
                let size = data.count * 3;
                gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                return size;
                */
            };
            /**
             * @private
             * 画rect
             **/
            WebGLRenderContext.prototype.drawRectElements = function (data, offset) {
                var gl = this.context;
                // gl.bindTexture(gl.TEXTURE_2D, null);
                var size = data.count * 3;
                gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                return size;
            };
            /**
             * 画push mask
             **/
            WebGLRenderContext.prototype.drawPushMaskElements = function (data, offset) {
                var gl = this.context;
                var size = data.count * 3;
                var buffer = this.activatedBuffer;
                if (buffer) {
                    if (buffer.rootRenderTarget) {
                        buffer.rootRenderTarget.enabledStencil();
                    }
                    if (buffer.stencilHandleCount == 0) {
                        buffer.enableStencil();
                        gl.clear(gl.STENCIL_BUFFER_BIT); // clear
                    }
                    var level = buffer.stencilHandleCount;
                    buffer.stencilHandleCount++;
                    gl.colorMask(false, false, false, false);
                    gl.stencilFunc(gl.EQUAL, level, 0xFF);
                    gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
                    // gl.bindTexture(gl.TEXTURE_2D, null);
                    gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                    gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
                    gl.colorMask(true, true, true, true);
                    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
                }
                return size;
            };
            /**
             * 画pop mask
             **/
            WebGLRenderContext.prototype.drawPopMaskElements = function (data, offset) {
                var gl = this.context;
                var size = data.count * 3;
                var buffer = this.activatedBuffer;
                if (buffer) {
                    buffer.stencilHandleCount--;
                    if (buffer.stencilHandleCount == 0) {
                        buffer.disableStencil(); // skip this draw
                    }
                    else {
                        var level = buffer.stencilHandleCount;
                        gl.colorMask(false, false, false, false);
                        gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
                        gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
                        // gl.bindTexture(gl.TEXTURE_2D, null);
                        gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                        gl.stencilFunc(gl.EQUAL, level, 0xFF);
                        gl.colorMask(true, true, true, true);
                        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
                    }
                }
                return size;
            };
            /**
             * 设置混色
             */
            WebGLRenderContext.prototype.setBlendMode = function (value) {
                var gl = this.context;
                var blendModeWebGL = WebGLRenderContext.blendModesForGL[value];
                if (blendModeWebGL) {
                    gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
                }
            };
            /**
             * 应用滤镜绘制给定的render target
             * 此方法不会导致input被释放，所以如果需要释放input，需要调用此方法后手动调用release
             */
            WebGLRenderContext.prototype.drawTargetWidthFilters = function (filters, input) {
                var originInput = input, filtersLen = filters.length, output;
                // 应用前面的滤镜
                if (filtersLen > 1) {
                    for (var i = 0; i < filtersLen - 1; i++) {
                        var filter_1 = filters[i];
                        var width = input.rootRenderTarget.width;
                        var height = input.rootRenderTarget.height;
                        output = web.WebGLRenderBuffer.create(width, height);
                        var scale = Math.max(egret.sys.DisplayList.$canvasScaleFactor, 2);
                        output.setTransform(scale, 0, 0, scale, 0, 0);
                        output.globalAlpha = 1;
                        this.drawToRenderTarget(filter_1, input, output);
                        if (input != originInput) {
                            web.WebGLRenderBuffer.release(input);
                        }
                        input = output;
                    }
                }
                // 应用最后一个滤镜并绘制到当前场景中
                var filter = filters[filtersLen - 1];
                this.drawToRenderTarget(filter, input, this.currentBuffer);
                // 释放掉用于交换的buffer
                if (input != originInput) {
                    web.WebGLRenderBuffer.release(input);
                }
            };
            /**
             * 向一个renderTarget中绘制
             * */
            WebGLRenderContext.prototype.drawToRenderTarget = function (filter, input, output) {
                if (this.contextLost) {
                    return;
                }
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
                this.pushBuffer(output);
                var originInput = input, temp, width = input.rootRenderTarget.width, height = input.rootRenderTarget.height;
                // 模糊滤镜分别处理blurX与blurY
                if (filter.type == "blur") {
                    var blurXFilter = filter.blurXFilter;
                    var blurYFilter = filter.blurYFilter;
                    if (blurXFilter.blurX != 0 && blurYFilter.blurY != 0) {
                        temp = web.WebGLRenderBuffer.create(width, height);
                        var scale_1 = Math.max(egret.sys.DisplayList.$canvasScaleFactor, 2);
                        temp.setTransform(1, 0, 0, 1, 0, 0);
                        temp.transform(scale_1, 0, 0, scale_1, 0, 0);
                        temp.globalAlpha = 1;
                        this.drawToRenderTarget(filter.blurXFilter, input, temp);
                        if (input != originInput) {
                            web.WebGLRenderBuffer.release(input);
                        }
                        input = temp;
                        filter = blurYFilter;
                    }
                    else {
                        filter = blurXFilter.blurX === 0 ? blurYFilter : blurXFilter;
                    }
                }
                // 绘制input结果到舞台
                output.saveTransform();
                var scale = Math.max(egret.sys.DisplayList.$canvasScaleFactor, 2);
                output.transform(1 / scale, 0, 0, 1 / scale, 0, 0);
                output.transform(1, 0, 0, -1, 0, height);
                output.currentTexture = input.rootRenderTarget.texture;
                this.vao.cacheArrays(output, 0, 0, width, height, 0, 0, width, height, width, height);
                output.restoreTransform();
                this.drawCmdManager.pushDrawTexture(input.rootRenderTarget.texture, 2, filter, width, height);
                // 释放掉input
                if (input != originInput) {
                    web.WebGLRenderBuffer.release(input);
                }
                this.popBuffer();
            };
            WebGLRenderContext.initBlendMode = function () {
                /*参考
                gl.ZERO = 0
                gl.ONE = 1
                gl.SRC_COLOR = 768
                gl.ONE_MINUS_SRC_COLOR = 769
                gl.DST_COLOR = 774
                gl.ONE_MINUS_DST_COLOR = 775
                gl.SRC_ALPHA = 770
                gl.ONE_MINUS_SRC_ALPHA = 771
                gl.DST_ALPHA = 772
                gl.ONE_MINUS_DST_ALPHA = 773
                gl.CONSTANT_COLOR = 32769
                gl.ONE_MINUS_CONSTANT_COLOR = 32770
                gl.CONSTANT_ALPHA = 32771
                gl.ONE_MINUS_CONSTANT_ALPHA = 32772
                gl.SRC_ALPHA_SATURATE = 776
                */
                WebGLRenderContext.blendModesForGL = {};
                WebGLRenderContext.blendModesForGL["source-over"] = [1, 771];
                WebGLRenderContext.blendModesForGL["lighter"] = [1, 1];
                WebGLRenderContext.blendModesForGL["lighter-in"] = [770, 771];
                WebGLRenderContext.blendModesForGL["destination-out"] = [0, 771];
                WebGLRenderContext.blendModesForGL["destination-in"] = [0, 770];
            };
            WebGLRenderContext.glContextId = 0;
            WebGLRenderContext.blendModesForGL = null;
            return WebGLRenderContext;
        }());
        web.WebGLRenderContext = WebGLRenderContext;
        __reflect(WebGLRenderContext.prototype, "egret.web.WebGLRenderContext", ["egret.sys.RenderContext"]);
        WebGLRenderContext.initBlendMode();
        egret.sys.WebGLRenderContext = WebGLRenderContext;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * WebGL渲染缓存
         */
        var WebGLRenderBuffer = /** @class */ (function (_super) {
            __extends(WebGLRenderBuffer, _super);
            function WebGLRenderBuffer(width, height, root) {
                var _this = _super.call(this) || this;
                //
                _this.currentTexture = null;
                _this.globalAlpha = 1;
                _this.globalTintColor = 0xFFFFFF;
                /**
                 * stencil state
                 * 模版开关状态
                 */
                _this.stencilState = false;
                _this.$stencilList = [];
                _this.stencilHandleCount = 0;
                /**
                 * scissor state
                 * scissor 开关状态
                 */
                _this.$scissorState = false;
                _this.scissorRect = new egret.Rectangle();
                _this.$hasScissor = false;
                _this.$drawCalls = 0;
                _this.$computeDrawCall = false;
                _this.globalMatrix = new egret.Matrix();
                _this.savedGlobalMatrix = new egret.Matrix();
                _this.$offsetX = 0;
                _this.$offsetY = 0;
                // 获取webglRenderContext
                _this.context = web.WebGLRenderContext.getInstance(width, height);
                if (egret.nativeRender) {
                    if (root) {
                        _this.surface = _this.context.surface;
                    }
                    else {
                        _this.surface = new egret_native.NativeRenderSurface(_this, width, height, root);
                    }
                    _this.rootRenderTarget = null;
                    return _this;
                }
                // buffer 对应的 render target
                _this.rootRenderTarget = new web.WebGLRenderTarget(_this.context.context, 3, 3);
                if (width && height) {
                    _this.resize(width, height);
                }
                // 如果是第一个加入的buffer，说明是舞台buffer
                _this.root = root;
                // 如果是用于舞台渲染的renderBuffer，则默认添加renderTarget到renderContext中，而且是第一个
                if (_this.root) {
                    _this.context.pushBuffer(_this);
                    // 画布
                    _this.surface = _this.context.surface;
                    _this.$computeDrawCall = true;
                }
                else {
                    // 由于创建renderTarget造成的frameBuffer绑定，这里重置绑定
                    var lastBuffer = _this.context.activatedBuffer;
                    if (lastBuffer) {
                        lastBuffer.rootRenderTarget.activate();
                    }
                    _this.rootRenderTarget.initFrameBuffer();
                    _this.surface = _this.rootRenderTarget;
                }
                return _this;
            }
            WebGLRenderBuffer.prototype.enableStencil = function () {
                if (!this.stencilState) {
                    this.context.enableStencilTest();
                    this.stencilState = true;
                }
            };
            WebGLRenderBuffer.prototype.disableStencil = function () {
                if (this.stencilState) {
                    this.context.disableStencilTest();
                    this.stencilState = false;
                }
            };
            WebGLRenderBuffer.prototype.restoreStencil = function () {
                if (this.stencilState) {
                    this.context.enableStencilTest();
                }
                else {
                    this.context.disableStencilTest();
                }
            };
            WebGLRenderBuffer.prototype.enableScissor = function (x, y, width, height) {
                if (!this.$scissorState) {
                    this.$scissorState = true;
                    this.scissorRect.setTo(x, y, width, height);
                    this.context.enableScissorTest(this.scissorRect);
                }
            };
            WebGLRenderBuffer.prototype.disableScissor = function () {
                if (this.$scissorState) {
                    this.$scissorState = false;
                    this.scissorRect.setEmpty();
                    this.context.disableScissorTest();
                }
            };
            WebGLRenderBuffer.prototype.restoreScissor = function () {
                if (this.$scissorState) {
                    this.context.enableScissorTest(this.scissorRect);
                }
                else {
                    this.context.disableScissorTest();
                }
            };
            Object.defineProperty(WebGLRenderBuffer.prototype, "width", {
                /**
                 * 渲染缓冲的宽度，以像素为单位。
                 * @readOnly
                 */
                get: function () {
                    if (egret.nativeRender) {
                        return this.surface.width;
                    }
                    else {
                        return this.rootRenderTarget.width;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebGLRenderBuffer.prototype, "height", {
                /**
                 * 渲染缓冲的高度，以像素为单位。
                 * @readOnly
                 */
                get: function () {
                    if (egret.nativeRender) {
                        return this.surface.height;
                    }
                    else {
                        return this.rootRenderTarget.height;
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 改变渲染缓冲的大小并清空缓冲区
             * @param width 改变后的宽
             * @param height 改变后的高
             * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
             */
            WebGLRenderBuffer.prototype.resize = function (width, height, useMaxSize) {
                width = width || 1;
                height = height || 1;
                if (egret.nativeRender) {
                    this.surface.resize(width, height);
                    return;
                }
                this.context.pushBuffer(this);
                // render target 尺寸重置
                if (width != this.rootRenderTarget.width || height != this.rootRenderTarget.height) {
                    this.context.drawCmdManager.pushResize(this, width, height);
                    // 同步更改宽高
                    this.rootRenderTarget.width = width;
                    this.rootRenderTarget.height = height;
                }
                // 如果是舞台的渲染缓冲，执行resize，否则surface大小不随之改变
                if (this.root) {
                    this.context.resize(width, height, useMaxSize);
                }
                this.context.clear();
                this.context.popBuffer();
            };
            /**
             * 获取指定区域的像素
             */
            WebGLRenderBuffer.prototype.getPixels = function (x, y, width, height) {
                if (width === void 0) { width = 1; }
                if (height === void 0) { height = 1; }
                var pixels = new Uint8Array(4 * width * height);
                if (egret.nativeRender) {
                    egret_native.activateBuffer(this);
                    egret_native.nrGetPixels(x, y, width, height, pixels);
                    egret_native.activateBuffer(null);
                }
                else {
                    var useFrameBuffer = this.rootRenderTarget.useFrameBuffer;
                    this.rootRenderTarget.useFrameBuffer = true;
                    this.rootRenderTarget.activate();
                    this.context.getPixels(x, this.height - y - height, width, height, pixels);
                    this.rootRenderTarget.useFrameBuffer = useFrameBuffer;
                    this.rootRenderTarget.activate();
                }
                //图像反转
                var result = new Uint8Array(4 * width * height);
                for (var i = 0; i < height; i++) {
                    for (var j = 0; j < width; j++) {
                        var index1 = (width * (height - i - 1) + j) * 4;
                        var index2 = (width * i + j) * 4;
                        var a = pixels[index2 + 3];
                        result[index1] = Math.round(pixels[index2] / a * 255);
                        result[index1 + 1] = Math.round(pixels[index2 + 1] / a * 255);
                        result[index1 + 2] = Math.round(pixels[index2 + 2] / a * 255);
                        result[index1 + 3] = pixels[index2 + 3];
                    }
                }
                return result;
            };
            /**
             * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
             * @param type 转换的类型，如: "image/png","image/jpeg"
             */
            WebGLRenderBuffer.prototype.toDataURL = function (type, encoderOptions) {
                return this.context.surface.toDataURL(type, encoderOptions);
            };
            /**
             * 销毁绘制对象
             */
            WebGLRenderBuffer.prototype.destroy = function () {
                this.context.destroy();
            };
            WebGLRenderBuffer.prototype.onRenderFinish = function () {
                this.$drawCalls = 0;
            };
            /**
             * 交换frameBuffer中的图像到surface中
             * @param width 宽度
             * @param height 高度
             */
            WebGLRenderBuffer.prototype.drawFrameBufferToSurface = function (sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, clear) {
                if (clear === void 0) { clear = false; }
                this.rootRenderTarget.useFrameBuffer = false;
                this.rootRenderTarget.activate();
                this.context.disableStencilTest(); // 切换frameBuffer注意要禁用STENCIL_TEST
                this.context.disableScissorTest();
                this.setTransform(1, 0, 0, 1, 0, 0);
                this.globalAlpha = 1;
                this.context.setGlobalCompositeOperation("source-over");
                clear && this.context.clear();
                this.context.drawImage(this.rootRenderTarget, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight, false);
                this.context.$drawWebGL();
                this.rootRenderTarget.useFrameBuffer = true;
                this.rootRenderTarget.activate();
                this.restoreStencil();
                this.restoreScissor();
            };
            /**
             * 交换surface的图像到frameBuffer中
             * @param width 宽度
             * @param height 高度
             */
            WebGLRenderBuffer.prototype.drawSurfaceToFrameBuffer = function (sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, clear) {
                if (clear === void 0) { clear = false; }
                this.rootRenderTarget.useFrameBuffer = true;
                this.rootRenderTarget.activate();
                this.context.disableStencilTest(); // 切换frameBuffer注意要禁用STENCIL_TEST
                this.context.disableScissorTest();
                this.setTransform(1, 0, 0, 1, 0, 0);
                this.globalAlpha = 1;
                this.context.setGlobalCompositeOperation("source-over");
                clear && this.context.clear();
                this.context.drawImage(this.context.surface, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight, false);
                this.context.$drawWebGL();
                this.rootRenderTarget.useFrameBuffer = false;
                this.rootRenderTarget.activate();
                this.restoreStencil();
                this.restoreScissor();
            };
            /**
             * 清空缓冲区数据
             */
            WebGLRenderBuffer.prototype.clear = function () {
                this.context.pushBuffer(this);
                this.context.clear();
                this.context.popBuffer();
            };
            WebGLRenderBuffer.prototype.setTransform = function (a, b, c, d, tx, ty) {
                // this.globalMatrix.setTo(a, b, c, d, tx, ty);
                var matrix = this.globalMatrix;
                matrix.a = a;
                matrix.b = b;
                matrix.c = c;
                matrix.d = d;
                matrix.tx = tx;
                matrix.ty = ty;
            };
            WebGLRenderBuffer.prototype.transform = function (a, b, c, d, tx, ty) {
                var matrix = this.globalMatrix;
                var a1 = matrix.a;
                var b1 = matrix.b;
                var c1 = matrix.c;
                var d1 = matrix.d;
                if (a != 1 || b != 0 || c != 0 || d != 1) {
                    matrix.a = a * a1 + b * c1;
                    matrix.b = a * b1 + b * d1;
                    matrix.c = c * a1 + d * c1;
                    matrix.d = c * b1 + d * d1;
                }
                matrix.tx = tx * a1 + ty * c1 + matrix.tx;
                matrix.ty = tx * b1 + ty * d1 + matrix.ty;
            };
            WebGLRenderBuffer.prototype.useOffset = function () {
                var self = this;
                if (self.$offsetX != 0 || self.$offsetY != 0) {
                    self.globalMatrix.append(1, 0, 0, 1, self.$offsetX, self.$offsetY);
                    self.$offsetX = self.$offsetY = 0;
                }
            };
            WebGLRenderBuffer.prototype.saveTransform = function () {
                var matrix = this.globalMatrix;
                var sMatrix = this.savedGlobalMatrix;
                sMatrix.a = matrix.a;
                sMatrix.b = matrix.b;
                sMatrix.c = matrix.c;
                sMatrix.d = matrix.d;
                sMatrix.tx = matrix.tx;
                sMatrix.ty = matrix.ty;
            };
            WebGLRenderBuffer.prototype.restoreTransform = function () {
                var matrix = this.globalMatrix;
                var sMatrix = this.savedGlobalMatrix;
                matrix.a = sMatrix.a;
                matrix.b = sMatrix.b;
                matrix.c = sMatrix.c;
                matrix.d = sMatrix.d;
                matrix.tx = sMatrix.tx;
                matrix.ty = sMatrix.ty;
            };
            /**
             * 创建一个buffer实例
             */
            WebGLRenderBuffer.create = function (width, height) {
                var buffer = web.renderBufferPool.pop();
                // width = Math.min(width, 1024);
                // height = Math.min(height, 1024);
                if (buffer) {
                    buffer.resize(width, height);
                    var matrix = buffer.globalMatrix;
                    matrix.a = 1;
                    matrix.b = 0;
                    matrix.c = 0;
                    matrix.d = 1;
                    matrix.tx = 0;
                    matrix.ty = 0;
                    buffer.globalAlpha = 1;
                    buffer.$offsetX = 0;
                    buffer.$offsetY = 0;
                }
                else {
                    buffer = new WebGLRenderBuffer(width, height);
                    buffer.$computeDrawCall = false;
                }
                return buffer;
            };
            /**
             * 回收一个buffer实例
             */
            WebGLRenderBuffer.release = function (buffer) {
                web.renderBufferPool.push(buffer);
            };
            WebGLRenderBuffer.autoClear = true;
            return WebGLRenderBuffer;
        }(egret.HashObject));
        web.WebGLRenderBuffer = WebGLRenderBuffer;
        __reflect(WebGLRenderBuffer.prototype, "egret.web.WebGLRenderBuffer", ["egret.sys.RenderBuffer"]);
        web.renderBufferPool = []; //渲染缓冲区对象池
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        var blendModes = ["source-over", "lighter", "destination-out"];
        var defaultCompositeOp = "source-over";
        var BLACK_COLOR = "#000000";
        var CAPS_STYLES = { none: 'butt', square: 'square', round: 'round' };
        /**
         * @private
         * WebGL渲染器
         */
        var WebGLRenderer = /** @class */ (function () {
            function WebGLRenderer() {
                /**
                 * Do special treatment on wechat ios10
                 */
                this.wxiOS10 = false;
                this.nestLevel = 0; //渲染的嵌套层次，0表示在调用堆栈的最外层。
            }
            /**
             * 渲染一个显示对象
             * @param displayObject 要渲染的显示对象
             * @param buffer 渲染缓冲
             * @param matrix 要对显示对象整体叠加的变换矩阵
             * @param dirtyList 脏矩形列表
             * @param forRenderTexture 绘制目标是RenderTexture的标志
             * @returns drawCall触发绘制的次数
             */
            WebGLRenderer.prototype.render = function (displayObject, buffer, matrix, forRenderTexture) {
                this.nestLevel++;
                var webglBuffer = buffer;
                var webglBufferContext = webglBuffer.context;
                var root = forRenderTexture ? displayObject : null;
                webglBufferContext.pushBuffer(webglBuffer);
                //绘制显示对象
                webglBuffer.transform(matrix.a, matrix.b, matrix.c, matrix.d, 0, 0);
                this.drawDisplayObject(displayObject, webglBuffer, matrix.tx, matrix.ty, true);
                webglBufferContext.$drawWebGL();
                var drawCall = webglBuffer.$drawCalls;
                webglBuffer.onRenderFinish();
                webglBufferContext.popBuffer();
                var invert = egret.Matrix.create();
                matrix.$invertInto(invert);
                webglBuffer.transform(invert.a, invert.b, invert.c, invert.d, 0, 0);
                egret.Matrix.release(invert);
                this.nestLevel--;
                if (this.nestLevel === 0) {
                    //最大缓存6个渲染缓冲
                    if (web.renderBufferPool.length > 6) {
                        web.renderBufferPool.length = 6;
                    }
                    var length_7 = web.renderBufferPool.length;
                    for (var i = 0; i < length_7; i++) {
                        web.renderBufferPool[i].resize(0, 0);
                    }
                }
                return drawCall;
            };
            /**
             * @private
             * 绘制一个显示对象
             */
            WebGLRenderer.prototype.drawDisplayObject = function (displayObject, buffer, offsetX, offsetY, isStage) {
                var drawCalls = 0;
                var node;
                var displayList = displayObject.$displayList;
                if (displayList && !isStage) {
                    if (displayObject.$cacheDirty || displayObject.$renderDirty ||
                        displayList.$canvasScaleX != egret.sys.DisplayList.$canvasScaleX ||
                        displayList.$canvasScaleY != egret.sys.DisplayList.$canvasScaleY) {
                        drawCalls += displayList.drawToSurface();
                    }
                    node = displayList.$renderNode;
                }
                else {
                    if (displayObject.$renderDirty) {
                        node = displayObject.$getRenderNode();
                    }
                    else {
                        node = displayObject.$renderNode;
                    }
                }
                displayObject.$cacheDirty = false;
                if (node) {
                    drawCalls++;
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    switch (node.type) {
                        case 1 /* BitmapNode */:
                            this.renderBitmap(node, buffer);
                            break;
                        case 2 /* TextNode */:
                            this.renderText(node, buffer);
                            break;
                        case 3 /* GraphicsNode */:
                            this.renderGraphics(node, buffer);
                            break;
                        case 4 /* GroupNode */:
                            this.renderGroup(node, buffer);
                            break;
                        case 5 /* MeshNode */:
                            this.renderMesh(node, buffer);
                            break;
                        case 6 /* NormalBitmapNode */:
                            this.renderNormalBitmap(node, buffer);
                            break;
                    }
                    buffer.$offsetX = 0;
                    buffer.$offsetY = 0;
                }
                if (displayList && !isStage) {
                    return drawCalls;
                }
                var children = displayObject.$children;
                if (children) {
                    if (displayObject.sortableChildren && displayObject.$sortDirty) {
                        //绘制排序
                        displayObject.sortChildren();
                    }
                    var length_8 = children.length;
                    for (var i = 0; i < length_8; i++) {
                        var child = children[i];
                        var offsetX2 = void 0;
                        var offsetY2 = void 0;
                        var tempAlpha = void 0;
                        var tempTintColor = void 0;
                        if (child.$alpha != 1) {
                            tempAlpha = buffer.globalAlpha;
                            buffer.globalAlpha *= child.$alpha;
                        }
                        if (child.tint !== 0xFFFFFF) {
                            tempTintColor = buffer.globalTintColor;
                            buffer.globalTintColor = child.$tintRGB;
                        }
                        var savedMatrix = void 0;
                        if (child.$useTranslate) {
                            var m = child.$getMatrix();
                            offsetX2 = offsetX + child.$x;
                            offsetY2 = offsetY + child.$y;
                            var m2 = buffer.globalMatrix;
                            savedMatrix = egret.Matrix.create();
                            savedMatrix.a = m2.a;
                            savedMatrix.b = m2.b;
                            savedMatrix.c = m2.c;
                            savedMatrix.d = m2.d;
                            savedMatrix.tx = m2.tx;
                            savedMatrix.ty = m2.ty;
                            buffer.transform(m.a, m.b, m.c, m.d, offsetX2, offsetY2);
                            offsetX2 = -child.$anchorOffsetX;
                            offsetY2 = -child.$anchorOffsetY;
                        }
                        else {
                            offsetX2 = offsetX + child.$x - child.$anchorOffsetX;
                            offsetY2 = offsetY + child.$y - child.$anchorOffsetY;
                        }
                        switch (child.$renderMode) {
                            case 1 /* NONE */:
                                break;
                            case 2 /* FILTER */:
                                drawCalls += this.drawWithFilter(child, buffer, offsetX2, offsetY2);
                                break;
                            case 3 /* CLIP */:
                                drawCalls += this.drawWithClip(child, buffer, offsetX2, offsetY2);
                                break;
                            case 4 /* SCROLLRECT */:
                                drawCalls += this.drawWithScrollRect(child, buffer, offsetX2, offsetY2);
                                break;
                            default:
                                drawCalls += this.drawDisplayObject(child, buffer, offsetX2, offsetY2);
                                break;
                        }
                        if (tempAlpha) {
                            buffer.globalAlpha = tempAlpha;
                        }
                        if (tempTintColor) {
                            buffer.globalTintColor = tempTintColor;
                        }
                        if (savedMatrix) {
                            var m = buffer.globalMatrix;
                            m.a = savedMatrix.a;
                            m.b = savedMatrix.b;
                            m.c = savedMatrix.c;
                            m.d = savedMatrix.d;
                            m.tx = savedMatrix.tx;
                            m.ty = savedMatrix.ty;
                            egret.Matrix.release(savedMatrix);
                        }
                    }
                }
                return drawCalls;
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.drawWithFilter = function (displayObject, buffer, offsetX, offsetY) {
                var drawCalls = 0;
                if (displayObject.$children && displayObject.$children.length == 0 && (!displayObject.$renderNode || displayObject.$renderNode.$getRenderCount() == 0)) {
                    return drawCalls;
                }
                var filters = displayObject.$filters;
                var hasBlendMode = (displayObject.$blendMode !== 0);
                var compositeOp;
                if (hasBlendMode) {
                    compositeOp = blendModes[displayObject.$blendMode];
                    if (!compositeOp) {
                        compositeOp = defaultCompositeOp;
                    }
                }
                var displayBounds = displayObject.$getOriginalBounds();
                var displayBoundsX = displayBounds.x;
                var displayBoundsY = displayBounds.y;
                var displayBoundsWidth = displayBounds.width;
                var displayBoundsHeight = displayBounds.height;
                if (displayBoundsWidth <= 0 || displayBoundsHeight <= 0) {
                    return drawCalls;
                }
                if (!displayObject.mask && filters.length == 1 && (filters[0].type == "colorTransform" || (filters[0].type === "custom" && filters[0].padding === 0))) {
                    var childrenDrawCount = this.getRenderCount(displayObject);
                    if (!displayObject.$children || childrenDrawCount == 1) {
                        if (hasBlendMode) {
                            buffer.context.setGlobalCompositeOperation(compositeOp);
                        }
                        buffer.context.$filter = filters[0];
                        if (displayObject.$mask) {
                            drawCalls += this.drawWithClip(displayObject, buffer, offsetX, offsetY);
                        }
                        else if (displayObject.$scrollRect || displayObject.$maskRect) {
                            drawCalls += this.drawWithScrollRect(displayObject, buffer, offsetX, offsetY);
                        }
                        else {
                            drawCalls += this.drawDisplayObject(displayObject, buffer, offsetX, offsetY);
                        }
                        buffer.context.$filter = null;
                        if (hasBlendMode) {
                            buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                        }
                        return drawCalls;
                    }
                }
                // 为显示对象创建一个新的buffer
                var scale = Math.max(egret.sys.DisplayList.$canvasScaleFactor, 2);
                filters.forEach(function (filter) {
                    if (filter instanceof egret.GlowFilter || filter instanceof egret.BlurFilter) {
                        filter.$uniforms.$filterScale = scale;
                        if (filter.type == 'blur') {
                            var blurFilter = filter;
                            blurFilter.blurXFilter.$uniforms.$filterScale = scale;
                            blurFilter.blurYFilter.$uniforms.$filterScale = scale;
                        }
                    }
                });
                var displayBuffer = this.createRenderBuffer(scale * displayBoundsWidth, scale * displayBoundsHeight);
                displayBuffer.saveTransform();
                displayBuffer.transform(scale, 0, 0, scale, 0, 0);
                displayBuffer.context.pushBuffer(displayBuffer);
                //todo 可以优化减少draw次数
                if (displayObject.$mask) {
                    drawCalls += this.drawWithClip(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
                }
                else if (displayObject.$scrollRect || displayObject.$maskRect) {
                    drawCalls += this.drawWithScrollRect(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
                }
                else {
                    drawCalls += this.drawDisplayObject(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
                }
                displayBuffer.context.popBuffer();
                displayBuffer.restoreTransform();
                //绘制结果到屏幕
                if (drawCalls > 0) {
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(compositeOp);
                    }
                    drawCalls++;
                    // 绘制结果的时候，应用滤镜
                    buffer.$offsetX = offsetX + displayBoundsX;
                    buffer.$offsetY = offsetY + displayBoundsY;
                    var savedMatrix = egret.Matrix.create();
                    var curMatrix = buffer.globalMatrix;
                    savedMatrix.a = curMatrix.a;
                    savedMatrix.b = curMatrix.b;
                    savedMatrix.c = curMatrix.c;
                    savedMatrix.d = curMatrix.d;
                    savedMatrix.tx = curMatrix.tx;
                    savedMatrix.ty = curMatrix.ty;
                    buffer.useOffset();
                    buffer.context.drawTargetWidthFilters(filters, displayBuffer);
                    curMatrix.a = savedMatrix.a;
                    curMatrix.b = savedMatrix.b;
                    curMatrix.c = savedMatrix.c;
                    curMatrix.d = savedMatrix.d;
                    curMatrix.tx = savedMatrix.tx;
                    curMatrix.ty = savedMatrix.ty;
                    egret.Matrix.release(savedMatrix);
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    }
                }
                web.renderBufferPool.push(displayBuffer);
                return drawCalls;
            };
            WebGLRenderer.prototype.getRenderCount = function (displayObject) {
                var drawCount = 0;
                var node = displayObject.$getRenderNode();
                if (node) {
                    drawCount += node.$getRenderCount();
                }
                if (displayObject.$children) {
                    for (var _i = 0, _a = displayObject.$children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        var filters = child.$filters;
                        // 特殊处理有滤镜的对象
                        if (filters && filters.length > 0) {
                            return 2;
                        }
                        else if (child.$children) {
                            drawCount += this.getRenderCount(child);
                        }
                        else {
                            var node_1 = child.$getRenderNode();
                            if (node_1) {
                                drawCount += node_1.$getRenderCount();
                            }
                        }
                    }
                }
                return drawCount;
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.drawWithClip = function (displayObject, buffer, offsetX, offsetY) {
                var drawCalls = 0;
                var hasBlendMode = (displayObject.$blendMode !== 0);
                var compositeOp;
                if (hasBlendMode) {
                    compositeOp = blendModes[displayObject.$blendMode];
                    if (!compositeOp) {
                        compositeOp = defaultCompositeOp;
                    }
                }
                var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
                var mask = displayObject.$mask;
                if (mask) {
                    var maskRenderMatrix = mask.$getMatrix();
                    //遮罩scaleX或scaleY为0，放弃绘制
                    if ((maskRenderMatrix.a == 0 && maskRenderMatrix.b == 0) || (maskRenderMatrix.c == 0 && maskRenderMatrix.d == 0)) {
                        return drawCalls;
                    }
                }
                //没有遮罩,同时显示对象没有子项
                if (!mask && (!displayObject.$children || displayObject.$children.length == 0)) {
                    if (scrollRect) {
                        buffer.context.pushMask(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
                    }
                    //绘制显示对象
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(compositeOp);
                    }
                    drawCalls += this.drawDisplayObject(displayObject, buffer, offsetX, offsetY);
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    }
                    if (scrollRect) {
                        buffer.context.popMask();
                    }
                    return drawCalls;
                }
                else {
                    var displayBounds = displayObject.$getOriginalBounds();
                    var displayBoundsX = displayBounds.x;
                    var displayBoundsY = displayBounds.y;
                    var displayBoundsWidth = displayBounds.width;
                    var displayBoundsHeight = displayBounds.height;
                    if (displayBoundsWidth <= 0 || displayBoundsHeight <= 0) {
                        return drawCalls;
                    }
                    //绘制显示对象自身，若有scrollRect，应用clip
                    var displayBuffer = this.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
                    displayBuffer.context.pushBuffer(displayBuffer);
                    drawCalls += this.drawDisplayObject(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
                    //绘制遮罩
                    if (mask) {
                        var maskBuffer = this.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
                        maskBuffer.context.pushBuffer(maskBuffer);
                        var maskMatrix = egret.Matrix.create();
                        maskMatrix.copyFrom(mask.$getConcatenatedMatrix());
                        mask.$getConcatenatedMatrixAt(displayObject, maskMatrix);
                        maskMatrix.translate(-displayBoundsX, -displayBoundsY);
                        maskBuffer.setTransform(maskMatrix.a, maskMatrix.b, maskMatrix.c, maskMatrix.d, maskMatrix.tx, maskMatrix.ty);
                        egret.Matrix.release(maskMatrix);
                        drawCalls += this.drawDisplayObject(mask, maskBuffer, 0, 0);
                        maskBuffer.context.popBuffer();
                        displayBuffer.context.setGlobalCompositeOperation("destination-in");
                        displayBuffer.setTransform(1, 0, 0, -1, 0, maskBuffer.height);
                        var maskBufferWidth = maskBuffer.rootRenderTarget.width;
                        var maskBufferHeight = maskBuffer.rootRenderTarget.height;
                        displayBuffer.context.drawTexture(maskBuffer.rootRenderTarget.texture, 0, 0, maskBufferWidth, maskBufferHeight, 0, 0, maskBufferWidth, maskBufferHeight, maskBufferWidth, maskBufferHeight);
                        displayBuffer.setTransform(1, 0, 0, 1, 0, 0);
                        displayBuffer.context.setGlobalCompositeOperation("source-over");
                        maskBuffer.setTransform(1, 0, 0, 1, 0, 0);
                        web.renderBufferPool.push(maskBuffer);
                    }
                    displayBuffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    displayBuffer.context.popBuffer();
                    //绘制结果到屏幕
                    if (drawCalls > 0) {
                        drawCalls++;
                        if (hasBlendMode) {
                            buffer.context.setGlobalCompositeOperation(compositeOp);
                        }
                        if (scrollRect) {
                            buffer.context.pushMask(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
                        }
                        var savedMatrix = egret.Matrix.create();
                        var curMatrix = buffer.globalMatrix;
                        savedMatrix.a = curMatrix.a;
                        savedMatrix.b = curMatrix.b;
                        savedMatrix.c = curMatrix.c;
                        savedMatrix.d = curMatrix.d;
                        savedMatrix.tx = curMatrix.tx;
                        savedMatrix.ty = curMatrix.ty;
                        curMatrix.append(1, 0, 0, -1, offsetX + displayBoundsX, offsetY + displayBoundsY + displayBuffer.height);
                        var displayBufferWidth = displayBuffer.rootRenderTarget.width;
                        var displayBufferHeight = displayBuffer.rootRenderTarget.height;
                        buffer.context.drawTexture(displayBuffer.rootRenderTarget.texture, 0, 0, displayBufferWidth, displayBufferHeight, 0, 0, displayBufferWidth, displayBufferHeight, displayBufferWidth, displayBufferHeight);
                        if (scrollRect) {
                            displayBuffer.context.popMask();
                        }
                        if (hasBlendMode) {
                            buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                        }
                        var matrix = buffer.globalMatrix;
                        matrix.a = savedMatrix.a;
                        matrix.b = savedMatrix.b;
                        matrix.c = savedMatrix.c;
                        matrix.d = savedMatrix.d;
                        matrix.tx = savedMatrix.tx;
                        matrix.ty = savedMatrix.ty;
                        egret.Matrix.release(savedMatrix);
                    }
                    web.renderBufferPool.push(displayBuffer);
                    return drawCalls;
                }
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.drawWithScrollRect = function (displayObject, buffer, offsetX, offsetY) {
                var drawCalls = 0;
                var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
                if (scrollRect.isEmpty()) {
                    return drawCalls;
                }
                if (displayObject.$scrollRect) {
                    offsetX -= scrollRect.x;
                    offsetY -= scrollRect.y;
                }
                var m = buffer.globalMatrix;
                var context = buffer.context;
                var scissor = false;
                if (buffer.$hasScissor || m.b != 0 || m.c != 0) { // 有旋转的情况下不能使用scissor
                    buffer.context.pushMask(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
                }
                else {
                    var a = m.a;
                    var d = m.d;
                    var tx = m.tx;
                    var ty = m.ty;
                    var x = scrollRect.x + offsetX;
                    var y = scrollRect.y + offsetY;
                    var xMax = x + scrollRect.width;
                    var yMax = y + scrollRect.height;
                    var minX = void 0, minY = void 0, maxX = void 0, maxY = void 0;
                    //优化，通常情况下不缩放的对象占多数，直接加上偏移量即可。
                    if (a == 1.0 && d == 1.0) {
                        minX = x + tx;
                        minY = y + ty;
                        maxX = xMax + tx;
                        maxY = yMax + ty;
                    }
                    else {
                        var x0 = a * x + tx;
                        var y0 = d * y + ty;
                        var x1 = a * xMax + tx;
                        var y1 = d * y + ty;
                        var x2 = a * xMax + tx;
                        var y2 = d * yMax + ty;
                        var x3 = a * x + tx;
                        var y3 = d * yMax + ty;
                        var tmp = 0;
                        if (x0 > x1) {
                            tmp = x0;
                            x0 = x1;
                            x1 = tmp;
                        }
                        if (x2 > x3) {
                            tmp = x2;
                            x2 = x3;
                            x3 = tmp;
                        }
                        minX = (x0 < x2 ? x0 : x2);
                        maxX = (x1 > x3 ? x1 : x3);
                        if (y0 > y1) {
                            tmp = y0;
                            y0 = y1;
                            y1 = tmp;
                        }
                        if (y2 > y3) {
                            tmp = y2;
                            y2 = y3;
                            y3 = tmp;
                        }
                        minY = (y0 < y2 ? y0 : y2);
                        maxY = (y1 > y3 ? y1 : y3);
                    }
                    context.enableScissor(minX, -maxY + buffer.height, maxX - minX, maxY - minY);
                    scissor = true;
                }
                drawCalls += this.drawDisplayObject(displayObject, buffer, offsetX, offsetY);
                if (scissor) {
                    context.disableScissor();
                }
                else {
                    context.popMask();
                }
                return drawCalls;
            };
            /**
             * 将一个RenderNode对象绘制到渲染缓冲
             * @param node 要绘制的节点
             * @param buffer 渲染缓冲
             * @param matrix 要叠加的矩阵
             * @param forHitTest 绘制结果是用于碰撞检测。若为true，当渲染GraphicsNode时，会忽略透明度样式设置，全都绘制为不透明的。
             */
            WebGLRenderer.prototype.drawNodeToBuffer = function (node, buffer, matrix, forHitTest) {
                var webglBuffer = buffer;
                //pushRenderTARGET
                webglBuffer.context.pushBuffer(webglBuffer);
                webglBuffer.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                this.renderNode(node, buffer, 0, 0, forHitTest);
                webglBuffer.context.$drawWebGL();
                webglBuffer.onRenderFinish();
                //popRenderTARGET
                webglBuffer.context.popBuffer();
            };
            /**
             * 将一个DisplayObject绘制到渲染缓冲，用于RenderTexture绘制
             * @param displayObject 要绘制的显示对象
             * @param buffer 渲染缓冲
             * @param matrix 要叠加的矩阵
             */
            WebGLRenderer.prototype.drawDisplayToBuffer = function (displayObject, buffer, matrix) {
                buffer.context.pushBuffer(buffer);
                if (matrix) {
                    buffer.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                }
                var node;
                if (displayObject.$renderDirty) {
                    node = displayObject.$getRenderNode();
                }
                else {
                    node = displayObject.$renderNode;
                }
                var drawCalls = 0;
                if (node) {
                    drawCalls++;
                    switch (node.type) {
                        case 1 /* BitmapNode */:
                            this.renderBitmap(node, buffer);
                            break;
                        case 2 /* TextNode */:
                            this.renderText(node, buffer);
                            break;
                        case 3 /* GraphicsNode */:
                            this.renderGraphics(node, buffer);
                            break;
                        case 4 /* GroupNode */:
                            this.renderGroup(node, buffer);
                            break;
                        case 5 /* MeshNode */:
                            this.renderMesh(node, buffer);
                            break;
                        case 6 /* NormalBitmapNode */:
                            this.renderNormalBitmap(node, buffer);
                            break;
                    }
                }
                var children = displayObject.$children;
                if (children) {
                    var length_9 = children.length;
                    for (var i = 0; i < length_9; i++) {
                        var child = children[i];
                        switch (child.$renderMode) {
                            case 1 /* NONE */:
                                break;
                            case 2 /* FILTER */:
                                drawCalls += this.drawWithFilter(child, buffer, 0, 0);
                                break;
                            case 3 /* CLIP */:
                                drawCalls += this.drawWithClip(child, buffer, 0, 0);
                                break;
                            case 4 /* SCROLLRECT */:
                                drawCalls += this.drawWithScrollRect(child, buffer, 0, 0);
                                break;
                            default:
                                drawCalls += this.drawDisplayObject(child, buffer, 0, 0);
                                break;
                        }
                    }
                }
                buffer.context.$drawWebGL();
                buffer.onRenderFinish();
                buffer.context.popBuffer();
                return drawCalls;
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.renderNode = function (node, buffer, offsetX, offsetY, forHitTest) {
                buffer.$offsetX = offsetX;
                buffer.$offsetY = offsetY;
                switch (node.type) {
                    case 1 /* BitmapNode */:
                        this.renderBitmap(node, buffer);
                        break;
                    case 2 /* TextNode */:
                        this.renderText(node, buffer);
                        break;
                    case 3 /* GraphicsNode */:
                        this.renderGraphics(node, buffer, forHitTest);
                        break;
                    case 4 /* GroupNode */:
                        this.renderGroup(node, buffer);
                        break;
                    case 5 /* MeshNode */:
                        this.renderMesh(node, buffer);
                        break;
                    case 6 /* NormalBitmapNode */:
                        this.renderNormalBitmap(node, buffer);
                        break;
                }
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.renderNormalBitmap = function (node, buffer) {
                var image = node.image;
                if (!image) {
                    return;
                }
                buffer.context.drawImage(image, node.sourceX, node.sourceY, node.sourceW, node.sourceH, node.drawX, node.drawY, node.drawW, node.drawH, node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.renderBitmap = function (node, buffer) {
                var image = node.image;
                if (!image) {
                    return;
                }
                //buffer.imageSmoothingEnabled = node.smoothing;
                var data = node.drawData;
                var length = data.length;
                var pos = 0;
                var m = node.matrix;
                var blendMode = node.blendMode;
                var alpha = node.alpha;
                var savedMatrix;
                var offsetX;
                var offsetY;
                if (m) {
                    savedMatrix = egret.Matrix.create();
                    var curMatrix = buffer.globalMatrix;
                    savedMatrix.a = curMatrix.a;
                    savedMatrix.b = curMatrix.b;
                    savedMatrix.c = curMatrix.c;
                    savedMatrix.d = curMatrix.d;
                    savedMatrix.tx = curMatrix.tx;
                    savedMatrix.ty = curMatrix.ty;
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                //这里不考虑嵌套
                if (blendMode) {
                    buffer.context.setGlobalCompositeOperation(blendModes[blendMode]);
                }
                var originAlpha;
                if (alpha == alpha) {
                    originAlpha = buffer.globalAlpha;
                    buffer.globalAlpha *= alpha;
                }
                if (node.filter) {
                    buffer.context.$filter = node.filter;
                    while (pos < length) {
                        buffer.context.drawImage(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
                    }
                    buffer.context.$filter = null;
                }
                else {
                    while (pos < length) {
                        buffer.context.drawImage(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
                    }
                }
                if (blendMode) {
                    buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                }
                if (alpha == alpha) {
                    buffer.globalAlpha = originAlpha;
                }
                if (m) {
                    var matrix = buffer.globalMatrix;
                    matrix.a = savedMatrix.a;
                    matrix.b = savedMatrix.b;
                    matrix.c = savedMatrix.c;
                    matrix.d = savedMatrix.d;
                    matrix.tx = savedMatrix.tx;
                    matrix.ty = savedMatrix.ty;
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    egret.Matrix.release(savedMatrix);
                }
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.renderMesh = function (node, buffer) {
                var image = node.image;
                //buffer.imageSmoothingEnabled = node.smoothing;
                var data = node.drawData;
                var length = data.length;
                var pos = 0;
                var m = node.matrix;
                var blendMode = node.blendMode;
                var alpha = node.alpha;
                var savedMatrix;
                var offsetX;
                var offsetY;
                if (m) {
                    savedMatrix = egret.Matrix.create();
                    var curMatrix = buffer.globalMatrix;
                    savedMatrix.a = curMatrix.a;
                    savedMatrix.b = curMatrix.b;
                    savedMatrix.c = curMatrix.c;
                    savedMatrix.d = curMatrix.d;
                    savedMatrix.tx = curMatrix.tx;
                    savedMatrix.ty = curMatrix.ty;
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                //这里不考虑嵌套
                if (blendMode) {
                    buffer.context.setGlobalCompositeOperation(blendModes[blendMode]);
                }
                var originAlpha;
                if (alpha == alpha) {
                    originAlpha = buffer.globalAlpha;
                    buffer.globalAlpha *= alpha;
                }
                if (node.filter) {
                    buffer.context.$filter = node.filter;
                    while (pos < length) {
                        buffer.context.drawMesh(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.uvs, node.vertices, node.indices, node.bounds, node.rotated, node.smoothing);
                    }
                    buffer.context.$filter = null;
                }
                else {
                    while (pos < length) {
                        buffer.context.drawMesh(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.uvs, node.vertices, node.indices, node.bounds, node.rotated, node.smoothing);
                    }
                }
                if (blendMode) {
                    buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                }
                if (alpha == alpha) {
                    buffer.globalAlpha = originAlpha;
                }
                if (m) {
                    var matrix = buffer.globalMatrix;
                    matrix.a = savedMatrix.a;
                    matrix.b = savedMatrix.b;
                    matrix.c = savedMatrix.c;
                    matrix.d = savedMatrix.d;
                    matrix.tx = savedMatrix.tx;
                    matrix.ty = savedMatrix.ty;
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    egret.Matrix.release(savedMatrix);
                }
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.___renderText____ = function (node, buffer) {
                var width = node.width - node.x;
                var height = node.height - node.y;
                if (width <= 0 || height <= 0 || !width || !height || node.drawData.length === 0) {
                    return;
                }
                var canvasScaleX = egret.sys.DisplayList.$canvasScaleX;
                var canvasScaleY = egret.sys.DisplayList.$canvasScaleY;
                var maxTextureSize = buffer.context.$maxTextureSize;
                if (width * canvasScaleX > maxTextureSize) {
                    canvasScaleX *= maxTextureSize / (width * canvasScaleX);
                }
                if (height * canvasScaleY > maxTextureSize) {
                    canvasScaleY *= maxTextureSize / (height * canvasScaleY);
                }
                width *= canvasScaleX;
                height *= canvasScaleY;
                var x = node.x * canvasScaleX;
                var y = node.y * canvasScaleY;
                if (node.$canvasScaleX !== canvasScaleX || node.$canvasScaleY !== canvasScaleY) {
                    node.$canvasScaleX = canvasScaleX;
                    node.$canvasScaleY = canvasScaleY;
                    node.dirtyRender = true;
                }
                if (x || y) {
                    buffer.transform(1, 0, 0, 1, x / canvasScaleX, y / canvasScaleY);
                }
                if (node.dirtyRender) {
                    web.TextAtlasRender.analysisTextNodeAndFlushDrawLabel(node);
                }
                var drawCommands = node[web.property_drawLabel];
                if (drawCommands && drawCommands.length > 0) {
                    //存一下
                    var saveOffsetX = buffer.$offsetX;
                    var saveOffsetY = buffer.$offsetY;
                    //开始画
                    var cmd = null;
                    var anchorX = 0;
                    var anchorY = 0;
                    var textBlocks = null;
                    var tb = null;
                    var page = null;
                    for (var i = 0, length_10 = drawCommands.length; i < length_10; ++i) {
                        cmd = drawCommands[i];
                        anchorX = cmd.anchorX;
                        anchorY = cmd.anchorY;
                        textBlocks = cmd.textBlocks;
                        buffer.$offsetX = saveOffsetX + anchorX;
                        for (var j = 0, length1 = textBlocks.length; j < length1; ++j) {
                            tb = textBlocks[j];
                            if (j > 0) {
                                buffer.$offsetX -= tb.canvasWidthOffset;
                            }
                            buffer.$offsetY = saveOffsetY + anchorY - (tb.measureHeight + (tb.stroke2 ? tb.canvasHeightOffset : 0)) / 2;
                            page = tb.line.page;
                            buffer.context.drawTexture(page.webGLTexture, tb.u, tb.v, tb.contentWidth, tb.contentHeight, 0, 0, tb.contentWidth, tb.contentHeight, page.pageWidth, page.pageHeight);
                            buffer.$offsetX += (tb.contentWidth - tb.canvasWidthOffset);
                        }
                    }
                    //还原回去
                    buffer.$offsetX = saveOffsetX;
                    buffer.$offsetY = saveOffsetY;
                }
                if (x || y) {
                    buffer.transform(1, 0, 0, 1, -x / canvasScaleX, -y / canvasScaleY);
                }
                node.dirtyRender = false;
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.renderText = function (node, buffer) {
                if (web.textAtlasRenderEnable) {
                    //新的文字渲染机制
                    this.___renderText____(node, buffer);
                    return;
                }
                var width = node.width - node.x;
                var height = node.height - node.y;
                if (width <= 0 || height <= 0 || !width || !height || node.drawData.length == 0) {
                    return;
                }
                var canvasScaleX = egret.sys.DisplayList.$canvasScaleX;
                var canvasScaleY = egret.sys.DisplayList.$canvasScaleY;
                var maxTextureSize = buffer.context.$maxTextureSize;
                if (width * canvasScaleX > maxTextureSize) {
                    canvasScaleX *= maxTextureSize / (width * canvasScaleX);
                }
                if (height * canvasScaleY > maxTextureSize) {
                    canvasScaleY *= maxTextureSize / (height * canvasScaleY);
                }
                width *= canvasScaleX;
                height *= canvasScaleY;
                var x = node.x * canvasScaleX;
                var y = node.y * canvasScaleY;
                if (node.$canvasScaleX != canvasScaleX || node.$canvasScaleY != canvasScaleY) {
                    node.$canvasScaleX = canvasScaleX;
                    node.$canvasScaleY = canvasScaleY;
                    node.dirtyRender = true;
                }
                if (this.wxiOS10) {
                    if (!this.canvasRenderer) {
                        this.canvasRenderer = new egret.CanvasRenderer();
                    }
                    if (node.dirtyRender) {
                        this.canvasRenderBuffer = new web.CanvasRenderBuffer(width, height);
                    }
                }
                else {
                    if (!this.canvasRenderBuffer || !this.canvasRenderBuffer.context) {
                        this.canvasRenderer = new egret.CanvasRenderer();
                        this.canvasRenderBuffer = new web.CanvasRenderBuffer(width, height);
                    }
                    else if (node.dirtyRender) {
                        this.canvasRenderBuffer.resize(width, height);
                    }
                }
                if (!this.canvasRenderBuffer.context) {
                    return;
                }
                if (canvasScaleX != 1 || canvasScaleY != 1) {
                    this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
                }
                if (x || y) {
                    if (node.dirtyRender) {
                        this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, -x, -y);
                    }
                    buffer.transform(1, 0, 0, 1, x / canvasScaleX, y / canvasScaleY);
                }
                else if (canvasScaleX != 1 || canvasScaleY != 1) {
                    this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
                }
                if (node.dirtyRender) {
                    var surface = this.canvasRenderBuffer.surface;
                    this.canvasRenderer.renderText(node, this.canvasRenderBuffer.context);
                    if (this.wxiOS10) {
                        surface["isCanvas"] = true;
                        node.$texture = surface;
                    }
                    else {
                        // 拷贝canvas到texture
                        var texture = node.$texture;
                        if (!texture) {
                            texture = buffer.context.createTexture(surface);
                            node.$texture = texture;
                        }
                        else {
                            // 重新拷贝新的图像
                            buffer.context.updateTexture(texture, surface);
                        }
                    }
                    // 保存材质尺寸
                    node.$textureWidth = surface.width;
                    node.$textureHeight = surface.height;
                }
                var textureWidth = node.$textureWidth;
                var textureHeight = node.$textureHeight;
                buffer.context.drawTexture(node.$texture, 0, 0, textureWidth, textureHeight, 0, 0, textureWidth / canvasScaleX, textureHeight / canvasScaleY, textureWidth, textureHeight);
                if (x || y) {
                    if (node.dirtyRender) {
                        this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
                    }
                    buffer.transform(1, 0, 0, 1, -x / canvasScaleX, -y / canvasScaleY);
                }
                node.dirtyRender = false;
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.renderGraphics = function (node, buffer, forHitTest) {
                var width = node.width;
                var height = node.height;
                if (width <= 0 || height <= 0 || !width || !height || node.drawData.length == 0) {
                    return;
                }
                var canvasScaleX = egret.sys.DisplayList.$canvasScaleX;
                var canvasScaleY = egret.sys.DisplayList.$canvasScaleY;
                if (width * canvasScaleX < 1 || height * canvasScaleY < 1) {
                    canvasScaleX = canvasScaleY = 1;
                }
                if (node.$canvasScaleX != canvasScaleX || node.$canvasScaleY != canvasScaleY) {
                    node.$canvasScaleX = canvasScaleX;
                    node.$canvasScaleY = canvasScaleY;
                    node.dirtyRender = true;
                }
                //缩放叠加 width2 / width 填满整个区域
                width = width * canvasScaleX;
                height = height * canvasScaleY;
                var width2 = Math.ceil(width);
                var height2 = Math.ceil(height);
                canvasScaleX *= width2 / width;
                canvasScaleY *= height2 / height;
                width = width2;
                height = height2;
                if (this.wxiOS10) {
                    if (!this.canvasRenderer) {
                        this.canvasRenderer = new egret.CanvasRenderer();
                    }
                    if (node.dirtyRender) {
                        this.canvasRenderBuffer = new web.CanvasRenderBuffer(width, height);
                    }
                }
                else {
                    if (!this.canvasRenderBuffer || !this.canvasRenderBuffer.context) {
                        this.canvasRenderer = new egret.CanvasRenderer();
                        this.canvasRenderBuffer = new web.CanvasRenderBuffer(width, height);
                    }
                    else if (node.dirtyRender) {
                        this.canvasRenderBuffer.resize(width, height);
                    }
                }
                if (!this.canvasRenderBuffer.context) {
                    return;
                }
                if (canvasScaleX != 1 || canvasScaleY != 1) {
                    this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
                }
                if (node.x || node.y) {
                    if (node.dirtyRender || forHitTest) {
                        this.canvasRenderBuffer.context.translate(-node.x, -node.y);
                    }
                    buffer.transform(1, 0, 0, 1, node.x, node.y);
                }
                var surface = this.canvasRenderBuffer.surface;
                if (forHitTest) {
                    this.canvasRenderer.renderGraphics(node, this.canvasRenderBuffer.context, true);
                    var texture = void 0;
                    if (this.wxiOS10) {
                        surface["isCanvas"] = true;
                        texture = surface;
                    }
                    else {
                        egret.WebGLUtils.deleteWebGLTexture(surface);
                        texture = buffer.context.getWebGLTexture(surface);
                    }
                    buffer.context.drawTexture(texture, 0, 0, width, height, 0, 0, width, height, surface.width, surface.height);
                }
                else {
                    if (node.dirtyRender) {
                        this.canvasRenderer.renderGraphics(node, this.canvasRenderBuffer.context);
                        if (this.wxiOS10) {
                            surface["isCanvas"] = true;
                            node.$texture = surface;
                        }
                        else {
                            // 拷贝canvas到texture
                            var texture = node.$texture;
                            if (!texture) {
                                texture = buffer.context.createTexture(surface);
                                node.$texture = texture;
                            }
                            else {
                                // 重新拷贝新的图像
                                buffer.context.updateTexture(texture, surface);
                            }
                        }
                        // 保存材质尺寸
                        node.$textureWidth = surface.width;
                        node.$textureHeight = surface.height;
                    }
                    var textureWidth = node.$textureWidth;
                    var textureHeight = node.$textureHeight;
                    buffer.context.drawTexture(node.$texture, 0, 0, textureWidth, textureHeight, 0, 0, textureWidth / canvasScaleX, textureHeight / canvasScaleY, textureWidth, textureHeight);
                }
                if (node.x || node.y) {
                    if (node.dirtyRender || forHitTest) {
                        this.canvasRenderBuffer.context.translate(node.x, node.y);
                    }
                    buffer.transform(1, 0, 0, 1, -node.x, -node.y);
                }
                if (!forHitTest) {
                    node.dirtyRender = false;
                }
            };
            WebGLRenderer.prototype.renderGroup = function (groupNode, buffer) {
                var m = groupNode.matrix;
                var savedMatrix;
                var offsetX;
                var offsetY;
                if (m) {
                    savedMatrix = egret.Matrix.create();
                    var curMatrix = buffer.globalMatrix;
                    savedMatrix.a = curMatrix.a;
                    savedMatrix.b = curMatrix.b;
                    savedMatrix.c = curMatrix.c;
                    savedMatrix.d = curMatrix.d;
                    savedMatrix.tx = curMatrix.tx;
                    savedMatrix.ty = curMatrix.ty;
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                var children = groupNode.drawData;
                var length = children.length;
                for (var i = 0; i < length; i++) {
                    var node = children[i];
                    this.renderNode(node, buffer, buffer.$offsetX, buffer.$offsetY);
                }
                if (m) {
                    var matrix = buffer.globalMatrix;
                    matrix.a = savedMatrix.a;
                    matrix.b = savedMatrix.b;
                    matrix.c = savedMatrix.c;
                    matrix.d = savedMatrix.d;
                    matrix.tx = savedMatrix.tx;
                    matrix.ty = savedMatrix.ty;
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    egret.Matrix.release(savedMatrix);
                }
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.createRenderBuffer = function (width, height) {
                var buffer = web.renderBufferPool.pop();
                if (buffer) {
                    buffer.resize(width, height);
                    buffer.setTransform(1, 0, 0, 1, 0, 0);
                }
                else {
                    buffer = new web.WebGLRenderBuffer(width, height);
                    buffer.$computeDrawCall = false;
                }
                return buffer;
            };
            WebGLRenderer.prototype.renderClear = function () {
                var renderContext = web.WebGLRenderContext.getInstance();
                var gl = renderContext.context;
                renderContext.$beforeRender();
                var width = renderContext.surface.width;
                var height = renderContext.surface.height;
                gl.viewport(0, 0, width, height);
            };
            return WebGLRenderer;
        }());
        web.WebGLRenderer = WebGLRenderer;
        __reflect(WebGLRenderer.prototype, "egret.web.WebGLRenderer", ["egret.sys.SystemRenderer"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
/*
*** 一个管理模型，逐级包含: back -> page -> line -> textBlock
*/
var egret;
(function (egret) {
    var web;
    (function (web) {
        var TextBlock = /** @class */ (function (_super) {
            __extends(TextBlock, _super);
            function TextBlock(width, height, measureWidth, measureHeight, canvasWidthOffset, canvasHeightOffset, stroke2, border) {
                var _this = _super.call(this) || this;
                _this._width = 0;
                _this._height = 0;
                _this._border = 0;
                _this.line = null;
                _this.x = 0;
                _this.y = 0;
                _this.u = 0;
                _this.v = 0;
                _this.tag = '';
                _this.measureWidth = 0;
                _this.measureHeight = 0;
                _this.canvasWidthOffset = 0;
                _this.canvasHeightOffset = 0;
                _this.stroke2 = 0;
                _this._width = width;
                _this._height = height;
                _this._border = border;
                _this.measureWidth = measureWidth;
                _this.measureHeight = measureHeight;
                _this.canvasWidthOffset = canvasWidthOffset;
                _this.canvasHeightOffset = canvasHeightOffset;
                _this.stroke2 = stroke2;
                return _this;
            }
            Object.defineProperty(TextBlock.prototype, "border", {
                get: function () {
                    return this._border;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "width", {
                get: function () {
                    return this._width + this.border * 2;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "height", {
                get: function () {
                    return this._height + this.border * 2;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "contentWidth", {
                get: function () {
                    return this._width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "contentHeight", {
                get: function () {
                    return this._height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "page", {
                get: function () {
                    return this.line ? this.line.page : null;
                },
                enumerable: true,
                configurable: true
            });
            TextBlock.prototype.updateUV = function () {
                var line = this.line;
                if (!line) {
                    return false; //不属于任何的line就是错的
                }
                this.u = line.x + this.x + this.border * 1;
                this.v = line.y + this.y + this.border * 1;
                return true;
            };
            Object.defineProperty(TextBlock.prototype, "subImageOffsetX", {
                get: function () {
                    var line = this.line;
                    if (!line) {
                        return 0;
                    }
                    return line.x + this.x + this.border;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "subImageOffsetY", {
                get: function () {
                    var line = this.line;
                    if (!line) {
                        return 0;
                    }
                    return line.y + this.y + this.border;
                },
                enumerable: true,
                configurable: true
            });
            return TextBlock;
        }(egret.HashObject));
        web.TextBlock = TextBlock;
        __reflect(TextBlock.prototype, "egret.web.TextBlock");
        var Line = /** @class */ (function (_super) {
            __extends(Line, _super);
            function Line(maxWidth) {
                var _this = _super.call(this) || this;
                _this.page = null;
                _this.textBlocks = [];
                _this.dynamicMaxHeight = 0;
                _this.maxWidth = 0;
                _this.x = 0;
                _this.y = 0;
                _this.maxWidth = maxWidth;
                return _this;
            }
            Line.prototype.isCapacityOf = function (textBlock) {
                if (!textBlock) {
                    return false;
                }
                //
                var posx = 0;
                var posy = 0;
                var lastTxtBlock = this.lastTextBlock();
                if (lastTxtBlock) {
                    posx = lastTxtBlock.x + lastTxtBlock.width;
                    posy = lastTxtBlock.y;
                }
                //
                if (posx + textBlock.width > this.maxWidth) {
                    return false; //宽度不够
                }
                //
                if (this.dynamicMaxHeight > 0) {
                    if (textBlock.height > this.dynamicMaxHeight || (textBlock.height / this.dynamicMaxHeight < 0.5)) {
                        return false; //如果有已经有动态高度，到这里，要么高度不够，要么小于动态高度的0.6差距, 就不填充
                    }
                }
                return true;
            };
            Line.prototype.lastTextBlock = function () {
                var textBlocks = this.textBlocks;
                if (textBlocks.length > 0) {
                    return textBlocks[textBlocks.length - 1];
                }
                return null;
            };
            Line.prototype.addTextBlock = function (textBlock, needCheck) {
                //
                if (!textBlock) {
                    return false;
                }
                //
                if (needCheck) {
                    if (!this.isCapacityOf(textBlock)) {
                        return false;
                    }
                }
                //
                var posx = 0;
                var posy = 0;
                var lastTxtBlock = this.lastTextBlock();
                if (lastTxtBlock) {
                    posx = lastTxtBlock.x + lastTxtBlock.width;
                    posy = lastTxtBlock.y;
                }
                //
                textBlock.x = posx;
                textBlock.y = posy;
                textBlock.line = this;
                this.textBlocks.push(textBlock);
                this.dynamicMaxHeight = Math.max(this.dynamicMaxHeight, textBlock.height);
                return true;
            };
            return Line;
        }(egret.HashObject));
        web.Line = Line;
        __reflect(Line.prototype, "egret.web.Line");
        var Page = /** @class */ (function (_super) {
            __extends(Page, _super);
            function Page(pageWidth, pageHeight) {
                var _this = _super.call(this) || this;
                _this.lines = [];
                _this.pageWidth = 0;
                _this.pageHeight = 0;
                _this.webGLTexture = null;
                _this.pageWidth = pageWidth;
                _this.pageHeight = pageHeight;
                return _this;
            }
            Page.prototype.addLine = function (line) {
                if (!line) {
                    return false;
                }
                //
                var posx = 0;
                var posy = 0;
                //
                var lines = this.lines;
                if (lines.length > 0) {
                    var lastLine = lines[lines.length - 1];
                    posx = lastLine.x;
                    posy = lastLine.y + lastLine.dynamicMaxHeight;
                }
                if (line.maxWidth > this.pageWidth) {
                    console.error('line.maxWidth = ' + line.maxWidth + ', ' + 'this.pageWidth = ' + this.pageWidth);
                    return false; //宽度不够
                }
                if (posy + line.dynamicMaxHeight > this.pageHeight) {
                    return false; //满了
                }
                //更新数据
                line.x = posx;
                line.y = posy;
                line.page = this;
                this.lines.push(line);
                return true;
            };
            return Page;
        }(egret.HashObject));
        web.Page = Page;
        __reflect(Page.prototype, "egret.web.Page");
        var Book = /** @class */ (function (_super) {
            __extends(Book, _super);
            function Book(maxSize, border) {
                var _this = _super.call(this) || this;
                _this._pages = [];
                _this._sortLines = [];
                _this._maxSize = 1024;
                _this._border = 1;
                _this._maxSize = maxSize;
                _this._border = border;
                return _this;
            }
            Book.prototype.addTextBlock = function (textBlock) {
                var result = this._addTextBlock(textBlock);
                if (!result) {
                    return false;
                }
                //更新下uv
                textBlock.updateUV();
                //没有才要添加
                var exist = false;
                var cast = result;
                var _sortLines = this._sortLines;
                for (var _i = 0, _sortLines_1 = _sortLines; _i < _sortLines_1.length; _i++) {
                    var line = _sortLines_1[_i];
                    if (line === cast[1]) {
                        exist = true;
                        break;
                    }
                }
                if (!exist) {
                    _sortLines.push(cast[1]);
                }
                //重新排序
                this.sort();
                return true;
            };
            Book.prototype._addTextBlock = function (textBlock) {
                if (!textBlock) {
                    return null;
                }
                if (textBlock.width > this._maxSize || textBlock.height > this._maxSize) {
                    //console.log('this._maxSize = ' + this._maxSize + ', textBlock.width = ' + textBlock.width + ', textBlock.height = ' + textBlock.height);
                    return null;
                }
                //找到最合适的
                var _sortLines = this._sortLines;
                for (var i = 0, length_11 = _sortLines.length; i < length_11; ++i) {
                    var line = _sortLines[i];
                    if (!line.isCapacityOf(textBlock)) {
                        continue;
                    }
                    if (line.addTextBlock(textBlock, false)) {
                        return [line.page, line];
                    }
                }
                //做新的行
                var newLine = new Line(this._maxSize);
                if (!newLine.addTextBlock(textBlock, true)) {
                    console.error('_addTextBlock !newLine.addTextBlock(textBlock, true)');
                    return null;
                }
                //现有的page中插入
                var _pages = this._pages;
                for (var i = 0, length_12 = _pages.length; i < length_12; ++i) {
                    var page = _pages[i];
                    if (page.addLine(newLine)) {
                        return [page, newLine];
                    }
                }
                //都没有，就做新的page
                //添加目标行
                var newPage = this.createPage(this._maxSize, this._maxSize);
                if (!newPage.addLine(newLine)) {
                    console.error('_addText newPage.addLine failed');
                    return null;
                }
                return [newPage, newLine];
            };
            Book.prototype.createPage = function (pageWidth, pageHeight) {
                var newPage = new Page(pageWidth, pageHeight);
                this._pages.push(newPage);
                return newPage;
            };
            Book.prototype.sort = function () {
                if (this._sortLines.length <= 1) {
                    return;
                }
                var sortFunc = function (a, b) {
                    return (a.dynamicMaxHeight < b.dynamicMaxHeight) ? -1 : 1;
                };
                this._sortLines = this._sortLines.sort(sortFunc);
            };
            Book.prototype.createTextBlock = function (tag, width, height, measureWidth, measureHeight, canvasWidthOffset, canvasHeightOffset, stroke2) {
                var txtBlock = new TextBlock(width, height, measureWidth, measureHeight, canvasWidthOffset, canvasHeightOffset, stroke2, this._border);
                if (!this.addTextBlock(txtBlock)) {
                    //走到这里几乎是不可能的，除非内存分配没了
                    //暂时还没有到提交纹理的地步，现在都是虚拟的
                    return null;
                }
                txtBlock.tag = tag;
                return txtBlock;
            };
            return Book;
        }(egret.HashObject));
        web.Book = Book;
        __reflect(Book.prototype, "egret.web.Book");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        //测试开关,打开会截住老的字体渲染
        web.textAtlasRenderEnable = false;
        //测试对象, 先不用singleton的，后续整理代码，就new一个，放在全局的context上做成员变量
        web.__textAtlasRender__ = null;
        //不想改TextNode的代码了，先用这种方式实现，以后稳了再改
        web.property_drawLabel = 'DrawLabel';
        //开启这个，用textAtlas渲染出来的，都是红字，而且加黑框
        var textAtlasDebug = false;
        //画一行
        var DrawLabel = /** @class */ (function (_super) {
            __extends(DrawLabel, _super);
            function DrawLabel() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                //记录初始位置
                _this.anchorX = 0;
                _this.anchorY = 0;
                //要画的字块
                _this.textBlocks = [];
                return _this;
            }
            //清除数据，回池
            DrawLabel.prototype.clear = function () {
                this.anchorX = 0;
                this.anchorY = 0;
                this.textBlocks.length = 0; //这个没事,实体在book里面存着
            };
            //池子创建
            DrawLabel.create = function () {
                var pool = DrawLabel.pool;
                if (pool.length === 0) {
                    pool.push(new DrawLabel);
                }
                return pool.pop();
            };
            //回池
            DrawLabel.back = function (drawLabel, checkRepeat) {
                if (!drawLabel) {
                    return;
                }
                var pool = DrawLabel.pool;
                if (checkRepeat && pool.indexOf(drawLabel) >= 0) {
                    console.error('DrawLabel.back repeat');
                    return;
                }
                drawLabel.clear();
                pool.push(drawLabel);
            };
            //池子，防止反复创建
            DrawLabel.pool = [];
            return DrawLabel;
        }(egret.HashObject));
        web.DrawLabel = DrawLabel;
        __reflect(DrawLabel.prototype, "egret.web.DrawLabel");
        //记录样式的
        var StyleInfo = /** @class */ (function (_super) {
            __extends(StyleInfo, _super);
            //
            function StyleInfo(textNode, format) {
                var _this = _super.call(this) || this;
                _this.format = null;
                //debug强制红色
                var saveTextColorForDebug = 0;
                if (textAtlasDebug) {
                    saveTextColorForDebug = textNode.textColor;
                    textNode.textColor = 0xff0000;
                }
                //存上
                _this.textColor = textNode.textColor;
                _this.strokeColor = textNode.strokeColor;
                _this.size = textNode.size;
                _this.stroke = textNode.stroke;
                _this.bold = textNode.bold;
                _this.italic = textNode.italic;
                _this.fontFamily = textNode.fontFamily;
                _this.format = format;
                _this.font = egret.getFontString(textNode, _this.format);
                //描述用于生成hashcode
                var textColor = (!format.textColor ? textNode.textColor : format.textColor);
                var strokeColor = (!format.strokeColor ? textNode.strokeColor : format.strokeColor);
                var stroke = (!format.stroke ? textNode.stroke : format.stroke);
                var size = (!format.size ? textNode.size : format.size);
                //
                _this.description = '' + _this.font + '-' + size;
                _this.description += '-' + egret.toColorString(textColor);
                _this.description += '-' + egret.toColorString(strokeColor);
                if (stroke) {
                    _this.description += '-' + stroke * 2;
                }
                //还原
                if (textAtlasDebug) {
                    textNode.textColor = saveTextColorForDebug;
                }
                return _this;
            }
            return StyleInfo;
        }(egret.HashObject));
        __reflect(StyleInfo.prototype, "StyleInfo");
        //测量字体和绘制的
        var CharImageRender = /** @class */ (function (_super) {
            __extends(CharImageRender, _super);
            function CharImageRender() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                //要渲染的字符串
                _this.char = '';
                //StyleInfo
                _this.styleInfo = null;
                //生成hashcode的字符串
                _this.hashCodeString = '';
                //字母：style设置行程唯一值
                _this.charWithStyleHashCode = 0;
                //测量实际的size
                _this.measureWidth = 0;
                _this.measureHeight = 0;
                //边缘放大之后的偏移
                _this.canvasWidthOffset = 0;
                _this.canvasHeightOffset = 0;
                //描边的记录
                _this.stroke2 = 0;
                return _this;
            }
            CharImageRender.prototype.reset = function (char, styleKey) {
                this.char = char;
                this.styleInfo = styleKey;
                this.hashCodeString = char + ':' + styleKey.description;
                this.charWithStyleHashCode = egret.NumberUtils.convertStringToHashCode(this.hashCodeString);
                this.canvasWidthOffset = 0;
                this.canvasHeightOffset = 0;
                this.stroke2 = 0;
                return this;
            };
            CharImageRender.prototype.measureAndDraw = function (targetCanvas) {
                var canvas = targetCanvas;
                if (!canvas) {
                    return;
                }
                //读取设置
                var text = this.char;
                var format = this.styleInfo.format;
                var textColor = (!format.textColor ? this.styleInfo.textColor : format.textColor);
                var strokeColor = (!format.strokeColor ? this.styleInfo.strokeColor : format.strokeColor);
                var stroke = (!format.stroke ? this.styleInfo.stroke : format.stroke);
                var size = (!format.size ? this.styleInfo.size : format.size);
                //开始测量---------------------------------------
                this.measureWidth = this.measure(text, this.styleInfo, size);
                this.measureHeight = size; //this.styleInfo.size;
                //调整 参考TextField: $getRenderBounds(): Rectangle {
                var canvasWidth = this.measureWidth;
                var canvasHeight = this.measureHeight;
                var _strokeDouble = stroke * 2;
                if (_strokeDouble > 0) {
                    canvasWidth += _strokeDouble * 2;
                    canvasHeight += _strokeDouble * 2;
                }
                this.stroke2 = _strokeDouble;
                //赋值
                canvas.width = canvasWidth = Math.ceil(canvasWidth) + 2 * 2;
                canvas.height = canvasHeight = Math.ceil(canvasHeight) + 2 * 2;
                this.canvasWidthOffset = (canvas.width - this.measureWidth) / 2;
                this.canvasHeightOffset = (canvas.height - this.measureHeight) / 2;
                //全部保留numberOfPrecision位小数
                var numberOfPrecision = 3;
                var precision = Math.pow(10, numberOfPrecision);
                this.canvasWidthOffset = Math.floor(this.canvasWidthOffset * precision) / precision;
                this.canvasHeightOffset = Math.floor(this.canvasHeightOffset * precision) / precision;
                //再开始绘制---------------------------------------
                var context = egret.sys.getContext2d(canvas);
                context.save();
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.lineJoin = 'round';
                context.font = this.styleInfo.font;
                context.fillStyle = egret.toColorString(textColor);
                context.strokeStyle = egret.toColorString(strokeColor);
                context.clearRect(0, 0, canvas.width, canvas.height);
                if (stroke) {
                    context.lineWidth = stroke * 2;
                    context.strokeText(text, canvas.width / 2, canvas.height / 2);
                }
                context.fillText(text, canvas.width / 2, canvas.height / 2);
                context.restore();
            };
            CharImageRender.prototype.measure = function (text, styleKey, textFlowSize) {
                var isChinese = CharImageRender.chineseCharactersRegExp.test(text);
                if (isChinese) {
                    if (CharImageRender.chineseCharacterMeasureFastMap[styleKey.font]) {
                        return CharImageRender.chineseCharacterMeasureFastMap[styleKey.font];
                    }
                }
                var measureTextWidth = egret.sys.measureText(text, styleKey.fontFamily, textFlowSize || styleKey.size, styleKey.bold, styleKey.italic);
                if (isChinese) {
                    CharImageRender.chineseCharacterMeasureFastMap[styleKey.font] = measureTextWidth;
                }
                return measureTextWidth;
            };
            //针对中文的加速查找
            CharImageRender.chineseCharactersRegExp = new RegExp("^[\u4E00-\u9FA5]$");
            CharImageRender.chineseCharacterMeasureFastMap = {};
            return CharImageRender;
        }(egret.HashObject));
        __reflect(CharImageRender.prototype, "CharImageRender");
        //对外的类
        var TextAtlasRender = /** @class */ (function (_super) {
            __extends(TextAtlasRender, _super);
            //
            function TextAtlasRender(webglRenderContext, maxSize, border) {
                var _this = _super.call(this) || this;
                _this.book = null;
                _this.charImageRender = new CharImageRender;
                _this.textBlockMap = {};
                _this._canvas = null;
                _this.textAtlasTextureCache = [];
                _this.webglRenderContext = null;
                _this.webglRenderContext = webglRenderContext;
                _this.book = new web.Book(maxSize, border);
                return _this;
            }
            //分析textNode，把数据提取出来，然后给textNode挂上渲染的信息
            TextAtlasRender.analysisTextNodeAndFlushDrawLabel = function (textNode) {
                if (!textNode) {
                    return;
                }
                if (!web.__textAtlasRender__) {
                    //创建，后续会转移给WebGLRenderContext
                    var webglcontext = egret.web.WebGLRenderContext.getInstance(0, 0);
                    //初期先512，因为不会大规模batch, 老项目最好不要直接使用这个，少数几个总变内容的TextField可以用，所以先不用$maxTextureSize
                    web.__textAtlasRender__ = new TextAtlasRender(webglcontext, textAtlasDebug ? 512 : 512 /*webglcontext.$maxTextureSize*/, textAtlasDebug ? 12 : 1);
                }
                //清除命令
                textNode[web.property_drawLabel] = textNode[web.property_drawLabel] || [];
                var drawLabels = textNode[web.property_drawLabel];
                for (var _i = 0, drawLabels_1 = drawLabels; _i < drawLabels_1.length; _i++) {
                    var drawLabel = drawLabels_1[_i];
                    //还回去
                    DrawLabel.back(drawLabel, false);
                }
                drawLabels.length = 0;
                //重新装填
                var offset = 4;
                var drawData = textNode.drawData;
                var anchorX = 0;
                var anchorY = 0;
                var labelString = '';
                var labelFormat = {};
                var resultAsRenderTextBlocks = [];
                for (var i = 0, length_13 = drawData.length; i < length_13; i += offset) {
                    anchorX = drawData[i + 0];
                    anchorY = drawData[i + 1];
                    labelString = drawData[i + 2];
                    labelFormat = drawData[i + 3] || {};
                    resultAsRenderTextBlocks.length = 0;
                    //提取数据
                    web.__textAtlasRender__.convertLabelStringToTextAtlas(labelString, new StyleInfo(textNode, labelFormat), resultAsRenderTextBlocks);
                    //pool创建 + 添加命令
                    var drawLabel = DrawLabel.create();
                    drawLabel.anchorX = anchorX;
                    drawLabel.anchorY = anchorY;
                    drawLabel.textBlocks = [].concat(resultAsRenderTextBlocks);
                    drawLabels.push(drawLabel);
                }
            };
            //字符串转化成为TextBlock
            TextAtlasRender.prototype.convertLabelStringToTextAtlas = function (labelstring, styleKey, resultAsRenderTextBlocks) {
                var canvas = this.canvas;
                var charImageRender = this.charImageRender;
                var textBlockMap = this.textBlockMap;
                for (var _i = 0, labelstring_1 = labelstring; _i < labelstring_1.length; _i++) {
                    var char = labelstring_1[_i];
                    //不反复创建
                    charImageRender.reset(char, styleKey);
                    if (textBlockMap[charImageRender.charWithStyleHashCode]) {
                        //检查重复
                        resultAsRenderTextBlocks.push(textBlockMap[charImageRender.charWithStyleHashCode]);
                        continue;
                    }
                    //画到到canvas
                    charImageRender.measureAndDraw(canvas);
                    //创建新的文字块
                    var txtBlock = this.book.createTextBlock(char, canvas.width, canvas.height, charImageRender.measureWidth, charImageRender.measureHeight, charImageRender.canvasWidthOffset, charImageRender.canvasHeightOffset, charImageRender.stroke2);
                    if (!txtBlock) {
                        continue;
                    }
                    //需要绘制
                    resultAsRenderTextBlocks.push(txtBlock);
                    //记录快速查找
                    textBlockMap[charImageRender.charWithStyleHashCode] = txtBlock;
                    //生成纹理
                    var page = txtBlock.page;
                    if (!page.webGLTexture) {
                        page.webGLTexture = this.createTextTextureAtlas(page.pageWidth, page.pageHeight, textAtlasDebug);
                    }
                    var gl = this.webglRenderContext.context;
                    page.webGLTexture[egret.glContext] = gl;
                    gl.bindTexture(gl.TEXTURE_2D, page.webGLTexture);
                    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
                    page.webGLTexture[egret.UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
                    gl.texSubImage2D(gl.TEXTURE_2D, 0, txtBlock.subImageOffsetX, txtBlock.subImageOffsetY, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
                    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
                }
            };
            //给一个page创建一个纹理
            TextAtlasRender.prototype.createTextTextureAtlas = function (width, height, debug) {
                var texture = null;
                if (debug) {
                    //做一个黑底子的，方便调试代码
                    var canvas = egret.sys.createCanvas(width, width);
                    var context = egret.sys.getContext2d(canvas);
                    context.fillStyle = 'black';
                    context.fillRect(0, 0, width, width);
                    texture = egret.sys.createTexture(this.webglRenderContext, canvas);
                }
                else {
                    //真的
                    texture = egret.sys._createTexture(this.webglRenderContext, width, height, null);
                }
                if (texture) {
                    //存起来，未来可以删除，或者查看
                    this.textAtlasTextureCache.push(texture);
                }
                return texture;
            };
            Object.defineProperty(TextAtlasRender.prototype, "canvas", {
                //给CharImageRender用的canvas
                get: function () {
                    if (!this._canvas) {
                        //就用默认体积24
                        this._canvas = egret.sys.createCanvas(24, 24);
                    }
                    return this._canvas;
                },
                enumerable: true,
                configurable: true
            });
            return TextAtlasRender;
        }(egret.HashObject));
        web.TextAtlasRender = TextAtlasRender;
        __reflect(TextAtlasRender.prototype, "egret.web.TextAtlasRender");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var EgretWebGLAttribute = /** @class */ (function () {
            function EgretWebGLAttribute(gl, program, attributeData) {
                this.gl = gl;
                this.name = attributeData.name;
                this.type = attributeData.type;
                this.size = attributeData.size;
                this.location = gl.getAttribLocation(program, this.name);
                this.count = 0;
                this.initCount(gl);
                this.format = gl.FLOAT;
                this.initFormat(gl);
            }
            EgretWebGLAttribute.prototype.initCount = function (gl) {
                var type = this.type;
                switch (type) {
                    case 5126 /* FLOAT */:
                    case 5120 /* BYTE */:
                    case 5121 /* UNSIGNED_BYTE */:
                    case 5123 /* UNSIGNED_SHORT */:
                        this.count = 1;
                        break;
                    case 35664 /* FLOAT_VEC2 */:
                        this.count = 2;
                        break;
                    case 35665 /* FLOAT_VEC3 */:
                        this.count = 3;
                        break;
                    case 35666 /* FLOAT_VEC4 */:
                        this.count = 4;
                        break;
                }
            };
            EgretWebGLAttribute.prototype.initFormat = function (gl) {
                var type = this.type;
                switch (type) {
                    case 5126 /* FLOAT */:
                    case 35664 /* FLOAT_VEC2 */:
                    case 35665 /* FLOAT_VEC3 */:
                    case 35666 /* FLOAT_VEC4 */:
                        this.format = gl.FLOAT;
                        break;
                    case 5121 /* UNSIGNED_BYTE */:
                        this.format = gl.UNSIGNED_BYTE;
                        break;
                    case 5123 /* UNSIGNED_SHORT */:
                        this.format = gl.UNSIGNED_SHORT;
                        break;
                    case 5120 /* BYTE */:
                        this.format = gl.BYTE;
                        break;
                }
            };
            return EgretWebGLAttribute;
        }());
        web.EgretWebGLAttribute = EgretWebGLAttribute;
        __reflect(EgretWebGLAttribute.prototype, "egret.web.EgretWebGLAttribute");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        function loadShader(gl, type, source) {
            var shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!compiled) {
                console.log("shader not compiled!");
                console.log(gl.getShaderInfoLog(shader));
            }
            return shader;
        }
        function createWebGLProgram(gl, vertexShader, fragmentShader) {
            var program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            return program;
        }
        function extractAttributes(gl, program) {
            var attributes = {};
            var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
            for (var i = 0; i < totalAttributes; i++) {
                var attribData = gl.getActiveAttrib(program, i);
                var name_2 = attribData.name;
                var attribute = new web.EgretWebGLAttribute(gl, program, attribData);
                attributes[name_2] = attribute;
            }
            return attributes;
        }
        function extractUniforms(gl, program) {
            var uniforms = {};
            var totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
            for (var i = 0; i < totalUniforms; i++) {
                var uniformData = gl.getActiveUniform(program, i);
                var name_3 = uniformData.name;
                var uniform = new web.EgretWebGLUniform(gl, program, uniformData);
                uniforms[name_3] = uniform;
            }
            return uniforms;
        }
        /**
         * @private
         */
        var EgretWebGLProgram = /** @class */ (function () {
            function EgretWebGLProgram(gl, vertSource, fragSource) {
                this.vshaderSource = vertSource;
                this.fshaderSource = fragSource;
                this.vertexShader = loadShader(gl, gl.VERTEX_SHADER, this.vshaderSource);
                this.fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, this.fshaderSource);
                this.id = createWebGLProgram(gl, this.vertexShader, this.fragmentShader);
                this.uniforms = extractUniforms(gl, this.id);
                this.attributes = extractAttributes(gl, this.id);
            }
            /**
             * 获取所需的WebGL Program
             * @param key {string} 对于唯一的program程序，对应唯一的key
             */
            EgretWebGLProgram.getProgram = function (gl, vertSource, fragSource, key) {
                if (!this.programCache[key]) {
                    this.programCache[key] = new EgretWebGLProgram(gl, vertSource, fragSource);
                }
                return this.programCache[key];
            };
            EgretWebGLProgram.deleteProgram = function (gl, vertSource, fragSource, key) {
                // TODO delete
            };
            EgretWebGLProgram.programCache = {};
            return EgretWebGLProgram;
        }());
        web.EgretWebGLProgram = EgretWebGLProgram;
        __reflect(EgretWebGLProgram.prototype, "egret.web.EgretWebGLProgram");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var EgretWebGLUniform = /** @class */ (function () {
            function EgretWebGLUniform(gl, program, uniformData) {
                this.gl = gl;
                this.name = uniformData.name;
                this.type = uniformData.type;
                this.size = uniformData.size;
                this.location = gl.getUniformLocation(program, this.name);
                this.setDefaultValue();
                this.generateSetValue();
                this.generateUpload();
            }
            EgretWebGLUniform.prototype.setDefaultValue = function () {
                var type = this.type;
                switch (type) {
                    case 5126 /* FLOAT */:
                    case 35678 /* SAMPLER_2D */:
                    case 35680 /* SAMPLER_CUBE */:
                    case 35670 /* BOOL */:
                    case 5124 /* INT */:
                        this.value = 0;
                        break;
                    case 35664 /* FLOAT_VEC2 */:
                    case 35671 /* BOOL_VEC2 */:
                    case 35667 /* INT_VEC2 */:
                        this.value = [0, 0];
                        break;
                    case 35665 /* FLOAT_VEC3 */:
                    case 35672 /* BOOL_VEC3 */:
                    case 35668 /* INT_VEC3 */:
                        this.value = [0, 0, 0];
                        break;
                    case 35666 /* FLOAT_VEC4 */:
                    case 35673 /* BOOL_VEC4 */:
                    case 35669 /* INT_VEC4 */:
                        this.value = [0, 0, 0, 0];
                        break;
                    case 35674 /* FLOAT_MAT2 */:
                        this.value = new Float32Array([
                            1, 0,
                            0, 1
                        ]);
                        break;
                    case 35675 /* FLOAT_MAT3 */:
                        this.value = new Float32Array([
                            1, 0, 0,
                            0, 1, 0,
                            0, 0, 1
                        ]);
                        break;
                    case 35676 /* FLOAT_MAT4 */:
                        this.value = new Float32Array([
                            1, 0, 0, 0,
                            0, 1, 0, 0,
                            0, 0, 1, 0,
                            0, 0, 0, 1
                        ]);
                        break;
                }
            };
            EgretWebGLUniform.prototype.generateSetValue = function () {
                var type = this.type;
                switch (type) {
                    case 5126 /* FLOAT */:
                    case 35678 /* SAMPLER_2D */:
                    case 35680 /* SAMPLER_CUBE */:
                    case 35670 /* BOOL */:
                    case 5124 /* INT */:
                        this.setValue = function (value) {
                            var notEqual = this.value !== value;
                            this.value = value;
                            notEqual && this.upload();
                        };
                        break;
                    case 35664 /* FLOAT_VEC2 */:
                    case 35671 /* BOOL_VEC2 */:
                    case 35667 /* INT_VEC2 */:
                        this.setValue = function (value) {
                            var notEqual = this.value[0] !== value.x || this.value[1] !== value.y;
                            this.value[0] = value.x;
                            this.value[1] = value.y;
                            notEqual && this.upload();
                        };
                        break;
                    case 35665 /* FLOAT_VEC3 */:
                    case 35672 /* BOOL_VEC3 */:
                    case 35668 /* INT_VEC3 */:
                        this.setValue = function (value) {
                            this.value[0] = value.x;
                            this.value[1] = value.y;
                            this.value[2] = value.z;
                            this.upload();
                        };
                        break;
                    case 35666 /* FLOAT_VEC4 */:
                    case 35673 /* BOOL_VEC4 */:
                    case 35669 /* INT_VEC4 */:
                        this.setValue = function (value) {
                            this.value[0] = value.x;
                            this.value[1] = value.y;
                            this.value[2] = value.z;
                            this.value[3] = value.w;
                            this.upload();
                        };
                        break;
                    case 35674 /* FLOAT_MAT2 */:
                    case 35675 /* FLOAT_MAT3 */:
                    case 35676 /* FLOAT_MAT4 */:
                        this.setValue = function (value) {
                            this.value.set(value);
                            this.upload();
                        };
                        break;
                }
            };
            EgretWebGLUniform.prototype.generateUpload = function () {
                var gl = this.gl;
                var type = this.type;
                var location = this.location;
                switch (type) {
                    case 5126 /* FLOAT */:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform1f(location, value);
                        };
                        break;
                    case 35664 /* FLOAT_VEC2 */:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform2f(location, value[0], value[1]);
                        };
                        break;
                    case 35665 /* FLOAT_VEC3 */:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform3f(location, value[0], value[1], value[2]);
                        };
                        break;
                    case 35666 /* FLOAT_VEC4 */:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                        };
                        break;
                    case 35678 /* SAMPLER_2D */:
                    case 35680 /* SAMPLER_CUBE */:
                    case 35670 /* BOOL */:
                    case 5124 /* INT */:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform1i(location, value);
                        };
                        break;
                    case 35671 /* BOOL_VEC2 */:
                    case 35667 /* INT_VEC2 */:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform2i(location, value[0], value[1]);
                        };
                        break;
                    case 35672 /* BOOL_VEC3 */:
                    case 35668 /* INT_VEC3 */:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform3i(location, value[0], value[1], value[2]);
                        };
                        break;
                    case 35673 /* BOOL_VEC4 */:
                    case 35669 /* INT_VEC4 */:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform4i(location, value[0], value[1], value[2], value[3]);
                        };
                        break;
                    case 35674 /* FLOAT_MAT2 */:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniformMatrix2fv(location, false, value);
                        };
                        break;
                    case 35675 /* FLOAT_MAT3 */:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniformMatrix3fv(location, false, value);
                        };
                        break;
                    case 35676 /* FLOAT_MAT4 */:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniformMatrix4fv(location, false, value);
                        };
                        break;
                }
            };
            return EgretWebGLUniform;
        }());
        web.EgretWebGLUniform = EgretWebGLUniform;
        __reflect(EgretWebGLUniform.prototype, "egret.web.EgretWebGLUniform");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        var EgretShaderLib = /** @class */ (function () {
            function EgretShaderLib() {
            }
            EgretShaderLib.blur_frag = "precision mediump float;\r\nuniform vec2 blur;\r\nuniform sampler2D uSampler;\r\nvarying vec2 vTextureCoord;\r\nuniform vec2 uTextureSize;\r\nvoid main()\r\n{\r\n    const int sampleRadius = 5;\r\n    const int samples = sampleRadius * 2 + 1;\r\n    vec2 blurUv = blur / uTextureSize;\r\n    vec4 color = vec4(0, 0, 0, 0);\r\n    vec2 uv = vec2(0.0, 0.0);\r\n    blurUv /= float(sampleRadius);\r\n\r\n    for (int i = -sampleRadius; i <= sampleRadius; i++) {\r\n        uv.x = vTextureCoord.x + float(i) * blurUv.x;\r\n        uv.y = vTextureCoord.y + float(i) * blurUv.y;\r\n        color += texture2D(uSampler, uv);\r\n    }\r\n\r\n    color /= float(samples);\r\n    gl_FragColor = color;\r\n}";
            EgretShaderLib.colorTransform_frag = "precision mediump float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\nuniform mat4 matrix;\r\nuniform vec4 colorAdd;\r\nuniform sampler2D uSampler;\r\n\r\nvoid main(void) {\r\n    vec4 texColor = texture2D(uSampler, vTextureCoord);\r\n    if(texColor.a > 0.) {\r\n        // 抵消预乘的alpha通道\r\n        texColor = vec4(texColor.rgb / texColor.a, texColor.a);\r\n    }\r\n    vec4 locColor = clamp(texColor * matrix + colorAdd, 0., 1.);\r\n    gl_FragColor = vColor * vec4(locColor.rgb * locColor.a, locColor.a);\r\n}";
            EgretShaderLib.default_vert = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\nattribute vec4 aColor;\r\n\r\nuniform vec2 projectionVector;\r\n// uniform vec2 offsetVector;\r\n\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\n\r\nconst vec2 center = vec2(-1.0, 1.0);\r\n\r\nvoid main(void) {\r\n   gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);\r\n   vTextureCoord = aTextureCoord;\r\n   vColor = aColor;\r\n}";
            EgretShaderLib.glow_frag = "precision highp float;\r\nvarying vec2 vTextureCoord;\r\n\r\nuniform sampler2D uSampler;\r\n\r\nuniform float dist;\r\nuniform float angle;\r\nuniform vec4 color;\r\nuniform float alpha;\r\nuniform float blurX;\r\nuniform float blurY;\r\n// uniform vec4 quality;\r\nuniform float strength;\r\nuniform float inner;\r\nuniform float knockout;\r\nuniform float hideObject;\r\n\r\nuniform vec2 uTextureSize;\r\n\r\nfloat random(vec2 scale)\r\n{\r\n    return fract(sin(dot(gl_FragCoord.xy, scale)) * 43758.5453);\r\n}\r\n\r\nvoid main(void) {\r\n    vec2 px = vec2(1.0 / uTextureSize.x, 1.0 / uTextureSize.y);\r\n    // TODO 自动调节采样次数？\r\n    const float linearSamplingTimes = 7.0;\r\n    const float circleSamplingTimes = 12.0;\r\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\r\n    vec4 curColor;\r\n    float totalAlpha = 0.0;\r\n    float maxTotalAlpha = 0.0;\r\n    float curDistanceX = 0.0;\r\n    float curDistanceY = 0.0;\r\n    float offsetX = dist * cos(angle) * px.x;\r\n    float offsetY = dist * sin(angle) * px.y;\r\n\r\n    const float PI = 3.14159265358979323846264;\r\n    float cosAngle;\r\n    float sinAngle;\r\n    float offset = PI * 2.0 / circleSamplingTimes * random(vec2(12.9898, 78.233));\r\n    float stepX = blurX * px.x / linearSamplingTimes;\r\n    float stepY = blurY * px.y / linearSamplingTimes;\r\n    for (float a = 0.0; a <= PI * 2.0; a += PI * 2.0 / circleSamplingTimes) {\r\n        cosAngle = cos(a + offset);\r\n        sinAngle = sin(a + offset);\r\n        for (float i = 1.0; i <= linearSamplingTimes; i++) {\r\n            curDistanceX = i * stepX * cosAngle;\r\n            curDistanceY = i * stepY * sinAngle;\r\n            if (vTextureCoord.x + curDistanceX - offsetX >= 0.0 && vTextureCoord.y + curDistanceY + offsetY <= 1.0){\r\n                curColor = texture2D(uSampler, vec2(vTextureCoord.x + curDistanceX - offsetX, vTextureCoord.y + curDistanceY + offsetY));\r\n                totalAlpha += (linearSamplingTimes - i) * curColor.a;\r\n            }\r\n            maxTotalAlpha += (linearSamplingTimes - i);\r\n        }\r\n    }\r\n\r\n    ownColor.a = max(ownColor.a, 0.0001);\r\n    ownColor.rgb = ownColor.rgb / ownColor.a;\r\n\r\n    float outerGlowAlpha = (totalAlpha / maxTotalAlpha) * strength * alpha * (1. - inner) * max(min(hideObject, knockout), 1. - ownColor.a);\r\n    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * strength * alpha * inner * ownColor.a;\r\n\r\n    ownColor.a = max(ownColor.a * knockout * (1. - hideObject), 0.0001);\r\n    vec3 mix1 = mix(ownColor.rgb, color.rgb, innerGlowAlpha / (innerGlowAlpha + ownColor.a));\r\n    vec3 mix2 = mix(mix1, color.rgb, outerGlowAlpha / (innerGlowAlpha + ownColor.a + outerGlowAlpha));\r\n    float resultAlpha = min(ownColor.a + outerGlowAlpha + innerGlowAlpha, 1.);\r\n    gl_FragColor = vec4(mix2 * resultAlpha, resultAlpha);\r\n}";
            EgretShaderLib.primitive_frag = "precision lowp float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\n\r\nvoid main(void) {\r\n    gl_FragColor = vColor;\r\n}";
            EgretShaderLib.texture_frag = "precision lowp float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\nuniform sampler2D uSampler;\r\n\r\nvoid main(void) {\r\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;\r\n}";
            /*
            "precision lowp float;
            varying vec2 vTextureCoord;
            varying vec4 vColor;
            uniform sampler2D uSampler;
            uniform sampler2D uSamplerAlphaMask;
            void main(void) {
                float alpha = texture2D(uSamplerAlphaMask, vTextureCoord).r;
                if (alpha < 0.0039) { discard; }
                vec4 v4Color = texture2D(uSampler, vTextureCoord);
                v4Color.rgb = v4Color.rgb * alpha;
                v4Color.a = alpha;
                gl_FragColor = v4Color * vColor;
            }"
            */
            EgretShaderLib.texture_etc_alphamask_frag = "precision lowp float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\nuniform sampler2D uSampler;\r\nuniform sampler2D uSamplerAlphaMask;\r\nvoid main(void) {\r\nfloat alpha = texture2D(uSamplerAlphaMask, vTextureCoord).r;\r\nif (alpha < 0.0039) { discard; }\r\nvec4 v4Color = texture2D(uSampler, vTextureCoord);\r\nv4Color.rgb = v4Color.rgb * alpha;\r\nv4Color.a = alpha;\r\ngl_FragColor = v4Color * vColor;\r\n}";
            /*
            "precision mediump float;
            varying vec2 vTextureCoord;
            varying vec4 vColor;
            uniform mat4 matrix;
            uniform vec4 colorAdd;
            uniform sampler2D uSampler;
            uniform sampler2D uSamplerAlphaMask;
    
            void main(void){
                float alpha = texture2D(uSamplerAlphaMask, vTextureCoord).r;
                if (alpha < 0.0039) { discard; }
                vec4 texColor = texture2D(uSampler, vTextureCoord);
                if(texColor.a > 0.0) {
                    // 抵消预乘的alpha通道
                    texColor = vec4(texColor.rgb / texColor.a, texColor.a);
                }
                vec4 v4Color = clamp(texColor * matrix + colorAdd, 0.0, 1.0);
                v4Color.rgb = v4Color.rgb * alpha;
                v4Color.a = alpha;
                gl_FragColor = v4Color * vColor;
            }"
            */
            EgretShaderLib.colorTransform_frag_etc_alphamask_frag = "precision mediump float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\nuniform mat4 matrix;\r\nuniform vec4 colorAdd;\r\nuniform sampler2D uSampler;\r\nuniform sampler2D uSamplerAlphaMask;\r\n\r\nvoid main(void){\r\nfloat alpha = texture2D(uSamplerAlphaMask, vTextureCoord).r;\r\nif (alpha < 0.0039) { discard; }\r\nvec4 texColor = texture2D(uSampler, vTextureCoord);\r\nif(texColor.a > 0.0) {\r\n // 抵消预乘的alpha通道\r\ntexColor = vec4(texColor.rgb / texColor.a, texColor.a);\r\n}\r\nvec4 v4Color = clamp(texColor * matrix + colorAdd, 0.0, 1.0);\r\nv4Color.rgb = v4Color.rgb * alpha;\r\nv4Color.a = alpha;\r\ngl_FragColor = v4Color * vColor;\r\n}";
            return EgretShaderLib;
        }());
        web.EgretShaderLib = EgretShaderLib;
        __reflect(EgretShaderLib.prototype, "egret.web.EgretShaderLib");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
;
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * 渲染缓冲区对象池
         */
        web.gpuRenderBufferPool = [];
        /**
         * @private
         * WebGPU渲染缓存
         * 对标WebGLRenderBuffer，管理渲染目标、矩阵变换、stencil/scissor状态
         */
        var WebGPURenderBuffer = /** @class */ (function (_super) {
            __extends(WebGPURenderBuffer, _super);
            function WebGPURenderBuffer(width, height, root) {
                var _this = _super.call(this) || this;
                /**
                 * 当前绑定的纹理
                 */
                _this.currentTexture = null;
                _this.globalAlpha = 1;
                _this.globalTintColor = 0xFFFFFF;
                // ===== stencil state =====
                _this.stencilState = false;
                _this.$stencilList = [];
                _this.stencilHandleCount = 0;
                // ===== scissor state =====
                _this.$scissorState = false;
                _this.scissorRect = new egret.Rectangle();
                _this.$hasScissor = false;
                // ===== draw call 统计 =====
                _this.$drawCalls = 0;
                _this.$computeDrawCall = false;
                // ===== 变换矩阵 =====
                _this.globalMatrix = new egret.Matrix();
                _this.savedGlobalMatrix = new egret.Matrix();
                _this.$offsetX = 0;
                _this.$offsetY = 0;
                _this.context = web.WebGPURenderContext.getInstance(width, height);
                // 创建渲染目标
                _this.rootRenderTarget = new web.WebGPURenderTarget(3, 3);
                if (width && height) {
                    _this.resize(width, height);
                }
                _this.root = !!root;
                if (_this.root) {
                    _this.rootRenderTarget.useFrameBuffer = false;
                    _this.context.pushBuffer(_this);
                    _this.surface = _this.context.surface;
                    _this.$computeDrawCall = true;
                }
                else {
                    _this.rootRenderTarget.initFrameBuffer();
                    _this.surface = _this.rootRenderTarget;
                }
                return _this;
            }
            WebGPURenderBuffer.prototype.enableStencil = function () {
                if (!this.stencilState) {
                    this.context.enableStencilTest();
                    this.stencilState = true;
                }
            };
            WebGPURenderBuffer.prototype.disableStencil = function () {
                if (this.stencilState) {
                    this.context.disableStencilTest();
                    this.stencilState = false;
                }
            };
            WebGPURenderBuffer.prototype.restoreStencil = function () {
                if (this.stencilState) {
                    this.context.enableStencilTest();
                }
                else {
                    this.context.disableStencilTest();
                }
            };
            /**
             * 重置stencil和scissor状态（用于对象池回收后重用）
             */
            WebGPURenderBuffer.prototype.resetStencilScissorState = function () {
                this.stencilState = false;
                this.stencilHandleCount = 0;
                this.$stencilList.length = 0;
                this.$hasScissor = false;
                this.$scissorState = false;
            };
            WebGPURenderBuffer.prototype.enableScissor = function (x, y, width, height) {
                if (!this.$scissorState) {
                    this.$scissorState = true;
                    this.scissorRect.setTo(x, y, width, height);
                    this.context.enableScissorTest(this.scissorRect);
                }
            };
            WebGPURenderBuffer.prototype.disableScissor = function () {
                if (this.$scissorState) {
                    this.$scissorState = false;
                    this.scissorRect.setEmpty();
                    this.context.disableScissorTest();
                }
            };
            WebGPURenderBuffer.prototype.restoreScissor = function () {
                if (this.$scissorState) {
                    this.context.enableScissorTest(this.scissorRect);
                }
                else {
                    this.context.disableScissorTest();
                }
            };
            Object.defineProperty(WebGPURenderBuffer.prototype, "width", {
                // ===== 宽高 =====
                get: function () {
                    return this.rootRenderTarget.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebGPURenderBuffer.prototype, "height", {
                get: function () {
                    return this.rootRenderTarget.height;
                },
                enumerable: true,
                configurable: true
            });
            // ===== resize =====
            WebGPURenderBuffer.prototype.resize = function (width, height, useMaxSize) {
                width = width || 1;
                height = height || 1;
                this.context.pushBuffer(this);
                if (width != this.rootRenderTarget.width || height != this.rootRenderTarget.height) {
                    this.context.drawCmdManager.pushResize(this, width, height);
                    // 重要修复：调用 rootRenderTarget.resize() 而不是直接修改宽高
                    // 这样才能正确销毁和重建纹理
                    this.rootRenderTarget.resize(width, height);
                }
                if (this.root) {
                    this.context.resize(width, height, useMaxSize);
                }
                this.context.clear();
                this.context.popBuffer();
            };
            // ===== getPixels =====
            WebGPURenderBuffer.prototype.getPixels = function (x, y, width, height) {
                if (width === void 0) { width = 1; }
                if (height === void 0) { height = 1; }
                // WebGPU的像素读取是异步的
                // 为保持接口兼容，使用canvas 2D回读
                try {
                    if (this.root) {
                        // root buffer: 直接从主canvas读取
                        var canvas2d = document.createElement('canvas');
                        canvas2d.width = this.width;
                        canvas2d.height = this.height;
                        var ctx2d = canvas2d.getContext('2d');
                        if (ctx2d) {
                            ctx2d.drawImage(this.context.surface, 0, 0);
                            var imageData = ctx2d.getImageData(x, y, width, height);
                            // 反预乘alpha + Y翻转（和WebGL版保持一致）
                            var pixels = imageData.data;
                            var result = new Uint8Array(4 * width * height);
                            for (var i = 0; i < height; i++) {
                                for (var j = 0; j < width; j++) {
                                    var index1 = (width * (height - i - 1) + j) * 4;
                                    var index2 = (width * i + j) * 4;
                                    var a = pixels[index2 + 3];
                                    if (a > 0) {
                                        result[index1] = Math.round(pixels[index2] / a * 255);
                                        result[index1 + 1] = Math.round(pixels[index2 + 1] / a * 255);
                                        result[index1 + 2] = Math.round(pixels[index2 + 2] / a * 255);
                                    }
                                    else {
                                        result[index1] = 0;
                                        result[index1 + 1] = 0;
                                        result[index1 + 2] = 0;
                                    }
                                    result[index1 + 3] = a;
                                }
                            }
                            return result;
                        }
                    }
                    else {
                        // 非root buffer:
                        // WebGPU不支持同步readback，但hit test只需要很小的区域
                        // 对于非root buffer，$drawWebGPU之后离屏纹理有内容，
                        // 但我们无法同步读回。返回非空数组以避免hit test误判。
                        // 实际像素数据在大多数场景下不会被直接使用（hitTest通过canvasHitTestBuffer走canvas2d路径）
                        return [];
                    }
                }
                catch (e) {
                    console.error('Failed to getPixels:', e);
                }
                return [];
            };
            // ===== toDataURL =====
            WebGPURenderBuffer.prototype.toDataURL = function (type, encoderOptions) {
                return this.context.surface.toDataURL(type, encoderOptions);
            };
            // ===== destroy =====
            WebGPURenderBuffer.prototype.destroy = function () {
                if (this.root) {
                    this.context.destroy();
                }
                else {
                    this.rootRenderTarget.dispose();
                }
            };
            WebGPURenderBuffer.prototype.onRenderFinish = function () {
                this.$drawCalls = 0;
            };
            // ===== clear =====
            WebGPURenderBuffer.prototype.clear = function () {
                this.context.pushBuffer(this);
                this.context.clear();
                this.context.popBuffer();
            };
            WebGPURenderBuffer.prototype.setTransform = function (a, b, c, d, tx, ty) {
                var matrix = this.globalMatrix;
                matrix.a = a;
                matrix.b = b;
                matrix.c = c;
                matrix.d = d;
                matrix.tx = tx;
                matrix.ty = ty;
            };
            WebGPURenderBuffer.prototype.transform = function (a, b, c, d, tx, ty) {
                var matrix = this.globalMatrix;
                var a1 = matrix.a;
                var b1 = matrix.b;
                var c1 = matrix.c;
                var d1 = matrix.d;
                if (a != 1 || b != 0 || c != 0 || d != 1) {
                    matrix.a = a * a1 + b * c1;
                    matrix.b = a * b1 + b * d1;
                    matrix.c = c * a1 + d * c1;
                    matrix.d = c * b1 + d * d1;
                }
                matrix.tx = tx * a1 + ty * c1 + matrix.tx;
                matrix.ty = tx * b1 + ty * d1 + matrix.ty;
            };
            WebGPURenderBuffer.prototype.useOffset = function () {
                var self = this;
                if (self.$offsetX != 0 || self.$offsetY != 0) {
                    self.globalMatrix.append(1, 0, 0, 1, self.$offsetX, self.$offsetY);
                    self.$offsetX = self.$offsetY = 0;
                }
            };
            WebGPURenderBuffer.prototype.saveTransform = function () {
                var matrix = this.globalMatrix;
                var sMatrix = this.savedGlobalMatrix;
                sMatrix.a = matrix.a;
                sMatrix.b = matrix.b;
                sMatrix.c = matrix.c;
                sMatrix.d = matrix.d;
                sMatrix.tx = matrix.tx;
                sMatrix.ty = matrix.ty;
            };
            WebGPURenderBuffer.prototype.restoreTransform = function () {
                var matrix = this.globalMatrix;
                var sMatrix = this.savedGlobalMatrix;
                matrix.a = sMatrix.a;
                matrix.b = sMatrix.b;
                matrix.c = sMatrix.c;
                matrix.d = sMatrix.d;
                matrix.tx = sMatrix.tx;
                matrix.ty = sMatrix.ty;
            };
            // ===== 对象池 =====
            WebGPURenderBuffer.create = function (width, height) {
                var buffer = web.gpuRenderBufferPool.pop();
                if (buffer) {
                    buffer.resize(width, height);
                    var matrix = buffer.globalMatrix;
                    matrix.a = 1;
                    matrix.b = 0;
                    matrix.c = 0;
                    matrix.d = 1;
                    matrix.tx = 0;
                    matrix.ty = 0;
                    buffer.globalAlpha = 1;
                    buffer.$offsetX = 0;
                    buffer.$offsetY = 0;
                    // 重置stencil/scissor状态
                    buffer.resetStencilScissorState();
                    buffer.currentTexture = null;
                }
                else {
                    buffer = new WebGPURenderBuffer(width, height);
                    buffer.$computeDrawCall = false;
                }
                return buffer;
            };
            WebGPURenderBuffer.release = function (buffer) {
                web.gpuRenderBufferPool.push(buffer);
            };
            WebGPURenderBuffer.autoClear = true;
            return WebGPURenderBuffer;
        }(egret.HashObject));
        web.WebGPURenderBuffer = WebGPURenderBuffer;
        __reflect(WebGPURenderBuffer.prototype, "egret.web.WebGPURenderBuffer", ["egret.sys.RenderBuffer"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * WebGPU上下文对象，提供简单的绘图接口
         * 对标WebGLRenderContext —— 共用单例，管理绘制命令、纹理、管线、顶点缓冲
         */
        var WebGPURenderContext = /** @class */ (function () {
            function WebGPURenderContext(width, height) {
                // ===== GPU 核心对象 =====
                this.device = null;
                this.canvasContext = null;
                this.preferredFormat = 'bgra8unorm';
                this.contextLost = false;
                // ===== 投影 =====
                this.projectionX = NaN;
                this.projectionY = NaN;
                this.$maxTextureSize = 4096;
                // ===== GPU缓冲 =====
                this.vertexGPUBuffer = null;
                this.indexGPUBuffer = null;
                this.uniformBuffer = null;
                // ===== 滤镜专用uniform缓冲 =====
                this.filterUniformBuffer = null;
                // ===== 管线与着色器 =====
                this.pipelineCache = {};
                this.shaderModuleCache = {};
                this.samplerCache = {};
                this.bindGroupLayoutCache = {};
                this.pipelineLayoutCache = {};
                // ===== 纹理管理 =====
                this.textureViewCache = new Map();
                this._defaultEmptyTexture = null;
                this._defaultEmptyTextureView = null;
                // ===== BindGroup缓存（减少每帧GC压力）=====
                this._primitiveBindGroup = null;
                this._textureBindGroupCache = new Map();
                this._bindGroupCacheFrameId = 0;
                this._currentFrameId = 0;
                // ===== 当前滤镜 =====
                this.$filter = null;
                // ===== 当前混合模式 =====
                this.currentBlendMode = "source-over";
                // ===== 初始化状态 =====
                this._initialized = false;
                this._initPromise = null;
                // ===================== 顶点缓冲布局 =====================
                this.vertexBufferLayout = {
                    arrayStride: 20,
                    attributes: [
                        { shaderLocation: 0, offset: 0, format: 'float32x2' },
                        { shaderLocation: 1, offset: 8, format: 'float32x2' },
                        { shaderLocation: 2, offset: 16, format: 'unorm8x4' }, // color (RGBA packed)
                    ]
                };
                // ===================== depthStencil描述 =====================
                this.depthStencilState = {
                    format: 'depth24plus-stencil8',
                    depthWriteEnabled: false,
                    depthCompare: 'always',
                    stencilFront: {
                        compare: 'always',
                        failOp: 'keep',
                        depthFailOp: 'keep',
                        passOp: 'keep',
                    },
                    stencilBack: {
                        compare: 'always',
                        failOp: 'keep',
                        depthFailOp: 'keep',
                        passOp: 'keep',
                    },
                };
                this.$scissorState = false;
                /**
                 * 待销毁的纹理队列（延迟销毁以避免WebGPU错误）
                 */
                this.texturesToDestroy = [];
                this.surface = egret.sys.mainCanvas(width, height);
                this.$bufferStack = [];
                this.drawCmdManager = new web.WebGPUDrawCmdManager();
                this.vao = new web.WebGPUVertexArrayObject();
                this.setGlobalCompositeOperation("source-over");
                // 启动异步初始化
                this._initPromise = this.initWebGPU();
            }
            WebGPURenderContext.getInstance = function (width, height) {
                if (this.instance) {
                    return this.instance;
                }
                this.instance = new WebGPURenderContext(width, height);
                return this.instance;
            };
            // ===================== 初始化 =====================
            WebGPURenderContext.prototype.initWebGPU = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var adapter, _a, e_1;
                    var _this = this;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 3, , 4]);
                                if (!navigator.gpu) {
                                    throw new Error('WebGPU not supported');
                                }
                                return [4 /*yield*/, navigator.gpu.requestAdapter({
                                        powerPreference: 'high-performance'
                                    })];
                            case 1:
                                adapter = _b.sent();
                                if (!adapter) {
                                    throw new Error('No appropriate WebGPU adapter found');
                                }
                                _a = this;
                                return [4 /*yield*/, adapter.requestDevice()];
                            case 2:
                                _a.device = _b.sent();
                                if (!this.device) {
                                    throw new Error('Failed to create WebGPU device');
                                }
                                // 设备丢失处理
                                this.device.lost.then(function (info) {
                                    console.error('WebGPU device lost:', info.message, 'reason:', info.reason);
                                    _this.contextLost = true;
                                    _this._initialized = false;
                                    // 如果不是主动销毁，尝试恢复
                                    if (info.reason !== 'destroyed') {
                                        console.log('Attempting WebGPU device recovery...');
                                        _this._initPromise = _this.initWebGPU();
                                    }
                                });
                                // 获取canvas上下文
                                this.canvasContext = this.surface.getContext('webgpu');
                                this.preferredFormat = navigator.gpu.getPreferredCanvasFormat();
                                this.canvasContext.configure({
                                    device: this.device,
                                    format: this.preferredFormat,
                                    alphaMode: 'premultiplied',
                                });
                                this.$maxTextureSize = this.device.limits.maxTextureDimension2D || 4096;
                                // 创建GPU缓冲
                                this.createGPUBuffers();
                                // 创建着色器模块
                                this.createShaderModules();
                                // 创建采样器
                                this.createSamplers();
                                // 创建管线布局
                                this.createBindGroupLayouts();
                                // 创建默认管线（含stencil变体）
                                this.createDefaultPipelines();
                                // 创建滤镜管线
                                this.createFilterPipelines();
                                // 创建默认空纹理
                                this.createDefaultEmptyTexture();
                                this._initialized = true;
                                return [3 /*break*/, 4];
                            case 3:
                                e_1 = _b.sent();
                                console.error('WebGPU initialization failed:', e_1);
                                this.contextLost = true;
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            };
            /**
             * 确保初始化完成
             */
            WebGPURenderContext.prototype.ensureInitialized = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (this._initialized)
                                    return [2 /*return*/, true];
                                if (!this._initPromise) return [3 /*break*/, 2];
                                return [4 /*yield*/, this._initPromise];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/, this._initialized];
                        }
                    });
                });
            };
            // ===================== GPU 缓冲创建 =====================
            WebGPURenderContext.prototype.createGPUBuffers = function () {
                var maxVertBytes = 2048 * 4 * 5 * 4; // maxQuads * 4verts * 5floats * 4bytes
                this.vertexGPUBuffer = this.device.createBuffer({
                    size: maxVertBytes,
                    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
                });
                var maxIndexBytes = 2048 * 6 * 2; // maxQuads * 6indices * 2bytes(uint16)
                this.indexGPUBuffer = this.device.createBuffer({
                    size: maxIndexBytes,
                    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
                });
                // uniform buffer: projectionVector(2 floats) + padding，对齐到256字节
                this.uniformBuffer = this.device.createBuffer({
                    size: 256,
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
                });
                // 滤镜专用uniform buffer
                this.filterUniformBuffer = this.device.createBuffer({
                    size: WebGPURenderContext.FILTER_UNIFORM_SIZE,
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
                });
            };
            // ===================== 着色器 =====================
            WebGPURenderContext.prototype.createShaderModules = function () {
                this.shaderModuleCache['default_vert'] = this.device.createShaderModule({
                    code: web.WGShaderLib.default_vert
                });
                this.shaderModuleCache['texture_frag'] = this.device.createShaderModule({
                    code: web.WGShaderLib.texture_frag
                });
                this.shaderModuleCache['primitive_frag'] = this.device.createShaderModule({
                    code: web.WGShaderLib.primitive_frag
                });
                this.shaderModuleCache['colorTransform_frag'] = this.device.createShaderModule({
                    code: web.WGShaderLib.colorTransform_frag
                });
                this.shaderModuleCache['blur_frag'] = this.device.createShaderModule({
                    code: web.WGShaderLib.blur_frag
                });
                this.shaderModuleCache['glow_frag'] = this.device.createShaderModule({
                    code: web.WGShaderLib.glow_frag
                });
                this.shaderModuleCache['texture_etc_alphamask_frag'] = this.device.createShaderModule({
                    code: web.WGShaderLib.texture_etc_alphamask_frag
                });
                this.shaderModuleCache['colorTransform_etc_alphamask_frag'] = this.device.createShaderModule({
                    code: web.WGShaderLib.colorTransform_frag_etc_alphamask_frag
                });
            };
            // ===================== 采样器 =====================
            WebGPURenderContext.prototype.createSamplers = function () {
                this.samplerCache['linear'] = this.device.createSampler({
                    magFilter: 'linear',
                    minFilter: 'linear',
                    addressModeU: 'clamp-to-edge',
                    addressModeV: 'clamp-to-edge',
                });
                this.samplerCache['nearest'] = this.device.createSampler({
                    magFilter: 'nearest',
                    minFilter: 'nearest',
                    addressModeU: 'clamp-to-edge',
                    addressModeV: 'clamp-to-edge',
                });
            };
            // ===================== BindGroup布局 =====================
            WebGPURenderContext.prototype.createBindGroupLayouts = function () {
                // group(0) texture管线布局：uniform + sampler + texture
                this.bindGroupLayoutCache['texture'] = this.device.createBindGroupLayout({
                    entries: [
                        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
                        { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
                        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
                    ]
                });
                // group(0) primitive管线布局：仅uniform
                this.bindGroupLayoutCache['primitive'] = this.device.createBindGroupLayout({
                    entries: [
                        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
                    ]
                });
                // group(1) filter uniform布局：单一uniform buffer（用于colorTransform/blur/glow）
                this.bindGroupLayoutCache['filter'] = this.device.createBindGroupLayout({
                    entries: [
                        { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
                    ]
                });
                // group(0) ETC alpha mask纹理布局：uniform + sampler + texture + alphaMaskSampler + alphaMaskTexture
                this.bindGroupLayoutCache['texture_etc_alpha'] = this.device.createBindGroupLayout({
                    entries: [
                        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
                        { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
                        { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
                        { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
                        { binding: 4, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
                    ]
                });
                this.pipelineLayoutCache['texture'] = this.device.createPipelineLayout({
                    bindGroupLayouts: [this.bindGroupLayoutCache['texture']]
                });
                this.pipelineLayoutCache['primitive'] = this.device.createPipelineLayout({
                    bindGroupLayouts: [this.bindGroupLayoutCache['primitive']]
                });
                // filter管线布局 = group(0)=texture + group(1)=filter
                this.pipelineLayoutCache['filter'] = this.device.createPipelineLayout({
                    bindGroupLayouts: [this.bindGroupLayoutCache['texture'], this.bindGroupLayoutCache['filter']]
                });
                // ETC alpha mask管线布局
                this.pipelineLayoutCache['texture_etc_alpha'] = this.device.createPipelineLayout({
                    bindGroupLayouts: [this.bindGroupLayoutCache['texture_etc_alpha']]
                });
                // ETC alpha mask + filter
                this.pipelineLayoutCache['filter_etc_alpha'] = this.device.createPipelineLayout({
                    bindGroupLayouts: [this.bindGroupLayoutCache['texture_etc_alpha'], this.bindGroupLayoutCache['filter']]
                });
            };
            // ===================== 默认管线 =====================
            WebGPURenderContext.prototype.createDefaultPipelines = function () {
                // 为每种blend模式创建texture/primitive管线
                // 注意：标准管线没有depthStencil（不使用stencil时），但由于RenderPass可能在任何时刻具有或不具有depthStencil，
                // WebGPU要求Pipeline必须明确声明其attachmentState。
                // 创建两套管线：一套不带depthStencil（用于纯颜色渲染），一套带depthStencil（兼容性更好）
                for (var blendName in WebGPURenderContext.blendModesForGPU) {
                    var blendState = WebGPURenderContext.blendModesForGPU[blendName];
                    // 标准管线（不附加depthStencil，用于单纯的颜色渲染目标）
                    this.pipelineCache['texture_' + blendName] = this.device.createRenderPipeline({
                        layout: this.pipelineLayoutCache['texture'],
                        vertex: {
                            module: this.shaderModuleCache['default_vert'],
                            entryPoint: 'main',
                            buffers: [this.vertexBufferLayout],
                        },
                        fragment: {
                            module: this.shaderModuleCache['texture_frag'],
                            entryPoint: 'main',
                            targets: [{ format: this.preferredFormat, blend: blendState }],
                        },
                        primitive: { topology: 'triangle-list', cullMode: 'none' },
                    });
                    this.pipelineCache['primitive_' + blendName] = this.device.createRenderPipeline({
                        layout: this.pipelineLayoutCache['primitive'],
                        vertex: {
                            module: this.shaderModuleCache['default_vert'],
                            entryPoint: 'main',
                            buffers: [this.vertexBufferLayout],
                        },
                        fragment: {
                            module: this.shaderModuleCache['primitive_frag'],
                            entryPoint: 'main',
                            targets: [{ format: this.preferredFormat, blend: blendState }],
                        },
                        primitive: { topology: 'triangle-list', cullMode: 'none' },
                    });
                    // ===== 带stencil的管线变体 =====
                    // texture + stencil (stencilCompare=equal, stencilOp=keep)
                    this.pipelineCache['texture_stencil_' + blendName] = this.device.createRenderPipeline({
                        layout: this.pipelineLayoutCache['texture'],
                        vertex: {
                            module: this.shaderModuleCache['default_vert'],
                            entryPoint: 'main',
                            buffers: [this.vertexBufferLayout],
                        },
                        fragment: {
                            module: this.shaderModuleCache['texture_frag'],
                            entryPoint: 'main',
                            targets: [{ format: this.preferredFormat, blend: blendState }],
                        },
                        primitive: { topology: 'triangle-list', cullMode: 'none' },
                        depthStencil: {
                            format: 'depth24plus-stencil8',
                            depthWriteEnabled: false,
                            depthCompare: 'always',
                            stencilFront: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'keep' },
                            stencilBack: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'keep' },
                        },
                    });
                    // primitive + stencil
                    this.pipelineCache['primitive_stencil_' + blendName] = this.device.createRenderPipeline({
                        layout: this.pipelineLayoutCache['primitive'],
                        vertex: {
                            module: this.shaderModuleCache['default_vert'],
                            entryPoint: 'main',
                            buffers: [this.vertexBufferLayout],
                        },
                        fragment: {
                            module: this.shaderModuleCache['primitive_frag'],
                            entryPoint: 'main',
                            targets: [{ format: this.preferredFormat, blend: blendState }],
                        },
                        primitive: { topology: 'triangle-list', cullMode: 'none' },
                        depthStencil: {
                            format: 'depth24plus-stencil8',
                            depthWriteEnabled: false,
                            depthCompare: 'always',
                            stencilFront: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'keep' },
                            stencilBack: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'keep' },
                        },
                    });
                }
                // ===== stencil push管线：写stencil(incr), 不写color =====
                this.pipelineCache['stencil_push'] = this.device.createRenderPipeline({
                    layout: this.pipelineLayoutCache['primitive'],
                    vertex: {
                        module: this.shaderModuleCache['default_vert'],
                        entryPoint: 'main',
                        buffers: [this.vertexBufferLayout],
                    },
                    fragment: {
                        module: this.shaderModuleCache['primitive_frag'],
                        entryPoint: 'main',
                        targets: [{ format: this.preferredFormat, writeMask: 0 }], // colorMask全关
                    },
                    primitive: { topology: 'triangle-list', cullMode: 'none' },
                    depthStencil: {
                        format: 'depth24plus-stencil8',
                        depthWriteEnabled: false,
                        depthCompare: 'always',
                        stencilFront: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'increment-clamp' },
                        stencilBack: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'increment-clamp' },
                    },
                });
                // ===== stencil pop管线：写stencil(decr), 不写color =====
                this.pipelineCache['stencil_pop'] = this.device.createRenderPipeline({
                    layout: this.pipelineLayoutCache['primitive'],
                    vertex: {
                        module: this.shaderModuleCache['default_vert'],
                        entryPoint: 'main',
                        buffers: [this.vertexBufferLayout],
                    },
                    fragment: {
                        module: this.shaderModuleCache['primitive_frag'],
                        entryPoint: 'main',
                        targets: [{ format: this.preferredFormat, writeMask: 0 }], // colorMask全关
                    },
                    primitive: { topology: 'triangle-list', cullMode: 'none' },
                    depthStencil: {
                        format: 'depth24plus-stencil8',
                        depthWriteEnabled: false,
                        depthCompare: 'always',
                        stencilFront: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'decrement-clamp' },
                        stencilBack: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'decrement-clamp' },
                    },
                });
                // ===== ETC alpha mask管线 =====
                var defaultBlendETC = WebGPURenderContext.blendModesForGPU["source-over"];
                // ETC alpha mask (不带stencil)
                this.pipelineCache['texture_etc_alpha_source-over'] = this.device.createRenderPipeline({
                    layout: this.pipelineLayoutCache['texture_etc_alpha'],
                    vertex: {
                        module: this.shaderModuleCache['default_vert'],
                        entryPoint: 'main',
                        buffers: [this.vertexBufferLayout],
                    },
                    fragment: {
                        module: this.shaderModuleCache['texture_etc_alphamask_frag'],
                        entryPoint: 'main',
                        targets: [{ format: this.preferredFormat, blend: defaultBlendETC }],
                    },
                    primitive: { topology: 'triangle-list', cullMode: 'none' },
                });
                // ETC alpha mask (带stencil)
                this.pipelineCache['texture_etc_alpha_source-over_stencil'] = this.device.createRenderPipeline({
                    layout: this.pipelineLayoutCache['texture_etc_alpha'],
                    vertex: {
                        module: this.shaderModuleCache['default_vert'],
                        entryPoint: 'main',
                        buffers: [this.vertexBufferLayout],
                    },
                    fragment: {
                        module: this.shaderModuleCache['texture_etc_alphamask_frag'],
                        entryPoint: 'main',
                        targets: [{ format: this.preferredFormat, blend: defaultBlendETC }],
                    },
                    primitive: { topology: 'triangle-list', cullMode: 'none' },
                    depthStencil: {
                        format: 'depth24plus-stencil8',
                        depthWriteEnabled: false,
                        depthCompare: 'always',
                        stencilFront: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'keep' },
                        stencilBack: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'keep' },
                    },
                });
                // ETC alpha mask + colorTransform filter (不带stencil)
                this.pipelineCache['filter_colorTransform_etc_alpha'] = this.device.createRenderPipeline({
                    layout: this.pipelineLayoutCache['filter_etc_alpha'],
                    vertex: {
                        module: this.shaderModuleCache['default_vert'],
                        entryPoint: 'main',
                        buffers: [this.vertexBufferLayout],
                    },
                    fragment: {
                        module: this.shaderModuleCache['colorTransform_etc_alphamask_frag'],
                        entryPoint: 'main',
                        targets: [{ format: this.preferredFormat, blend: defaultBlendETC }],
                    },
                    primitive: { topology: 'triangle-list', cullMode: 'none' },
                });
                // ETC alpha mask + colorTransform filter (带stencil)
                this.pipelineCache['filter_colorTransform_etc_alpha_stencil'] = this.device.createRenderPipeline({
                    layout: this.pipelineLayoutCache['filter_etc_alpha'],
                    vertex: {
                        module: this.shaderModuleCache['default_vert'],
                        entryPoint: 'main',
                        buffers: [this.vertexBufferLayout],
                    },
                    fragment: {
                        module: this.shaderModuleCache['colorTransform_etc_alphamask_frag'],
                        entryPoint: 'main',
                        targets: [{ format: this.preferredFormat, blend: defaultBlendETC }],
                    },
                    primitive: { topology: 'triangle-list', cullMode: 'none' },
                    depthStencil: {
                        format: 'depth24plus-stencil8',
                        depthWriteEnabled: false,
                        depthCompare: 'always',
                        stencilFront: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'keep' },
                        stencilBack: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'keep' },
                    },
                });
            };
            // ===================== 滤镜管线 =====================
            WebGPURenderContext.prototype.createFilterPipelines = function () {
                var defaultBlend = WebGPURenderContext.blendModesForGPU["source-over"];
                var filterShaders = ['colorTransform_frag', 'blur_frag', 'glow_frag'];
                for (var _i = 0, filterShaders_1 = filterShaders; _i < filterShaders_1.length; _i++) {
                    var shaderName = filterShaders_1[_i];
                    var pipelineKey = 'filter_' + shaderName;
                    this.pipelineCache[pipelineKey] = this.device.createRenderPipeline({
                        layout: this.pipelineLayoutCache['filter'],
                        vertex: {
                            module: this.shaderModuleCache['default_vert'],
                            entryPoint: 'main',
                            buffers: [this.vertexBufferLayout],
                        },
                        fragment: {
                            module: this.shaderModuleCache[shaderName],
                            entryPoint: 'main',
                            targets: [{ format: this.preferredFormat, blend: defaultBlend }],
                        },
                        primitive: { topology: 'triangle-list', cullMode: 'none' },
                    });
                    // stencil变体
                    this.pipelineCache[pipelineKey + '_stencil'] = this.device.createRenderPipeline({
                        layout: this.pipelineLayoutCache['filter'],
                        vertex: {
                            module: this.shaderModuleCache['default_vert'],
                            entryPoint: 'main',
                            buffers: [this.vertexBufferLayout],
                        },
                        fragment: {
                            module: this.shaderModuleCache[shaderName],
                            entryPoint: 'main',
                            targets: [{ format: this.preferredFormat, blend: defaultBlend }],
                        },
                        primitive: { topology: 'triangle-list', cullMode: 'none' },
                        depthStencil: {
                            format: 'depth24plus-stencil8',
                            depthWriteEnabled: false,
                            depthCompare: 'always',
                            stencilFront: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'keep' },
                            stencilBack: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'keep' },
                        },
                    });
                }
            };
            WebGPURenderContext.prototype.getTexturePipeline = function (blendMode, useStencil) {
                if (useStencil === void 0) { useStencil = false; }
                var key = useStencil ? 'texture_stencil_' + blendMode : 'texture_' + blendMode;
                return this.pipelineCache[key] || this.pipelineCache[useStencil ? 'texture_stencil_source-over' : 'texture_source-over'];
            };
            WebGPURenderContext.prototype.getPrimitivePipeline = function (blendMode, useStencil) {
                if (useStencil === void 0) { useStencil = false; }
                var key = useStencil ? 'primitive_stencil_' + blendMode : 'primitive_' + blendMode;
                return this.pipelineCache[key] || this.pipelineCache[useStencil ? 'primitive_stencil_source-over' : 'primitive_source-over'];
            };
            /**
             * 根据filter类型获取对应的pipeline
             */
            WebGPURenderContext.prototype.getFilterPipeline = function (filter, useStencil) {
                if (useStencil === void 0) { useStencil = false; }
                var shaderName;
                if (filter.type === "colorTransform") {
                    shaderName = 'colorTransform_frag';
                }
                else if (filter.type === "blurX" || filter.type === "blurY") {
                    shaderName = 'blur_frag';
                }
                else if (filter.type === "glow") {
                    shaderName = 'glow_frag';
                }
                else {
                    // custom or unknown: fall back to texture pipeline
                    return this.getTexturePipeline("source-over", useStencil);
                }
                var key = 'filter_' + shaderName + (useStencil ? '_stencil' : '');
                var pipeline = this.pipelineCache[key];
                // 如果找不到Pipeline，尝试不带stencil的版本作为备选
                if (!pipeline && useStencil) {
                    key = 'filter_' + shaderName;
                    pipeline = this.pipelineCache[key];
                }
                // 如果仍然找不到，使用纹理管线作为最后备选
                if (!pipeline) {
                    pipeline = this.getTexturePipeline("source-over", useStencil);
                }
                return pipeline;
            };
            /**
             * 填充filter uniform buffer并返回对应的bind group
             */
            WebGPURenderContext.prototype.createFilterBindGroup = function (filter, textureWidth, textureHeight) {
                var uniformData = this.buildFilterUniformData(filter, textureWidth, textureHeight);
                if (!uniformData)
                    return null;
                this.device.queue.writeBuffer(this.filterUniformBuffer, 0, uniformData);
                return this.device.createBindGroup({
                    layout: this.bindGroupLayoutCache['filter'],
                    entries: [
                        { binding: 0, resource: { buffer: this.filterUniformBuffer, size: uniformData.byteLength } },
                    ]
                });
            };
            /**
             * 构建filter uniform数据
             */
            WebGPURenderContext.prototype.buildFilterUniformData = function (filter, textureWidth, textureHeight) {
                var filterScale = filter.$uniforms.$filterScale || 1;
                if (filter.type === "colorTransform") {
                    // ColorMatrix: mat4x4(16 floats) + colorAdd(4 floats) = 80 bytes
                    var data = new Float32Array(20);
                    var matrix = filter.$uniforms.matrix;
                    var colorAdd = filter.$uniforms.colorAdd;
                    if (matrix) {
                        for (var i = 0; i < 16; i++) {
                            data[i] = matrix[i];
                        }
                    }
                    if (colorAdd) {
                        data[16] = colorAdd[0];
                        data[17] = colorAdd[1];
                        data[18] = colorAdd[2];
                        data[19] = colorAdd[3];
                    }
                    return data;
                }
                else if (filter.type === "blurX" || filter.type === "blurY") {
                    // BlurUniforms: blur(2) + padding(2) + uTextureSize(2) + padding(2) = 32 bytes
                    var data = new Float32Array(8);
                    var blur_1 = filter.$uniforms.blur;
                    if (blur_1) {
                        data[0] = (blur_1.x !== undefined ? blur_1.x : 0) * filterScale;
                        data[1] = (blur_1.y !== undefined ? blur_1.y : 0) * filterScale;
                    }
                    data[4] = textureWidth;
                    data[5] = textureHeight;
                    return data;
                }
                else if (filter.type === "glow") {
                    // GlowUniforms: dist(1) + angle(1) + padding(2) + color(4) + alpha(1) + blurX(1) + blurY(1) + strength(1) + inner(1) + knockout(1) + hideObject(1) + padding(1) + uTextureSize(2) + padding(2) = 64 bytes
                    var data = new Float32Array(16);
                    var u = filter.$uniforms;
                    data[0] = (u.dist || 0) * filterScale;
                    data[1] = u.angle || 0;
                    // data[2], data[3] = padding
                    if (u.color) {
                        data[4] = u.color[0] || 0;
                        data[5] = u.color[1] || 0;
                        data[6] = u.color[2] || 0;
                        data[7] = u.color[3] || 0;
                    }
                    data[8] = u.alpha !== undefined ? u.alpha : 1;
                    data[9] = (u.blurX || 0) * filterScale;
                    data[10] = (u.blurY || 0) * filterScale;
                    data[11] = u.strength || 0;
                    data[12] = u.inner || 0;
                    data[13] = u.knockout || 0;
                    data[14] = u.hideObject || 0;
                    // data[15] = padding
                    // We need a second vec4 for uTextureSize + padding
                    // But we only have 16 floats (64 bytes). Let's extend to 20 floats (80 bytes)
                    // Actually the struct needs uTextureSize at offset 48+. Let me recalculate.
                    // The WGSL struct:
                    //   dist: f32           [0]
                    //   angle: f32          [4]
                    //   padding0: vec2<f32> [8]
                    //   color: vec4<f32>    [16]
                    //   alpha: f32          [32]
                    //   blurX: f32          [36]
                    //   blurY: f32          [40]
                    //   strength: f32       [44]
                    //   inner: f32          [48]
                    //   knockout: f32       [52]
                    //   hideObject: f32     [56]
                    //   padding1: f32       [60]
                    //   uTextureSize: vec2  [64]
                    //   padding2: vec2      [72]
                    // Total = 80 bytes = 20 floats
                    return this.buildGlowUniformData(filter, textureWidth, textureHeight, filterScale);
                }
                return null;
            };
            WebGPURenderContext.prototype.buildGlowUniformData = function (filter, textureWidth, textureHeight, filterScale) {
                var data = new Float32Array(20); // 80 bytes
                var u = filter.$uniforms;
                data[0] = (u.dist || 0) * filterScale; // dist
                data[1] = u.angle || 0; // angle
                // data[2], data[3] = padding0
                data[4] = u.color ? (u.color[0] || 0) : 0; // color.r
                data[5] = u.color ? (u.color[1] || 0) : 0; // color.g
                data[6] = u.color ? (u.color[2] || 0) : 0; // color.b
                data[7] = u.color ? (u.color[3] || 0) : 0; // color.a
                data[8] = u.alpha !== undefined ? u.alpha : 1; // alpha
                data[9] = (u.blurX || 0) * filterScale; // blurX
                data[10] = (u.blurY || 0) * filterScale; // blurY
                data[11] = u.strength || 0; // strength
                data[12] = u.inner || 0; // inner
                data[13] = u.knockout || 0; // knockout
                data[14] = u.hideObject || 0; // hideObject
                data[15] = 0; // padding1
                data[16] = textureWidth; // uTextureSize.x
                data[17] = textureHeight; // uTextureSize.y
                data[18] = 0; // padding2.x
                data[19] = 0; // padding2.y
                return data;
            };
            // ===================== 默认空纹理 =====================
            WebGPURenderContext.prototype.createDefaultEmptyTexture = function () {
                var size = 16;
                this._defaultEmptyTexture = this.device.createTexture({
                    size: { width: size, height: size },
                    format: this.preferredFormat,
                    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
                });
                this._defaultEmptyTextureView = this._defaultEmptyTexture.createView();
                var canvas = egret.sys.createCanvas(size, size);
                var ctx = egret.sys.getContext2d(canvas);
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, size, size);
                var imageData = ctx.getImageData(0, 0, size, size);
                this.device.queue.writeTexture({ texture: this._defaultEmptyTexture }, imageData.data.buffer, { bytesPerRow: size * 4, rowsPerImage: size }, { width: size, height: size });
            };
            Object.defineProperty(WebGPURenderContext.prototype, "defaultEmptyTexture", {
                get: function () { return this._defaultEmptyTexture; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebGPURenderContext.prototype, "defaultEmptyTextureView", {
                get: function () { return this._defaultEmptyTextureView; },
                enumerable: true,
                configurable: true
            });
            // ===================== BindGroup 缓存 =====================
            /**
             * 获取或创建primitive bind group（仅包含uniform buffer，每帧不变）
             */
            WebGPURenderContext.prototype.getPrimitiveBindGroup = function () {
                if (!this._primitiveBindGroup) {
                    this._primitiveBindGroup = this.device.createBindGroup({
                        layout: this.bindGroupLayoutCache['primitive'],
                        entries: [
                            { binding: 0, resource: { buffer: this.uniformBuffer } },
                        ]
                    });
                }
                return this._primitiveBindGroup;
            };
            /**
             * 投影参数变化时使primitive bind group失效
             */
            WebGPURenderContext.prototype.invalidatePrimitiveBindGroup = function () {
                this._primitiveBindGroup = null;
            };
            /**
             * 获取纹理bind group（按纹理+采样器组合缓存）
             */
            WebGPURenderContext.prototype.getTextureBindGroup = function (texture, smoothing) {
                // 每帧开始时清空缓存（因为投影uniform可能变化）
                if (this._bindGroupCacheFrameId !== this._currentFrameId) {
                    this._textureBindGroupCache.clear();
                    this._bindGroupCacheFrameId = this._currentFrameId;
                }
                // 用纹理的label/id + smoothing 作为缓存key
                // GPUTexture没有稳定id，用对象引用做Map key更高效
                var sampler = smoothing !== false ?
                    this.samplerCache['linear'] : this.samplerCache['nearest'];
                var textureView = this.getTextureView(texture);
                // 简单hash: 使用纹理的引用+smoothing
                var key = (smoothing !== false ? 'L' : 'N') + '_' + textureView.label;
                // 由于label可能为空，改用纹理+采样器方式
                // 考虑到性能，对于高频调用的场景直接创建即可，
                // 但对于连续相同纹理的批次合并，DrawCmdManager已经处理了
                var bindGroup = this.device.createBindGroup({
                    layout: this.bindGroupLayoutCache['texture'],
                    entries: [
                        { binding: 0, resource: { buffer: this.uniformBuffer } },
                        { binding: 1, resource: sampler },
                        { binding: 2, resource: textureView },
                    ]
                });
                return bindGroup;
            };
            // ===================== Buffer 栈管理 =====================
            WebGPURenderContext.prototype.pushBuffer = function (buffer) {
                this.$bufferStack.push(buffer);
                if (buffer != this.currentBuffer) {
                    this.drawCmdManager.pushActivateBuffer(buffer);
                }
                this.currentBuffer = buffer;
            };
            WebGPURenderContext.prototype.popBuffer = function () {
                if (this.$bufferStack.length <= 1) {
                    return;
                }
                var buffer = this.$bufferStack.pop();
                var lastBuffer = this.$bufferStack[this.$bufferStack.length - 1];
                if (buffer != lastBuffer) {
                    this.drawCmdManager.pushActivateBuffer(lastBuffer);
                }
                this.currentBuffer = lastBuffer;
            };
            // ===================== 渲染尺寸 =====================
            WebGPURenderContext.prototype.onResize = function (width, height) {
                width = width || this.surface.width;
                height = height || this.surface.height;
                this.projectionX = width / 2;
                this.projectionY = -height / 2;
            };
            WebGPURenderContext.prototype.resize = function (width, height, useMaxSize) {
                egret.sys.resizeContext(this, width, height, useMaxSize);
            };
            WebGPURenderContext.prototype.destroy = function () {
                this.surface.width = this.surface.height = 0;
                // 释放GPU资源
                if (this.vertexGPUBuffer) {
                    this.vertexGPUBuffer.destroy();
                    this.vertexGPUBuffer = null;
                }
                if (this.indexGPUBuffer) {
                    this.indexGPUBuffer.destroy();
                    this.indexGPUBuffer = null;
                }
                if (this.uniformBuffer) {
                    this.uniformBuffer.destroy();
                    this.uniformBuffer = null;
                }
                if (this.filterUniformBuffer) {
                    this.filterUniformBuffer.destroy();
                    this.filterUniformBuffer = null;
                }
                if (this._defaultEmptyTexture) {
                    this._defaultEmptyTexture.destroy();
                    this._defaultEmptyTexture = null;
                    this._defaultEmptyTextureView = null;
                }
                this.textureViewCache.clear();
                this._textureBindGroupCache.clear();
                this._primitiveBindGroup = null;
                this._initialized = false;
                if (this.device) {
                    this.device.destroy();
                    this.device = null;
                }
            };
            // ===================== 绘图指令 =====================
            WebGPURenderContext.prototype.setGlobalCompositeOperation = function (value) {
                this.drawCmdManager.pushSetBlend(value);
            };
            WebGPURenderContext.prototype.drawImage = function (image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, rotated, smoothing) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !image || !buffer) {
                    return;
                }
                var gpuTexture;
                var offsetX;
                var offsetY;
                var needRestoreTransform = false;
                if (image["gpuTexture"]) {
                    // render target 纹理：需要坐标翻转
                    gpuTexture = image["gpuTexture"];
                    buffer.saveTransform();
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(1, 0, 0, -1, 0, destHeight + destY * 2);
                    needRestoreTransform = true;
                }
                else if (!image.source && !image["gpuTexture"]) {
                    return;
                }
                else {
                    // 普通图片纹理：getGPUTexture会处理加载
                    gpuTexture = this.getGPUTexture(image);
                }
                if (!gpuTexture) {
                    return;
                }
                this.drawTexture(gpuTexture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, undefined, undefined, undefined, undefined, rotated, smoothing);
                if (needRestoreTransform) {
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    buffer.restoreTransform();
                }
            };
            WebGPURenderContext.prototype.drawMesh = function (image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, meshUVs, meshVertices, meshIndices, bounds, rotated, smoothing) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !image || !buffer) {
                    return;
                }
                var gpuTexture;
                var offsetX;
                var offsetY;
                var needRestoreTransform = false;
                if (image["gpuTexture"]) {
                    // render target 纹理：需要坐标翻转
                    gpuTexture = image["gpuTexture"];
                    buffer.saveTransform();
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(1, 0, 0, -1, 0, destHeight + destY * 2);
                    needRestoreTransform = true;
                }
                else if (!image.source && !image["gpuTexture"]) {
                    return;
                }
                else {
                    // 普通图片纹理：getGPUTexture会处理加载
                    gpuTexture = this.getGPUTexture(image);
                }
                if (!gpuTexture) {
                    return;
                }
                this.drawTexture(gpuTexture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, meshUVs, meshVertices, meshIndices, bounds, rotated, smoothing);
                if (needRestoreTransform) {
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    buffer.restoreTransform();
                }
            };
            WebGPURenderContext.prototype.drawTexture = function (texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight, meshUVs, meshVertices, meshIndices, bounds, rotated, smoothing) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !texture || !buffer) {
                    return;
                }
                if (meshVertices && meshIndices) {
                    if (this.vao.reachMaxSize(meshVertices.length / 2, meshIndices.length)) {
                        this.$drawWebGPU();
                    }
                }
                else {
                    if (this.vao.reachMaxSize()) {
                        this.$drawWebGPU();
                    }
                }
                if (meshUVs) {
                    this.vao.changeToMeshIndices();
                }
                var count = meshIndices ? meshIndices.length / 3 : 2;
                this.drawCmdManager.pushDrawTexture(texture, count, this.$filter, textureWidth, textureHeight);
                buffer.currentTexture = texture;
                this.vao.cacheArrays(buffer, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight, meshUVs, meshVertices, meshIndices, rotated);
            };
            WebGPURenderContext.prototype.drawRect = function (x, y, width, height) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !buffer) {
                    return;
                }
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGPU();
                }
                this.drawCmdManager.pushDrawRect();
                buffer.currentTexture = null;
                this.vao.cacheArrays(buffer, 0, 0, width, height, x, y, width, height, width, height);
            };
            WebGPURenderContext.prototype.pushMask = function (x, y, width, height) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !buffer) {
                    return;
                }
                buffer.$stencilList.push({ x: x, y: y, width: width, height: height });
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGPU();
                }
                this.drawCmdManager.pushPushMask();
                buffer.currentTexture = null;
                this.vao.cacheArrays(buffer, 0, 0, width, height, x, y, width, height, width, height);
            };
            WebGPURenderContext.prototype.popMask = function () {
                var buffer = this.currentBuffer;
                if (this.contextLost || !buffer) {
                    return;
                }
                var mask = buffer.$stencilList.pop();
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGPU();
                }
                this.drawCmdManager.pushPopMask();
                buffer.currentTexture = null;
                this.vao.cacheArrays(buffer, 0, 0, mask.width, mask.height, mask.x, mask.y, mask.width, mask.height, mask.width, mask.height);
            };
            WebGPURenderContext.prototype.clear = function () {
                this.drawCmdManager.pushClearColor();
            };
            WebGPURenderContext.prototype.clearRect = function (x, y, width, height) {
                if (x != 0 || y != 0 || width != this.surface.width || height != this.surface.height) {
                    var buffer = this.currentBuffer;
                    if (buffer.$hasScissor) {
                        this.setGlobalCompositeOperation("destination-out");
                        this.drawRect(x, y, width, height);
                        this.setGlobalCompositeOperation("source-over");
                    }
                    else {
                        var m = buffer.globalMatrix;
                        if (m.b == 0 && m.c == 0) {
                            x = x * m.a + m.tx;
                            y = y * m.d + m.ty;
                            width = width * m.a;
                            height = height * m.d;
                            // 移除残留的 WebGL 坐标系翻转，直接使用正确的 top-left y坐标
                            this.enableScissor(x, y, width, height);
                            this.clear();
                            this.disableScissor();
                        }
                        else {
                            this.setGlobalCompositeOperation("destination-out");
                            this.drawRect(x, y, width, height);
                            this.setGlobalCompositeOperation("source-over");
                        }
                    }
                }
                else {
                    this.clear();
                }
            };
            WebGPURenderContext.prototype.enableScissor = function (x, y, width, height) {
                var buffer = this.currentBuffer;
                this.drawCmdManager.pushEnableScissor(x, y, width, height);
                buffer.$hasScissor = true;
            };
            WebGPURenderContext.prototype.disableScissor = function () {
                var buffer = this.currentBuffer;
                this.drawCmdManager.pushDisableScissor();
                buffer.$hasScissor = false;
            };
            WebGPURenderContext.prototype.enableStencilTest = function () { };
            WebGPURenderContext.prototype.disableStencilTest = function () { };
            WebGPURenderContext.prototype.enableScissorTest = function (rect) { };
            WebGPURenderContext.prototype.disableScissorTest = function () { };
            WebGPURenderContext.prototype.getPixels = function (x, y, width, height, pixels) {
                // WebGPU中像素读取是异步的，同步接口保持API兼容
            };
            // ===================== 纹理管理 =====================
            WebGPURenderContext.prototype.createTexture = function (bitmapData) {
                var _this = this;
                if (!this.device)
                    return null;
                var source;
                var width, height;
                if (bitmapData instanceof HTMLCanvasElement) {
                    source = bitmapData;
                    width = bitmapData.width;
                    height = bitmapData.height;
                }
                else {
                    source = bitmapData.source;
                    width = bitmapData.width;
                    height = bitmapData.height;
                }
                if (!source || width <= 0 || height <= 0)
                    return null;
                var texture = this.device.createTexture({
                    size: { width: width, height: height },
                    format: this.preferredFormat,
                    usage: GPUTextureUsage.TEXTURE_BINDING |
                        GPUTextureUsage.COPY_DST |
                        GPUTextureUsage.RENDER_ATTACHMENT,
                });
                // 标记纹理为预乘alpha，与WebGL行为保持一致
                texture[egret.UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
                // HTMLImageElement 和 HTMLCanvasElement 都需要确保已加载
                if (source instanceof HTMLCanvasElement) {
                    this.device.queue.copyExternalImageToTexture({ source: source }, { texture: texture, premultipliedAlpha: true }, { width: width, height: height });
                }
                else if (source instanceof HTMLImageElement) {
                    // 对于 HTMLImageElement，必须等待图片完全加载
                    if (source.complete && source.naturalWidth > 0 && source.naturalHeight > 0) {
                        // 图片已加载
                        this.device.queue.copyExternalImageToTexture({ source: source }, { texture: texture, premultipliedAlpha: true }, { width: width, height: height });
                    }
                    else {
                        // 图片还在加载，等待加载完成
                        var onLoadHandler_1 = function () {
                            _this.device.queue.copyExternalImageToTexture({ source: source }, { texture: texture, premultipliedAlpha: true }, { width: width, height: height });
                            source.removeEventListener('load', onLoadHandler_1);
                        };
                        source.addEventListener('load', onLoadHandler_1);
                    }
                }
                return texture;
            };
            WebGPURenderContext.prototype.updateTexture = function (texture, bitmapData) {
                if (!this.device || !texture)
                    return texture;
                var source;
                var width, height;
                if (bitmapData instanceof HTMLCanvasElement) {
                    source = bitmapData;
                    width = bitmapData.width;
                    height = bitmapData.height;
                }
                else {
                    source = bitmapData.source;
                    width = bitmapData.width;
                    height = bitmapData.height;
                }
                if (!source)
                    return texture;
                // 检查纹理尺寸是否匹配，不匹配则需要重新创建
                if (texture.width !== width || texture.height !== height) {
                    this.deleteGPUTexture(texture);
                    texture = this.createTexture(bitmapData);
                    return texture;
                }
                if (source instanceof HTMLCanvasElement) {
                    this.device.queue.copyExternalImageToTexture({ source: source }, { texture: texture, premultipliedAlpha: true }, { width: width, height: height });
                }
                else if (source instanceof HTMLImageElement) {
                    this.device.queue.copyExternalImageToTexture({ source: source }, { texture: texture, premultipliedAlpha: true }, { width: width, height: height });
                }
                return texture;
            };
            WebGPURenderContext.prototype.getGPUTexture = function (bitmapData) {
                if (!bitmapData)
                    return null;
                if (!bitmapData["gpuTexture"]) {
                    if (bitmapData.format == "image" && !bitmapData.hasCompressed2d()) {
                        bitmapData["gpuTexture"] = this.createTexture(bitmapData);
                    }
                    if (bitmapData.$deleteSource && bitmapData["gpuTexture"]) {
                        if (bitmapData.source) {
                            bitmapData.source.src = '';
                            bitmapData.source = null;
                        }
                    }
                    if (bitmapData["gpuTexture"]) {
                        bitmapData["gpuTexture"]["smoothing"] = true;
                    }
                }
                return bitmapData["gpuTexture"];
            };
            WebGPURenderContext.prototype.getTextureView = function (texture) {
                if (!texture)
                    return this.defaultEmptyTextureView;
                var view = this.textureViewCache.get(texture);
                if (!view) {
                    view = texture.createView();
                    this.textureViewCache.set(texture, view);
                }
                return view;
            };
            WebGPURenderContext.prototype.getWebGLTexture = function (bitmapData) {
                return this.getGPUTexture(bitmapData);
            };
            /**
             * 释放GPU纹理及其缓存的纹理视图
             * 使用延迟销毁机制：先标记为待销毁，在下一个合适的时机再实际销毁
             */
            WebGPURenderContext.prototype.deleteGPUTexture = function (texture) {
                if (!texture)
                    return;
                this.textureViewCache.delete(texture);
                // 不立即销毁，改为延迟销毁
                // 在下一帧的初始化时批量销毁所有待销毁的纹理
                if (this.texturesToDestroy.indexOf(texture) === -1) {
                    this.texturesToDestroy.push(texture);
                }
            };
            /**
             * 处理待销毁的纹理（应该在每帧开始或命令flush之后调用）
             */
            WebGPURenderContext.prototype.flushDestroyTextures = function () {
                for (var i = 0; i < this.texturesToDestroy.length; i++) {
                    var texture = this.texturesToDestroy[i];
                    try {
                        texture.destroy();
                    }
                    catch (e) {
                        // 纹理可能仍在使用中，忽略错误
                    }
                }
                this.texturesToDestroy.length = 0;
            };
            Object.defineProperty(WebGPURenderContext.prototype, "useStencil", {
                // ===================== 核心绘制执行 =====================
                /**
                 * 判断当前activated buffer是否需要stencil（有stencilHandleCount>0）
                 */
                get: function () {
                    return this.activatedBuffer && this.activatedBuffer.stencilHandleCount > 0;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 获取当前buffer的rootRenderTarget（用于获取depth-stencil）
             */
            WebGPURenderContext.prototype.getCurrentRenderTarget = function () {
                if (this.activatedBuffer) {
                    return this.activatedBuffer.rootRenderTarget;
                }
                return null;
            };
            /**
             * 开始一个新的render pass
             * 根据是否需要stencil来决定是否附加depthStencil attachment
             */
            WebGPURenderContext.prototype.beginRenderPass = function (commandEncoder, colorView, loadOp, clearStencil) {
                if (clearStencil === void 0) { clearStencil = false; }
                var depthStencilAttachment = undefined;
                var renderTarget = this.getCurrentRenderTarget();
                // 为了保持Pipeline和RenderPass的附件状态一致，始终尝试附加depthStencil
                // 即使当前没有stencil mask，也预先创建depth-stencil纹理以保持一致的attachment state
                if (renderTarget) {
                    // 始终启用stencil以保证Pipeline兼容性
                    // enabledStencil会确保depthStencil的尺寸与renderTarget一致
                    renderTarget.enabledStencil();
                    var dsView = renderTarget.getDepthStencilTextureView();
                    if (dsView) {
                        depthStencilAttachment = {
                            view: dsView,
                            depthLoadOp: 'load',
                            depthStoreOp: 'store',
                            stencilLoadOp: clearStencil ? 'clear' : 'load',
                            stencilStoreOp: 'store',
                            stencilClearValue: 0,
                        };
                    }
                }
                var renderPassDescriptor = {
                    colorAttachments: [{
                            view: colorView,
                            loadOp: loadOp,
                            storeOp: 'store',
                            clearValue: { r: 0, g: 0, b: 0, a: 0 }, // 黑色不透明，方便调试
                            // clearValue: { r: 1, g: 1, b: 1, a: 1 }, // 白色不透明，方便调试
                        }],
                };
                if (depthStencilAttachment) {
                    renderPassDescriptor.depthStencilAttachment = depthStencilAttachment;
                }
                var pass = commandEncoder.beginRenderPass(renderPassDescriptor);
                pass.setVertexBuffer(0, this.vertexGPUBuffer);
                pass.setIndexBuffer(this.indexGPUBuffer, 'uint16');
                return pass;
            };
            WebGPURenderContext.prototype.$drawWebGPU = function () {
                if (this.drawCmdManager.drawDataLen == 0 || this.contextLost || !this._initialized) {
                    return;
                }
                // 在绘制前先销毁待销毁的纹理
                this.flushDestroyTextures();
                // 确保第一个命令是 ACT_BUFFER
                if (this.drawCmdManager.drawDataLen > 0) {
                    var firstData = this.drawCmdManager.drawData[0];
                    if (firstData.type !== 7 /* ACT_BUFFER */) {
                        // 在最前面插入 ACT_BUFFER
                        var newData = {};
                        newData.type = 7 /* ACT_BUFFER */;
                        newData.buffer = this.activatedBuffer || this.currentBuffer;
                        var bufferWidth = newData.buffer.rootRenderTarget.width;
                        var bufferHeight = newData.buffer.rootRenderTarget.height;
                        newData.width = bufferWidth;
                        newData.height = bufferHeight;
                        // 向后移动所有元素
                        for (var i = this.drawCmdManager.drawDataLen; i > 0; i--) {
                            this.drawCmdManager.drawData[i] = this.drawCmdManager.drawData[i - 1];
                        }
                        this.drawCmdManager.drawData[0] = newData;
                        this.drawCmdManager.drawDataLen++;
                    }
                }
                this._currentFrameId++;
                var vertices = this.vao.getVertices();
                if (vertices.byteLength > 0) {
                    // WebGPU 规定 writeBuffer 长度必须是 4 的倍数
                    var vWriteLen = (vertices.byteLength + 3) & ~3;
                    vWriteLen = Math.min(vWriteLen, vertices.buffer.byteLength - vertices.byteOffset);
                    this.device.queue.writeBuffer(this.vertexGPUBuffer, 0, vertices.buffer, vertices.byteOffset, vWriteLen);
                }
                if (this.vao.isMesh()) {
                    var meshIndices = this.vao.getMeshIndices();
                    if (meshIndices.byteLength > 0) {
                        var iWriteLen = (meshIndices.byteLength + 3) & ~3;
                        iWriteLen = Math.min(iWriteLen, meshIndices.buffer.byteLength - meshIndices.byteOffset);
                        this.device.queue.writeBuffer(this.indexGPUBuffer, 0, meshIndices.buffer, meshIndices.byteOffset, iWriteLen);
                    }
                }
                else {
                    var indices = this.vao.getIndices();
                    if (indices.byteLength > 0) {
                        var iWriteLen = (indices.byteLength + 3) & ~3;
                        iWriteLen = Math.min(iWriteLen, indices.buffer.byteLength - indices.byteOffset);
                        this.device.queue.writeBuffer(this.indexGPUBuffer, 0, indices.buffer, indices.byteOffset, iWriteLen);
                    }
                }
                var length = this.drawCmdManager.drawDataLen;
                var offset = 0;
                // 使用单一commandEncoder减少submit次数
                var commandEncoder = this.device.createCommandEncoder();
                var renderPassEncoder = null;
                var currentTargetView = null;
                // 缓存本帧的canvas纹理视图，避免重复创建
                var canvasTextureView = null;
                // 缓存每个render target的primitive bind group
                var currentPrimitiveBindGroup = null;
                // 缓存投影写入状态，避免重复writeBuffer
                var lastProjectionX = NaN;
                var lastProjectionY = NaN;
                // 跟踪当前RenderPass是否有depthStencil attachment，以选择兼容的Pipeline
                var currentRenderPassHasDepthStencil = false;
                for (var i = 0; i < length; i++) {
                    var data = this.drawCmdManager.drawData[i];
                    switch (data.type) {
                        case 7 /* ACT_BUFFER */: {
                            // 关键修复：在使用 RenderTarget 之前，确保其所有纹理的尺寸都是最新的
                            // 特别是 depthStencil 纹理，它可能因为 resize 操作而尺寸不匹配
                            var bufferWidth = void 0;
                            var bufferHeight = void 0;
                            if (data.buffer.root) {
                                var canvasTexture = this.canvasContext.getCurrentTexture();
                                bufferWidth = canvasTexture.width;
                                bufferHeight = canvasTexture.height;
                                // 对于根缓冲区，必须确保它的 rootRenderTarget 尺寸与真实的 Canvas 纹理尺寸强同步
                                if (data.buffer.rootRenderTarget.width !== bufferWidth ||
                                    data.buffer.rootRenderTarget.height !== bufferHeight) {
                                    data.buffer.rootRenderTarget.width = bufferWidth;
                                    data.buffer.rootRenderTarget.height = bufferHeight;
                                    if (typeof data.buffer.rootRenderTarget.resize === 'function') {
                                        data.buffer.rootRenderTarget.resize(bufferWidth, bufferHeight);
                                    }
                                }
                                // root 也必须确保 DepthStencil 尺寸与当前 Canvas 尺寸一致
                                data.buffer.rootRenderTarget.ensureDepthStencilSize();
                            }
                            else {
                                data.buffer.rootRenderTarget.ensureDepthStencilSize();
                                bufferWidth = data.buffer.rootRenderTarget.width;
                                bufferHeight = data.buffer.rootRenderTarget.height;
                            }
                            // 结束前一个render pass（不submit，保持在同一commandEncoder）
                            if (renderPassEncoder) {
                                renderPassEncoder.end();
                                // 不在此处submit，让所有命令在同一encoder中批量执行
                                // 但需要新的encoder因为WebGPU规定一个encoder只能finish一次
                                this.device.queue.submit([commandEncoder.finish()]);
                                commandEncoder = this.device.createCommandEncoder();
                            }
                            this.activatedBuffer = data.buffer;
                            var targetView = void 0;
                            if (data.buffer.root) {
                                // 使用缓存的canvas纹理视图，每帧只创建一次
                                if (!canvasTextureView) {
                                    canvasTextureView = this.canvasContext.getCurrentTexture().createView();
                                }
                                targetView = canvasTextureView;
                            }
                            else {
                                data.buffer.rootRenderTarget.activate();
                                targetView = data.buffer.rootRenderTarget.getTextureView();
                            }
                            currentTargetView = targetView;
                            this.onResize(bufferWidth, bufferHeight);
                            // 仅在投影参数变化时写入uniform buffer
                            if (lastProjectionX !== this.projectionX || lastProjectionY !== this.projectionY) {
                                lastProjectionX = this.projectionX;
                                lastProjectionY = this.projectionY;
                                this.device.queue.writeBuffer(this.uniformBuffer, 0, new Float32Array([this.projectionX, this.projectionY]));
                                // 投影变化时需要重建primitive bind group
                                currentPrimitiveBindGroup = null;
                                this.invalidatePrimitiveBindGroup();
                            }
                            renderPassEncoder = this.beginRenderPass(commandEncoder, currentTargetView, 'load');
                            // beginRenderPass现在总是附加depthStencil以保证Pipeline兼容性
                            currentRenderPassHasDepthStencil = true;
                            data.buffer.restoreStencil();
                            data.buffer.restoreScissor();
                            break;
                        }
                        case 0 /* TEXTURE */: {
                            if (!renderPassEncoder || !data.texture) {
                                break;
                            }
                            var filter = data.filter;
                            // 所有RenderPass现在都有depthStencil attachment，所以总是使用stencil变体的Pipeline
                            var stencil = true;
                            if (filter && (filter.type === "colorTransform" || filter.type === "blurX" ||
                                filter.type === "blurY" || filter.type === "glow")) {
                                // 使用filter-specific pipeline
                                var pipeline = this.getFilterPipeline(filter, stencil);
                                if (!pipeline) {
                                    console.warn('getFilterPipeline returned null for filter type:', filter.type, 'stencil:', stencil);
                                    break;
                                }
                                renderPassEncoder.setPipeline(pipeline);
                                // group(0): texture bind group
                                var textureView = this.getTextureView(data.texture);
                                var sampler = data.texture["smoothing"] === false ?
                                    this.samplerCache['nearest'] : this.samplerCache['linear'];
                                var textureBindGroup = this.device.createBindGroup({
                                    layout: this.bindGroupLayoutCache['texture'],
                                    entries: [
                                        { binding: 0, resource: { buffer: this.uniformBuffer } },
                                        { binding: 1, resource: sampler },
                                        { binding: 2, resource: textureView },
                                    ]
                                });
                                renderPassEncoder.setBindGroup(0, textureBindGroup);
                                // group(1): filter uniform bind group
                                var filterBindGroup = this.createFilterBindGroup(filter, data.textureWidth || 1, data.textureHeight || 1);
                                if (filterBindGroup) {
                                    renderPassEncoder.setBindGroup(1, filterBindGroup);
                                }
                                if (stencil) {
                                    renderPassEncoder.setStencilReference(this.activatedBuffer.stencilHandleCount);
                                }
                            }
                            else {
                                // 标准纹理管线
                                var pipeline = this.getTexturePipeline(this.currentBlendMode, stencil);
                                renderPassEncoder.setPipeline(pipeline);
                                var textureView = this.getTextureView(data.texture);
                                var sampler = data.texture["smoothing"] === false ?
                                    this.samplerCache['nearest'] : this.samplerCache['linear'];
                                var bindGroup = this.device.createBindGroup({
                                    layout: this.bindGroupLayoutCache['texture'],
                                    entries: [
                                        { binding: 0, resource: { buffer: this.uniformBuffer } },
                                        { binding: 1, resource: sampler },
                                        { binding: 2, resource: textureView },
                                    ]
                                });
                                renderPassEncoder.setBindGroup(0, bindGroup);
                                if (stencil) {
                                    renderPassEncoder.setStencilReference(this.activatedBuffer.stencilHandleCount);
                                }
                            }
                            var indexCount = data.count * 3;
                            renderPassEncoder.drawIndexed(indexCount, 1, offset);
                            offset += indexCount;
                            if (this.activatedBuffer && this.activatedBuffer.$computeDrawCall) {
                                this.activatedBuffer.$drawCalls++;
                            }
                            break;
                        }
                        case 1 /* RECT */: {
                            if (!renderPassEncoder)
                                break;
                            // 所有RenderPass现在都有depthStencil attachment，所以总是使用stencil变体的Pipeline
                            var stencil = true;
                            var pipeline = this.getPrimitivePipeline(this.currentBlendMode, stencil);
                            renderPassEncoder.setPipeline(pipeline);
                            // 使用缓存的primitive bind group
                            if (!currentPrimitiveBindGroup) {
                                currentPrimitiveBindGroup = this.getPrimitiveBindGroup();
                            }
                            renderPassEncoder.setBindGroup(0, currentPrimitiveBindGroup);
                            if (stencil) {
                                renderPassEncoder.setStencilReference(this.activatedBuffer.stencilHandleCount);
                            }
                            var indexCount = data.count * 3;
                            renderPassEncoder.drawIndexed(indexCount, 1, offset);
                            offset += indexCount;
                            if (this.activatedBuffer && this.activatedBuffer.$computeDrawCall) {
                                this.activatedBuffer.$drawCalls++;
                            }
                            break;
                        }
                        case 2 /* PUSH_MASK */: {
                            if (!renderPassEncoder || !this.activatedBuffer) {
                                offset += data.count * 3;
                                break;
                            }
                            var buffer = this.activatedBuffer;
                            var renderTarget = buffer.rootRenderTarget;
                            // 惰性创建depth-stencil纹理
                            renderTarget.enabledStencil();
                            if (buffer.stencilHandleCount == 0) {
                                // 首次push mask：需要重启render pass以附加depth-stencil
                                renderPassEncoder.end();
                                this.device.queue.submit([commandEncoder.finish()]);
                                commandEncoder = this.device.createCommandEncoder();
                                renderPassEncoder = this.beginRenderPass(commandEncoder, currentTargetView, 'load', true);
                                // beginRenderPass总是附加depthStencil
                                currentRenderPassHasDepthStencil = true;
                            }
                            var level = buffer.stencilHandleCount;
                            buffer.stencilHandleCount++;
                            // 画mask几何：stencil INCR，不写颜色
                            var pushPipeline = this.pipelineCache['stencil_push'];
                            renderPassEncoder.setPipeline(pushPipeline);
                            renderPassEncoder.setStencilReference(level);
                            if (!currentPrimitiveBindGroup) {
                                currentPrimitiveBindGroup = this.getPrimitiveBindGroup();
                            }
                            renderPassEncoder.setBindGroup(0, currentPrimitiveBindGroup);
                            var indexCount = data.count * 3;
                            renderPassEncoder.drawIndexed(indexCount, 1, offset);
                            offset += indexCount;
                            break;
                        }
                        case 3 /* POP_MASK */: {
                            if (!renderPassEncoder || !this.activatedBuffer) {
                                offset += data.count * 3;
                                break;
                            }
                            var buffer = this.activatedBuffer;
                            buffer.stencilHandleCount--;
                            if (buffer.stencilHandleCount == 0) {
                                // 所有mask已弹出：重启render pass，清除stencil缓冲
                                var indexCount = data.count * 3;
                                offset += indexCount;
                                renderPassEncoder.end();
                                this.device.queue.submit([commandEncoder.finish()]);
                                commandEncoder = this.device.createCommandEncoder();
                                // 清除stencil缓冲，确保后续的stencil测试使用正确的初始状态
                                renderPassEncoder = this.beginRenderPass(commandEncoder, currentTargetView, 'load', true);
                                // beginRenderPass总是附加depthStencil
                                currentRenderPassHasDepthStencil = true;
                            }
                            else {
                                var level = buffer.stencilHandleCount;
                                // 画mask几何：stencil DECR，不写颜色
                                var popPipeline = this.pipelineCache['stencil_pop'];
                                renderPassEncoder.setPipeline(popPipeline);
                                renderPassEncoder.setStencilReference(level + 1);
                                if (!currentPrimitiveBindGroup) {
                                    currentPrimitiveBindGroup = this.getPrimitiveBindGroup();
                                }
                                renderPassEncoder.setBindGroup(0, currentPrimitiveBindGroup);
                                var indexCount = data.count * 3;
                                renderPassEncoder.drawIndexed(indexCount, 1, offset);
                                offset += indexCount;
                            }
                            break;
                        }
                        case 4 /* BLEND */: {
                            this.currentBlendMode = data.value;
                            break;
                        }
                        case 5 /* RESIZE_TARGET */: {
                            data.buffer.rootRenderTarget.resize(data.width, data.height);
                            this.onResize(data.width, data.height);
                            // 防止修改当前正在执行的 RenderTarget 导致后续指令产生 CommandBuffer Invalid 错误
                            if (this.activatedBuffer === data.buffer && renderPassEncoder) {
                                renderPassEncoder.end();
                                data.buffer.rootRenderTarget.ensureDepthStencilSize();
                                if (data.buffer.root) {
                                    currentTargetView = this.canvasContext.getCurrentTexture().createView();
                                }
                                else {
                                    currentTargetView = data.buffer.rootRenderTarget.getTextureView();
                                }
                                renderPassEncoder = this.beginRenderPass(commandEncoder, currentTargetView, 'load');
                                currentRenderPassHasDepthStencil = true;
                            }
                            break;
                        }
                        case 6 /* CLEAR_COLOR */: {
                            if (this.activatedBuffer && currentTargetView) {
                                if (renderPassEncoder) {
                                    renderPassEncoder.end();
                                }
                                renderPassEncoder = this.beginRenderPass(commandEncoder, currentTargetView, 'clear');
                                // beginRenderPass总是附加depthStencil
                                currentRenderPassHasDepthStencil = true;
                            }
                            break;
                        }
                        case 8 /* ENABLE_SCISSOR */: {
                            if (renderPassEncoder && this.activatedBuffer) {
                                var renderTargetWidth = this.activatedBuffer.rootRenderTarget.width;
                                var renderTargetHeight = this.activatedBuffer.rootRenderTarget.height;
                                var x = Math.floor(data.x);
                                var y = Math.floor(data.y);
                                var w = Math.ceil(data.width);
                                var h = Math.ceil(data.height);
                                var r = x + w;
                                var b = y + h;
                                // 与渲染目标做交集
                                x = Math.max(0, x);
                                y = Math.max(0, y);
                                r = Math.min(renderTargetWidth, r);
                                b = Math.min(renderTargetHeight, b);
                                w = r - x;
                                h = b - y;
                                if (w <= 0 || h <= 0) {
                                    // 元素完全不在屏幕内，强制设置1x1的裁剪使得元素不被显示出来
                                    x = 0;
                                    y = 0;
                                    w = 1;
                                    h = 1;
                                }
                                renderPassEncoder.setScissorRect(x, y, w, h);
                            }
                            if (this.activatedBuffer) {
                                this.activatedBuffer.$hasScissor = true;
                            }
                            break;
                        }
                        case 9 /* DISABLE_SCISSOR */: {
                            if (renderPassEncoder && this.activatedBuffer) {
                                renderPassEncoder.setScissorRect(0, 0, this.activatedBuffer.rootRenderTarget.width, this.activatedBuffer.rootRenderTarget.height);
                            }
                            if (this.activatedBuffer) {
                                this.activatedBuffer.$hasScissor = false;
                            }
                            break;
                        }
                        case 10 /* SMOOTHING */: {
                            break;
                        }
                    }
                }
                if (renderPassEncoder) {
                    renderPassEncoder.end();
                }
                this.device.queue.submit([commandEncoder.finish()]);
                this.drawCmdManager.clear();
                this.vao.clear();
            };
            // ===================== 滤镜支持 =====================
            WebGPURenderContext.prototype.drawTargetWidthFilters = function (filters, input) {
                var originInput = input, filtersLen = filters.length, output;
                if (filtersLen > 1) {
                    for (var i = 0; i < filtersLen - 1; i++) {
                        var filter_2 = filters[i];
                        var width = input.rootRenderTarget.width;
                        var height = input.rootRenderTarget.height;
                        output = web.WebGPURenderBuffer.create(width, height);
                        var scale = Math.max(egret.sys.DisplayList.$canvasScaleFactor, 2);
                        output.setTransform(scale, 0, 0, scale, 0, 0);
                        output.globalAlpha = 1;
                        this.drawToRenderTarget(filter_2, input, output);
                        if (input != originInput) {
                            web.WebGPURenderBuffer.release(input);
                        }
                        input = output;
                    }
                }
                var filter = filters[filtersLen - 1];
                this.drawToRenderTarget(filter, input, this.currentBuffer);
                if (input != originInput) {
                    web.WebGPURenderBuffer.release(input);
                }
            };
            WebGPURenderContext.prototype.drawToRenderTarget = function (filter, input, output) {
                if (this.contextLost) {
                    return;
                }
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGPU();
                }
                this.pushBuffer(output);
                var originInput = input, temp, width = input.rootRenderTarget.width, height = input.rootRenderTarget.height;
                if (filter.type == "blur") {
                    var blurXFilter = filter.blurXFilter;
                    var blurYFilter = filter.blurYFilter;
                    if (blurXFilter.blurX != 0 && blurYFilter.blurY != 0) {
                        temp = web.WebGPURenderBuffer.create(width, height);
                        var scale_2 = Math.max(egret.sys.DisplayList.$canvasScaleFactor, 2);
                        temp.setTransform(1, 0, 0, 1, 0, 0);
                        temp.transform(scale_2, 0, 0, scale_2, 0, 0);
                        temp.globalAlpha = 1;
                        this.drawToRenderTarget(filter.blurXFilter, input, temp);
                        if (input != originInput) {
                            web.WebGPURenderBuffer.release(input);
                        }
                        input = temp;
                        filter = blurYFilter;
                    }
                    else {
                        filter = blurXFilter.blurX === 0 ? blurYFilter : blurXFilter;
                    }
                }
                output.saveTransform();
                var scale = Math.max(egret.sys.DisplayList.$canvasScaleFactor, 2);
                output.transform(1 / scale, 0, 0, 1 / scale, 0, 0);
                output.transform(1, 0, 0, -1, 0, height);
                output.currentTexture = input.rootRenderTarget.texture;
                this.vao.cacheArrays(output, 0, 0, width, height, 0, 0, width, height, width, height);
                output.restoreTransform();
                this.drawCmdManager.pushDrawTexture(input.rootRenderTarget.texture, 2, filter, width, height);
                if (input != originInput) {
                    web.WebGPURenderBuffer.release(input);
                }
                this.popBuffer();
            };
            // ===================== $beforeRender =====================
            WebGPURenderContext.prototype.$beforeRender = function () {
                this.currentBlendMode = "source-over";
            };
            // ===================== 静态初始化 =====================
            WebGPURenderContext.initBlendMode = function () {
                WebGPURenderContext.blendModesForGPU = {};
                WebGPURenderContext.blendModesForGPU["source-over"] = {
                    color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
                    alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' }
                };
                WebGPURenderContext.blendModesForGPU["lighter"] = {
                    color: { srcFactor: 'one', dstFactor: 'one', operation: 'add' },
                    alpha: { srcFactor: 'one', dstFactor: 'one', operation: 'add' }
                };
                WebGPURenderContext.blendModesForGPU["lighter-in"] = {
                    color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' },
                    alpha: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' }
                };
                WebGPURenderContext.blendModesForGPU["destination-out"] = {
                    color: { srcFactor: 'zero', dstFactor: 'one-minus-src-alpha', operation: 'add' },
                    alpha: { srcFactor: 'zero', dstFactor: 'one-minus-src-alpha', operation: 'add' }
                };
                WebGPURenderContext.blendModesForGPU["destination-in"] = {
                    color: { srcFactor: 'zero', dstFactor: 'src-alpha', operation: 'add' },
                    alpha: { srcFactor: 'zero', dstFactor: 'src-alpha', operation: 'add' }
                };
            };
            WebGPURenderContext.FILTER_UNIFORM_SIZE = 512; // 足够容纳最大的filter uniform数据
            // ===== 混合模式映射 =====
            WebGPURenderContext.blendModesForGPU = null;
            return WebGPURenderContext;
        }());
        web.WebGPURenderContext = WebGPURenderContext;
        __reflect(WebGPURenderContext.prototype, "egret.web.WebGPURenderContext");
        WebGPURenderContext.initBlendMode();
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        var blendModes = ["source-over", "lighter", "destination-out"];
        var defaultCompositeOp = "source-over";
        var BLACK_COLOR = "#000000";
        var CAPS_STYLES = { none: 'butt', square: 'square', round: 'round' };
        /**
         * @private
         * WebGPU渲染器
         * 对标WebGLRenderer，实现sys.SystemRenderer接口
         */
        var WebGPURenderer = /** @class */ (function () {
            function WebGPURenderer() {
                this.wxiOS10 = false;
                this.nestLevel = 0;
            }
            /**
             * 渲染一个显示对象
             */
            WebGPURenderer.prototype.render = function (displayObject, buffer, matrix, forRenderTexture) {
                var gpuBuffer = buffer;
                var gpuBufferContext = gpuBuffer.context;
                this.nestLevel++;
                var root = forRenderTexture ? displayObject : null;
                gpuBufferContext.pushBuffer(gpuBuffer);
                // 设置全局变换矩阵
                gpuBuffer.transform(matrix.a, matrix.b, matrix.c, matrix.d, 0, 0);
                this.drawDisplayObject(displayObject, gpuBuffer, matrix.tx, matrix.ty, true);
                gpuBufferContext.$drawWebGPU();
                var drawCall = gpuBuffer.$drawCalls;
                gpuBuffer.onRenderFinish();
                gpuBufferContext.popBuffer();
                var invert = egret.Matrix.create();
                matrix.$invertInto(invert);
                gpuBuffer.transform(invert.a, invert.b, invert.c, invert.d, 0, 0);
                egret.Matrix.release(invert);
                this.nestLevel--;
                if (this.nestLevel === 0) {
                    // 最大缓存6个渲染缓冲
                    if (web.gpuRenderBufferPool.length > 6) {
                        web.gpuRenderBufferPool.length = 6;
                    }
                    var length_14 = web.gpuRenderBufferPool.length;
                    for (var i = 0; i < length_14; i++) {
                        web.gpuRenderBufferPool[i].resize(0, 0);
                    }
                }
                return drawCall;
            };
            /**
             * @private
             * 绘制一个显示对象
             */
            WebGPURenderer.prototype.drawDisplayObject = function (displayObject, buffer, offsetX, offsetY, isStage) {
                var drawCalls = 0;
                var node;
                var displayList = displayObject.$displayList;
                if (displayList && !isStage) {
                    if (displayObject.$cacheDirty || displayObject.$renderDirty ||
                        displayList.$canvasScaleX != egret.sys.DisplayList.$canvasScaleX ||
                        displayList.$canvasScaleY != egret.sys.DisplayList.$canvasScaleY) {
                        drawCalls += displayList.drawToSurface();
                    }
                    node = displayList.$renderNode;
                }
                else {
                    if (displayObject.$renderDirty) {
                        node = displayObject.$getRenderNode();
                    }
                    else {
                        node = displayObject.$renderNode;
                    }
                }
                displayObject.$cacheDirty = false;
                if (node) {
                    drawCalls++;
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    switch (node.type) {
                        case 1 /* BitmapNode */:
                            this.renderBitmap(node, buffer);
                            break;
                        case 2 /* TextNode */:
                            this.renderText(node, buffer);
                            break;
                        case 3 /* GraphicsNode */:
                            this.renderGraphics(node, buffer);
                            break;
                        case 4 /* GroupNode */:
                            this.renderGroup(node, buffer);
                            break;
                        case 5 /* MeshNode */:
                            this.renderMesh(node, buffer);
                            break;
                        case 6 /* NormalBitmapNode */:
                            this.renderNormalBitmap(node, buffer);
                            break;
                    }
                    buffer.$offsetX = 0;
                    buffer.$offsetY = 0;
                }
                if (displayList && !isStage) {
                    return drawCalls;
                }
                var children = displayObject.$children;
                if (children) {
                    if (displayObject.sortableChildren && displayObject.$sortDirty) {
                        displayObject.sortChildren();
                    }
                    var length_15 = children.length;
                    for (var i = 0; i < length_15; i++) {
                        var child = children[i];
                        var offsetX2 = void 0;
                        var offsetY2 = void 0;
                        var tempAlpha = void 0;
                        var tempTintColor = void 0;
                        if (child.$alpha != 1) {
                            tempAlpha = buffer.globalAlpha;
                            buffer.globalAlpha *= child.$alpha;
                        }
                        if (child.tint !== 0xFFFFFF) {
                            tempTintColor = buffer.globalTintColor;
                            buffer.globalTintColor = child.$tintRGB;
                        }
                        var savedMatrix = void 0;
                        if (child.$useTranslate) {
                            var m = child.$getMatrix();
                            offsetX2 = offsetX + child.$x;
                            offsetY2 = offsetY + child.$y;
                            var m2 = buffer.globalMatrix;
                            savedMatrix = egret.Matrix.create();
                            savedMatrix.a = m2.a;
                            savedMatrix.b = m2.b;
                            savedMatrix.c = m2.c;
                            savedMatrix.d = m2.d;
                            savedMatrix.tx = m2.tx;
                            savedMatrix.ty = m2.ty;
                            buffer.transform(m.a, m.b, m.c, m.d, offsetX2, offsetY2);
                            offsetX2 = -child.$anchorOffsetX;
                            offsetY2 = -child.$anchorOffsetY;
                        }
                        else {
                            offsetX2 = offsetX + child.$x - child.$anchorOffsetX;
                            offsetY2 = offsetY + child.$y - child.$anchorOffsetY;
                        }
                        switch (child.$renderMode) {
                            case 1 /* NONE */:
                                break;
                            case 2 /* FILTER */:
                                drawCalls += this.drawWithFilter(child, buffer, offsetX2, offsetY2);
                                break;
                            case 3 /* CLIP */:
                                drawCalls += this.drawWithClip(child, buffer, offsetX2, offsetY2);
                                break;
                            case 4 /* SCROLLRECT */:
                                drawCalls += this.drawWithScrollRect(child, buffer, offsetX2, offsetY2);
                                break;
                            default:
                                drawCalls += this.drawDisplayObject(child, buffer, offsetX2, offsetY2);
                                break;
                        }
                        if (tempAlpha) {
                            buffer.globalAlpha = tempAlpha;
                        }
                        if (tempTintColor) {
                            buffer.globalTintColor = tempTintColor;
                        }
                        if (savedMatrix) {
                            var m = buffer.globalMatrix;
                            m.a = savedMatrix.a;
                            m.b = savedMatrix.b;
                            m.c = savedMatrix.c;
                            m.d = savedMatrix.d;
                            m.tx = savedMatrix.tx;
                            m.ty = savedMatrix.ty;
                            egret.Matrix.release(savedMatrix);
                        }
                    }
                }
                return drawCalls;
            };
            /**
             * @private
             * 带滤镜绘制
             */
            WebGPURenderer.prototype.drawWithFilter = function (displayObject, buffer, offsetX, offsetY) {
                var drawCalls = 0;
                if (displayObject.$children && displayObject.$children.length == 0 && (!displayObject.$renderNode || displayObject.$renderNode.$getRenderCount() == 0)) {
                    return drawCalls;
                }
                var filters = displayObject.$filters;
                var hasBlendMode = (displayObject.$blendMode !== 0);
                var compositeOp;
                if (hasBlendMode) {
                    compositeOp = blendModes[displayObject.$blendMode];
                    if (!compositeOp) {
                        compositeOp = defaultCompositeOp;
                    }
                }
                var displayBounds = displayObject.$getOriginalBounds();
                var displayBoundsX = displayBounds.x;
                var displayBoundsY = displayBounds.y;
                var displayBoundsWidth = displayBounds.width;
                var displayBoundsHeight = displayBounds.height;
                if (displayBoundsWidth <= 0 || displayBoundsHeight <= 0) {
                    return drawCalls;
                }
                // 单一colorTransform滤镜优化
                if (!displayObject.mask && filters.length == 1 && (filters[0].type == "colorTransform" || (filters[0].type === "custom" && filters[0].padding === 0))) {
                    var childrenDrawCount = this.getRenderCount(displayObject);
                    if (!displayObject.$children || childrenDrawCount == 1) {
                        if (hasBlendMode) {
                            buffer.context.setGlobalCompositeOperation(compositeOp);
                        }
                        buffer.context.$filter = filters[0];
                        if (displayObject.$mask) {
                            drawCalls += this.drawWithClip(displayObject, buffer, offsetX, offsetY);
                        }
                        else if (displayObject.$scrollRect || displayObject.$maskRect) {
                            drawCalls += this.drawWithScrollRect(displayObject, buffer, offsetX, offsetY);
                        }
                        else {
                            drawCalls += this.drawDisplayObject(displayObject, buffer, offsetX, offsetY);
                        }
                        buffer.context.$filter = null;
                        if (hasBlendMode) {
                            buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                        }
                        return drawCalls;
                    }
                }
                // 为显示对象创建一个新的buffer
                var scale = Math.max(egret.sys.DisplayList.$canvasScaleFactor, 2);
                filters.forEach(function (filter) {
                    if (filter instanceof egret.GlowFilter || filter instanceof egret.BlurFilter) {
                        filter.$uniforms.$filterScale = scale;
                        if (filter.type == 'blur') {
                            var blurFilter = filter;
                            blurFilter.blurXFilter.$uniforms.$filterScale = scale;
                            blurFilter.blurYFilter.$uniforms.$filterScale = scale;
                        }
                    }
                });
                var displayBuffer = this.createRenderBuffer(scale * displayBoundsWidth, scale * displayBoundsHeight);
                displayBuffer.saveTransform();
                displayBuffer.transform(scale, 0, 0, scale, 0, 0);
                displayBuffer.context.pushBuffer(displayBuffer);
                if (displayObject.$mask) {
                    drawCalls += this.drawWithClip(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
                }
                else if (displayObject.$scrollRect || displayObject.$maskRect) {
                    drawCalls += this.drawWithScrollRect(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
                }
                else {
                    drawCalls += this.drawDisplayObject(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
                }
                displayBuffer.context.popBuffer();
                displayBuffer.restoreTransform();
                if (drawCalls > 0) {
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(compositeOp);
                    }
                    drawCalls++;
                    buffer.$offsetX = offsetX + displayBoundsX;
                    buffer.$offsetY = offsetY + displayBoundsY;
                    var savedMatrix = egret.Matrix.create();
                    var curMatrix = buffer.globalMatrix;
                    savedMatrix.a = curMatrix.a;
                    savedMatrix.b = curMatrix.b;
                    savedMatrix.c = curMatrix.c;
                    savedMatrix.d = curMatrix.d;
                    savedMatrix.tx = curMatrix.tx;
                    savedMatrix.ty = curMatrix.ty;
                    buffer.useOffset();
                    buffer.context.drawTargetWidthFilters(filters, displayBuffer);
                    curMatrix.a = savedMatrix.a;
                    curMatrix.b = savedMatrix.b;
                    curMatrix.c = savedMatrix.c;
                    curMatrix.d = savedMatrix.d;
                    curMatrix.tx = savedMatrix.tx;
                    curMatrix.ty = savedMatrix.ty;
                    egret.Matrix.release(savedMatrix);
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    }
                }
                web.gpuRenderBufferPool.push(displayBuffer);
                return drawCalls;
            };
            WebGPURenderer.prototype.getRenderCount = function (displayObject) {
                var drawCount = 0;
                var node = displayObject.$getRenderNode();
                if (node) {
                    drawCount += node.$getRenderCount();
                }
                if (displayObject.$children) {
                    for (var _i = 0, _a = displayObject.$children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        var filters = child.$filters;
                        if (filters && filters.length > 0) {
                            return 2;
                        }
                        else if (child.$children) {
                            drawCount += this.getRenderCount(child);
                        }
                        else {
                            var node_2 = child.$getRenderNode();
                            if (node_2) {
                                drawCount += node_2.$getRenderCount();
                            }
                        }
                    }
                }
                return drawCount;
            };
            /**
             * @private
             * 带clip遮罩绘制
             */
            WebGPURenderer.prototype.drawWithClip = function (displayObject, buffer, offsetX, offsetY) {
                var drawCalls = 0;
                var hasBlendMode = (displayObject.$blendMode !== 0);
                var compositeOp;
                if (hasBlendMode) {
                    compositeOp = blendModes[displayObject.$blendMode];
                    if (!compositeOp) {
                        compositeOp = defaultCompositeOp;
                    }
                }
                var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
                var mask = displayObject.$mask;
                if (mask) {
                    var maskRenderMatrix = mask.$getMatrix();
                    if ((maskRenderMatrix.a == 0 && maskRenderMatrix.b == 0) || (maskRenderMatrix.c == 0 && maskRenderMatrix.d == 0)) {
                        return drawCalls;
                    }
                }
                if (!mask && (!displayObject.$children || displayObject.$children.length == 0)) {
                    if (scrollRect) {
                        buffer.context.pushMask(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
                    }
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(compositeOp);
                    }
                    drawCalls += this.drawDisplayObject(displayObject, buffer, offsetX, offsetY);
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    }
                    if (scrollRect) {
                        buffer.context.popMask();
                    }
                    return drawCalls;
                }
                else {
                    var displayBounds = displayObject.$getOriginalBounds();
                    var displayBoundsX = displayBounds.x;
                    var displayBoundsY = displayBounds.y;
                    var displayBoundsWidth = displayBounds.width;
                    var displayBoundsHeight = displayBounds.height;
                    if (displayBoundsWidth <= 0 || displayBoundsHeight <= 0) {
                        return drawCalls;
                    }
                    var displayBuffer = this.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
                    displayBuffer.context.pushBuffer(displayBuffer);
                    drawCalls += this.drawDisplayObject(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
                    if (mask) {
                        var maskBuffer = this.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
                        maskBuffer.context.pushBuffer(maskBuffer);
                        var maskMatrix = egret.Matrix.create();
                        maskMatrix.copyFrom(mask.$getConcatenatedMatrix());
                        mask.$getConcatenatedMatrixAt(displayObject, maskMatrix);
                        maskMatrix.translate(-displayBoundsX, -displayBoundsY);
                        maskBuffer.setTransform(maskMatrix.a, maskMatrix.b, maskMatrix.c, maskMatrix.d, maskMatrix.tx, maskMatrix.ty);
                        egret.Matrix.release(maskMatrix);
                        drawCalls += this.drawDisplayObject(mask, maskBuffer, 0, 0);
                        maskBuffer.context.popBuffer();
                        displayBuffer.context.setGlobalCompositeOperation("destination-in");
                        displayBuffer.setTransform(1, 0, 0, -1, 0, maskBuffer.height);
                        var maskBufferWidth = maskBuffer.rootRenderTarget.width;
                        var maskBufferHeight = maskBuffer.rootRenderTarget.height;
                        displayBuffer.context.drawTexture(maskBuffer.rootRenderTarget.texture, 0, 0, maskBufferWidth, maskBufferHeight, 0, 0, maskBufferWidth, maskBufferHeight, maskBufferWidth, maskBufferHeight);
                        displayBuffer.setTransform(1, 0, 0, 1, 0, 0);
                        displayBuffer.context.setGlobalCompositeOperation("source-over");
                        maskBuffer.setTransform(1, 0, 0, 1, 0, 0);
                        web.gpuRenderBufferPool.push(maskBuffer);
                    }
                    displayBuffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    displayBuffer.context.popBuffer();
                    if (drawCalls > 0) {
                        drawCalls++;
                        if (hasBlendMode) {
                            buffer.context.setGlobalCompositeOperation(compositeOp);
                        }
                        if (scrollRect) {
                            buffer.context.pushMask(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
                        }
                        var savedMatrix = egret.Matrix.create();
                        var curMatrix = buffer.globalMatrix;
                        savedMatrix.a = curMatrix.a;
                        savedMatrix.b = curMatrix.b;
                        savedMatrix.c = curMatrix.c;
                        savedMatrix.d = curMatrix.d;
                        savedMatrix.tx = curMatrix.tx;
                        savedMatrix.ty = curMatrix.ty;
                        curMatrix.append(1, 0, 0, -1, offsetX + displayBoundsX, offsetY + displayBoundsY + displayBuffer.height);
                        var displayBufferWidth = displayBuffer.rootRenderTarget.width;
                        var displayBufferHeight = displayBuffer.rootRenderTarget.height;
                        buffer.context.drawTexture(displayBuffer.rootRenderTarget.texture, 0, 0, displayBufferWidth, displayBufferHeight, 0, 0, displayBufferWidth, displayBufferHeight, displayBufferWidth, displayBufferHeight);
                        if (scrollRect) {
                            buffer.context.popMask();
                        }
                        if (hasBlendMode) {
                            buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                        }
                        var matrix = buffer.globalMatrix;
                        matrix.a = savedMatrix.a;
                        matrix.b = savedMatrix.b;
                        matrix.c = savedMatrix.c;
                        matrix.d = savedMatrix.d;
                        matrix.tx = savedMatrix.tx;
                        matrix.ty = savedMatrix.ty;
                        egret.Matrix.release(savedMatrix);
                    }
                    web.gpuRenderBufferPool.push(displayBuffer);
                    return drawCalls;
                }
            };
            /**
             * @private
             * 带scrollRect绘制
             */
            WebGPURenderer.prototype.drawWithScrollRect = function (displayObject, buffer, offsetX, offsetY) {
                var drawCalls = 0;
                var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
                if (scrollRect.isEmpty()) {
                    return drawCalls;
                }
                if (displayObject.$scrollRect) {
                    offsetX -= scrollRect.x;
                    offsetY -= scrollRect.y;
                }
                var m = buffer.globalMatrix;
                var context = buffer.context;
                var scissor = false;
                if (buffer.$hasScissor || m.b != 0 || m.c != 0) {
                    buffer.context.pushMask(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
                }
                else {
                    var a = m.a;
                    var d = m.d;
                    var tx = m.tx;
                    var ty = m.ty;
                    var x = scrollRect.x + offsetX;
                    var y = scrollRect.y + offsetY;
                    var xMax = x + scrollRect.width;
                    var yMax = y + scrollRect.height;
                    var minX = void 0, minY = void 0, maxX = void 0, maxY = void 0;
                    if (a == 1.0 && d == 1.0) {
                        minX = x + tx;
                        minY = y + ty;
                        maxX = xMax + tx;
                        maxY = yMax + ty;
                    }
                    else {
                        var x0 = a * x + tx;
                        var y0 = d * y + ty;
                        var x1 = a * xMax + tx;
                        var y1 = d * y + ty;
                        var x2 = a * xMax + tx;
                        var y2 = d * yMax + ty;
                        var x3 = a * x + tx;
                        var y3 = d * yMax + ty;
                        var tmp = 0;
                        if (x0 > x1) {
                            tmp = x0;
                            x0 = x1;
                            x1 = tmp;
                        }
                        if (x2 > x3) {
                            tmp = x2;
                            x2 = x3;
                            x3 = tmp;
                        }
                        minX = (x0 < x2 ? x0 : x2);
                        maxX = (x1 > x3 ? x1 : x3);
                        if (y0 > y1) {
                            tmp = y0;
                            y0 = y1;
                            y1 = tmp;
                        }
                        if (y2 > y3) {
                            tmp = y2;
                            y2 = y3;
                            y3 = tmp;
                        }
                        minY = (y0 < y2 ? y0 : y2);
                        maxY = (y1 > y3 ? y1 : y3);
                    }
                    context.enableScissor(minX, -maxY + buffer.height, maxX - minX, maxY - minY);
                    scissor = true;
                }
                drawCalls += this.drawDisplayObject(displayObject, buffer, offsetX, offsetY);
                if (scissor) {
                    context.disableScissor();
                }
                else {
                    context.popMask();
                }
                return drawCalls;
            };
            /**
             * 将一个RenderNode对象绘制到渲染缓冲
             */
            WebGPURenderer.prototype.drawNodeToBuffer = function (node, buffer, matrix, forHitTest) {
                var gpuBuffer = buffer;
                gpuBuffer.context.pushBuffer(gpuBuffer);
                gpuBuffer.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                this.renderNode(node, gpuBuffer, 0, 0, forHitTest);
                gpuBuffer.context.$drawWebGPU();
                gpuBuffer.onRenderFinish();
                gpuBuffer.context.popBuffer();
            };
            /**
             * @private
             */
            WebGPURenderer.prototype.renderNode = function (node, buffer, offsetX, offsetY, forHitTest) {
                buffer.$offsetX = offsetX;
                buffer.$offsetY = offsetY;
                switch (node.type) {
                    case 1 /* BitmapNode */:
                        this.renderBitmap(node, buffer);
                        break;
                    case 2 /* TextNode */:
                        this.renderText(node, buffer);
                        break;
                    case 3 /* GraphicsNode */:
                        this.renderGraphics(node, buffer, forHitTest);
                        break;
                    case 4 /* GroupNode */:
                        this.renderGroup(node, buffer);
                        break;
                    case 5 /* MeshNode */:
                        this.renderMesh(node, buffer);
                        break;
                    case 6 /* NormalBitmapNode */:
                        this.renderNormalBitmap(node, buffer);
                        break;
                }
            };
            /**
             * @private
             */
            WebGPURenderer.prototype.renderNormalBitmap = function (node, buffer) {
                var image = node.image;
                if (!image) {
                    return;
                }
                buffer.context.drawImage(image, node.sourceX, node.sourceY, node.sourceW, node.sourceH, node.drawX, node.drawY, node.drawW, node.drawH, node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
            };
            /**
             * @private
             */
            WebGPURenderer.prototype.renderBitmap = function (node, buffer) {
                var image = node.image;
                if (!image) {
                    return;
                }
                var data = node.drawData;
                var length = data.length;
                var pos = 0;
                var m = node.matrix;
                var blendMode = node.blendMode;
                var alpha = node.alpha;
                var savedMatrix;
                var offsetX;
                var offsetY;
                if (m) {
                    savedMatrix = egret.Matrix.create();
                    var curMatrix = buffer.globalMatrix;
                    savedMatrix.a = curMatrix.a;
                    savedMatrix.b = curMatrix.b;
                    savedMatrix.c = curMatrix.c;
                    savedMatrix.d = curMatrix.d;
                    savedMatrix.tx = curMatrix.tx;
                    savedMatrix.ty = curMatrix.ty;
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                if (blendMode) {
                    buffer.context.setGlobalCompositeOperation(blendModes[blendMode]);
                }
                var originAlpha;
                if (alpha == alpha) {
                    originAlpha = buffer.globalAlpha;
                    buffer.globalAlpha *= alpha;
                }
                if (node.filter) {
                    buffer.context.$filter = node.filter;
                    while (pos < length) {
                        buffer.context.drawImage(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
                    }
                    buffer.context.$filter = null;
                }
                else {
                    while (pos < length) {
                        buffer.context.drawImage(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
                    }
                }
                if (blendMode) {
                    buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                }
                if (alpha == alpha) {
                    buffer.globalAlpha = originAlpha;
                }
                if (m) {
                    var matrix = buffer.globalMatrix;
                    matrix.a = savedMatrix.a;
                    matrix.b = savedMatrix.b;
                    matrix.c = savedMatrix.c;
                    matrix.d = savedMatrix.d;
                    matrix.tx = savedMatrix.tx;
                    matrix.ty = savedMatrix.ty;
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    egret.Matrix.release(savedMatrix);
                }
            };
            /**
             * @private
             */
            WebGPURenderer.prototype.renderMesh = function (node, buffer) {
                var image = node.image;
                var data = node.drawData;
                var length = data.length;
                var pos = 0;
                var m = node.matrix;
                var blendMode = node.blendMode;
                var alpha = node.alpha;
                var savedMatrix;
                var offsetX;
                var offsetY;
                if (m) {
                    savedMatrix = egret.Matrix.create();
                    var curMatrix = buffer.globalMatrix;
                    savedMatrix.a = curMatrix.a;
                    savedMatrix.b = curMatrix.b;
                    savedMatrix.c = curMatrix.c;
                    savedMatrix.d = curMatrix.d;
                    savedMatrix.tx = curMatrix.tx;
                    savedMatrix.ty = curMatrix.ty;
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                if (blendMode) {
                    buffer.context.setGlobalCompositeOperation(blendModes[blendMode]);
                }
                var originAlpha;
                if (alpha == alpha) {
                    originAlpha = buffer.globalAlpha;
                    buffer.globalAlpha *= alpha;
                }
                if (node.filter) {
                    buffer.context.$filter = node.filter;
                    while (pos < length) {
                        buffer.context.drawMesh(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.uvs, node.vertices, node.indices, node.bounds, node.rotated, node.smoothing);
                    }
                    buffer.context.$filter = null;
                }
                else {
                    while (pos < length) {
                        buffer.context.drawMesh(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.uvs, node.vertices, node.indices, node.bounds, node.rotated, node.smoothing);
                    }
                }
                if (blendMode) {
                    buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                }
                if (alpha == alpha) {
                    buffer.globalAlpha = originAlpha;
                }
                if (m) {
                    var matrix = buffer.globalMatrix;
                    matrix.a = savedMatrix.a;
                    matrix.b = savedMatrix.b;
                    matrix.c = savedMatrix.c;
                    matrix.d = savedMatrix.d;
                    matrix.tx = savedMatrix.tx;
                    matrix.ty = savedMatrix.ty;
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    egret.Matrix.release(savedMatrix);
                }
            };
            /**
             * @private
             * 渲染文本节点（通过Canvas2D渲染后上传为纹理）
             */
            WebGPURenderer.prototype.renderText = function (node, buffer) {
                var width = node.width - node.x;
                var height = node.height - node.y;
                if (width <= 0 || height <= 0 || !width || !height || node.drawData.length == 0) {
                    return;
                }
                var canvasScaleX = egret.sys.DisplayList.$canvasScaleX;
                var canvasScaleY = egret.sys.DisplayList.$canvasScaleY;
                var maxTextureSize = buffer.context.$maxTextureSize;
                if (width * canvasScaleX > maxTextureSize) {
                    canvasScaleX *= maxTextureSize / (width * canvasScaleX);
                }
                if (height * canvasScaleY > maxTextureSize) {
                    canvasScaleY *= maxTextureSize / (height * canvasScaleY);
                }
                width *= canvasScaleX;
                height *= canvasScaleY;
                var x = node.x * canvasScaleX;
                var y = node.y * canvasScaleY;
                if (node.$canvasScaleX != canvasScaleX || node.$canvasScaleY != canvasScaleY) {
                    node.$canvasScaleX = canvasScaleX;
                    node.$canvasScaleY = canvasScaleY;
                    node.dirtyRender = true;
                }
                if (!this.canvasRenderBuffer || !this.canvasRenderBuffer.context) {
                    this.canvasRenderer = new egret.CanvasRenderer();
                    this.canvasRenderBuffer = new web.CanvasRenderBuffer(width, height);
                }
                else if (node.dirtyRender) {
                    this.canvasRenderBuffer.resize(width, height);
                }
                if (!this.canvasRenderBuffer.context) {
                    return;
                }
                if (canvasScaleX != 1 || canvasScaleY != 1) {
                    this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
                }
                if (x || y) {
                    if (node.dirtyRender) {
                        this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, -x, -y);
                    }
                    buffer.transform(1, 0, 0, 1, x / canvasScaleX, y / canvasScaleY);
                }
                else if (canvasScaleX != 1 || canvasScaleY != 1) {
                    this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
                }
                if (node.dirtyRender) {
                    var surface = this.canvasRenderBuffer.surface;
                    this.canvasRenderer.renderText(node, this.canvasRenderBuffer.context);
                    // 创建或更新GPU纹理
                    var texture = node.$texture;
                    if (!texture) {
                        texture = buffer.context.createTexture(surface);
                        node.$texture = texture;
                    }
                    else {
                        texture = buffer.context.updateTexture(texture, surface);
                        node.$texture = texture;
                    }
                    node.$textureWidth = surface.width;
                    node.$textureHeight = surface.height;
                }
                var textureWidth = node.$textureWidth;
                var textureHeight = node.$textureHeight;
                // 使用drawImage来渲染文本纹理，让其处理render target的坐标翻转
                // 创建一个临时BitmapData对象来包装纹理
                var tempBitmapData = { source: null };
                tempBitmapData["gpuTexture"] = node.$texture;
                buffer.context.drawImage(tempBitmapData, 0, 0, textureWidth, textureHeight, 0, 0, textureWidth / canvasScaleX, textureHeight / canvasScaleY, textureWidth, textureHeight, false);
                if (x || y) {
                    if (node.dirtyRender) {
                        this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
                    }
                    buffer.transform(1, 0, 0, 1, -x / canvasScaleX, -y / canvasScaleY);
                }
                node.dirtyRender = false;
            };
            /**
             * @private
             * 渲染Graphics节点（通过Canvas2D渲染后上传为纹理）
             */
            WebGPURenderer.prototype.renderGraphics = function (node, buffer, forHitTest) {
                var width = node.width;
                var height = node.height;
                if (width <= 0 || height <= 0 || !width || !height || node.drawData.length == 0) {
                    return;
                }
                var canvasScaleX = egret.sys.DisplayList.$canvasScaleX;
                var canvasScaleY = egret.sys.DisplayList.$canvasScaleY;
                if (width * canvasScaleX < 1 || height * canvasScaleY < 1) {
                    canvasScaleX = canvasScaleY = 1;
                }
                if (node.$canvasScaleX != canvasScaleX || node.$canvasScaleY != canvasScaleY) {
                    node.$canvasScaleX = canvasScaleX;
                    node.$canvasScaleY = canvasScaleY;
                    node.dirtyRender = true;
                }
                width = width * canvasScaleX;
                height = height * canvasScaleY;
                var width2 = Math.ceil(width);
                var height2 = Math.ceil(height);
                canvasScaleX *= width2 / width;
                canvasScaleY *= height2 / height;
                width = width2;
                height = height2;
                if (!this.canvasRenderBuffer || !this.canvasRenderBuffer.context) {
                    this.canvasRenderer = new egret.CanvasRenderer();
                    this.canvasRenderBuffer = new web.CanvasRenderBuffer(width, height);
                }
                else if (node.dirtyRender) {
                    this.canvasRenderBuffer.resize(width, height);
                }
                if (!this.canvasRenderBuffer.context) {
                    return;
                }
                if (canvasScaleX != 1 || canvasScaleY != 1) {
                    this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
                }
                if (node.x || node.y) {
                    if (node.dirtyRender || forHitTest) {
                        this.canvasRenderBuffer.context.translate(-node.x, -node.y);
                    }
                    buffer.transform(1, 0, 0, 1, node.x, node.y);
                }
                var surface = this.canvasRenderBuffer.surface;
                if (forHitTest) {
                    this.canvasRenderer.renderGraphics(node, this.canvasRenderBuffer.context, true);
                    var texture = buffer.context.createTexture(surface);
                    // 使用drawImage来渲染Graphics纹理，让其处理render target的坐标翻转
                    var tempBitmapData = { source: null };
                    tempBitmapData["gpuTexture"] = texture;
                    buffer.context.drawImage(tempBitmapData, 0, 0, width, height, 0, 0, width, height, surface.width, surface.height, false);
                }
                else {
                    if (node.dirtyRender) {
                        this.canvasRenderer.renderGraphics(node, this.canvasRenderBuffer.context);
                        var texture = node.$texture;
                        if (!texture) {
                            texture = buffer.context.createTexture(surface);
                            node.$texture = texture;
                        }
                        else {
                            texture = buffer.context.updateTexture(texture, surface);
                            node.$texture = texture;
                        }
                        node.$textureWidth = surface.width;
                        node.$textureHeight = surface.height;
                    }
                    var textureWidth = node.$textureWidth;
                    var textureHeight = node.$textureHeight;
                    // 使用drawImage来渲染Graphics纹理，让其处理render target的坐标翻转
                    var tempBitmapData = { source: null };
                    tempBitmapData["gpuTexture"] = node.$texture;
                    buffer.context.drawImage(tempBitmapData, 0, 0, textureWidth, textureHeight, 0, 0, textureWidth / canvasScaleX, textureHeight / canvasScaleY, textureWidth, textureHeight, false);
                }
                if (node.x || node.y) {
                    if (node.dirtyRender || forHitTest) {
                        this.canvasRenderBuffer.context.translate(node.x, node.y);
                    }
                    buffer.transform(1, 0, 0, 1, -node.x, -node.y);
                }
                if (!forHitTest) {
                    node.dirtyRender = false;
                }
            };
            WebGPURenderer.prototype.renderGroup = function (groupNode, buffer) {
                var m = groupNode.matrix;
                var savedMatrix;
                var offsetX;
                var offsetY;
                if (m) {
                    savedMatrix = egret.Matrix.create();
                    var curMatrix = buffer.globalMatrix;
                    savedMatrix.a = curMatrix.a;
                    savedMatrix.b = curMatrix.b;
                    savedMatrix.c = curMatrix.c;
                    savedMatrix.d = curMatrix.d;
                    savedMatrix.tx = curMatrix.tx;
                    savedMatrix.ty = curMatrix.ty;
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                var children = groupNode.drawData;
                var length = children.length;
                for (var i = 0; i < length; i++) {
                    var node = children[i];
                    this.renderNode(node, buffer, buffer.$offsetX, buffer.$offsetY);
                }
                if (m) {
                    var matrix = buffer.globalMatrix;
                    matrix.a = savedMatrix.a;
                    matrix.b = savedMatrix.b;
                    matrix.c = savedMatrix.c;
                    matrix.d = savedMatrix.d;
                    matrix.tx = savedMatrix.tx;
                    matrix.ty = savedMatrix.ty;
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    egret.Matrix.release(savedMatrix);
                }
            };
            /**
             * @private
             */
            WebGPURenderer.prototype.createRenderBuffer = function (width, height) {
                var buffer = web.gpuRenderBufferPool.pop();
                if (buffer) {
                    buffer.resize(width, height);
                    buffer.setTransform(1, 0, 0, 1, 0, 0);
                }
                else {
                    buffer = new web.WebGPURenderBuffer(width, height);
                    buffer.$computeDrawCall = false;
                }
                return buffer;
            };
            WebGPURenderer.prototype.renderClear = function () {
                var renderContext = web.WebGPURenderContext.getInstance();
                renderContext.$beforeRender();
            };
            return WebGPURenderer;
        }());
        web.WebGPURenderer = WebGPURenderer;
        __reflect(WebGPURenderer.prototype, "egret.web.WebGPURenderer", ["egret.sys.SystemRenderer"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var WebGPUUtils = /** @class */ (function () {
            function WebGPUUtils() {
            }
            /**
             * 同步检查是否支持WebGPU
             */
            WebGPUUtils.checkCanUseWebGPU = function () {
                var _this = this;
                if (!navigator.gpu) {
                    this._webgpuSupported = false;
                    return false;
                }
                // 如果已经检查过，直接返回
                if (this._webgpuSupported !== null) {
                    return this._webgpuSupported;
                }
                // 首次检查时，进行异步检查但先返回true（假设支持）
                // 实际的支持情况会在初始化时被发现
                this._webgpuSupported = true;
                this.checkWebGPUSupportAsync().then(function (supported) {
                    _this._webgpuSupported = supported;
                }).catch(function () {
                    _this._webgpuSupported = false;
                });
                return true;
            };
            /**
             * 异步检查WebGPU支持
             */
            WebGPUUtils.checkWebGPUSupportAsync = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        if (this._checkPromise) {
                            return [2 /*return*/, this._checkPromise];
                        }
                        this._checkPromise = (function () { return __awaiter(_this, void 0, void 0, function () {
                            var device, adapter, result, e_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!navigator.gpu) {
                                            return [2 /*return*/, false];
                                        }
                                        device = null;
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 4, 5, 6]);
                                        return [4 /*yield*/, navigator.gpu.requestAdapter({
                                                powerPreference: 'high-performance'
                                            })];
                                    case 2:
                                        adapter = _a.sent();
                                        if (!adapter) {
                                            return [2 /*return*/, false];
                                        }
                                        return [4 /*yield*/, adapter.requestDevice()];
                                    case 3:
                                        device = _a.sent();
                                        if (!device) {
                                            return [2 /*return*/, false];
                                        }
                                        result = this.checkRequiredFeatures(adapter, device);
                                        return [2 /*return*/, result];
                                    case 4:
                                        e_2 = _a.sent();
                                        console.warn('WebGPU support check failed:', e_2);
                                        return [2 /*return*/, false];
                                    case 5:
                                        // 释放检测用的device，避免资源泄漏
                                        if (device) {
                                            device.destroy();
                                        }
                                        return [7 /*endfinally*/];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); })();
                        return [2 /*return*/, this._checkPromise];
                    });
                });
            };
            /**
             * 检查必要的WebGPU特性
             */
            WebGPUUtils.checkRequiredFeatures = function (adapter, device) {
                // 检查基本能力
                var limits = device.limits;
                var requiredCapabilities = {
                    maxTextureDimension2D: 2048,
                    maxComputeWorkgroupSizeX: 128,
                    maxComputeWorkgroupSizeY: 128,
                    maxBindGroups: 4,
                    maxBindingsPerBindGroup: 256
                };
                for (var _i = 0, _a = Object.entries(requiredCapabilities); _i < _a.length; _i++) {
                    var _b = _a[_i], key = _b[0], minValue = _b[1];
                    // 注意：这里 key in limits 检查对于继承的属性可能不够严谨，
                    // 但对于 device.limits 这种常量对象通常是足够的。
                    if (key in limits && limits[key] < minValue) {
                        console.warn("Device limit " + key + " (" + limits[key] + ") is below required value (" + minValue + ")");
                        return false;
                    }
                }
                return true;
            };
            /**
             * 创建WebGPU渲染管线
             */
            WebGPUUtils.createRenderPipeline = function (device, format) {
                return __awaiter(this, void 0, void 0, function () {
                    var pipelineDescriptor;
                    return __generator(this, function (_a) {
                        pipelineDescriptor = {
                            layout: 'auto',
                            vertex: {
                                module: device.createShaderModule({
                                    code: web.WGShaderLib.default_vert
                                }),
                                entryPoint: 'main',
                                buffers: [
                                    {
                                        arrayStride: 20,
                                        attributes: [
                                            {
                                                // position
                                                shaderLocation: 0,
                                                offset: 0,
                                                // *** 关键修改：使用 as GPUVertexFormat ***
                                                format: 'float32x2'
                                            },
                                            {
                                                // uv
                                                shaderLocation: 1,
                                                offset: 8,
                                                // *** 关键修改：使用 as GPUVertexFormat ***
                                                format: 'float32x2'
                                            },
                                            {
                                                // color
                                                shaderLocation: 2,
                                                offset: 16,
                                                // *** 关键修改：使用 as GPUVertexFormat ***
                                                format: 'unorm8x4'
                                            }
                                        ]
                                        // *** 关键修改：整个 attributes 数组也断言为 GPUVertexAttribute[] ***
                                    } // 整个 VertexBufferLayout 对象断言
                                ]
                            },
                            fragment: {
                                module: device.createShaderModule({
                                    code: web.WGShaderLib.default_frag
                                }),
                                entryPoint: 'main',
                                targets: [
                                    {
                                        format: format,
                                        blend: {
                                            color: {
                                                srcFactor: 'src-alpha',
                                                dstFactor: 'one-minus-src-alpha',
                                                operation: 'add' // *** 关键修改：使用 as GPUBlendOperation ***
                                            },
                                            alpha: {
                                                srcFactor: 'one',
                                                dstFactor: 'one-minus-src-alpha',
                                                operation: 'add' // *** 关键修改：使用 as GPUBlendOperation ***
                                            }
                                        }
                                    } // 整个 ColorTargetState 对象断言
                                ]
                            },
                            primitive: {
                                topology: 'triangle-list',
                                cullMode: 'none',
                                frontFace: 'ccw' // *** 关键修改：使用 as GPUFrontFace ***
                            }
                        };
                        return [2 /*return*/, device.createRenderPipeline(pipelineDescriptor)];
                    });
                });
            };
            /**
             * 预乘alpha到tintColor中（从WebGLUtils移植，消除对WebGL模块的依赖）
             * inspired by pixi.js
             */
            WebGPUUtils.premultiplyTint = function (tint, alpha) {
                if (alpha === 1.0) {
                    return (alpha * 255 << 24) + tint;
                }
                if (alpha === 0.0) {
                    return 0;
                }
                var R = ((tint >> 16) & 0xFF);
                var G = ((tint >> 8) & 0xFF);
                var B = (tint & 0xFF);
                R = ((R * alpha) + 0.5) | 0;
                G = ((G * alpha) + 0.5) | 0;
                B = ((B * alpha) + 0.5) | 0;
                return (alpha * 255 << 24) + (R << 16) + (G << 8) + B;
            };
            WebGPUUtils._webgpuSupported = null;
            WebGPUUtils._checkPromise = null;
            return WebGPUUtils;
        }());
        web.WebGPUUtils = WebGPUUtils;
        __reflect(WebGPUUtils.prototype, "egret.web.WebGPUUtils");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * WGSL着色器库
         *
         * 绑定布局约定：
         *   group(0) binding(0) = uniform buffer (projectionVector)   [VERTEX]
         *   group(0) binding(1) = sampler                              [FRAGMENT]
         *   group(0) binding(2) = texture_2d                           [FRAGMENT]
         *   group(1) binding(0) = filter uniform buffer (可选)         [FRAGMENT]
         *
         * 注意：实际运行时的着色器由 WebGPURenderContext 的 getXxxShaderCode() 方法生成。
         * 本文件保留着色器字符串供参考和调试使用。
         */
        var WGShaderLib = /** @class */ (function () {
            function WGShaderLib() {
            }
            // ===== 默认顶点着色器（从uniform读取projectionVector）=====
            /**
             * 顶点着色器：从uniform读取projectionVector
             */
            WGShaderLib.default_vert = "struct Uniforms {\n    projectionVector: vec2<f32>,\n};\n\n@group(0) @binding(0)\nvar<uniform> u: Uniforms;\n\nstruct VertexOutput {\n    @builtin(position) position: vec4<f32>,\n    @location(0) vTextureCoord: vec2<f32>,\n    @location(1) vColor: vec4<f32>,\n};\n\n@vertex\nfn main(\n    @location(0) aVertexPosition: vec2<f32>,\n    @location(1) aTextureCoord: vec2<f32>,\n    @location(2) aColor: vec4<f32>,\n) -> VertexOutput {\n    var output: VertexOutput;\n    let center = vec2<f32>(-1.0, 1.0);\n    output.position = vec4<f32>((aVertexPosition / u.projectionVector) + center, 0.0, 1.0);\n    output.vTextureCoord = aTextureCoord;\n    output.vColor = aColor;\n    return output;\n}";
            // ===== 纹理片段着色器 =====
            /**
             * 纹理片段着色器
             */
            WGShaderLib.texture_frag = "struct FragmentInput {\n    @location(0) vTextureCoord: vec2<f32>,\n    @location(1) vColor: vec4<f32>,\n};\n\n@group(0) @binding(1)\nvar uSampler: sampler;\n\n@group(0) @binding(2)\nvar uTexture: texture_2d<f32>;\n\n@fragment\nfn main(input: FragmentInput) -> @location(0) vec4<f32> {\n    // WebGPU \u7EB9\u7406\u5750\u6807\u539F\u70B9\u5728\u5DE6\u4E0A\uFF0C\u9700\u8981\u7FFB\u8F6C V \u5750\u6807\n    let uv = vec2<f32>(input.vTextureCoord.x, 1.0 - input.vTextureCoord.y);\n    return textureSample(uTexture, uSampler, uv) * input.vColor;\n}";
            // ===== 纯色片段着色器（矩形/遮罩）=====
            /**
             * 纯色片段着色器（用于矩形/遮罩）
             */
            WGShaderLib.primitive_frag = "struct FragmentInput {\n    @location(0) vTextureCoord: vec2<f32>,\n    @location(1) vColor: vec4<f32>,\n};\n\n@fragment\nfn main(input: FragmentInput) -> @location(0) vec4<f32> {\n    return input.vColor;\n}";
            // default_frag 和 primitive_frag 相同
            WGShaderLib.default_frag = WGShaderLib.primitive_frag;
            // ===== blur片段着色器 =====
            // group(1) binding(0): BlurUniforms { blur: vec2, padding, uTextureSize: vec2, padding }
            /**
             * blur片段着色器
             * group(1): binding(0)=uniform(blur: vec2, padding, uTextureSize: vec2, padding)
             */
            WGShaderLib.blur_frag = "struct FragmentInput {\n    @location(0) vTextureCoord: vec2<f32>,\n    @location(1) vColor: vec4<f32>,\n};\n\nstruct BlurUniforms {\n    blur: vec2<f32>,\n    padding: vec2<f32>,\n    uTextureSize: vec2<f32>,\n    padding2: vec2<f32>,\n};\n\n@group(1) @binding(0)\nvar<uniform> bu: BlurUniforms;\n\n@group(0) @binding(1)\nvar uSampler: sampler;\n\n@group(0) @binding(2)\nvar uTexture: texture_2d<f32>;\n\n@fragment\nfn main(input: FragmentInput) -> @location(0) vec4<f32> {\n    let sampleRadius = 5;\n    let samples = sampleRadius * 2 + 1;\n    var blurUv = bu.blur / bu.uTextureSize;\n    var color = vec4<f32>(0.0, 0.0, 0.0, 0.0);\n    var uv = vec2<f32>(0.0, 0.0);\n    blurUv = blurUv / f32(sampleRadius);\n\n    for (var i = -sampleRadius; i <= sampleRadius; i = i + 1) {\n        uv.x = input.vTextureCoord.x + f32(i) * blurUv.x;\n        uv.y = input.vTextureCoord.y + f32(i) * blurUv.y;\n        color = color + textureSample(uTexture, uSampler, uv);\n    }\n\n    color = color / f32(samples);\n    return color;\n}";
            // ===== colorTransform片段着色器 =====
            // group(1) binding(0): ColorMatrix { matrix: mat4x4, colorAdd: vec4 }
            /**
             * colorTransform片段着色器
             * group(0): binding(0)=uniform(projectionVector), binding(1)=sampler, binding(2)=texture
             * group(1): binding(0)=uniform(ColorMatrix: mat4x4+vec4)
             */
            WGShaderLib.colorTransform_frag = "struct FragmentInput {\n    @location(0) vTextureCoord: vec2<f32>,\n    @location(1) vColor: vec4<f32>,\n};\n\nstruct ColorMatrix {\n    matrix: mat4x4<f32>,\n    colorAdd: vec4<f32>,\n};\n\n@group(1) @binding(0)\nvar<uniform> cm: ColorMatrix;\n\n@group(0) @binding(1)\nvar uSampler: sampler;\n\n@group(0) @binding(2)\nvar uTexture: texture_2d<f32>;\n\n@fragment\nfn main(input: FragmentInput) -> @location(0) vec4<f32> {\n    var texColor = textureSample(uTexture, uSampler, input.vTextureCoord);\n    if (texColor.a > 0.0) {\n        texColor = vec4<f32>(texColor.rgb / texColor.a, texColor.a);\n    }\n    var locColor = clamp(texColor * cm.matrix + cm.colorAdd, vec4<f32>(0.0), vec4<f32>(1.0));\n    return input.vColor * vec4<f32>(locColor.rgb * locColor.a, locColor.a);\n}";
            // ===== glow片段着色器 =====
            // group(1) binding(0): GlowUniforms
            /**
             * glow片段着色器
             * group(1): binding(0)=uniform(GlowUniforms)
             */
            WGShaderLib.glow_frag = "struct FragmentInput {\n    @location(0) vTextureCoord: vec2<f32>,\n    @location(1) vColor: vec4<f32>,\n};\n\nstruct GlowUniforms {\n    dist: f32,\n    angle: f32,\n    padding0: vec2<f32>,\n    color: vec4<f32>,\n    alpha: f32,\n    blurX: f32,\n    blurY: f32,\n    strength: f32,\n    inner: f32,\n    knockout: f32,\n    hideObject: f32,\n    padding1: f32,\n    uTextureSize: vec2<f32>,\n    padding2: vec2<f32>,\n};\n\n@group(1) @binding(0)\nvar<uniform> gu: GlowUniforms;\n\n@group(0) @binding(1)\nvar uSampler: sampler;\n\n@group(0) @binding(2)\nvar uTexture: texture_2d<f32>;\n\nfn random(scale: vec2<f32>, fragCoord: vec2<f32>) -> f32 {\n    return fract(sin(dot(fragCoord, scale)) * 43758.5453);\n}\n\n@fragment\nfn main(input: FragmentInput, @builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {\n    let px = vec2<f32>(1.0 / gu.uTextureSize.x, 1.0 / gu.uTextureSize.y);\n    let linearSamplingTimes = 7.0;\n    let circleSamplingTimes = 12.0;\n    var ownColor = textureSample(uTexture, uSampler, input.vTextureCoord);\n    var curColor: vec4<f32>;\n    var totalAlpha = 0.0;\n    var maxTotalAlpha = 0.0;\n    var curDistanceX = 0.0;\n    var curDistanceY = 0.0;\n    var offsetX = gu.dist * cos(gu.angle) * px.x;\n    var offsetY = gu.dist * sin(gu.angle) * px.y;\n\n    let PI = 3.14159265358979323846264;\n    var cosAngle: f32;\n    var sinAngle: f32;\n    var offset = PI * 2.0 / circleSamplingTimes * random(vec2<f32>(12.9898, 78.233), fragCoord.xy);\n    var stepX = gu.blurX * px.x / linearSamplingTimes;\n    var stepY = gu.blurY * px.y / linearSamplingTimes;\n\n    var a = 0.0;\n    loop {\n        if (a > PI * 2.0) {\n            break;\n        }\n        cosAngle = cos(a + offset);\n        sinAngle = sin(a + offset);\n        for (var i = 1.0; i <= linearSamplingTimes; i = i + 1.0) {\n            curDistanceX = i * stepX * cosAngle;\n            curDistanceY = i * stepY * sinAngle;\n            let sampleX = input.vTextureCoord.x + curDistanceX - offsetX;\n            let sampleY = input.vTextureCoord.y + curDistanceY + offsetY;\n            let sampleCoord = clamp(vec2<f32>(sampleX, sampleY), vec2<f32>(0.0, 0.0), vec2<f32>(1.0, 1.0));\n            curColor = textureSample(uTexture, uSampler, sampleCoord);\n            let inBounds = f32(sampleX >= 0.0 && sampleY <= 1.0);\n            totalAlpha = totalAlpha + (linearSamplingTimes - i) * curColor.a * inBounds;\n            maxTotalAlpha = maxTotalAlpha + (linearSamplingTimes - i);\n        }\n        a = a + PI * 2.0 / circleSamplingTimes;\n    }\n\n    ownColor.a = max(ownColor.a, 0.0001);\n    ownColor = vec4<f32>(ownColor.rgb / ownColor.a, ownColor.a);\n\n    let outerGlowAlpha = (totalAlpha / maxTotalAlpha) * gu.strength * gu.alpha * (1.0 - gu.inner) * max(min(gu.hideObject, gu.knockout), 1.0 - ownColor.a);\n    let innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * gu.strength * gu.alpha * gu.inner * ownColor.a;\n\n    ownColor.a = max(ownColor.a * gu.knockout * (1.0 - gu.hideObject), 0.0001);\n    let mix1 = mix(ownColor.rgb, gu.color.rgb, innerGlowAlpha / (innerGlowAlpha + ownColor.a));\n    let mix2 = mix(mix1, gu.color.rgb, outerGlowAlpha / (innerGlowAlpha + ownColor.a + outerGlowAlpha));\n    let resultAlpha = min(ownColor.a + outerGlowAlpha + innerGlowAlpha, 1.0);\n    return vec4<f32>(mix2 * resultAlpha, resultAlpha);\n}";
            // ===== ETC alpha mask 变体 =====
            // 这些着色器需要额外的 sampler/texture 绑定用于alpha mask
            WGShaderLib.texture_etc_alphamask_frag = "struct FragmentInput {\n    @location(0) vTextureCoord: vec2<f32>,\n    @location(1) vColor: vec4<f32>,\n};\n\n@group(0) @binding(1)\nvar uSampler: sampler;\n\n@group(0) @binding(2)\nvar uTexture: texture_2d<f32>;\n\n@group(0) @binding(3)\nvar uSamplerAlphaMask: sampler;\n\n@group(0) @binding(4)\nvar uTextureAlphaMask: texture_2d<f32>;\n\n@fragment\nfn main(input: FragmentInput) -> @location(0) vec4<f32> {\n     // WebGPU \u7EB9\u7406\u5750\u6807\u539F\u70B9\u5728\u5DE6\u4E0A\uFF0C\u9700\u8981\u7FFB\u8F6C V \u5750\u6807\n     let uv = vec2<f32>(input.vTextureCoord.x, 1.0 - input.vTextureCoord.y);\n     let alpha = textureSample(uTextureAlphaMask, uSamplerAlphaMask, uv).r;\n     if (alpha < 0.0039) {\n         discard;\n     }\n     var v4Color = textureSample(uTexture, uSampler, uv);\n     v4Color = vec4<f32>(v4Color.rgb * alpha, alpha);\n     return v4Color * input.vColor;\n}";
            WGShaderLib.colorTransform_frag_etc_alphamask_frag = "struct FragmentInput {\n    @location(0) vTextureCoord: vec2<f32>,\n    @location(1) vColor: vec4<f32>,\n};\n\nstruct ColorMatrix {\n    matrix: mat4x4<f32>,\n    colorAdd: vec4<f32>,\n};\n\n@group(1) @binding(0)\nvar<uniform> cm: ColorMatrix;\n\n@group(0) @binding(1)\nvar uSampler: sampler;\n\n@group(0) @binding(2)\nvar uTexture: texture_2d<f32>;\n\n@group(0) @binding(3)\nvar uSamplerAlphaMask: sampler;\n\n@group(0) @binding(4)\nvar uTextureAlphaMask: texture_2d<f32>;\n\n@fragment\nfn main(input: FragmentInput) -> @location(0) vec4<f32> {\n     // WebGPU \u7EB9\u7406\u5750\u6807\u539F\u70B9\u5728\u5DE6\u4E0A\uFF0C\u9700\u8981\u7FFB\u8F6C V \u5750\u6807\n     let uv = vec2<f32>(input.vTextureCoord.x, 1.0 - input.vTextureCoord.y);\n     let alpha = textureSample(uTextureAlphaMask, uSamplerAlphaMask, uv).r;\n     if (alpha < 0.0039) {\n         discard;\n     }\n     var texColor = textureSample(uTexture, uSampler, uv);\n     if (texColor.a > 0.0) {\n         texColor = vec4<f32>(texColor.rgb / texColor.a, texColor.a);\n     }\n     var v4Color = clamp(texColor * cm.matrix + cm.colorAdd, vec4<f32>(0.0), vec4<f32>(1.0));\n     v4Color = vec4<f32>(v4Color.rgb * alpha, alpha);\n     return v4Color * input.vColor;\n}";
            return WGShaderLib;
        }());
        web.WGShaderLib = WGShaderLib;
        __reflect(WGShaderLib.prototype, "egret.web.WGShaderLib");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
;
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * WebGPU绘制指令管理器
         * 与WebGLDrawCmdManager功能一致：维护drawData数组，支持批次合并
         */
        var WebGPUDrawCmdManager = /** @class */ (function () {
            function WebGPUDrawCmdManager() {
                /**
                 * 用于缓存绘制命令的数组
                 */
                this.drawData = [];
                this.drawDataLen = 0;
            }
            /**
             * 压入绘制矩形指令
             */
            WebGPUDrawCmdManager.prototype.pushDrawRect = function () {
                if (this.drawDataLen == 0 || this.drawData[this.drawDataLen - 1].type != 1 /* RECT */) {
                    var data = this.drawData[this.drawDataLen] || {};
                    data.type = 1 /* RECT */;
                    data.count = 0;
                    this.drawData[this.drawDataLen] = data;
                    this.drawDataLen++;
                }
                this.drawData[this.drawDataLen - 1].count += 2;
            };
            /**
             * 压入绘制texture指令
             */
            WebGPUDrawCmdManager.prototype.pushDrawTexture = function (texture, count, filter, textureWidth, textureHeight) {
                if (count === void 0) { count = 2; }
                if (filter) {
                    // 有滤镜的情况下不合并绘制
                    var data = this.drawData[this.drawDataLen] || {};
                    data.type = 0 /* TEXTURE */;
                    data.texture = texture;
                    data.filter = filter;
                    data.count = count;
                    data.textureWidth = textureWidth;
                    data.textureHeight = textureHeight;
                    this.drawData[this.drawDataLen] = data;
                    this.drawDataLen++;
                }
                else {
                    if (this.drawDataLen == 0 ||
                        this.drawData[this.drawDataLen - 1].type != 0 /* TEXTURE */ ||
                        texture != this.drawData[this.drawDataLen - 1].texture ||
                        this.drawData[this.drawDataLen - 1].filter) {
                        var data = this.drawData[this.drawDataLen] || {};
                        data.type = 0 /* TEXTURE */;
                        data.texture = texture;
                        data.count = 0;
                        this.drawData[this.drawDataLen] = data;
                        this.drawDataLen++;
                    }
                    this.drawData[this.drawDataLen - 1].count += count;
                }
            };
            /**
             * 压入smoothing变更指令
             */
            WebGPUDrawCmdManager.prototype.pushChangeSmoothing = function (texture, smoothing) {
                texture["smoothing"] = smoothing;
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 10 /* SMOOTHING */;
                data.texture = texture;
                data.smoothing = smoothing;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 压入pushMask指令
             */
            WebGPUDrawCmdManager.prototype.pushPushMask = function (count) {
                if (count === void 0) { count = 1; }
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 2 /* PUSH_MASK */;
                data.count = count * 2;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 压入popMask指令
             */
            WebGPUDrawCmdManager.prototype.pushPopMask = function (count) {
                if (count === void 0) { count = 1; }
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 3 /* POP_MASK */;
                data.count = count * 2;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 压入混色指令
             * 优化：从尾部向前搜索，跳过冗余blend命令（不使用splice避免O(n)位移）
             */
            WebGPUDrawCmdManager.prototype.pushSetBlend = function (value) {
                var len = this.drawDataLen;
                // 从尾部向前查找：如果在遇到绘制指令之前发现了相同的blend指令，则跳过
                for (var i = len - 1; i >= 0; i--) {
                    var data = this.drawData[i];
                    if (!data)
                        continue;
                    if (data.type == 0 /* TEXTURE */ || data.type == 1 /* RECT */ ||
                        data.type == 2 /* PUSH_MASK */ || data.type == 3 /* POP_MASK */) {
                        break; // 遇到绘制指令，需要新的blend
                    }
                    if (data.type == 4 /* BLEND */) {
                        if (data.value == value) {
                            return; // 已经是相同blend模式，跳过
                        }
                        // 不同blend模式但没有绘制指令间隔，直接覆盖
                        data.value = value;
                        return;
                    }
                }
                var _data = this.drawData[this.drawDataLen] || {};
                _data.type = 4 /* BLEND */;
                _data.value = value;
                this.drawData[this.drawDataLen] = _data;
                this.drawDataLen++;
            };
            /**
             * 压入resize render target命令
             */
            WebGPUDrawCmdManager.prototype.pushResize = function (buffer, width, height) {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 5 /* RESIZE_TARGET */;
                data.buffer = buffer;
                data.width = width;
                data.height = height;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 压入clear color命令
             */
            WebGPUDrawCmdManager.prototype.pushClearColor = function () {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 6 /* CLEAR_COLOR */;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 压入激活buffer命令
             * 优化：从尾部向前搜索，覆盖冗余ACT_BUFFER命令（不使用splice避免O(n)位移）
             */
            WebGPUDrawCmdManager.prototype.pushActivateBuffer = function (buffer) {
                var len = this.drawDataLen;
                // 从尾部向前查找：如果在遇到绘制指令之前发现了ACT_BUFFER，直接覆盖
                for (var i = len - 1; i >= 0; i--) {
                    var data = this.drawData[i];
                    if (!data)
                        continue;
                    if (data.type != 4 /* BLEND */ && data.type != 7 /* ACT_BUFFER */) {
                        break; // 遇到绘制指令或其他指令，需要新的ACT_BUFFER
                    }
                    if (data.type == 7 /* ACT_BUFFER */) {
                        // 没有绘制指令间隔，直接覆盖
                        data.buffer = buffer;
                        data.width = buffer.rootRenderTarget.width;
                        data.height = buffer.rootRenderTarget.height;
                        return;
                    }
                }
                var _data = this.drawData[this.drawDataLen] || {};
                _data.type = 7 /* ACT_BUFFER */;
                _data.buffer = buffer;
                _data.width = buffer.rootRenderTarget.width;
                _data.height = buffer.rootRenderTarget.height;
                this.drawData[this.drawDataLen] = _data;
                this.drawDataLen++;
            };
            /**
             * 压入enable scissor命令
             */
            WebGPUDrawCmdManager.prototype.pushEnableScissor = function (x, y, width, height) {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 8 /* ENABLE_SCISSOR */;
                data.x = x;
                data.y = y;
                data.width = width;
                data.height = height;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 压入disable scissor命令
             */
            WebGPUDrawCmdManager.prototype.pushDisableScissor = function () {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 9 /* DISABLE_SCISSOR */;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 清空命令数组
             */
            WebGPUDrawCmdManager.prototype.clear = function () {
                for (var i = 0; i < this.drawDataLen; i++) {
                    var data = this.drawData[i];
                    data.type = 0;
                    data.count = 0;
                    data.texture = null;
                    data.filter = null;
                    data.value = "";
                    data.buffer = null;
                    data.width = 0;
                    data.height = 0;
                    data.textureWidth = 0;
                    data.textureHeight = 0;
                    data.smoothing = false;
                    data.x = 0;
                    data.y = 0;
                }
                this.drawDataLen = 0;
            };
            return WebGPUDrawCmdManager;
        }());
        web.WebGPUDrawCmdManager = WebGPUDrawCmdManager;
        __reflect(WebGPUDrawCmdManager.prototype, "egret.web.WebGPUDrawCmdManager");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * WebGPU渲染目标
         * 管理离屏渲染纹理，对应WebGL中的framebuffer+texture
         * 同时管理depth-stencil纹理（惰性创建，仅在需要stencil mask时创建）
         */
        var WebGPURenderTarget = /** @class */ (function (_super) {
            __extends(WebGPURenderTarget, _super);
            function WebGPURenderTarget(width, height) {
                var _this = _super.call(this) || this;
                /**
                 * 离屏渲染纹理（非root时使用）
                 */
                _this.texture = null;
                /**
                 * 纹理视图
                 */
                _this.textureView = null;
                /**
                 * depth-stencil纹理（惰性创建）
                 */
                _this.depthStencilTexture = null;
                /**
                 * depth-stencil纹理视图
                 */
                _this.depthStencilTextureView = null;
                /**
                 * 清除颜色
                 */
                _this.clearColor = [0, 0, 0, 0];
                /**
                 * 是否使用离屏纹理渲染（类似WebGL的useFrameBuffer）
                 */
                _this.useFrameBuffer = true;
                /**
                 * 是否已启用模版缓冲
                 */
                _this._stencilEnabled = false;
                _this._resize(width, height);
                return _this;
            }
            WebGPURenderTarget.prototype._resize = function (width, height) {
                width = Math.max(width || 1, 1);
                height = Math.max(height || 1, 1);
                this.width = width;
                this.height = height;
            };
            /**
              * 调整渲染目标大小
              */
            WebGPURenderTarget.prototype.resize = function (width, height) {
                this._resize(width, height);
                // 销毁旧纹理 - 使用延迟销毁避免WebGPU错误
                var context = web.WebGPURenderContext.getInstance();
                if (this.texture) {
                    // 使用context的延迟销毁机制
                    context.deleteGPUTexture(this.texture);
                    this.texture = null;
                    this.textureView = null;
                }
                // 销毁旧depth-stencil纹理
                // 重要：depthStencil也必须使用延迟销毁机制
                if (this.depthStencilTexture) {
                    var dsTexture = this.depthStencilTexture;
                    this.depthStencilTexture = null;
                    this.depthStencilTextureView = null;
                    // depthStencil纹理也使用延迟销毁
                    context.deleteGPUTexture(dsTexture);
                }
                // 关键修复：如果原来启用了stencil，立即创建新的匹配尺寸的depthStencil纹理
                // 不要等到enabledStencil被调用，因为那时可能已经有RenderPass在等待
                if (this._stencilEnabled) {
                    this.createDepthStencilTexture();
                }
            };
            /**
             * 激活渲染目标 —— 确保离屏纹理已创建
             */
            WebGPURenderTarget.prototype.activate = function () {
                if (!this.useFrameBuffer) {
                    return;
                }
                if (!this.texture) {
                    this.initFrameBuffer();
                }
            };
            /**
             * 创建离屏渲染纹理
             */
            WebGPURenderTarget.prototype.initFrameBuffer = function () {
                if (this.texture) {
                    return;
                }
                var device = web.WebGPURenderContext.getInstance().device;
                if (!device) {
                    return;
                }
                this.texture = device.createTexture({
                    size: { width: this.width, height: this.height, depthOrArrayLayers: 1 },
                    format: navigator.gpu.getPreferredCanvasFormat(),
                    usage: GPUTextureUsage.RENDER_ATTACHMENT |
                        GPUTextureUsage.TEXTURE_BINDING |
                        GPUTextureUsage.COPY_SRC |
                        GPUTextureUsage.COPY_DST,
                });
                this.textureView = this.texture.createView();
            };
            /**
             * 获取渲染通道的颜色附件视图
             * 对于root buffer返回canvas的当前纹理视图，
             * 对于离屏buffer返回离屏纹理视图
             */
            WebGPURenderTarget.prototype.getTextureView = function () {
                if (!this.useFrameBuffer) {
                    // root buffer: 返回canvas当前纹理
                    return null;
                }
                this.activate();
                return this.textureView;
            };
            /**
             * 确保depthStencil纹理尺寸与RenderTarget匹配
             * 如果尺寸不匹配，销毁旧的并创建新的
             */
            WebGPURenderTarget.prototype.ensureDepthStencilSize = function () {
                if (this.depthStencilTexture) {
                    // 检查depthStencil的尺寸是否与renderTarget匹配
                    if (this.depthStencilTexture.width !== this.width || this.depthStencilTexture.height !== this.height) {
                        // 尺寸不匹配，销毁旧的
                        try {
                            this.depthStencilTexture.destroy();
                        }
                        catch (e) {
                            // 忽略销毁失败
                        }
                        this.depthStencilTexture = null;
                        this.depthStencilTextureView = null;
                    }
                }
            };
            /**
             * 惰性创建depth-stencil纹理
             * 对标WebGL中framebuffer上附加的DEPTH_STENCIL renderbuffer
             * 只在首次需要stencil mask时创建
             * RenderTarget resize时会销毁旧的depthStencil纹理
             */
            WebGPURenderTarget.prototype.enabledStencil = function () {
                this._stencilEnabled = true;
                // 先确保尺寸匹配
                this.ensureDepthStencilSize();
                // 如果depthStencil纹理不存在（首次或resize后），创建新的
                if (!this.depthStencilTexture) {
                    this.createDepthStencilTexture();
                }
            };
            Object.defineProperty(WebGPURenderTarget.prototype, "stencilEnabled", {
                /**
                 * 是否已启用stencil
                 */
                get: function () {
                    return this._stencilEnabled;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 创建depth-stencil纹理
             */
            WebGPURenderTarget.prototype.createDepthStencilTexture = function () {
                if (this.depthStencilTexture) {
                    return;
                }
                var device = web.WebGPURenderContext.getInstance().device;
                if (!device) {
                    return;
                }
                this.depthStencilTexture = device.createTexture({
                    size: { width: this.width, height: this.height, depthOrArrayLayers: 1 },
                    format: WebGPURenderTarget.DEPTH_STENCIL_FORMAT,
                    usage: GPUTextureUsage.RENDER_ATTACHMENT,
                });
                this.depthStencilTextureView = this.depthStencilTexture.createView();
            };
            /**
             * 获取depth-stencil纹理视图（可能为null，表示不需要stencil）
             */
            WebGPURenderTarget.prototype.getDepthStencilTextureView = function () {
                return this.depthStencilTextureView;
            };
            /**
             * 清空渲染目标
             */
            WebGPURenderTarget.prototype.clear = function (bind) {
                // WebGPU中clear通过renderPass的loadOp:'clear'实现
                // 这里仅作为标记，实际clear在beginRenderPass时执行
            };
            /**
             * 销毁渲染目标
             */
            WebGPURenderTarget.prototype.dispose = function () {
                if (this.texture) {
                    this.texture.destroy();
                    this.texture = null;
                    this.textureView = null;
                }
                if (this.depthStencilTexture) {
                    this.depthStencilTexture.destroy();
                    this.depthStencilTexture = null;
                    this.depthStencilTextureView = null;
                }
            };
            /**
             * depth-stencil格式
             */
            WebGPURenderTarget.DEPTH_STENCIL_FORMAT = 'depth24plus-stencil8';
            return WebGPURenderTarget;
        }(egret.HashObject));
        web.WebGPURenderTarget = WebGPURenderTarget;
        __reflect(WebGPURenderTarget.prototype, "egret.web.WebGPURenderTarget");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * WebGPU顶点数组管理对象
         * 顶点格式: (x: f32) + (y: f32) + (u: f32) + (v: f32) + (tintcolor: u32) = 5 * 4 bytes = 20 bytes
         */
        var WebGPUVertexArrayObject = /** @class */ (function () {
            function WebGPUVertexArrayObject() {
                /**
                 * 每个顶点的分量数（x, y, u, v, tintcolor）
                 */
                this.vertSize = 5;
                this.vertByteSize = this.vertSize * 4;
                /**
                 * 最大单次提交的quad数量
                 */
                this.maxQuadsCount = 2048;
                /**
                 * quad = 4个顶点
                 */
                this.maxVertexCount = this.maxQuadsCount * 4;
                /**
                 * 配套的索引 = quad * 6
                 */
                this.maxIndicesCount = this.maxQuadsCount * 6;
                this.vertices = null;
                this.indices = null;
                this.indicesForMesh = null;
                this.vertexIndex = 0;
                this.indexIndex = 0;
                this.hasMesh = false;
                this._vertices = null;
                this._verticesFloat32View = null;
                this._verticesUint32View = null;
                this._vertices = new ArrayBuffer(this.maxVertexCount * this.vertByteSize);
                this._verticesFloat32View = new Float32Array(this._vertices);
                this._verticesUint32View = new Uint32Array(this._vertices);
                this.vertices = this._verticesFloat32View;
                // 索引缓冲，预生成quad索引
                // 0->1->2, 0->2->3
                var maxIndicesCount = this.maxIndicesCount;
                this.indices = new Uint16Array(maxIndicesCount);
                this.indicesForMesh = new Uint16Array(maxIndicesCount);
                for (var i = 0, j = 0; i < maxIndicesCount; i += 6, j += 4) {
                    this.indices[i + 0] = j + 0;
                    this.indices[i + 1] = j + 1;
                    this.indices[i + 2] = j + 2;
                    this.indices[i + 3] = j + 0;
                    this.indices[i + 4] = j + 2;
                    this.indices[i + 5] = j + 3;
                }
            }
            /**
             * 是否达到最大缓存数量
             */
            WebGPUVertexArrayObject.prototype.reachMaxSize = function (vertexCount, indexCount) {
                if (vertexCount === void 0) { vertexCount = 4; }
                if (indexCount === void 0) { indexCount = 6; }
                return this.vertexIndex > this.maxVertexCount - vertexCount || this.indexIndex > this.maxIndicesCount - indexCount;
            };
            /**
             * 获取缓存完成的顶点数组
             */
            WebGPUVertexArrayObject.prototype.getVertices = function () {
                return this.vertices.subarray(0, this.vertexIndex * this.vertSize);
            };
            /**
             * 获取缓存完成的索引数组
             */
            WebGPUVertexArrayObject.prototype.getIndices = function () {
                return this.indices;
            };
            /**
             * 获取缓存完成的mesh索引数组
             */
            WebGPUVertexArrayObject.prototype.getMeshIndices = function () {
                return this.indicesForMesh;
            };
            /**
             * 切换成mesh索引缓存方式
             */
            WebGPUVertexArrayObject.prototype.changeToMeshIndices = function () {
                if (!this.hasMesh) {
                    for (var i = 0, l = this.indexIndex; i < l; ++i) {
                        this.indicesForMesh[i] = this.indices[i];
                    }
                    this.hasMesh = true;
                }
            };
            WebGPUVertexArrayObject.prototype.isMesh = function () {
                return this.hasMesh;
            };
            /**
             * 缓存一组顶点
             */
            WebGPUVertexArrayObject.prototype.cacheArrays = function (buffer, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureSourceWidth, textureSourceHeight, meshUVs, meshVertices, meshIndices, rotated) {
                var alpha = buffer.globalAlpha;
                alpha = Math.min(alpha, 1.0);
                var globalTintColor = buffer.globalTintColor;
                var currentTexture = buffer.currentTexture;
                // tintcolor混入alpha
                alpha = ((alpha < 1.0 && currentTexture && currentTexture[egret.UNPACK_PREMULTIPLY_ALPHA_WEBGL]) ?
                    web.WebGPUUtils.premultiplyTint(globalTintColor, alpha)
                    : globalTintColor + (alpha * 255 << 24));
                var locWorldTransform = buffer.globalMatrix;
                var a = locWorldTransform.a;
                var b = locWorldTransform.b;
                var c = locWorldTransform.c;
                var d = locWorldTransform.d;
                var tx = locWorldTransform.tx;
                var ty = locWorldTransform.ty;
                var offsetX = buffer.$offsetX;
                var offsetY = buffer.$offsetY;
                if (offsetX != 0 || offsetY != 0) {
                    tx = offsetX * a + offsetY * c + tx;
                    ty = offsetX * b + offsetY * d + ty;
                }
                if (!meshVertices) {
                    if (destX != 0 || destY != 0) {
                        tx = destX * a + destY * c + tx;
                        ty = destX * b + destY * d + ty;
                    }
                    var a1 = destWidth / sourceWidth;
                    if (a1 != 1) {
                        a = a1 * a;
                        b = a1 * b;
                    }
                    var d1 = destHeight / sourceHeight;
                    if (d1 != 1) {
                        c = d1 * c;
                        d = d1 * d;
                    }
                }
                if (meshVertices) {
                    // mesh 模式
                    var vertices = this.vertices;
                    var verticesUint32View = this._verticesUint32View;
                    var index = this.vertexIndex * this.vertSize;
                    var i = 0, iD = 0, l = 0;
                    var u = 0, v = 0, x = 0, y = 0;
                    for (i = 0, l = meshUVs.length; i < l; i += 2) {
                        iD = index + i * 5 / 2;
                        x = meshVertices[i];
                        y = meshVertices[i + 1];
                        u = meshUVs[i];
                        v = meshUVs[i + 1];
                        // xy
                        vertices[iD + 0] = a * x + c * y + tx;
                        vertices[iD + 1] = b * x + d * y + ty;
                        // uv
                        if (rotated) {
                            vertices[iD + 2] = (sourceX + (1.0 - v) * sourceHeight) / textureSourceWidth;
                            vertices[iD + 3] = (sourceY + u * sourceWidth) / textureSourceHeight;
                        }
                        else {
                            vertices[iD + 2] = (sourceX + u * sourceWidth) / textureSourceWidth;
                            vertices[iD + 3] = (sourceY + v * sourceHeight) / textureSourceHeight;
                        }
                        // alpha
                        verticesUint32View[iD + 4] = alpha;
                    }
                    // 缓存索引数组
                    if (this.hasMesh) {
                        for (var i_3 = 0, l_2 = meshIndices.length; i_3 < l_2; ++i_3) {
                            this.indicesForMesh[this.indexIndex + i_3] = meshIndices[i_3] + this.vertexIndex;
                        }
                    }
                    this.vertexIndex += meshUVs.length / 2;
                    this.indexIndex += meshIndices.length;
                }
                else {
                    var width = textureSourceWidth;
                    var height = textureSourceHeight;
                    var w = sourceWidth;
                    var h = sourceHeight;
                    sourceX = sourceX / width;
                    sourceY = sourceY / height;
                    var vertices = this.vertices;
                    var verticesUint32View = this._verticesUint32View;
                    var index = this.vertexIndex * this.vertSize;
                    var normalizedSourceWidth = sourceWidth / width;
                    var normalizedSourceHeight = sourceHeight / height;
                    // 着色器中已经做了 1.0 - v 翻转
                    // 为了正确显示，顶点中的V坐标也要做相同的翻转
                    // 这样: 顶点V翻转 -> 着色器V翻转 -> 双重翻转 = 取消，回到原始
                    var vStart = 1.0 - sourceY - normalizedSourceHeight;
                    var vEnd = 1.0 - sourceY;
                    if (rotated) {
                        var temp = normalizedSourceWidth;
                        normalizedSourceWidth = normalizedSourceHeight;
                        normalizedSourceHeight = temp;
                        // 顶点0
                        vertices[index++] = tx;
                        vertices[index++] = ty;
                        vertices[index++] = normalizedSourceWidth + sourceX;
                        vertices[index++] = vStart;
                        verticesUint32View[index++] = alpha;
                        // 顶点1
                        vertices[index++] = a * w + tx;
                        vertices[index++] = b * w + ty;
                        vertices[index++] = normalizedSourceWidth + sourceX;
                        vertices[index++] = vEnd;
                        verticesUint32View[index++] = alpha;
                        // 顶点2
                        vertices[index++] = a * w + c * h + tx;
                        vertices[index++] = d * h + b * w + ty;
                        vertices[index++] = sourceX;
                        vertices[index++] = vEnd;
                        verticesUint32View[index++] = alpha;
                        // 顶点3
                        vertices[index++] = c * h + tx;
                        vertices[index++] = d * h + ty;
                        vertices[index++] = sourceX;
                        vertices[index++] = vStart;
                        verticesUint32View[index++] = alpha;
                    }
                    else {
                        // 顶点0
                        vertices[index++] = tx;
                        vertices[index++] = ty;
                        vertices[index++] = sourceX;
                        vertices[index++] = vStart;
                        verticesUint32View[index++] = alpha;
                        // 顶点1
                        vertices[index++] = a * w + tx;
                        vertices[index++] = b * w + ty;
                        vertices[index++] = normalizedSourceWidth + sourceX;
                        vertices[index++] = vStart;
                        verticesUint32View[index++] = alpha;
                        // 顶点2
                        vertices[index++] = a * w + c * h + tx;
                        vertices[index++] = d * h + b * w + ty;
                        vertices[index++] = normalizedSourceWidth + sourceX;
                        vertices[index++] = vEnd;
                        verticesUint32View[index++] = alpha;
                        // 顶点3
                        vertices[index++] = c * h + tx;
                        vertices[index++] = d * h + ty;
                        vertices[index++] = sourceX;
                        vertices[index++] = vEnd;
                        verticesUint32View[index++] = alpha;
                    }
                    // 缓存索引数组
                    if (this.hasMesh) {
                        var indicesForMesh = this.indicesForMesh;
                        indicesForMesh[this.indexIndex + 0] = 0 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 1] = 1 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 2] = 2 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 3] = 0 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 4] = 2 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 5] = 3 + this.vertexIndex;
                    }
                    this.vertexIndex += 4;
                    this.indexIndex += 6;
                }
            };
            WebGPUVertexArrayObject.prototype.clear = function () {
                this.hasMesh = false;
                this.vertexIndex = 0;
                this.indexIndex = 0;
            };
            return WebGPUVertexArrayObject;
        }());
        web.WebGPUVertexArrayObject = WebGPUVertexArrayObject;
        __reflect(WebGPUVertexArrayObject.prototype, "egret.web.WebGPUVertexArrayObject");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
