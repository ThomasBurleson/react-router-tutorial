import { useEffect, useState } from 'react';

import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

export type EmitFn<T = unknown, K = unknown> = (value: T) => K;

export function useDebounceCallback<T>(
  fn: EmitFn<T>,
  initialValue?: T,
  delay = 350
): EmitFn<T> {
  const [emitter] = useState(
    () => new BehaviorSubject<T | undefined>(initialValue)
  );

  useEffect(() => {
    const isDefined = (value: T | undefined): value is T =>
      value !== undefined && value !== null;
    const subscription = emitter
      .pipe(filter(isDefined), debounceTime(delay), distinctUntilChanged())
      .subscribe(fn);

    return () => subscription.unsubscribe();
  }, [emitter, fn, delay]);

  return emitter.next.bind(emitter);
}
