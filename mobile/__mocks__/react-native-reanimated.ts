export default {
  call: () => {},
  default: {
    call: () => {},
  },
  createAnimatedComponent: (Component: any) => Component,
  useAnimatedStyle: () => ({}),
  useSharedValue: (value: any) => ({ value }),
  useDerivedValue: (fn: any) => fn(),
  withSpring: (value: any) => value,
  withTiming: (value: any) => value,
  withDelay: (_: any, value: any) => value,
  withSequence: (...values: any[]) => values[0],
  withRepeat: (value: any) => value,
  Easing: {
    linear: () => ({}),
    ease: () => ({}),
    bezier: () => ({}),
  },
  FadeIn: {},
  FadeOut: {},
  SlideInRight: {},
  SlideOutRight: {},
};
