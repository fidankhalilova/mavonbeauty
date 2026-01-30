// utils/events.ts
export const AuthEvents = {
  USER_CHANGED: "user-changed",
  LOGIN: "user-login",
  LOGOUT: "user-logout",
  CART_UPDATED: "cart-updated",
} as const;

export const emitAuthEvent = (eventName: string, data?: any): void => {
  if (typeof window !== "undefined") {
    if (data) {
      const customEvent = new CustomEvent(eventName, { detail: data });
      window.dispatchEvent(customEvent);
    } else {
      window.dispatchEvent(new Event(eventName));
    }
  }
};

export const subscribeToAuthEvent = (
  eventName: string,
  callback: (data?: any) => void,
): (() => void) => {
  if (typeof window !== "undefined") {
    const handler = (e: Event) => {
      if ("detail" in e) {
        callback((e as CustomEvent).detail);
      } else {
        callback();
      }
    };
    window.addEventListener(eventName, handler);
    return () => window.removeEventListener(eventName, handler);
  }
  return () => {};
};
