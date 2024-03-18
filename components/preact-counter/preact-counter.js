import { signal } from "@preact/signals";
import register from "preact-custom-element";

export function App() {
  const count = signal(0);

  return (
    <>
      <button onClick={() => (count.value += 1)}>count is {count}</button>
    </>
  );
}

register(App, "preact-app", [], { shadow: false });
