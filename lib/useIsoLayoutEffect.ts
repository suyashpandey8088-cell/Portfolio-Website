'use client';

import { useEffect, useLayoutEffect } from 'react';

/** useLayoutEffect that degrades to useEffect during SSR. */
export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
