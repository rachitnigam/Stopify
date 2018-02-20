/**
 * Runtime system for Node
 */
import { RuntimeOpts } from '../types';
import { Runtime } from 'stopify-continuations/dist/src/runtime/abstractRuntime';
import { RuntimeWithSuspend } from './suspend';
import { makeEstimator } from './elapsedTimeEstimator';
import { parseRuntimeOpts } from '../parse-runtime-opts';

let continuationsRTS: Runtime | undefined;

export function init(
  rts: Runtime,
  opts: RuntimeOpts = parseRuntimeOpts(process.argv.slice(2))) {

  continuationsRTS = rts;
  const suspendRTS = new RuntimeWithSuspend(continuationsRTS,
    opts.yieldInterval,
    makeEstimator(opts));

    if (typeof opts.stop !== 'undefined') {
      setTimeout(function() {
        suspendRTS.onYield = () => false;
      }, opts.stop * 1000);
    }
  return suspendRTS;
}