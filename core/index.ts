import waterFall from "./waterFall.vue";
import type { App, Component } from "vue";

type EventShim = {
  new (...args: any[]): {
    $props: {
      onClick?: (...args: any[]) => void;
    };
  };
};

type WithInstall<T> = T & {
  install(app: App): void;
} & EventShim;

type CustomComponent = Component & { displayName?: string };

const withInstall = <T extends CustomComponent>(
  component: T,
  alias?: string
) => {
  (component as Record<string, unknown>).install = (app: App) => {
    const compName = component.name || component.displayName;
    if (!compName) return;
    app.component(compName, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component as WithInstall<T>;
};
export default  withInstall(waterFall);
