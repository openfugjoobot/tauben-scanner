export default {
  call: () => {},
  default: {
    call: () => {},
  },
  createAnimatedComponent: (Component) => Component,
  useAnimatedStyle: () => ({}),
  useSharedValue: (value) => ({ value }),
  useDerivedValue: (fn) => fn(),
  withSpring: (value) => value,
  withTiming: (value) => value,
  withDelay: (_, value) => value,
  withSequence: (...values) => values[0],
  withRepeat: (value) => value,
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