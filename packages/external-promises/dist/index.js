"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseWithExternalResolve = void 0;
class PromiseWithExternalResolve {
    constructor(callback) {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            if (callback) {
                callback(this.resolve, this.reject);
            }
        });
    }
    then(onfulfilled, onrejected) {
        return this.promise.then(onfulfilled, onrejected);
    }
    catch(onrejected) {
        return this.promise.catch(onrejected);
    }
    finally(onfinally) {
        return this.promise.finally(onfinally);
    }
}
exports.PromiseWithExternalResolve = PromiseWithExternalResolve;
